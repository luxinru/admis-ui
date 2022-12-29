<template>
  <div>
    <div class="app-main-content">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="所属单位" prop="departCode"   v-if="false">
              <el-input v-model="queryParams.departCode" readonly/>
        </el-form-item>
        <el-form-item label="所属单位" prop="departName">
              <el-input v-model="queryParams.departName" readonly @click="openDepartCard" style="width: 140px"/>
        </el-form-item>
        <el-form-item label="批复文号" prop="relyCode">
          <el-input v-model="queryParams.relyCode" @keyup.enter="handleQuery" style="width: 140px" clearable placeholder="请输入批复文号" />
        </el-form-item>
        <el-form-item label="批次" prop="relyNo">
          <el-input v-model="queryParams.relyNo" @keyup.enter="handleQuery" style="width: 140px" clearable placeholder="请输入批次" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search"  @click="handleQuery">搜索</el-button>
          <el-button type="danger" icon="Refresh"  @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="block-divider" v-if="showSearch"></div>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="info" plain icon="Upload" @click="handleImport" v-hasPermi="['system:user:import']">
              导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" plain icon="Plus"  @click="handleAdd"
            v-hasPermi="['assets:add:apply:invoice:add']">增加</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" plain icon="Edit"  :disabled="single" @click="handleUpdate"
            v-hasPermi="['assets:add:apply:invoice:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="Delete"  :disabled="single"
            @click="handleDelete">删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="Upload"  :disabled="single"
            @click="openAttachPage">附件</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <el-table v-loading="loading" :data="invoiceList" @selection-change="handleSelectionChange"
                :height="height" :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="探井编码" align="center" prop="wellCode" width="155">
        </el-table-column>
        <el-table-column label="项目名称" align="center" prop="wellName" width="125">
        </el-table-column>
        <el-table-column label="项目类别" align="center" prop="projectCategory" width="125">
        </el-table-column>
        <el-table-column label="井号" align="center" prop="licenceNumber" width="125">
        </el-table-column>
        <el-table-column label="井别编码" align="center" prop="wellTypeCode" width="125">
        </el-table-column>
        <el-table-column label="井别名称" align="center" prop="wellTypeName" width="125">
        </el-table-column>
        <el-table-column label="完井日期" align="center" prop="completionDate" width="125">
        </el-table-column>
        <el-table-column label="完钻井深" align="center" prop="completionDepth" width="125">
        </el-table-column>
        <el-table-column label="有效进尺(米)" align="center" prop="footageEffective" width="125">
        </el-table-column>
        <el-table-column label="进尺" align="center" prop="actualFootage" width="125">
        </el-table-column>
        <el-table-column label="总成本-实际完成" align="center" prop="actualCostTotal" width="125">
        </el-table-column>
        <el-table-column label="单位成本(米/元)-实际完成" align="center" prop="actualCostUnit" width="205">
        </el-table-column>
        <el-table-column label="无效进尺(米)-核销井段" align="center" prop="cancelFootageInvalid" width="205">
        </el-table-column>
        <el-table-column label="总成本核销井段" align="center" prop="cancelCostTotal" width="155">
        </el-table-column>
        <el-table-column label="单位成本(米/元)-核销井段" align="center" prop="cancelCostUnit" width="205">
        </el-table-column>
        <el-table-column label="总成本-资本化" align="center" prop="capitalizationCostTotal" width="155">
        </el-table-column>
        <el-table-column label="单位成本(米/元) -资本化" align="center" prop="capitalizationCostUnit" width="205">
        </el-table-column>
        <el-table-column label="报废核销依据" align="center" prop="discardCalcelBasis" width="175">
        </el-table-column>
        <el-table-column label="审批意见" align="center" prop="auditOpinion" width="125" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="批复文号" align="center" prop="relyCode" width="125">
        </el-table-column>
        <el-table-column label="批次" align="center" prop="relyNo" width="125">
        </el-table-column>
        <el-table-column label="单位名称" align="center" prop="departName" width="240" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="160" :show-overflow-tooltip="true">
        </el-table-column>
      </el-table>
      <!-- 页面分页吸底添加 class="fixed-bottom" 弹窗类分页不添加-->
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                  v-model:limit="queryParams.pageSize" @pagination="getList" />
      <!-- 添加或修改资产单据对话框 -->
      <el-dialog :title="title" v-model="open" width="1000px" append-to-body  >
        <el-form :model="form" :rules="rules" ref="formRef" label-width="130px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目名称" prop="wellName">
                <el-input v-model="form.wellName" placeholder="请输入项目名称"  maxlength="12"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目类别" prop="projectCategory">
                <el-input v-model="form.projectCategory" placeholder="请输入项目类别" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="井号" prop="licenceNumber">
                <el-input v-model="form.licenceNumber" placeholder="请输入井号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="井别编码" prop="wellTypeCode">
                <el-input v-model="form.wellTypeCode" placeholder="请输入井别编码" @click="openComplexCodeCard('welltypecode')"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="井别名称" prop="wellTypeName">
                <el-input v-model="form.wellTypeName" placeholder="请输入井别名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="完井日期" prop="completionDate">
                <el-date-picker v-model="form.completionDate" placeholder="请输入完井日期" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="完钻井深" prop="completionDepth">
                <el-input v-model="form.completionDepth" placeholder="请输入完钻井深" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="有效进尺(米)" prop="footageEffective">
                <el-input v-model="form.footageEffective" placeholder="请输入有效进尺(米)" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="进尺(米)" prop="actualFootage">
                <el-input v-model="form.actualFootage" placeholder="请输入进尺(米)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="总成本-实际完成" prop="actualCostTotal">
                <el-input v-model="form.actualCostTotal" placeholder="请输入总成本 " />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单位成本-实际完成" prop="actualCostUnit">
                <el-input v-model="form.actualCostUnit" placeholder="请输入单位成本 " />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="无效进尺-核销井段" prop="cancelFootageInvalid">
                <el-input v-model="form.cancelFootageInvalid" placeholder="请输入无效进尺-核销井段 " />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="总成本-核销井段" prop="cancelCostTotal">
                <el-input v-model="form.cancelCostTotal" placeholder="请输入总成本-核销井段 " />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单位成本-核销井段" prop="cancelCostUnit">
                <el-input v-model="form.cancelCostUnit" placeholder="请输入单位成本-核销井段 " />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="总成本-资本化" prop="capitalizationCostTotal">
                <el-input v-model="form.capitalizationCostTotal" placeholder="请输入总成本 " />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="单位成本-资本化" prop="capitalizationCostUnit">
                <el-input v-model="form.capitalizationCostUnit" placeholder="请输入单位成本 " />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报废核销依据" prop="discardCalcelBasis">
                <el-input v-model="form.discardCalcelBasis" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审批意见" prop="auditOpinion">
                <el-input v-model="form.auditOpinion" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="批复文号" prop="relyCode">
                <el-input v-model="form.relyCode" placeholder="请输入批复文号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批次" prop="relyNo">
                <el-input v-model="form.relyNo" placeholder="请输入批次" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单位名称" prop="departName">
                <el-input v-model="form.departName" placeholder="请输入单位名称" readonly @click="openDepartCard"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单位编码" prop="departCode" v-if="false">
                <el-input v-model="form.departCode" placeholder="请输入单位编码" />
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
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </template>
      </el-dialog>
      <!-- 导入对话框 -->
      <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
        <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
                   :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
                   :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip text-center">
              <div class="el-upload__tip">
                <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
              </div>
              <span>仅允许导入xls、xlsx格式文件。</span>
              <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                       @click="importTemplate">下载模板</el-link>
            </div>
          </template>
        </el-upload>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitFileForm">确 定</el-button>
            <el-button @click="upload.open = false">取 消</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    <depart-code ref="departCard" @handleDepartCard="handleDepartCard"/>
    <choose-complex ref="refComplexCard" @handleComplexData="handleComplexData"/>
  </div>
