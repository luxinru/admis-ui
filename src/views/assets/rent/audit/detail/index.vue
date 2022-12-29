<template>
  <div>
    <div class="app-main-content">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="资产编码" prop="assetsCode">
          <el-input
            v-model="queryParams.assetsCode"
            placeholder="请输入资产编码"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="资产名称" prop="assetsName">
          <el-input
            v-model="queryParams.assetsName"
            placeholder="请输入资产名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search"  @click="handleQuery">搜索</el-button>
          <!--<el-button type="primary" icon="Filter" >筛选</el-button>-->
          <el-button  icon="Refresh"  @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="block-divider" v-if="showSearch"></div>
  <!--    <el-row :gutter="10" class="mb8">-->
  <!--      <el-col :span="1.5">-->
  <!--        <el-button type="primary" plain icon="Share"   @click="getContract">获取合同信息</el-button>-->
  <!--      </el-col>-->
  <!--&lt;!&ndash;      <el-col :span="1.5">&ndash;&gt;-->
  <!--&lt;!&ndash;        <el-button type="primary" plain icon="Folder"  @click="handleSave">保存</el-button>&ndash;&gt;-->
  <!--&lt;!&ndash;      </el-col>&ndash;&gt;-->
  <!--      <el-col :span="1.5">-->
  <!--        <el-button type="primary" plain icon="Plus"  @click="handleUpdate"  >变更</el-button>-->
  <!--      </el-col>-->
  <!--      <el-col :span="1.5">-->
  <!--        <el-button type="danger" plain icon="Delete" @click="handleDelete">删除</el-button>-->
  <!--      </el-col>-->
  <!--      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
  <!--    </el-row>-->
      <el-table v-loading="loading" :data="detailList" :highlight-current-row="true" @row-click="handleSelectionChange" :height="height" stripe class="table-bottom">
        <!--        <el-table-column type="selection" width="55" align="center" />-->
        <!--        <el-table-column label="资产类别" align="center" prop="contentAssetsCode" width="200"/>-->
        <el-table-column label="资产编码" align="center" prop="assetsCode" width="120"/>
        <el-table-column label="资产名称" align="center" prop="assetsName" width="150" :show-overflow-tooltip="true"/>
        <el-table-column label="规格型号" align="center" prop="assetsStandard" width="150" :show-overflow-tooltip="true"/>
        <el-table-column label="数量" align="center" prop="singleAmount" width="100"/>
        <el-table-column label="参考原值" align="center" prop="referenceOriginalValue" width="150"/>
        <el-table-column label="计量单位" align="center" prop="unitCode" width="150"/>
        <el-table-column label="制造厂家" align="center" prop="makeFactory" width="150" :show-overflow-tooltip="true"/>
        <el-table-column label="出厂日期" align="center" prop="productDate" width="150"/>
        <el-table-column label="所属单位" align="center" prop="departName" width="200" :show-overflow-tooltip="true"/>
        <el-table-column label="投产日期" align="center" prop="operateDate" width="120"/>
        <el-table-column label="存放安装地点" align="center" prop="storePlace" width="150" :show-overflow-tooltip="true"/>
        <el-table-column label="保管人" align="center" prop="userPerson" width="150"/>
        <el-table-column label="增加原因" align="center" prop="addReasonName" width="150" :show-overflow-tooltip="true"/>
        <el-table-column label="使用状况" align="center" prop="usedStateName"  width="150"/>
        <el-table-column label="资产类型" align="center" prop="assetsTypeName" width="150"/>
        <el-table-column label="技术状况" align="center" prop="technicalConditionName" width="150"/>
        <el-table-column label="所属区块" align="center" prop="areaName" width="150"  />
        <el-table-column label="备注" align="center" prop="remark" width="150" :show-overflow-tooltip="true"/>
      </el-table>
      <!-- 页面分页吸底添加 class="fixed-bottom" 弹窗类分页不添加-->
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                  v-model:limit="queryParams.pageSize" @pagination="getList" class="fixed-bottom"/>
    </div>
    <!--合同 -->
    <el-card class="box-card" shadow="always">
      <template #header>
        <div class="card-header">
          <span>合同信息</span>
        </div>
      </template>
      <el-table v-loading="contractLoading" :highlight-current-row="true" :data="contractDetailList" @row-click="handleContractSelectionChange" :height="height" stripe class="table-bottom">
        <el-table-column label="合同基本信息" align="center">
          <el-table-column label="合同编号" align="center" prop="contractCode" width="150"/>
          <el-table-column label="合同名称" align="center" prop="contractName" width="150"/>
          <el-table-column label="签订日期" align="center" prop="contractDate" width="150"/>
          <el-table-column label="合同金额" align="center" prop="" width="150"/>
          <el-table-column label="币种" align="center" prop="" width="150"/>
          <el-table-column label="合同附件" align="center" prop="" width="150"/>
        </el-table-column>
        <el-table-column label="租赁日期信息" align="center">
          <el-table-column label="履行开始日期" align="center" prop="performStartDate" width="150"/>
          <el-table-column label="履行结束日期" align="center" prop="performEndDate" width="150"/>
          <el-table-column label="租赁期实际开始日期" align="center" prop="rentStartDate" width="150"/>
          <el-table-column label="租赁期" align="center" prop="rentPeriod" width="150"/>
        </el-table-column>
        <el-table-column label="租赁属性信息" align="center">
          <el-table-column label="购买选择权" align="center" prop="purchaseOption" width="150"/>
          <el-table-column label="购买行权日期" align="center" prop="purchaseOptionDate" width="150"/>
          <el-table-column label="终止选择权" align="center" prop="stopOption" width="150"/>
          <el-table-column label="终止行权日期" align="center" prop="stopOptionDate" width="150"/>
          <el-table-column label="租赁方式" align="center" prop="rentTypeName" width="150"/>
          <el-table-column label="租赁金额类别" align="center" prop="rentMoneyCategoryName" width="150"/>
          <el-table-column label="标的类别" align="center" prop="targetCategoryName" width="150"/>
          <el-table-column label="承租方单位类型" align="center" prop="rentDepartTypeName" width="150"/>
          <el-table-column label="承租方单位" align="center" prop="rentDepartName" width="150"/>
          <el-table-column label="往来单位" align="center" prop="comegoDepartCode" width="150"/>
          <el-table-column label="功能范围" align="center" prop="functionalScope" width="150"/>
          <el-table-column label="备注" align="center" prop="remark" width="150"/>
        </el-table-column>
        <el-table-column label="租赁价值信息" align="center">
          <el-table-column label="内含报酬率（年）" align="center" prop="rewardRateYear" width="150"/>
          <el-table-column label="内含报酬率（月）" align="center" prop="rewardRateMonth" width="150"/>
          <el-table-column label="出租比例" align="center" prop="rentRatio" width="150"/>
          <el-table-column label="已出租比例" align="center" prop="rentedRatio" width="150"/>
          <el-table-column label="租赁金额（不含税）" align="center" prop="rentMoney" width="220"/>
          <el-table-column label="当年入账金额（不含税）" align="center" prop="recordedMoney" width="220"/>
          <el-table-column label="初始直接费用（不含税）" align="center" prop="initCost" width="220"/>
          <el-table-column label="拆卸复原成本（不含税）" align="center" prop="recoverCost" width="220"/>
          <el-table-column label="租赁实际开始日前预付租金（不含税）" align="center" prop="prepaidRentMoney" width="250"/>
          <el-table-column label="租赁期实际开始日付款额（不含税）" align="center" prop="paymentMoney" width="250"/>
          <el-table-column label="担保余值支付金额（不含税）" align="center" prop="assureMoney" width="220"/>
          <el-table-column label="购买选择权行权价格（不含税）" align="center" prop="purchaseOptionMoney" width="220"/>
          <el-table-column label="终止行权价格（不含税）" align="center" prop="stopOptionMoney" width="220"/>
          <el-table-column label="已收到租赁激励金额（不含税）" align="center" prop="rewardFee" width="220"/>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 卡片弹窗 -->
    <card-choose ref="card" @submitForm="submitForm"/>
  </div>
