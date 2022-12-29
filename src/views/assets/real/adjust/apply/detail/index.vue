<template>
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
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="block-divider" v-if="showSearch"></div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['assets:add:apply:detail:add']">选资产</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-view"  :disabled="single" @click="handleView">查看</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Edit"  :disabled="single" @click="handleUpdate" v-hasPermi="['assets:add:apply:detail:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete"  :disabled="multiple" @click="handleDelete" v-hasPermi="['assets:add:apply:detail:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['system:dict:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <div>
      <el-table v-loading="loading" :data="detailList" @selection-change="handleSelectionChange" :height="height" stripe class="table-bottom">
        <el-table-column type="selection" width="55" align="center" />
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
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
      <!-- 导出弹窗 -->
      <!-- <export-choose ref="export" @handleExport="handleExport"/> -->
      <!-- 导入弹窗组件 -->
      <!-- <import-choose ref="import" @importTemplate="importTemplate" @getList="getList"/> -->
      <!-- 卡片弹窗 -->
      <card-choose ref="card" @submitForm="submitForm"/>
      <!-- 选资产 -->
      <detail-select  ref="child"  @handleAllDetailData="handleAllDetailData"  @handleDetailData="handleDetailData"/>
    </div>
  </div>
</template>

<script setup>
import {listDetail,addDetail,getDetail,updateDetail,delDetail} from "@/api/assets/real/adjust/detail";
import { onMounted, ref } from "@vue/runtime-core";
import cardChoose from "@/views/assets/real/card";
import detailSelect from "@/views/account/choose/choiceDetail"
import { useRoute } from 'vue-router';
const route = useRoute()
const { proxy } = getCurrentInstance();
/**
 * =============初始化字段=============
 */
// 遮罩层
const loading = ref(true);
// 选中数组
const ids=ref([]);
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
// 打开选资产卡片
const child = ref();
// 查询参数
const config = ref({
  ifOpen: true,
  detailParam: "real"
});
// 查询参数
const queryParams=ref({
  pageNum: 1,
  pageSize: 10,
  invoiceNumber: null,
  assetsCode: null,
  assetsName: null,
  makeFactory: null,
  departName: null,
  areaCode: null,
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
 */
//  function getHeight(){
//   let headheight = document.querySelector('.card-box');
//   searcheightcha = headheight.offsetHeight-47;
//   if(document.body.clientHeight > 340){
//       height = document.body.clientHeight - headheight.offsetHeight - 140;
//   }else{
//     height = 'auto';
//   }
// }
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
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  codes.value = selection.map(item => item.keyCode)
  single.value = selection.length!==1
  multiple.value = !selection.length
}
/** 选资产按钮操作 */
function handleAdd() {
  child.value.openSelect(config.value);
}
/** 查看按钮操作 */
function handleView() {
  const id = ids
  card.value.view(id,"资产明细","id");
}
/** 修改按钮操作 */
function handleUpdate(row) {
  var id = row.id || ids.value
  card.value.update(id,"资产编辑","id");
}
/** 提交按钮 */
function submitForm(form) {
  if (form.value.id != null) {
    updateDetail(form.value).then(response => {
      proxy.$modal.msgSuccess("修改成功");
      getList();
    });
  } else {
    addDetail(form.value).then(response => {
      proxy.$modal.msgSuccess("新增成功");
      getList();
    });
  }
}
/** 删除按钮操作 */
function handleDelete(row) {
  const idsParam = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除资产明细编号为"' + idsParam + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(function() {
      return delDetail(idsParam);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
}
/** 打开导出窗口 */
// function openExportPage() {
//   $refs.export.show("eamp_assets_detail");
// }
/** 导出按钮操作 */
// function handleExport(str, con) {
//   queryParams.value.searchValue = str;
//   queryParams.value.remark = con;
//   exportDetail(queryParams).then(response => {
//     download(response.msg);
//   }).catch(function() {});
// }
// /** 打开导入弹窗 */
// function handleImport() {
//   // 业务导入方法路径
//   const gen = process.env.VUE_APP_BASE_API;
//   const url = gen + "/assets/detail/importData";
//   // 导入模板字典键值
//   const dict = "";
//   // 其他参数（这里是单据编号）
//   const str = queryParams.value.invoiceNumber;
//   $refs.import.show(url, dict, str);
// }
// /** 下载模板操作 */
// function importTemplate(str) {
//   // str为导入模板字典的元素
//   importTemplate(str).then(response => {
//     download(response.msg);
//   });
// }
// /** 打开附件窗口 */
// function openAttachTable() {
//   const keycode = codes[0];
//   const tableName = 'eamp_assets_detail';
//   $refs.attach.show(keycode,tableName);
// }
/** 导出按钮操作 */
function handleExport() {
  proxy.download("business/adjust/detail/export", {
    ...queryParams.value,
  }, `job_log_${new Date().getTime()}.xlsx`);
}

function handleAllDetailData(rows){
  rows.forEach(row =>{
    row.id = null;
    submitForm(row);
    detailList.value.push(row);
  });
}

function handleDetailData (data){
  data[0].invoiceNumber = defaultNumber.value;
  data[0].id = null;
  addDetail(data[0]).then(response => {
    getList();
  });
}
</script>
