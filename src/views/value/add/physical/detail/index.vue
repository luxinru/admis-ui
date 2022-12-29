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
            <el-button type="success" plain icon="Connection" :disabled="integrationButton" @click="integrationFun">整合</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Link" :disabled="single" @click="unIntergrationButton">取消整合</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdateDetail">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain icon="View" :disabled="multiple"
                       @click="getAssetsDetail()">获取资产信息</el-button>
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
          <el-table-column label="计量单位" align="center" prop="unitCodeName" width="170"/>
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

      <!-- 修改转资前单据表对话框 -->
      <el-dialog :title="title" v-model="open" width="1200px" append-to-body>
        <el-form ref="detailRef" :model="detailForm" :rules="detailFormRules" label-width="160px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="资产类型" prop="assetsTypeName">
                <el-input v-model="detailForm.assetsTypeName" readonly @click="openComplexCodeCard('assetType', '资产类型')" placeholder="请选择资产类型" maxlength="40"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资产类别" prop="contentAssetsCode">
                <el-input v-model="detailForm.contentAssetsCode" readonly @click="openComplexCodeCard('addreason2', '资产类别')" placeholder="请选择资产类别" maxlength="40"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资产名称" prop="assetsName">
                <el-input v-model="detailForm.assetsName" placeholder="请输入资产名称" maxlength="40" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="自编号" prop="selfCode">
                <el-input v-model="detailForm.selfCode" placeholder="请输入自编号" maxlength="40" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="规格型号" prop="assetsStandard">
                <el-input v-model="detailForm.assetsStandard" placeholder="请输入规格型号" maxlength="40" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="车牌井号" prop="licenceNumber">
                <el-input v-model="detailForm.licenceNumber" placeholder="请输入车牌井号" maxlength="40" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="存放地点" prop="storePlace">
                <el-input v-model="detailForm.storePlace" placeholder="请输入存放地点" maxlength="120" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="数量" prop="singleAmount">
                <el-input v-model="detailForm.singleAmount" placeholder="请输入数量" maxlength="2" type="number"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="制造厂家" prop="makeFactory">
                <el-input v-model="detailForm.makeFactory" placeholder="请输入制造厂家" maxlength="120" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出厂编号" prop="productCode">
                <el-input v-model="detailForm.productCode" placeholder="请输入出厂编号" maxlength="120" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="计量单位" prop="unitCodeName">
                <el-input v-model="detailForm.unitCodeName" readonly @click="openComplexCodeCard('unitMeasurement', '计量单位')" placeholder="请选择计量单位" maxlength="40"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="盘点单位" prop="managerDepartName ">
                <el-input v-model="detailForm.managerDepartName" placeholder="请输入盘点单位" maxlength="40"
                          @click="openDepartCard('managerDepartName')" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="出厂日期" prop="productDate">
                <el-date-picker v-model="detailForm.productDate" placeholder="请选择出厂日期" value-format="YYYY-MM-DD"
                                :editable="false" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="投产日期" prop="operateDate">
                <el-date-picker v-model="detailForm.operateDate" placeholder="请选择投产日期" value-format="YYYY-MM-DD"
                                :editable="false" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资产组编码" prop="entityCode">
                <el-input v-model="detailForm.entityCode" readonly @click="openComplexCodeCard('unitMeasurement', '计量单位')" placeholder="请选择资产组编码" maxlength="40"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资产组名称" prop="entityName">
                <el-input v-model="detailForm.entityName" placeholder="请输入组编码" maxlength="120" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="增加日期" prop="addVoucherDate">
                <el-date-picker v-model="detailForm.addVoucherDate" placeholder="请选增加日期" value-format="YYYY-MM-DD"
                                :editable="false" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="参考原值" prop="referenceOriginalValue">
                <el-input v-model="detailForm.referenceOriginalValue" placeholder="请输入设备及工器具购置费" maxlength="15" type="number"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="技术状况" prop="technicalCondition">
                <el-input v-model="detailForm.technicalCondition" readonly @click="openComplexCodeCard('technical', '技术状况')" placeholder="请选择技术状况" maxlength="40"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="技术部门" prop="technicalDepartName">
                <el-input v-model="detailForm.technicalDepartName" placeholder="请选择技术部门" maxlength="40"
                          @click="openDepartCard('technicalDepartName')" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="所属单位" prop="departName">
                <el-input v-model="detailForm.departName" placeholder="请输入所属单位" maxlength="40"
                          @click="openDepartCard('departName')" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="保管人" prop="userPerson">
                <el-input v-model="detailForm.userPerson" placeholder="请输入保管人" maxlength="120"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="境内境外" prop="inOutType">
                <el-input v-model="detailForm.inOutType" placeholder="请选择境内境外" maxlength="120"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属区块" prop="areaCode">
                <el-input v-model="detailForm.areaCode" readonly @click="openComplexCodeCard('unitMeasurement', '计量单位')" placeholder="请选择所属区块" maxlength="40"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="油气分类" prop="oilgasType">
                <el-input v-model="detailForm.oilgasType" placeholder="请选择油气分类" maxlength="40"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="油区" prop="oilareaNum">
                <el-input v-model="detailForm.oilareaNum" placeholder="请选择油区" maxlength="40"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同编号" prop="contractCode">
                <el-input v-model="detailForm.contractCode" placeholder="请输入合同编号" maxlength="40"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同名称" prop="contractName">
                <el-input v-model="detailForm.contractName" placeholder="请输入合同名称" maxlength="40"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="detailForm.remark" type="textarea" placeholder="请输入内容" maxlength="500" />
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

      <!--整合功能页面-->
      <intergration-dialog ref="refIntergrationCard" @handleIntergration="intergrationCallback" />

    </div>

  </div>
