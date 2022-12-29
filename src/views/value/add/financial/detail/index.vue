<template>
  <div class="app-main-content">
    <!--转资前单据页面-->
    <div class="div-editor-container-grey">
      <el-form ref="invoiceRef" :model="invoiceForm" label-width="120px" >
        <el-row>
          <el-col :span="6">
            <el-form-item label="单据编号" prop="invoiceNumber" :title="invoiceForm.invoiceNumber">
              <el-input v-model="invoiceForm.invoiceNumber" disabled placeholder="自动生成" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据状态" prop="invoiceStatus">
              <el-select v-model="invoiceForm.invoiceStatus" placeholder="自动生成" style="width:240px;" disabled>
                <el-option v-for="item in invoiceStatusOption" :key="item.value" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="转资类型" prop="invoiceType">
              <el-select v-model="invoiceForm.invoiceType" placeholder="请选择" style="width:240px;" disabled>
                <el-option v-for="item in invoiceTypeOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="invoiceForm.projectName" maxlength="40" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="项目编号" prop="projectCode">
              <el-input v-model="invoiceForm.projectCode" maxlength="30" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数量" prop="detailAmount">
              <el-input v-model="invoiceForm.detailAmount" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="invoiceForm.remark" maxlength="500" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="display: flex;justify-content: flex-end;margin-bottom: 10px;">
        <el-button type="primary" @click="saveInvoice">保 存</el-button>
      </div>
    </div>
    <div class="block-divider"></div>
    <!--转资前明細页面-->
    <div class="div-editor-container-grey">
      <div class="table-box">
        <el-form :model="refineQueryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="资产类别" prop="contentAssetsCode">
            <el-input v-model="refineQueryParams.contentAssetsCode" @keyup.enter="handleQuery" style="width: 220px" clearable
                      placeholder="请输入资产类别编码" maxlength="30" />
          </el-form-item>
          <el-form-item label="规格型号" prop="assetsStandard">
            <el-input v-model="refineQueryParams.assetsStandard" @keyup.enter="handleQuery" style="width: 220px" clearable
                      placeholder="请输入规格型号" maxlength="40" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <!--按钮操作部分-->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdateDetail">修改</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="detailList"></right-toolbar>
        </el-row>

        <!--明细表格-->
        <el-table v-loading="loading" :data="refineList" @selection-change="handleSelectionChange" :height="height" :row-class-name="tableRowClassName">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="资产名称" align="center" prop="assetsName" width="170" :show-overflow-tooltip="true"/>
          <el-table-column label="井名及编号" align="center" prop="wellNameCode" width="170"/>
          <el-table-column label="资产类别" align="center" prop="contentAssetsCode" width="170"/>
          <el-table-column label="规格型号" align="center" prop="assetsStandard" width="170"/>
          <el-table-column label="出厂日期" align="center" prop="productDate" width="170"/>
          <el-table-column label="使用单位" align="center" prop="useDepartName" width="170" :show-overflow-tooltip="true"/>
          <el-table-column label="计量单位" align="center" prop="unitCodeName" width="170" />
          <el-table-column label="计量数量" align="center" prop="singleAmount" width="170"/>
          <el-table-column label="复合数量" align="center" prop="charItem5" width="170"/>
          <el-table-column label="设备及工器具购置费" align="center" prop="purchaseCost" width="170"/>
          <el-table-column label="备注" align="center" prop="remark" width="160" :show-overflow-tooltip="true"/>
          <el-table-column>
            <template #default="scope">
              <el-button type="text" icon="Edit" @click="handleUpdateDetail()">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="refineTotal > 0" :total="refineTotal" v-model:page="refineQueryParams.pageNum"
                    v-model:limit="refineQueryParams.pageSize" @pagination="detailList" />
      </div>

      <!-- 修改转资前财务信息维护对话框 -->
      <el-dialog :title="title" v-model="open" width="1200px" append-to-body>
        <el-form ref="detailRef" :model="detailForm" :rules="detailFormRules" label-width="160px">
