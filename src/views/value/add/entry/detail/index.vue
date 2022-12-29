<template>
  <div class="app-main-content">
    <!--转资前单据页面-->
    <div class="div-editor-container-grey">
      <el-form ref="invoiceRef" :model="invoiceForm" label-width="120px" :rules="invoiceFormRules">
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
              <el-select v-model="invoiceForm.invoiceType" placeholder="请选择" style="width:240px;"
                :disabled='editInvoiceTypeFlag'>
                <el-option v-for="item in invoiceTypeOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="invoiceForm.projectName" maxlength="40" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="项目编号" prop="projectCode">
              <el-input v-model="invoiceForm.projectCode" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数量" prop="detailAmount">
              <el-input v-model="invoiceForm.detailAmount" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工器具及购置费" prop="purchaseCostSum">
              <el-input v-model="invoiceForm.purchaseCostSum" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
        <!--按钮操作部分-->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" :disabled="detailReadonly"
              @click="handleAddDetail">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdateDetail">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDeleteDetail">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" :disabled="multiple"
              @click="getAssetsDetail()">获取资产信息</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" :disabled="multiple" @click="copyDetail()">复制</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="detailList"></right-toolbar>
        </el-row>

        <!--明细表格-->
        <el-table v-loading="loading" :data="refineList" @selection-change="handleSelectionChange" :height="height"
          :row-class-name="tableRowClassName">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="资产名称" align="center" prop="assetsName" width="200" :show-overflow-tooltip="true" />
          <el-table-column label="资产类别" align="center" prop="contentAssetsCode" />
          <el-table-column label="井名及编号" align="center" prop="wellNameCode" width="100" :show-overflow-tooltip="true" />
          <el-table-column label="规格型号" align="center" prop="assetsStandard" width="160"
            :show-overflow-tooltip="true" />
          <el-table-column label="出厂日期" align="center" prop="productDate" width="140" />
          <el-table-column label="使用单位" align="center" prop="useDepartName" width="200" :show-overflow-tooltip="true" />
          <el-table-column label="计量单位" align="center" prop="unitCodeName" width="120" :show-overflow-tooltip="true" />
          <el-table-column label="数量" align="center" prop="singleAmount" />
          <el-table-column label="复合数量" align="center" prop="charItem5" />
          <el-table-column label="设备及工器具购置费" align="center" prop="purchaseCost" width="160" />
          <el-table-column label="备注" align="center" prop="remark" width="160" :show-overflow-tooltip="true" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
            <template #default="scope">
              <el-button type="text" icon="Edit" @click="handleUpdateDetail(scope.row)">修改</el-button>
              <el-button type="text" icon="Delete" @click="handleDeleteDetail(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="refineTotal > 0" :total="refineTotal" v-model:page="refineQueryParams.pageNum"
          v-model:limit="refineQueryParams.pageSize" @pagination="detailList" />
      </div>

      <!-- 添加或修改转资前单据表对话框 -->
      <el-dialog :title="title" v-model="open" width="1400px" append-to-body>
        <el-form ref="detailRef" :model="detailForm" :rules="detailFormRules" label-width="160px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="资产名称" prop="assetsName">
                <el-input v-model="detailForm.assetsName" placeholder="请输入资产名称" maxlength="40">
                  <template #append>
                    <el-icon @click="openCustomAssets(detailForm.assetsName)">
                      <Search />
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资产类别" prop="contentAssetsCode">
                <el-input v-model="detailForm.contentAssetsCode" placeholder="资产名称自动带出" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="井名及编号" prop="wellNameCode">
                <el-input v-model="detailForm.wellNameCode" placeholder="请输入井名及编号" maxlength="40"
                  :disabled="(invoiceForm.invoiceType === 'ZZA_02')" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规格型号" prop="assetsStandard">
                <el-input v-model="detailForm.assetsStandard" placeholder="请输入规格型号" maxlength="40" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="出厂日期" prop="productDate">
                <el-date-picker v-model="detailForm.productDate" placeholder="请选择出厂日期" value-format="YYYY-MM-DD"
                  :editable="false" :disabled-date="disabledDate" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="使用单位" prop="useDepartName">
                <el-input v-model="detailForm.useDepartName" placeholder="请输入使用单位" maxlength="40"
                  @click="openDepartCard('useDepartName')" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属单位" prop="departName">
                <el-input v-model="detailForm.departName" placeholder="请输入所属单位" maxlength="40"
                  @click="openDepartCard('departName')" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="计量单位" prop="unitCodeName">
                <el-input v-model="detailForm.unitCodeName" placeholder="请选择计量单位"
                  @click="openComplexCodeCard('unit', '计量单位')" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="数量" prop="singleAmount">
                <el-input v-model="detailForm.singleAmount" placeholder="请输入数量" maxlength="2" type="number"
                  :disabled="editSingleAmountFlag" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="安装地点" prop="storePlace">
                <el-input v-model="detailForm.storePlace" placeholder="请输入安装地点" maxlength="120" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备及工器具购置费" prop="purchaseCost">
                <el-input v-model="detailForm.purchaseCost" placeholder="请输入设备及工器具购置费" type="number" maxlength="15" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资产种类" prop="assetsCategoryName">
                <el-input v-model="detailForm.assetsCategoryName" placeholder="请输入资产种类" maxlength="15"
                  @click="openComplexCodeCard('assetsCategory', '资产种类')" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="复合数量" prop="charItem5">
                <el-input v-model="detailForm.charItem5" placeholder="请输入复合数量" maxlength="30" type="number" />
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="detailForm.remark" type="textarea" placeholder="请输入内容" maxlength="500" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="continueForm" v-show="continueFormFlag">继 续</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 调用所属单位-->
      <depart-code ref="refDepartCard" @handleDepartCard="handleDepartCard" />
      <!-- 调用综合编码-->
      <choose-complex ref="refComplexCard" @handleComplexData="handleComplexData" />
      <!-- 调用资产目录-->
      <select-custom-assets-contents ref="customAssets" @chooseCustomAssetsContent="onHandCustomAssets" />
    </div>
  </div>
