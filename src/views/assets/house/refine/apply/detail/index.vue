<template>
  <div class="app-main-content">
    <!--单据表单及主资产部分页面-->
    <div class="div-editor-container-grey">
      <!--单据表单-->
      <div v-show="invoiceFormOpen" class="search-box">
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
          <el-table-column label="资产名称" align="center" prop="assetsName" width="200" :show-overflow-tooltip="true" />
          <el-table-column label="资产类别编码" align="center" prop="contentAssetsCode" width="220"/>
          <el-table-column label="规格型号" align="center" prop="assetsStandard" width="220"/>
          <el-table-column label="所属单位" align="center" prop="departName" width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="子资产数量" align="center" prop="sunNumber" width="220"/>
          <el-table-column label="使用状态" align="center" prop="usedStateName" width="220"/>
          <el-table-column label="位置" align="center" prop="charItem25" width="220"/>
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
    <div class="block-divider"></div>
    <!--房屋细化资产部分页面-->
    <div class="div-editor-container-grey">
      <div class="table-box">
        <!--按钮操作部分-->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
                type="primary"
                plain
                icon="Plus"
                :disabled="houseRefineAddButton"
                @click="handleAddHouseRefineAssets"
            >细化
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="success"
                plain
                icon="Edit"
                :disabled="houserefineSingle"
                @click="handleUpdateHouseRefineAssets"
            >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="danger"
                plain
                icon="Delete"
                :disabled="houserefineMultiple"
                @click="handleDeleteHouseRefineAssets(null)"
            >删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="success"
                plain
                icon="DocumentCopy"
                :disabled="houserefineSingle"
                @click="openCopyPage"
            >复制
            </el-button>
          </el-col>
          <!--<el-col :span="1.5">
              <el-button
                      type="success"
                      plain
                      icon="Collection"
                      :disabled="houserefineSingle"
                      @click="handleAddHouseRefineAssets"
              >保存&#45;&#45;没有这个了</el-button>
          </el-col>-->
<!--          <right-toolbar v-model:showSearch="showSearch" @queryTable="houseRefineGetList"></right-toolbar>-->
        </el-row>

        <!--房屋资产表格-->
        <el-table v-loading="houseRefineLoading" :data="houseRefineList"
                  @selection-change="houseRefineHandleSelectionChange" :height="heightTalbe" :row-class-name="tableRowClassName">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="资产编号" align="center" prop="assetsCode" width="270"/>
          <el-table-column label="宗地编号" align="center" prop="parcelCode"/>
          <el-table-column label="权属状况名称" align="center" prop="ownershipConditionName" width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="使用权类型名称" align="center" prop="usedrightTypeName" width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="其他问题说明" align="center" prop="itemProblem" width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="360">
            <template #default="scope">
              <div class="table-opera-btn">
                <el-button
                    type="text"
                    icon="View"
                    @click="handleLookHouseRefineAssets(scope.row)"
                >查看
                </el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button
                    type="text"
                    icon="Edit"
                    @click="handleUpdateHouseRefineAssets(scope.row)"
                >修改
                </el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button
                    type="text"
                    icon="Delete"
                    @click="handleDeleteHouseRefineAssets(scope.row)"
                >删除
                </el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button
                    type="text"
                    icon="Edit"
                    @click="handleAgainHouseRefineAssets(scope.row)"
                >再次细化
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="houseRefineTotal > 0"
          :total="houseRefineTotal"
          v-model:page="houseRefineQueryParams.pageNum"
          v-model:limit="houseRefineQueryParams.pageSize"
          @pagination="houseRefineGetList"/>
      </div>

      <!-- 复制数量弹窗 -->
      <copy-page ref="copyCard" @handleCopy="handleCopyData"/>

      <!--新增及修改房屋资产卡片弹窗组件-->
      <house-refine-card-assets ref="cardAssetsForm" @saveSubmitForm="saveSubmitForm"/>

      <!--选主资产弹窗-->
      <!--            <choose-assets ref="chooseAssetsRef" @handleAllDetailData="handleAllDetailData" @handleDetailData="handleDetailData" />-->
      <choose-assets :show="show" @get:data="getData" @update:show="updateShow" :dieAway="house"/>
    </div>
  </div>
</template>

