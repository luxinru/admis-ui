<template>
  <div>
    <el-dialog :title="title" v-model="open" width="50vw" top="5vh" append-to-body>
      <div class="app-container">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Bottom" @click="toDownLevel(currentRow.value)">下级</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Top" @click="backUpLevel">上级</el-button>
          </el-col>
        </el-row>
        <el-table  @current-change="getRowData"  highlight-current-row v-loading="loading" :data="dataList" @row-dblclick="toDownLevel" >
          <el-table-column label="目录编码" prop="contentsCode" />
          <el-table-column label="目录名称" prop="contentsName"  />
          <el-table-column label="是否明细" prop="markTail" :formatter="markTailFormatter" />
        </el-table>
      </div>
      <template #footer>
        <div>
        <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getPageList"/>
        </div>
        <div style="margin-top: 30px">
          <el-button type="primary" @click="confirm()" v-if="!visible">确 定</el-button>
          <el-button @click="close()">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="css" scoped>
/* 改成局部样式否则会影响全局弹窗和表格 */
.el-dialog {
  margin: 5vh auto !important;
}

.el-dialog__body {
  height: 50vh;
  overflow: hidden;
}
.el-table{
  height: 50vh;
}
</style>
<script setup name = "addApplyDetail">
import {listDictAesst} from "@/api/system/asset";
import { Base64 } from "js-base64";
import {ref} from "@vue/runtime-core";
const emit = defineEmits(['handleAssetsCodeData'])
const props = defineProps({
  number:String
})
const { proxy } = getCurrentInstance();
// 遮罩层
const loading = ref(true);
// 表格数据
const dataList = ref([]);
// 标题
const title=ref(null)
// 是否显示弹出层
const open=ref(false)
// 分页
const total = ref(0);
// 是否查看
const visible=ref(false)
// 系统工作日期
const sysWorkDate=ref(null)
// 表单校验
const data = reactive({
})
const {form, rules}  = toRefs(data);
// 资产变更锁定参数
const changeInfo=ref(false)
// 存上级数据
const map = ref(new Map());
// 存上级total
const mapTotal = ref(new Map());
// 查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  codeType:null,
  contentsCode :null,
  contentsName:null,
  parentContentsCode:null,
  codeLevel : null,
  markTail : null,
  dataFilter : null

});

// 查询参数
const currentRow = ref([])
// 资产替换锁定参数
defineExpose({
  openCard

})

/**
 * =============自定义方法=============
 */
/** 是否明细 */
function markTailFormatter(row, column) {
  let markTail = row.markTail;
  if(markTail == "0"){
    return "否";
  } else {
    return "是";
  }
}

/** 设置当前行数据*/
function getRowData(row){
  currentRow.value = row;
}

/** 查询资产单据列表 */
function getList() {
  loading.value = true;
  listDictAesst(proxy.addDateRange(queryParams.value)).then(res => {
    loading.value = false;
    dataList.value = res.rows;
    total.value = res.total;
  });
}

/** 查询资产单据列表 */
function getPageList() {
  clearQueryParam();
  loading.value = true;
  if (dataList.value.length > 0){
    queryParams.value.dataFilter = Base64.encode(" and code_type ='"+dataList.value[0].codeType +"' and parent_contents_code = '"+dataList.value[0].parentContentsCode+"' ");
    listDictAesst(proxy.addDateRange(queryParams.value)).then(res => {
      loading.value = false;
      dataList.value = res.rows;
      total.value = res.total;
    });
  }
}

/** 查看打开方法 */
function openCard(codeTypeParam,titleParam) {
  clearQueryParam();
  title.value = titleParam;
  open.value = true;
  queryParams.value.codeType = codeTypeParam;
  queryParams.value.codeLevel = "1";
  getList();
}

/** 查询下级*/
function toDownLevel(row){
  let rowData = row || currentRow.value;
  // 判断是否是明细
  if (rowData.markTail == '1'){
    // 明细数据,传回父组件
    emit('handleAssetsCodeData',rowData);
    close();
  } else {
    clearQueryParam();
    // 非明细数据，查询下级
    queryParams.value.dataFilter = Base64.encode(" and code_type ='"+rowData.codeType +"' and parent_contents_code = '"+rowData.contentsCode+"' ");
    getList();
    // 存map,给上级按钮用
    map.value.set(rowData.codeLevel,dataList.value);
    mapTotal.value.set(rowData.codeLevel,total.value);
  }
}

/** 返回上级*/
function backUpLevel(){
  // 查询上级数据
  clearQueryParam();
  if (dataList.value.length > 0){
    let currentLevel = dataList.value[0].codeLevel;
    // 判断是否最上级
    if (currentLevel == "1"){
      proxy.$modal.msgError("当前为最上级");
    } else {
      let upLevel = parseInt(currentLevel) - 1;
      dataList.value = map.value.get(upLevel.toString());
      total.value = mapTotal.value.get(upLevel.toString());
    }
  }
}

/** 确定按钮*/
function confirm() {
  let rowData = currentRow.value;
  if (rowData.length == 0){
    proxy.$modal.msgError("请选择一行数据");
  } else if (rowData.markTail == '1'){
    // 明细数据,传回父组件
    emit('handleAssetsCodeData',rowData);
    close();
  } else {
    proxy.$modal.msgError("请选择明细");
  }
}
// 取消按钮
function close() {
  clearQueryParam();
  open.value = false;
}

// 重置查询参数
function clearQueryParam() {
  queryParams.value.contentsCode = null;
  queryParams.value.contentsName = null;
  queryParams.value.codeLevel = null;
  queryParams.value.markTail = null;
  queryParams.value.parentContentsCode = null;
  queryParams.value.dataFilter = null;
}

</script>
<style scoped>
  .el-dialog__wrapper{
    left: 14.5%;
    top: 2vh;
  }
</style>
