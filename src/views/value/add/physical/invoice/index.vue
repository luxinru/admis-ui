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
        <el-button  icon="Refresh"  @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="block-divider" v-if="showSearch"></div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-radio-group v-show="(queryParams.invoiceStatus === '07' || queryParams.invoiceStatus === '09')" v-model="queryParams.invoiceStatus">
          <el-radio v-for="dict in sevenInvoiceStatusOptions" :key="dict.codeProperty" :label="dict.codeProperty"
            @change="changeInvoiceStatus(dict.codeProperty)">{{ dict.codeName }}</el-radio>
        </el-radio-group>
        <el-radio-group v-show="(queryParams.invoiceStatus === '17' || queryParams.invoiceStatus === '18')" v-model="queryParams.invoiceStatus">
          <el-radio v-for="dict in seventeenInvoiceStatusOptions" :key="dict.codeProperty" :label="dict.codeProperty"
                    @change="changeInvoiceStatus(dict.codeProperty)">{{ dict.codeName }}</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="1.5" v-show="(queryParams.invoiceStatus === '07' || queryParams.invoiceStatus === '17')">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
                   v-hasPermi="['invoice:physical:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5" v-show="(queryParams.invoiceStatus === '07' || queryParams.invoiceStatus === '17')">
        <el-button type="success" plain icon="Finished" :disabled="commitFlag" @click="handleCommit"
          v-hasPermi="['invoice:physical:submit']">提交</el-button>
      </el-col>
      <el-col :span="1.5" v-show="(queryParams.invoiceStatus === '09' || queryParams.invoiceStatus === '18')">
        <el-button type="danger" plain icon="RefreshLeft" :disabled="rollbackFlag" @click="handleRollback"
          v-hasPermi="['invoice:physical:submit']">取回</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="physicalList" @selection-change="handleSelectionChange"  :height="height" :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单据编号" align="center" prop="invoiceNumber" width="210"/>
      <el-table-column label="单据状态" align="center" prop="invoiceStatus" width="210" :formatter="invoiceStatusFormat"/>
      <el-table-column label="项目编号" align="center" prop="projectCode" width="210"/>
      <el-table-column label="项目名称" align="center" prop="projectName" width="210"/>
      <el-table-column label="数量合计" align="center" prop="detailAmount" />
      <el-table-column label="备注" align="center" prop="remark" width="210"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="210">
        <template #default="scope">
          <el-button type="text" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['invoice:physical:edit']">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <el-dialog :title="title" v-model="open" width="400px" append-to-body>
      <el-form ref="addRef" :model="form" :rules="rules" label-width="200px">
        <el-form-item label="请选择是否为零购设备转资？" prop="version">
          <el-radio-group v-model="retailEquipment">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 退回弹窗 -->
    <submit-page ref="rollbackCard" @handleAudit="handleApprovalData"/>

  </div>
</template>

<script setup name="PhysicalInvoice">
import { listInvoice, commitPhysicalInvoice, rollbackInvoice } from "@/api/value/add/physical/invoice/invoice";
import submitPage from "@/views/value/add/physical/components/invoice/submit/index";
import { ElMessage } from 'element-plus'
// 定义router，用于获取通过路由传递的参数
import { useRoute } from 'vue-router';
// 获取通过路由传递的参数变量
const route = useRoute();
// 退回弹窗ref
const rollbackCard = ref();

const { proxy } = getCurrentInstance();

const physicalList = ref([]);
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
const sevenInvoiceStatusOptions = ref([{ codeProperty: '07', codeName: '未提交' }, { codeProperty: '09', codeName: '已提交' }]);
const seventeenInvoiceStatusOptions = ref([{ codeProperty: '17', codeName: '未提交' }, { codeProperty: '18', codeName: '已提交' }]);
// 新增单据是否为零购设备
const retailEquipment = ref('');

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    invoiceNumber: null,
    invoiceStatus: route.query.invoiceStatus,
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
  if(status == "06") {
    return "实物信息维护退回"
  } else if (status == "07") {
    return "实物信息维护";
  } else if (status == "09") {
    return "造价维护";
  } else if (status == "16") {
    return "实物信息维护退回"
  } else if (status == "17") {
    return "实物信息维护";
  } else if (status == "18") {
    return "财务信息维护退回";
  }
}

/** 查询转资前单据表列表 */
function getList() {
  loading.value = true;
  listInvoice(queryParams.value).then(response => {
    physicalList.value = response.rows;
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
    path: "/value/add/physical/detail",
    query: {
      invoiceNumber: invoiceNumber
    },
  });
}

/**
 * 提交
 */
function handleCommit() {
  if(invoiceStatusArr.value[0] == '07'){
    const obj = {
      invoiceNumberArr:invoiceNumbers.value,
      invoiceStatus:'09'
    };
    commitPhysicalInvoice(obj).then(response => {
      proxy.$modal.msgSuccess("提交成功");
      getList();
    });
  }
  if(invoiceStatusArr.value[0] == '17'){
    const obj = {
      invoiceNumberArr:invoiceNumbers.value,
      invoiceStatus:'18'
    };
    commitPhysicalInvoice(obj).then(response => {
      proxy.$modal.msgSuccess("提交成功");
      getList();
    });
  }
}

/**
 * 退回按钮触发事件-弹出意见输入框
 */
function handleRollback() {
  rollbackCard.value.show("退回");
}
// 退回按钮弹窗回调事件
function handleApprovalData(reason) {

  if(invoiceStatusArr.value[0] == '18'){
    const obj = {
      invoiceNumberArr:invoiceNumbers.value,
      returnAuditOpinion:reason,
      invoiceStatus:'17'
    }
    rollbackInvoice(obj).then(response => {
      proxy.$modal.msgSuccess("退回成功");
      getList();
    });
  }
  if(invoiceStatusArr.value[0] == '09'){
    const obj = {
      invoiceNumberArr:invoiceNumbers.value,
      returnAuditOpinion:reason,
      invoiceStatus:'07'
    }
    rollbackInvoice(obj).then(response => {
      proxy.$modal.msgSuccess("退回成功");
      getList();
    });
  }
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