</template>

<script setup name="Add">
// 引入单据操作方法
import { getInvoice, addInvoice, updateInvoice } from "@/api/value/add/entry/invoice/invoice";
// 引入明细操作方法
import { listDetail, getDetail, delDetail, addDetail, addDetailList, updateDetail } from "@/api/value/add/entry/detail/detail";
// 引入单位选择
import departCode from "@/views/system/card/depart/index";
// 引入综合编码选择
import chooseComplex from "@/views/system/card/complexCode/index";
// 引入资产目录
import SelectCustomAssetsContents from "@/views/system/means/selectCustomAssetsContents";
import { ref } from "vue";

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

/** 单据区域函数 start */
// 获取父页面传递过来的参数
const route = useRoute();
// 获取单据编号
const parentInvoiceNumber = ref(route.query.invoiceNumber);
// 获取单据类型
const retailEquipment = ref(route.query.retailEquipment);

// 定义单据表单数据
const invoiceData = reactive({
  invoiceForm: {},
  invoiceFormRules: {
    invoiceType: [
      { required: true, message: "请选择转资类型", trigger: "blur" }
    ],
    projectName: [
      { required: true, message: "项目名称不能为空", trigger: "blur" }
    ],
    projectCode: [
      { required: true, message: "项目编号不能为空", trigger: "blur" }
    ]
  }

});
const { invoiceForm, invoiceFormRules } = toRefs(invoiceData);



