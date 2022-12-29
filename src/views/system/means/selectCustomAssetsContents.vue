<template>
  <!-- 选择自定义资产目录 -->
  <el-dialog title="选择资产目录" v-model="visible" width="1100px" top="5vh" @opened="getList" @close="destory"
             append-to-body>
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
            <el-form-item label="自定义目录名称" prop="customContentsName">
              <el-input
                  v-model="queryParams.customContentsName"
                  placeholder="请输入自定义目录名称"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="目录类别" prop="codeType">
              <el-select v-model="queryParams.codeType" placeholder="目录类别" clearable style="width: 240px">
                <el-option v-for="dict in sys_means_type" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
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
    <!--    表格区域-->
    <el-row>
      <el-table v-loading="loading" @row-click="clickRow" @row-dblclick="handleSelectAssetsContent" highlight-current-row ref="refTable"
                :data="assetsContentList" height="360px">
        <el-table-column label="复合型资产名称" prop="topContent" :show-overflow-tooltip="true"/>
        <el-table-column label="系统架构" prop="secondaryContent" :show-overflow-tooltip="true"/>
        <el-table-column label="目录编码" prop="assetsCode" :show-overflow-tooltip="true"/>
        <el-table-column label="目录名称" prop="assetsName" :show-overflow-tooltip="true"/>
        <el-table-column label="自定义目录名称" prop="customContentsName" :show-overflow-tooltip="true"/>
        <el-table-column label="折旧年限" prop="d" :show-overflow-tooltip="true"/>
        <el-table-column label="目录类型" align="center" key="status">
          <template #default="scope">
            <dict-tag :options=sys_means_type :value="scope.row.codeType"/>
          </template>
        </el-table-column>
        <el-table-column label="目录级别" prop="codeLevel" align="center" :show-overflow-tooltip="true"/>
        <el-table-column label="是否明细" prop="markTail" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            <dict-tag :options=sys_xn_yes_no :value="scope.row.markTail"/>
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
import {listLevelCustomContents} from "@/api/system/CustomContents";
import {ref} from "@vue/runtime-core";
//定义确定回调事件
const emit = defineEmits(['chooseCustomAssetsContent'])
const {proxy} = getCurrentInstance();
const {
  sys_means_type,
  sys_xn_yes_no,
  sys_normal_disable
} = proxy.useDict("sys_means_type", "sys_xn_yes_no", "sys_normal_disable");
//查询的数据级别
const codeLevel = ref(1);
const assetsContentList = ref([]);
const visible = ref(false);
const total = ref(0);
// 遮罩层
const loading = ref(true);
const selectedData = ref();
const queryParams = reactive({
  codeLevel: undefined,
  codeType: undefined,
  parentCode: undefined,
  contentsCode: undefined,
  customContentsName: undefined,
  markTail: undefined
});
const props = defineProps({
  customContentsName: String
})
/**
 * 资产类型与目录类别的对照关系
 */
const assetsTypeMapping = {
  "0101": "1", "0102": "1", "0103": "1", "0401": "1",
  "0402": "1", "0501": "1", "0201": "2", "0403": "2", "0301": "3",
}


/**
 * 打开资产目录对照弹窗，可以通过参数过滤查询数据
 * @param customContentsName 资产目录对照
 * @param asstesType 资产类型，非必须，不需要可以不传
 */
function show(customContentsName, asstesType) {
  visible.value = true;
  queryParams.customContentsName = customContentsName;
  if (asstesType) {
    queryParams.codeType = assetsTypeMapping[asstesType];
  }
}

/**选择行 */
function clickRow(row) {
  selectedData.value = row;
}

// 查询表数据
function getList() {
  loading.value = true;
  //如果自定义名称有值，则不再通过级别去过滤
  if (queryParams.customContentsName) {
    queryParams.codeLevel = undefined;
    queryParams.markTail = "1";
  } else {
    queryParams.codeLevel = codeLevel;
  }
  listLevelCustomContents(queryParams).then(res => {
    loading.value = false;
    assetsContentList.value = res.rows;
    total.value = res.total;
    selectedData.value = undefined
  });
}

/**
 * 上级查询
 */
function subCodeLevel() {

  if (codeLevel.value === 1) {
    proxy.$modal.msgWarning("已经是最上级")
    return;
  }
  queryParams.customContentsName = undefined;
  queryParams.codeType = undefined;
  if (assetsContentList.value[0]) {
    queryParams.parentCode = assetsContentList.value[0].assetsCode.substring(0, (codeLevel.value - 2) * 2);
  }
  codeLevel.value -= 1;
  queryParams.codeLevel = codeLevel.value
  getList()
}

/**
 * 下级查询
 */
function addCodeLevel() {
  if (selectedData.value === undefined) {
    proxy.$modal.msgWarning("请选择一条数据")
    return;
  }
  if (selectedData.value.markTail === '1') {
    proxy.$modal.msgWarning("已经是明细级")
    return;
  }
  queryParams.parentCode = selectedData.value.contentsCode;
  queryParams.codeType = selectedData.value.codeType;
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
  codeLevel.value = 1;
  handleQuery();
}

/** 选择资产目录操作 */
function handleSelectAssetsContent() {
  let assentsContent = selectedData.value;
  console.log(assentsContent)
  if (assentsContent.markTail !== "1") {
    proxy.$modal.msgWarning("请选择明细级资产目录")
    return;
  }
  if (assentsContent.assetsCode.indexOf("FF") !== -1) {
    proxy.$modal.msgWarning("明细资产新增，不可选择复合型资产目录")
    return;
  }
  if (assentsContent.depreciateYear === undefined || assentsContent.depreciateYear <= 0) {
    proxy.$modal.msgWarning("选中的资产目录没有折旧年限，不能选择，请检查资产目录配置是否正确")
    return;
  }
  emit('chooseCustomAssetsContent', selectedData.value);
  //关闭窗口
  visible.value = false;
}

function destory() {
  selectedData.value = undefined;
  assetsContentList.value = [];
  codeLevel.value = 1;
  queryParams.value = {
    codeLevel: undefined,
    codeType: undefined,
    parentCode: undefined,
    contentsCode: undefined,
    customContentsName: undefined
  }

}

defineExpose({
  show,
});
</script>
