<template>
  <div class="app-main-content">
    <el-form :model="refineQueryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="69px">
      <el-form-item label="资产类别编码" prop="contentAssetsCode">
        <el-input v-model="refineQueryParams.contentAssetsCode" @keyup.enter="handleQuery" style="width: 220px"
                  clearable
                  placeholder="请输入资产类别编号"/>
      </el-form-item>
      <el-form-item label="规格型号" prop="assetsStandard">
        <el-input v-model="refineQueryParams.assetsStandard" @keyup.enter="handleQuery" style="width: 220px" clearable
                  placeholder="请输入规格型号"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <!--<el-button type="primary" icon="Filter">筛选</el-button>-->
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="block-divider"></div>
    <!--使用状态确认明細页面-->
    <div class="div-editor-container-grey">
      <div class="table-box">
        <!--按钮操作部分-->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Upload" :disabled="single"
                       @click="openAttachPage">附件
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdateDetail">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="multiple" @click="handleOperateDate">投产日期</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="detailList"></right-toolbar>
        </el-row>

        <!--明细表格-->
        <el-table v-loading="loading" :data="refineList" @selection-change="handleSelectionChange"
                  :height="height" :row-class-name="tableRowClassName">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="资产名称" align="center" prop="assetsName" width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="资产类别" align="center" prop="contentAssetsCode"/>
          <el-table-column label="规格型号" align="center" prop="assetsStandard"/>
          <el-table-column label="出厂日期" align="center" prop="productDate"/>
          <el-table-column label="使用单位" align="center" prop="useDepartName" width="160" :show-overflow-tooltip="true"/>
          <el-table-column label="计量单位" align="center" prop="unitCodeName"/>
          <el-table-column label="计量数量" align="center" prop="singleAmount"/>
          <el-table-column label="复合数量" align="center" prop="charItem5"/>
          <el-table-column label="投产日期" align="center" prop="operateDate"/>
          <el-table-column label="资产种类" align="center" prop="assetsCategoryName"/>
          <el-table-column label="资产分类" align="center" prop="charItem29"/>
          <el-table-column label="是否相符" align="center" width="100">
            <template #default="scope">
              <el-switch
                      v-model="scope.row.confirmResult"
                      :active-value="0"
                      :inactive-value="1"
                      @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" width="160" :show-overflow-tooltip="true"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
            <template #default="scope">
              <el-button type="text" icon="Edit" @click="handleUpdateDetail(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="refineTotal > 0" :total="refineTotal" v-model:page="refineQueryParams.pageNum"
                    v-model:limit="refineQueryParams.pageSize" @pagination="detailList"/>
      </div>

    </div>

    <!--填写资产种类、分类弹窗区域-->
    <el-dialog :title="title" v-model="open" width="800px" top="5vh" append-to-body>
      <div class="div-editor-container-grey">
        <div class="app-container">
          <el-form ref="detailRef" :model="detailForm" :rules="detailFormRules"  label-width="150px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="资产分类" prop="charItem29">
                  <el-input v-model="detailForm.charItem29" placeholder="请输入资产分类" maxlength="15"
                            @click="openComplexCodeCard('charItem28', '资产分类')" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="资产种类" prop="assetsCategoryName">
                  <el-input v-model="detailForm.assetsCategoryName" placeholder="请输入资产种类" maxlength="15"
                            @click="openComplexCodeCard('assetsCategory', '资产种类')" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="投产日期" prop="operateDate">
                  <el-date-picker v-model="detailForm.operateDate" placeholder="请选择投产日期" value-format="YYYY-MM-DD"
                                  :editable="false" />
                </el-form-item>
              </el-col>

            </el-row>
          </el-form>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!--填写投产日期弹窗区域-->
    <el-dialog :title="title" v-model="openOperateDate" width="800px" top="5vh" append-to-body>
      <div class="div-editor-container-grey">
        <div class="app-container">
          <el-form ref="operateDateRef" :model="operateDateForm" :rules="operateDateFormRules"  label-width="150px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="投产日期" prop="operateDate">
                  <el-date-picker v-model="operateDateForm.operateDate" placeholder="请选择投产日期" value-format="YYYY-MM-DD"
                                  :editable="false" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="operateDateSubmitForm">确 定</el-button>
          <el-button @click="operateDateCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 调用综合编码-->
    <choose-complex ref="refComplexCard" @handleComplexData="handleComplexData" />
  </div>
</template>

<script setup name="confirm">
// 引入单据操作方法
import {listInvoice, getInvoice, checkInvoice} from "@/api/value/add/confirm/invoice/invoice";
// 引入明细操作方法
import {listDetail, getDetail, changeCheckStatus,updateDetail,updateOperateDate} from "@/api/value/add/confirm/detail/detail";
// 引入综合编码选择
import chooseComplex from "@/views/system/card/complexCode/index";
import {ElMessage} from 'element-plus';
import {useRoute} from 'vue-router';

const {proxy} = getCurrentInstance();
const open = ref(false);
const openOperateDate = ref(false);

