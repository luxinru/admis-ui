<template>
  <div>
    <div class="app-main-content">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="所属单位" prop="departName" v-if="false">
          <el-input v-model="queryParams.departCode" readonly/>
        </el-form-item>
        <el-form-item label="所属单位" prop="departName">
          <el-input v-model="queryParams.departName" readonly style="width: 140px">
              <template #append>
                <el-button icon="Search" @click="openDepartCard()"/>
              </template>
            </el-input>
        </el-form-item>
        <el-form-item label="批复文号" prop="relyCode">
          <el-input v-model="queryParams.relyCode" @keyup.enter="handleQuery" style="width: 140px" clearable placeholder="请输入批复文号" />
        </el-form-item>
        <el-form-item label="批次" prop="relyNo">
          <el-input v-model="queryParams.relyNo" @keyup.enter="handleQuery" style="width: 140px" clearable placeholder="请输入批次" />
        </el-form-item>
        <el-form-item label="探井编码" prop="wellCode">
          <el-input v-model="queryParams.wellCode" @keyup.enter="handleQuery" style="width: 140px" clearable placeholder="请输入探井编码" />
        </el-form-item>
        <el-form-item label="项目名称" prop="wellName"  v-if="false">
          <el-input v-model="queryParams.wellName" @keyup.enter="handleQuery" style="width: 140px" clearable placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="井别编码" prop="wellTypeCode" v-if="false">
          <el-input v-model="queryParams.wellTypeCode" @keyup.enter="handleQuery" style="width: 140px" clearable placeholder="请输入井别编码" />
        </el-form-item>
        <el-form-item label="井别名称" prop="wellTypeName">
          <el-input v-model="queryParams.wellTypeName" @keyup.enter="handleQuery" style="width: 140px" clearable placeholder="请输入井别名称">
              <template #append>
                <el-button icon="Search" @click="openComplexCodeCard('welltypecode')"/>
              </template>
            </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search"  @click="handleQuery">搜索</el-button>
          <el-button type="danger" icon="Refresh"  @click="resetQuery">重置</el-button>
          <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['system:dict:export']"
          >导出</el-button>
        </el-form-item>
      </el-form>
      <div class="block-divider" v-if="showSearch"></div>
      <el-row :gutter="10" class="mb8">
      </el-row>
      <el-table v-loading="loading" :data="invoiceList" @selection-change="handleSelectionChange"
                :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="探井编码" align="center" prop="wellCode" width="155">
        </el-table-column>
        <el-table-column label="项目名称" align="center" prop="wellName" width="125">
        </el-table-column>
        <el-table-column label="项目类别" align="center" prop="projectCategory" width="125">
        </el-table-column>
        <el-table-column label="井号" align="center" prop="licenceNumber" width="125">
        </el-table-column>
        <el-table-column label="井别编码" align="center" prop="wellTypeCode" width="125">
        </el-table-column>
        <el-table-column label="井别名称" align="center" prop="wellTypeName" width="125">
        </el-table-column>
        <el-table-column label="完井日期" align="center" prop="completionDate" width="125">
        </el-table-column>
        <el-table-column label="完钻井深" align="center" prop="completionDepth" width="125">
        </el-table-column>
        <el-table-column label="有效进尺(米)" align="center" prop="footageEffective" width="125">
        </el-table-column>
        <el-table-column label="进尺" align="center" prop="actualFootage" width="125">
        </el-table-column>
        <el-table-column label="总成本-实际完成" align="center" prop="actualCostTotal" width="125">
        </el-table-column>
        <el-table-column label="单位成本(米/元)-实际完成" align="center" prop="actualCostUnit" width="205">
        </el-table-column>
        <el-table-column label="无效进尺(米)-核销井段" align="center" prop="cancelFootageInvalid" width="205">
        </el-table-column>
        <el-table-column label="总成本核销井段" align="center" prop="cancelCostTotal" width="155">
        </el-table-column>
        <el-table-column label="单位成本(米/元)-核销井段" align="center" prop="cancelCostUnit" width="205">
        </el-table-column>
        <el-table-column label="总成本-资本化" align="center" prop="capitalizationCostTotal" width="155">
        </el-table-column>
        <el-table-column label="单位成本(米/元) -资本化" align="center" prop="capitalizationCostUnit" width="205">
        </el-table-column>
        <el-table-column label="报废核销依据" align="center" prop="discardCalcelBasis" width="175">
        </el-table-column>
        <el-table-column label="审批意见" align="center" prop="auditOpinion" width="125">
        </el-table-column>
        <el-table-column label="批复文号" align="center" prop="relyCode" width="125">
        </el-table-column>
        <el-table-column label="批次" align="center" prop="relyNo" width="125">
        </el-table-column>
        <el-table-column label="单位名称" align="center" prop="departName" width="340">
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="175">
        </el-table-column>
      </el-table>
      <!-- 页面分页吸底添加 class="fixed-bottom" 弹窗类分页不添加-->
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                  v-model:limit="queryParams.pageSize" @pagination="getList" />
      <!-- 添加或修改资产单据对话框 -->
      <el-dialog :title="title" v-model="open" width="700px" append-to-body>

      </el-dialog>
    </div>
    <depart-code ref="departCard" @handleDepartCard="handleDepartCard"/>
    <choose-complex ref="refComplexCard" @handleComplexData="handleComplexData"/>
  </div>
</template>

<script setup>
import { listWell} from "@/api/assets/well/query/well";
import departCode from "@/views/system/card/depart/index";
import chooseComplex from "@/views/system/card/complexCode/index";
import { onMounted } from "@vue/runtime-core";
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
//高度
const height = ref(400);
const departCard = ref();
const refComplexCard = ref();
// 查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 20,
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
  /* 窗口变化时自适应 监听窗口变化 */
  // window.addEventListener('resize', getHeight)
})

/**
 * =============自定义方法=============
 */

/** 查询资产单据列表 */
function getList() {
  loading.value = true;
  listWell(proxy.addDateRange(queryParams.value)).then(res => {
    loading.value = false;
    invoiceList.value = res.rows;
    total.value = res.total;
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 表单重置 */
function reset() {
  proxy.resetForm("queryRef");
}

/** 搜索按钮操作 */
function handleQuery() {
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

/** 打开附件窗口 */
function openAttachPage() {
  const keycode = number.value[0];
  const tableName = 'adm_real_assets_invoice';
  $refs.attach.show(keycode,tableName);
}

/** 打开导出窗口 */
function openExportPage() {
  $refs.export.show("adm_real_assets_invoice");
}

function openDepartCard(){
  departCard.value.openCard("所属单位");
}

function handleDepartCard(row){
  queryParams.value.departName = row.departName;
  queryParams.value.departCode = row.departCode;
}

function openComplexCodeCard(codeProperty){
  refComplexCard.value.openCard(codeProperty,"井别编码");
}

function handleComplexData(row){
  // 增加原因
  queryParams.value.wellTypeName = row.codeName1;
  queryParams.value.wellTypeCode = row.codeProperty1;
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("well/add/export", {
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
