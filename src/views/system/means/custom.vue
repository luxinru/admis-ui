<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="目录编码" prop="contentsCode">
        <el-input
            v-model="queryParams.contentsCode"
            placeholder="请选择目录编码"
            clearable
        />
      </el-form-item>
      <el-form-item label="目录名称" prop="contentsName">
        <el-input
            v-model="queryParams.contentsName"
            placeholder="请输入目录名称"
            clearable
        />
      </el-form-item>
      <el-form-item label-width="120px" label="自定义目录名称" prop="customContentsName">
        <el-input
            v-model="queryParams.customContentsName"
            placeholder="请输入自定义目录名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['system:system:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:system:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:system:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['system:system:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="customList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="一级目录" align="center" prop="topContent"/>
      <el-table-column label="二级目录" align="center" prop="secondaryContent"/>
      <el-table-column label="目录编码" align="center" prop="contentsCode"/>
      <el-table-column label="目录名称" align="center" prop="contentsName"/>
      <el-table-column label="自定义目录名称" align="center" prop="customContentsName"/>
      <el-table-column label="目类类型" align="center" prop="codeType">
        <template #default="scope">
          <dict-tag :options=sys_means_type :value="scope.row.codeType"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              link
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:system:edit']"
          >修改
          </el-button>
          <el-button
              link
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:system:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <select-assets-contents ref="selectWindowRef" @chooseAssetsContent="fillForm"/>
    <select-custom-assets-contents @chooseCustomAssetsContent="handlerChoose"
                                   ref="selectWindowRef1"></select-custom-assets-contents>

    <!-- 添加或修改自定义资产目录表对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="systemRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="目录编码" prop="contentsCode">
              <el-input
                  v-model="form.contentsCode" placeholder="请选择目录编码"
                  @click="handleSelect" readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目录名称" prop="contentsName">
              <el-input v-model="form.contentsName" placeholder="请选择目录编码"
                        @click="handleSelect1" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="一级目录">
              <el-input v-model="form.topContent" :min-height="192"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级目录">
              <el-input v-model="form.secondaryContent" :min-height="192"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="自定义名称" prop="customContentsName">
              <el-input v-model="form.customContentsName" placeholder="请输入自定义目录名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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
  </div>
</template>

<script setup>
import {
  listCustomContents,
  getCustomContents,
  delCustomContents,
  addCustomContents,
  updateCustomContents
} from "@/api/system/CustomContents";
import SelectAssetsContents from "@/views/system/means/selectAssetsContents.vue";
import SelectCustomAssetsContents from "@/views/system/means/selectCustomAssetsContents";

const {proxy} = getCurrentInstance();
const customList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const {
  sys_means_type,
  sys_xn_yes_no,
  sys_normal_disable
} = proxy.useDict("sys_means_type", "sys_xn_yes_no", "sys_normal_disable");
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    topContent: null,
    secondaryContent: null,
    codeType: null,
    contentsCode: null,
    contentsName: null,
    customContentsName: null,
    version: null,
    sysModifyTime: null,
    deleteStatus: null
  },
  rules: {
    customContentsName: [
      {required: true, message: "自定义资产目录编码不能为空", trigger: "blur"}
    ]
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询自定义资产目录表列表 */
function getList() {
  loading.value = true;
  listCustomContents(queryParams.value).then(response => {
    customList.value = response.rows;
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
    topContent: null,
    secondaryContent: null,
    codeType: null,
    contentsCode: null,
    contentsName: null,
    customContentsName: null,
    version: null,
    sysModifyTime: null,
    createTime: null,
    createBy: null,
    updateTime: null,
    updateBy: null,
    remark: null,
    deleteStatus: 0
  };
  proxy.resetForm("systemRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

function handlerChoose(data) {
  console.log(data)
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

function handleSelect() {
  proxy.$refs["selectWindowRef"].show();
}

function handleSelect1() {
  proxy.$refs["selectWindowRef1"].show(form.value.contentsName, "02011");
}

//选完资产目录以后填充表单
function fillForm(data) {
  form.value.codeType = data.codeType;
  form.value.contentsCode = data.assetsCode;
  form.value.contentsName = data.assetsName;
}

//选完资产目录以后填充表单
function fillForm1(data) {
  console.log(data)
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加自定义资产目录表";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getCustomContents(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改自定义资产目录表";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["systemRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCustomContents(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCustomContents(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除自定义资产目录表编号为"' + id + '"的数据项？').then(function () {
    return delCustomContents(id);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/system/export', {
    ...queryParams.value
  }, `system_${new Date().getTime()}.xlsx`)
}

getList();
</script>