</template>
<style>

</style>
<script setup>
import { listWell,getWell, delWell, addWell, updateWell } from "@/api/assets/well/add/well";
import departCode from "@/views/system/card/depart/index";
import chooseComplex from "@/views/system/card/complexCode/index";
import { onMounted } from "@vue/runtime-core";
const { proxy } = getCurrentInstance();
import { getToken } from "@/utils/auth";
/**
 * =============初始化字段=============
 */
// 遮罩层
const loading = ref(true);
// 选中数组
const ids = ref([]);
// 选中数组(编号)
const number = ref([]);
// 非单个禁用
const single = ref(true);
// 非多个禁用
const multiple = ref(true);
// 显示搜索条件
const showSearch = ref(true);
// 系统工作日期
const sysWorkDate = ref(null);
// 筛选弹窗
const screeningOpen = ref(false);
// 总条数
const total = ref(0);
// 资产单据表格数据
const invoiceList = ref([]);
// 弹出层标题
const title = ref("");
// 是否显示弹出层
const open = ref(false);
// 单位弹窗
const deptdailogSign = ref(false);
//高度
const height = ref(400);
const departCard = ref();
const refComplexCard = ref();

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10
  },
  rules: {
    wellName: [{ required: true, message: "参数名称不能为空", trigger: "blur" }],
    projectCategory: [{ required: true, message: "项目类别不能为空", trigger: "blur" }],
    licenceNumber: [{ required: true, message: "井号不能为空", trigger: "blur" }],
    wellTypeCode: [{ required: true, message: "井别编码不能为空", trigger: "blur" }],
    wellTypeName: [{ required: true, message: "井别名称不能为空", trigger: "blur" }],
    completionDate: [{ required: true, message: "完井日期不能为空", trigger: "blur" }],
    completionDepth: [{ required: true, message: "完钻井深不能为空", trigger: "blur" }],
    footageEffective: [{ required: true, message: "有效进尺不能为空", trigger: "blur" }],
    actualCostTotal: [{ required: true, message: "总成本-实际完成不能为空", trigger: "blur" }],
    relyCode: [{ required: true, message: "批复文号不能为空", trigger: "blur" }],
    relyNo: [{ required: true, message: "批次不能为空", trigger: "blur" }]
  }
});