<!--        <el-form ref="detailRef" :model="detailForm" label-width="160px">-->
          <el-row>
            <el-col :span="6">
              <el-form-item label="原值" prop="originalValue">
                <el-input v-model="detailForm.originalValue" placeholder="请输入原值" maxlength="10" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="净值" prop="nowValue">
                <el-input v-model="detailForm.nowValue" placeholder="请输入净值" maxlength="10" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="累计折旧" prop="addDepreciate">
                <el-input v-model="detailForm.addDepreciate" placeholder="请输入累计折旧" maxlength="10" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="减值准备" prop="devalueValue">
                <el-input v-model="detailForm.devalueValue" placeholder="请输入减值准备" maxlength="10" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="折旧年限" prop="depreciateYear">
                <el-input v-model="detailForm.depreciateYear" placeholder="请输入折旧年限" maxlength="4" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="折旧期间" prop="erpNdper">
                <el-input v-model="detailForm.erpNdper" placeholder="请输入折旧期间" maxlength="4" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="残值率" prop="scrapValueRate">
                <el-input v-model="detailForm.scrapValueRate" placeholder="请输入残值率" maxlength="14" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="残值" prop="scrapValue">
                <el-input v-model="detailForm.scrapValue" placeholder="请输入残值" maxlength="14" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="折旧方法" prop="depreciateCode">
                <el-input v-model="detailForm.depreciateCode" placeholder="请输入折旧方法" maxlength="12" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="尚可使用月数" prop="usableYear">
                <el-input v-model="detailForm.usableYear" placeholder="请输入尚可使用月数" maxlength="4" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="使用状态" prop="usedStateName">
                <el-input v-model="detailForm.usedStateName" readonly @click="openComplexCodeCard('assetsstatus', '使用状态')" placeholder="请选择使用状态" maxlength="60"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资金渠道" prop="assetsFundCanalName">
                <el-input v-model="detailForm.assetsFundCanalName" readonly @click="openComplexCodeCard('fund', '资金渠道')" placeholder="请选择资金渠道" maxlength="90"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="增加原因" prop="addReasonName">
                <el-input v-model="detailForm.addReasonName" readonly @click="openComplexCodeCard('addreason', '增加原因')" placeholder="请选择增加原因" maxlength="90"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="责任中心" prop="dutyCenterName ">
                <el-input v-model="detailForm.dutyCenterName" placeholder="请输入责任中心" maxlength="360"
                          @click="openDepartCard('dutyCenterName')" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="成本中心" prop="fmisCostCenterName ">
                <el-input v-model="detailForm.fmisCostCenterName" placeholder="请输入成本中心" maxlength="360"
                          @click="openDepartCard('fmisCostCenterName')" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单描述" prop="erpAufnr">
                <el-input v-model="detailForm.erpAufnr" placeholder="请输入订单描述" maxlength="30"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="一次提足分类" prop="gmGrantNbr">
                <el-input v-model="detailForm.gmGrantNbr" placeholder="请输入一次提足分类" maxlength="20"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="加计成本率" prop="taxCostRate">
                <el-input v-model="detailForm.taxCostRate" placeholder="请输入加计成本率" maxlength="13"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="计税原值" prop="taxOriginalValue">
                <el-input v-model="detailForm.taxOriginalValue" placeholder="请输入计税原值" maxlength="13"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </template>
      </el-dialog>
      <!--test start -->
      <form-card ref="refFormCard" :listMenu="listMenu" @clickItem="onClickItem" @saveSubmitForm="onSubmitForm" :title="formCardTitle">
        <material-object
                ref="refMaterialObject"
                formTitle="实物信息"
                :currMenuId="currMenuIdMain"
                @selectDepart="onSelectDepart"
        ></material-object>
        <financial-info
                ref="refFinancialInfo"
                formTitle="财务信息"
                :currMenuId="currMenuIdMain"
                :config="financialConfig"
        ></financial-info>
        <technology-info
                ref="refTechnology"
                formTitle="技术信息"
                :currMenuId="currMenuIdMain"
        ></technology-info>
      </form-card>
      <!--test end -->

      <!-- 调用综合编码-->
      <choose-complex ref="refComplexCard" @handleComplexData="handleComplexData"/>

      <!-- 调用所属单位-->
      <depart-code ref="refDepartCard" @handleDepartCard="handleDepartCard" />

    </div>

  </div>
