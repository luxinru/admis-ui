<template>
  <div class="app-main-content">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单据编号" prop="invoiceNumber">
        <el-input v-model="queryParams.invoiceNumber" @keyup.enter="handleQuery" style="width: 220px" clearable
                  placeholder="请输入单据编号" maxlength="30" />
      </el-form-item>
      <el-form-item label="项目编号" prop="projectCode">
        <el-input v-model="queryParams.projectCode" @keyup.enter="handleQuery" style="width: 220px" clearable
                  placeholder="请输入项目编号" maxlength="30" />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="queryParams.projectName" @keyup.enter="handleQuery" style="width: 220px" clearable
                  placeholder="请输入项目名称" maxlength="40" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="block-divider" v-if="showSearch"></div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-radio-group v-model="invoiceStatusRadio">
          <el-radio v-for="dict in sevenInvoiceStatusOptions" :key="dict.codeProperty" :label="dict.codeProperty"
                    @change="changeInvoiceStatus(dict.codeProperty)">{{ dict.codeName }}</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="1.5" v-show="(invoiceStatusRadio === '18' || invoiceStatusRadio === '19')">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
                   v-hasPermi="['invoice:financial:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5" v-show="(invoiceStatusRadio === '18' || invoiceStatusRadio === '19')">
        <el-button type="success" plain icon="Finished" :disabled="commitFlag" @click="handleSendApply"
                   v-hasPermi="['invoice:financial:submit']">送审</el-button>
      </el-col>
      <el-col :span="1.5" v-show="(invoiceStatusRadio === '21')">
        <el-button type="danger" plain icon="RefreshLeft" :disabled="rollbackFlag" @click="handleRollback"
                   v-hasPermi="['invoice:financial:submit']">取回</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="financialList" @selection-change="handleSelectionChange" :height="height" :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单据编号" align="center" prop="invoiceNumber" width="210"/>
      <el-table-column label="单据状态" align="center" prop="invoiceStatus" width="210" :formatter="invoiceStatusFormat"/>
      <el-table-column label="项目编号" align="center" prop="projectCode" width="210"/>
      <el-table-column label="项目名称" align="center" prop="projectName" width="210"/>
      <el-table-column label="数量合计" align="center" prop="detailAmount" />
      <el-table-column label="备注" align="center" prop="remark" width="160" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="210">
        <template #default="scope">
          <el-button type="text" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['invoice:financial:edit']">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 退回弹窗 -->
    <rollback-page ref="rollbackCard" @handleAudit="handleApprovalData"/>

  </div>
</template>

<script setup name="FinancialInvoice">
  import { Base64 } from "js-base64"
  import { listInvoice, commitFinancialInvoice, rollbackInvoice } from "@/api/value/add/financial/invoice/invoice";
  import rollbackPage from "@/views/value/add/financial/components/invoice/rollback/index";
  import { ElMessage } from 'element-plus'
  // 定义router，用于获取通过路由传递的参数
  import { useRoute } from 'vue-router';
  // 获取通过路由传递的参数变量
  const route = useRoute();
  // 退回弹窗ref
  const rollbackCard = ref();
  // 已送审未送审单据状态切换
  let invoiceStatusRadio = ref('19');

  const { proxy } = getCurrentInstance();

  const financialList = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const invoiceNumbers = ref([]);
  const invoiceStatusArr = ref([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const title = ref("");
  const height = ref(408);
  // 提交按键操作开关
  const commitFlag = ref(true);
  // 回退按键操作开关
  const rollbackFlag = ref(true);

  // 单据状态
  const sevenInvoiceStatusOptions = ref([{ codeProperty: '19', codeName: '未送审' }, { codeProperty: '21', codeName: '已送审' }]);
  // 新增单据是否为零购设备
  const retailEquipment = ref('');

  const data = reactive({
    form: {},
    queryParams: {
      pageNum: 1,
      pageSize: 10,
      invoiceNumber: null,
      invoiceStatus: Base64.encode(" and invoice_status in ('18','19')"),
      projectCode: null,
      projectName: null
    },
    rules: {
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 单据状态：01新建02被退回 */
  function invoiceStatusFormat(row, column) {
    let status = row.invoiceStatus;
    if(status == "18") {
      return "财务信息维护退回"
    } else if (status == "19") {
      return "财务信息维护";
    } else if (status == "21") {
      return "审批中";
    }
  }

  /** 查询转资前单据表列表 */
  function getList() {
    loading.value = true;
    listInvoice(queryParams.value).then(response => {
      financialList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  }

  // 取消按钮
  function cancel() {
    open.value = false;
    reset();
  }

  // 表单重置
  function reset() {
    retailEquipment.value = '';
    proxy.resetForm("addRef");
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
  }

  /** 重置按钮操作 */
  function resetQuery() {
    proxy.resetForm("queryRef");
    handleQuery();
  }

  // 多选框选中数据
  function handleSelectionChange(selection) {
    invoiceNumbers.value = selection.map(item => item.invoiceNumber);
    invoiceStatusArr.value = selection.map(item => item.invoiceStatus);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
    commitFlag.value = !selection.length;
    rollbackFlag.value = !selection.length;
  }

  // 切换页面显示单据状态
  function changeInvoiceStatus(invoiceStatus) {
    queryParams.value.pageNum = 1;
    if(invoiceStatus == '19'){
      queryParams.value.invoiceStatus = Base64.encode(" and invoice_status in ('18','19')");
    }else{
      queryParams.value.invoiceStatus = Base64.encode(" and invoice_status in ('21')");
    }
    invoiceStatusRadio.value = invoiceStatus;
    getList();
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "提示";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const invoiceNumber = row.invoiceNumber || invoiceNumbers.value[0];
    router.push({
      path: "/value/add/financial/detail",
      query: {
        invoiceNumber: invoiceNumber
      },
    });
  }

  /**
   * 送审
   */
  function handleSendApply() {
    const obj = {
      invoiceNumberArr:invoiceNumbers.value,
      invoiceStatus:'21'
    };
    commitFinancialInvoice(obj).then(response => {
      proxy.$modal.msgSuccess("送审成功");
      getList();
    });
  }

  /**
   * 退回按钮触发事件-弹出意见输入框
   */
  function handleRollback() {
    rollbackCard.value.show("退回");
  }
  // 退回按钮弹窗回调事件
  function handleApprovalData(reason) {
    const obj = {
      invoiceNumberArr:invoiceNumbers.value,
      returnAuditOpinion:reason,
      invoiceStatus:'18'
    }
    rollbackInvoice(obj).then(response => {
      proxy.$modal.msgSuccess("退回成功");
      getList();
    });
  }

  /** 表单提交按钮 */
  const router = useRouter();
  function submitForm() {
    if (retailEquipment.value === '') {
      ElMessage('请选择是否为零购设备转资!')
      return;
    }
    router.push({
      path: "/value/add/entry/detail",
      query: {
        retailEquipment: retailEquipment,
        invoiceNumber: ""
      },
    });
    retailEquipment.value = '';
  }

  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('invoice/add/export', {
      ...queryParams.value
    }, `add_${new Date().getTime()}.xlsx`)
  }
  function tableRowClassName({ rowIndex }){
    if (rowIndex % 2 == 0) {
      return '';
    } else {
      return 'row-even-bg';
    }
  }
  getList();
</script>
