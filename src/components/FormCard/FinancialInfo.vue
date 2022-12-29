<template>
  <el-card class="mb8" :body-style="{padding: '12px 0'}">
    <div class="card-item">
      <div class="sub-tittle" id="financial-card1" :class="'financial-card1' === currMenuId ? 'active' : ''"><span class="title-text">{{formTitle}}</span></div>
        <div class="card-section mb8">
          <el-form ref="accountsForm" :model="accountsFormData" :rules="accountsFormRules" label-width="160px">
            <div class="card-title">核算信息</div>
            <el-row class="card-content card-content-move">
              <el-col :span="8">
                <el-form-item label="责任中心" prop="dutyCenterName">
                  <el-input v-model="accountsFormData.dutyCenterName" placeholder="请输入责任中心" maxlength="50" disabled/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="成本中心" prop="fmisCostCenterName">
                  <el-input v-model="accountsFormData.fmisCostCenterName" placeholder="请输入成本中心" maxlength="50" disabled/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="资金渠道" prop="assetsFundCanal">
                  <el-select v-model="accountsFormData.assetsFundCanal" placeholder="请选择增加选择">
                    <el-option
                        v-for="item in fundList"
                        :key="item.codeProperty1"
                        :label="item.codeName1"
                        :value="item.codeProperty1"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="增加原因" prop="addReason">
                  <el-select v-model="accountsFormData.addReason" placeholder="请选择增加选择">
                    <el-option
                        v-for="item in addreasonList"
                        :key="item.codeProperty1"
                        :label="item.codeName1"
                        :value="item.codeProperty1"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="使用状态" prop="usedState">
                  <el-select v-model="accountsFormData.usedState" placeholder="请选择使用状态">
                    <el-option
                      v-for="item in assetsstatusList"
                      :key="item.codeProperty1"
                      :label="item.codeName1"
                      :value="item.codeProperty1"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="一次提足分类" prop="gmGrantNbr">
                  <el-input v-model="accountsFormData.gmGrantNbr" placeholder="请输入一次提足分类" maxlength="20"/>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="一次提足描述" prop="gmDescription">
                  <el-input type="textarea" v-model="accountsFormData.gmDescription" placeholder="请输入一次提足描述" maxlength="200" :rows="2"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="card-section mb8" v-if="config.includes('0001')">
          <el-form ref="accountantForm" :model="accountantFormData" :rules="accountantFormRules" label-width="160px">
            <div class="card-title">会计准则</div>
            <el-row class="card-content card-content-move">
              <el-col :span="8">
                <el-form-item label="原值" prop="originalValue">
                  <el-input v-model="accountantFormData.originalValue" placeholder="请输入原值" maxlength="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="净值" prop="nowValue">
                  <el-input v-model="accountantFormData.nowValue" placeholder="请输入净值" maxlength="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="累计折旧" prop="addDepreciate">
                  <el-input v-model="accountantFormData.addDepreciate" placeholder="请输入累计折旧" maxlength="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="减值准备" prop="devalueValue">
                  <el-input v-model="accountantFormData.devalueValue" placeholder="请输入减值准备" maxlength="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="折旧年限" prop="depreciateYear">
                  <el-input v-model="accountantFormData.depreciateYear" placeholder="请输入折旧年限" maxlength="4" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="折旧期间" prop="erpNdper">
                  <el-input v-model="accountantFormData.erpNdper" placeholder="请输入折旧期间" :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="残值率" prop="scrapValueRate">
                  <el-input v-model="accountantFormData.scrapValueRate" placeholder="请输入残值率" maxlength="14" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="残值" prop="scrapValue">
                  <el-input v-model="accountantFormData.scrapValue" placeholder="请输入残值" maxlength="14" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="折旧方法" prop="depreciateCode">
                  <el-input v-model="accountantFormData.depreciateCode" placeholder="请输入折旧方法" maxlength="12" :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="尚可使用月数" prop="usableYear">
                  <el-input v-model="accountantFormData.usableYear" placeholder="请输入尚可使用月数" maxlength="4" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="card-section mb8" v-if="config.includes('0002')">
          <el-form ref="taxForm" :model="taxFormData" :rules="taxFormRules" label-width="160px">
            <div class="card-title">税务准则</div>
            <el-row class="card-content card-content-move">
              <el-col :span="8">
                <el-form-item label="原值" prop="originalValue">
                  <el-input v-model="taxFormData.originalValue" placeholder="请输入原值" maxlength="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="净值" prop="nowValue">
                  <el-input v-model="taxFormData.nowValue" placeholder="请输入净值" maxlength="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="累计折旧" prop="addDepreciate">
                  <el-input v-model="taxFormData.addDepreciate" placeholder="请输入累计折旧" maxlength="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="减值准备" prop="devalueValue">
                  <el-input v-model="taxFormData.devalueValue" placeholder="请输入减值准备" maxlength="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="折旧年限" prop="depreciateYear">
                  <el-input v-model="taxFormData.depreciateYear" placeholder="请输入折旧年限" maxlength="4" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="折旧期间" prop="erpNdper">
                  <el-input v-model="taxFormData.erpNdper" placeholder="请输入折旧期间"  :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="残值率" prop="scrapValueRate">
                  <el-input v-model="taxFormData.scrapValueRate" placeholder="请输入残值率" maxlength="14" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="残值" prop="scrapValue">
                  <el-input v-model="taxFormData.scrapValue" placeholder="请输入残值" maxlength="14" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="折旧方法" prop="depreciateCode">
                  <el-input v-model="taxFormData.depreciateCode" placeholder="请输入折旧方法" maxlength="12" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="尚可使用月数" prop="usableYear">
                  <el-input v-model="taxFormData.usableYear" placeholder="请输入尚可使用月数" maxlength="4" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="加计成本率" prop="taxCostRate">
                  <el-input v-model="taxFormData.taxCostRate" placeholder="请输入加计成本率" maxlength="13"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="计税原值" prop="taxOriginalValue">
                  <el-input v-model="taxFormData.taxOriginalValue" placeholder="请输入计税原值" maxlength="13"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="card-section mb8" v-if="config.includes('0003')">
          <el-form ref="assessmentForm" :model="assessmentFormData" :rules="assessmentFormRules" label-width="160px">
            <div class="card-title">评估准则</div>
            <el-row class="card-content card-content-move">
              <el-col :span="8">
                <el-form-item label="原值" prop="originalValue">
                  <el-input v-model="assessmentFormData.originalValue" placeholder="请输入原值" maxlength="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="净值" prop="nowValue">
                  <el-input v-model="assessmentFormData.nowValue" placeholder="请输入净值" maxlength="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="累计折旧" prop="addDepreciate">
                  <el-input v-model="assessmentFormData.addDepreciate" placeholder="请输入累计折旧" maxlength="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="减值准备" prop="devalueValue">
                  <el-input v-model="assessmentFormData.devalueValue" placeholder="请输入减值准备" maxlength="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="折旧年限" prop="depreciateYear">
                  <el-input v-model="assessmentFormData.depreciateYear" placeholder="请输入折旧年限" maxlength="4" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="折旧期间" prop="erpNdper">
                  <el-input v-model="assessmentFormData.erpNdper" placeholder="请输入折旧期间" :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="残值率" prop="scrapValueRate">
                  <el-input v-model="assessmentFormData.scrapValueRate" placeholder="请输入残值率" maxlength="14" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="残值" prop="scrapValue">
                  <el-input v-model="assessmentFormData.scrapValue" placeholder="请输入残值" maxlength="14" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="折旧方法" prop="depreciateCode">
                  <el-input v-model="assessmentFormData.depreciateCode" placeholder="请输入折旧方法" maxlength="12" :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="尚可使用月数" prop="usableYear">
                  <el-input v-model="assessmentFormData.usableYear" placeholder="请输入尚可使用月数" maxlength="4" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="card-section mb8" v-if="config.includes('0004')">
          <el-form ref="supervisionForm" :model="supervisionFormData" :rules="supervisionFormRules" label-width="160px">
            <div class="card-title">自定义准则</div>
            <el-row class="card-content card-content-move">
              <el-col :span="8">
                <el-form-item label="原值" prop="originalValue">
                  <el-input v-model="supervisionFormData.originalValue" placeholder="请输入原值" maxlength="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="净值" prop="nowValue">
                  <el-input v-model="supervisionFormData.nowValue" placeholder="请输入净值" maxlength="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="累计折旧" prop="addDepreciate">
                  <el-input v-model="supervisionFormData.addDepreciate" placeholder="请输入累计折旧" maxlength="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="减值准备" prop="devalueValue">
                  <el-input v-model="supervisionFormData.devalueValue" placeholder="请输入减值准备" maxlength="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="折旧年限" prop="depreciateYear">
                  <el-input v-model="supervisionFormData.depreciateYear" placeholder="请输入折旧年限" maxlength="4" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="折旧期间" prop="erpNdper">
                  <el-input v-model="supervisionFormData.erpNdper" placeholder="请输入折旧期间" :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="残值率" prop="scrapValueRate">
                  <el-input v-model="supervisionFormData.scrapValueRate" placeholder="请输入残值率" maxlength="14" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="残值" prop="scrapValue">
                  <el-input v-model="supervisionFormData.scrapValue" placeholder="请输入残值" maxlength="14" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="折旧方法" prop="depreciateCode">
                  <el-input v-model="supervisionFormData.depreciateCode" placeholder="请输入折旧方法" maxlength="12" :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="尚可使用月数" prop="usableYear">
                  <el-input v-model="supervisionFormData.usableYear" placeholder="请输入尚可使用月数" maxlength="4" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
    </div>
  </el-card>
  <choose-complex ref="refComplexCard" @handleComplexData="handleComplexData"/>
