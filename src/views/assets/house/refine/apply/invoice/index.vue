<template>
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
      <el-form-item label="单据状态" prop="invoiceStatus">
        <el-select v-model="queryParams.invoiceStatus" @keyup.enter="handleQuery" style="width: 240px" clearable placeholder="请选择单据状态" >
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
      <el-radio-group v-model="radioValue" @change="radioCheck">
        <el-radio :label="1">未送审</el-radio>
        <el-radio :label="2">已送审</el-radio>
      </el-radio-group>

      <el-col :span="1.5" v-show="radioValue == 1">
        <el-button
            type="primary"
            plain
            icon="Plus"
            :disabled="sendButtonShow"
            @click="handleAddInvoice"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5" v-show="radioValue == 1">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="sendButtonShow?sendButtonShow:single"
            @click="handleUpdateInvoice"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5" v-show="radioValue == 1">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="sendButtonShow?sendButtonShow:multiple"
            @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5" v-show="radioValue == 1">
        <el-button type="primary" plain icon="View"  :disabled="single"
                   @click="handleDetail">明细</el-button>
      </el-col>
      <el-col :span="1.5" v-show="radioValue == 1">
        <el-button
            type="primary"
            plain
            icon="Position"
            :disabled="sendButtonShow?sendButtonShow:submitData"
            @click="sendAudit"
        >送审</el-button>
      </el-col>
      <el-col :span="1.5" v-show="radioValue == 2">
        <el-button
            type="primary"
            plain
            icon="Position"
            :disabled="cancelButtonShow"
            @click="cancelSend"
        >取回</el-button>
      </el-col>

      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange" :height="height" :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单据编号" align="center" prop="invoiceNumber" width="220" :show-overflow-tooltip="true">
        <template v-if="sendButtonShow" #default="scope">
          <router-link :to="{ path:'/refine/apply/detailshow',
                              query:{
                                invoiceNumber:scope.row.invoiceNumber
                              }
                        }"  class="link-type">
            <span>{{ scope.row.invoiceNumber }}</span>
          </router-link>
        </template>
        <template v-else #default="scope">
          <router-link :to="{ path:'/refine/apply/detail',
                              query:{
                                invoiceNumber:scope.row.invoiceNumber
                              }
                        }"  class="link-type">
            <span>{{ scope.row.invoiceNumber }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="单据状态" align="center" prop="invoiceStatus" :formatter="invoiceStatusFormat" />
      <el-table-column label="否决意见" align="center" prop="returnAuditOpinion" />
      <el-table-column label="数量合计" align="center" prop="detailAmount" />
      <el-table-column label="原值合计" align="center" prop="originalValueSum" />
      <el-table-column label="净值合计" align="center" prop="nowValueSum" />
      <el-table-column label="累计折旧合计" align="center" prop="addDepreciateSum" width="180"/>
      <el-table-column label="减值准备合计" align="center" prop="devalueValueSum" width="180"/>
      <el-table-column label="制单日期" align="center" prop="invoiceDate" width="180"/>
      <el-table-column label="制单单位" align="center" prop="departCode" />
      <el-table-column label="制单人" align="center" prop="userName" />
      <el-table-column label="项目编号" align="center" prop="projectCode" width="160"/>
      <el-table-column label="项目名称" align="center" prop="projectName" width="160" :show-overflow-tooltip="true"/>
      <el-table-column label="备注" align="center" prop="remark" width="160" :show-overflow-tooltip="true" />
    </el-table>
    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList" />
  </div>
</template>

<script setup>
import { listHouseRefineInvoice, delHouseRefineInvoice, checkSendAuditDetail, sendInvoice, cancelSendData } from "@/api/assets/house/refine/invoice";
import { Base64 } from "js-base64"
// 按钮显隐控制
const sendButtonShow = ref(false);
const cancelButtonShow = ref(true);
const ids = ref([]);
// 单据状态
const invoiceStatusOptions = ref([{codeProperty1: '01', codeName1: '新建'}, {codeProperty1: '02', codeName1: '被退回'}]);
//高度
const height = ref(408);
// 送审按钮
const submitData = ref(true);
function tableRowClassName({ rowIndex }){
  if (rowIndex % 2 == 0) {
    return '';
  } else {
    return 'row-even-bg';
  }
}
// 送审按钮触发事件
function sendAudit() {
  checkSendAuditDetail(selectInvoiceNumber.value).then(response => {
    if(response.msg != ""){
      proxy.$modal.msgError(response.msg);
    }else{
      const selectInvoiceNumbers = selectInvoiceNumber.value;
      proxy.$modal.confirm('是否确认送审选中的数据项?', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return sendInvoice(selectInvoiceNumbers);
      }).then(() => {
        getList();
        proxy.$modal.msgSuccess("送审成功");
      })
    }
  });
}
// 退回
function cancelSend() {
  const selectInvoiceNumbers = selectInvoiceNumber.value;
  const obj = {
    selectInvoiceNumbers: selectInvoiceNumbers
  };
  proxy.$modal.confirm('是否确认退回选中的数据项?', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function() {
    return cancelSendData(obj);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("退回成功");
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
    dataFilter: Base64.encode(" and invoice_status in ('01','02')")
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
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  selectInvoiceNumber.value = selection.map(item => item.invoiceNumber);
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
  submitData.value = !selection.length;
  if(sendButtonShow.value){
    cancelButtonShow.value = !selection.length;
  }
}
// 表单参数
const router = useRouter();
/** 新增跳转明细 */
function handleAddInvoice() {
  router.push({
    path: "/refine/apply/detail",
    query: {
      invoiceNumber: ""
    },
  });
}
/** 修改跳转明细 */
function handleUpdateInvoice() {
  router.push({
    path: "/refine/apply/detail",
    query: {
      invoiceNumber: selectInvoiceNumber.value[0]
    },
  });
}
/** 弹出明细菜单 */
function handleDetail() {
  if(sendButtonShow.value){
    router.push({
      path: "/refine/apply/detailshow",
      query: {
        invoiceNumber: selectInvoiceNumber.value[0]
      },
    });
  }else{
    router.push({
      path: "/refine/apply/detail",
      query: {
        invoiceNumber: selectInvoiceNumber.value[0]
      },
    });
  }
}

// 未送审、已送审单选框
const radioValue = ref(1);
function radioCheck(value) {
  radioValue.value = value;
  if(value == 1){
    sendButtonShow.value = false;
    cancelButtonShow.value = true;
    queryParams.value.dataFilter = Base64.encode(" and invoice_status in ('01','02')");
    getList();
  }else{
    sendButtonShow.value = true;
    // cancelButtonShow.value = false;
    queryParams.value.dataFilter = Base64.encode(" and invoice_status in ('03')");
    getList();
  }
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

/** 删除房屋单据按钮操作 */
function handleDelete(row) {
  const selectInvoiceNumbers = row.invoiceNumber || selectInvoiceNumber.value;
  proxy.$modal.confirm('是否确认删除选中的数据项？').then(function() {
    return delHouseRefineInvoice(selectInvoiceNumbers);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
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
