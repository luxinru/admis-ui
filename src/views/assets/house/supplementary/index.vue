<template>
  <div>
    <div class="app-main-content">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="108px">
        <el-form-item label="项目编码/名称" prop="charItem1">
          <el-input
              v-model="queryParams.charItem1"
              placeholder="请输入"
              clearable
              @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="资产编码/名称" prop="assetsCode">
          <el-input
              v-model="queryParams.assetsCode"
              placeholder="请输入"
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
              type="primary"
              plain
              icon="Position"
              :disabled="submitData"
              @click="submitFun(null)"
          >提交</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <el-table v-loading="loading" :data="assetsDataList" @selection-change="handleSelectionChange" :height="height" :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="资产编码" align="center" prop="assetsCode" width="210"/>
        <el-table-column label="资产名称" align="center" prop="assetsName" width="200" :show-overflow-tooltip="true"/>
        <el-table-column label="项目编码" align="center" prop="charItem4" width="210"/>
        <el-table-column label="项目名称" align="center" prop="charItem1" width="210" :show-overflow-tooltip="true"/>
        <el-table-column label="资产类型" align="center" prop="assetsTypeName" width="210"/>
        <el-table-column label="补录情况" align="center" prop="isRecord" :formatter="isRecordFormat" width="210"/>
        <el-table-column label="所属单位" align="center" prop="departName" :show-overflow-tooltip="true" width="220"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="210">
          <template #default="scope">
            <el-button
                type="text"
                icon="Edit"
                @click="supplemetnaryRecordFun(scope.row)"
            >补录</el-button>
            <el-button
                type="text"
                icon="Position"
                @click="submitFun(scope.row)"
            >提交</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList" />
    </div>
    <!--新增及修改房屋资产卡片弹窗组件-->
    <house-refine-card-assets ref="cardAssetsForm" @saveSubmitForm="saveSubmitForm"/>
  </div>
</template>

<script setup>
import { assetsList, submitSupplementaryData, saveHouseSupplementaryRecordData,
  submitHouseSupplementaryRecordData, submitHouseSupplementaryRecordDataCheck } from "@/api/assets/house/supplementary/invoice";
import houseRefineCardAssets from '@/components/assets/index'; // 资产信息新增卡片弹窗
import { Base64 } from "js-base64";

//高度
const height = ref(408);
// 审批按钮
const submitData = ref(true);
const assetsDataList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const title = ref("");
const { proxy } = getCurrentInstance();
// 打开资产信息卡片 -- 房屋卡片
const cardAssetsForm = ref();
// 主资产键码
const mainAssetsKeyCode = ref();
// 主资产资产编码
const mainAssetsAssetsCode = ref();
// 主资产键码集合
const mainAssetsKeyCodes = ref([]);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10
  }
});
const { queryParams } = toRefs(data);

function tableRowClassName({ rowIndex }){
  if (rowIndex % 2 == 0) {
    return '';
  } else {
    return 'row-even-bg';
  }
}
function isRecordFormat(row) {
  let status = row.isRecord;
  if(status == "null"){
    return "未补录数据";
  } else if(status == "1"){
    return "补录完成未提交";
  } else if(status == "0"){
    return "补录完成已提交";
  }
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  submitData.value = !selection.length;
  mainAssetsKeyCodes.value = selection.map(item => item.keyCode);
}

/** 查询房屋单据列表 */
function getList() {
  loading.value = true;
  assetsList(queryParams.value).then(response => {
    assetsDataList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 提交按钮触发事件
function submitFun(row) {
  if(row != null){
    mainAssetsKeyCodes.value[0] = row.keyCode;
  }
  submitHouseSupplementaryRecordDataCheck(mainAssetsKeyCodes.value).then(response => {
    if(response.msg == ''){
      submitHouseSupplementaryRecordData(mainAssetsKeyCodes.value).then(response => {
          proxy.$modal.msgSuccess("提交房屋补录信息成功");
          getList();
      });
    }else{
      proxy.$modal.msgSuccess(response.msg);
    }
  });
}

// 补录按钮触发事件
function supplemetnaryRecordFun(row) {
  if(row.isRecord == 'null'){
    mainAssetsKeyCode.value = row.keyCode;
    mainAssetsAssetsCode.value = row.assetsCode;
    cardAssetsForm.value.addOpen(null, "房屋补录卡片", false, false, false, true, false);
  }else{
    proxy.$modal.msgSuccess("资产数据已经补录过房屋信息，无法再次补录！");
  }
}

// 补录
function saveSubmitForm(arrForm) {
  arrForm.get("houseOpenFormData").pkKeyCode = mainAssetsKeyCode.value;
  arrForm.get("houseOpenFormData").keyCode = mainAssetsKeyCode.value;
  arrForm.get("houseOpenFormData").assetsCode = mainAssetsAssetsCode.value;
  // 是否主资产（0:主资产 1:子资产）
  arrForm.get("houseOpenFormData").isMainAssets = 1;
  // 是否补录完成(0:是 1:否)
  arrForm.get("houseOpenFormData").isRecord = 1;
  saveHouseSupplementaryRecordData(arrForm.get("houseOpenFormData")).then(response => {
    proxy.$modal.msgSuccess("房屋信息补录成功");
    getList();
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

getList();

</script>
