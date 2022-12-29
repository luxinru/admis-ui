<template>
  <el-card class="mb8" :body-style="{padding: '12px 0'}">
    <el-form ref="form" :model="formData" :rules="formRules" label-width="160px">
      <div class="card-item">
        <div class="sub-tittle" id="material-card1" :class="'material-card1' === currMenuId ? 'active' : ''"><span class="title-text">{{formTitle}}</span></div>
        <div class="card-section">
          <el-row class="card-content card-content-move">
            <el-col :span="8">
              <el-form-item label="资产类型" prop="assetsType">
                <el-select v-model="formData.assetsType" placeholder="请选择资产类型" readonly @change="changeAssetsType">
                  <el-option
                      v-for="item in assetsTypeList"
                      :key="item.codeProperty1"
                      :label="item.codeName1"
                      :value="item.codeProperty1"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资产名称" prop="assetsName">
                <el-input v-model="formData.assetsName"   placeholder="请输入资产名称" :disabled="!formData.assetsType"
                >
                  <template #append>
                      <el-icon @click="openCustomAssets(formData.assetsName, formData.assetsType)"><Search /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资产类别" prop="contentAssetsCode">
                <el-input v-model="formData.contentAssetsCode" placeholder="资产名称自动带出" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="自编号" prop="selfCode">
                <el-input v-model="formData.selfCode" placeholder="请输入自编号" maxlength="40" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="规格型号" prop="assetsStandard">
                <el-input v-model="formData.assetsStandard" placeholder="请输入规格型号" maxlength="40" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车牌井号" prop="licenceNumber">
                <el-input v-model="formData.licenceNumber" placeholder="请输入车牌井号" maxlength="40" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="存放地点" prop="storePlace">
                <el-input v-model="formData.storePlace" placeholder="请输入存放地点" maxlength="120" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属单位" prop="departName">
                <el-input v-model="formData.departName" placeholder="请选择所属单位" maxlength="40"
                          @click="openDepartCard('departName')" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="制造厂家" prop="makeFactory">
                <el-input v-model="formData.makeFactory" placeholder="请输入制造厂家" maxlength="120" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出厂编号" prop="productCode">
                <el-input v-model="formData.productCode" placeholder="请输入出厂编号" maxlength="120" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计量单位" prop="unitCode">
                <el-select v-model="formData.unitCode" placeholder="请选择计量单位">
                  <el-option
                      v-for="item in unitList"
                      :key="item.codeProperty1"
                      :label="item.codeName1"
                      :value="item.codeProperty1"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="盘点单位" prop="managerDepartName ">
                <el-input v-model="formData.managerDepartName" placeholder="请输入盘点单位" maxlength="40"
                          @click="openDepartCard('managerDepartName')" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出厂日期" prop="productDate">
                <el-date-picker v-model="formData.productDate" placeholder="请选择出厂日期" value-format="YYYY-MM-DD"
                                :editable="false" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="投产日期" prop="operateDate">
                <el-date-picker v-model="formData.operateDate" placeholder="请选择投产日期" value-format="YYYY-MM-DD"
                                :editable="false" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资产组编码" prop="entityCode">
                <!--<el-input v-model="formData.entityCode" placeholder="自动生成资产组编码" :disabled="true"/>-->
                <el-select v-model="formData.entityCode" placeholder="请选择资产组编码">
                  <el-option
                      v-for="item in entityList"
                      :key="item.codeProperty1"
                      :label="item.codeProperty1"
                      :value="item.codeProperty1"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="增加日期" prop="addVoucherDate">
                <el-date-picker v-model="formData.addVoucherDate" placeholder="请选增加日期" value-format="YYYY-MM-DD"
                                :editable="false" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="参考原值" prop="referenceOriginalValue">
                <el-input v-model="formData.referenceOriginalValue" placeholder="请输入设备及工器具购置费" maxlength="15" type="number"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资产组名称" prop="entityName">
                <!--<el-input v-model="formData.entityName" placeholder="请输入组编码" maxlength="120" disabled/>-->
                <el-select v-model="formData.entityCode" placeholder="自动生成" :disabled="true">
                  <el-option
                      v-for="item in entityList"
                      :key="item.codeProperty1"
                      :label="item.codeName1"
                      :value="item.codeProperty1"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="技术部门" prop="technicalDepartName">
                <el-input v-model="formData.technicalDepartName" placeholder="请输入技术部门" maxlength="120" />
               <!-- <el-select v-model="formData.technicalDepart" placeholder="请选择技术部门">
                  <el-option
                      v-for="item in technicalDepartList"
                      :key="item.codeProperty1"
                      :label="item.codeName1"
                      :value="item.codeProperty1"
                  ></el-option>
                </el-select>-->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="技术状况" prop="technicalCondition">
                <el-select v-model="formData.technicalCondition" placeholder="请选择技术状况">
                  <el-option
                      v-for="item in technicalList"
                      :key="item.codeProperty1"
                      :label="item.codeName1"
                      :value="item.codeProperty1"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="标签类型" prop="labelType">
                <el-select v-model="formData.labelType" placeholder="请选择标签类型">
                  <el-option
                    v-for="item in labelTypeList"
                    :key="item.codeProperty1"
                    :label="item.codeName1"
                    :value="item.codeProperty1"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="保管人" prop="userPerson">
                <el-input v-model="formData.userPerson" placeholder="请输入保管人" maxlength="120"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="境内境外" prop="inOutType">
                <el-select v-model="formData.inOutType" placeholder="请选择境内境外">
                  <el-option
                      v-for="item in inOutTypeList"
                      :key="item.codeProperty1"
                      :label="item.codeName1"
                      :value="item.codeProperty1"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属区块" prop="areaCode">
                <el-select v-model="formData.areaCode" placeholder="请选择所属区块">
                  <el-option
                      v-for="item in areaList"
                      :key="item.codeProperty1"
                      :label="item.codeName1"
                      :value="item.codeProperty1"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="油气分类" prop="oilgasType">
                <el-select v-model="formData.oilgasType" placeholder="请选择油气分类">
                  <el-option
                      v-for="item in oilgasTypeList"
                      :key="item.codeProperty1"
                      :label="item.codeName1"
                      :value="item.codeProperty1"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!--<el-col :span="8">
              <el-form-item label="油区" prop="oilareaNum">
                <el-select v-model="formData.oilareaNum" placeholder="请选择油区">
                  <el-option
                      v-for="item in oilareaNumList"
                      :key="item.codeProperty1"
                      :label="item.codeName1"
                      :value="item.codeProperty1"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>-->
            <el-col :span="8">
              <el-form-item label="合同编号" prop="contractCode">
                <el-input v-model="formData.contractCode" placeholder="请输入合同编号" maxlength="40"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同名称" prop="contractName">
                <el-input v-model="formData.contractName" placeholder="请输入合同名称" maxlength="40"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数量" prop="singleAmount">
                <el-input v-model="formData.singleAmount" placeholder="请输入数量" maxlength="2" type="number" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="formData.remark" type="textarea" placeholder="请输入内容" maxlength="500" :rows="2" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </el-card>
  <!-- 综合编码 -->
  <choose-complex ref="refComplexCard" @handleComplexData="handleComplexData"/>
  <!-- 调用所属单位-->
  <depart-code ref="refDepartCard" @handleDepartCard="handleDepartCard" />
  <!-- 资产名称 -->
  <select-custom-assets-contents ref="customAssets" :chooseCustomAssetsContent="onHandCustomAssets"></select-custom-assets-contents>