const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const number = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
//高度
const height = ref(408);
// loading加载
const refineLoading = ref(true);
// 分页初始条数
const refineTotal = ref(0);
// 分页列表数据
const refineList = ref([]);

// 获取父页面传递过来的参数

const route = useRoute();

// 获取单据编号
const parentInvoiceNumber = ref(route.query.invoiceNumber);

const detailForm = ref();
const operateDateForm = ref();
//选择综合编码锚点
const complexSelection = ref();
//综合编码选择定义
const refComplexCard = ref();

/** 明细区域函数 start */

// 定义分页查询数据
const refineData = reactive({
  refineQueryParams: {
    pageNum: 1,
    pageSize: 10,
    invoiceNumber: parentInvoiceNumber.value == "" ? "xz" : parentInvoiceNumber.value,
    contentAssetsCode: null,
    assetsStandard: null
  },
  detailFormRules: {
    charItem29: [
      { required: true, message: "资产分类不能为空", trigger: "blur" }
    ],
    operateDate: [
      { required: true, message: "投产日期不能为空", trigger: "blur" }
    ],
    assetsCategoryName: [
      { required: true, message: "资产种类不能为空", trigger: "blur" }
    ]

  },
  operateDateFormRules: {
    operateDate: [
      { required: true, message: "投产日期不能为空", trigger: "blur" }
    ]

  }
});
const { refineQueryParams, detailFormRules,operateDateFormRules } = toRefs(refineData);
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 搜索按钮操作 */
function handleQuery() {
  refineQueryParams.value.pageNum = 1;
  detailList();
}


/** 打开附件窗口 */
function openAttachPage() {
  const keycode = number.value[0];
  const tableName = 'adp_varassetsdetail_add';
  $refs.attach.show(keycode, tableName);
}


/** 是否相符修改 */
function handleStatusChange(row) {

  if(row.confirmResult == 0 &&(row.assetsCategoryName==""||row.charItem29=="")){
    proxy.$modal.msgSuccess("资产种类或资产分类为空，不能相符");
    row.confirmResult = row.confirmResult === 1 ? 0 : 1;
  }else{
    let text = row.confirmResult === 0 ? "相符" : "不相符";
    proxy.$modal.confirm('确认"' + row.assetsName + '"的资产"' + text + '"吗?').then(function () {
      return changeCheckStatus(row.keyCode, row.id, row.confirmResult);
    }).then(() => {
      proxy.$modal.msgSuccess(text + "成功");
    }).catch(function () {
      row.confirmResult = row.confirmResult === 1 ? 0 : 1;
    });
  }
}

/**
 * 查询核对明细数据
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
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
  number.value = selection.map(item => item.invoiceNumber)
}


/** 明细区域函数 end */

function tableRowClassName({rowIndex}) {
  if (rowIndex % 2 == 0) {
    return '';
  } else {
    return 'row-even-bg';
  }
}

detailList();


/**
 * 修改按钮操作
 * @param {*} row 选中行内容
 */
function handleUpdateDetail(row) {
  //resetDetail();
  const id = row.id || ids.value
  getDetail(id).then(response => {
    detailForm.value = response.data;
    open.value = true;
    title.value = "修改明细";
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  //resetDetail();
  handleInitInvoice();
}
/**
 * 明细提交按钮
 */
function submitForm() {
  proxy.$refs["detailRef"].validate(valid => {
    if (valid) {
      updateDetail(detailForm.value).then(response => {
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        detailList();
      });
    }
  });
}

/**
 * 投产日期按钮操作
 * @param {*} row 选中行内容
 */
function handleOperateDate() {
  //resetDetail();
  const id = ids.value
  getDetail(id[0]).then(response => {
    operateDateForm.value = response.data;
    openOperateDate.value = true;
    title.value = "填写投产日期";
  });
}
/**
 * 投产日期提交按钮
 */
function operateDateSubmitForm() {

  const obj = {
    ids: ids.value,
    operateDate: operateDateForm.value.operateDate,
  };
  proxy.$refs["operateDateRef"].validate(valid => {
    if (valid) {
      updateOperateDate(proxy.addDateRange(obj)).then(response => {
        proxy.$modal.msgSuccess("修改成功");
        openOperateDate.value = false;
        detailList();
      });
    }
  });
}

// 投产日期取消按钮
function operateDateCancel() {
  openOperateDate.value = false;
  detailList();
}
/**
 * 单据区域初始化
 */
function handleInitInvoice() {
  open.value = false;
  detailList();
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
  //回写资产分类
  if (complexSelection.value == 'charItem28') {
    detailForm.value.charItem29 = row.codeName1;
    detailForm.value.charItem28 = row.codeProperty1;
  }
  //回写资产种类
  if (complexSelection.value == 'assetsCategory') {
    detailForm.value.assetsCategoryName = row.codeName1;
    detailForm.value.assetsCategoryCode = row.codeProperty1;
  }

}

</script>
