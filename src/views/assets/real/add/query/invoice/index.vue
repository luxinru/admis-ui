<template>
  <div class="app-main-content">
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
        <el-button type="primary" plain icon="Check"  :disabled="multiple"
          @click="handleBackInvoice">撤销</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Upload"  :disabled="single"
          @click="openAttachPage">附件</el-button>
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
    <div>
      <el-table v-loading="loading" :data="invoiceList" @selection-change="handleSelectionChange"
        :height="height" :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="单据编号" align="center" width="220">
          <template #default="scope">
            <router-link :to="{
                        path:'/add/query/detail',
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
        <el-table-column label="所属单位" key="departName" align="center" prop="departName" width="110" />
        <el-table-column label="数量" key="detailAmount" align="center" prop="detailAmount" width="150" />
        <el-table-column label="参考原值合计" key="originalValueSum" align="center" prop="originalValueSum"
          width="220" />
        <el-table-column label="制单人" key="userName" align="center" prop="userName" />
        <el-table-column label="制单日期" key="invoiceDate" align="center" prop="invoiceDate" width="140" />
        <el-table-column label="审批/否决意见" key="returnAuditOpinion" align="center" prop="returnAuditOpinion"
          width="110" />
        <el-table-column label="备注" key="remark" align="center" prop="remark" width="110" />
      </el-table>
      <!-- 页面分页吸底添加 class="fixed-bottom" 弹窗类分页不添加-->
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
      <!-- 添加或修改资产单据对话框 -->
      <el-dialog :title="title" v-model="open" width="600px" append-to-body>
        <el-form :model="form" ref="formRef" label-width="80px">
          <el-form-item label="资产类型"> 实物 </el-form-item>
          <el-form-item label="单据类型"> 增加-实物资产 </el-form-item>
          <el-form-item label="单位名称">
            {{ form.departName }}
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { listInvoice, handleBack } from "@/api/assets/real/add/invoice";
import { onMounted } from "@vue/runtime-core";
import { ElTreeV2 } from 'element-plus';
const { proxy } = getCurrentInstance();
/**
 * =============初始化字段=============
 */
// 打开资产卡片
const audit = ref();
// 遮罩层
const loading = ref(true);
// 选中数组
const ids = ref([]);
// 选中数组(编号)
const number = ref([]);
// 非单个禁用
const single = ref(true);
// 选中的单据状态
const status = ref([]);
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
const invoiceStatusOptions = ref([{codeProperty1: '01', codeName1: '新建'}, {codeProperty1: '02', codeName1: '被退回'},{codeProperty1: '03', codeName1: '审批中'},{codeProperty1: '04', codeName1: '审批完成'}]);
// 单据类型
const invoiceTypeOptions = ref([]);
//高度
const height = ref(408);
// 查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  invoiceNumber: null,
  invoiceStatus: null,
  departCode: null,
  dataFilter: null
});
// 表单参数
const form=ref({});
getList();
const router = useRouter();

/**
 * =============钩子函数===============
 */

 onMounted(() => {
  console.log(audit.value);
  /* 窗口变化时自适应 监听窗口变化 */
  // window.addEventListener('resize', getHeight)
})

/**
 * =============自定义方法=============
 */

/** 查询资产单据列表 */
function getList() {
  // debugger
  loading.value = true;
  queryParams.value.departCode = '1001';
  listInvoice(proxy.addDateRange(queryParams.value)).then(res => {
    loading.value = false;
    invoiceList.value = res.rows;
    total.value = res.total;
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
  status.value = selection.map(item => item.invoiceStatus)
  single.value = selection.length!==1
  multiple.value = !selection.length
}

/** 弹出明细菜单 */
function handleDetail() {
  router.push({
    path: "/add/query/detail",
    query: {
      invoiceNumber: number.value[0]
    },
  });
}

/** 撤销按钮操作 */
function handleBackInvoice() {
  const statusArr = status.value;
  let flag = true;
  for(let i=0;i<statusArr.length;i++){
    if(statusArr[i]!=='04'){
      flag = false;
    }
  }
  if(flag){
    const idsArr = ids.value;
    proxy.$modal.confirm('是否确认撤销单据编号为"' + number.value + '"的数据项?', "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(function() {
      return handleBack(idsArr);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("撤销成功");
    })
  }else{
    proxy.$modal.msgError("只能撤销审批完成的数据！");
  }
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download("business/add/invoice/export", {
    ...queryParams.value
  }, `post_${new Date().getTime()}.xlsx`);
}
function tableRowClassName({ rowIndex }){
  if (rowIndex % 2 == 0) {
    return '';
  } else {
    return 'row-even-bg';
  }
}
</script>
