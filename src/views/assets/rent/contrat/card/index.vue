<template>
  <div class="app-container">
  <el-dialog :title="title" v-model="open" width="83vw" top="5vh" append-to-body>
    <el-form ref="formRef" :model="form" :rules="!visible&&!replaceInfo?rules:null" label-width="140px" :disabled="visible">
      <el-row>
        <el-col :span="6">
          <el-form-item label="合同编号" prop="contractCode">
            <el-input v-model="form.contractCode" placeholder="请输入合同编号" maxlength="10"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同名称" prop="contractName">
            <el-input v-model="form.contractName" placeholder="请输入合同名称" maxlength="10"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同签订日期" prop="contractDate">
            <el-date-picker
                v-model="form.contractDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择合同签订日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同金额" prop="contractMoney">
            <el-input v-model="form.contractMoney" placeholder="请输入合同金额" maxlength="12"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="币种" prop="currencyType">
            <el-input v-model="form.currencyType" placeholder="请输入币种" maxlength="10"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="履行开始日期" prop="performStartDate">
            <el-date-picker
                v-model="form.performStartDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择履行开始日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="履行结束日期" prop="performEndDate">
            <el-date-picker
                v-model="form.performEndDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择履行结束日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="租赁期实际开始日期" prop="rentStartDate">
            <el-date-picker
                v-model="form.rentStartDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="租赁期实际开始日期"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="预计租赁终止日" prop="rentEndDate">
            <el-date-picker
                v-model="form.rentEndDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="预计租赁终止日"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="租赁期（年）" prop="currencyType">
            <el-input v-model="form.rentPeriod" placeholder="租赁期（年）" maxlength="10"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="购买选择权" prop="purchaseOption">
            <el-input v-model="form.purchaseOption" placeholder="购买选择权" maxlength="10"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="购买行权日期" prop="purchaseOptionDate">
            <el-date-picker
                v-model="form.purchaseOptionDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="购买行权日期"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="终止选择权" prop="stopOption">
            <el-input v-model="form.stopOption" placeholder="终止选择权" maxlength="10"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="终止行权日期" prop="stopOptionDate">
            <el-date-picker
                v-model="form.stopOptionDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="终止行权日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="租赁方式编码" prop="rentTypeCode">
            <el-input v-model="form.rentTypeCode" placeholder="租赁方式编码" maxlength="10"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="租赁方式名称" prop="rentTypeName">
            <el-input v-model="form.rentTypeName" placeholder="租赁方式名称" maxlength="10"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm()" v-if="!visible">提 交</el-button>
        <el-button @click="close()">关 闭</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 调用综合编码-增加原因-->
  <choose-complex ref="refComplexCardAddReason" @handleComplexData="handleAddReasonData"/>
  <!-- 调用综合编码-使用状态-->
  <choose-complex ref="refComplexCardUsedState" @handleComplexData="handleUsedStateData"/>
  <!-- 调用资产目录-->
  <asset-code ref="refAssetsCodeCard" @handleAssetsCodeData="handleAssetsCodeData"/>
  <!-- 调用所属单位-->
  <depart-code ref="refDepartCard" @handleDepartCard="handleDepartCard"/>
  </div>
</template>

<script setup name = "addApplyDetail">
import {getDetail} from "@/api/assets/rent/contract/detail";
import chooseComplex from "@/views/system/card/complexCode";
import assetCode from "@/views/system/card/assetcode";
import departCode from "@/views/system/card/depart";
import detailSelect from "@/views/account/choose/choiceDetail";
import {onMounted, ref} from "@vue/runtime-core";
const props = defineProps({
  number:String
})
const emit = defineEmits(['submitForm'])
const { proxy } = getCurrentInstance();
// 标题
const title=ref(null)
// 是否显示弹出层
const open=ref(false)
// 目录弹窗
const codeOpen=ref(false)
// 是否查看
const visible=ref(false)
// 资产编码名称切换
const name=ref(false)
// 部门树选项
const deptExtendTreeList=ref([])
// 增加原因编码
const addReason = ref(null)
// 增加原因编码
const addReasonName = ref(null)
// 资产类型
const assetsTypeOptions=ref([])
// 资产状态字典
// const assetsStatusOptions=ref( [{
//   assetsStatusCode: '0',
//   assetsStatusName: '状态1'
// }, {
//   assetsStatusCode: '1',
//   assetsStatusName: '状态2'
// }])

