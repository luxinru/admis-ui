<template>
  <div class="app-main-content">
    <!--单据表单及主资产部分页面-->
    <div class="div-editor-container-grey">
      <!--单据表单-->
      <div class="table-box">
        <!--检索条件-->
        <el-form :model="assetsPageQueryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="资产编号" prop="assetsCode">
            <el-input
                v-model="assetsPageQueryParams.assetsCode"
                placeholder="请输入资产编号"
                clearable
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="block-divider" v-if="showSearch"></div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
                type="primary"
                plain
                icon="View"
                :disabled="viewAssetsButton"
                @click="viewAssetsInfo"
            >查看
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="assetsGetList"></right-toolbar>
        </el-row>
        <!--主资产表格-->
        <el-table v-loading="assetsLoading" :data="assetsList" @selection-change="assetsHandleSelectionChange"
                  :height="height" :row-class-name="tableRowClassName">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="单据编码" align="center" prop="invoiceNumber" width="220"/>
          <el-table-column label="资产编码" align="center" prop="assetsCode"/>
          <el-table-column label="资产名称" align="center" prop="assetsName" width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="资产类型" align="center" prop="assetsTypeName"/>
          <el-table-column label="所属单位" align="center" prop="departName" width="220" :show-overflow-tooltip="true"/>
          <el-table-column label="备注" align="center" prop="remark" width="160" :show-overflow-tooltip="true"/>
        </el-table>
        <pagination
            v-show="assetsTotal > 0"
            :total="assetsTotal"
            v-model:page="assetsPageQueryParams.pageNum"
            v-model:limit="assetsPageQueryParams.pageSize"
            @pagination="assetsGetList"
        />
      </div>
    </div>
    <!-- 查看资产卡片 -->
    <card-assets ref="cardAssetsForm"/>
  </div>
</template>

<script setup>
import {getAssetsGetList} from "@/api/assets/house/repair/detail";
import CardAssets from '@/components/assets/index'; // 资产查看卡片显示
// 定义router，用于获取父页面传递过来的参数
import {useRoute} from 'vue-router';
// 打开资产信息卡片
const cardAssetsForm = ref();
const selectRow = ref([]);
//高度
const height = ref(408);
const {proxy} = getCurrentInstance();

// -----------------最上方单据表单变量定义---------------------
// 是否展示查询条件
const showSearch = ref(true);
// 获取父页面传递过来的参数
const route = useRoute();
const parentInvoiceNumber = ref(route.query.invoiceNumber);
// 定义表单数据
const invoiceData = reactive({
  assetsQueryParams: {
    pageNum: 1,
    pageSize: 10,
    invoiceNumber: null
  }
});
const {assetsQueryParams} = toRefs(invoiceData);

// -----------------中间部分变量定义-------------
// 查看按钮显隐控制
const viewAssetsButton = ref(true);
// loading加载
const assetsLoading = ref(true);
// 分页初始条数
const assetsTotal = ref(0);
// 分页列表数据
const assetsList = ref([]);
// 定义分页查询数据
const assetsData = reactive({
  assetsPageQueryParams: {
    pageNum: 1,
    pageSize: 10,
    invoiceNumber: parentInvoiceNumber.value == "" ? "xz" : parentInvoiceNumber.value,
    assetsCode: null
  }
});
const {assetsPageQueryParams} = toRefs(assetsData);
const assetsPkIds = ref([]);
// ---------------中间部分关联主资产相关脚本---------------
// 查看按钮触发事件
function viewAssetsInfo() {
  const mapFormData = new Map();
  mapFormData.set("houseOpenFormData", selectRow.value[0]);
  cardAssetsForm.value.viewOpen(mapFormData, "资产卡片", true, true, true, true, true);
}

// 查询列表数据
function assetsGetList() {
  assetsLoading.value = true;
  getAssetsGetList(assetsPageQueryParams.value).then(response => {
    assetsList.value = response.rows;
    assetsTotal.value = response.total;
    assetsLoading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  assetsGetList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 表格checkBox选中行事件
function assetsHandleSelectionChange(selection) {
  // 将detail表的id作为pkid
  assetsPkIds.value = selection.map(item => item.id);
  viewAssetsButton.value = selection.length != 1;
  selectRow.value = selection;
}
function tableRowClassName({ rowIndex }){
  if (rowIndex % 2 == 0) {
    return '';
  } else {
    return 'row-even-bg';
  }
}
const single = ref(true);
const multiple = ref(true);

assetsGetList();
</script>
