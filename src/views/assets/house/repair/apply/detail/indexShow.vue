<template>
    <div>
        <!--单据表单及主资产部分页面-->
        <div class="div-editor-container-grey">
            <!--单据表单-->
            <div class="app-container">
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
                <!--<el-row :gutter="10" class="mb8">
                    <right-toolbar v-model:showSearch="showSearch" @queryTable="assetsGetList"></right-toolbar>
                </el-row>-->
                <!--主资产表格-->
                <el-table v-loading="assetsLoading" :data="assetsList" @selection-change="assetsHandleSelectionChange" :height="height">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="单据编码" align="center" prop="invoiceNumber" width="220"/>
                    <el-table-column label="资产编码" align="center" prop="assetsCode" />
                    <el-table-column label="资产名称" align="center" prop="assetsName" />
                    <el-table-column label="资产类型" align="center" prop="assetsTypeName" />
                    <el-table-column label="所属单位" align="center" prop="departName" />
                    <el-table-column label="备注" align="center" prop="remark" />
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
   import { getHouseRefineInvoice, getAssetsGetList, delAssetsDetail } from "@/api/assets/house/repair/detail";
   // 定义router，用于获取父页面传递过来的参数
   import { useRoute } from 'vue-router';
   //高度
   const height = ref(408);
   const { proxy } = getCurrentInstance();
   // 选资产按钮，是否可编辑
   const checkAssetsEdit = ref(true);
   // 主资产删除，是否可点击
   const assetsMultiple = ref(true);

   // -----------------最上方单据表单变量定义---------------------
   // 是否展示查询条件
   const showSearch = ref(true);
   // 上方单据表单显隐控制--已弃用，暂时保留，默认为true
   const invoiceFormOpen = ref(true);
   // 获取父页面传递过来的参数
   const route = useRoute();
   const parentInvoiceNumber = ref(route.query.invoiceNumber);
   // 定义表单数据
   const invoiceData = reactive({
      invoiceForm: {},
      assetsQueryParams: {
         pageNum: 1,
         pageSize: 10,
         invoiceNumber: null
      }
   });
   const { assetsQueryParams, invoiceForm } = toRefs(invoiceData);
   // 单据类型
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

   /** 单据表单通过修改跳转时显示数据 -- 最上方单据表单数据 */
   function handleUpdateInvoice() {
      if(parentInvoiceNumber.value != ""){
         getHouseRefineInvoice(parentInvoiceNumber.value).then(response => {
            invoiceForm.value = response.data;
            invoiceFormOpen.value = true;
            // 选资产按钮，不可点击
            checkAssetsEdit.value = false;
         });
      }else{
          // 选资产按钮，不可点击
          checkAssetsEdit.value = true;
         // 新增时，给下拉框赋初始值
         invoiceForm.value.invoiceStatus = '01';
         invoiceForm.value.invoiceType = '01';
      }

      assetsGetList();
   }
   //单据状态下拉框监听事件
   function dataSourcesFunction(value) {
      // console.log("单据状态下拉框监听事件"+value);
   }

   handleUpdateInvoice();
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
       const assetsCodes = selection.map(item => item.assetsCode);
       assetsMultiple.value = !selection.length;
   }
   // ---------------暂留脚本-----------------
   const single = ref(true);
   const multiple = ref(true);

</script>
