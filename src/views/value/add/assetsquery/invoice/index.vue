<template>
  <div class="app-main-content">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目编号" prop="projectCode">
        <el-input v-model="queryParams.projectCode" @keyup.enter="handleQuery" style="width: 220px" clearable
                  placeholder="请输入项目编号" maxlength="30" />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="queryParams.projectName" @keyup.enter="handleQuery" style="width: 220px" clearable
                  placeholder="请输入项目名称" maxlength="40" />
      </el-form-item>
      <el-form-item label="单据编号" prop="invoiceNumber">
        <el-input v-model="queryParams.invoiceNumber" @keyup.enter="handleQuery" style="width: 220px" clearable
          placeholder="请输入单据编号" maxlength="30" />
      </el-form-item>
      <el-form-item label="所属单位" prop="departName">
        <el-input v-model="queryParams.departName" :title="queryParams.departName" style="width: 220px" readonly placeholder="请选择所属单位" maxlength="100">
          <template #append>
            <el-button icon="Search" @click="openDepartCard()"/>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="单据类型" prop="invoiceType">
        <el-select v-model="queryParams.invoiceType" @keyup.enter="handleQuery" clearable placeholder="请选择单据类型" >
          <el-option v-for="dict in invoiceTypeOptions" :key="dict.codeProperty1" :label="dict.codeName1"
                     :value="dict.codeProperty1" />
        </el-select>
      </el-form-item>
      <el-form-item label="单据状态" prop="invoiceStatus">
        <el-select v-model="queryParams.invoiceStatus" @keyup.enter="handleQuery" clearable placeholder="请选择单据状态" >
          <el-option v-for="dict in invoiceStatusOptions" :key="dict.codeProperty1" :label="dict.codeName1"
                     :value="dict.codeProperty1" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期" prop="invoiceDate">
        <el-date-picker v-model="queryParams.invoiceDate" value-format="YYYY-MM" type="month" placeholder="选择月"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button  icon="Refresh"  @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="block-divider" v-if="showSearch"></div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" >
        <el-button type="danger" plain icon="Position" :disabled="calcelButton" @click="handleCancelFun">撤销</el-button>
      </el-col>
      <el-col :span="1.5" >
        <el-button type="success" plain icon="View" :disabled="single" @click="handleDetailQuery">按明细检索</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="physicalList" @selection-change="handleSelectionChange"  :height="height" :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单据编号" align="center" prop="invoiceNumber" width="210"/>
      <el-table-column label="单据类型" align="center" prop="invoiceStatus" width="210" :formatter="invoiceTypeFormat"/>
      <el-table-column label="单据状态" align="center" prop="invoiceStatus" width="210" :formatter="invoiceStatusFormat"/>
      <el-table-column label="项目编号" align="center" prop="projectCode" width="210"/>
      <el-table-column label="项目名称" align="center" prop="projectName" width="210"/>
      <el-table-column label="数量合计" align="center" prop="detailAmount" />
      <el-table-column label="所属单位" align="center" prop="departName" width="210"/>
      <el-table-column label="单据创建时间" align="center" prop="invoiceDate" width="210"/>
      <el-table-column label="备注" align="center" prop="remark" width="210"/>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 调用所属单位-->
    <depart-code ref="refDepartCard" @handleDepartCard="handleDepartCard"/>

  </div>
</template>

<script setup name="PhysicalInvoice">
import { listInvoice } from "@/api/value/add/assetsquery/invoice/invoice";
import departCode from "@/views/system/card/depart/index";
import { ElMessage } from 'element-plus'
// 定义router，用于获取通过路由传递的参数
import { useRoute } from 'vue-router';
// 获取通过路由传递的参数变量
const router = useRouter();
const { proxy } = getCurrentInstance();
// 所属单位弹窗
const refDepartCard = ref();
// 撤销按钮
const calcelButton = ref(true);

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

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    invoiceNumber: null,
    invoiceStatus: null,
    projectCode: null,
    projectName: null
  }
});

const { queryParams, form } = toRefs(data);

// 单据类型 ZZA_0101投资项目-预转资；ZZA_0102投资项目-预转资调整；ZZA_0103投资项目-竣工转资；ZZA_02零购设备
const invoiceTypeOptions = ref([{codeProperty1: 'ZZA_0101', codeName1: '投资项目-预转资'},
  {codeProperty1: 'ZZA_0102', codeName1: '投资项目-预转资调整'},
  {codeProperty1: 'ZZA_0103', codeName1: '投资项目-竣工转资'},
  {codeProperty1: 'ZZA_02', codeName1: '零购设备'}]);