<script setup>
import {
  copyHouseRefineDeatil,
  checkAssetsData, addAssetsData, addHouseRefineInvoice, getHouseRefineInvoice, updateHouseRefineInvoice,
  getAssetsGetList, delAssetsDetail, addAgainRefineData, selectMaxAssetsRefineCode,
  addHouseRefineDeatil, updateHouseRefineDeatil, delHouseRefineDetail, getHouseRefineDetail, getHouseRefineGetList
} from "@/api/assets/house/refine/detail";
import {checkSendAuditDetail, sendInvoice} from "@/api/assets/house/refine/invoice"; // 资产单据脚本
import houseRefineCardAssets from '@/components/assets/index'; // 资产信息新增卡片弹窗
import chooseAssets from "@/views/account/choose/choiceDetail";// 选资产弹窗组件
import copyPage from "@/views/assets/house/refine/components/apply/index";
// 定义router，用于获取父页面传递过来的参数
import {useRoute} from 'vue-router';
// 选资产弹窗开关
const show = ref(false);
const house = ref("house");

// 存放再次细化的资产数据
let againRefineRowData = ref();
// 复制数量弹窗
const copyCard = ref();
//高度
const height = ref(218);
const heightTalbe = ref(228);
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
  },
  againRefineForm: {}
});
const {assetsQueryParams, invoiceForm, againRefineForm} = toRefs(invoiceData);
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
const globalMainAssetsKeyCodes = ref([]);
// --------------最下方房屋信息变量定义----------------
// 子资产编码集合
const globalRefineAssetsKeyCodes = ref([]);
let keyCodeTemp = ref(null);
let assetsCodeTemp = ref(null);
let refineAssetsCode = ref(null);
// 新增按钮，是否可点击
const houseRefineAddButton = ref(true);
// 修改按钮，是否可点击
const houserefineSingle = ref(true);
// 删除按钮，是否可点击
const houserefineMultiple = ref(true);
// 打开资产信息卡片 -- 房屋卡片
const cardAssetsForm = ref();
// 选资产弹窗
const chooseAssetsRef = ref();
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
    invoiceNumber: "-1",
    assetsCode: "-1"
  }
});
const {houseRefineQueryParams} = toRefs(houseRefineData);
const houseRefineIds = ref([]);

