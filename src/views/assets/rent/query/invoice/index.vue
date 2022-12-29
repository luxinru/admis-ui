<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单据编号" prop="invoiceNumber">
        <el-input v-model="queryParams.invoiceNumber" @keyup.enter="handleQuery" style="width: 240px" clearable placeholder="请输入单据编号" />
      </el-form-item>
      <el-form-item label="单据状态" prop="invoiceStatus">
        <el-select v-model="queryParams.invoiceStatus" @keyup.enter="handleQuery" style="width: 240px" clearable placeholder="请选择单据状态" >
          <el-option v-for="dict in invoiceStatusOptions" :key="dict.codeProperty1" :label="dict.codeName1"
                     :value="dict.codeProperty1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search"  @click="handleQuery">搜索</el-button>
        <!--<el-button type="primary" icon="Filter" >筛选</el-button>-->
        <el-button  icon="Refresh"  @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="View"  :disabled="single"
                   @click="handleDetail">明细</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['system:dict:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-row>
      <el-table v-loading="loading" :data="invoiceList" @selection-change="handleSelectionChange"
                :height="height" :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="单据编号" align="center" width="220">
          <template #default="scope">
            <router-link :to="{
                      path:'/rent/query/detail',
                      query:{
                        invoiceNumber:scope.row.invoiceNumber
                      }
                }"  class="link-type">
              <span>{{ scope.row.invoiceNumber }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="单据状态" key="invoiceStatus" align="center" prop="invoiceStatus"
                         :formatter="invoiceStatusFormat" />
        <el-table-column label="所属单位" key="departName" align="center" prop="departName" width="150" :show-overflow-tooltip="true"/>
        <el-table-column label="数量" key="detailAmount" align="center" prop="detailAmount" width="150" />
        <el-table-column label="原值合计" key="originalValueSum" align="center" prop="originalValueSum" width="220" />
        <el-table-column label="净值合计" key="nowValueSum" align="center" prop="nowValueSum" width="220" />
        <el-table-column label="累计折旧合计" key="addDepreciateSum" align="center" prop="addDepreciateSum" width="220" />
        <el-table-column label="租赁金额" key="rentAccount" align="center" prop="rentAccount" width="220" />
        <el-table-column label="制单人" key="userName" align="center" prop="userName" width="220" :show-overflow-tooltip="true"/>
        <el-table-column label="制单日期" key="invoiceDate" align="center" prop="invoiceDate"  width="220" :show-overflow-tooltip="true"/>
        <el-table-column label="备注" key="remark" align="center" prop="remark" width="160" :show-overflow-tooltip="true" />
      </el-table>
      <!-- 页面分页吸底添加 class="fixed-bottom" 弹窗类分页不添加-->
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                  v-model:limit="queryParams.pageSize" @pagination="getList" class="fixed-bottom"/>
    </el-row>
  </div>
</template>

<script setup>
import { listInvoice, sendInvoice } from "@/api/assets/rent/adjust/invoice";
import { checkDetail } from "@/api/assets/rent/apply/detail";
import { onMounted } from "@vue/runtime-core";
import { ElTreeV2 } from 'element-plus'
import { Base64 } from "js-base64";
import {getToken} from "@/utils/auth";
const { proxy } = getCurrentInstance();
/**
 * =============初始化字段=============
 */
// 遮罩层
const loading = ref(true);
// 选中数组
const ids = ref([]);
// 选中数组(编号)
const number = ref([]);
// 非单个禁用
const single = ref(true);
// 非多个禁用
const multiple = ref(true);
// 显示搜索条件
const showSearch = ref(true);
// 系统工作日期
const sysWorkDate = ref(null);
// 筛选弹窗
const screeningOpen = ref(false);
// 总条数
const total = ref(0);
// 资产单据表格数据
const invoiceList = ref([]);
// 弹出层标题
const title = ref("");
// 是否显示弹出层
const open = ref(false);
// 单位弹窗
const deptdailogSign = ref(false);
// 部门树选项
const deptOptions = ref(undefined);
// 资产类型
const assetsTypeOptions = ref([]);
// 单据状态
const invoiceStatusOptions = ref([
  {codeProperty1: '01', codeName1: '新建'},
  {codeProperty1: '02', codeName1: '已上报'},
  {codeProperty1: '03', codeName1: '审批中'},
  {codeProperty1: '04', codeName1: '审批完成'},
]);
// 单据类型
const invoiceTypeOptions = ref([]);
//高度
const height = ref(408);
//上传
const refUpload = ref();
/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "business/add/invoice/importData"
});
// 查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 20,
  invoiceNumber: null,
  invoiceStatus: null,
  departCode: null,
  dataFilter: null
});
queryParams.value.dataFilter = Base64.encode("");
// 表单参数
const form=ref({});
getList();
const router = useRouter();

/**
 * =============钩子函数===============
 */

onMounted(() => {
  /* 窗口变化时自适应 监听窗口变化 */
  // window.addEventListener('resize', getHeight)
})

/**
 * =============自定义方法=============
 */

/** 查询资产单据列表 */
function getList() {
  debugger
  loading.value = true;
  queryParams.value.departCode = '1001';
  listInvoice(proxy.addDateRange(queryParams.value)).then(res => {
    loading.value = false;
    invoiceList.value = res.rows;
    total.value = res.total;
  });
}

/** 单据状态 */
function invoiceStatusFormat(row, column) {
  let status = row.invoiceStatus;
  if(status == "01"){
    return "新建";
  } else if(status == "02"){
    return "已上报";
  } else if(status == "03"){
    return "审批中";
  } else if(status == "04"){
    return "审批完成"
  }
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 表单重置 */
function reset() {
  form.value = {
    id: null,
    assetsType: "6",
    invoiceNumber: null,
    invoiceProperty: "0",
    invoiceStatus: "0",
    invoiceType: "0",
    turnStatus: "2",
    detailAmount: 0,
    originalValueSum: 0,
    makeDate: sysWorkDate,
    deleteStatus: 0,
    remark: null
  };
  proxy.resetForm("queryRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  if(queryParams.invoiceNumber == ""){
    queryParams.invoiceNumber = null;
  }
  if(queryParams.invoiceStatus == ""){
    queryParams.invoiceStatus = null;
  }
  queryParams.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryForm");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  number.value = selection.map(item => item.invoiceNumber)
  single.value = selection.length!==1
  multiple.value = !selection.length
}

/** 弹出明细菜单 */
function handleDetail() {
  router.push({
    path: "/rent/query/detail",
    query: {
      invoiceNumber: number.value[0]
    },
  });
}

/** 送审按钮操作 */
function sendAudit() {
  checkDetail(number.value).then(response => {
    if(response.data===0){
      proxy.$modal.msgError("单据中没有明细数据，不能送审！");
    }else{
      const rowIds = ids.value;
      proxy.$modal.confirm('是否确认送审单据编号为"' + number.value + '"的数据项?', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return sendInvoice(rowIds);
      }).then(() => {
        getList();
        proxy.$modal.msgSuccess("送审成功");
      })
    }
  });
}
function tableRowClassName({ rowIndex }){
  if (rowIndex % 2 == 0) {
    return '';
  } else {
    return 'row-even-bg';
  }
}
</script>
