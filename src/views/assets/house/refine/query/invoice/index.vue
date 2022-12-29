<template>
  <div>
    <div class="app-main-content">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="单据编号" prop="invoiceNumber">
          <el-input
              v-model="queryParams.invoiceNumber"
              placeholder="请输入单据编号"
              clearable
              @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="所属单位" prop="departName">
          <el-input v-model="queryParams.departName" :title="queryParams.departName" readonly placeholder="请选择所属单位" maxlength="100">
            <template #append>
              <el-button icon="Search" @click="openDepartCard()"/>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="日期" prop="invoiceDate">
          <el-date-picker v-model="queryParams.invoiceDate" value-format="YYYY-MM" type="month" placeholder="选择月"/>
        </el-form-item>
        <el-form-item label="单据状态" prop="invoiceStatus">
          <el-select v-model="queryParams.invoiceStatus" @keyup.enter="handleQuery" clearable placeholder="请选择单据状态" >
            <el-option v-for="dict in invoiceStatusOptions" :key="dict.codeProperty1" :label="dict.codeName1"
                       :value="dict.codeProperty1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="block-divider" v-if="showSearch"></div>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="View"  :disabled="single"
                     @click="handleDetail">明细</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              plain
              icon="Position"
              :disabled="revocationData"
              @click="revocation"
          >撤销</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange" :height="height" :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="单据编号" align="center" prop="invoiceNumber" width="220" :show-overflow-tooltip="true">
          <template #default="scope">
            <router-link :to="{ path:'/refine/query/detailsearch',
                                query:{
                                  invoiceNumber:scope.row.invoiceNumber,
                                  invoiceStatus:scope.row.invoiceStatus
                                }
                          }"  class="link-type">
              <span>{{ scope.row.invoiceNumber }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="单据状态" align="center" prop="invoiceStatus" :formatter="invoiceStatusFormat" />
        <el-table-column label="否决意见" align="center" prop="returnAuditOpinion" />
        <el-table-column label="审批意见" align="center" prop="auditOpinion" width="210"/>
        <el-table-column label="数量合计" align="center" prop="detailAmount" />
        <el-table-column label="原值合计" align="center" prop="originalValueSum" />
        <el-table-column label="净值合计" align="center" prop="nowValueSum" />
        <el-table-column label="累计折旧合计" align="center" prop="addDepreciateSum" width="180"/>
        <el-table-column label="减值准备合计" align="center" prop="devalueValueSum" width="180"/>
        <el-table-column label="制单日期" align="center" prop="invoiceDate" width="180" />
        <el-table-column label="制单单位" align="center" prop="departCode" />
        <el-table-column label="制单人" align="center" prop="userName" />
        <el-table-column label="备注" align="center" prop="remark" width="160" :show-overflow-tooltip="true" />
      </el-table>
      <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList" />
    </div>
    <!-- 调用所属单位-->
    <depart-code ref="refDepartCard" @handleDepartCard="handleDepartCard"/>
  </div>
</template>

<script setup>
import { listHouseRefineInvoice, revocationInvoiceData } from "@/api/assets/house/refine/invoice";
import { Base64 } from "js-base64"
import departCode from "@/views/system/card/depart/index";
const ids = ref([]);
// 选中的数据集合
const selectionData = ref([]);
// 单据状态
const invoiceStatusOptions = ref([{codeProperty1: '01', codeName1: '新建'}, {codeProperty1: '02', codeName1: '被退回'}, {codeProperty1: '03', codeName1: '审批中'}, {codeProperty1: '04', codeName1: '审批完成'}]);
//高度
const height = ref(408);
// 撤销按钮
const revocationData = ref(true);
// 所属单位弹窗
const refDepartCard = ref();
function tableRowClassName({ rowIndex }){
  if (rowIndex % 2 == 0) {
    return '';
  } else {
    return 'row-even-bg';
  }
}
// 撤销按钮触发事件
function revocation() {
  for (let i = 0; i < selectionData.value.length; i++) {
    const invoiceStatusTemp = selectionData.value[i].invoiceStatus;
    if(invoiceStatusTemp != '04'){
      proxy.$modal.msgSuccess("选择数据中存在未审批完成状态，无法撤销");
      return;
    }
  }

  const selectInvoiceNumbers = selectInvoiceNumber.value;
  const objRevocationData = {
    selectInvoiceNumbers: selectInvoiceNumbers
  };
  proxy.$modal.confirm('是否确认撤销选中的数据项?', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function() {
    return revocationInvoiceData(objRevocationData);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("撤销成功");
  })
}

const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict("sys_normal_disable");

const postList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    invoiceNumber: undefined,
    invoiceStatus: null,
    departName: null,
    departCode: null,
    invoiceDate: null,
    dataFilter: Base64.encode(" and invoice_status in ('01','02','03','04')")
  },
  rules: {
    postName: [{ required: true, message: "退回原因不能为空", trigger: "blur" }],
    postCode: [{ required: true, message: "单据状态不能为空", trigger: "blur" }],
    postSort: [{ required: true, message: "岗位顺序不能为空", trigger: "blur" }],
  }
});

const { queryParams, form, rules } = toRefs(data);
// 选中数据的单据编号
const selectInvoiceNumber = ref([]);
const invoiceStatus = ref([]);
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  // 选中的数据集合
  selectionData.value = selection;
  selectInvoiceNumber.value = selection.map(item => item.invoiceNumber);
  invoiceStatus.value = selection.map(item => item.invoiceStatus);
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
  revocationData.value = !selection.length;
}
// 表单参数
const router = useRouter();
/** 弹出明细菜单 */
function handleDetail() {
  router.push({
    path: "/refine/query/detailsearch",
    query: {
      invoiceNumber: selectInvoiceNumber.value[0],
      invoiceStatus: invoiceStatus.value[0]
    },
  });
}
/** 打开所属单位字典*/
function openDepartCard(){
  refDepartCard.value.openCard("所属单位");
}
/** 获取所属单位字典的数据*/
function handleDepartCard(row){
  queryParams.value.departName = row.departName;
  queryParams.value.departCode = row.departCode;
}
/** 查询房屋单据列表 */
function getList() {
  loading.value = true;
  listHouseRefineInvoice(queryParams.value).then(response => {
    postList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 单据状态：01新建02被退回 */
function invoiceStatusFormat(row, column) {
  let status = row.invoiceStatus;
  if(status == "01"){
    return "新建";
  } else if(status == "02"){
    return "被退回";
  } else if(status == "03"){
    return "审批中";
  } else if(status == "04"){
    return "审批完成";
  }
}



/** 单据取消按钮 */
function handleCancelInvoice() {
  formOpen.value = false;
  reset();
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    postId: undefined,
    postCode: undefined,
    postName: undefined,
    postSort: 0,
    status: "0",
    remark: undefined
  };
  proxy.resetForm("postRef");
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  queryParams.value = {
    invoiceNumber: undefined,
    invoiceStatus: null,
    departName: null,
    departCode: null,
    invoiceDate: null,
    dataFilter: Base64.encode(" and invoice_status in ('01','02','03','04')")
  };
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加岗位";
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const postId = row.postId || ids.value;
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/post/export", {
    ...queryParams.value
  }, `post_${new Date().getTime()}.xlsx`);
}
getList();

</script>
