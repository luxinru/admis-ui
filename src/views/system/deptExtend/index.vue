<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="部门名称" prop="departName">
        <el-input v-model="queryParams.departName" placeholder="请输入部门名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="部门编码" prop="departCode">
        <el-input v-model="queryParams.departCode" placeholder="请输入部门编码" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:dept:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Upload" @click="handleImport" v-hasPermi="['system:deptExtend:import']">导入
        </el-button>

      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="onLevel">上一级</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" @click="inLevel">下一级</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="deptList">
      <el-table-column prop="departName" label="部门名称" align="center"></el-table-column>
      <!-- <el-table-column prop="orderNum" label="排序" align="center"></el-table-column> -->
      <el-table-column prop="codeType" label="单位类别" align="center"></el-table-column>
      <el-table-column prop="departCode" label="单位编码" align="center"></el-table-column>
      <el-table-column prop="shortName" label="单位简称" align="center"></el-table-column>
      <el-table-column prop="shortSpell" label="单位简拼" align="center"></el-table-column>
      <el-table-column prop="departCode" label="单位编码" align="center"></el-table-column>

      <el-table-column prop="departLevel" label="单位级别" align="center"></el-table-column>
      <el-table-column prop="companyCode" label="公司代码编号" align="center"></el-table-column>
      <el-table-column prop="companyName" label="公司代码名称" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template #default="scope">
          <dict-tag :options="dict.sys_normal_disable" :value="scope.row.workStatus" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center"  width="200" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button type="text" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:deptExtend:edit']">修改
          </el-button>
          <el-button type="text" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['system:deptExtend:add']">新增
          </el-button>
          <el-button type="text" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:deptExtend:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />
    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" v-model="open" width="1200px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="部门名称" label-width="150px" prop="departName">
              <el-input v-model="form.departName" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="单位编码" label-width="150px" prop="departCode">
              <el-input v-model="form.departCode" placeholder="请输入单位编码" maxlength="20" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="父编码" label-width="150px" prop="parentCode">
              <el-input v-model="form.parentCode" placeholder="请输入父编码父编码" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="单位性质" label-width="150px" prop="stationProperties">
              <el-input v-model="form.stationProperties" placeholder="请输入单位性质" maxlength="20" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="单位类别" label-width="150px" prop="codeType">
              <el-input v-model="form.codeType" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="单位级别" label-width="150px" prop="departLevel">
              <el-input v-model="form.departLevel" placeholder="请输入单位级别" maxlength="20" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="单位简称" label-width="150px" prop="shortName">
              <el-input v-model="form.shortName" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="单位简拼" label-width="150px" prop="shortSpell">
              <el-input v-model="form.shortSpell" placeholder="请输入单位简拼" maxlength="20" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="组织编码" label-width="150px" prop="orgCode">
              <el-input v-model="form.orgCode" placeholder="组织编码" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="组织名称" label-width="150px" prop="orgName">
              <el-input v-model="form.orgName" placeholder="请输入组织名称" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="功能范围编码" label-width="150px" prop="functionalScope">
              <el-input v-model="form.functionalScope" placeholder="请输入功能范围编码" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="功能范围名称" label-width="150px" prop="functionalScopeName">
              <el-input v-model="form.functionalScopeName" placeholder="请输入功能范围名称" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="公司代码编码" label-width="150px" prop="companyCode">
              <el-input v-model="form.companyCode" placeholder="请输入公司代码编码" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="公司代码名称" label-width="150px" prop="companyName">
              <el-input v-model="form.companyName" placeholder="请输入公司代码名称" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="FMIS:部门编码" label-width="150px" prop="departmentCode">
              <el-input v-model="form.departmentCode" placeholder="请输入FMIS:部门编码" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="FMIS:部门名称" label-width="150px" prop="departmentName">
              <el-input v-model="form.departmentName" placeholder="请输入FMIS:部门名称" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="FMIS:销售方式编码" label-width="150px" prop="saleCode">
              <el-input v-model="form.saleCode" placeholder="请输入FMIS:销售方式编码" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="FMIS:销售方式名称" label-width="150px" prop="saleName">
              <el-input v-model="form.saleName" placeholder="请输入FMIS:销售方式名称" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="FMIS:责任中心编码" label-width="150px" prop="dutyCenter">
              <el-input v-model="form.dutyCenter" placeholder="请输入FMIS:责任中心编码" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="FMIS:责任中心名称" label-width="150px" prop="dutyCenterName">
              <el-input v-model="form.dutyCenterName" placeholder="请输入FMIS:责任中心名称" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="FMIS:成本中心编码" label-width="150px" prop="fmisCostCenter">
              <el-input v-model="form.fmisCostCenter" placeholder="请输入FMIS:成本中心编码" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="FMIS:成本中心名称" label-width="150px" prop="fmisCostCenterName">
              <el-input v-model="form.fmisCostCenterName" placeholder="请输入FMIS:成本中心名称" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="父编码" prop="parentCode">
              <el-input v-model="form.parentCode" placeholder="请输入父编码" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status">
                <el-radio disabled v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">
                  {{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>

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
        <template #tip>
          <div class="el-upload__tip text-center">
            <!-- <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
          </div> -->
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

</template>

<script>

/**
* listDeptExcludeChild
*/
import { listDeptExtend, getDeptExtend, addDeptExtend, updateDeptExtend, delDeptExtend } from "@/api/system/deptExtend";
import { getToken } from "@/utils/auth";

export default {
  name: "DeptExtend",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // // 是否展开，默认全部展开
      // isExpandAll: true,
      // // 重新渲染表格状态
      // refreshTable: true,
      // 查询参数
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        codeType: null,
        parentCode: null,
        departCode: null,
        departName: null,
        shortName: null,
        shortSpell: null,
        markTail: null,
        departLevel: 1,
        dutyUser: null,
        stationProperties: null,
        orgCode: null,
        orgName: null,
        companyCode: null,
        companyName: null,
        dutyCenter: null,
        dutyCenterName: null,
        fmisCostCenter: null,
        fmisCostCenterName: null,
        departmentCode: null,
        departmentName: null,
        saleCode: null,
        saleName: null,
        functionalScope: null,
        functionalScopeName: null,
        workStatus: null,
        usableDate: null,
        standardDepartCode: null,
        unusableDate: null,
        version: null,
        deleteStatus: null
      },
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
        url: import.meta.env.VITE_APP_BASE_API + "/system/depart/importData"
      },
      dict: this.useDict('sys_normal_disable'),
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        // parentId: [
        //   { required: true, message: "上级部门不能为空", trigger: "blur" }
        // ],
        // deptName: [
        //   { required: true, message: "部门名称不能为空", trigger: "blur" }
        // ],
        // orderNum: [
        //   { required: true, message: "显示排序不能为空", trigger: "blur" }
        // ],
        // email: [
        //   {
        //     type: "email",
        //     message: "请输入正确的邮箱地址",
        //     trigger: ["blur", "change"]
        //   }
        // ],
        // phone: [
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
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      listDeptExtend(this.queryParams).then(response => {
        this.deptList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 上一级
    onLevel() {
      if (this.queryParams.departLevel == 1) {
        this.$modal.msgWarning("已经是最高单位！");
        return;
      }
      this.queryParams.departLevel = this.queryParams.departLevel - 1;
      this.getList();
    },
    inLevel() {
      this.queryParams.departLevel = this.queryParams.departLevel + 1;
      this.getList();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        codeType: null,
        parentCode: null,
        departCode: null,
        departName: null,
        shortName: null,
        shortSpell: null,
        markTail: null,
        departLevel: null,
        dutyUser: null,
        stationProperties: null,
        orgCode: null,
        orgName: null,
        companyCode: null,
        companyName: null,
        dutyCenter: null,
        dutyCenterName: null,
        fmisCostCenter: null,
        fmisCostCenterName: null,
        departmentCode: null,
        departmentName: null,
        saleCode: null,
        saleName: null,
        functionalScope: null,
        functionalScopeName: null,
        workStatus: null,
        usableDate: null,
        standardDepartCode: null,
        unusableDate: null,
        version: null,
        deleteStatus: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.departLevel = 1;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.deptId;
      }

      this.form.deptName = row.deptName;
      this.form.deptId = row.deptId;
      this.open = true;
      this.title = "添加部门详情";
      listDeptExtend().then(response => {
        // this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getDeptExtend(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改部门详情";
      });
      // listDeptExcludeChild(row.deptId).then(response => {
      //   this.deptOptions = this.handleTree(response.data, "deptId");
      // });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deptId != undefined) {
            updateDeptExtend(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDeptExtend(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除名称为"' + row.deptName + '"的数据项？').then(function () {
        return delDeptExtend(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },

    /** 下载导出按钮操作 */
    importTemplate() {
      this.download('system/depart/importTemplate', {
        ...this.queryParams
      }, `deptExtend_${new Date().getTime()}.xlsx`)
    },

    scorllLoad() {
      proxy.$message.success('加载下一页');
      deptList.value = deptList.value.concat(deptList.value);
    },

    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
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