/** 单据表单重置 */
function invoiceReset() {
  invoiceForm.value = {
    invoiceNumber: null,
    invoiceStatus: null,
    invoiceType: null,
    departName: null,
    detailAmount: null,
    purchaseCostSum: null,
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
  proxy.$refs["invoiceRef"].validate(valid => {
    if (valid) {
      if (parentInvoiceNumber.value === '') {
        addInvoice(invoiceForm.value).then(response => {
          parentInvoiceNumber.value = response.msg;
          refineQueryParams.invoiceNumber = parentInvoiceNumber.value;
          handleInitInvoice();
          proxy.$modal.msgSuccess("新增单据信息成功");
        });
      } else {
        updateInvoice(invoiceForm.value).then(response => {
          proxy.$modal.msgSuccess("修改单据信息成功");
        });
      }
    }
  });
}

/** 单据区域函数 end */



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
//编辑页面是否显示继续按键
const continueFormFlag = ref(true);
//高度
const height = ref(208);
//明细表单数量填写开关 只有非零购项目允许操作
const editSingleAmountFlag = ref(false);

//明细表单井名及编号填写开关 只有非零购项目允许操作
const editWellNameCodeFlag = ref(false);

//单位选择定义
const refDepartCard = ref();

//综合编码选择定义
const refComplexCard = ref();

//选择单位锚点
const departSelection = ref();

//选择综合编码锚点
const complexSelection = ref();

// 明细表单
const detailForm = ref();
// loading加载
const refineLoading = ref(true);
// 分页初始条数
const refineTotal = ref(0);
// 分页列表数据
const refineList = ref([]);

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
      { required: editWellNameCodeFlag, message: "井名及编号不能为空", trigger: "blur" }
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
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    storePlace: [
      { required: true, message: "安装地点不能为空", trigger: "blur" }
    ],
    purchaseCost: [
      { required: true, message: "设备及工器具购置费不能为空", trigger: "blur" }
    ],
    assetsCategoryName: [
      { required: true, message: "资产种类不能为空", trigger: "blur" }
    ],
    charItem5: [
      { required: true, message: "复合数量不能为空", trigger: "blur" }
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
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/**
 * 新增按钮操作
 */
function handleAddDetail() {
  resetDetail();
  open.value = true;
  title.value = "添加明细";
  const invoiceType = invoiceForm.value.invoiceType;
  //显示继续按键
  continueFormFlag.value = true;
  // 单据为零购设备
  if (invoiceType == 'ZZA_02') {
    //设置资产种类默认为零购设备
    detailForm.value.assetsCategoryName = '零购设备';
    detailForm.value.assetsCategoryCode = '06';
    //设置明细数量默认为1 并关闭编辑功能
    detailForm.value.singleAmount = 1;
    editSingleAmountFlag.value = true;
    //井名及编号关闭必填校验
    editWellNameCodeFlag.value = false;
  } else {
    //井名及编号开启必填校验
    editWellNameCodeFlag.value = true;
  }
}

/**
 * 修改按钮操作
 * @param {*} row 选中行内容
 */
function handleUpdateDetail(row) {
  resetDetail();
  const id = row.id || ids.value;
  //隐藏继续按键
  continueFormFlag.value = false;
  getDetail(id).then(response => {
    detailForm.value = response.data;
    open.value = true;
    title.value = "修改明细";
  });
}

/**
 * 删除按钮操作
 * @param {*} row 选中行内容
 */
function handleDeleteDetail(row) {
  const deleteId = row.id || ids.value
  proxy.$modal.confirm('是否确认删除选中的数据项？').then(function () {
    return delDetail(deleteId);
  }).then(() => {
    handleInitInvoice();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
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
          handleInitInvoice();
        });
      } else {
        detailForm.value.invoiceNumber = parentInvoiceNumber.value;
        addDetail(detailForm.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          handleInitInvoice();
        });
      }
    }
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  resetDetail();
  handleInitInvoice();
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
 * 复制资产信息按键
 */
function copyDetail() {
  //判断是否存在由项目编号关联的预转资资产 预转资资产转自日期不为空
  const filterRow = selectRow.value.filter(item => {
    return item.turnDate != null;
  });

  //存在由项目编号关联的预转资资产进行提示
  if (filterRow.length != 0) {
    const assetsNames = filterRow.map(item => item.assetsName);
    proxy.$modal.msgError(`无法复制已转资资产！以下资产不符合条件限制:` + assetsNames);
  } else {
    addDetailList(selectRow.value).then(response => {
      proxy.$modal.msgSuccess("新增成功");
      open.value = false;
      handleInitInvoice();
    });
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
    detailForm.value.useDepartName = row.departName;
    detailForm.value.useDepartCode = row.departCode;
  }
  //回写所属单位
  if (departSelection.value == 'departName') {
    detailForm.value.departName = row.departName;
    detailForm.value.departCode = row.departCode;
  }

}

/**
 * 打开综合编码
 */
function openComplexCodeCard(codeProperty, codeName) {
  refComplexCard.value.openCard(codeProperty, codeName);
  complexSelection.value = codeProperty;
}

/**
 * 获取综合编码字典的数据
 * @param {*} row
 */
function handleComplexData(row) {
  //回写计量单位
  if (complexSelection.value == 'unit') {
    detailForm.value.unitCodeName = row.codeName1;
    detailForm.value.unitCode = row.codeProperty1;
  }
  //回写资产种类
  if (complexSelection.value == 'assetsCategory') {
    detailForm.value.assetsCategoryName = row.codeName1;
    detailForm.value.assetsCategoryCode = row.codeProperty1;
  }

}

// 打开资产名称
function openCustomAssets(title, assetsType) {
  proxy.$refs['customAssets'].show(title, assetsType);
}

// 监听选择资产名称
function onHandCustomAssets(row) {
  detailForm.value.assetsName = row.customContentsName
  detailForm.value.contentAssetsCode = row.assetsCode
}

// 校验出厂日期不能晚于系统时间
function disabledDate(time) {
  return time.getTime() > Date.now();
}

/** 明细区域函数 end */
function tableRowClassName({ rowIndex }) {
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
