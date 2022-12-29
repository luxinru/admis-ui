<template>
  <!-- 选择资产目录 -->
  <el-dialog title="选择资产目录" v-model="visible" width="800px" top="5vh" @opened="getList" @close="destory" append-to-body>
    <el-row>
      <el-form :model="queryParams" ref="queryRef" :inline="true">
        <el-row>
          <el-col :span="8">
            <el-form-item label="目录编码" prop="assetsCode">
              <el-input
                  v-model="queryParams.assetsCode"
                  placeholder="请输入目录编码"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="目录名称" prop="assetsName">
              <el-input
                  v-model="queryParams.assetsName"
                  placeholder="请输入目录名称"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="目录类别" prop="codeType">
              <el-select v-model="queryParams.codeType" placeholder="目录类别" clearable style="width: 240px">
                <el-option v-for="dict in sys_means_type" :key="dict.value" :label="dict.label"
                           :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" icon="Top" @click="subCodeLevel">上级</el-button>
            <el-button icon="Bottom" @click="addCodeLevel">下级</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-row>

    <el-row>
      <el-table @row-click="clickRow" @row-dblclick="handleSelectAssetsContent" highlight-current-row ref="refTable" :data="assetsContentList" height="260px">
        <el-table-column label="目录编码" prop="assetsCode" :show-overflow-tooltip="true"/>
        <el-table-column label="目录名称" prop="assetsName" :show-overflow-tooltip="true"/>
        <el-table-column label="目录类型" align="center" key="status" >
          <template #default="scope">
            <dict-tag :options=sys_means_type :value="scope.row.codeType"/>
          </template>
        </el-table-column>
        <el-table-column label="目录级别" prop="codeLevel" align="center" :show-overflow-tooltip="true"/>
        <el-table-column label="是否明细" prop="markTail" align="center" :show-overflow-tooltip="true" >
          <template #default="scope">
            <dict-tag :options=sys_xn_yes_no :value="scope.row.markTail" />
          </template>
        </el-table-column>
        <el-table-column label="计量单位" prop="unitCode" align="center" :show-overflow-tooltip="true"/>
      </el-table>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSelectAssetsContent">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="SelectAssetsContengs">
import {listByLevel} from "@/api/system/asset";
//定义确定回调时间
const emit = defineEmits(['chooseAssetsContent'])
const { proxy } = getCurrentInstance();
const {sys_means_type, sys_xn_yes_no, sys_normal_disable} = proxy.useDict("sys_means_type", "sys_xn_yes_no", "sys_normal_disable");
//查询的数据级别
const codeLevel = ref(1);
//资产目录数据列表
const assetsContentList = ref([]);
//dialog是否可见
const visible = ref(false);
//总行数
const total = ref(0);
//用于获取当前选中行
const selectedData = ref();
const queryParams = reactive({
  codeLevel: undefined,
  codeType: undefined,
  parentCode: undefined,
  assetsCode: undefined,
  assetsName: undefined
});

// 显示弹框
function show() {
  visible.value = true;
}

/**选择行 */
function clickRow(row) {
  selectedData.value = row;
}

// 查询表数据
function getList() {
  queryParams.codeLevel = codeLevel;
  listByLevel(queryParams).then(res => {
    assetsContentList.value = res.rows;
    total.value = res.total;
    selectedData.value = undefined
  });
}

/**
 * 上级查询
 */
function subCodeLevel() {

  if(codeLevel.value === 1) {
    proxy.$modal.msgWarning("已经是最上级")
    return;
  }
  queryParams.parentCode = assetsContentList.value[0].assetsCode.substring(0, (codeLevel.value-2) * 2);
  codeLevel.value -= 1;
  queryParams.codeLevel = codeLevel.value
  getList()
}

/**
 * 下级查询
 */
function addCodeLevel() {
  if(selectedData.value === undefined) {
    proxy.$modal.msgWarning("请选择一条数据")
    return;
  }
  if(selectedData.value.markTail === '1') {
    proxy.$modal.msgWarning("已经是明细级")
    return;
  }
  queryParams.parentCode = selectedData.value.assetsCode;
  codeLevel.value += 1;
  queryParams.codeLevel = codeLevel.value
  getList()
}

/** 搜索按钮操作 */
function handleQuery() {
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 选择资产目录操作 */
function handleSelectAssetsContent() {
  if(selectedData.value.markTail !== '1') {
    console.log(selectedData.value.markTail)
    proxy.$modal.msgWarning("只能选择明细级资产目录")
    return;
  }
  if(selectedData.value.markTail === '1' && selectedData.value.assetsCode.toUpperCase().includes('FF')) {
    proxy.$modal.msgWarning("不可选择复合型资产目录")
    return;
  }

  emit('chooseAssetsContent', selectedData.value);
  //关闭窗口
  visible.value = false;
}

function destory() {
  selectedData.value = undefined;
  assetsContentList.value = [];
  queryParams.value = {
    codeLevel: undefined,
    codeType: undefined,
    parentCode: undefined,
    assetsCode: undefined,
    assetsName: undefined
  }

}

defineExpose({
  show,
});
</script>
