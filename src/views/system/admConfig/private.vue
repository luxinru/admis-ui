<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="参数标识" prop="configName">
        <el-input v-model="queryParams.configName" placeholder="请输入参数标识" clearable size="small"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
                   v-hasPermi="['system:privateConfig:add']">新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
                   v-hasPermi="['system:privateConfig:edit']">修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
                   v-hasPermi="['system:privateConfig:remove']">删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
                   v-hasPermi="['system:privateConfig:export']">导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="admConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="参数标识" align="center" key="configName" prop="configName"/>
      <el-table-column label="参数说明" align="center" key="remark" prop="remark"/>
      <el-table-column label="参数值" align="center" key="configValue" prop="configValue"/>
      <el-table-column label="单位编码" align="center" key="departCode" prop="departCode"/>
      <el-table-column label="单位名称" align="center" key="departName" prop="departName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button type="text" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:privateConfig:edit']">修改
          </el-button>
          <el-button type="text" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:privateConfig:remove']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize" @pagination="getList"/>

    <!-- 添加或修改参数表对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="configForm" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="参数标识" prop="configName">
              <el-input v-model="form.configName" placeholder="请输入参数标识"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参数说明" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入参数值"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="参数值" prop="configValue">
              <el-input v-model="form.configValue" placeholder="请输入参数值"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位编码" prop="departCode">
              <el-input v-model="form.departCode" readonly placeholder="请输入单位编码">
                <template #append>
                  <el-button icon="Search" @click="openDepartCard()"/>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位名称" prop="departName">
              <el-input v-model="form.departName" readonly placeholder="请输入单位名称"/>
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
    <!-- 调用所属单位-->
    <depart-code ref="refDepartCard" :allowChooseParent="true" @handleDepartCard="handleDepartCard"/>
  </div>
</template>

<script setup>
import {
  listPrivateConfig,
  getPrivateConfig,
  delPrivateConfig,
  addPrivateConfig,
  updatePrivateConfig
} from "@/api/system/admConfig/privateConfig";
import DepartCode from "@/views/system/card/depart"
import {ref} from "vue";
const {proxy} = getCurrentInstance();
// 遮罩层
const loading = ref(true);
// 选中数组
const ids = ref([]);
// 非单个禁用
const single = ref(true);
// 非多个禁用
const multiple = ref(true);
// 显示搜索条件
const showSearch = ref(true);
// 总条数
const total = ref(0);
// 参数表表格数据
const admConfigList = ref([]);
// 弹出层标题
const title = ref("");
// 弹出层标题
const open = ref(false);
const { sys_data_level } = proxy.useDict("sys_data_level");

const data = reactive({
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    configName: null,
    configValue: null,
    partDepartCode: null,
    departCode: null,
    departName: null,
    version: null,
    deleteStatus: null
  },
  // 表单参数
  form: {},
  // 表单校验
  rules: {
    configName: [
      {required: true, message: "参数标识不能为空", trigger: "blur"}
    ],
    configValue: [
      {required: true, message: "参数值不能为空", trigger: "blur"}
    ],
  }
})
const {queryParams, form, rules} = toRefs(data);

/** 查询参数表列表 */
function getList() {
  loading.value = true;
  listPrivateConfig(queryParams.value).then(response => {
    admConfigList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    configName: null,
    configValue: null,
    partDepartCode: null,
    departCode: null,
    departName: null,
    createTime: null,
    createBy: null,
    updateTime: null,
    updateBy: null,
    version: null,
    deleteStatus: 0
  };
  proxy.resetForm("configForm");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/**
 * 打开单位弹窗
 */
function openDepartCard() {
  proxy.$refs["refDepartCard"].openCard("所属单位");
}

/**
 * 接受单位弹窗返回的数据
 * @param data 选中的单位数据
 */
function handleDepartCard(data) {
  form.value.departCode = data.departCode;
  form.value.departName = data.departName;
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryForm");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "增加私有参数";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getPrivateConfig(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改私有参数";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["configForm"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePrivateConfig(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPrivateConfig(form.value).then(response => {
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
  const id = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除选中的数据项？').then(function () {
    return delPrivateConfig(id);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/admConfig/export', {
    ...queryParams.value
  }, `admConfig_${new Date().getTime()}.xlsx`)
}
getList();

</script>