</template>

<script setup>
import {listDetail} from "@/api/assets/rent/edit/detail";
import {addDetail, updateDetail,getDetailDetail,delDetail} from "@/api/assets/rent/contract/detail";
import { onMounted, ref } from "@vue/runtime-core";
import cardChoose from "@/views/assets/rent/contrat/card";
import { useRoute } from 'vue-router';
const route = useRoute()
const { proxy } = getCurrentInstance();
/**
 * =============初始化字段=============
 */
// 遮罩层
const loading = ref(true);
// 遮罩层
const contractLoading = ref(false);
// 选中数组
const ids=ref([]);
// 合同id
const contractId=ref();
const codes=ref([]);
// 非单个禁用
const single=ref(true);
// 非多个禁用
const multiple=ref(true);
// 显示搜索条件
const showSearch=ref(true);
// 总条数
const total=ref(0);
// 筛选弹窗
const screeningOpen=ref(false);
// 资产明细表格数据
const detailList=ref([]);
// 合同表格数据
const contractDetailList=ref([]);
// 默认单据编号
const defaultNumber=ref(route.query.invoiceNumber);
// 资产类型
const assetsTypeOptions=ref([]);
// 资产状态字典
const assetsStatusOptions=ref([]);
// 设备类型字典
const equipTypeOptions=ref([]);
// 使用状况字典
const usedStateOptions=ref([]);
// 所属区块字典
const areaCodeOptions=ref([]);
const unitCodeOptions=ref([]);
//高度
const height=ref(408);
//显示搜索区域高度-隐藏搜索区域高度
const searcheightcha=ref('');
// 打开资产卡片
const card = ref();
// 查询参数
const queryParams=ref({
  pageNum: 1,
  pageSize: 20,
  invoiceNumber: null,
  assetsCode: null,
  assetsName: null,
  makeFactory: null,
  departName: null,
  areaCode: null,
});
// 查询参数
const queryContractParams=ref({
  pageNum: 1,
  pageSize: 20,
  assetsCode: null,
  assetsName: null
});
queryParams.value.invoiceNumber = route.query.invoiceNumber;

