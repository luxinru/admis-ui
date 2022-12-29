<template>
  <el-dialog :title="title" v-model="open" width="83vw" top="5vh" append-to-body>
    <el-form ref="formRef" :model="form" :rules="!visible&&!replaceInfo?rules:null" label-width="110px" :disabled="visible">
      <el-row>
        <el-col :span="6">
          <el-form-item label="资产名称" prop="assetsContents">
            <el-input v-model="form.assetsName"  placeholder="请选择资产目录" maxlength="10">
              <template #append>
                <el-button icon="Search" @click="openAssetsCodeCard('1')"/>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="资产名称" prop="assetsContents" v-if="false">
            <el-input v-model="form.assetsName"  placeholder="请选择资产目录" maxlength="10">
              <template #append>
                <el-button icon="Search" @click="openSelectAssetsCard()"/>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="规格型号" prop="assetsStandard">
            <el-input v-model="form.assetsStandard" placeholder="请输入规格型号" maxlength="25"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="数量" prop="singleAmount">
            <el-input v-model="form.singleAmount" placeholder="请输入数量" maxlength="12"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="参考原值" prop="referenceOriginalValue">
            <el-input v-model="form.referenceOriginalValue" placeholder="请输入原值" maxlength="12"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="计量单位" prop="unitCode" >
            <el-select v-model="form.unitCode" placeholder="请选择计量单位">
              <el-option v-for="dict in unitCodeOption" :key="dict.unitCode" :label="dict.unitCodeName" :value="dict.unitCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="制造厂家" prop="makeFactory">
            <el-input v-model="form.makeFactory" placeholder="请输入制造厂家" maxlength="50"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出厂日期" prop="productDate">
            <el-date-picker
              v-model="form.productDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="选择出厂日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属单位" prop="departName">
            <el-input v-model="form.departName" readonly placeholder="请选择所属单位" maxlength="10">
              <template #append>
                <el-button icon="Search" @click="openDepartCard()"/>
              </template>
            </el-input>
            <el-input v-model="form.departCode" v-if="false"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="投产日期" prop="operateDate">
            <el-date-picker
              v-model="form.operateDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="选择投产日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="存放地点" prop="storePlace">
            <el-input v-model="form.storePlace" placeholder="请输入存放（安装）地点" maxlength="25"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="保管人" prop="dutyPerson">
            <el-input v-model="form.userPerson" placeholder="请输入保管人" maxlength="10"/>
          </el-form-item>
        </el-col>
<!--        <el-col :span="6">-->
<!--          <el-form-item label="资产状态" prop="assetsStatusCode">-->
<!--            <el-select v-model="form.assetsStatusCode" placeholder="请选择资产状态">-->
<!--              <el-option v-for="dict in assetsStatusOptions" :key="dict.assetsStatusCode" :label="dict.assetsStatusName" :value="dict.assetsStatusCode"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="6">
          <el-form-item label="增加原因" prop="addReasonName">
            <el-input v-model="form.addReasonName" placeholder="请选择增加原因" maxlength="10">
              <template #append>
                <el-button icon="Search" @click="openCardForAddReason('addreason','增加原因')"/>
              </template>
            </el-input>
            <el-input v-model="form.addReason" v-if="false"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="使用状态" prop="usedState">
            <el-input v-model="form.usedStateName" placeholder="请选择使用状态" maxlength="10">
              <template #append>
                <el-button icon="Search" @click="openCardForUsedState('assetsstatus','使用状态')"/>
              </template>
            </el-input>
            <el-input v-model="form.usedState" v-if="false"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属区块" prop="areaCode">
            <el-select v-model="form.areaCode" placeholder="请选择所属区块">
              <el-option v-for="dict in areaCodeOptions" :key="dict.areaCode" :label="dict.areaName" :value="dict.areaCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" maxlength="100"></el-input>
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
</template>

<script setup name = "addApplyDetail">
import {getDetail} from "@/api/assets/real/add/detail";
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

