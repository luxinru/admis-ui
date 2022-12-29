<template>
  <div class="app-main-content">
    <!--单据表单及主资产部分页面-->
    <div class="div-editor-container-grey">
      <!--单据表单-->
      <div class="table-box">
        <!--检索条件-->
        <el-form :model="assetsPageQueryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="资产编号" prop="assetsCode">
            <el-input
                v-model="assetsPageQueryParams.assetsCode"
                placeholder="请输入资产编号"
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
            <el-button
                type="danger"
                plain
                icon="Position"
                :disabled="cancelAssetsButton"
                @click="cancelAssets"
            >撤销
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="assetsGetList"></right-toolbar>
        </el-row>
        <!--主资产表格-->
        <el-table v-loading="assetsLoading" :data="assetsList" @selection-change="assetsHandleSelectionChange"
                  :height="height" :row-class-name="tableRowClassName">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="单据编码" align="center" prop="invoiceNumber" width="220"/>
          <el-table-column label="资产编码" align="center" prop="assetsCode"/>
          <el-table-column label="资产名称" align="center" prop="assetsName" width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="资产类型" align="center" prop="assetsTypeName"/>
          <el-table-column label="所属单位" align="center" prop="departName" width="220" :show-overflow-tooltip="true"/>
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
          <el-table-column label="备注" align="center" prop="remark" width="160" :show-overflow-tooltip="true"/>
        </el-table>
        <pagination
            v-show="assetsTotal > 0"
            :total="assetsTotal"
            v-model:page="assetsPageQueryParams.pageNum"
            v-model:limit="assetsPageQueryParams.pageSize"
            @pagination="assetsGetList"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  cancelAssetsData,
  getAssetsGetList, delAssetsDetail
} from "@/api/assets/house/repair/detail";
// 定义router，用于获取父页面传递过来的参数
import {useRoute} from 'vue-router';
//高度
const height = ref(408);
const {proxy} = getCurrentInstance();
// 选资产按钮，是否可编辑
const checkAssetsEdit = ref(true);
// 主资产删除，是否可点击
const assetsMultiple = ref(true);
// 主资产撤销，是否可点击
const cancelAssetsButton = ref(true);

// -----------------最上方单据表单变量定义---------------------
// 是否展示查询条件
const showSearch = ref(true);
// 上方单据表单显隐控制--已弃用，暂时保留，默认为true
const invoiceFormOpen = ref(true);
// 获取父页面传递过来的参数
const route = useRoute();
const parentInvoiceNumber = ref(route.query.invoiceNumber);
const parentInvoiceStatus = ref(route.query.invoiceStatus);
// 定义表单数据
const invoiceData = reactive({
  invoiceForm: {},
  assetsQueryParams: {
    pageNum: 1,
    pageSize: 10,
    invoiceNumber: null
  }
});
const {invoiceForm} = toRefs(invoiceData);

   // -----------------中间部分变量定义-------------
   // 选资产弹窗显隐
   const chooseAssetsOpen = ref(false);
   // loading加载
   const assetsLoading = ref(true);
   // 分页初始条数
   const assetsTotal = ref(0);
   // 分页列表数据
   const assetsList = ref([]);
   // 定义分页查询数据
   const assetsData = reactive({
       assetsPageQueryParams: {
           pageNum: 1,
           pageSize: 10,
           invoiceNumber: parentInvoiceNumber.value==""?"xz":parentInvoiceNumber.value,
           assetsCode: null
       }
   });
   const { assetsPageQueryParams } = toRefs(assetsData);
   const assetsPkIds = ref([]);
   // 主资产编码集合
   const assetsCodes = ref([]);
   const pkKeyCodes = ref([]);
   //单据状态下拉框监听事件
   function dataSourcesFunction(value) {
      // console.log("单据状态下拉框监听事件"+value);
   }
   // ---------------中间部分关联主资产相关脚本---------------
   // 查询列表数据
   function assetsGetList() {
      assetsLoading.value = true;
      getAssetsGetList(assetsPageQueryParams.value).then(response => {
          assetsList.value = response.rows;
          assetsTotal.value = response.total;
          assetsLoading.value = false;
      });
   }
   /** 搜索按钮操作 */
   function handleQuery() {
       assetsGetList();
   }
   /** 重置按钮操作 */
   function resetQuery() {
      proxy.resetForm("queryRef");
      handleQuery();
   }
   // 选资产事件
   function checkAssets() {
       chooseAssetsOpen.value = true;
   }
   // 删除资产
   function handleDeleteAssets() {
       const assetsPkIdsCon = assetsPkIds.value;
       proxy.$modal.confirm('是否确认删除选中的数据项？').then(function() {
           return delAssetsDetail(assetsPkIdsCon);
       }).then(() => {
           assetsGetList();
           proxy.$modal.msgSuccess("删除成功");
       }).catch(() => {});
   }
   // 表格checkBox选中行事件
   function assetsHandleSelectionChange(selection) {
       // 将detail表的id作为pkid
       assetsPkIds.value = selection.map(item => item.id);
       const ids = selection.map(item => item.id);
       assetsCodes.value = selection.map(item => item.assetsCode);
       pkKeyCodes.value = selection.map(item => item.keyCode);
       assetsMultiple.value = !selection.length;
       cancelAssetsButton.value = !selection.length;
   }
   // 撤销房屋主资产
   function cancelAssets() {
       if(parentInvoiceStatus.value != '06'){
           proxy.$modal.msgSuccess("单据为未实施完成状态，无法撤销明细数据！");
           return;
       }
       const obj = {
           invoiceNumber: parentInvoiceNumber.value,
           pkKeyCodes: pkKeyCodes.value
       };
       proxy.$modal.confirm('是否确认撤销选中的数据项？').then(function() {
           return cancelAssetsData(obj);
       }).then(() => {
           assetsGetList();
           proxy.$modal.msgSuccess("撤销成功");
       }).catch(() => {});
   }
  function tableRowClassName({ rowIndex }){
    if (rowIndex % 2 == 0) {
      return '';
    } else {
      return 'row-even-bg';
    }
  }
   // ---------------暂留脚本-----------------
   const single = ref(true);
   const multiple = ref(true);

   assetsGetList();

</script>
