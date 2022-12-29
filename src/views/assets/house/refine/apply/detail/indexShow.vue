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

        <!--房屋细化资产部分页面-->
        <div class="div-editor-container-grey">
            <div class="app-container">
                <!--按钮操作部分-->
                <el-row :gutter="10" class="mb8">
                    <right-toolbar v-model:showSearch="showSearch" @queryTable="houseRefineGetList"></right-toolbar>
                </el-row>

                <!--房屋资产表格-->
                <el-table v-loading="houseRefineLoading" :data="houseRefineList" @selection-change="houseRefineHandleSelectionChange" :height="height">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="宗地编号" align="center" prop="parcelCode" />
                    <el-table-column label="权属状况名称" align="center" prop="ownershipConditionName" />
                    <el-table-column label="使用权类型名称" align="center" prop="usedrightTypeName" />
                    <el-table-column label="其他问题说明" align="center" prop="itemProblem" />
                </el-table>
                <pagination
                        v-show="houseRefineTotal > 0"
                        :total="houseRefineTotal"
                        v-model:page="houseRefineQueryParams.pageNum"
                        v-model:limit="houseRefineQueryParams.pageSize"
                        @pagination="houseRefineGetList" />
            </div>
        </div>

    </div>
</template>

<script setup>
   import { addHouseRefineInvoice, getHouseRefineInvoice, updateHouseRefineInvoice,
       getAssetsGetList, delAssetsDetail,
       addHouseRefineDeatil, updateHouseRefineDeatil, delHouseRefineDetail, getHouseRefineDetail, getHouseRefineGetList } from "@/api/assets/house/refine/detail";
   import { checkSendAuditDetail, sendInvoice } from "@/api/assets/house/refine/invoice"; // 资产单据脚本
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
   // --------------最下方房屋信息变量定义----------------
   // 新增按钮，是否可点击
   const houseRefineAddButton = ref(true);
   // 修改按钮，是否可点击
   const houserefineSingle = ref(true);
   // 删除按钮，是否可点击
   const houserefineMultiple = ref(true);
   // 打开资产信息卡片 -- 房屋卡片
   const cardAssetsForm = ref();
   // loading加载
   const houseRefineLoading = ref(true);
   // 分页初始条数
   const houseRefineTotal = ref(0);
   // 分页列表数据
   const houseRefineList = ref([]);

   // 定义分页查询数据
   const houseRefineData = reactive({
       houseRefineQueryParams: {
           pageNum: 1,
           pageSize: 10,
           assetsCode: "-1",
           invoiceNumber: "-1"
       }
   });
   const { houseRefineQueryParams } = toRefs(houseRefineData);
   const houseRefineIds = ref([]);

   /** 单据表单通过修改跳转时显示数据 -- 最上方单据表单数据 */
   function handleUpdateInvoice() {
      invoiceReset();
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
   /** 保存单据按钮操作--修改或新增 */
   function saveInvoice() {
      proxy.$refs["invoiceRef"].validate(valid => {
         if (valid) {
            if (invoiceForm.value.invoiceNumber != undefined) {
               updateHouseRefineInvoice(invoiceForm.value).then(response => {
                  proxy.$modal.msgSuccess("修改单据信息成功");
               });
            } else {
               addHouseRefineInvoice(invoiceForm.value).then(response => {
                   parentInvoiceNumber.value = response.msg;
                   handleUpdateInvoice();
                   proxy.$modal.msgSuccess("新增单据信息成功");
               });
            }
         }
      });
   }
   /** 单据表单重置 */
   function invoiceReset() {
      invoiceForm.value = {
         invoiceNumber: null,
         invoiceStatus: null,
         invoiceType: null,
         departName: null,
         detailAmount: null,
         originalValueSum: null,
         userCode: null,
         invoiceDate: null,
         auditOpinion: null,
         remark: null
      };
      proxy.resetForm("invoiceRef");
   }
   //单据状态下拉框监听事件
   function dataSourcesFunction(value) {
      // console.log("单据状态下拉框监听事件"+value);
   }
   // 送审按钮触发事件
   function sendAudit() {
       checkSendAuditDetail(parentInvoiceNumber.value).then(response => {
           if(response.data===0){
               proxy.$modal.msgError("单据中没有明细数据，不能送审！");
           }else{
               const selectInvoiceNumbers = parentInvoiceNumber.value;
               proxy.$modal.confirm('是否确认送审该数据项?', "提示", {
                   confirmButtonText: "确定",
                   cancelButtonText: "取消",
                   type: "warning"
               }).then(function() {
                   return sendInvoice(selectInvoiceNumbers);
               }).then(() => {
                   getList();
                   proxy.$modal.msgSuccess("送审成功");
               })
           }
       });
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
       const assetsCodes = selection.map(item => item.assetsCode);
       assetsMultiple.value = !selection.length;
       // 控制新增按钮是否可点击
       houseRefineAddButton.value = selection.length != 1;

       if(selection.length == 0 || selection.length > 1){
           // 查询房屋卡片列表数据，入参
           houseRefineQueryParams.value.assetsCode = "-1";
           houseRefineQueryParams.value.invoiceNumber = "-1";
           houseRefineGetList();
       }else{
           // 查询房屋卡片列表数据，入参
           houseRefineQueryParams.value.assetsCode = assetsCodes[0]==""?"-1":assetsCodes[0];
           houseRefineQueryParams.value.invoiceNumber = parentInvoiceNumber.value;
           houseRefineGetList();
       }
   }
   // 选资产弹窗确认保存事件回调
   function handleAllDetailData() {

   }
   function handleDetailData() {

   }
   // --------------最下方房屋信息相关脚本----------------
   function houseRefineGetListLoading() {
       houseRefineLoading.value = true;
       houseRefineLoading.value = false;
   }
   // 查询列表数据
   function houseRefineGetList() {
      houseRefineLoading.value = true;
      getHouseRefineGetList(houseRefineQueryParams.value).then(response => {
          houseRefineList.value = response.rows;
          houseRefineTotal.value = response.total;
          houseRefineLoading.value = false;
      });
   }
   // 表格checkBox选中行事件
   function houseRefineHandleSelectionChange(selection) {
       houseRefineIds.value = selection.map(item => item.id);
       houserefineSingle.value = selection.length != 1;
       houserefineMultiple.value = !selection.length;
   }
   // 卡片保存，子页面回调函数
   function saveSubmitForm(arrForm) {
       if(null!=arrForm.get("houseOpenFormData") && arrForm.get("houseOpenFormData").id != undefined){
           updateHouseRefineDeatil(arrForm.get("houseOpenFormData")).then(response => {
               proxy.$modal.msgSuccess("修改房屋信息成功");
               houseRefineGetList();
           });
       }else{
           addHouseRefineDeatil(arrForm.get("houseOpenFormData")).then(response => {
               proxy.$modal.msgSuccess("新增房屋信息成功");
               houseRefineGetList();
           });
       }
   }
   /** 新增房屋卡片按钮操作 */
   function handleAddHouseRefineAssets() {
      debugger;
      cardAssetsForm.value.addOpen(parentInvoiceNumber, "房屋新增卡片", false, false, false, true, false);
   }
   /** 修改房屋卡片按钮操作 */
   function handleLookHouseRefineAssets(row) {
       if(row.id != ""){
           const mapFormData = new Map();
           getHouseRefineDetail(row.id).then(response => {
               mapFormData.set("houseOpenFormData", response.data);
               cardAssetsForm.value.viewOpen(mapFormData, "房屋查看卡片", false, false, false, true, false);
           });
       }
   }
   /** 修改房屋卡片按钮操作 */
   function handleUpdateHouseRefineAssets(row) {
      const id = row.id || houseRefineIds.value[0];
      if(id != ""){
          const mapFormData = new Map();
          getHouseRefineDetail(id).then(response => {
              mapFormData.set("houseOpenFormData", response.data);
             cardAssetsForm.value.updateOpen(mapFormData, "房屋修改卡片", false, false, false, true, false);
         });
      }
   }
   // 删除房屋细化资产
   function handleDeleteHouseRefineAssets(row) {
       const houseRefineIdsCon = row.id || houseRefineIds.value;
       proxy.$modal.confirm('是否确认删除选中的数据项？').then(function() {
           return delHouseRefineDetail(houseRefineIdsCon);
       }).then(() => {
           houseRefineGetList();
           proxy.$modal.msgSuccess("删除成功");
       }).catch(() => {});
   }
   houseRefineGetListLoading();
   // ---------------暂留脚本-----------------
   const single = ref(true);
   const multiple = ref(true);

</script>