// 技术部门字典
const technicalDepartOption=ref( [{
  codeProperty1: '0',
  codeName1: '技术1'
}, {
  codeProperty1: '1',
  codeName1: '技术2'
}])
// 设备类型字典
const equipTypeOptions=ref( [{
  equipTypeCode: '0',
  equipTypeName: '设备类型1'
}, {
  equipTypeCode: '1',
  equipTypeName: '设备类型2'
}])
// 所属区块字典
const areaCodeOptions=ref( [{
  areaCode: '0',
  areaName: '区块1'
}, {
  areaCode: '1',
  areaName: '区块2'
}])
// 使用状况字典
const usedStateOptions=ref( [{
  usedState: '0',
  usedStateName: '状况1'
}, {
  usedState: '1',
  usedStateName: '状况2'
}])
const unitCodeOption=ref ([{
  unitCode: '0',
  unitCodeName: '单位1'
}, {
  unitCode: '1',
  unitCodeName: '单位2'
}])

// 技术状况字典
const technicalConditionOptions=ref([{
  technicalCondition: '0',
  technicalConditionName: '状况1'
}, {
  technicalCondition: '1',
  technicalConditionName: '状况2'
}])
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
    assetsCode: [
      { required: true, message: "资产编码不能为空", trigger: "blur" }
    ],
    assetsName: [
      { required: true, message: "资产名称不能为空", trigger: "blur" }
    ],
    singleAmount: [
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    referenceOriginalValue: [
      { required: true, message: "原值不能为空", trigger: "blur" },
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    unitCode: [
      { required: true, message: "计量单位不能为空", trigger: "blur" }
    ],
    departName: [
      { required: true, message: "所属单位不能为空", trigger: "blur" }
    ],
    storePlace: [
      { required: true, message: "存放安装地点不能为空", trigger: "blur" }
    ],
    addReason: [
      { required: true, message: "增加原因不能为空", trigger: "blur" }
    ],
    userPersonCode: [
      { required: true, message: "保管人不能为空", trigger: "blur" }
    ],
    equipTypeCode: [
      { required: true, message: "设备类型不能为空", trigger: "blur" }
    ],
    usedState: [
      { required: true, message: "使用状况不能为空", trigger: "blur" }
    ],
    operateDate: [
      { validator: checkOperateDate, trigger: 'change' }
    ],
    productDate: [
      { validator: checkProductDate, trigger: 'change' }
    ]
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
  // complexCard.value
  // assetsCodeCard.value
})
/**
 * =============自定义方法=============
 */
// 新增打开方法
function add(invoiceNumber, titleStr) {
  reset();
  open.value = true;
  visible.value = false;
  name.value = true;
  form.value.invoiceNumber =invoiceNumber;
  form.value.createDate = sysWorkDate;
  title.value = titleStr;
}
// 修改打开方法
function update(param,titleStr,paramType) {
  debugger
  open.value = true;
  visible.value = false;
  name.value = false;
  title.value = titleStr;
  if (paramType == "id"){
    getDetail(param).then(response => {
      form.value = response.data[0];
    });
  } else {
    form.value = param[0];
  }
}
// 查看打开方法
function view(param, titleStr,paramType) {
  debugger
  open.value = true;
  visible.value = true;
  name.value = false;
  title.value = titleStr;
  if (paramType == "id"){
    getDetail(param).then(response => {
      form.value = response.data[0];
    });
  } else {
    form.value = param[0];
  }
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
    assetsCode: null,
    assetsName: null,
    assetsStandard: null,
    singleAmount: null,
    referenceOriginalValue: null,
    makeFactory: null,
    productDate: null,
    departCode: null,
    departName: null,
    areaCode: null,
    usedState: null,
    usedStateName: null,
    unitCode: null,
    manageDepartCode: null,
    operateDate: null,
    assetsStatus: null,
    barStatus: '0',
    technicalDepartName:"0",
    deleteStatus: 0
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

//校验结束时间
function checkOperateDate(rule, value, callback) {
  if (value) {
     if (form.value.productDate) {
      if (form.value.productDate >= value) {
        callback("投产日期必须大于出厂日期！")
      } else {
        callback();
      }
    } else {
      callback();
    }
  } else {
    callback();
  }
}
//校验结束时间
function checkProductDate(rule, value, callback) {
  if (value) {
     if (form.value.operateDate) {
      if (form.value.operateDate < value) {
        callback("投产日期必须大于出厂日期！")
      } else {
        callback();
      }
    } else {
      callback();
    }
  } else {
    callback();
  }
}

</script>
<style scoped>
.el-dialog__wrapper{
  left: 14.5%;
  top: 2vh;
}
</style>