<template>
  <div class="app-main-content">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单据编号" prop="invoiceNumber">
        <el-input v-model="queryParams.invoiceNumber" @keyup.enter="handleQuery" style="width: 220px" clearable
          placeholder="请输入单据编号" maxlength="30" />
      </el-form-item>
      <el-form-item label="项目编号" prop="projectCode">
        <el-input v-model="queryParams.projectCode" @keyup.enter="handleQuery" style="width: 220px" clearable
          placeholder="请输入项目编号" maxlength="30" />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="queryParams.projectName" @keyup.enter="handleQuery" style="width: 220px" clearable
          placeholder="请输入项目名称" maxlength="40" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <!--<el-button type="primary" icon="Filter">筛选</el-button>-->
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="block-divider" v-if="showSearch"></div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-radio-group v-model="queryParams.invoiceStatus">
          <el-radio v-for="dict in invoiceStatusOptions" :key="dict.codeProperty" :label="dict.codeProperty"
            @change="changeInvoiceStatus(dict.codeProperty)">{{ dict.codeName }}</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="1.5" v-show="(queryParams.invoiceStatus === '01')">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['invoice:add:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5" v-show="(queryParams.invoiceStatus === '01')">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['invoice:add:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5" v-show="(queryParams.invoiceStatus === '01')">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['invoice:add:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5" v-show="(queryParams.invoiceStatus === '01')">
        <el-button type="success" plain icon="Finished" :disabled="commitFlag" @click="handleCommit"
          v-hasPermi="['invoice:add:submit']">提交</el-button>
      </el-col>
      <el-col :span="1.5" v-show="(queryParams.invoiceStatus === '03')">
        <el-button type="danger" plain icon="RefreshLeft" :disabled="rollbackFlag" @click="handleRollback"
          v-hasPermi="['invoice:add:submit']">取回</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="addList" @selection-change="handleSelectionChange" :height="height" :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单据编号" align="center" width="210">
        <template #default="scope">
          <router-link :to="{
            path: '/value/add/entry/preview',
            query: {
              invoiceNumber: scope.row.invoiceNumber
            }
          }" class="link-type">
            <span>{{ scope.row.invoiceNumber }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="单据状态" align="center" prop="invoiceStatus" :formatter="invoiceStatusFormat" />
      <el-table-column label="项目编号" align="center" prop="projectCode" />
      <el-table-column label="项目名称" align="center" prop="projectName" width="200" :show-overflow-tooltip="true"/>
      <el-table-column label="数量合计" align="center" prop="detailAmount" />
      <el-table-column label="工器具及购置费用合计" align="center" prop="purchaseCostSum" />
      <el-table-column label="备注" align="center" prop="remark"  width="160" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" width="200" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button type="text" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['invoice:add:edit']">修改</el-button>
          <el-button type="text" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['invoice:add:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />
    <el-dialog :title="title" v-model="open" width="400px" append-to-body>
      <el-form ref="addRef" :model="form" :rules="rules" label-width="200px">
        <el-form-item label="请选择是否为零购设备转资？" prop="version">
          <el-radio-group v-model="retailEquipment">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Add">
import { listInvoice, getInvoice, delInvoice, addInvoice, updateInvoice, commitInvoice, rollbackInvoice } from "@/api/value/add/entry/invoice/invoice";
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance();

const addList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const invoiceNumbers = ref([]);
const selectInvoice = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const height = ref(408);
// 提交按键操作开关
const commitFlag = ref(true);
// 回退按键操作开关
const rollbackFlag = ref(true);

// 单据状态
const invoiceStatusOptions = ref([{ codeProperty: '01', codeName: '未提交' }, { codeProperty: '03', codeName: '已提交' }]);
// 新增单据是否为零购设备
const retailEquipment = ref('');

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    invoiceNumber: null,
    invoiceStatus: '01',
    projectCode: null,
    projectName: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询转资前单据表列表 */
function getList() {
  loading.value = true;
  listInvoice(queryParams.value).then(response => {
    addList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 单据状态：01新建02被退回 */
function invoiceStatusFormat(row, column) {
  let status = row.invoiceStatus;
  if (status == "01") {
    return "新建";
  } else if (status == "02") {
    return "资产实物照片退回";
  } else if (status == "03") {
    return "资产实物照片核对";
  }
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  retailEquipment.value = '';
  proxy.resetForm("addRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  invoiceNumbers.value = selection.map(item => item.invoiceNumber);
  selectInvoice.value = selection;
  single.value = selection.length != 1;
  multiple.value = !selection.length;
  commitFlag.value = !selection.length;
  rollbackFlag.value = !selection.length;
}

// 切换页面显示单据状态
function changeInvoiceStatus(invoiceStatus) {
  queryParams.value.pageNum = 1;
  getList();
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "提示";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const invoiceNumber = row.invoiceNumber || invoiceNumbers.value[0]
  router.push({
    path: "/value/add/entry/detail",
    query: {
      retailEquipment: retailEquipment.value,
      invoiceNumber: invoiceNumber
    },
  });
}

/**
 * 送审
 */
function handleCommit() {
  const invoiceNumber = invoiceNumbers.value;
  //判断是否存在无明细单据
  const filterRow = selectInvoice.value.filter(item => {
    return item.detailAmount === 0;
  });

  //存在无明细单据进行提示
  if (filterRow.length != 0) {
    const invoiceNumberArr = filterRow.map(item => item.invoiceNumber);
    proxy.$modal.msgError(`只有存在明细的单据才可以点击此按钮！以下单据不符合条件限制:` + invoiceNumberArr);
  } else {
    commitInvoice(invoiceNumber).then(response => {
      proxy.$modal.msgSuccess("提交成功");
      getList();
    });
  }
}

/**
 * 撤回
 */
function handleRollback() {
  const invoiceNumber = invoiceNumbers.value;
  rollbackInvoice(invoiceNumber).then(response => {
    proxy.$modal.msgSuccess("取回成功");
    getList();
  });
}

/** 表单提交按钮 */
const router = useRouter();
function submitForm() {
  if (retailEquipment.value === '') {
    ElMessage('请选择是否为零购设备转资!')
    return;
  }
  router.push({
    path: "/value/add/entry/detail",
    query: {
      retailEquipment: retailEquipment.value,
      invoiceNumber: ""
    },
  });
  retailEquipment.value = '';
}

/** 删除按钮操作 */
function handleDelete(row) {
  const deleteNumbers = row.invoiceNumber || invoiceNumbers.value;
  proxy.$modal.confirm('是否确认删除选中的数据项？').then(function () {
    return delInvoice(deleteNumbers);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('invoice/add/export', {
    ...queryParams.value
  }, `add_${new Date().getTime()}.xlsx`)
}
function tableRowClassName({ rowIndex }){
  if (rowIndex % 2 == 0) {
    return '';
  } else {
    return 'row-even-bg';
  }
}
getList();
</script>