</template>

<script setup name="PhysicalDetail">
  import { getDepreciateArea } from '@/api/system/codeNumber'
  import FormCard from '@/components/FormCard/index';
  import MaterialObject from '@/components/FormCard/MaterialObject';
  import FinancialInfo from '@/components/FormCard/FinancialInfo';
  import TechnologyInfo from '@/components/FormCard/TechnologyInfo';

  import chooseComplex from "@/views/system/card/complexCode/index";
  // 引入单据操作方法
  import { getInvoice, updateInvoice } from "@/api/value/add/financial/invoice/invoice";
  // 引入明细操作方法
  import { listDetail, getDetail, getValueList, addDetail, updateDetail } from "@/api/value/add/financial/detail/detail";
  // 引入单位选择
  import departCode from "@/views/system/card/depart/index";
  // 定义router，用于获取通过路由传递的参数
  import { useRoute } from 'vue-router';
  const formCardTitle = ref('');
  const listMenu = reactive([
    {
      id: 'material-card1',
      text: '实物信息'
    },
    {
      id: 'financial-card1',
      text: '财务信息'
    },
    {
      id: 'technology-card1',
      text: '技术信息'
    },
  ])
  const currMenuIdMain = ref(listMenu[0].id);
  const refFormCard = ref();
  const refMaterialObject = ref();
  const refFinancialInfo = ref();
  const financialConfig = ref();
  const refTechnology = ref();
  // 监听切换菜单
  function onClickItem(currMenuId) {
    currMenuIdMain.value = currMenuId.value;
  }

  // 监听所属单位变化回显责任中心和成本中心
  function onSelectDepart(row) {
    const { accountsFormData } = refFinancialInfo.value
    accountsFormData.dutyCenterName = row.dutyCenterName
    accountsFormData.fmisCostCenterName = row.fmisCostCenterName
  }
  // 监听卡片提交
  function onSubmitForm() {
    const { formValidate } = refMaterialObject.value
    const { formValidate: financialFormValidate  } = refFinancialInfo.value
    const { formValidate: technologyFormValidate  } = refTechnology.value
    Promise.all([formValidate(),financialFormValidate(), technologyFormValidate()]).then(([formData1, formData2, formData3]) => {
      const params = {...formData1, ...formData2, ...formData3 }
      updateDetail(params).then(response => {
        proxy.$modal.msgSuccess("修改成功");
        refFormCard.value.close()
        detailList();
      });
    }).catch(() => {})
  }

  // 整合所需的选中将要整合资产的keyCode集合
  const intergrationKeyCodes = ref([]);
  // 获取父页面传递过来的参数
  const route = useRoute();
  // 打开综合编码
  const refComplexCard = ref();

  const { proxy } = getCurrentInstance();

  //单据类型操作开关 只有新增情况允许操作
  const editInvoiceTypeFlag = ref(false);

  // 单据状态
  const invoiceStatusOption = reactive([{
    value: '01',
    label: '新建'
  }, {
    value: '02',
    label: '被退回'
  }, {
    value: '03',
    label: '审批中'
  }, {
    value: '04',
    label: '审批完成'
  }]);

  // 单据类型
  let invoiceTypeOption = reactive([
    {
      value: 'ZZA_0101',
      label: '投资项目-预转资'
    }, {
      value: 'ZZA_0102',
      label: '投资项目-预转资调整'
    }, {
      value: 'ZZA_0103',
      label: '投资项目-竣工转资'
    }, {
      value: 'ZZA_02',
      label: '零购项目'
    }
  ]);

  // 获取单据编号
  const parentInvoiceNumber = ref(route.query.invoiceNumber);
  // 获取单据类型
  const retailEquipment = ref(route.query.retailEquipment);

  // 定义单据表单数据
  const invoiceData = reactive({
    invoiceForm: {}
  });
  const { invoiceForm } = toRefs(invoiceData);
  //高度
  const height = ref(408);
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
    proxy.resetForm("invoiceRef");
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

  /**
   * 保存单据按钮操作
   */
  function saveInvoice() {
      updateInvoice(invoiceForm.value).then(response => {
        proxy.$modal.msgSuccess("修改单据信息成功");
      });
  }

  /** 明细区域函数 start */
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const selectRow = ref([]);
  const ids = ref([]);
  const detailReadonly = ref(true);
  const single = ref(true);
  const multiple = ref(true);
  const title = ref("");

  //单位选择定义
  const refDepartCard = ref();

  //选择单位锚点
  const departSelection = ref();

  // 明细表单
  const detailForm = ref();
  // loading加载
  const refineLoading = ref(true);
  // 分页初始条数
  const refineTotal = ref(0);
  // 分页列表数据
  const refineList = ref([]);

  // 临时数据，综合编码字典
  const tempOptions = ref([{
    tempCode: 'code1',
    tempName: '综合编码1'
  }, {
    tempCode: 'code2',
    tempName: '综合编码2'
  }]);


  // 定义分页查询数据
  const refineData = reactive({
    refineQueryParams: {
      pageNum: 1,
      pageSize: 10,
      invoiceNumber: "-1"
    },
    detailFormRules: {
      originalValue: [
        { required: true, message: "原值不能为空", trigger: "blur" },
        {
          pattern: /^\d+(\.\d{2})?$/,
          message: "请输入正确的数值",
          trigger: "blur"
        }
      ],
      usedStateName: [
        { required: true, message: "使用状态不能为空", trigger: "blur" }
      ],
      assetsFundCanalName: [
        { required: false, message: "资金渠道不能为空", trigger: "blur" }
      ],
      addReasonName: [
        { required: true, message: "增加原因不能为空", trigger: "blur" }
      ],
      nowValue: [
        { required: false, message: "请输入正确的数值", trigger: "blur" },
        {
          pattern: /^\d+(\.\d{2})?$/,
          message: "请输入正确的数值",
          trigger: "blur"
        }
      ],
      addDepreciate: [
        { required: false, message: "请输入正确的数值", trigger: "blur" },
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
          pattern: /^[0-9]*[1-9][0-9]*$/,
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
    }
  });
  const { refineQueryParams, detailFormRules } = toRefs(refineData);

  /**
   * 表单重置
   */
  function resetDetail() {
    detailForm.value = {
      assetsName: null,
      wellNameCode: null,
      contentAssetsCode: null,
      assetsStandard: null,
      productDate: null,
      useDepartName: null,
      useDepartCode: null,
      departName: null,
      departCode: null,
      unitCodeName: null,
      singleAmount: null,
      charItem5: null,
      purchaseCost: null,
      remark: null
    };
    proxy.resetForm("detailRef");
  }

  /**
   * 查询增加明细数据
   */
  function detailList() {
    loading.value = true;
    refineQueryParams.value.invoiceNumber = parentInvoiceNumber.value == "" ? "xz" : parentInvoiceNumber.value;
    listDetail(refineQueryParams.value).then(response => {
      refineList.value = response.rows;
      refineTotal.value = response.total;
      loading.value = false;
    });
  }

  /**
   * 明细数据，表格checkBox选中行事件
   * @param {*} selection 选中内容
   */
  function handleSelectionChange(selection) {
    selectRow.value = selection;
    ids.value = selection.map(item => item.id);
    // 整合资产所需的选中资产的keyCode
    intergrationKeyCodes.value = selection.map(item => item.keyCode);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /**
   * 修改按钮操作
   * @param {*} row 选中行内容
   */
  function handleUpdateDetail() {
    const row = selectRow.value[0];
    refFormCard.value.add();
    const params = {
      departCode: sessionStorage.getItem('departCode') || 11700,
      assetsType: row.assetsType || '01'
    }
    getDepreciateArea(params).then(response => {
      financialConfig.value = response.data;
      const id = row.id || ids.value;
      getDetail(id).then(response => {
        formCardTitle.value = '修改明细';
        refMaterialObject.value.formData = response.data;
        refFinancialInfo.value.accountsFormData = response.data;
        refTechnology.value.formData = response.data;
        getValueList(id).then(responseValue => {
          var valueListTemp = responseValue.data;
          for (let i = 0; i < valueListTemp.length; i++) {
            var valueData = valueListTemp[i];
            if (valueData.normType === '0001') {
              refFinancialInfo.value.accountantFormData = valueData;
            }
            if (valueData.normType === '0002') {
              refFinancialInfo.value.taxFormData = valueData;
            }
            if (valueData.normType === '0003') {
              refFinancialInfo.value.assessmentFormData = valueData;
            }
            if (valueData.normType === '0004') {
              refFinancialInfo.value.supervisionFormData = valueData;
            }
          }
        });
      });
    });
    /*resetDetail();
    const id = row.id || ids.value
    getDetail(id).then(response => {
      detailForm.value = response.data;
      open.value = true;
      title.value = "修改明细";
    });*/
  }

  /**
   * 导出按钮操作
   */
  function handleExportDetail() {
    proxy.download('detail/add/export', {
      ...queryParams.value
    }, `add_${new Date().getTime()}.xlsx`)
  }

  /**
   * 明细继续按钮
   */
  function continueForm() {
    proxy.$refs["detailRef"].validate(valid => {
      if (valid) {
        if (detailForm.value.id != null) {
          updateDetail(detailForm.value).then(response => {
            // proxy.$modal.msgSuccess("修改成功");
            // open.value = false;
            // detailList();
          });
        } else {
          detailForm.value.invoiceNumber = parentInvoiceNumber.value;
          addDetail(detailForm.value).then(response => {
            // proxy.$modal.msgSuccess("新增成功");
            // open.value = false;
            // detailList();
          });
        }
      }
    });
  }
  /**
   * 明细提交按钮
   */
  function submitForm() {
    proxy.$refs["detailRef"].validate(valid => {
      if (valid) {
        if (detailForm.value.id != null) {
          updateDetail(detailForm.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            detailList();
          });
        }
      }
    });
  }

  // 取消按钮
  function cancel() {
    open.value = false;
    resetDetail();
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
    //回写责任中心
    if(departSelection.value=='dutyCenterName'){
      detailForm.value.dutyCenterName = row.departName;
      detailForm.value.dutyCenter = row.departCode;
    }
    //回写成本中心
    if(departSelection.value=='fmisCostCenterName'){
      detailForm.value.fmisCostCenterName = row.departName;
      detailForm.value.fmisCostCenter = row.departCode;
    }
  }

  // 整合按钮，弹窗回调函数
  function intergrationCallback(formData) {
    formData.invoiceNumber = parentInvoiceNumber.value;
    formData.keyCodeArr = intergrationKeyCodes.value;
    intergrationAssetsData(formData).then(response => {
      proxy.$modal.msgSuccess("整合成功！");
      open.value = false;
      detailList();
    });
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
    if(fromKey == 'assetsstatus'){
      detailForm.value.usedStateName = row.codeName1;
      detailForm.value.usedState = row.codeProperty1;
    } else if (fromKey == 'fund'){// 计量单位：unitCodeName
      detailForm.value.assetsFundCanalName = row.codeName1;
      detailForm.value.assetsFundCanal = row.codeProperty1;
    } else if(fromKey == 'addreason'){
      detailForm.value.addReasonName = row.codeName1;
      detailForm.value.addReason = row.codeProperty1;
    }
  }
  /** 搜索按钮操作 */
  function handleQuery() {
    refineQueryParams.value.pageNum = 1;
    detailList();
  }

  /** 重置按钮操作 */
  function resetQuery() {
    proxy.resetForm("queryRef");
    handleQuery();
  }
  function tableRowClassName({ rowIndex }){
    if (rowIndex % 2 == 0) {
      return '';
    } else {
      return 'row-even-bg';
    }
  }
  /** 页面操作 start */
//1.加载上方单据信息
  handleInitInvoice();
  /** 页面操作 end */
</script>