// 系统工作日期
const sysWorkDate=ref(null)
// 上级单位
const departCodeParent=ref('')
// 单位弹窗
const deptdailogSign=ref(false)
// 表单校验
const data = reactive({
  form: {},
  rules: {

  }
})
const {form, rules}  = toRefs(data);
// 资产变更锁定参数
const changeInfo=ref(false)
// 打开综合编码卡片增加原因
const refComplexCardAddReason = ref();
// 打开综合编码卡片使用状态
const refComplexCardUsedState = ref();
// 打开资产目录卡片
const refAssetsCodeCard = ref();
// 打开资产目录卡片
const refDepartCard = ref();
// 资产替换锁定参数
// replaceInfo=ref(false)
defineExpose({
  add,update,view

})
onMounted(() => {

})
/**
 * =============自定义方法=============
 */
// 新增打开方法
function add(assetsCode, titleStr) {
  reset();
  open.value = true;
  visible.value = false;
  name.value = true;
  form.value.assetsCode =assetsCode;
  form.value.createDate = sysWorkDate;
  title.value = titleStr;
}
// 修改打开方法
function update(param,titleStr,paramType) {
  open.value = true;
  visible.value = false;
  name.value = false;
  title.value = titleStr;
  if (paramType == "id"){
    getDetail(param).then(response => {
      form.value = response.data;
    });
  } else {
    form.value = param[0];
  }
}
// 查看打开方法
function view(param,titleStr,paramType) {
  reset();
  open.value = true;
  visible.value = true;
  name.value = false;
  changeInfo.value = true;
  if (paramType == "id"){
    getDetail(param).then(response => {
      form.value = response.data[0];
    });
  } else {
    form.value = param[0];
  }
  title.value = title;
}
// 选择资产目录
function chooseCode() {

}
// 关闭弹窗
function closeCode(info) {
  codeOpen.value = false;
  const str = info.split(',');
  form.value.assetsCode = str[0];
  form.value.assetsName = str[1];
  form.value.assetsStandard = str[2];
  form.value.unitCode = str[3];
  form.value.unitCodeName = str[4];
  form.value.contentAssetsCode = str[0];
}
// 提交按钮
function submitForm() {
  proxy.$refs["formRef"].validate(valid => {
    console.log(valid)
    if (valid) {
      emit('submitForm',form);
      close();
    }
  });
}
// 取消按钮
function close() {
  reset();
  open.value = false;
}
// 重置表单
function reset() {
  form.value = {
    contractCode:null,
    contractName:null,
    contractDate:null,
    contractMoney:null,
    currencyType:null,
    performStartDate:null,
    performEndDate:null,
    rentStartDate:null,
    rentEndDate:null,
    rentPeriod:null,
    purchaseOption:null,
    purchaseOptionDate:null,
    stopOption:null,
    stopOptionDate:null,
    rentTypeName:null
  };
}

/** 打开综合编码字典*/
function openCardForAddReason(codeProperty,title){
  refComplexCardAddReason.value.openCard(codeProperty,title);
}
/** 获取综合编码卡片选中的数据*/
function handleAddReasonData(row,key){
  console.log(key);
  form.value.addReason = row.codeProperty1;
  form.value.addReasonName = row.codeName1;
}
/** 打开综合编码字典*/
function openCardForUsedState(codeProperty,title){
  refComplexCardUsedState.value.openCard(codeProperty,title);
}
/** 获取综合编码卡片选中的数据*/
function handleUsedStateData(row,key){
  console.log(key);
  form.value.usedState = row.codeProperty1;
  form.value.usedStateName = row.codeName1;
}

/** 打开资产目录字典*/
function openAssetsCodeCard(codeType){
  refAssetsCodeCard.value.openCard(codeType,"资产目录");
}

/** 获取资产目录卡片选中的数据*/
function handleAssetsCodeData(row){
  form.value.assetsName = row.contentsName;
}

/** 打开所属单位字典*/
function openDepartCard(){
  refDepartCard.value.openCard("所属单位");
}
/** 获取所属单位字典的数据*/
function handleDepartCard(row){
  form.value.departName = row.departName;
  form.value.departCode = row.departCode;
}
</script>
<style scoped>
.el-dialog__wrapper{
  left: 14.5%;
  top: 2vh;
}
</style>
