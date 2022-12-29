<template>
  <div class="app-main-content">
    <el-form :model="refineQueryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="69px">
      <el-form-item label="资产类别编码" prop="contentAssetsCode">
        <el-input v-model="refineQueryParams.contentAssetsCode" @keyup.enter="handleQuery" style="width: 220px"
                  clearable
                  placeholder="请输入资产类别编号"/>
      </el-form-item>
      <el-form-item label="规格型号" prop="assetsStandard">
        <el-input v-model="refineQueryParams.assetsStandard" @keyup.enter="handleQuery" style="width: 220px" clearable
                  placeholder="请输入规格型号"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <!--<el-button type="primary" icon="Filter">筛选</el-button>-->
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="block-divider"></div>
    <!--实物核对明細页面-->
    <div class="div-editor-container-grey">
      <div class="table-box">
        <!--按钮操作部分-->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Upload" :disabled="single"
                       @click="openAttachPage">附件
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Upload" :disabled="single"
                       @click="openPicPage">上传实物图片
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="detailList"></right-toolbar>
        </el-row>

        <!--明细表格-->
        <el-table v-loading="loading" :data="refineList" @selection-change="handleSelectionChange"
                  :height="height" :row-class-name="tableRowClassName">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="资产名称" align="center" prop="assetsName" width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="资产类别" align="center" prop="contentAssetsCode"/>
          <el-table-column label="规格型号" align="center" prop="assetsStandard"/>
          <el-table-column label="出厂日期" align="center" prop="productDate"/>
          <el-table-column label="使用单位" align="center" prop="useDepartName" width="160" :show-overflow-tooltip="true"/>
          <el-table-column label="计量单位" align="center" prop="unitCodeName"/>
          <el-table-column label="计量数量" align="center" prop="singleAmount"/>
          <el-table-column label="复合数量" align="center" prop="charItem5"/>
          <el-table-column label="是否相符" align="center" width="100">
            <template #default="scope">
              <el-switch
                      v-model="scope.row.realCheckResult"
                      :active-value="0"
                      :inactive-value="1"
                      @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" width="160" :show-overflow-tooltip="true"/>
        </el-table>
        <pagination v-show="refineTotal > 0" :total="refineTotal" v-model:page="refineQueryParams.pageNum"
                    v-model:limit="refineQueryParams.pageSize" @pagination="detailList"/>
      </div>

    </div>

    <!-- 卡片弹窗 -->
    <uploadPic-page ref="uploadPic" @handleUploadPic="handleUploadPic"/>
  </div>
</template>

<script setup name="realCheck">
// 引入单据操作方法
import {listInvoice, getInvoice, checkInvoice} from "@/api/value/add/realCheck/invoice/invoice";
// 引入明细操作方法
import {listDetail, getDetail, changeCheckStatus,checkImgCount} from "@/api/value/add/realCheck/detail/detail";
import uploadPicPage from "@/views/value/add/realCheck/uploadPic";

import {ElMessage} from 'element-plus';
import {useRoute} from 'vue-router';

const {proxy} = getCurrentInstance();
const open = ref(false);
// 打开图片卡片
const uploadPic = ref();
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const number = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
//高度
const height = ref(408);
// loading加载
const refineLoading = ref(true);
// 分页初始条数
const refineTotal = ref(0);
// 分页列表数据
const refineList = ref([]);
const busType="realCheck";

// 获取父页面传递过来的参数

const route = useRoute();

// 获取单据编号
const parentInvoiceNumber = ref(route.query.invoiceNumber);


/** 明细区域函数 start */

// 定义分页查询数据
const refineData = reactive({
  refineQueryParams: {
    pageNum: 1,
    pageSize: 10,
    invoiceNumber: parentInvoiceNumber.value == "" ? "xz" : parentInvoiceNumber.value,
    contentAssetsCode: null,
    assetsStandard: null
  }
});
const {refineQueryParams} = toRefs(refineData);

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 搜索按钮操作 */
function handleQuery() {
  refineQueryParams.value.pageNum = 1;
  detailList();
}


/** 打开附件窗口 */
function openAttachPage() {
  const keycode = number.value[0];
  const tableName = 'adp_varassetsdetail_add';
  $refs.attach.show(keycode, tableName);
}


/** 是否相符修改 */
function handleStatusChange(row) {
  const keyCode = row.keyCode;
  const invoiceNumber = parentInvoiceNumber.value == "" ? "xz" : parentInvoiceNumber.value;
  checkImgCount(busType,invoiceNumber,keyCode).then(response => {
    if(response.code!=200){
      proxy.$modal.msgSuccess(response.msg);
    }else{
      let text = row.realCheckResult === 0 ? "相符" : "不相符";
      proxy.$modal.confirm('确认照片与"' + row.assetsName + '"的资产"' + text + '"吗?').then(function () {
        return changeCheckStatus(row.keyCode, row.id, row.realCheckResult);
      }).then(() => {
        proxy.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.realCheckResult = row.realCheckResult === 1 ? 0 : 1;
      });
    }

  }).catch(function () {
    row.realCheckResult = row.realCheckResult === 1 ? 0 : 1;
  });


}

/**
 * 查询核对明细数据
 */
function detailList() {
  loading.value = true;
  refineQueryParams.value.invoiceNumber = parentInvoiceNumber.value == "" ? "xz" : parentInvoiceNumber.value;
  listDetail(refineQueryParams.value).then(response => {
    refineList.value = response.rows;
    refineTotal.value = response.total;
    loading.value = false;
  });
}

/**
 * 明细数据，表格checkBox选中行事件
 * @param {*} selection 选中内容
 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
  number.value = selection.map(item => item.keyCode)
}


/** 明细区域函数 end */

function tableRowClassName({rowIndex}) {
  if (rowIndex % 2 == 0) {
    return '';
  } else {
    return 'row-even-bg';
  }
}

detailList();


/** 图片上传 */
function openPicPage() {
  const keyCode = number.value[0];
  const invoiceNumber = parentInvoiceNumber.value == "" ? "xz" : parentInvoiceNumber.value;
  uploadPic.value.show("图片上传",busType,keyCode,invoiceNumber);
}

function handleUploadPic(flag, reason) {


}
</script>
