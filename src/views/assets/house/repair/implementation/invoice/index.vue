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
              type="primary"
              plain
              icon="Position"
              :disabled="submitData"
              @click="preserveFinishFun"
          >维护完成</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="Back"
              :disabled="submitData"
              @click="goBack"
          >退回</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="Edit"
              :disabled="editAssetsButton"
              @click="editDataInfo"
          >编辑</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange" :height="height" :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="单据编号" align="center" prop="invoiceNumber" width="220" :show-overflow-tooltip="true">
          <template #default="scope">
            <router-link :to="{ path:'/repair/implementation/detailImplementation',
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
        <el-table-column label="开工时间" align="center" prop="startDate" width="180"/>
        <el-table-column label="工程进度" align="center" prop="projectProgress" />
        <el-table-column label="完工时间" align="center" prop="endDate" width="180"/>
        <el-table-column label="结算金额" align="center" prop="settleMoney" width="180"/>
        <el-table-column label="合同编号" align="center" prop="contractCode" width="180"/>
        <el-table-column label="合同名称" align="center" prop="contractName" width="180"/>
        <el-table-column label="合同金额" align="center" prop="contractMoney" width="180"/>
        <el-table-column label="项目编号" align="center" prop="projectCode" width="180"/>
        <el-table-column label="项目名称" align="center" prop="projectName" width="180"/>
        <el-table-column label="实施维护人" align="center" prop="implementUser" width="180"/>
        <el-table-column label="实施维护日期" align="center" prop="implementDate" width="180"/>
        <el-table-column label="实施维护意见" align="center" prop="implementOpinion" width="180"/>
        <el-table-column label="制单日期" align="center" prop="invoiceDate" width="180"/>
        <el-table-column label="制单单位" align="center" prop="departCode" />
        <el-table-column label="制单人" align="center" prop="userName" />
        <el-table-column label="备注" align="center" prop="remark" width="160" :show-overflow-tooltip="true"/>
      </el-table>
      <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList" />
    </div>
    <!-- 审批卡片弹窗 -->
    <audit-page ref="auditCard" @handleAudit="handleApprovalData"/>

    <!-- 编辑卡片 -->
    <card-data ref="cardDataForm" @handleEdit="handleEditData"/>
  </div>
</template>

<script setup>
import { goBackData, preserveFinishData, updateDataByInvoiceNumber,
  listHouseRefineInvoice, approvalInvoiceAgree, approvalInvoiceUnAgree } from "@/api/assets/house/repair/invoice";
import auditPage from "@/views/assets/house/repair/components/audit/index";
import CardData from "@/views/assets/house/repair/components/implementation/index";
import { Base64 } from "js-base64"
// 编辑卡片
const cardDataForm = ref();
const ids = ref([]);
// 审批弹窗
const auditCard = ref();
//高度
const height = ref(408);
// 维护完成及退回按钮显隐控制
const submitData = ref(true);
// 编辑按钮显隐控制
const editAssetsButton = ref(true);
const selectRow = ref([]);

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
    dataFilter: Base64.encode(" and invoice_status in ('05')")
  }
});

const { queryParams, form } = toRefs(data);
// 选中数据的单据编号
const selectInvoiceNumber = ref([]);
function tableRowClassName({ rowIndex }){
  if (rowIndex % 2 == 0) {
    return '';
  } else {
    return 'row-even-bg';
  }
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  selectInvoiceNumber.value = selection.map(item => item.invoiceNumber);
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
  submitData.value = !selection.length;
  editAssetsButton.value = selection.length != 1;
  selectRow.value = selection;
}
// 表单参数
const router = useRouter();
/** 弹出明细菜单 */
function handleDetail() {
  router.push({
    path: "/repair/implementation/detailImplementation",
    query: {
      invoiceNumber: selectInvoiceNumber.value[0]
    },
  });
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

/** 单据状态：01：新建；02：被退回；03：审批中；04：实施退回；05：实施中；06：实施完成 */
function invoiceStatusFormat(row, column) {
  let status = row.invoiceStatus;
  if(status == "01"){
    return "新建";
  } else if(status == "02"){
    return "被退回";
  } else if(status == "03"){
    return "审批中";
  } else if(status == "04"){
    return "实施退回";
  } else if (status == "05"){
    return "实施中";
  } else if (status == "05"){
    return "实施完成";
  }
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

// 维护完成触发事件
function preserveFinishFun() {
  const selectInvoiceNumbers = selectInvoiceNumber.value;
  const obj = {
    selectInvoiceNumbers: selectInvoiceNumbers,
    invoiceStatus: '06'
  };
  proxy.$modal.confirm('是否确认将选中的数据项维护完成?', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function() {
    return preserveFinishData(obj);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("维护完成");
  })
}

// 退回按钮
function goBack() {
  const selectInvoiceNumbers = selectInvoiceNumber.value;
  const obj = {
    selectInvoiceNumbers: selectInvoiceNumbers,
    invoiceStatus: '04'
  };
  proxy.$modal.confirm('是否确认退回选中的数据项?', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function() {
    return goBackData(obj);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("退回成功");
  })
}

// 编辑按钮触发事件
function editDataInfo() {
  cardDataForm.value.editOpen(selectRow.value[0], "编辑");
}

// 编辑按钮，保存回调函数
function handleEditData(dataForm) {
    const childrenFormData = dataForm.value;
    proxy.$modal.confirm('是否将变动的数据同步到明细数据中？').then(function() {
        childrenFormData.invoiceNumber = selectInvoiceNumber.value[0];
        childrenFormData.implementationSign = '1';
        updateDataByInvoiceNumber(childrenFormData).then(response => {
            getList();
            proxy.$modal.msgSuccess("编辑成功");
        });
    }).then(() => {
    }).catch(() => {
        childrenFormData.invoiceNumber = selectInvoiceNumber.value[0];
        childrenFormData.implementationSign = '0';
        updateDataByInvoiceNumber(childrenFormData).then(response => {
            getList();
            proxy.$modal.msgSuccess("编辑成功");
        });
    });

}

getList();

</script>