</template>

<script setup name="PhysicalDetail">
  import FormCard from '@/components/FormCard/index';
  import MaterialObject from '@/components/FormCard/MaterialObject';
  import FinancialInfo from '@/components/FormCard/FinancialInfo';
  import TechnologyInfo from '@/components/FormCard/TechnologyInfo';

  import chooseComplex from "@/views/system/card/complexCode/index";

  // 引入单据操作方法
  import { getInvoice, updateInvoice } from "@/api/value/add/physical/invoice/invoice";
  // 引入明细操作方法
  import { listDetail, getDetail, addDetail, updateDetail, intergrationAssetsData,
    unIntergrationAssetsData} from "@/api/value/add/physical/detail/detail";
  import { getDepreciateArea } from '@/api/system/codeNumber'
  // 引入单位选择
  import departCode from "@/views/system/card/depart/index";
  // 定义router，用于获取通过路由传递的参数
  import { useRoute } from 'vue-router';
  // 整合功能页面
  import intergrationDialog from "@/views/value/add/physical/components/detail/integration/index";
  import {nextTick} from "vue";
  // 整合页面弹窗
  const refIntergrationCard = ref();
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
  // 监听卡片提交
  function onSubmitForm() {
    const { formValidate } = refMaterialObject.value
    const { formValidate: financialFormValidate  } = refFinancialInfo.value
    const { formValidate: technologyFormValidate  } = refTechnology.value
    Promise.all([formValidate(),financialFormValidate(), technologyFormValidate()]).then(([formData1, formData2, formData3]) => {
      // console.log(formData1, 'formData1')
      // console.log(formData2, 'formData2')
      const params = {...formData1, ...formData2, ...formData3 }
      updateDetail(params).then(response => {
        proxy.$modal.msgSuccess("修改成功");
        refFormCard.value.close()
        detailList();
      });
    }).catch(() => {})
  }
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
  // 修改表单
  function handleUpdateDetail() {
    const row = selectRow.value[0];
    refFormCard.value.add();
    const id = row.id || ids.value;
    getDetail(id).then(response => {
      formCardTitle.value = '修改明细';
      refMaterialObject.value.formData = response.data;
      refFinancialInfo.value.accountsFormData = response.data;
      refTechnology.value.formData = response.data;
    });
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
  const integrationButton = ref(true);
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
      assetsName: [
        { required: true, message: "资产名称不能为空", trigger: "blur" }
      ],
      wellNameCode: [
        { required: invoiceForm.invoiceType != 'ZZA_02', message: "井名及编号不能为空", trigger: "blur" }
      ],
      contentAssetsCode: [
        { required: true, message: "资产类别不能为空", trigger: "blur" }
      ],
      assetsStandard: [
        { required: true, message: "规格型号不能为空", trigger: "blur" }
      ],
      productDate: [
        { required: true, message: "出厂日期不能为空", trigger: "blur" }
      ],
      useDepartName: [
        { required: true, message: "使用单位不能为空", trigger: "blur" }
      ],
      departName: [
        { required: true, message: "所属单位不能为空", trigger: "blur" }
      ],
      unitCodeName: [
        { required: true, message: "请选择计量单位", trigger: "blur" }
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
    integrationButton.value = !(selection.length>1);
    multiple.value = !selection.length;
  }

  /**
   * 修改按钮操作
   * @param {*} row 选中行内容
   */
  // function handleUpdateDetail(row) {
  //   resetDetail();
  //   const id = row.id || ids.value
  //   getDetail(id).then(response => {
  //     detailForm.value = response.data;
  //     open.value = true;
  //     title.value = "修改明细";
  //   });
  // }

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
   * 获取资产信息按键
   */
  function getAssetsDetail() {
    //判断是否存在非油气水井
    const filterRow = selectRow.value.filter(item => {
      return item.assetsCategoryCode != '01';
    });

    //存在油气资产进行提示
    if (filterRow.length != 0) {
      const assetsNames = filterRow.map(item => item.assetsName);
      proxy.$modal.msgError(`只有油气水井类资产才可以点击此按钮！以下资产不符合条件限制:` + assetsNames);
    } else {
      proxy.$modal.msgSuccess("接口暂未开放！");
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
    //回写技术部门
    if(departSelection.value=='technicalDepartName'){
      detailForm.value.technicalDepartName = row.departName;
      detailForm.value.technicalDepart = row.departCode;
    }
    //回写所属单位
    if(departSelection.value=='departName'){
      detailForm.value.departName = row.departName;
      detailForm.value.departCode = row.departCode;
    }
    //回写盘点单位
    if(departSelection.value=='managerDepartName'){
      detailForm.value.managerDepartName = row.departName;
      detailForm.value.managerDepart = row.departCode;
    }
  }

  // 整合按钮触发事件
  function integrationFun() {
    // 已转资资产校验
    var num = 0;
    var message = "";
    // 流动资产校验
    var numAssetsType = 0;
    var messageAssetsType = "";
    // 循环遍历校验资产是否允许整合
    for (let i = 0; i < selectRow.value.length; i++) {
      if(selectRow.value[i].turnDate){
        message += "资产【"+selectRow.value[i].assetsName+"】为已转资；";
        num++;
      }
      if(selectRow.value[i].assetsType == '0501'){
        messageAssetsType += "资产【"+selectRow.value[i].assetsName+"】为流动资产；";
        numAssetsType++;
      }
    }
    if(num > 1 || numAssetsType >= 1){
      if(message && num > 1){
        message = "选中的资产中，超过一条已转资资产，其中："+message+"无法进行整合！";
      }else{
        message = "";
      }
      if(messageAssetsType){
        messageAssetsType = "选中的资产中，存在流动资产："+messageAssetsType+"无法进行整合！";
      }
      proxy.$modal.msgSuccess(message+messageAssetsType);
    }else{
      refIntergrationCard.value.show("整合资产");
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

  // 取消整合，按钮触发事件
  function unIntergrationButton() {
    if(selectRow.value[0].isMerge == 0){
      const obj = {
        invoiceNumber: parentInvoiceNumber.value,
        mergeAfterKeycode: intergrationKeyCodes.value[0]
      };
      unIntergrationAssetsData(obj).then(response => {
        proxy.$modal.msgSuccess("取消整合成功！");
        open.value = false;
        detailList();
      });
    }else{
      proxy.$modal.msgSuccess("该资产未整合，无法进行取消整合操作！");
    }

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
      detailForm.value.assetsTypeName = row.codeName1;
      detailForm.value.assetType = row.codeProperty1;
    } else if (fromKey == 'unitMeasurement'){// 计量单位：unitCodeName
      detailForm.value.unitCodeName = row.codeName1;
      detailForm.value.unitCode = row.codeProperty1;
    } else if(fromKey == 'addreason2'){
      detailForm.value.contentAssetsCode = row.codeName1;
      // form.value.contentAssetsName = row.codeProperty1;
    }else if (fromKey == 'technical'){
      detailForm.value.technicalCondition = row.codeName1;
      detailForm.value.technicalConditionName = row.codeProperty1;
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