const { queryParams, form, rules } = toRefs(data);


getList();
const router = useRouter();

/**
 * =============钩子函数===============
 */

onMounted(() => {
  /* 窗口变化时自适应 监听窗口变化 */
  // window.addEventListener('resize', getHeight)
})

/**
 * =============自定义方法=============
 */

/** 查询资产单据列表 */
function getList() {
  loading.value = true;
  listWell(proxy.addDateRange(queryParams.value)).then(res => {
    loading.value = false;
    invoiceList.value = res.rows;
    total.value = res.total;
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 表单重置 */
function reset() {
   form.value = {
      wellName: undefined,
      projectCategory: undefined,
      licenceNumber: undefined,
      wellTypeCode: undefined,
      wellTypeName: undefined,
      completionDate: undefined,
      completionDepth: undefined,
      footageEffective: undefined,
      actualFootage:undefined,
      actualCostTotal: undefined,
      actualCostUnit: undefined,
      cancelFootageInvalid: undefined,
      cancelCostTotal: undefined,
      cancelCostUnit: undefined,
      capitalizationCostTotal: undefined,
      capitalizationCostUnit: undefined,
      discardCalcelBasis: undefined,
      auditOpinion: undefined,
      relyCode: undefined,
      relyNo: undefined,
      departCode: undefined,
      departName: undefined,
      remark: undefined
   };
   proxy.resetForm("queryRef");
};

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryForm");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  number.value = selection.map(item => item.invoiceNumber)
  single.value = selection.length!==1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "台账增加";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getWell(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改台账";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        updateWell(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addWell(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  let rowIds = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(function() {
      return delWell(rowIds);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
}

/** 打开附件窗口 */
function openAttachPage() {
  const keycode = number.value[0];
  const tableName = 'adm_real_assets_invoice';
  $refs.attach.show(keycode,tableName);
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("business/add/invoice/export", {
    ...queryParams.value
  }, `post_${new Date().getTime()}.xlsx`);
}

function openDepartCard(){
  departCard.value.openCard("所属单位");
}

function handleDepartCard(row){
  form.value.departName = row.departName;
  form.value.departCode = row.departCode;
}

function openComplexCodeCard(codeProperty){
  refComplexCard.value.openCard(codeProperty,"井别编码");
}

function handleComplexData(row){
  // 增加原因
  form.value.wellTypeName = row.codeName1;
  form.value.wellTypeCode = row.codeProperty1;
}

function handleImport() {
   upload.title = "台账导入";
   upload.open = true;
};
/** 下载模板操作 */
function importTemplate() {
   proxy.download("well/add/importTemplate", {"1":"1"
   }, `well_template_${new Date().getTime()}.xlsx`);
};
const upload = reactive({
   // 是否显示弹出层（用户导入）
   open: false,
   // 弹出层标题（用户导入）
   title: "",
   // 是否禁用上传
   isUploading: false,
   // 是否更新已经存在的用户数据
   updateSupport: 0,
   // 设置上传的请求头部
   headers: { Authorization: "Bearer " + getToken() },
   // 上传的地址
   url: import.meta.env.VITE_APP_BASE_API + "/well/add/importData"
});
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
   upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
   upload.open = false;
   upload.isUploading = false;
   proxy.$refs["uploadRef"].handleRemove(file);
   proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
   getList();
};
/** 提交上传文件 */
function submitFileForm() {
   proxy.$refs["uploadRef"].submit();
};
function tableRowClassName({ rowIndex }){
  if (rowIndex % 2 == 0) {
    return '';
  } else {
    return 'row-even-bg';
  }
}
</script>