</template>

<script setup name="FinancialInfo">
import { getCodeData } from '@/api/system/complexCode';
import chooseComplex from '@/views/system/card/complexCode/index';

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
  config: {
    type: Array,
    default: () => []
  }
  // accountsFormParams: {
  //   type: Object,
  //   default: () => {}
  // },
  // accountantFormParams: {
  //   type: Object,
  //   default: () => {}
  // },
  // taxFormParams: {
  //   type: Object,
  //   default: () => {}
  // },
  // assessmentFormParams: {
  //   type: Object,
  //   default: () => {}
  // },
  // supervisionFormParams: {
  //   type: Object,
  //   default: () => {}
  // }
});

// 表单数据
// 四个准则信息：会计准则、税务准则、评估准则、成本监审准则 表单数据
// 核算表单
const accountsFormData = ref({})
// 会计准则
const accountantFormData = ref({
  normType: '0001',
  erpNdper: 0
})
// 税务准则
const taxFormData = ref({
  normType: '0002',
  erpNdper: 0
})
// 评估准则
const assessmentFormData = ref({
  normType: '0003',
  erpNdper: 0
})
// 自定义准则
const supervisionFormData = ref({
  normType: '0004',
  erpNdper: 0
})
// 表单校验规则
// 核算信息
const accountsFormRules = reactive({
  dutyCenterName: [
    {required: false, message: "责任中心不能为空", trigger: "blur"}
  ],
  assetsFundCanal: [
    {required: false, message: "资金渠道不能为空", trigger: "blur"}
  ],
  addReason: [
    {required: true, message: "增加原因不能为空", trigger: "blur"}
  ],
  usedState: [
    {required: true, message: "使用状态不能为空", trigger: "blur"}
  ],
  functionalScopeName: [
    {required: true, message: "功能范围不能为空", trigger: "blur"}
  ],
  fmisCostCenterName: [
    {required: false, message: "成本中心不能为空", trigger: "blur"}
  ],
  branchName: [
    {required: true, message: "分线不能为空", trigger: "blur"}
  ]
})
// 四个准则信息：会计准则、税务准则、评估准则、成本监审准则 表单校验规则
// 会计准则
const accountantFormRules = reactive({
  originalValue: [
    { required: true, message: "原值不能为空", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  usedState: [
    { required: true, message: "使用状态不能为空", trigger: "blur" }
  ],
  assetsFundCanal: [
    { required: false, message: "资金渠道不能为空", trigger: "blur" }
  ],
  addReason: [
    { required: true, message: "增加原因不能为空", trigger: "blur" }
  ],
  nowValue: [
    { required: true, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  addDepreciate: [
    { required: true, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  devalueValue: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  depreciateYear: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^[0-9]*[1-9][0-9]*$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  erpNdper: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^([1-9]\d*|[0]{1,1})$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  scrapValueRate: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  scrapValue: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  usableYear: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^[0-9]*[1-9][0-9]*$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  taxCostRate: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  taxOriginalValue: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ]
})
// 税务准则
const taxFormRules = reactive({
  originalValue: [
    { required: true, message: "原值不能为空", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  usedState: [
    { required: true, message: "使用状态不能为空", trigger: "blur" }
  ],
  assetsFundCanal: [
    { required: false, message: "资金渠道不能为空", trigger: "blur" }
  ],
  addReason: [
    { required: true, message: "增加原因不能为空", trigger: "blur" }
  ],
  nowValue: [
    { required: true, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  addDepreciate: [
    { required: true, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  devalueValue: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  depreciateYear: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^[0-9]*[1-9][0-9]*$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  erpNdper: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^([1-9]\d*|[0]{1,1})$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  scrapValueRate: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  scrapValue: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  usableYear: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^[0-9]*[1-9][0-9]*$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  taxCostRate: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  taxOriginalValue: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ]
})
// 评估准则
const assessmentFormRules = reactive({
  originalValue: [
    { required: true, message: "原值不能为空", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  usedState: [
    { required: true, message: "使用状态不能为空", trigger: "blur" }
  ],
  assetsFundCanal: [
    { required: false, message: "资金渠道不能为空", trigger: "blur" }
  ],
  addReason: [
    { required: true, message: "增加原因不能为空", trigger: "blur" }
  ],
  nowValue: [
    { required: true, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  addDepreciate: [
    { required: true, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  devalueValue: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  depreciateYear: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^[0-9]*[1-9][0-9]*$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  erpNdper: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^([1-9]\d*|[0]{1,1})$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  scrapValueRate: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  scrapValue: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  usableYear: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^[0-9]*[1-9][0-9]*$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  taxCostRate: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  taxOriginalValue: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ]
})
// 成本监审准则
const supervisionFormRules = reactive({
  originalValue: [
    { required: true, message: "原值不能为空", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  usedState: [
    { required: true, message: "使用状态不能为空", trigger: "blur" }
  ],
  assetsFundCanal: [
    { required: false, message: "资金渠道不能为空", trigger: "blur" }
  ],
  addReason: [
    { required: true, message: "增加原因不能为空", trigger: "blur" }
  ],
  nowValue: [
    { required: true, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  addDepreciate: [
    { required: true, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  devalueValue: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  depreciateYear: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^[0-9]*[1-9][0-9]*$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  erpNdper: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^([1-9]\d*|[0]{1,1})$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  scrapValueRate: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  scrapValue: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  usableYear: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^[0-9]*[1-9][0-9]*$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  taxCostRate: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  taxOriginalValue: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ]
})
// 获取表单字典值

// 定义单据表单数据
const invoiceData = reactive({
  invoiceForm: {}
});
const { invoiceForm } = toRefs(invoiceData);
// 打开综合编码
const refComplexCard = ref();

// 字典数据声明
const fundList = ref([]);
const addreasonList = ref([]);
const assetsstatusList = ref([]);
// 获取字典列表
getCodeList('fund').then(res => {
  fundList.value = res
})
getCodeList('addreason').then(res => {
  addreasonList.value = res
})
getCodeList('assetsstatus').then(res => {
  assetsstatusList.value = res
})

defineExpose({
  accountsFormData,
  accountantFormData,
  taxFormData,
  assessmentFormData,
  supervisionFormData,
  formValidate
})

onMounted(() => {
  // 如果是修改就重新赋值
  // const { accountsFormParams }  = props
  // if (Object.keys(accountsFormParams).length) {
  //   accountsFormData.value = accountsFormParams
  // }
  // if (Object.keys(accountantFormParams).length) {
  //   accountantFormData.value = accountantFormParams
  // }
  // if (Object.keys(taxFormParams).length) {
  //   taxFormData.value = taxFormParams
  // }
  // if (Object.keys(assessmentFormParams).length) {
  //   assessmentFormData.value = assessmentFormParams
  // }
  // if (Object.keys(supervisionFormParams).length) {
  //   supervisionFormData.value = supervisionFormParams
  // }
})

// 获取字典数据
function getCodeList(codeProperty) {
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
  const formName = ['accountsForm', 'accountantForm', 'taxForm', 'assessmentForm', 'supervisionForm']
  const validates = (item) => {
    return new Promise((resolve, reject) => {
      if (!proxy.$refs[item]) {
        resolve()
        return false
      }
      proxy.$refs[item].validate((valid) => {
        if (valid) {
          resolve()
        } else {
          reject(new Error('验证不对'))
        }
      })
    })
  }
  return Promise.all(formName.map(item => validates(item))).then(() => {
    let formData = { ...accountsFormData.value, valueList: [] }
    if (props.config.includes('0001')) {
      // formData = { ...formData, 'value0001': }
      formData.valueList.push(toRaw(accountantFormData.value))
    }
    if (props.config.includes('0002')) {
      // formData = { ...formData, 'value0002': toRaw(taxFormData.value)}
      formData.valueList.push(toRaw(taxFormData.value))
    }
    if (props.config.includes('0003')) {
      // formData = { ...formData, 'value0003': toRaw(assessmentFormData.value)}
      formData.valueList.push(toRaw(assessmentFormData.value))
    }
    if (props.config.includes('0004')) {
      // formData = { ...formData, 'value0004': toRaw(supervisionFormData.value)}
      formData.valueList.push(toRaw(supervisionFormData.value))
    }
    return Promise.resolve(formData)
  }).catch(() => {
    return Promise.reject(false)
  })
}

// 切换form
function handleMenuSelect(key) {
  console.log(key)
  activeIndex.value = key
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
.el-menu--horizontal {
  margin-bottom: 10px;
}
.el-menu-item {
  height: 30px !important;
}
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
    .card-title {
      display: inline-block;
      margin-left: 16px;
      margin-bottom: 10px;
      font-weight: 500;
      border-bottom: 3px solid var(--el-color-primary);
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
