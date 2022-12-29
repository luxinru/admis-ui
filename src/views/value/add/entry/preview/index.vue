<template>
  <div class="app-main-content">
    <!--转资前单据页面-->
    <div class="div-editor-container-grey">
      <el-form ref="invoiceRef" :model="invoiceForm" label-width="120px" :rules="invoiceFormRules">
        <el-row>
          <el-col :span="6">
            <el-form-item label="单据编号" prop="invoiceNumber" :title="invoiceForm.invoiceNumber">
              <el-input v-model="invoiceForm.invoiceNumber" disabled placeholder="自动生成" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据状态" prop="invoiceStatus">
              <el-select v-model="invoiceForm.invoiceStatus" placeholder="自动生成" style="width:240px;" disabled>
                <el-option v-for="item in invoiceStatusOption" :key="item.value" :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="转资类型" prop="invoiceType">
              <el-select v-model="invoiceForm.invoiceType" placeholder="请选择" style="width:240px;"
              disabled>
                <el-option v-for="item in invoiceTypeOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="invoiceForm.projectName" maxlength="40" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="项目编号" prop="projectCode">
              <el-input v-model="invoiceForm.projectCode" maxlength="30" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数量" prop="detailAmount">
              <el-input v-model="invoiceForm.detailAmount" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工器具及购置费" prop="purchaseCostSum">
              <el-input v-model="invoiceForm.purchaseCostSum" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="invoiceForm.remark" maxlength="500" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="block-divider"></div>
    <!--转资前明細页面-->
    <div class="div-editor-container-grey">
      <div class="table-box">
        <el-row :gutter="10" class="mb8">
          <right-toolbar v-model:showSearch="showSearch" @queryTable="detailList"></right-toolbar>
        </el-row>
        <!--明细表格-->
        <el-table v-loading="loading" :data="refineList"  :height="height"
          :row-class-name="tableRowClassName">
          <el-table-column label="资产名称" align="center" prop="assetsName" width="200" :show-overflow-tooltip="true" />
          <el-table-column label="资产类别" align="center" prop="contentAssetsCode" />
          <el-table-column label="井名及编号" align="center" prop="wellNameCode" width="100" :show-overflow-tooltip="true" />
          <el-table-column label="规格型号" align="center" prop="assetsStandard" width="160"
            :show-overflow-tooltip="true" />
          <el-table-column label="出厂日期" align="center" prop="productDate" width="140" />
          <el-table-column label="使用单位" align="center" prop="useDepartName" width="200" :show-overflow-tooltip="true" />
          <el-table-column label="计量单位" align="center" prop="unitCodeName" width="120" :show-overflow-tooltip="true" />
          <el-table-column label="数量" align="center" prop="singleAmount" />
          <el-table-column label="复合数量" align="center" prop="charItem5" />
          <el-table-column label="设备及工器具购置费" align="center" prop="purchaseCost" width="160" />
          <el-table-column label="备注" align="center" prop="remark" width="160" :show-overflow-tooltip="true" />
        </el-table>
        <pagination v-show="refineTotal > 0" :total="refineTotal" v-model:page="refineQueryParams.pageNum"
          v-model:limit="refineQueryParams.pageSize" @pagination="detailList" />
      </div>
    </div>
  </div>
</template>

<script setup name="Add">
// 引入单据操作方法
import { getInvoice, addInvoice, updateInvoice } from "@/api/value/add/entry/invoice/invoice";
// 引入明细操作方法
import { listDetail, getDetail, delDetail, addDetail, addDetailList, updateDetail } from "@/api/value/add/entry/detail/detail";
import { ref } from "vue";

const { proxy } = getCurrentInstance();

// 单据状态
const invoiceStatusOption = reactive([{
  value: '01',
  label: '新建'
}, {
  value: '02',
  label: '被退回'
}, {
  value: '03',
  label: '审批中'
}, {
  value: '04',
  label: '审批完成'
}]);

// 单据类型
let invoiceTypeOption = reactive([
  {
    value: 'ZZA_0101',
    label: '投资项目-预转资'
  }, {
    value: 'ZZA_0102',
    label: '投资项目-预转资调整'
  }, {
    value: 'ZZA_0103',
    label: '投资项目-竣工转资'
  }, {
    value: 'ZZA_02',
    label: '零购项目'
  }
]);

/** 单据区域函数 start */
// 获取父页面传递过来的参数
const route = useRoute();
// 获取单据编号
const parentInvoiceNumber = ref(route.query.invoiceNumber);

// 定义单据表单数据
const invoiceData = reactive({
  invoiceForm: {}
});
const { invoiceForm } = toRefs(invoiceData);

/**
 * 单据区域初始化
 */
function handleInitInvoice() {
  getInvoice(parentInvoiceNumber.value).then(response => {
    invoiceForm.value = response.data;
    detailReadonly.value = false;
    detailList();
  });
}

/** 单据区域函数 end */


/** 明细区域函数 start */
const loading = ref(true);
const selectRow = ref([]);
const ids = ref([]);
const detailReadonly = ref(true);
const single = ref(true);
const multiple = ref(true);
//高度
const height = ref(208);
// 分页初始条数
const refineTotal = ref(0);
// 分页列表数据
const refineList = ref([]);

// 定义分页查询数据
const refineData = reactive({
  refineQueryParams: {
    pageNum: 1,
    pageSize: 10,
    invoiceNumber: "-1"
  }
});
const { refineQueryParams } = toRefs(refineData);

/**
 * 查询增加明细数据
 */
function detailList() {
  loading.value = true;
  refineQueryParams.value.invoiceNumber = parentInvoiceNumber.value == "" ? "xz" : parentInvoiceNumber.value;
  listDetail(refineQueryParams.value).then(response => {
    refineList.value = response.rows;
    refineTotal.value = response.total;
    loading.value = false;
  });
}

/**
 * 导出按钮操作
 */
function handleExportDetail() {
  proxy.download('detail/add/export', {
    ...queryParams.value
  }, `add_${new Date().getTime()}.xlsx`)
}

/** 明细区域函数 end */
function tableRowClassName({ rowIndex }) {
  if (rowIndex % 2 == 0) {
    return '';
  } else {
    return 'row-even-bg';
  }
}
/** 页面操作 start */
//1.加载上方单据信息
handleInitInvoice();
/** 页面操作 end */
</script>
