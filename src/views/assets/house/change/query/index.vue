<template #default="scope">
  <div class="app-main-content">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="资产编码" prop="invoiceNumber">
        <el-input v-model="queryParams.assetsCode" placeholder="请输入资产编码" clearable />
      </el-form-item>
      <el-form-item label="规格型号" prop="assetsStandard">
        <el-input v-model="queryParams.assetsStandard" placeholder="请输入规格型号" clearable />
      </el-form-item>
      <el-form-item label="所属单位" prop="departName">
        <el-input v-model="queryParams.departName" :title="queryParams.departName" readonly placeholder="请选择所属单位" maxlength="100">
          <template #append>
            <el-button icon="Search" @click="openDepartCard()"/>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="日期" prop="invoiceDate">
        <el-date-picker v-model="queryParams.invoiceDate" value-format="YYYY-MM" type="month" placeholder="选择月"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="block-divider" v-if="showSearch"></div>
    <el-row :gutter="8" class="mb8">
      <!--<el-col :span="1.5">
        <el-button type="primary" plain icon="Check" :disabled="single"
          @click="handleFindDifferent">查看差异</el-button>
      </el-col>-->
      <!--<el-col :span="1.5">-->
      <!--  <el-button type="primary" plain @click="handleBackInvoice">撤销</el-button>-->
      <!--</el-col>-->
      <el-col :span="1.5">
        <el-button type="primary" plain icon="View" :disabled="single" @click="handleDetail">查看资产详情</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain>自定义查询</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button type="primary" plain>导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="invoiceList" @selection-change="handleSelectionChange"
              :height="height" :row-class-name="tableRowClassName">
      <!--<el-table-column type="selection" width="55" align="center" />-->
      <!--<el-table-column label="是否主资产" align="center" prop="isMainAssets" :formatter="isMainAssetsFormat" />>
      <el-table-column label="宗地编码" align="center" prop="parcelCode" />
      <el-table-column label="权属状况编码" align="center" prop="ownershipConditionCode" />
      <el-table-column label="权属状况名称" align="center" prop="ownershipConditionName" />
      <el-table-column label="使用权类型编码" align="center" prop="usedrightTypeCode" />
      <el-table-column label="使用权类型名称" align="center" prop="usedrightTypeName" />
      <el-table-column label="土地面积" align="center" prop="landArea" />
      <el-table-column label="土地证号" align="center" prop="landCertificateNo" />
      <el-table-column label="土地使用权人" align="center" prop="landUsedHolder" />
      <el-table-column label="房产证号" align="center" prop="houseCertificateNo" />
      <el-table-column label="权利类型编码" align="center" prop="rightTypeCode" />
      <el-table-column label="权利类型名称" align="center" prop="rightTypeName" />
      <el-table-column label="权利性质编码" align="center" prop="rightNatureCode" />
      <el-table-column label="权利性质名称" align="center" prop="rightNatureName" />
      <el-table-column label="证载所有权人" align="center" prop="certificateHolder" />
      <el-table-column label="办证情况编码" align="center" prop="certificateHandlingCode" />
      <el-table-column label="办证情况名称" align="center" prop="certificateHandlingName" />
      <el-table-column label="记账是否相等" align="center" prop="bookkeeping" />
      <el-table-column label="无证原因" align="center" prop="noCertificateReason" />
      <el-table-column label="档案名称" align="center" prop="filesName" />
      <el-table-column label="实际名称" align="center" prop="actualName" />
      <el-table-column label="实物资产形成原因编码" align="center" prop="formReasonCode" />
      <el-table-column label="实物资产形成原因名称" align="center" prop="formReasonName" />
      <el-table-column label="实物资产补充说明" align="center" prop="realMoreInfo" />
      <el-table-column label="省" align="center" prop="province" />
      <el-table-column label="市" align="center" prop="city" />
      <el-table-column label="区" align="center" prop="county" />
      <el-table-column label="详细地址" align="center" prop="addressDetail" />
      <el-table-column label="经度" align="center" prop="longitude" />
      <el-table-column label="纬度" align="center" prop="latitude" />
      <el-table-column label="房屋结构编码" align="center" prop="houseStructureCode" />
      <el-table-column label="房屋结构名称" align="center" prop="houseStructureName" />
      <el-table-column label="建筑面积" align="center" prop="buildArea" />
      <el-table-column label="建筑物地上总层数编码" align="center" prop="floorsUpCode" />
      <el-table-column label="建筑物地上总层数名称" align="center" prop="floorsUpName" />
      <el-table-column label="建筑物地下总层数" align="center" prop="floorsDownCode" />
      <el-table-column label="建筑物地下总层数名称" align="center" prop="floorsDownName" />
      <el-table-column label="建筑信息备注" align="center" prop="buildInfoRemark" />
      <el-table-column label="管理单位-二级单位编码" align="center" prop="managerDepartTwoCode" />
      <el-table-column label="管理单位-二级单位名称" align="center" prop="managerDepartTwoName" />
      <el-table-column label="管理单位-三级单位编码" align="center" prop="managerDepartThreeCode" />
      <el-table-column label="管理单位-三级单位名称" align="center" prop="managerDepartThreeName" />
      <el-table-column label="管理单位责任人" align="center" prop="managerDutyName" />
      <el-table-column label="管理单位责任人联系方式" align="center" prop="managerDutyPhone" />
      <el-table-column label="使用单位-类别编码" align="center" prop="usedDepartCategory" />
      <el-table-column label="使用单位-类别名称" align="center" prop="usedDepartCategoryName" />
      <el-table-column label="使用单位-二级单位编码" align="center" prop="usedDepartTwoCode" />
      <el-table-column label="使用单位-二级单位名称" align="center" prop="usedDepartTwoName" />
      <el-table-column label="使用单位-三级单位编码" align="center" prop="usedDepartThreeCode" />
      <el-table-column label="使用单位-三级单位名称" align="center" prop="usedDepartThreeName" />
      <el-table-column label="使用单位-外部单位" align="center" prop="usedDepartPartnerCode" />
      <el-table-column label="使用单位-外部单位" align="center" prop="usedDepartPartnerName" />
      <el-table-column label="运营单位-类别编码" align="center" prop="operateDepartCategory" />
      <el-table-column label="运营单位-类别名称" align="center" prop="operateDepartCategoryName" />
      <el-table-column label="土地使用税计缴编码" align="center" prop="landUsedTaxCode" />
      <el-table-column label="土地使用税计缴名称" align="center" prop="landUsedTaxName" />
      <el-table-column label="税源属地" align="center" prop="taxSourceCity" />
      <el-table-column label="征税机关" align="center" prop="taxOffice" />
      <el-table-column label="税务局代码" align="center" prop="taxBureauCode" />
      <el-table-column label="土地使用税适用税率" align="center" prop="taxRateLand" />
      <el-table-column label="房产税计缴编码" align="center" prop="houseTaxCode" />
      <el-table-column label="房产税计缴名称" align="center" prop="houseTaxName" />
      <el-table-column label="年租金收入" align="center" prop="annualRent" />
      <el-table-column label="使用性质编码" align="center" prop="usedNatureCode" />
      <el-table-column label="使用性质名称" align="center" prop="usedNatureName" />
      <el-table-column label="楼层" align="center" prop="floorsNumber" />
      <el-table-column label="实际用途编码" align="center" prop="actualUsedCode" />
      <el-table-column label="实际用途名称" align="center" prop="actualUsedName" />
      <el-table-column label="开始停用/闲置/租出日期" align="center" prop="stopUsedDate" />
      <el-table-column label="公有房屋面积合计" align="center" prop="publicHouseArea" />
      <el-table-column label="办公用房-间数" align="center" prop="officeRoomsCount" />
      <el-table-column label="办公用房-使用面积" align="center" prop="officeUsedArea" />
      <el-table-column label="办公用房-实际办公人数" align="center" prop="officePeopleCount" />
      <el-table-column label="会议用房-间数" align="center" prop="meetingRoomsCount" />
      <el-table-column label="会议用房使用面积" align="center" prop="meetingUsedArea" />
      <el-table-column label="停车场-用途编码" align="center" prop="parkingUsedCode" />
      <el-table-column label="停车场-用途名称" align="center" prop="parkingUsedName" />
      <el-table-column label="停车场-车位数" align="center" prop="parkingSpaceCount" />
      <el-table-column label="停车场-使用面积" align="center" prop="parkingUsedArea" />
      <el-table-column label="其他房屋-间数" align="center" prop="otherRoomdCount" />
      <el-table-column label="其他房屋-使用面积" align="center" prop="otherUsedArea" />
      <el-table-column label="垂直电梯-部数" align="center" prop="elevatorCount" />
      <el-table-column label="相关事项说明-证照与权属不一" align="center" prop="itemLicenceOwnershipDiff" />
      <el-table-column label="相关事项说明-房产与地产权属不一" align="center" prop="itemHouseLandDiff" />
      <el-table-column label="相关事项说明-安全/环保/管理等隐患" align="center" prop="itemHideenDanger" />
      <el-table-column label="相关事项说明-无偿占用或使用" align="center" prop="itemFreeUsed" />
      <el-table-column label="相关事项说明-产权纠纷" align="center" prop="itemPropertyDispute" />
      <el-table-column label="相关事项说明-账实不符" align="center" prop="itemAccountRealDiff" />
      <el-table-column label="相关事项说明-档案资料缺失" align="center" prop="itemFilesMissing" />
      <el-table-column label="相关事项说明-资产闲置" align="center" prop="itemAssetsUseless" />
      <el-table-column label="相关事项说明-部分拆除或置换" align="center" prop="itemDisplace" />
      <el-table-column label="相关事项说明-已出售未下账" align="center" prop="itemSoldNoRecorded" />
      <el-table-column label="相关事项说明-涉诉事项" align="center" prop="itemLawsuit" />
      <el-table-column label="相关事项说明-其他问题" align="center" prop="itemProblem" />-->
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="是否主资产" align="center" prop="isMainAssets" :formatter="isMainAssetsFormat" width="120" />
      <el-table-column label="资产编码" align="center" prop="assetsCode" width="180" />
      <el-table-column label="资产名称" align="center" prop="assetsName" width="140" :show-overflow-tooltip="true" />
      <el-table-column label="资产类型" align="center" prop="assetsTypeName" width="140" />
      <el-table-column label="资产分类" align="center" prop="contentAssetsName" />
      <el-table-column label="规格型号" align="center" prop="assetsStandard" width="120" />
      <el-table-column label="所属单位" align="center" prop="departName" width="220" :show-overflow-tooltip="true" />
      <el-table-column label="权属状况" align="center" prop="ownershipConditionName" width="140" :show-overflow-tooltip="true" />
      <el-table-column label="使用权类型" align="center" prop="usedrightTypeName" width="130" />
      <el-table-column label="土地面积" align="center" prop="landArea" />
      <el-table-column label="土地证号" align="center" prop="landCertificateNo" width="120" :show-overflow-tooltip="true" />
      <el-table-column label="房产证号" align="center" prop="houseCertificateNo" width="150" :show-overflow-tooltip="true" />
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList" />
    <!-- 调用所属单位-->
    <depart-code ref="refDepartCard" @handleDepartCard="handleDepartCard"/>
    <!--新增及修改房屋资产卡片弹窗组件-->
    <house-refine-card-assets ref="cardAssetsForm" @saveSubmitForm="saveSubmitForm"/>
  </div>
