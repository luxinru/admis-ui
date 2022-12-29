<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单位编码" prop="departCode">
        <el-input v-model="queryParams.departCode" placeholder="请输入单位编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="数据级别" prop="dataLevel">
        <el-select v-model="queryParams.dataLevel" placeholder="定义级别" clearable style="width: 240px">
          <el-option v-for="dict in dict.sys_data_level" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期" prop="yearMonth">
        <el-input v-model="queryParams.yearMonth" placeholder="请输入年月" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:serial:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:serial:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Edit" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:serial:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Upload" @click="handleImport" v-hasPermi="['system:serial:import']">导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:serial:export']">导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="serialList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单位编码" align="center" key="departCode" prop="departCode" v-if="columns[0].visible" />
      <el-table-column label="功能名" align="center" key="controllTable" prop="controllTable" v-if="columns[1].visible" />
      <el-table-column label="日期" align="center" key="yearMonth" prop="yearMonth" v-if="columns[2].visible" />
      <el-table-column label="流水号" align="center" key="numberCode" prop="numberCode" v-if="columns[3].visible" />
      <el-table-column label="数据级别" align="center" key="dataLevel" prop="dataLevel" v-if="columns[4].visible">
        <template #default="scope">
          <dict-tag :options="dict.sys_data_level" :value="scope.row.dataLevel" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" key="remark" prop="remark" v-if="columns[5].visible">
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible" width="160">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button  type="text" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:serial:edit']">修改</el-button>
          <el-button  type="text" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:serial:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位编码" prop="departCode">
              <el-input v-model="form.departCode" placeholder="请输入单位编码" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="功能名" prop="controllTable">
              <el-input v-model="form.controllTable" placeholder="请输入功能名" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="日期" prop="yearMonth">
              <el-input v-model="form.yearMonth" placeholder="请输入日期" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="流水号" prop="numberCode">
              <el-input v-model="form.numberCode" placeholder="请输入流水号" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="数据级别">
              <el-select v-model="form.dataLevel" placeholder="请选择数据级别">
                <el-option v-for="dict in dict.sys_data_level" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.workStatus">
                <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">
                  {{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
            @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <template #footer>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>

    </el-dialog>
  </div>
</template>

<script>
import { listSerial, getSerial, delSerial, addSerial, updateSerial } from "@/api/system/serial";
import { getToken } from "@/utils/auth";
export default {
  name: "Serial",
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
      // 标准化资产目录表表格数据
      serialList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 用户导入参数
      upload: {
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
        url: import.meta.env.VITE_APP_BASE_API + "/system/serial/importData"
      },
      dict: this.useDict('sys_data_level'),
      // 列信息
      columns: [
        { key: 0, label: `单位编号`, visible: true },
        { key: 1, label: `功能名`, visible: true },
        { key: 2, label: `日期`, visible: true },
        { key: 3, label: `流水号`, visible: true },
        { key: 4, label: `数据级别`, visible: true },
        { key: 5, label: `备注`, visible: true },
        { key: 6, label: `创建时间`, visible: true }
      ],

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        partDepartCode: null,
        departCode: null,
        yearMonth: null,
        controllTable: null,
        numberCode: null,
        numberCode1: null,
        businessType: null,
        dataLevel: null,
        version: null,
        sysModifyTime: null,
        searchValue: null,
        deleteStatus: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        // userName: [
        //   { required: true, message: "用户名称不能为空", trigger: "blur" },
        //   { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        // ],
        // nickName: [
        //   { required: true, message: "用户昵称不能为空", trigger: "blur" }
        // ],
        // password: [
        //   { required: true, message: "用户密码不能为空", trigger: "blur" },
        //   { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        // ],
        // email: [
        //   {
        //     type: "email",
        //     message: "请输入正确的邮箱地址",
        //     trigger: ["blur", "change"]
        //   }
        // ],
        // phonenumber: [
        //   {
        //     pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        //     message: "请输入正确的手机号码",
        //     trigger: "blur"
        //   }
        // ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询标准化资产目录表列表 */
    getList() {
      this.loading = true;
      listSerial(this.queryParams).then(response => {
        this.serialList = response.rows;
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
        partDepartCode: null,
        departCode: null,
        yearMonth: null,
        controllTable: null,
        numberCode: null,
        numberCode1: null,
        businessType: null,
        dataLevel: null,
        version: null,
        sysModifyTime: null,
        searchValue: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        remark: null,
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
      this.title = "添加综合编码";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSerial(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改综合编码";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSerial(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSerial(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除标准化资产目录表编号为"' + ids + '"的数据项？').then(function () {
        return delSerial(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/serial/export', {
        ...this.queryParams
      }, `serial_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('system/serial/importTemplate', {
      }, `serail_template_${new Date().getTime()}.xlsx`)
    },

    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
  }
};
</script>
