<template>
  <div class="app-main-content">
    <!--转资前明細页面-->
    <div class="div-editor-container-grey">
      <div class="table-box">
        <el-form :model="refineQueryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="资产类别" prop="contentAssetsCode">
            <el-input v-model="refineQueryParams.contentAssetsCode" @keyup.enter="handleQuery" style="width: 220px" clearable
                      placeholder="请输入资产类别编码" maxlength="30" />
          </el-form-item>
          <el-form-item label="规格型号" prop="assetsStandard">
            <el-input v-model="refineQueryParams.assetsStandard" @keyup.enter="handleQuery" style="width: 220px" clearable
                      placeholder="请输入规格型号" maxlength="40" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <!--按钮操作部分-->
        <el-row :gutter="10" class="mb8">
          <right-toolbar v-model:showSearch="showSearch" @queryTable="detailList"></right-toolbar>
        </el-row>

        <!--明细表格-->
        <el-table v-loading="loading" :data="refineList" @selection-change="handleSelectionChange" :height="height" :row-class-name="tableRowClassName">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="资产名称" align="center" prop="assetsName" width="170" :show-overflow-tooltip="true"/>
          <el-table-column label="井名及编号" align="center" prop="wellNameCode" width="170"/>
          <el-table-column label="资产类别" align="center" prop="contentAssetsCode" width="170"/>
          <el-table-column label="规格型号" align="center" prop="assetsStandard" width="170"/>
          <el-table-column label="出厂日期" align="center" prop="productDate" width="170"/>
          <el-table-column label="使用单位" align="center" prop="useDepartName" width="170" :show-overflow-tooltip="true"/>
          <el-table-column label="计量单位" align="center" prop="unitCodeName" width="170" />
          <el-table-column label="计量数量" align="center" prop="singleAmount" width="170"/>
          <el-table-column label="复合数量" align="center" prop="charItem5" width="170"/>
          <el-table-column label="设备及工器具购置费" align="center" prop="purchaseCost" width="170"/>
          <el-table-column label="备注" align="center" prop="remark" width="160" :show-overflow-tooltip="true"/>
        </el-table>
        <pagination v-show="refineTotal > 0" :total="refineTotal" v-model:page="refineQueryParams.pageNum"
                    v-model:limit="refineQueryParams.pageSize" @pagination="detailList" />
      </div>
    </div>

  </div>
</template>

<script setup name="PhysicalDetail">
  // 引入明细操作方法
  import { listDetail } from "@/api/value/add/assetsaudit/detail/detail";
  // 定义router，用于获取通过路由传递的参数
  import { useRoute } from 'vue-router';
  // 整合所需的选中将要整合资产的keyCode集合
  const intergrationKeyCodes = ref([]);
  // 获取父页面传递过来的参数
  const route = useRoute();

  const { proxy } = getCurrentInstance();

  //单据类型操作开关 只有新增情况允许操作
  const editInvoiceTypeFlag = ref(false);

  // 获取单据编号
  const parentInvoiceNumber = ref(route.query.invoiceNumber);
  // 获取单据类型
  const retailEquipment = ref(route.query.retailEquipment);

  // 定义单据表单数据
  const invoiceData = reactive({
    invoiceForm: {}
  });
  const { invoiceForm } = toRefs(invoiceData);
  //高度
  const height = ref(408);
  /** 明细区域函数 start */
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const selectRow = ref([]);
  const ids = ref([]);
  const detailReadonly = ref(true);
  const single = ref(true);
  const multiple = ref(true);
  const title = ref("");

  // 明细表单
  const detailForm = ref();
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
   * 明细数据，表格checkBox选中行事件
   * @param {*} selection 选中内容
   */
  function handleSelectionChange(selection) {
    selectRow.value = selection;
    ids.value = selection.map(item => item.id);
    // 整合资产所需的选中资产的keyCode
    intergrationKeyCodes.value = selection.map(item => item.keyCode);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    refineQueryParams.value.pageNum = 1;
    detailList();
  }

  /** 重置按钮操作 */
  function resetQuery() {
    proxy.resetForm("queryRef");
    handleQuery();
  }
  function tableRowClassName({ rowIndex }){
    if (rowIndex % 2 == 0) {
      return '';
    } else {
      return 'row-even-bg';
    }
  }

  detailList();
</script>
