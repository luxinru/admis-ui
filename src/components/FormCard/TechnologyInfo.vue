<template>
  <el-card class="mb8" :body-style="{padding: '12px 0'}">
    <el-form ref="form" :model="formData" :rules="formRules" label-width="160px">
      <div class="card-item">
        <div class="sub-tittle" id="technology-card1" :class="'technology-card1' === currMenuId ? 'active' : ''"><span
            class="title-text">技术信息</span></div>
        <div class="card-section">
          <el-row class="card-content card-content-move">
            <el-col :span="8">
              <el-form-item label="项目名称" prop="charItem1">
                <el-input v-model="formData.charItem1" placeholder="请输入项目名称" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同编码" prop="charItem2">
                <el-input v-model="formData.charItem2" placeholder="请输入合同编码" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同名称" prop="charItem3">
                <el-input v-model="formData.charItem3" placeholder="请输入合同名称" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目编号" prop="charItem4">
                <el-input v-model="formData.charItem4" placeholder="请输入项目编号" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="复合数量" prop="charItem5">
                <el-input v-model="formData.charItem5" placeholder="请输入复合数量" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="功率能力" prop="charItem6">
                <el-input v-model="formData.charItem6" placeholder="请输入功率能力" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="停产日期" prop="charItem7">
                <el-date-picker v-model="formData.charItem7" placeholder="请选择停产日期" value-format="YYYY-MM-DD" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="井管类型及长度" prop="charItem8">
                <el-input v-model="formData.charItem8" placeholder="请输入井管类型及长度" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="井径或管径" prop="charItem9">
                <el-input v-model="formData.charItem9" placeholder="请输入井径或管径" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="井深" prop="charItem10">
                <el-input v-model="formData.charItem10" placeholder="请输入井深" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="汇率" prop="charItem11">
                <el-input v-model="formData.charItem11" placeholder="请输入汇率" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="存放地点" prop="charItem12">
                <el-input v-model="formData.charItem12" placeholder="请输入存放地点" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="评估净值" prop="charItem13">
                <el-input v-model="formData.charItem13" placeholder="请输入评估净值" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="评估原值" prop="charItem14">
                <el-input v-model="formData.charItem14" placeholder="请输入评估原值" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资产清查" prop="charItem15">
                <el-input v-model="formData.charItem15" placeholder="请输入资产清查" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="评估基准日" prop="charItem16">
                <el-input v-model="formData.charItem16" placeholder="请输入评估基准日" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设计能力" prop="charItem17">
                <el-input v-model="formData.charItem17" placeholder="请输入设计能力" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发动机号" prop="charItem18">
                <el-input v-model="formData.charItem18" placeholder="请输入发动机号" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车架号码" prop="charItem19">
                <el-input v-model="formData.charItem19" placeholder="请输入车架号码" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="颜色" prop="charItem20">
                <el-input v-model="formData.charItem20" placeholder="请输入颜色" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="燃油（气）类型" prop="charItem21">
                <el-input v-model="formData.charItem21" placeholder="请输入燃油（气）类型" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="档案号码" prop="charItem22">
                <el-input v-model="formData.charItem22" placeholder="请输入档案号码" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="土地或房屋所有权证号" prop="charItem23">
                <el-input v-model="formData.charItem23" placeholder="请输入土地或房屋所有权证号" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="层数" prop="charItem24">
                <el-input v-model="formData.charItem24" placeholder="请输入层数" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="位置" prop="charItem25">
                <el-input v-model="formData.charItem25" placeholder="请输入位置" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="房屋结构" prop="charItem26">
                <el-input v-model="formData.charItem26" placeholder="请输入房屋结构" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="土地类型" prop="charItem27">
                <el-input v-model="formData.charItem27" placeholder="请输入土地类型" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资产类别年限" prop="numItem1">
                <el-input v-model="formData.numItem1" placeholder="请输入资产类别年限" maxlength="50"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资产类别残值率" prop="numItem2">
                <el-input v-model="formData.numItem2" placeholder="请输入资产类别残值率" maxlength="50"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </el-card>
  <choose-complex ref="refComplexCard" @handleComplexData="handleComplexData"/>
</template>

<script setup name="TechnologyInfo">
import chooseComplex from "@/views/system/card/complexCode/index";

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
const formData = ref({});
// 表单校验规则
const formRules = reactive({})
// 定义单据表单数据
const invoiceData = reactive({
  invoiceForm: {}
});
const { invoiceForm } = toRefs(invoiceData);
// 打开综合编码
const refComplexCard = ref();

defineExpose({
  formData,
  formValidate
})

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

/** 打开综合编码字典*/
function openComplexCodeCard(codeProperty, title){
  refComplexCard.value.openCard(codeProperty, title);
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
    formData.assetsTypeName = row.codeName1;
    formData.assetType = row.codeProperty1;
  } else if (fromKey == 'unitMeasurement') { // 计量单位：unitCodeName
    formData.unitCodeName = row.codeName1;
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