</template>

<script setup name="MaterialObject">
import { getCodeData } from '@/api/system/complexCode';
import chooseComplex from "@/views/system/card/complexCode/index";
import departCode from "@/views/system/card/depart/index";
import SelectCustomAssetsContents from "@/views/system/means/selectCustomAssetsContents";

// 声明调用方（父组件）变量
const emit = defineEmits(['selectDepart']);
// 所属单位 成本中心 责任中心
const { proxy } = getCurrentInstance();
const props = defineProps({
  currMenuId: {
    type: String,
    default: ''
  },
  formTitle: {
    type: String,
    default: ''
  },
  formParams: {
    type: Object,
    default: () => {}
  }
});
// 表单数据
let formData = ref({
  singleAmount: 1
});
// 表单校验规则
const formRules = reactive({
  assetsName: [
    { required: true, message: "资产名称不能为空", trigger: "blur" }
  ],
  wellNameCode: [
    // { required: invoiceForm.invoiceType != 'ZZA_02', message: "井名及编号不能为空", trigger: "blur" },
    { required: true, message: "井名及编号不能为空", trigger: "blur" }
  ],
  contentAssetsCode: [
    { required: false, message: "资产类别不能为空", trigger: "blur" }
  ],
  assetsStandard: [
    { required: true, message: "规格型号不能为空", trigger: "blur" }
  ],
  productDate: [
    { required: true, message: "出厂日期不能为空", trigger: "change" }
  ],
  useDepartName: [
    { required: true, message: "使用单位不能为空", trigger: "blur" }
  ],
  departName: [
    { required: true, message: "所属单位不能为空", trigger: "change" }
  ],
  unitCode: [
    { required: true, message: "请选择计量单位", trigger: "change" }
  ],
  singleAmount: [
    { required: true, message: "计量数量不能为空", trigger: "blur" }
  ],
  charItem5: [
    { required: true, message: "复合数量不能为空", trigger: "blur" }
  ],
  purchaseCost: [
    { required: true, message: "设备及工器具购置费不能为空", trigger: "blur" }
  ]
})
// 定义单据表单数据
const invoiceData = reactive({
  invoiceForm: {}
});
const { invoiceForm } = toRefs(invoiceData);
// 打开综合编码
const refComplexCard = ref();

