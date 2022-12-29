<template>
  <div class="app-container">

    <el-row :gutter="20">
      <!--左侧目录-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input v-model="assetsName" @input="onQueryChanged" placeholder="请输入目录名称" clearable prefix-icon="Search"
            style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree-v2 ref="treeRef" :data="assetOptions" :props=defaultProps :filter-method="filterMethod" :height="800"
          :default-expand-all="defaultExpand" v-if="treeOpen" v-loading="treeLoading"
          @node-click="handleNodeClick" />
        </div>
      </el-col>
      <!--资产目录表格-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryParams" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="目录类别" prop="codeType">
            <el-select v-model="queryParams.codeType" placeholder="目录类别" clearable style="width: 240px">
              <el-option v-for="dict in dict.sys_means_type" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="目录级别" prop="codeLevel">
            <el-input v-model="queryParams.codeLevel" placeholder="请输入目录级别" clearable style="width: 240px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="View" :disabled="single" @click="handleWatch">查看</el-button>
          </el-col>
<!--          <el-col :span="1.5">-->
<!--            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:asset:add']">新增-->
<!--            </el-button>-->
<!--          </el-col>-->
<!--          <el-col :span="1.5">-->
<!--            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"-->
<!--              v-hasPermi="['system:asset:edit']">修改</el-button>-->
<!--          </el-col>-->
<!--          <el-col :span="1.5">-->
<!--            <el-button type="danger" plain icon="Edit" :disabled="multiple" @click="handleDelete"-->
<!--              v-hasPermi="['system:asset:remove']">删除</el-button>-->
<!--          </el-col>-->
<!--          <el-col :span="1.5">-->
<!--            <el-button type="info" plain icon="Upload" @click="handleImport" v-hasPermi="['system:asset:import']">导入-->
<!--            </el-button>-->
<!--          </el-col>-->
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:asset:export']">
              导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="assetList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="目录类型" align="center" prop="codeType">
            <template #default="scope">
              <dict-tag :options=dict.sys_means_type :value="scope.row.codeType" />
            </template>
          </el-table-column>
          <el-table-column label="目录编号" align="center" key="assetsCode" prop="assetsCode"
            v-if="columns[0].visible" />
          <el-table-column label="目录名称" align="center" key="assetsName" prop="assetsName" v-if="columns[1].visible"
            :show-overflow-tooltip="true" />
          <el-table-column label="目录级别" align="center" key="codeLevel" prop="codeLevel" v-if="columns[3].visible"
            width="120" />
          <el-table-column label="父编码" align="center" key="parentCode" prop="parentCode"
            v-if="columns[2].visible" :show-overflow-tooltip="true" />
          <el-table-column label="是否明细" align="center" prop="markTail" v-if="columns[6].visible">
            <template #default="scope">
              <dict-tag :options=dict.sys_xn_yes_no :value="scope.row.markTail" />
            </template>
          </el-table-column>
          <el-table-column label="计量单位" align="center" key="unitCode" prop="unitCode" v-if="columns[7].visible"
            width="120" />

          <el-table-column label="状态" align="center" key="status" v-if="columns[8].visible">
            <template #default="scope">
              <dict-tag :options=dict.sys_normal_disable :value="scope.row.workStatus" />
            </template>
          </el-table-column>
          <!--  <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']">删除</el-button>
              <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)"
                v-hasPermi="['system:user:resetPwd', 'system:user:edit']">
                <span class="el-dropdown-link">
                  <i class="el-icon-d-arrow-right el-icon--right"></i>更多
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="handleResetPwd" icon="el-icon-key" v-hasPermi="['system:user:resetPwd']">
                    重置密码</el-dropdown-item>
                  <el-dropdown-item command="handleAuthRole" icon="el-icon-circle-check"
                    v-hasPermi="['system:user:edit']">分配角色</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column> -->
        </el-table>
        <!-- <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" @pagination="getList" /> -->

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>


    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="目录编码" prop="assetsCode">
              <el-input v-model="form.assetsCode" placeholder="请输入目录编码" maxlength="8" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目录名称" prop="assetsName">
              <el-input v-model="form.assetsName" placeholder="请输入目录名称" maxlength="30" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="父编码" prop="parentCode">
              <el-input v-model="form.parentCode" placeholder="自动生成父编码" maxlength="2" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父编码" prop="parentCode">
              <el-input v-model="form.parentCode" placeholder="自动生成父编码" maxlength="2" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="折旧年限" prop="parentCode">
              <el-input v-model="form.depreciateYear1" placeholder="请输入折旧年限" maxlength="2" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="残值率" prop="parentCode">
              <el-input v-model="form.scrapValue1" placeholder="请输入残值率" maxlength="2" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="目录类型">
              <el-select v-model="form.codeType" placeholder="请选择目录类型">
                <el-option v-for="dict in dict.sys_means_type" :key="dict.value" :label="dict.label"
                           :value="dict.value" readonly>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计量单位">
              <el-input v-model="form.unitCode" placeholder="请输入计量单位" maxlength="20" readonly/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.workStatus">
                <el-radio v-for="dict in dict.sys_normal_disable" :key="dict.value" :label="dict.value" readonly>
                  {{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="cancel">关闭</el-button>
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
            <div class="el-upload__tip" slot="tip">
              <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
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
</template>

<script>
import { assetselecttree, listAesst, getAesst, delAesst, addAesst, updateAesst, changeUserStatus } from "@/api/system/asset";
import { listDeptExtendTree } from "@/api/system/deptExtend";
import { getToken } from "@/utils/auth";
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";
import { ElTreeV2 } from 'element-plus'
import { ref } from "vue";
const assetOptions = ref([]);

export default {
  name: "Config",
  components: { Treeselect, ElTreeV2 },
  data() {
    return {
      defaultExpand: false,
      treeLoading: true,
      treeOpen: true,
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
      // 标准化,资产目录表表格数据
      assetList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层

      //树状搜索
      assetsName: undefined,
      open: false,
      dict: this.useDict("sys_means_type", "sys_data_level", "sys_xn_yes_no", "sys_normal_disable"),
      // 列信息
      columns: [
        { key: 0, label: `目录编号`, visible: true },
        { key: 1, label: `目录名称`, visible: true },
        { key: 2, label: `目录级别`, visible: true },
        { key: 3, label: `父编码`, visible: true },
        { key: 4, label: `单位编码`, visible: true },
        { key: 5, label: `单位名称`, visible: true },
        { key: 6, label: `是否明细`, visible: true },
        { key: 7, label: `计量单位`, visible: true },
        { key: 8, label: `状态`, visible: true },
        { key: 9, label: `创建时间`, visible: true }
      ],
      //下拉数据
      deptExtendTreeList: [],
      // 目录树选项

      deptOptions: undefined,
      assetOptions: [],
      defaultProps: {
        value:"assetsCode",
        label: "assetsName"
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
        url: import.meta.env.VITE_APP_BASE_API + "/system/asset/importData"
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        codeType: null,
        assetsCode: null,
        assetsName: null,
        contentsGroupCode: null,
        parentCode: null,
        codeLevel: null,
        markTail: null,
        unitCode: null,
        partDepartCode: null,
        departCode: null,
        departName: null,
        workStatus: null,
        usableDate: null,
        unusableDate: null,
        dataLevel: null,
        version: null,
        sysModifyTime: null,
        deleteStatus: null
      },

      // 表单参数
      form: {},
      // 表单校验
      rules: {
        assetsCode: [
          {required: true, message: "资产目录编码不能为空", trigger: "blur"},
          {validator: (rule, value, callback) => this.checkLength(rule, value, callback), trigger: 'blur' },
          {validator: (rule, value, callback) => this.checkLength(rule, value, callback), trigger: 'blur' }
        ],
        assetsName: [
          {required: true, message: "资产目录名称不能为空", trigger: "blur"},
        ]

      }
    };
  },

  created() {
    this.getList();
    this.getTreeselect();
  },
  filters: {

  },
  methods: {

    onQueryChanged(assetsName) {
      // TODO: fix typing when refactor tree-v2
      // eslint-disable-next-line @typescript-eslint/ban-ts-commen
      // @ts-expect-error
      if (assetsName == "") {
        this.defaultExpand = !this.defaultExpand;
        this.treeOpen = false;
        setTimeout(() => {
          this.treeOpen = true;
        }, 10);
      } else {
        if (assetsName != null) {
          this.$refs.treeRef.filter(assetsName)

        }
      }
    },

    filterMethod(assetsName, node) {
      if (!assetsName) return true;
      return (node.assetsName.indexOf(assetsName) !== -1);
      return true;
    },

    checkLength(rule, value, callback) {
      if (value === '') {
        this.form.parentCode = null;
        this.form.codeLevel = null;
        callback(new Error('请输入目录编码'))
        return false;
      } else if (value.length % 2 == 1) {
        this.form.parentCode = null;
        this.form.codeLevel = null;
        callback(new Error("输入非法，请输入偶数位数编码"))
        return false;
      } else {
        this.form.parentCode = value.substring(0, value.length -2);
        this.form.codeLevel = value.length / 2;
        callback()
      }
    },

    getDeptExtendTree() {
      listDeptExtendTree().then(response => {
        this.deptExtendTreeList = response.data;

      })
    },
    /** 查询标准化,资产目录表列表 */
    getList() {
      this.loading = true;
      listAesst(this.queryParams).then(response => {
        this.assetList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getdeptTreeselect() {
      listDeptExtendTree().then(response => {
        this.deptExtendTreeList = response.data;
      })
    },
    getTreeselect() {
      this.treeLoading = true;
      assetselecttree().then(response => {
        this.assetOptions = response.data;
        this.$nextTick(() => {
          this.treeLoading = false
        })
      });

    },

    // 状态修改
    handleStatusChange(row) {
      // let text = row.status === "0" ? "启用" : "停用";
      // this.$modal.confirm('确认要"' + text + '""' + row.assetsName + '"吗？').then(function () {
      //   return changeUserStatus(row.id, row.workStatus);
      // }).then(() => {
      //   this.$modal.msgSuccess(text + "成功");
      // }).catch(function () {
      //   row.status = row.status === "0" ? "1" : "0";
      // });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      // this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        codeType: null,
        assetsCode: null,
        assetsName: null,
        contentsGroupCode: null,
        parentCode: null,
        codeLevel: null,
        markTail: null,
        unitCode: null,
        partDepartCode: null,
        departCode: null,
        departName: null,
        workStatus: '0',
        usableDate: null,
        unusableDate: null,
        dataLevel: null,
        version: null,
        sysModifyTime: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        remark: null,
        deleteStatus: 0
      };
      this.resetForm("form");
    },

    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.assetsName.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.parentCode = data.assetsCode;
      this.handleQuery();
    },


    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.parentCode = null;
      this.getTreeselect();
      this.resetForm("queryParams");
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
      this.title = "添加标准化,资产目录表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAesst(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改标准化,资产目录表";
      });
    },
    /** 查看按钮操作 */
    handleWatch(row) {
      this.reset();
      const id = row.id || this.ids
      getAesst(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改标准化,资产目录表";
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/asset/export', {
        ...this.queryParams
      }, `asset_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('system/asset/importTemplate', {
      }, `asset_template_${new Date().getTime()}.xlsx`)
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
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAesst(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAesst(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除标准化,资产目录表编号为"' + ids + '"的数据项？').then(function () {
        return delAesst(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },

  }
};
</script>
