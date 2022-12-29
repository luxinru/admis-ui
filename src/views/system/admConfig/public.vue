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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:admConfig:add']">新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
                   v-hasPermi="['system:admConfig:edit']">修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
                   v-hasPermi="['system:admConfig:remove']">删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:admConfig:export']">
          导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="admConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="参数标识" align="center" key="configName" prop="configName"/>
      <el-table-column label="参数说明" align="center" key="remark" prop="remark"/>
      <el-table-column label="参数值" align="center" key="configValue" prop="configValue"/>
      <el-table-column label="控制级别" align="center" key="dataLevel" prop="dataLevel">
        <template #default="scope">
          <dict-tag :options="dict.sys_data_level" :value="scope.row.dataLevel"/>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button type="text" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:admConfig:edit']">修改
          </el-button>
          <el-button type="text" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:admConfig:remove']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize" @pagination="getList"/>

    <!-- 添加或修改参数表对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="参数标识" prop="configName">
              <el-input v-model="form.configName" placeholder="请输入参数标识"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="参数说明" prop="remark">
              <el-input v-model="form.remark" placeholder="参数说明"/>
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

<script>
import {
  listPublicConfig,  addPublicConfig,  updatePublicConfig,  delPublicConfig, getPublicConfig } from "@/api/system/admConfig/publicConfig";

export default {
  name: "PublicConfig",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 参数表表格数据
      admConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        configName: null,
        configValue: null,
        dataLevel: null,
        deleteStatus: null
      },
      dict: this.useDict('sys_data_level'),
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        configName: [
          {required: true, message: "参数标识不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
  },

  methods: {
    /** 查询参数表列表 */
    getList() {
      this.loading = true;
      listPublicConfig(this.queryParams).then(response => {
        this.admConfigList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        configName: null,
        configValue: null,
        dataLevel: null,
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
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增公有参数";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPublicConfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公有参数";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePublicConfig(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPublicConfig(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除选中的数据项？').then(function () {
        return delPublicConfig(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/admConfig/export', {
        ...this.queryParams
      }, `admConfig_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