//单位选择定义
const refDepartCard = ref();

//选择单位锚点
const departSelection = ref();
let departRow = reactive({});
// 字典数据声明
const assetsTypeList = ref();
const addreasonList = ref();
const assetsstatusList = ref();
const unitList = ref();
const entityList = ref();
const technicalDepartList = ref();
const technicalList = ref();
const labelTypeList = ref();
const inOutTypeList = ref();
const areaList = ref();
const oilgasTypeList = ref();
// const oilareaNumList = ref();
// 获取字典列表
getDictList('assetsType').then(res => {
  assetsTypeList.value = res;
})
getDictList('addreason').then(res => {
  addreasonList.value = res;
})
getDictList('assetsstatus').then(res => {
  assetsstatusList.value = res;
})
getDictList('unit').then(res => {
  unitList.value = res;
})
getDictList('entityCode').then(res => {
  entityList.value = res;
})
getDictList('technicalDepart').then(res => {
  technicalDepartList.value = res;
})
getDictList('technical').then(res => {
  technicalList.value = res;
})
getDictList('labelType').then(res => {
  labelTypeList.value = res;
})
getDictList('inOutType').then(res => {
  inOutTypeList.value = res;
})
getDictList('plate').then(res => {
  areaList.value = res;
})
getDictList('plate').then(res => {
  inOutTypeList.value = res;
})
getDictList('oilgasType').then(res => {
  oilgasTypeList.value = res;
})
// getDictList('oilareaNum').then(res => {
//   oilareaNumList.value = res;
// })
defineExpose({
  formData,
  formValidate
})

// 获取字典数据
function getDictList(codeProperty) {
  const queryParams = {
    pageNum: 1,
    pageSize: 10,
    codeProperty,
    dataLevel: 1
  }
  return new Promise((resolve, reject) => {
    getCodeData(proxy.addDateRange(queryParams)).then(res => {
      resolve(res.rows);
    }).catch((err) => { reject(err) })
  })
}

// 表单校验方法
function formValidate() {
  return new Promise((resolve, reject) => {
    proxy.$refs['form'].validate(valid => {
      if (valid) {
        resolve(toRaw(formData.value))
      }
    }).catch(err => {
      reject(err)
    })
  })
}
// 资产类型变化
function changeAssetsType() {

}

/**
 * 打开所属单位字典
 */