/** 单据表单通过修改跳转时显示数据 -- 最上方单据表单数据 */
function handleUpdateInvoice() {
  invoiceReset();
  if (parentInvoiceNumber.value != "") {
    getHouseRefineInvoice(parentInvoiceNumber.value).then(response => {
      invoiceForm.value = response.data;
      invoiceFormOpen.value = true;
      // 选资产按钮，不可点击
      checkAssetsEdit.value = false;
    });
  } else {
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
    if (response.data === 0) {
      proxy.$modal.msgError("单据中没有明细数据，不能送审！");
    } else {
      const selectInvoiceNumbers = parentInvoiceNumber.value;
      proxy.$modal.confirm('是否确认送审该数据项?', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
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
  assetsPageQueryParams.value.invoiceNumber = parentInvoiceNumber.value == "" ? "xz" : parentInvoiceNumber.value;
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
  show.value = true;
}

// 删除资产
function handleDeleteAssets() {
  const obj = {
    invoiceNumber: parentInvoiceNumber.value,
    pkKeyCodes: globalMainAssetsKeyCodes.value
  };
  proxy.$modal.confirm('是否确认删除选中的数据项？').then(function () {
    return delAssetsDetail(obj);
  }).then(() => {
    assetsGetList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

// 主资产表格checkBox选中行事件
function assetsHandleSelectionChange(selection) {
  // 将detail表的id作为pkid
  assetsPkIds.value = selection.map(item => item.id);
  const ids = selection.map(item => item.id);
  const keyCodes = selection.map(item => item.keyCode);
  const assetsCodes = selection.map(item => item.assetsCode);
  globalMainAssetsKeyCodes.value = selection.map(item => item.keyCode);
  assetsMultiple.value = !selection.length;
  // 控制新增按钮是否可点击
  houseRefineAddButton.value = selection.length != 1;

  if (selection.length == 0 || selection.length > 1) {
    // 查询房屋卡片列表数据，入参
    houseRefineQueryParams.value.pkKeyCode = "-1";
    houseRefineGetList();
  } else {
    // 查询房屋卡片列表数据，入参
    houseRefineQueryParams.value.pkKeyCode = (keyCodes[0] == "" ? "-1" : keyCodes[0]);
    houseRefineGetList();
    keyCodeTemp = keyCodes[0] == "" ? null : keyCodes[0];
    assetsCodeTemp = assetsCodes[0] == "" ? null : assetsCodes[0];
  }
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

// 房屋附属变动数据，表格checkBox选中行事件
function houseRefineHandleSelectionChange(selection) {
  houseRefineIds.value = selection.map(item => item.id);
  houserefineSingle.value = selection.length != 1;
  houserefineMultiple.value = !selection.length;
  houseRefineRowData = selection;
  globalRefineAssetsKeyCodes.value = selection.map(item => item.keyCode);
  refineAssetsCode.value = selection.map(item => item.assetsCode);
}

// 卡片保存，子页面回调函数
function saveSubmitForm(arrForm) {
  if (arrForm.get("nextStepSureFunSign")) {
    againRefineRowData.value.varType = "FWX1";
    againRefineRowData.value.varTypeName = "细化前";
    arrForm.get('dataList').push(againRefineRowData.value);
    addAgainRefineData(arrForm.get('dataList')).then(response => {
      proxy.$modal.msgSuccess("再次细化成功！");
      houseRefineGetList();
    });
  } else {
    if (null != arrForm.get("houseOpenFormData") && arrForm.get("houseOpenFormData").keyCode != undefined) {
      updateHouseRefineDeatil(arrForm.get("houseOpenFormData")).then(response => {
        proxy.$modal.msgSuccess("修改房屋信息成功");
        houseRefineGetList();
      });
    } else {
      arrForm.get("houseOpenFormData").pkKeyCode = keyCodeTemp;
      arrForm.get("houseOpenFormData").assetsCode = assetsCodeTemp;
      arrForm.get("houseOpenFormData").invoiceNumber = parentInvoiceNumber.value;
      arrForm.get("houseOpenFormData").copyNumber = '1';
      addHouseRefineDeatil(arrForm.get("houseOpenFormData")).then(response => {
        proxy.$modal.msgSuccess("新增房屋信息成功");
        houseRefineGetList();
      });
    }
  }
}

/** 再次细化按钮操作 */
function handleAgainHouseRefineAssets(row) {
  // 将选中的再次细化的行数据，记录到全局变量中，供保存时，作为变动前记录，插入到房屋附属变动表中
  againRefineRowData.value = row;

  // 通过资产编码row.assetsCode 异步请求后端，获取最大新资产编码
  selectMaxAssetsRefineCode(row.assetsCode).then(response => {
    var sonFirstNumber = parseInt(response.msg);
    cardAssetsForm.value.againRefineOpen(parentInvoiceNumber, "房屋新增卡片", false, false, false, true, true, row.assetsCode, sonFirstNumber, row.pkKeyCode);
  });

}

/** 新增房屋卡片按钮操作 */
function handleAddHouseRefineAssets() {
  cardAssetsForm.value.addOpen(parentInvoiceNumber, "房屋新增卡片", false, false, false, true, false);
}

/** 修改房屋卡片按钮操作 */
function handleLookHouseRefineAssets(row) {
  if (row.id != "") {
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
  if (id != "") {
    const mapFormData = new Map();
    getHouseRefineDetail(id).then(response => {
      mapFormData.set("houseOpenFormData", response.data);
      cardAssetsForm.value.updateOpen(mapFormData, "房屋修改卡片", false, false, false, true, false);
    });
  }
}

// 删除房屋细化资产
function handleDeleteHouseRefineAssets(row) {
  const obj = {
    keyCodes: globalRefineAssetsKeyCodes.value,
    keyCode: row != null ? row.keyCode : null
  };
  proxy.$modal.confirm('是否确认删除选中的数据项？').then(function () {
    return delHouseRefineDetail(obj);
  }).then(() => {
    houseRefineGetList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 单据状态：01新建02被退回 */
function isMainAssetsFormat(row, column) {
  let isMainAssets = row.isMainAssets;
  if (isMainAssets == "0") {
    return "是";
  } else if (isMainAssets == "1") {
    return "否";
  }
}

// 复制按钮触发事件
function openCopyPage() {
  copyCard.value.show("复制");
}

// 复制弹窗回调函数
function handleCopyData(num) {
  houseRefineRowData[0].pkKeyCode = keyCodeTemp;
  houseRefineRowData[0].assetsCode = refineAssetsCode.value[0];
  houseRefineRowData[0].invoiceNumber = parentInvoiceNumber.value;
  houseRefineRowData[0].copyNumber = num;
  copyHouseRefineDeatil(houseRefineRowData[0]).then(response => {
    proxy.$modal.msgSuccess("复制房屋信息成功");
    houseRefineGetList();
  });
}
function tableRowClassName({ rowIndex }){
  if (rowIndex % 2 == 0) {
    return '';
  } else {
    return 'row-even-bg';
  }
}
houseRefineGetListLoading();
// ---------------暂留脚本-----------------
const single = ref(true);
const multiple = ref(true);

</script>