getList();

/**
 * =============钩子函数===============
 */

 onMounted(() => {
  console.log(card.value);
  console.log(route.query,"接收的query参数");
  /* 窗口变化时自适应 监听窗口变化 */
  // window.addEventListener('resize', getHeight)
})

/**
 * =============自定义方法=============

/** 查询资产明细列表 */
function getList() {
  console.log(queryParams.value.invoiceNumber);
  loading.value = true;
  listDetail(proxy.addDateRange(queryParams.value)).then(response => {
    detailList.value = response.rows;
    total.value = response.total;
    // getHeight();
    loading.value = false;
  });
}

/** 查询资产明细合同列表 */
function getContractList() {
  contractLoading.value = true;
  getDetailDetail(proxy.addDateRange(queryContractParams.value)).then(response => {
    contractDetailList.value = response.rows;
    contractLoading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  if(queryParams.value.assetsCode == ""){
    queryParams.value.assetsCode = null;
  }
  if(queryParams.value.assetsName == ""){
    queryParams.value.assetsName = null;
  }
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  queryParams.value.invoiceNumber = defaultNumber.value;
  proxy.resetForm("queryForm");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(row, column, event) {
  queryContractParams.value.assetsCode = row.assetsCode;
  getContractList();
}
// 多选框选中数据
function handleContractSelectionChange(row, column, event) {
  contractId.value = row.id;
  console.log(contractId.value);
}

// 获取合同信息
function getContract(){

}

// 保存
function handleSave(){

}

/** 变更按钮操作 */
function handleUpdate() {
  card.value.update(contractId.value,"合同变更","id");
}

/** 删除按钮操作 */
function handleDelete() {
  const idsParam = contractId.value;
  console.log(idsParam);
  proxy.$modal.confirm('是否确认删除?', "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function() {
    return delDetail(idsParam);
  }).then(() => {
    getContractList();
    proxy.$modal.msgSuccess("删除成功");
  })
}
/** 提交按钮 */
function submitForm(form) {
  if (form.value.id != null) {
    form.value.assetsCode = queryContractParams.value.assetsCode;
    updateDetail(form.value).then(response => {
      proxy.$modal.msgSuccess("修改成功");
      getContractList();
    });
  } else {
    form.value.assetsCode = queryContractParams.value.assetsCode;
    addDetail(form.value).then(response => {
      proxy.$modal.msgSuccess("新增成功");
      getContractList();
    });
  }
}
</script>

<style>
.box-card {
  width: 99%;
  margin-left: 10px;
}
</style>