function openDepartCard(selection) {
  departSelection.value = selection;
  refDepartCard.value.openCard('所属单位');
}

/**
* 获取所属单位字典的数据
* @param {*} row
*/
function handleDepartCard(row) {
  //回写技术部门
  if(departSelection.value === 'technicalDepartName') {
    formData.value.technicalDepartName = row.departName;
    formData.value.technicalDepart = row.departCode;
  }
  //回写所属单位
  if(departSelection.value === 'departName') {
    formData.value.departName = row.departName;
    formData.value.departCode = row.departCode;
    emit('selectDepart', row)
  }
  //回写盘点单位
  if(departSelection.value === 'managerDepartName') {
    formData.value.managerDepartName = row.departName;
    formData.value.managerDepart = row.departCode;
  }
}

/** 打开综合编码字典*/
function openComplexCodeCard(codeProperty, title){
  refComplexCard.value.openCard(codeProperty, title);
}

// 打开资产名称
function openCustomAssets(title, assetsType) {
  console.log(assetsType, 'assetsType')
   proxy.$refs['customAssets'].show(title, assetsType);
}

// 监听选择资产名称
function onHandCustomAssets(row) {
  formData.value.assetsName = row.assetsName
  formData.value.contentAssetsCode = row.contentAssetsCode
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
  // proxy.resetForm("invoiceRef");
}

/**
 * 单据区域初始化
 */
function handleInitInvoice() {
  invoiceReset();
  // 编辑情况进行数据加载
  if (parentInvoiceNumber.value != "") {
    getInvoice(parentInvoiceNumber.value).then(response => {
      invoiceForm.value = response.data;
      editInvoiceTypeFlag.value = true;
      detailReadonly.value = false;
      detailList();
    });
  } else {
    // 新增情况进行表单初始化
    // 零购项目固定单据类型
    if (retailEquipment.value == '0') {
      invoiceTypeOption = reactive([
        {
          value: 'ZZA_02',
          label: '零购项目'
        }
      ]);
      invoiceForm.value.invoiceType = 'ZZA_02'
    } else {
      // 预转资项目可选预转资相关单据类型
      invoiceTypeOption = reactive([
        {
          value: 'ZZA_0101',
          label: '投资项目-预转资'
        }, {
          value: 'ZZA_0102',
          label: '投资项目-预转资调整'
        }, {
          value: 'ZZA_0103',
          label: '投资项目-竣工转资'
        }
      ]);
    }
    //关闭明细加载
    loading.value = false;
  }
}

/** 获取综合编码卡片选中的数据*/
function handleComplexData(row, fromKey){
  /**综合编码数据字典所对应的key及名称：
   权属状况：ownershipCondition
   */
  if(fromKey == 'assetType') {
    formData.assetsType = row.codeName1;
    formData.assetType = row.codeProperty1;
  } else if (fromKey == 'unitMeasurement') { // 计量单位：unitCode
    formData.unitCode = row.codeName1;
    formData.unitCode = row.codeProperty1;
  } else if (fromKey == 'addreason2') {
    formData.contentAssetsCode = row.codeName1;
    // form.value.contentAssetsName = row.codeProperty1;
  } else if (fromKey == 'technical') {
    formData.technicalCondition = row.codeName1;
    formData.technicalConditionName = row.codeProperty1;
  }
}

/** 页面操作 start */
//1.加载上方单据信息
// handleInitInvoice();
/** 页面操作 end */
</script>

<style lang="scss" scoped>
.card-item {
  position: relative;
  border: 1px solid var(--el-border-color);
  margin-bottom: 30px;
  padding: 20px 16px;
  border-radius: 4px;

  .card-section {
    background: #f8f8f8;
    padding: 12px 12px 0 12px;

    .card-content-move {
      margin-left: -3%;
      width: 98%;
    }
  }

  .sub-tittle {
    position: absolute;
    top: -10px;
    left: 30px;
    font-size: 16px;
    font-weight: 700;
    background: rgba(255, 255, 255, 0);
    padding: 0 15px;
    background: #fff;

    &.active {
      color: var(--el-color-primary);
    }
  }
}
</style>
