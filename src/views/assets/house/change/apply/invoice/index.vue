<template #default="scope">
  <div class="app-main-content">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
          <el-button
                  type="primary"
                  plain
                  icon="Check"
                  @click="checkAssets"
          >选资产</el-button>
      </el-col>
            <el-col :span="1.5">
        <el-button type="primary" plain icon="Edit" :disabled="single"   @click="handleUpdate"
          v-hasPermi="['assets:add:apply:invoice:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete"
          @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table v-loading="loading" :data="invoiceList" @selection-change="handleSelectionChange"
        :height="height" :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="资产编码" align="center" prop="assetsCode" width="180" />
      <el-table-column label="资产名称" align="center" prop="assetsName" width="140" :show-overflow-tooltip="true" />
      <el-table-column label="资产类型" align="center" prop="assetsTypeName" width="140" />
      <el-table-column label="资产分类" align="center" prop="contentAssetsName" />
      <el-table-column label="规格型号" align="center" prop="assetsStandard" width="120" :show-overflow-tooltip="true" />
      <el-table-column label="所属单位" align="center" prop="departName" width="220" :show-overflow-tooltip="true" />
      <el-table-column label="权属状况" align="center" prop="ownershipConditionName" width="140" :show-overflow-tooltip="true" />
      <el-table-column label="使用权类型" align="center" prop="usedrightTypeName" width="130" />
      <el-table-column label="土地面积" align="center" prop="landArea" />
      <el-table-column label="土地证号" align="center" prop="landCertificateNo" width="120" :show-overflow-tooltip="true" />
      <el-table-column label="房产证号" align="center" prop="houseCertificateNo" width="150" :show-overflow-tooltip="true" />
      <!--<el-table-column label="主键" align="center" prop="id" width="155">-->
      <!--</el-table-column>-->
      <!--<el-table-column label="keyCode" align="center" prop="keyCode" width="155" :show-overflow-tooltip="true">-->
      <!--</el-table-column>-->
      </el-table>
    </el-row>
    <!--新增及修改房屋资产卡片弹窗组件-->
    <house-refine-card-assets ref="cardAssetsForm" @saveSubmitForm="saveSubmitForm"/>
    <!--选主资产弹窗-->
    <choose-assets :show="show" @get:data="getData" @update:show="updateShow" :dieAway="house"/>
  </div>
</template>
<style>

</style>
<script setup>
import {getHouseRefineDetail,updateHouseRefineDeatil} from "@/api/assets/house/change/invoice";
import chooseAssets from "@/views/account/choose/choiceDetail";// 选资产弹窗组件
import houseRefineCardAssets from '@/components/assets/index'; // 资产信息新增卡片弹窗
import { onMounted } from "@vue/runtime-core";
import { ElTreeV2 } from 'element-plus'
import { Base64 } from "js-base64";
const { proxy } = getCurrentInstance();
/**
 * =============初始化字段=============
 */
// 遮罩层
const loading = ref(true);
// 选中数组
const ids = ref([]);
const keyCodes = ref([]);
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
// 打开资产信息卡片 -- 房屋卡片
const cardAssetsForm = ref();
// 选资产弹窗开关
const show = ref(false);
const house = ref("house");
// 查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 20,
  dataFilter: null
});
getList();
// 表单参数
const form=ref({});
function tableRowClassName({ rowIndex }){
  if (rowIndex % 2 == 0) {
    return '';
  } else {
    return 'row-even-bg';
  }
}
/** 查询资产单据列表 */
function getList() {
  loading.value = false;
}

// 选资产事件
function checkAssets() {
    show.value = true;
}

// 选资产弹窗确认保存事件回调
function getData(data) {
    let dataList = data.list;
    // 循环遍历选中的资产，进行判断，是否允许做房屋细化；目前判断逻辑为：①资产大类为16；②资产中的房屋细化信息必须有数据
    for (let i = 0; i < dataList.length; i++) {
        invoiceList.value.push( {
           "assetsCode":dataList[i].assetsCode
           ,"assetsName":dataList[i].assetsName
           ,"assetsTypeName":dataList[i].assetsTypeName
           ,"contentAssetsName":dataList[i].contentAssetsName
           ,"assetsStandard":dataList[i].assetsStandard
           ,"departName":dataList[i].departName
           ,"ownershipConditionName":dataList[i].ownershipConditionName
           ,"usedrightTypeName":dataList[i].usedrightTypeName
           ,"landArea":dataList[i].landArea
           ,"landCertificateNo":dataList[i].landCertificateNo
           ,"houseCertificateNo":dataList[i].houseCertificateNo
           ,"keyCode":dataList[i].keyCode
           ,"id":dataList[i].id
           });
    }
}

// 选资产弹窗回调父页面，关闭弹窗
function updateShow(data) {
    if(show.value===true){
        show.value = data
    }
}

function handleDelete() {
  // console.log(row)
  const id = ids.value
  ids.value.forEach(item => {
    const currIndex = invoiceList.value.findIndex((subItem)=>{return item === subItem.id})
    invoiceList.value.splice(currIndex, 1)
  });
}

/** 修改房屋卡片按钮操作 */
function handleUpdate(row) {
  const keyCode =  row.keyCode || keyCodes.value
  if(keyCode != ""){
      const mapFormData = new Map();
      getHouseRefineDetail(keyCode).then(response => {
          mapFormData.set("materialObjectFormData", response.data.adpAssetsdetail);
          mapFormData.set("technologyOpenFormData", response.data.adpTechnicaldetail);
          mapFormData.set("houseOpenFormData", response.data.adpHouseDetail);
          mapFormData.set("cardType", 'houseChangeCard1');
          cardAssetsForm.value.updateOpen(mapFormData, "房屋修改卡片", true, false, false, true, true);
      });
  }
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  keyCodes.value = selection.map(item => item.keyCode)
  single.value = selection.length!==1
  multiple.value = !selection.length
}

// 卡片保存，子页面回调函数
function saveSubmitForm(arrForm) {
  const params = {
    ...arrForm.get("materialObjectFormData"),
    ...arrForm.get("technologyOpenFormData"),
    ...arrForm.get("houseOpenFormData")
  }
  updateHouseRefineDeatil(params).then(response => {
      proxy.$modal.msgSuccess("修改房屋信息成功");
  });
}

</script>
