<template>
  <div class="app-main-content">
    <!--单据表单及主资产部分页面-->
    <div class="div-editor-container-grey">
      <!--单据表单-->
      <div v-show="invoiceFormOpen">
        <el-form ref="invoiceRef" :model="invoiceForm" label-width="120px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="单据编号" prop="invoiceNumber" :title="invoiceForm.invoiceNumber">
                <el-input v-model="invoiceForm.invoiceNumber" disabled placeholder="自动生成"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单据状态" prop="invoiceStatus">
                <el-select v-model="invoiceForm.invoiceStatus" placeholder="请选择" @change="dataSourcesFunction"
                           disabled="false">
                  <el-option
                      v-for="item in invoiceStatusOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单据类型" prop="invoiceType">
                <el-select v-model="invoiceForm.invoiceType" placeholder="请选择" @change="dataSourcesFunction"
                           disabled="false">
                  <el-option
                      v-for="item in invoiceStatusOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属单位" prop="departName">
                <el-input v-model="invoiceForm.departName" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="明细数量" prop="detailAmount">
                <el-input v-model="invoiceForm.detailAmount" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="原值合计" prop="originalValueSum">
                <el-input v-model="invoiceForm.originalValueSum" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="制单人" prop="userCode">
                <el-input v-model="invoiceForm.userCode" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="制单日期" prop="invoiceDate">
                <el-input v-model="invoiceForm.invoiceDate" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
          <!--<el-row>
              <el-col :span="24">
                  <el-form-item label="审批意见" prop="auditOpinion">
                      <el-input v-model="invoiceForm.auditOpinion" placeholder="请输入内容" />
                  </el-form-item>
              </el-col>
          </el-row>-->
          <el-row>
            <el-col :span="6">
              <el-form-item label="项目编号" prop="projectCode">
                <el-input v-model="invoiceForm.projectCode"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="invoiceForm.projectName"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="invoiceForm.remark" placeholder="请输入内容"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style="display: flex;justify-content: flex-end;margin-bottom: 10px;">
          <el-button type="primary" @click="saveInvoice">保 存</el-button>
        </div>
      </div>
      <div class="block-divider" v-show="invoiceFormOpen"></div>
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
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
                type="primary"
                plain
                icon="Check"
                :disabled="checkAssetsEdit"
                @click="checkAssets"
            >选资产
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="danger"
                plain
                icon="Delete"
                :disabled="assetsMultiple"
                @click="handleDeleteAssets"
            >删除
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

    <!--选主资产弹窗-->
    <!--        <choose-assets ref="chooseAssetsRef" @handleAllDetailData="handleAllDetailData" @handleDetailData="handleDetailData" />-->
    <choose-assets :show="show" @get:data="getData" @update:show="updateShow" :dieAway="house"/>
  </div>
</template>

<script setup>
   import { checkAssetsData, addAssetsData, addHouseRepairInvoice, getHouseRefineInvoice, updateHouseRefineInvoice,
       getAssetsGetList, delAssetsDetail } from "@/api/assets/house/repair/detail";
   import { checkSendAuditDetail, sendInvoice } from "@/api/assets/house/repair/invoice"; // 资产单据脚本
   import chooseAssets from "@/views/account/choose/choiceDetail";// 选资产弹窗组件
   // 定义router，用于获取父页面传递过来的参数
   import { useRoute } from 'vue-router';

   // 主资产编码集合
   const globalMainAssetsKeyCodes = ref([]);
   // 选资产弹窗开关
   const show = ref(false);
   const house = ref("house");

//高度
const height = ref(218);
const {proxy} = getCurrentInstance();
// 选资产按钮，是否可编辑
const checkAssetsEdit = ref(true);
// 主资产删除，是否可点击
const assetsMultiple = ref(true);

// -----------------最上方单据表单变量定义---------------------
// 房屋细化子资产，单行数据
let houseRefineRowData = ref([]);
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
const {assetsQueryParams, invoiceForm} = toRefs(invoiceData);
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
    invoiceNumber: null,
    assetsCode: null
  }
});
const {assetsPageQueryParams} = toRefs(assetsData);
const assetsPkIds = ref([]);
// 主资产编码集合
const globalAssetsCodes = ref([]);
// 选资产弹窗
const chooseAssetsRef = ref();

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
                addHouseRepairInvoice(invoiceForm.value).then(response => {
                   parentInvoiceNumber.value = response.msg;
                   assetsPageQueryParams.invoiceNumber = parentInvoiceNumber.value;
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
         remark: null,
         projectName: null,
         projectCode: null
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
      assetsPageQueryParams.value.invoiceNumber = parentInvoiceNumber.value==""?"xz":parentInvoiceNumber.value;
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
       /*const obj = {
           invoiceNumber: parentInvoiceNumber.value,
           assetsCodes: globalAssetsCodes.value
       };*/
       const obj = {
           invoiceNumber: parentInvoiceNumber.value,
           pkKeyCodes: globalMainAssetsKeyCodes.value
       };
       proxy.$modal.confirm('是否确认删除选中的数据项？').then(function() {
           return delAssetsDetail(obj);
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
       const keyCodes = selection.map(item => item.keyCode);
       const assetsCodes = selection.map(item => item.assetsCode);
       globalAssetsCodes.value = selection.map(item => item.assetsCode);
       assetsMultiple.value = !selection.length;
       globalMainAssetsKeyCodes.value = selection.map(item => item.keyCode);
   }

// 选资产事件
function checkAssets() {
  show.value = true;
}

// 选资产弹窗确认保存事件回调
function getData(data) {
  let dataList = data.list;
  let message = "";
  // 循环遍历选中的资产，进行判断，是否允许做房屋细化；目前判断逻辑为：①资产大类为16；②资产中的房屋细化信息必须有数据
  for (let i = 0; i < dataList.length; i++) {
    dataList[i].markStatus = "FWX";
    dataList[i].invoiceNumber = parentInvoiceNumber.value;
    // 获取数据判断选择的资产数据，是否包含子资产，如果不包含，则不允许保存
    const contentAssetsCode = dataList[i].contentAssetsCode;// 模拟获取子资产信息
    const assetsCode = dataList[i].assetsCode;
    if (!(contentAssetsCode != null && contentAssetsCode.startsWith('16'))) {
      message += "资产" + assetsCode + "非16大类资产，不允许进行细化！";
    }
  }

  if (message == "") {
    // 调用接口保存数据
    addAssetsData(dataList).then(response => {
      proxy.$modal.msgSuccess("新增主资产成功");
      assetsGetList();
      handleUpdateInvoice();
    });
    /*// 调用接口保存校验数据
    checkAssetsData(dataList).then(response => {
        if(response.msg == ""){
            // 调用接口保存数据
            addAssetsData(dataList).then(response => {
                proxy.$modal.msgSuccess("新增主资产成功");
                assetsGetList();
                handleUpdateInvoice();
            });
        }else{
            proxy.$modal.msgError(response.msg);
        }
    });*/
  } else {
    proxy.$modal.msgError(message);
  }
}

// 选资产弹窗回调父页面，关闭弹窗
function updateShow(data) {
  if (show.value === true) {
    show.value = data
  }
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

</script>
