<template>
  <div class="app-main-content">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单据编号" prop="invoiceNumber">
        <el-input v-model="queryParams.invoiceNumber" @keyup.enter="handleQuery" style="width: 220px" clearable
          placeholder="请输入单据编号" />
      </el-form-item>
      <el-form-item label="项目编号" prop="projectCode">
        <el-input v-model="queryParams.projectCode" @keyup.enter="handleQuery" style="width: 220px" clearable
          placeholder="请输入项目编号" />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="queryParams.projectName" @keyup.enter="handleQuery" style="width: 220px" clearable
          placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <!--<el-button type="primary" icon="Filter">筛选</el-button>-->
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
          @click="openAuditPage">审核</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['invoice:goodsCheck:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="checkList" @selection-change="handleSelectionChange" :height="height" :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="单据编号" align="center" width="200">
          <template #default="scope">
            <router-link :to="{
                        path:'/value/add/goodsCheck/detail',
                        query:{
                          invoiceNumber:scope.row.invoiceNumber
                        }
                  }"  class="link-type">
              <span>{{ scope.row.invoiceNumber }}</span>
            </router-link>
          </template>
        </el-table-column>
      <el-table-column label="单据状态" align="center" prop="invoiceStatus" :formatter="invoiceStatusFormat"/>
      <el-table-column label="项目编号" align="center" prop="projectCode" />
      <el-table-column label="项目名称" align="center" prop="projectName" width="200" :show-overflow-tooltip="true" />
      <el-table-column label="数量合计" align="center" prop="detailAmount" />
      <el-table-column label="工器具及购置费用合计" align="center" prop="purchaseCostSum" />
      <el-table-column label="备注" align="center" prop="remark" width="160" :show-overflow-tooltip="true"/>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

      <!-- 卡片弹窗 -->
      <audit-page ref="audit" @handleAudit="handleAudit"/>
  </div>
</template>

<script setup name="goodsCheck">
import { listInvoice, getInvoice,checkInvoice } from "@/api/value/add/goodsCheck/invoice/invoice";
import auditPage from "@/views/assets/real/audit";
import { ElMessage } from 'element-plus';
import { onMounted } from "@vue/runtime-core";
import { Base64 } from "js-base64";


// 选中数组(编号)
const number = ref([]);
// 打开资产卡片
const audit = ref();
const { proxy } = getCurrentInstance();
const checkList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
// 高度
const height = ref(408);
// 系统工作日期
const sysWorkDate = ref(null);
// 单据状态
const invoiceStatusOptions = ref([{ codeProperty: '05', codeName: '物资核对' }]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    invoiceNumber: null,
    invoiceStatus: '05',
    projectCode: null,
    projectName: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);


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

/** 单据状态：05物资核对 */
function invoiceStatusFormat(row, column) {
  let status = row.invoiceStatus;
  if (status == "05") {
    return "物资核对";
  }
}

/** 查询实物核对单据表列表 */
function getList() {
  loading.value = true;
  listInvoice(queryParams.value).then(response => {
    checkList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
  number.value = selection.map(item => item.invoiceNumber)
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('invoice/goodsCheck/export', {
    ...queryParams.value
  }, `add_${new Date().getTime()}.xlsx`)
}

/** 明细操作 */
function handleDetail() {
  router.push({
    path: "/value/add/goodsCheck/detail",
    query: {
      invoiceNumber: number.value[0]
    },
  });
}

/** 核对操作 */
function openAuditPage() {
  audit.value.show("物资核对");
}

function handleAudit(flag, reason) {
  const obj = {
    ids: ids.value,
    auditDate: sysWorkDate.value,
    flag: flag,
    returnAuditOpinion: reason
  };
  checkInvoice(proxy.addDateRange(obj)).then(() => {
    getList();
    if(flag){
      proxy.$modal.msgSuccess("核对成功");
    }else{
      proxy.$modal.msgSuccess("否决成功");
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