</template>

<script setup>
import {listHouseQuery, handleBack,handleFindDiff} from "@/api/assets/house/change/query";
import { getHouseRefineDetail } from "@/api/assets/house/refine/detail";
import departCode from "@/views/system/card/depart/index";
import houseRefineCardAssets from '@/components/assets/index';
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
// 是否显示弹出层
const open = ref(false);
// 单位弹窗
const deptdailogSign = ref(false);
//高度
const height = ref(408);
// 选资产弹窗
const chooseAssetsRef = ref();
// 所属单位弹窗
const refDepartCard = ref();
// 打开资产信息卡片 -- 房屋卡片
const cardAssetsForm = ref();
// 查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  dataFilter: null
});
getList();
// 表单参数
const form=ref({});

/** 查询资产单据列表 */
function getList() {
    loading.value = true;
    queryParams.value.varType = 'FWF2';
    queryParams.value.deleteStatus = 0;
    listHouseQuery(proxy.addDateRange(queryParams.value)).then(res => {
    loading.value = false;
    invoiceList.value = res.rows;
    total.value = res.total;
  });
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
/** 导出按钮操作 */
function handleExport() {
  proxy.download("house/change/query/export", {
    ...queryParams.value
  }, `post_${new Date().getTime()}.xlsx`);
}

/** 撤销按钮操作 */
function handleBackInvoice() {
    const idsArr = ids.value;
    proxy.$modal.confirm('是否确认撤销此数据项?', "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(function() {
      return handleBack(idsArr);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("撤销成功");
    })
}

function handleFindDifferent() {
  const idsArr = ids.value;
  handleFindDiff(idsArr).then(response => {
               proxy.$modal.alert(response.msg)});
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length!==1
  multiple.value = !selection.length
}

function isMainAssetsFormat(row, column) {
  let status = row.isMainAssets;
  if(status == 0){
    return "主资产";
  } else if(status == 1){
    return "子资产";
  }
}
/** 打开所属单位字典*/
function openDepartCard(){
  refDepartCard.value.openCard('所属单位');
}
/** 获取所属单位字典的数据*/
function handleDepartCard(row){
  queryParams.value.departName = row.departName;
  queryParams.value.departCode = row.departCode;
}

/** 修改房屋卡片按钮操作 */
function handleDetail() {
  const mapFormData = new Map();
  getHouseRefineDetail(ids.value).then(response => {
    mapFormData.set("houseOpenFormData", response.data);
    cardAssetsForm.value.viewOpen(mapFormData, "房屋查看卡片", true, true, true, true, true);
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
