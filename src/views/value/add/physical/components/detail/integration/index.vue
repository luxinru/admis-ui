<template>
  <div>

    <el-dialog :title="title" v-model="open" width="100%" top="10vh" append-to-body>
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="160px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="资产类型" prop="assetsTypeName">
              <el-input v-model="form.assetsTypeName" readonly @click="openComplexCodeCard('assetType', '资产类型')" placeholder="请选择资产类型" maxlength="40"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产名称" prop="assetsName">
              <el-input v-model="form.assetsName" placeholder="请输入资产名称" maxlength="40" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产类别" prop="contentAssetsCode">
              <el-input v-model="form.contentAssetsCode" readonly @click="openComplexCodeCard('addreason2', '资产类别')" placeholder="请选择资产类别" maxlength="40"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格型号" prop="assetsStandard">
              <el-input v-model="form.assetsStandard" placeholder="请输入规格型号" maxlength="40" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="出厂日期" prop="productDate">
              <el-date-picker v-model="form.productDate" placeholder="请选择出厂日期" value-format="YYYY-MM-DD"
                              :editable="false" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属单位" prop="departName">
              <el-input v-model="form.departName" placeholder="请输入所属单位" maxlength="40"
                        @click="openDepartCard('departName')" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="计量单位" prop="unitCodeName">
              <el-input v-model="form.unitCodeName" readonly @click="openComplexCodeCard('unitMeasurement', '计量单位')" placeholder="请选择计量单位" maxlength="40"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="使用单位" prop="useDepartName">
              <el-input v-model="form.useDepartName" placeholder="请输入使用单位" maxlength="40"
                        @click="openDepartCard('useDepartName')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="数量" prop="singleAmount">
              <el-input v-model="form.singleAmount" placeholder="请输入数量" value="1" disabled maxlength="2" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工程建设其他费用" prop="otherCost">
              <el-input v-model="form.otherCost" placeholder="请输入工程建设其他费用" maxlength="15" type="number"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="建筑安装费" prop="installationCost">
              <el-input v-model="form.installationCost" placeholder="请输入建筑安装费" maxlength="15"  type="number"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备及工器具购置费" prop="purchaseCost">
              <el-input v-model="form.purchaseCost" placeholder="请输入设备及工器具购置费" maxlength="15"  type="number"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="安装地点" prop="storePlace">
              <el-input v-model="form.storePlace" placeholder="请输入安装地点" maxlength="120" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预备费" prop="prepareCost">
              <el-input v-model="form.prepareCost" placeholder="请输入预备费" maxlength="15" type="number"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="建设期贷款利息" prop="loanInterest">
              <el-input v-model="form.loanInterest" placeholder="请输入建设期贷款利息" maxlength="15" type="number"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车辆购置税" prop="autoPurchaseTax">
              <el-input v-model="form.autoPurchaseTax" placeholder="请输入车辆购置税" maxlength="15" type="number"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm()" v-if="!visible">确 定</el-button>
          <el-button @click="close()">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 调用所属单位-->
    <depart-code ref="refDepartCard" @handleDepartCard="handleDepartCard" />

    <!-- 调用综合编码-->
    <choose-complex ref="refComplexCard" @handleComplexData="handleComplexData"/>

  </div>
</template>

<script setup>
import chooseComplex from "@/views/system/card/complexCode/index";
// 引入单位选择
import departCode from "@/views/system/card/depart/index";
import { nextTick } from 'vue';

//单位选择定义
const refDepartCard = ref();
//选择单位锚点
const departSelection = ref();

const formCheck = ref(false);
// 打开综合编码
const refComplexCard = ref();
// 标题
const title=ref(null);
// 选中数组
const ids=ref([]);
// 是否显示弹出层
const open=ref(false);
// 业务表单
const data = reactive({
  form:ref({})
});
const {form} = toRefs(data);
// 表单校验
const formRulesqwe=ref({
  assetsTypeName: [
    { required: true, message: "资产类型不能为空", trigger: "blur" }
  ],
  assetsName: [
    { required: true, message: "资产名称不能为空", trigger: "blur" }
  ],
  departName: [
    { required: true, message: "所属单位不能为空", trigger: "blur" }
  ]
});
const formRules=ref({
  assetsName: [
    { required: true, message: "资产名称不能为空", trigger: "blur" }
  ]
});

const { proxy } = getCurrentInstance();
const emit = defineEmits(['handleIntergration']);
defineExpose({
  show
});
// 新增打开方法
function show(titleStr) {
  reset();
  open.value = true;
  title.value = titleStr;
}
// 提交按钮
function submitForm() {
  proxy.$refs["formRef"].validate(valid => {
    if (valid) {
      emit('handleIntergration',form.value);
      close();
    }
  });
}
// 关闭按钮
function close() {
  reset();
  open.value = false;
}
// 重置表单，清空表单校验
function reset() {
  form.value = {
    assetsType: null,
    assetsName: null,
    contentAssetsCode: null,
    assetsStandard: null,
    productDate: null,
    departName: null,
    unitCodeName: null,
    singleAmount: null,
    storePlace: null,
    useDepartName: null,
    purchaseCost: null,
    installationCost: null,
    otherCost: null,
    prepareCost: null,
    loanInterest: null,
    autoPurchaseTax: null
  };
}
/** 打开综合编码字典*/
function openComplexCodeCard(codeProperty, title){
  refComplexCard.value.openCard(codeProperty, title);
}
/** 获取综合编码卡片选中的数据*/
function handleComplexData(row, fromKey){
  /**综合编码数据字典所对应的key及名称：
   权属状况：ownershipCondition
   */
  if(fromKey == 'assetType'){
    form.value.assetsTypeName = row.codeName1;
    form.value.assetType = row.codeProperty1;
  } else if (fromKey == 'unitMeasurement'){// 计量单位：unitCodeName
    form.value.unitCodeName = row.codeName1;
    form.value.unitCode = row.codeProperty1;
  } else if(fromKey == 'addreason2'){
    form.value.contentAssetsCode = row.codeName1;
    // form.value.contentAssetsName = row.codeProperty1;
  }
}

/**
 * 打开所属单位字典
 */
function openDepartCard(selection) {
  departSelection.value = selection;
  refDepartCard.value.openCard("所属单位");
}

/**
 * 获取所属单位字典的数据
 * @param {*} row
 */
function handleDepartCard(row) {
  //回写使用单位
  if (departSelection.value == 'useDepartName') {
    form.value.useDepartName = row.departName;
    form.value.useDepartCode = row.departCode;
  }
  //回写所属单位
  if (departSelection.value == 'departName') {
    form.value.departName = row.departName;
    form.value.departCode = row.departCode;
  }

}

</script>