// 单据状态
const invoiceStatusOptions = ref([{codeProperty1: '01', codeName1: '新建'}, {codeProperty1: '02', codeName1: '实物照片核对退回'},
  {codeProperty1: '03', codeName1: '实物照片核对'}, {codeProperty1: '04', codeName1: '物质核对退回'},
  {codeProperty1: '05', codeName1: '物质核对'}, {codeProperty1: '06', codeName1: '实物信息维护退回'},
  {codeProperty1: '07', codeName1: '实物信息维护'}, {codeProperty1: '08', codeName1: '造价维护退回'},
  {codeProperty1: '09', codeName1: '造价维护'}, {codeProperty1: '10', codeName1: '财务核对退回'},
  {codeProperty1: '11', codeName1: '财务核对'}, {codeProperty1: '12', codeName1: '状态确认退回'},
  {codeProperty1: '13', codeName1: '状态退回'}, {codeProperty1: '14', codeName1: '财务核对退回'},
  {codeProperty1: '15', codeName1: '财务核对'}, {codeProperty1: '16', codeName1: '实物信息维护退回'},
  {codeProperty1: '17', codeName1: '实物信息维护'}, {codeProperty1: '18', codeName1: '财务信息维护退回'},
  {codeProperty1: '19', codeName1: '财务信息维护'}, {codeProperty1: '20', codeName1: '审批退回'},
  {codeProperty1: '21', codeName1: '审批中'}, {codeProperty1: '22', codeName1: '审批完成'}]);

// 单据类型 ZZA_0101投资项目-预转资；ZZA_0102投资项目-预转资调整；ZZA_0103投资项目-竣工转资；ZZA_02零购设备
function invoiceTypeFormat(row) {
  let status = row.invoiceType;
  if(status == "ZZA_0101") {
    return "预转资"
  } else if (status == "ZZA_0102") {
    return "预转资调整";
  } else if (status == "ZZA_0103") {
    return "竣工转资";
  } else if (status == "ZZA_02") {
    return "零购设备";
  }
}
/** 单据状态：01新建02被退回 */
function invoiceStatusFormat(row, column) {
  let status = row.invoiceStatus;
  if(status == "01") {
    return "新建"
  } else if (status == "02") {
    return "实物照片核对退回";
  } else if (status == "03") {
    return "实物照片核对";
  } else if (status == "04") {
    return "物质核对退回";
  } else if (status == "05") {
    return "物质核对";
  } else if (status == "06") {
    return "实物信息维护退回";
  } else if (status == "07") {
    return "实物信息维护";
  }  else if (status == "08") {
    return "造价维护退回";
  }  else if (status == "09") {
    return "造价维护";
  }  else if (status == "10") {
    return "财务核对退回";
  }  else if (status == "11") {
    return "财务核对";
  }  else if (status == "12") {
    return "状态确认退回";
  }  else if (status == "13") {
    return "状态退回";
  }  else if (status == "14") {
    return "财务核对退回";
  } else if (status == "15") {
    return "财务核对"
  }  else if (status == "16") {
    return "实物信息维护退回"
  } else if (status == "17") {
    return "实物信息维护";
  } else if (status == "18") {
    return "财务信息维护退回";
  } else if (status == "19") {
    return "财务信息维护";
  } else if (status == "20") {
    return "审批退回";
  } else if (status == "21") {
    return "审批中";
  } else if (status == "22") {
    return "审批完成";
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

/** 打开所属单位字典*/
function openDepartCard(){
  refDepartCard.value.openCard("所属单位");
}

/** 获取所属单位字典的数据*/
function handleDepartCard(row){
  queryParams.value.departName = row.departName;
  queryParams.value.departCode = row.departCode;
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
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
  calcelButton.value = !selection.length;
  multiple.value = !selection.length;
}

// 撤销
function handleCancelFun() {
  alert(invoiceNumbers.value+"撤销成功");
}

/** 按明细检索 */
function handleDetailQuery(row) {
  reset();
  const invoiceNumber = row.invoiceNumber || invoiceNumbers.value[0];
  router.push({
    path: "/value/add/assetsquery/detail",
    query: {
      invoiceNumber: invoiceNumber
    },
  });
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
