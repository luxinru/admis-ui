<template>
  <el-dialog v-if="open" :title="title" v-model="open" width="85vw" top="5vh" append-to-body :close-on-click-modal='false' @opened="openDialog" @closed="closeDialog">
    <el-row>
      <el-col :span="2">
        <div class="list-menu">
          <div
              class="menu-item"
              v-for="item in listMenu"
              :key="item.id"
              :class="item.id === currMenuId ? 'active' : ''"
              @click="scrollInto(item.id)"
          >
            <span class="title-text">{{ item.text }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="22">
        <!--实物信息-->
        <el-card v-show="materialObjectOpen" class="mb8" :body-style="{padding: '12px 0'}">
          <el-form ref="materialObjectFormRef" :model="materialObjectForm"  :rules="materialObjectOpen?materialObjectFormRules:null" label-width="130px">
            <div class="card-item">
              <div class="sub-tittle" id="material-card1" :class="'material-card1' === currMenuId ? 'active' : ''"><span class="title-text">实物信息</span></div>
              <div class="card-section">
                <el-row class="card-content">
                  <el-col :span="8">
                    <el-form-item label="资产编号" prop="assetsCode">
                      <el-input v-model="materialObjectForm.assetsCode" placeholder="保存后自动生成" maxlength="50" disabled/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="资产名称" prop="assetsName">
                      <el-input v-model="materialObjectForm.assetsName" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="资产分类编码" prop="contentAssetsCode">
                      <el-select v-model="materialObjectForm.contentAssetsCode" placeholder="综合编码字典">
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"
                                   :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="资产分类名称" prop="contentAssetsName">
                      <el-input v-model="materialObjectForm.contentAssetsName" placeholder="请输入" maxlength="25"
                                disabled/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="资产类型" prop="assetsType">
                      <el-select v-model="materialObjectForm.assetsType" placeholder="综合编码字典" :disabled="setDisabledStatus()">
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"  :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="规格型号" prop="assetsStandard">
                      <el-input v-model="materialObjectForm.assetsStandard" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="制造厂商" prop="makeFactory">
                      <el-input v-model="materialObjectForm.makeFactory" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="出厂编号" prop="productCode">
                      <el-input v-model="materialObjectForm.productCode" placeholder="请输入" maxlength="25"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="计量单位" prop="unitCodeName">
                      <el-select v-model="materialObjectForm.unitCodeName" placeholder="综合编码字典">
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"
                                   :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="移动属性" prop="equipTypeName">
                      <el-select v-model="materialObjectForm.equipTypeName" placeholder="综合编码字典">
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"
                                   :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所属单位" prop="departName">
                      <el-select v-model="materialObjectForm.departName" placeholder="所属单位共用弹窗"
                                 @change="departLinkageDutyFmisCostCenter()" :disabled="setDisabledStatus()">
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"
                                   :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="存放地点" prop="storePlaceName">
                      <el-select v-model="materialObjectForm.storePlaceName" placeholder="综合编码字典">
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"
                                   :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="保管人" prop="userPerson">
                      <el-input v-model="materialObjectForm.userPerson" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="资产状态" prop="technicalConditionName">
                      <el-select v-model="materialObjectForm.technicalConditionName" placeholder="综合编码字典">
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"
                                   :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="增加日期" prop="addVoucherDate">
                      <el-input v-model="materialObjectForm.addVoucherDate" placeholder="自动生成" maxlength="50" :disabled="setDisabledStatus(true)"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="合同编号" prop="contractCode">
                      <el-input v-model="materialObjectForm.contractCode" placeholder="请输入" maxlength="25"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="合同名称" prop="contractName">
                      <el-input v-model="materialObjectForm.contractName" placeholder="请输入合同名称" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="基层鉴定部门" prop="basicJudgeDepartName">
                      <el-input v-model="materialObjectForm.basicJudgeDepartName" placeholder="保存后自动生成" maxlength="50"
                                disabled/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="地区公司鉴定部门" prop="regionJudgeDepartName">
                      <el-input v-model="materialObjectForm.regionJudgeDepartName" placeholder="保存后自动生成" maxlength="50"
                                disabled/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="投产日期" prop="operateDate">
                      <el-date-picker
                          v-model="materialObjectForm.operateDate"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="选择投产日期"
                          :disabled="setDisabledStatus()"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="车牌号" prop="licenceNumber">
                      <el-input v-model="materialObjectForm.licenceNumber" placeholder="请输入车牌号" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="条码" prop="barCode">
                      <el-input v-model="materialObjectForm.barCode" placeholder="请输入条码" maxlength="50" disabled/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="参考原值" prop="referenceOriginalValue">
                      <el-input v-model="materialObjectForm.referenceOriginalValue" placeholder="请输入参考原值"
                                maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="成本监审分类编码" prop="costCategory">
                      <el-input v-model="materialObjectForm.costCategory" placeholder="请输入成本监审分类编码" maxlength="25"
                                disabled/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="成本监审分类名称" prop="costCategoryName">
                      <el-input v-model="materialObjectForm.costCategoryName" placeholder="请输入成本监审分类名称" maxlength="50"
                                disabled/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="materialObjectForm.remark" placeholder="请输入备注" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-form>
        </el-card>
        <!-- 核算信息 -->
        <el-card v-show="accountsOpen" class="mb8" :body-style="{padding: '12px 0'}">
          <el-form ref="accountsOpenFormRef" :model="accountsOpenForm" :rules="accountsOpen?accountsOpenFormRules:null" label-width="130px">
            <div class="card-item">
              <div class="sub-tittle" id="accounts-card1" :class="'accounts-card1' === currMenuId ? 'active' : ''"><span
                  class="title-text">核算信息</span></div>
              <div class="card-section">
                <el-row class="card-content">
                  <el-col :span="8">
                    <el-form-item label="责任中心" prop="dutyCenterName">
                      <el-input v-model="accountsOpenForm.dutyCenterName" placeholder="请输入责任中心" maxlength="50" disabled/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="资金渠道" prop="assetsFundCanalName">
                      <el-select v-model="accountsOpenForm.assetsFundCanalName" placeholder="综合编码字典">
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"
                                   :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="增加原因" prop="addReasonName">
                      <el-select v-model="accountsOpenForm.addReasonName" placeholder="综合编码字典">
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"
                                   :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用状态" prop="usedStateName">
                      <el-select v-model="accountsOpenForm.usedStateName" placeholder="综合编码字典">
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"
                                   :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="成本中心" prop="fmisCostCenterName">
                      <el-input v-model="accountsOpenForm.fmisCostCenterName" placeholder="请输入成本中心" maxlength="25" disabled/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="功能范围" prop="functionalScopeName">
                      <el-select v-model="accountsOpenForm.functionalScopeName" placeholder="综合编码字典">
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"
                                   :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="分 线" prop="branchName">
                      <el-select v-model="accountsOpenForm.branchName" placeholder="综合编码字典">
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"
                                   :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="分线类型" prop="branchTypeName">
                      <el-input v-model="accountsOpenForm.branchTypeName" placeholder="请输入分线类型" maxlength="25" disabled/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="价 区" prop="priceAreaName">
                      <el-input v-model="accountsOpenForm.priceAreaName" placeholder="请输入价区" maxlength="50" disabled/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="减值原因" prop="devalueReason">
                      <el-select v-model="accountsOpenForm.devalueReason" placeholder="综合编码字典">
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"
                                   :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="项目编号" prop="wbsProjectCode">
                      <el-select v-model="accountsOpenForm.wbsProjectCode" placeholder="综合编码字典">
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"
                                   :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="项目名称" prop="wbsProjectName">
                      <el-input v-model="accountsOpenForm.wbsProjectName" placeholder="请输入项目名称" maxlength="25" disabled/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-form>
        </el-card>
        <!--准则信息-->
        <el-card v-show="normOpen" class="mb8" :body-style="{padding: '12px 0'}">
          <el-form ref="normOpenAccountantFormRef" :model="normOpenAccountantForm"
                   :rules="normOpen?normOpenAccountantFormRules:null" label-width="130px">
            <div class="card-item">
              <div class="sub-tittle" id="norm-card1" :class="'norm-card1' === currMenuId ? 'active' : ''"><span
                  class="title-text">会计准则</span></div>
              <div class="card-section">
                <el-row class="card-content">
                  <el-col :span="8">
                    <el-form-item label="原值" prop="originalValue">
                      <el-input v-model="normOpenAccountantForm.originalValue" placeholder="请输入原值" maxlength="50"
                                @blur="accountantOriginalValueLinkageOtherNorm()"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="净值" prop="nowValue">
                      <el-input v-model="normOpenAccountantForm.nowValue" placeholder="请输入净值" maxlength="25" disabled/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="累计折旧" prop="addDepreciate">
                      <el-input v-model="normOpenAccountantForm.addDepreciate" placeholder="请输入累计折旧" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="减值准备" prop="devalueValue">
                      <el-input v-model="normOpenAccountantForm.devalueValue" placeholder="请输入减值准备" maxlength="25"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="尚可使用月份" prop="usableYear">
                      <el-input v-model="normOpenAccountantForm.usableYear" placeholder="请输入尚可使用月份" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="折旧方法" prop="depreciateCode">
                      <el-select v-model="normOpenAccountantForm.depreciateCode" placeholder="综合编码字典" disabled>
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"
                                   :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="折旧年限" prop="depreciateYear">
                      <el-input v-model="normOpenAccountantForm.depreciateYear" placeholder="请输入折旧年限" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="残值" prop="scrapValue">
                      <el-input v-model="normOpenAccountantForm.scrapValue" placeholder="请输入残值" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="残值率" prop="scrapValueRate">
                      <el-input v-model="normOpenAccountantForm.scrapValueRate" placeholder="请输入残值率" maxlength="50" disabled/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-form>

          <el-form ref="normOpenTaxFormRef" :model="normOpenTaxForm" :rules="normOpen?normOpenTaxFormRules:null" label-width="130px">
            <div class="card-item">
              <div class="sub-tittle" id="norm-card2" :class="'norm-card2' === currMenuId ? 'active' : ''"><span
                  class="title-text">税务准则</span></div>
              <div class="card-section">
                <el-row class="card-content">
                  <el-col :span="8">
                    <el-form-item label="原值" prop="originalValue">
                      <el-input v-model="normOpenTaxForm.originalValue" placeholder="请输入原值" maxlength="50"
                                @blur="taxOriginalValueLinkageNowValue()"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="净值" prop="nowValue">
                      <el-input v-model="normOpenTaxForm.nowValue" placeholder="请输入净值" maxlength="25" disabled/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="累计折旧" prop="addDepreciate">
                      <el-input v-model="normOpenTaxForm.addDepreciate" placeholder="请输入累计折旧" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="减值准备" prop="devalueValue">
                      <el-input v-model="normOpenTaxForm.devalueValue" placeholder="请输入减值准备" maxlength="25"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="尚可使用月份" prop="usableYear">
                      <el-input v-model="normOpenTaxForm.usableYear" placeholder="请输入尚可使用月份" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="折旧方法" prop="depreciateCode">
                      <el-select v-model="normOpenTaxForm.depreciateCode" placeholder="综合编码字典" disabled>
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"
                                   :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="折旧年限" prop="depreciateYear">
                      <el-input v-model="normOpenTaxForm.depreciateYear" placeholder="请输入折旧年限" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="残值" prop="scrapValue">
                      <el-input v-model="normOpenTaxForm.scrapValue" placeholder="请输入残值" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="残值率" prop="scrapValueRate">
                      <el-input v-model="normOpenTaxForm.scrapValueRate" placeholder="请输入残值率" maxlength="50" disabled/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-form>
          <el-form ref="normOpenAssessmentFormRef" :model="normOpenAssessmentForm" :rules="normOpen?normOpenAssessmentFormRules:null" label-width="130px">
            <div class="card-item">
              <div class="sub-tittle" id="norm-card3" :class="'norm-card3' === currMenuId ? 'active' : ''"><span
                  class="title-text">评估准则</span></div>
              <div class="card-section">
                <el-row class="card-content">
                  <el-col :span="8">
                    <el-form-item label="原值" prop="originalValue">
                      <el-input v-model="normOpenAssessmentForm.originalValue" placeholder="请输入原值" maxlength="50"
                                @blur="assessmentOriginalValueLinkageNowValue()"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="净值" prop="nowValue">
                      <el-input v-model="normOpenAssessmentForm.nowValue" placeholder="请输入净值" maxlength="25" disabled/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="累计折旧" prop="addDepreciate">
                      <el-input v-model="normOpenAssessmentForm.addDepreciate" placeholder="请输入累计折旧" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="减值准备" prop="devalueValue">
                      <el-input v-model="normOpenAssessmentForm.devalueValue" placeholder="请输入减值准备" maxlength="25"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="尚可使用月份" prop="usableYear">
                      <el-input v-model="normOpenAssessmentForm.usableYear" placeholder="请输入尚可使用月份" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="折旧方法" prop="depreciateCode">
                      <el-select v-model="normOpenAssessmentForm.depreciateCode" placeholder="综合编码字典" disabled>
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"
                                   :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="折旧年限" prop="depreciateYear">
                      <el-input v-model="normOpenAssessmentForm.depreciateYear" placeholder="请输入折旧年限" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="残值" prop="scrapValue">
                      <el-input v-model="normOpenTaxForm.scrapValue" placeholder="请输入残值" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="残值率" prop="scrapValueRate">
                      <el-input v-model="normOpenAssessmentForm.scrapValueRate" placeholder="请输入残值率" maxlength="50" disabled/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-form>
          <el-form ref="normOpenSupervisionFormRef" :model="normOpenSupervisionForm"
                   :rules="normOpen?normOpenSupervisionFormRules:null" label-width="130px">
            <div class="card-item">
              <div class="sub-tittle" id="norm-card4" :class="'norm-card4' === currMenuId ? 'active' : ''"><span
                  class="title-text">成本监审准则</span></div>
              <div class="card-section">
                <el-row class="card-content">
                  <el-col :span="8">
                    <el-form-item label="原值" prop="originalValue">
                      <el-input v-model="normOpenSupervisionForm.originalValue" placeholder="请输入原值" maxlength="50"
                                @blur="supervisionOriginalValueLinkageNowValue()"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="净值" prop="nowValue">
                      <el-input v-model="normOpenSupervisionForm.nowValue" placeholder="请输入净值" maxlength="25" disabled/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="累计折旧" prop="addDepreciate">
                      <el-input v-model="normOpenSupervisionForm.addDepreciate" placeholder="请输入累计折旧" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="减值准备" prop="devalueValue">
                      <el-input v-model="normOpenSupervisionForm.devalueValue" placeholder="请输入减值准备" maxlength="25"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="尚可使用月份" prop="usableYear">
                      <el-input v-model="normOpenSupervisionForm.usableYear" placeholder="请输入尚可使用月份" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="折旧方法" prop="depreciateCode">
                      <el-select v-model="normOpenSupervisionForm.depreciateCode" placeholder="综合编码字典" disabled>
                        <el-option v-for="dict in tempOptions" :key="dict.tempCode" :label="dict.tempName"
                                   :value="dict.tempCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="折旧年限" prop="depreciateYear">
                      <el-input v-model="normOpenSupervisionForm.depreciateYear" placeholder="请输入折旧年限" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="残值" prop="scrapValue">
                      <el-input v-model="normOpenSupervisionForm.scrapValue" placeholder="请输入残值" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="残值率" prop="scrapValueRate">
                      <el-input v-model="normOpenSupervisionForm.scrapValueRate" placeholder="请输入残值率" maxlength="50" disabled/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-form>
        </el-card>
        <!-- 技术信息 -->
        <el-card v-show="technologyOpen" class="mb8" :body-style="{padding: '12px 0'}">
          <el-form ref="technologyOpenFormRef" :model="technologyOpenForm" :rules="technologyOpen?technologyOpenFormRules:null" label-width="130px">
            <div class="card-item">
              <div class="sub-tittle" id="technology-card1" :class="'technology-card1' === currMenuId ? 'active' : ''"><span
                  class="title-text">技术信息</span></div>
              <div class="card-section">
                <el-row class="card-content">
                  <el-col :span="8">
                    <el-form-item label="项目名称" prop="char_item1">
                      <el-input v-model="technologyOpenForm.char_item1" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="合同编码" prop="char_item2">
                      <el-input v-model="technologyOpenForm.char_item2" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="合同名称" prop="char_item3">
                      <el-input v-model="technologyOpenForm.char_item3" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="项目编号" prop="char_item4">
                      <el-input v-model="technologyOpenForm.char_item4" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="复合数量" prop="char_item5">
                      <el-input v-model="technologyOpenForm.char_item5" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="功率能力" prop="char_item6">
                      <el-input v-model="technologyOpenForm.char_item6" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="停产日期" prop="char_item7">
                      <el-input v-model="technologyOpenForm.char_item7" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="井管类型及长度" prop="char_item8">
                      <el-input v-model="technologyOpenForm.char_item8" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="井径或管径" prop="char_item9">
                      <el-input v-model="technologyOpenForm.char_item9" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="井深" prop="char_item10">
                      <el-input v-model="technologyOpenForm.char_item10" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="汇率" prop="char_item11">
                      <el-input v-model="technologyOpenForm.char_item11" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="存放地点" prop="char_item12">
                      <el-input v-model="technologyOpenForm.char_item12" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="评估净值" prop="char_item13">
                      <el-input v-model="technologyOpenForm.char_item13" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="评估原值" prop="char_item14">
                      <el-input v-model="technologyOpenForm.char_item14" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="资产清查" prop="char_item15">
                      <el-input v-model="technologyOpenForm.char_item15" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="评估基准日" prop="char_item16">
                      <el-input v-model="technologyOpenForm.char_item16" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="设计能力" prop="char_item17">
                      <el-input v-model="technologyOpenForm.char_item17" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="发动机号" prop="char_item18">
                      <el-input v-model="technologyOpenForm.char_item18" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="车架号码" prop="char_item19">
                      <el-input v-model="technologyOpenForm.char_item19" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="颜色" prop="char_item20">
                      <el-input v-model="technologyOpenForm.char_item20" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="燃油（气）类型" prop="char_item21">
                      <el-input v-model="technologyOpenForm.char_item21" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="档案号码" prop="char_item22">
                      <el-input v-model="technologyOpenForm.char_item22" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="土地证号或房屋所有权证号" prop="char_item23">
                      <el-input v-model="technologyOpenForm.char_item23" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="层数" prop="char_item24">
                      <el-input v-model="technologyOpenForm.char_item24" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="位置" prop="char_item25">
                      <el-input v-model="technologyOpenForm.char_item25" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="房屋结构" prop="char_item26">
                      <el-input v-model="technologyOpenForm.char_item26" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="土地类型" prop="char_item27">
                      <el-input v-model="technologyOpenForm.char_item27" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="资产类别年限" prop="num_item1">
                      <el-input v-model="technologyOpenForm.num_item1" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="资产类别残值率" prop="num_item2">
                      <el-input v-model="technologyOpenForm.num_item2" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-form>
        </el-card>
        <!--房屋信息-->
        <el-card v-show="houseOpen" class="mb8" :body-style="{padding: '12px 0'}">
          <!--房屋信息-->
          <el-form ref="houseOpenFormRef" :model="houseOpenForm" :rules="houseOpen?houseOpenFormRules:null" label-width="170px">
            <div class="card-item">
              <div class="sub-tittle" id="house-card0" :class="'house-card0' === currMenuId ? 'active' : ''"><span
                  class="title-text"></span></div>
              <div class="card-section">
                <el-row class="card-content card-content-move">
                  <el-col :span="8">
                    <el-form-item label="档案名称" prop="filesName" class="move-item">
                      <el-input v-model="houseOpenForm.filesName" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="实际名称" prop="actualName">
                      <el-input v-model="houseOpenForm.actualName" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-show="againShow">
                    <el-form-item label="细化资产编码" prop="itemDisplace">
                      <el-input v-model="houseOpenForm.assetsCode" placeholder="本次细化后新资产编码" disabled maxlength="50"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="card-item">
              <div class="sub-tittle" id="house-card1" :class="'house-card1' === currMenuId ? 'active' : ''"><span
                  class="title-text">权证类</span></div>
              <div class="card-section">
                <el-row class="card-content card-content-move">
                  <el-col :span="8">
                    <el-form-item label="宗地编号" prop="parcelCode">
                      <el-input v-model="houseOpenForm.parcelCode" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="权属状况" prop="ownershipConditionName">
                      <el-input v-model="houseOpenForm.ownershipConditionName" readonly
                                @click="openComplexCodeCard('ownershipCondition', '权属状况')" placeholder="请选择"
                                maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用权类型" prop="usedrightTypeName">
                      <el-input v-model="houseOpenForm.usedrightTypeName" readonly
                                @click="openComplexCodeCard('usedrightType', '使用权类型')" placeholder="请选择"
                                maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="土地面积" prop="landArea">
                      <el-input v-model="houseOpenForm.landArea" placeholder="单位平方米" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="土地证号" prop="landCertificateNo">
                      <el-input v-model="houseOpenForm.landCertificateNo" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="土地使用权人" prop="landUsedHolder">
                      <el-input v-model="houseOpenForm.landUsedHolder" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="房产证号" prop="houseCertificateNo">
                      <el-input v-model="houseOpenForm.houseCertificateNo" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="权利类型" prop="rightTypeName">
                      <el-input v-model="houseOpenForm.rightTypeName" readonly
                                @click="openComplexCodeCard('rightType', '权利类型')" placeholder="请选择" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="证载所有权人" prop="certificateHolder">
                      <el-input v-model="houseOpenForm.certificateHolder" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="权利性质" prop="rightNatureName">
                      <el-input v-model="houseOpenForm.rightNatureName" readonly
                                @click="openComplexCodeCard('rightNature', '权利性质')" placeholder="请选择" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="办证情况" prop="certificateHandlingName">
                      <el-input v-model="houseOpenForm.certificateHandlingName" readonly
                                @click="openComplexCodeCard('certificateHandling', '办证情况')" placeholder="请选择"
                                maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="记账是否相等" prop="bookkeeping">
                      <el-input v-model="houseOpenForm.bookkeeping" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="无证原因" prop="noCertificateReason">
                      <el-input type="textarea" v-model="houseOpenForm.noCertificateReason" placeholder="请输入"
                                maxlength="50" :rows="2"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="card-item">
              <div class="sub-tittle" id="house-card2" :class="'house-card2' === currMenuId ? 'active' : ''"><span
                  class="title-text">位置信息</span></div>
              <div class="card-section">
                <el-row class="card-content">
                  <el-col :span="8">
                    <el-form-item label="省（直辖市）" prop="province">
                      <el-select v-model="houseOpenForm.province"
                                 placeholder="请选择省"
                                 @change="changePro">
                        <el-option v-for="item in addressData"
                                   :key="item.code"
                                   :label="item.name"
                                   :value="item.name">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="市" prop="city">
                      <el-select v-model="houseOpenForm.city"
                                 placeholder="请选择市"
                                 @change="changeCity">
                        <el-option v-for="item in cityData"
                                   :key="item.code"
                                   :label="item.name"
                                   :value="item.name">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="区（县）" prop="county">
                      <el-select v-model="houseOpenForm.county"
                                 placeholder="请选择区"
                                 @change="changeArea">
                        <el-option v-for="item in areaData"
                                   :key="item.code"
                                   :label="item.name"
                                   :value="item.name">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="详细地址" prop="addressDetail">
                      <el-input v-model="houseOpenForm.addressDetail" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="经度" prop="longitude">
                      <el-input v-model="houseOpenForm.longitude" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="纬度" prop="latitude">
                      <el-input v-model="houseOpenForm.latitude" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="房屋结构" prop="houseStructureName">
                      <el-input v-model="houseOpenForm.houseStructureName" readonly
                                @click="openComplexCodeCard('houseStructure', '房屋结构')" placeholder="请选择"
                                maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="建筑面积" prop="buildArea">
                      <el-input v-model="houseOpenForm.buildArea" placeholder="单位平方米" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="建筑物地上总层数" prop="floorsUpName">
                      <el-input v-model="houseOpenForm.floorsUpName" placeholder="请输入建筑物地上总层数" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label="建筑信息备注" prop="buildInfoRemark">
                      <el-input type="textarea" v-model="houseOpenForm.buildInfoRemark" placeholder="请输入" maxlength="50"
                                :rows="2"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="建筑物地下总层数" prop="floorsDownName">
                      <el-input v-model="houseOpenForm.floorsDownName" placeholder="请输入建筑物地下总层数" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="card-item">
              <div class="sub-tittle" id="house-card3" :class="'house-card3' === currMenuId ? 'active' : ''"><span
                  class="title-text">单位信息</span></div>
              <div class="card-section">
                <el-row class="card-content">
                  <el-col :span="8">
                    <el-form-item label="管理单位二级名称" prop="managerDepartTwoName">
                      <el-input v-model="houseOpenForm.managerDepartTwoName" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="管理单位三级名称" prop="managerDepartThreeName">
                      <el-input v-model="houseOpenForm.managerDepartThreeName" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="单位责任人" prop="managerDutyName">
                      <el-input v-model="houseOpenForm.managerDutyName" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="单位责任人联系方式" prop="managerDutyPhone">
                      <el-input v-model="houseOpenForm.managerDutyPhone" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用单位类别名称" prop="usedDepartCategoryName">
                      <el-input v-model="houseOpenForm.usedDepartCategoryName" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用单位二级名称" prop="usedDepartTwoName">
                      <el-input v-model="houseOpenForm.usedDepartTwoName" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用单位三级名称" prop="usedDepartThreeName">
                      <el-input v-model="houseOpenForm.usedDepartThreeName" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="外部单位名称" prop="usedDepartPartnerName">
                      <el-input v-model="houseOpenForm.usedDepartPartnerName" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="运营单位类别" prop="operateDepartCategoryName">
                      <el-input v-model="houseOpenForm.operateDepartCategoryName" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="card-item">
              <div class="sub-tittle" id="house-card4" :class="'house-card4' === currMenuId ? 'active' : ''"><span
                  class="title-text">财务信息</span></div>
              <div class="card-section">
                <el-row class="card-content">

                  <el-col :span="8">
                    <el-form-item label="税源属地" prop="taxSourceCity">
                      <el-input v-model="houseOpenForm.taxSourceCity" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="房产税计缴" prop="houseTaxName">
                      <el-input v-model="houseOpenForm.houseTaxName" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="年租金收入（不含税）" prop="annualRent">
                      <el-input v-model="houseOpenForm.annualRent" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="征税机关" prop="taxOffice">
                      <el-input v-model="houseOpenForm.taxOffice" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="土地使用税计缴" prop="landUsedTaxName">
                      <el-input v-model="houseOpenForm.landUsedTaxName" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="土地使用税适用税率" prop="taxRateLand">
                      <el-input v-model="houseOpenForm.taxRateLand" placeholder="单位元平方米.年" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <!--<el-col :span="8">-->
                  <!--  <el-form-item label="房产税解缴" prop="annualRent1">-->
                  <!--    <el-input v-model="houseOpenForm.annualRent" placeholder="请输入" maxlength="50"/>-->
                  <!--  </el-form-item>-->
                  <!--</el-col>-->
                  <el-col :span="8">
                    <el-form-item label="税务局代码" prop="taxBureauCode">
                      <el-input v-model="houseOpenForm.taxBureauCode" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="card-item">
              <div class="sub-tittle" id="house-card5" :class="'house-card5' === currMenuId ? 'active' : ''"><span
                  class="title-text">使用情况</span></div>
              <div class="card-section">
                <el-row class="card-content">
                  <el-col :span="8">
                    <el-form-item label="楼层" prop="floorsNumber">
                      <el-input v-model="houseOpenForm.floorsNumber" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="实际办公人数" prop="officePeopleCount">
                      <el-input v-model="houseOpenForm.officePeopleCount" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <!--<el-col :span="8">-->
                  <!--  <el-form-item label="房屋使用状态" prop="actualUsedName1">-->
                  <!--    <el-input v-model="houseOpenForm.actualUsedName" readonly @click="openComplexCodeCard('actualUsed', '使用权类型')" placeholder="请选择" maxlength="50"/>-->
                  <!--  </el-form-item>-->
                  <!--</el-col>-->
                  <el-col :span="8">
                    <el-form-item label="使用性质" prop="usedNatureName">
                      <el-input v-model="houseOpenForm.usedNatureName" readonly
                                @click="openComplexCodeCard('usedNature', '使用性质')" placeholder="请选择" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <!--<el-col :span="8">-->
                  <!--  <el-form-item label="房屋技术状况" prop="actualUsedName1">-->
                  <!--    <el-input v-model="houseOpenForm.actualUsedName" readonly @click="openComplexCodeCard('actualUsed', '使用权类型')" placeholder="请选择" maxlength="50"/>-->
                  <!--  </el-form-item>-->
                  <!--</el-col>-->
                  <el-col :span="8">
                    <el-form-item label="实际用途" prop="actualUsedName">
                      <el-input v-model="houseOpenForm.actualUsedName" readonly
                                @click="openComplexCodeCard('actualUsed', '使用权类型')" placeholder="请选择" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="开始停用/闲置/租出日期" prop="stopUsedDate">
                      <el-date-picker
                          v-model="houseOpenForm.stopUsedDate"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择时间"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="办公用房间数" prop="officeRoomsCount">
                      <el-input v-model="houseOpenForm.officeRoomsCount" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="公有房屋面积合计" prop="publicHouseArea">
                      <el-input v-model="houseOpenForm.publicHouseArea" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="使用面积" prop="officeUsedArea">
                      <el-input v-model="houseOpenForm.officeUsedArea" placeholder="单位平方米" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="会议用房数" prop="meetingRoomsCount">
                      <el-input v-model="houseOpenForm.meetingRoomsCount" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="会议用房使用面积" prop="meetingUsedArea">
                      <el-input v-model="houseOpenForm.meetingUsedArea" placeholder="单位平方米" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="停车场用途" prop="parkingUsedName">
                      <el-input v-model="houseOpenForm.parkingUsedName" readonly
                                @click="openComplexCodeCard('parkingUsed', '停车场用途')" placeholder="请选择" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="停车场车位数" prop="parkingSpaceCount">
                      <el-input v-model="houseOpenForm.parkingSpaceCount" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="停车场使用面积" prop="parkingUsedArea">
                      <el-input v-model="houseOpenForm.parkingUsedArea" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="其他房屋间数" prop="otherRoomdCount">
                      <el-input v-model="houseOpenForm.otherRoomdCount" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="其他房屋使用面积" prop="otherUsedArea">
                      <el-input v-model="houseOpenForm.otherUsedArea" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="垂直电梯部数" prop="elevatorCount">
                      <el-input v-model="houseOpenForm.elevatorCount" placeholder="请输入" maxlength="50"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="card-item">
              <div class="sub-tittle" id="house-card6" :class="'house-card6' === currMenuId ? 'active' : ''"><span
                  class="title-text">其他事项说明</span></div>
              <div class="card-section">
                <el-row class="card-content">
                  <el-col :span="12">
                    <el-form-item label="产权纠纷说明" prop="itemPropertyDispute">
                      <el-input type="textarea" v-model="houseOpenForm.itemPropertyDispute" placeholder="请输入"
                                maxlength="50" :rows="2"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="实物资产形成原因" prop="formReasonName">
                      <el-input type="textarea" v-model="houseOpenForm.formReasonName" readonly
                                @click="openComplexCodeCard('formReason', '实物资产形成原因')" placeholder="请选择" maxlength="50"
                                :rows="2"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="安全/环保/管理隐患说明" prop="itemHideenDanger">
                      <el-input type="textarea" v-model="houseOpenForm.itemHideenDanger" placeholder="请输入"
                                maxlength="50" :rows="2"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="资产闲置说明" prop="itemAssetsUseless">
                      <el-input type="textarea" v-model="houseOpenForm.itemAssetsUseless" placeholder="请输入"
                                maxlength="50" :rows="2"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="证照与权属不一说明" prop="itemLicenceOwnershipDiff">
                      <el-input type="textarea" v-model="houseOpenForm.itemLicenceOwnershipDiff" placeholder="请输入"
                                maxlength="50" :rows="2"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="房产与地产权属不一说明" prop="itemHouseLandDiff">
                      <el-input type="textarea" v-model="houseOpenForm.itemHouseLandDiff" placeholder="请输入"
                                maxlength="50" :rows="2"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="账实不符说明" prop="itemAccountRealDiff">
                      <el-input type="textarea" v-model="houseOpenForm.itemAccountRealDiff" placeholder="请输入"
                                maxlength="50" :rows="2"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="档案资料缺失说明" prop="itemFilesMissing">
                      <el-input type="textarea" v-model="houseOpenForm.itemFilesMissing" placeholder="请输入"
                                maxlength="50" :rows="2"/>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="无偿占用或使用说明" prop="itemFreeUsed">
                      <el-input type="textarea" v-model="houseOpenForm.itemFreeUsed" placeholder="请输入" maxlength="50"
                                :rows="2"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="涉诉事项说明" prop="itemLawsuit">
                      <el-input type="textarea" v-model="houseOpenForm.itemLawsuit" placeholder="请输入" maxlength="50"
                                :rows="2"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="已出售未下账说明" prop="itemSoldNoRecorded">
                      <el-input type="textarea" v-model="houseOpenForm.itemSoldNoRecorded" placeholder="请输入"
                                maxlength="50" :rows="2"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="部分拆除或置换说明" prop="itemDisplace">
                      <el-input type="textarea" v-model="houseOpenForm.itemDisplace" placeholder="请输入" maxlength="50"
                                :rows="2"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="其他问题说明" prop="itemProblem">
                      <el-input type="textarea" v-model="houseOpenForm.itemProblem" placeholder="请输入" maxlength="50"
                                :rows="2"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="实物资产补充说明" prop="realMoreInfo">
                      <el-input type="textarea" v-model="houseOpenForm.realMoreInfo" placeholder="请输入" maxlength="50"
                                :rows="2"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-show="againShow" type="warning" circle size="large" class="counter-btn">{{ counter }}</el-button>
        <div class="opera-btn">
          <el-button type="primary" @click="nextStep" v-show="againShow">继 续</el-button>
          <el-button type="primary" @click="nextStepSureButton" v-show="againShow">确 定</el-button>
          <el-button type="primary" @click="saveSubmitForm" v-show="toolBar">确 定</el-button>
          <el-button @click="close">取 消</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
  <!-- 调用综合编码-->
  <choose-complex ref="refComplexCard" @handleComplexData="handleComplexData"/>
</template>

<script setup>
import deepCopy from 'lodash'
import address from "@/components/assets/address.json"; //全国省市区街道数据
import chooseComplex from "@/views/system/card/complexCode/index";
import {computed, nextTick} from "vue";
// 再次细化：下一步按钮是否显示, 及资产新资产编码列是否显示
const counter = ref(1)
const againShow = ref(true);
const refComplexCard = ref();
// 是否显示弹出层
const open = ref(false);
// 确认和取消按钮，是否显示
const toolBar = ref(true);
// 卡片类型
const cardType = ref();
// 是否显示 实物信息卡片
const materialObjectOpen = ref(true);
// 是否显示 核算信息卡片
const accountsOpen = ref(true);
// 是否显示 准则信息卡片
const normOpen = ref(true);
// 是否显示 房屋信息卡片
const houseOpen = ref(true);
// 是否显示 技术信息卡片
const technologyOpen = ref(true);
// 弹窗显示卡片名称
const title = ref();
// 声明调用方（父组件）变量
const emit = defineEmits(['saveSubmitForm']);
// 获取当前页面操作实例
const {proxy} = getCurrentInstance();
// 定义存放四个准则表单数据集合
const normFromDataArray = ref([]);
//  省数据
const addressData = address;
//  市数据
let cityData = ref([]);
// 区数据
const areaData = ref([]);
// 下一步时存放数据集合
let nextStepDataList = ref(new Array());
// 新细化后的资产编码
let sonFirstNumberCombination = ref();
// 选中资产的资产编码
let parentAssetsCode = ref();
// 单据编码
let globalInvoiceNumber = ref();
// pkKeyCode
let globalPkKeyCode = ref();


// 临时数据，综合编码字典
const tempOptions = ref([{
  tempCode: 'code1',
  tempName: '综合编码1'
}, {
  tempCode: 'code2',
  tempName: '综合编码2'
}]);
// 菜单列表
const currMenuId = ref()
let listMenu = ref([])
// 表单校验
const data = reactive({
  // 实物信息表单及表单校验规则
  materialObjectForm: ref({}),
  materialObjectFormRules: {
    assetsName: [
      {required: true, message: "资产名称不能为空", trigger: "blur"}
    ],
    contentAssetsCode: [
      {required: true, message: "资产分类编码不能为空", trigger: "blur"}
    ],
    unitCodeName: [
      {required: true, message: "计量单位不能为空", trigger: "change"}
    ],
    equipTypeName: [
      {required: true, message: "移动属性不能为空", trigger: "blur"}
    ],
    departName: [
      {required: true, message: "所属单位不能为空", trigger: "blur"}
    ],
    technicalConditionName: [
      {required: true, message: "资产状态不能为空", trigger: "blur"}
    ],
    operateDate: [
      {required: true, message: "投产日期不能为空", trigger: "blur"}
    ],
    referenceOriginalValue: [
      {required: false, message: "原值不能为空", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ]
  },

  // 核算信息表单及表单校验规则
  accountsOpenForm: ref({}),
  accountsOpenFormRules: {
    dutyCenterName: [
      {required: true, message: "责任中心不能为空", trigger: "blur"}
    ],
    assetsFundCanalName: [
      {required: true, message: "资金渠道不能为空", trigger: "blur"}
    ],
    addReasonName: [
      {required: true, message: "增加原因不能为空", trigger: "blur"}
    ],
    usedStateName: [
      {required: true, message: "使用状态不能为空", trigger: "blur"}
    ],
    functionalScopeName: [
      {required: true, message: "功能范围不能为空", trigger: "blur"}
    ],
    fmisCostCenterName: [
      {required: true, message: "成本中心不能为空", trigger: "blur"}
    ],
    branchName: [
      {required: true, message: "分线不能为空", trigger: "blur"}
    ]
  },

  // 四个准则信息：会计准则、税务准则、评估准则、成本监审准则 表单及表单校验规则
  // 会计准则
  normOpenAccountantForm: ref({}),
  normOpenAccountantFormRules: {
    originalValue: [
      {required: true, message: "原值不能为空", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    nowValue: [
      {required: true, message: "净值不能为空", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    depreciateYear: [
      {required: true, message: "折旧年限不能为空", trigger: "blur"}
    ],
    scrapValueRate: [
      {required: true, message: "残值率不能为空", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ]
  },
  // 税务准则
  normOpenTaxForm: ref({}),
  normOpenTaxFormRules: {
    originalValue: [
      {required: true, message: "原值不能为空", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    nowValue: [
      {required: true, message: "净值不能为空", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    depreciateYear: [
      {required: true, message: "折旧年限不能为空", trigger: "blur"}
    ],
    scrapValueRate: [
      {required: true, message: "残值率不能为空", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ]
  },
  // 评估准则
  normOpenAssessmentForm: ref({}),
  normOpenAssessmentFormRules: {
    originalValue: [
      {required: true, message: "原值不能为空", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    nowValue: [
      {required: true, message: "净值不能为空", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    depreciateYear: [
      {required: true, message: "折旧年限不能为空", trigger: "blur"}
    ],
    scrapValueRate: [
      {required: true, message: "残值率不能为空", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ]
  },
  // 成本监审准则
  normOpenSupervisionForm: ref({}),
  normOpenSupervisionFormRules: {
    originalValue: [
      {required: true, message: "原值不能为空", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    nowValue: [
      {required: true, message: "净值不能为空", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    depreciateYear: [
      {required: true, message: "折旧年限不能为空", trigger: "blur"}
    ],
    scrapValueRate: [
      {required: true, message: "残值率不能为空", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ]
  },

  // 房屋信息表单及表单校验规则
  houseOpenForm: ref({}),
  houseOpenFormRules: {
    ownershipConditionName: [
      {required: true, message: "不能为空", trigger: "blur"}
    ], certificateHandlingName: [
      {required: true, message: "办证情况名称不能为空", trigger: "blur"}
    ],
    filesName: [
      {required: true, message: "档案名称不能为空", trigger: "blur"}
    ],
    actualName: [
      {required: true, message: "实际名称不能为空", trigger: "blur"}
    ],
    formReasonName: [
      {required: true, message: "实物资产形成原因名称不能为空", trigger: "blur"}
    ],
    province: [
      {required: true, message: "省（直辖市）不能为空", trigger: "blur"}
    ],
    city: [
      {required: true, message: "市不能为空", trigger: "blur"}
    ],
    county: [
      {required: true, message: "区（县）不能为空", trigger: "blur"}
    ],
    addressDetail: [
      {required: true, message: "详细地址不能为空", trigger: "blur"}
    ],
    longitude: [
      {required: true, message: "请输入正确的经度", trigger: "blur"},
      {
        pattern: /^(\d+)(\.\d+)?$/,
        message: "请输入正确的经度",
        trigger: "blur"
      }
    ],
    latitude: [
      {required: true, message: "请输入正确的纬度", trigger: "blur"},
      {
        pattern: /^(\d+)(\.\d+)?$/,
        message: "请输入正确的纬度",
        trigger: "blur"
      }
    ],
    buildArea: [
      {required: false, message: "请输入正确的数值", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    taxRateLand: [
      {required: false, message: "请输入正确的数值", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    annualRent: [
      {required: false, message: "请输入正确的数值", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    floorsUpName: [
      {required: true, message: "建筑物地上总层数不能为空", trigger: "blur"}
    ],
    floorsDownName: [
      {required: true, message: "建筑物地下总层数不能为空", trigger: "blur"}
    ],
    managerDepartTwoName: [
      {required: true, message: "管理单位二级名称不能为空", trigger: "blur"}
    ],
    managerDepartThreeName: [
      {required: true, message: "管理单位三级名称不能为空", trigger: "blur"}
    ],
    managerDutyName: [
      {required: true, message: "管理单位责任人不能为空", trigger: "blur"}
    ],
    managerDutyPhone: [
      {required: true, message: "管理单位责任人联系方式不能为空", trigger: "blur"}
    ],
    operateDepartCategoryName: [
      {required: true, message: "运营单位类别不能为空", trigger: "blur"}
    ],
    landUsedTaxName: [
      {required: true, message: "土地使用税计缴不能为空", trigger: "blur"}
    ],
    houseTaxName: [
      {required: true, message: "房产税计缴不能为空", trigger: "blur"}
    ],
    usedNatureName: [
      {required: true, message: "使用性质不能为空", trigger: "blur"}
    ],
    floorsNumber: [
      {required: true, message: "楼层不能为空", trigger: "blur"}
      // {
      //   pattern: /^[0-9]*[1-9][0-9]*$/,
      //   message: "请输入正确的数值",
      //   trigger: "blur"
      // }
    ],
    actualUsedName: [
      {required: true, message: "实际用途不能为空", trigger: "blur"}
    ],
    landArea: [
      {required: false, message: "请输入正确的数值", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    publicHouseArea: [
      {required: false, message: "请输入正确的数值", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    officeRoomsCount: [
      {required: false, message: "请输入正确的数值", trigger: "blur"},
      {
        pattern: /^[0-9]*[1-9][0-9]*$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    officeUsedArea: [
      {required: false, message: "请输入正确的数值", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    officePeopleCount: [
      {required: false, message: "请输入正确的数值", trigger: "blur"},
      {
        pattern: /^[0-9]*[1-9][0-9]*$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    meetingRoomsCount: [
      {required: false, message: "请输入正确的数值", trigger: "blur"},
      {
        pattern: /^[0-9]*[1-9][0-9]*$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    meetingUsedArea: [
      {required: false, message: "请输入正确的数值", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    parkingUsedArea: [
      {required: false, message: "请输入正确的数值", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    otherRoomdCount: [
      {required: false, message: "请输入正确的数值", trigger: "blur"},
      {
        pattern: /^[0-9]*[1-9][0-9]*$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    otherUsedArea: [
      {required: false, message: "请输入正确的数值", trigger: "blur"},
      {
        pattern: /^\d+(\.\d{2})?$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    elevatorCount: [
      {required: false, message: "请输入正确的数值", trigger: "blur"},
      {
        pattern: /^[0-9]*[1-9][0-9]*$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ],
    parkingSpaceCount: [
      {required: false, message: "请输入正确的数值", trigger: "blur"},
      {
        pattern: /^[0-9]*[1-9][0-9]*$/,
        message: "请输入正确的数值",
        trigger: "blur"
      }
    ]
  },

  // 技术信息表单及表单校验规则
  technologyOpenForm: ref({}),
  technologyOpenFormRules: {}
});

// 声明表单属性
const {
  materialObjectForm, materialObjectFormRules, accountsOpenForm, accountsOpenFormRules,
  normOpenAccountantForm, normOpenAccountantFormRules, normOpenTaxForm, normOpenTaxFormRules,
  normOpenAssessmentForm, normOpenAssessmentFormRules, normOpenSupervisionForm, normOpenSupervisionFormRules,
  houseOpenForm, houseOpenFormRules, technologyOpenForm, technologyOpenFormRules
} = toRefs(data);

// 声明方法供外部调用
defineExpose({
  updateOpen, viewOpen, addOpen, againRefineOpen
});
// 获取input禁用状态
function setDisabledStatus(status = false) {
  let disabledStatus = false
  if (cardType.value === 'houseChangeCard') {
    disabledStatus = true
  } else {
    disabledStatus = status
  }
  return disabledStatus
}
// 监听dialog显示事件
function openDialog() {
  getListMenu()
}
// 获取左侧菜单列表数据
function getListMenu() {
  listMenu.value = [];
  const materialMenu = [{
    id: 'material-card1',
    text: '实物信息'
  }]
  const accountsMenu = [{
    id: 'accounts-card1',
    text: '核算信息'
  }]
  const normMenu = [{
    id: 'norm-card1',
    text: '会计准则'
  },{
    id: 'norm-card2',
    text: '税务准则'
  },{
    id: 'norm-card3',
    text: '评估准则'
  },{
    id: 'norm-card4',
    text: '成本监审准则'
  }]
  const technologyMenu = [{
    id: 'technology-card1',
    text: '技术信息'
  }]
  const houseMenu = [{
    id: 'house-card1',
    text: '权证类'
  }, {
    id: 'house-card2',
    text: '位置信息'
  }, {
    id: 'house-card3',
    text: '单位信息'
  }, {
    id: 'house-card4',
    text: '财税信息'
  }, {
    id: 'house-card5',
    text: '使用情况'
  }, {
    id: 'house-card6',
    text: '其他事项说明'
  }]

  if (materialObjectOpen.value) {
    listMenu.value.push(...materialMenu)
  }
  if (accountsOpen.value) {
    listMenu.value.push(...accountsMenu)
  }
  if (normOpen.value) {
    listMenu.value.push(...normMenu)
  }
  if (technologyOpen.value) {
    listMenu.value.push(...technologyMenu)
  }
  if (houseOpen.value) {
    listMenu.value.push(...houseMenu)
  }
  currMenuId.value = listMenu.value[0].id
}

// 关闭dialog事件
function closeDialog() {
  listMenu.value = []
}

// 设置滚动位置
function scrollInto(id) {
  currMenuId.value = id
  document.getElementById(id).scrollIntoView({
    behavior: "smooth",  // 平滑过渡
    block: "start"  // 上边框与视窗顶部平齐。默认值
  });
}

// 省份更改--监听事件
function changePro(e) {
  // 从省中过滤出市的数据
  cityData.value = addressData.filter((item) => {
    return item.name == e;
  })[0].children;
  // 省发生改变的时候 清空输入框市区街道的内容
  houseOpenForm.value.city = "";
  houseOpenForm.value.county = "";
  // 省发生更改时 该表空区街道数据的内容
  areaData.value = ref([]);
}

// 市更改--监听事件
function changeCity(e) {
  // 获取到区的数据
  areaData.value = cityData.value.filter(
      (item) => item.name == e
  )[0].children;
  // 清空数据后面对应数组的数据
  houseOpenForm.value.county = "";
}

// 区更改--监听事件
function changeArea(e) {
  let temp = areaData.value.filter((item) => item.name == e);
  // 获取到街道的数据
  areaData.value.filter((item) => item.name == e)[0].children;
}

// 下一步按钮触发事件
function nextStep() {
  // proxy.$refs["houseOpenFormRef"].validate(valid => {
  //     if (valid) {
  counter.value = counter.value + 1
  houseOpenForm.value.invoiceNumber = globalInvoiceNumber.value;
  houseOpenForm.value.pkKeyCode = globalPkKeyCode.value;
  houseOpenForm.value.varType = "FWX2";
  houseOpenForm.value.varTypeName = "细化后";
  nextStepDataList.value.push(deepCopy.cloneDeep(houseOpenForm.value));
  assetsCodeCombination();
  // }
  // });
}

// 下一步确认按钮事件
function nextStepSureButton() {
  // 确定时，将最后一次，表单页面中的数据也存放到集合中，一起带回到父页面中
  nextStep();
  setTimeout(() => {
    // 创建会带给父页面的map数据
    const map = new Map();
    map.set('nextStepSureFunSign', true);
    map.set('dataList', nextStepDataList.value);
    // 回调父组件传递的方法
    emit('saveSubmitForm', map);
    // 关闭弹窗
    close();
  }, 500);
}

/**
 * @Author lishun
 * @Description 方法描述：确定保存方法；将显示的卡片的内容进行保存校验，校验通过则将数据传递回调用方
 * 回参格式定义为：
 * const map = new Map();
 * map.set("materialObjectFormData", ); // 实物信息
 * map.set("accountsOpenFormData", ); // 核算信息
 * map.set("normFromData", ); // 准则信息 (准则信息中包含四个准则数据，normFromData内部为list，默认顺序0会计准则，1税务准则，2评估准则，3成本监审准则)
 * map.set("houseOpenFormData", ); // 房屋信息
 * 注意：map中的key值固定，如果没有值则为null。
 * @Date 2022/9/26 14:30
 * @Param
 * @Return
 */
function saveSubmitForm() {
  // 创建会带给父页面的map数据
  const map = new Map();
  // 卡片表单校验
  let materialObjectFormRefValid = ref(true);
  let accountsOpenFormRefValid = ref(true);
  let normOpenAccountantFormRefValid = ref(true);
  let normOpenTaxFormRefValid = ref(true);
  let normOpenAssessmentFormRefValid = ref(true);
  let normOpenSupervisionFormRefValid = ref(true);
  let houseOpenFormRefValid = ref(true);
  let technologyOpenFormRefValid = ref(true);

  // 实物卡片信息
  if (materialObjectOpen) {
    proxy.$refs["materialObjectFormRef"].validate(valid => {
      if (valid) {
        map.set("materialObjectFormData", materialObjectForm.value);
        materialObjectFormRefValid.value = true;
      } else {
        materialObjectFormRefValid.value = false;
      }
    });
  } else {
    map.set("materialObjectFormData", null);
  }

  // 核算卡片信息
  if (accountsOpen) {
    proxy.$refs["accountsOpenFormRef"].validate(valid => {
      if (valid) {
        map.set("accountsOpenFormData", accountsOpenForm.value);
        accountsOpenFormRefValid.value = true;
      } else {
        accountsOpenFormRefValid.value = false;
      }
    });
  } else {
    map.set("accountsOpenFormData", null);
  }

  // 准则卡片信息
  if (normOpen) {
    proxy.$refs["normOpenAccountantFormRef"].validate(valid => {// 会计准则
      if (valid) {
        normFromDataArray[0] = normOpenAccountantForm.value;
        normOpenAccountantFormRefValid.value = true;
      } else {
        normOpenAccountantFormRefValid.value = false;
      }
    });
    proxy.$refs["normOpenTaxFormRef"].validate(valid => {// 税务准则
      if (valid) {
        normFromDataArray[1] = normOpenTaxForm.value;
        normOpenTaxFormRefValid.value = true;
      } else {
        normOpenTaxFormRefValid.value = false;
      }
    });
    proxy.$refs["normOpenAssessmentFormRef"].validate(valid => {// 评估准则
      if (valid) {
        normFromDataArray[2] = normOpenAssessmentForm.value;
        normOpenAssessmentFormRefValid.value = true;
      } else {
        normOpenAssessmentFormRefValid.value = false;
      }
    });
    proxy.$refs["normOpenSupervisionFormRef"].validate(valid => {// 成本监审准则
      if (valid) {
        normFromDataArray[3] = normOpenSupervisionForm.value;
        normOpenSupervisionFormRefValid.value = true;
      } else {
        normOpenSupervisionFormRefValid.value = false;
      }
    });
    map.set("normFromData", normFromDataArray);
  } else {
    map.set("normFromData", null);
  }

  // 房屋卡片信息
  if (houseOpen) {
    proxy.$refs["houseOpenFormRef"].validate(valid => {
      if (valid) {
        map.set("houseOpenFormData", houseOpenForm.value);
        houseOpenFormRefValid.value = true;
      } else {
        houseOpenFormRefValid.value = false;
      }
    });
  } else {
    map.set("houseOpenFormData", null);
  }

  // 技术卡片信息
  if (technologyOpen) {
    proxy.$refs["technologyOpenFormRef"].validate(valid => {
      if (valid) {
        map.set("technologyOpenFormData", technologyOpenForm.value);
        technologyOpenFormRefValid.value = true;
      } else {
        technologyOpenFormRefValid.value = false;
      }
    });
  } else {
    map.set("technologyOpenFormData", null);
  }
  setTimeout(() => {

    console.log("查看数据：" + materialObjectFormRefValid.value + "&&" + accountsOpenFormRefValid.value + "&&" +
        normOpenAccountantFormRefValid.value + "&&" + normOpenTaxFormRefValid.value + "&&" +
        normOpenAssessmentFormRefValid.value + "&&" + normOpenSupervisionFormRefValid.value + "&&" +
        houseOpenFormRefValid.value + "&&" +
    technologyOpenFormRefValid.value);
    // 关闭弹窗
    if (materialObjectFormRefValid.value && accountsOpenFormRefValid.value &&
        normOpenAccountantFormRefValid.value && normOpenTaxFormRefValid.value &&
        normOpenAssessmentFormRefValid.value && normOpenSupervisionFormRefValid.value &&
        houseOpenFormRefValid.value && technologyOpenFormRefValid.value) {
      // 回调父组件传递的方法
      emit('saveSubmitForm', map);
      // 关闭弹窗
      close();
    }
  }, 500);
}

// 取消方法
function close() {
  reset();
  open.value = false;
}

/**
 * @Author lishun
 * @Description 方法描述：新增时打开卡片方法
 * @Date 2022/9/22 15:44
 * @Param invoiceNumber 单据编号
 * @Param showMaterialObjectOpen [true, false]是否显示, 实物信息卡片, 默认不传为true显示
 * @Param showAccountsOpen [true, false]是否显示, 核算信息卡片, 默认不传为true显示
 * @Param showNormOpen [true, false]是否显示, 准则信息卡片, 默认不传为true显示
 * @Param showHouseOpen [true, false]是否显示, 房屋信息卡片, 默认不传为true显示
 * @Return
 */
function againRefineOpen(invoiceNumber, titleStr, showMaterialObjectOpen,
                         showAccountsOpen, showNormOpen, showHouseOpen,
                         againShowCon, assetsCode, sonFirstNumber, pkKeyCode) {
  // 每次将nextStepDataList清空
  nextStepDataList = ref(new Array());

  // 卡片显隐控制
  if (showMaterialObjectOpen != undefined) materialObjectOpen.value = showMaterialObjectOpen;
  if (showAccountsOpen != undefined) accountsOpen.value = showAccountsOpen;
  if (showNormOpen != undefined) normOpen.value = showNormOpen;
  if (showHouseOpen != undefined) houseOpen.value = showHouseOpen;

  reset();
  open.value = true;
  title.value = titleStr;
  // 显示按钮
  toolBar.value = false;
  againShow.value = againShowCon;
  sonFirstNumberCombination.value = sonFirstNumber;
  globalInvoiceNumber.value = invoiceNumber;
  globalPkKeyCode.value = pkKeyCode;
  parentAssetsCode.value = assetsCode;
  assetsCodeCombination();
  console.log("新增方法");
}

/**
 * @Author lishun
 * @Description 方法描述：组装新的细化资产编码, 补位算法
 * @Date 2022/11/30 10:02
 * @Param
 * @Return
 */
function assetsCodeCombination() {
  var sonFirstNumberTemp = '';
  sonFirstNumberCombination.value = sonFirstNumberCombination.value + 1;
  var sonFirstNumber = sonFirstNumberCombination.value;
  var complement = (3 - sonFirstNumber.toString().length);
  var complementZero = '';
  for (let i = 0; i < complement; i++) {
    complementZero += '0';
  }
  sonFirstNumberTemp = "_" + complementZero + sonFirstNumber;

  houseOpenForm.value.assetsCode = (parentAssetsCode.value + sonFirstNumberTemp);
}

/**
 * @Author lishun
 * @Description 方法描述：新增时打开卡片方法
 * @Date 2022/9/22 15:44
 * @Param invoiceNumber 单据编号
 * @Param showMaterialObjectOpen [true, false]是否显示, 实物信息卡片, 默认不传为true显示
 * @Param showAccountsOpen [true, false]是否显示, 核算信息卡片, 默认不传为true显示
 * @Param showNormOpen [true, false]是否显示, 准则信息卡片, 默认不传为true显示
 * @Param showHouseOpen [true, false]是否显示, 房屋信息卡片, 默认不传为true显示
 * @Param showTechnologyOpen [true, false]是否显示, 技术信息卡片, 默认不传为true显示
 * @Return
 */
function addOpen(invoiceNumber, titleStr, showMaterialObjectOpen,
                 showAccountsOpen, showNormOpen, showHouseOpen, showTechnologyOpen) {

  // 卡片显隐控制
  if (showMaterialObjectOpen != undefined) materialObjectOpen.value = showMaterialObjectOpen;
  if (showAccountsOpen != undefined) accountsOpen.value = showAccountsOpen;
  if (showNormOpen != undefined) normOpen.value = showNormOpen;
  if (showHouseOpen != undefined) houseOpen.value = showHouseOpen;
  if (showTechnologyOpen != undefined) technologyOpen.value = showTechnologyOpen;

  reset();
  open.value = true;
  title.value = titleStr;
  // 显示按钮
  toolBar.value = true;
  // 隐藏按钮 下一步
  againShow.value = false;
  console.log("新增方法");
}

/**
 * @Author lishun
 * @Description 方法描述：修改时打开方法
 * @Date 2022/9/22 15:44
 * @Param mapFormData 返显的单据数据信息，格式如下：
 * const mapFormData = new Map();
 * mapFormData.set("materialObjectFormData", ); // 实物信息
 * mapFormData.set("accountsOpenFormData", ); // 核算信息
 * mapFormData.set("normFromData", ); // 准则信息 (准则信息中包含四个准则数据，normFromData内部为list，默认顺序0会计准则，1税务准则，2评估准则，3成本监审准则)
 * mapFormData.set("houseOpenFormData", ); // 房屋信息
 * @Param showMaterialObjectOpen [true, false]是否显示, 实物信息卡片, 默认不传为true显示
 * @Param showAccountsOpen [true, false]是否显示, 核算信息卡片, 默认不传为true显示
 * @Param showNormOpen [true, false]是否显示, 准则信息卡片, 默认不传为true显示
 * @Param showHouseOpen [true, false]是否显示, 房屋信息卡片, 默认不传为true显示
 * @Param showTechnologyOpen [true, false]是否显示, 技术信息卡片, 默认不传为true显示
 * @Return
 */
function updateOpen(mapFormData, titleStr, showMaterialObjectOpen,
                    showAccountsOpen, showNormOpen, showHouseOpen, showTechnologyOpen) {

  reset();
  // 卡片显隐控制
  if (showMaterialObjectOpen != undefined) {
    materialObjectForm.value = ((null != mapFormData && null != mapFormData.get("materialObjectFormData")) ? mapFormData.get("materialObjectFormData") : "");
    materialObjectOpen.value = showMaterialObjectOpen;
  }
  if (showAccountsOpen != undefined) {
    accountsOpenForm.value = ((null != mapFormData && null != mapFormData.get("accountsOpenFormData")) ? mapFormData.get("accountsOpenFormData") : "");
    accountsOpen.value = showAccountsOpen;
  }
  if (showNormOpen != undefined) {
    normOpenAccountantForm.value = ((null != mapFormData && null != mapFormData.get("normFromData")) ? mapFormData.get("normFromData")[0] : "");
    normOpenTaxForm.value = ((null != mapFormData && null != mapFormData.get("normFromData")) ? mapFormData.get("normFromData")[1] : "");
    normOpenAssessmentForm.value = ((null != mapFormData && null != mapFormData.get("normFromData")) ? mapFormData.get("normFromData")[2] : "");
    normOpenSupervisionForm.value = ((null != mapFormData && null != mapFormData.get("normFromData")) ? mapFormData.get("normFromData")[3] : "");
    normOpen.value = showNormOpen;
  }
  if (showHouseOpen != undefined) {
    houseOpenForm.value = null != mapFormData ? mapFormData.get("houseOpenFormData") : "";
    houseOpen.value = showHouseOpen;
  }
  // 技术卡片赋值
  if (showTechnologyOpen != undefined) {
    technologyOpenForm.value = ((null != mapFormData && null != mapFormData.get("technologyOpenFormData")) ? mapFormData.get("technologyOpenFormData") : "");
    technologyOpen.value = showTechnologyOpen;
  }
  cardType.value = mapFormData.get('cardType')
  open.value = true;
  title.value = titleStr;
  // 显示按钮
  toolBar.value = true;
  againShow.value = false;
  console.log("修改方法");
}

/**
 * @Author lishun
 * @Description 方法描述：查看时打开方法
 * @Date 2022/9/22 15:44
 * @Param mapFormData 返显的单据数据信息，格式如下：
 * const mapFormData = new Map();
 * mapFormData.set("materialObjectFormData", ); // 实物信息
 * mapFormData.set("accountsOpenFormData", ); // 核算信息
 * mapFormData.set("normFromData", ); // 准则信息 (准则信息中包含四个准则数据，normFromData内部为list，默认顺序0会计准则，1税务准则，2评估准则，3成本监审准则)
 * mapFormData.set("houseOpenFormData", ); // 房屋信息
 * @Param showMaterialObjectOpen [true, false]是否显示, 实物信息卡片, 默认不传为true显示
 * @Param showAccountsOpen [true, false]是否显示, 核算信息卡片, 默认不传为true显示
 * @Param showNormOpen [true, false]是否显示, 准则信息卡片, 默认不传为true显示
 * @Param showHouseOpen [true, false]是否显示, 房屋信息卡片, 默认不传为true显示
 * @Param showTechnologyOpen [true, false]是否显示, 技术信息卡片, 默认不传为true显示
 * @Return
 */
function viewOpen(mapFormData, titleStr, showMaterialObjectOpen,
                  showAccountsOpen, showNormOpen, showHouseOpen, showTechnologyOpen) {

  reset();
  // 卡片显隐控制
  if (showMaterialObjectOpen != undefined) {
    materialObjectForm.value = ((null != mapFormData && null != mapFormData.get("materialObjectFormData")) ? mapFormData.get("materialObjectFormData") : "");
    materialObjectOpen.value = showMaterialObjectOpen;
  }
  if (showAccountsOpen != undefined) {
    accountsOpenForm.value = ((null != mapFormData && null != mapFormData.get("accountsOpenFormData")) ? mapFormData.get("accountsOpenFormData") : "");
    accountsOpen.value = showAccountsOpen;
  }
  if (showNormOpen != undefined) {
    normOpenAccountantForm.value = ((null != mapFormData && null != mapFormData.get("normFromData")) ? mapFormData.get("normFromData")[0] : "");
    normOpenTaxForm.value = ((null != mapFormData && null != mapFormData.get("normFromData")) ? mapFormData.get("normFromData")[1] : "");
    normOpenAssessmentForm.value = ((null != mapFormData && null != mapFormData.get("normFromData")) ? mapFormData.get("normFromData")[2] : "");
    normOpenSupervisionForm.value = ((null != mapFormData && null != mapFormData.get("normFromData")) ? mapFormData.get("normFromData")[3] : "");
    normOpen.value = showNormOpen;
  }
  if (showHouseOpen != undefined) {
    houseOpenForm.value = ((null != mapFormData && mapFormData.get("houseOpenFormData") != undefined) ? mapFormData.get("houseOpenFormData") : "");
    houseOpen.value = showHouseOpen;
  }
  if (showTechnologyOpen != undefined) {
    technologyOpenForm.value = ((null != mapFormData && mapFormData.get("technologyOpenFormData") != undefined) ? mapFormData.get("technologyOpenFormData") : "");
    technologyOpen.value = showTechnologyOpen;
  }
  open.value = true;
  title.value = titleStr;
  // 隐藏按钮
  toolBar.value = false;
  againShow.value = false;
  console.log("查看方法");
}

// 重置表单
function reset() {
  counter.value = 1
  // 实物信息表单
  materialObjectForm.value = {
    assetsCode: null,
    assetsName: null,
    contentAssetsCode: null,
    contentAssetsName: null,
    assetsType: null,
    assetsStandard: null,
    makeFactory: null,
    productCode: null,
    unitCodeName: null,
    equipTypeName: null,
    departName: null,
    storePlaceName: null,
    technicalConditionName: null,
    addVoucherDate: null,
    contractCode: null,
    contractName: null,
    basicJudgeDepartName: null,
    regionJudgeDepartName: null,
    licenceNumber: null,
    barCode: null,
    referenceOriginalValue: null,
    costCategory: null,
    costCategoryName: null,
    remark: null
  };
  proxy.resetForm("materialObjectFormRef");

  // 核算信息表单
  accountsOpenForm.value = {
    dutyCenterName: null,
    assetsFundCanalName: null,
    addReasonName: null,
    usedStateName: null,
    fmisCostCenterName: null,
    functionalScopeName: null,
    branchName: null,
    branchTypeName: null,
    priceAreaName: null,
    devalueReason: null,
    wbsProjectCode: null,
    wbsProjectName: null
  };
  proxy.resetForm("accountsOpenFormRef");

  // 准则信息表单
  // 会计准则
  normOpenAccountantForm.value = {
    originalValue: null,
    nowValue: null,
    addDepreciate: null,
    devalueValue: null,
    usableYear: null,
    depreciateCode: null,
    depreciateYear: null,
    scrapValue: null,
    scrapValueRate: null
  };
  proxy.resetForm("normOpenAccountantFormRef");
  // 税务准则
  normOpenTaxForm.value = {
    originalValue: null,
    nowValue: null,
    addDepreciate: null,
    devalueValue: null,
    usableYear: null,
    depreciateCode: null,
    depreciateYear: null,
    scrapValue: null,
    scrapValueRate: null
  };
  proxy.resetForm("normOpenTaxFormRef");
  // 评估准则
  normOpenAssessmentForm.value = {
    originalValue: null,
    nowValue: null,
    addDepreciate: null,
    devalueValue: null,
    usableYear: null,
    depreciateCode: null,
    depreciateYear: null,
    scrapValue: null,
    scrapValueRate: null
  };
  proxy.resetForm("normOpenAssessmentFormRef");
  // 成本监审准则
  normOpenSupervisionForm.value = {
    originalValue: null,
    nowValue: null,
    addDepreciate: null,
    devalueValue: null,
    usableYear: null,
    depreciateCode: null,
    depreciateYear: null,
    scrapValue: null,
    scrapValueRate: null
  };
  proxy.resetForm("normOpenSupervisionFormRef");

  // 房屋信息
  houseOpenForm.value = {
    parcelCode: null,
    ownershipConditionName: null,
    ownershipConditionCode: null,
    usedrightTypeName: null,
    usedrightTypeCode: null,
    landArea: null,
    landCertificateNo: null,
    landUsedHolder: null,
    houseCertificateNo: null,
    rightTypeName: null,
    rightTypeCode: null,
    rightNatureName: null,
    rightNatureCode: null,
    certificateHolder: null,
    certificateHandlingName: null,
    certificateHandlingCode: null,
    bookkeeping: null,
    noCertificateReason: null,
    filesName: null,
    actualName: null,
    formReasonName: null,
    formReasonCode: null,
    realMoreInfo: null,
    province: null,
    city: null,
    county: null,
    addressDetail: null,
    longitude: null,
    latitude: null,
    buildArea: null,
    floorsUpName: null,
    floorsUpCode: null,
    floorsDownName: null,
    floorsDownCode: null,
    buildInfoRemark: null,
    managerDepartTwoName: null,
    managerDepartThreeName: null,
    managerDutyName: null,
    managerDutyPhone: null,
    usedDepartCategoryName: null,
    usedDepartTwoName: null,
    usedDepartThreeName: null,
    usedDepartPartnerName: null,
    operateDepartCategoryName: null,
    landUsedTaxName: null,
    taxSourceCity: null,
    taxOffice: null,
    taxBureauCode: null,
    taxRateLand: null,
    houseTaxName: null,
    annualRent: null,
    usedNatureName: null,
    usedNatureCode: null,
    floorsNumber: null,
    actualUsedName: null,
    actualUsedCode: null,
    houseStructureName: null,
    houseStructureCode: null,
    stopUsedDate: null,
    publicHouseArea: null,
    officeRoomsCount: null,
    officeUsedArea: null,
    officePeopleCount: null,
    meetingRoomsCount: null,
    meetingUsedArea: null,
    parkingUsedName: null,
    parkingUsedCode: null,
    parkingSpaceCount: null,
    parkingUsedArea: null,
    otherRoomdCount: null,
    otherUsedArea: null,
    elevatorCount: null,
    itemLicenceOwnershipDiff: null,
    itemHouseLandDiff: null,
    itemHideenDanger: null,
    itemFreeUsed: null,
    itemAccountRealDiff: null,
    itemFilesMissing: null,
    itemAssetsUseless: null,
    itemDisplace: null,
    itemSoldNoRecorded: null,
    itemLawsuit: null,
    itemProblem: null
  };
  proxy.resetForm("houseOpenFormRef");

}

// 会计准则原值输入后，联动其他准则数据
function accountantOriginalValueLinkageOtherNorm() {
  const accountantOriginalValueLinkage = normOpenAccountantForm.value.originalValue;
  // 会计准则的净值
  normOpenAccountantForm.value.nowValue = normOpenAccountantForm.value.originalValue;
  normOpenAccountantForm.value.scrapValueRate = 0;

  // 其他三个准则数据
  // 税务准则
  normOpenTaxForm.value.originalValue = accountantOriginalValueLinkage;
  normOpenTaxForm.value.nowValue = accountantOriginalValueLinkage;
  normOpenTaxForm.value.scrapValueRate = 0;
  // 评估准则
  normOpenAssessmentForm.value.originalValue = accountantOriginalValueLinkage;
  normOpenAssessmentForm.value.nowValue = accountantOriginalValueLinkage;
  normOpenAssessmentForm.value.scrapValueRate = 0;
  // 成本监审准则
  normOpenSupervisionForm.value.originalValue = accountantOriginalValueLinkage;
  normOpenSupervisionForm.value.nowValue = accountantOriginalValueLinkage;
  normOpenSupervisionForm.value.scrapValueRate = 0;
}

// 税务准则原值输入，联动净值
function taxOriginalValueLinkageNowValue() {
  normOpenTaxForm.value.nowValue = normOpenTaxForm.value.originalValue;
  normOpenTaxForm.value.scrapValueRate = 0;
}

// 评估准则原值输入，联动净值
function assessmentOriginalValueLinkageNowValue() {
  normOpenAssessmentForm.value.nowValue = normOpenAssessmentForm.value.originalValue;
  normOpenAssessmentForm.value.scrapValueRate = 0;
}

// 成本监审准则原值输入，联动净值
function supervisionOriginalValueLinkageNowValue() {
  normOpenSupervisionForm.value.nowValue = normOpenSupervisionForm.value.originalValue;
  normOpenSupervisionForm.value.scrapValueRate = 0;
}

// 单位联动责任、成本中心
function departLinkageDutyFmisCostCenter() {
  const temp = materialObjectForm.value.departName;
  accountsOpenForm.value.dutyCenterName = "temp";
  accountsOpenForm.value.fmisCostCenterName = "temp";
}

// --------------------房屋信息卡片综合编码---------------------
/** 打开综合编码字典*/
function openComplexCodeCard(codeProperty, title) {
  refComplexCard.value.openCard(codeProperty, title);
}

/** 获取综合编码卡片选中的数据*/
function handleComplexData(row, fromKey) {
  /**综合编码数据字典所对应的key及名称：
   权属状况：ownershipCondition
   使用权类型：usedrightType
   权利类型：rightType
   权利性质：rightNature
   办证情况：certificateHandling
   实物资产形成原因：formReason
   建筑物地上总层数：floorsUp
   建筑物地下总层数：floorsDown
   使用性质：usedNature
   实际用途：actualUsed
   房屋结构：houseStructure
   停车场用途：parkingUsed
   */
  if (fromKey == 'ownershipCondition') {// 权属状况：ownershipCondition
    houseOpenForm.value.ownershipConditionName = row.codeName1;
    houseOpenForm.value.ownershipConditionCode = row.codeProperty1;
  } else if (fromKey == 'usedrightType') {// 使用权类型：usedrightType
    houseOpenForm.value.usedrightTypeName = row.codeName1;
    houseOpenForm.value.usedrightTypeCode = row.codeProperty1;
  } else if (fromKey == 'rightType') {// 权利类型：rightType
    houseOpenForm.value.rightTypeName = row.codeName1;
    houseOpenForm.value.rightTypeCode = row.codeProperty1;
  } else if (fromKey == 'rightNature') {// 权利性质：rightNature
    houseOpenForm.value.rightNatureName = row.codeName1;
    houseOpenForm.value.rightNatureCode = row.codeProperty1;
  } else if (fromKey == 'certificateHandling') {// 办证情况：certificateHandling
    houseOpenForm.value.certificateHandlingName = row.codeName1;
    houseOpenForm.value.certificateHandlingCode = row.codeProperty1;
  } else if (fromKey == 'formReason') {// 实物资产形成原因：formReason
    houseOpenForm.value.formReasonName = row.codeName1;
    houseOpenForm.value.formReasonCode = row.codeProperty1;
  } else if (fromKey == 'floorsUp') {// 建筑物地上总层数：floorsUp
    houseOpenForm.value.floorsUpName = row.codeName1;
    houseOpenForm.value.floorsUpCode = row.codeProperty1;
  } else if (fromKey == 'floorsDown') {// 建筑物地下总层数：floorsDown
    houseOpenForm.value.floorsDownName = row.codeName1;
    houseOpenForm.value.floorsDownCode = row.codeProperty1;
  } else if (fromKey == 'usedNature') {// 使用性质：usedNature
    houseOpenForm.value.usedNatureName = row.codeName1;
    houseOpenForm.value.usedNatureCode = row.codeProperty1;
  } else if (fromKey == 'actualUsed') {// 实际用途：actualUsed
    houseOpenForm.value.actualUsedName = row.codeName1;
    houseOpenForm.value.actualUsedCode = row.codeProperty1;
  } else if (fromKey == 'houseStructure') {// 房屋结构：houseStructure
    houseOpenForm.value.houseStructureName = row.codeName1;
    houseOpenForm.value.houseStructureCode = row.codeProperty1;
  } else if (fromKey == 'parkingUsed') {// 停车场用途：parkingUsed
    houseOpenForm.value.parkingUsedName = row.codeName1;
    houseOpenForm.value.parkingUsedCode = row.codeProperty1;
  }
}

</script>

<style scoped lang="scss">
.list-menu {
  position: fixed;
  height: 100%;

  .menu-item {
    line-height: 40px;
    font-weight: 700;
    cursor: pointer;

    &.active, &:hover {
      color: var(--el-color-primary);
    }
  }
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
      margin-left: -5%;
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

::v-deep(.el-button--large.is-circle) {
  padding: 18px !important;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;

  .counter-btn {
    margin-right: 30%;
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
