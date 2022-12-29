<template #default="scope">
  <div class="app-main-content">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Check"
            @click="checkAssets"
        >选资产
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Edit" :disabled="single" @click="handleUpdate"
                   v-hasPermi="['assets:add:apply:invoice:edit']">修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete"
                   @click="handleDelete">删除
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table v-loading="loading" :data="invoiceList" @selection-change="handleSelectionChange"
                :height="height" :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="宗地编号" align="center" prop="parcelCode" width="155"/>
        <el-table-column label="地理位置(省市县)" align="center" prop="assetsName" width="150" :show-overflow-tooltip="true">
          <template #default="scope">
            <span class="cell-slot">{{ scope.row.province }} - {{ scope.row.city }} - {{ scope.row.county }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权属状况" align="center" prop="ownershipConditionName" width="125"
                         :show-overflow-tooltip="true"/>
        <el-table-column label="使用权类型" align="center" prop="usedrightTypeName" width="125"
                         :show-overflow-tooltip="true"/>
        <el-table-column label="土地面积（平方米）" align="center" prop="landArea" width="150"/>
        <el-table-column label="土地证号" align="center" prop="landCertificateNo" width="220"
                         :show-overflow-tooltip="true"/>
        <el-table-column label="土地使用权人" align="center" prop="landUsedHolder" width="125" :show-overflow-tooltip="true"/>
        <el-table-column label="房产证号" align="center" prop="houseCertificateNo" width="125"
                         :show-overflow-tooltip="true"/>
        <el-table-column label="证载所有权人" align="center" prop="certificateHolder" width="125"
                         :show-overflow-tooltip="true"/>
        <el-table-column label="无证原因" align="center" prop="noCertificateReason" width="125"
                         :show-overflow-tooltip="true"/>
        <el-table-column label="建筑面积" align="center" prop="buildArea" width="125"/>
        <el-table-column label="公有房屋面积" align="center" prop="publicHouseArea" width="155">
        </el-table-column>
        <el-table-column label="实际用途" align="center" prop="actualUsedName" width="155" :show-overflow-tooltip="true">
        </el-table-column>
      </el-table>
    </el-row>
    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
                 :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
                 :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport"/>
              是否更新已经存在的用户数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                     @click="importTemplate">下载模板
            </el-link>
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
    <!--新增及修改房屋资产卡片弹窗组件-->
    <house-refine-card-assets ref="cardAssetsForm" @saveSubmitForm="saveSubmitForm"/>
    <!--选主资产弹窗-->
    <choose-assets :show="show" @get:data="getData" @update:show="updateShow" :dieAway="house"/>
  </div>
</template>
<style>

</style>
<script setup>
import {
  getHouseRefineDetail,
  updateHouseRefineDeatil,
  updateManyHouseRefineDeatil
} from "@/api/assets/house/change/detail";
import chooseAssets from "@/views/account/choose/choiceDetail";// 选资产弹窗组件
import houseRefineCardAssets from '@/components/assets/index'; // 资产信息新增卡片弹窗
import {onMounted} from "@vue/runtime-core";
import {ElTreeV2} from 'element-plus'
import {Base64} from "js-base64";

const {proxy} = getCurrentInstance();
import {getToken} from "@/utils/auth";

/**
 * =============初始化字段=============
 */
// 遮罩层
const loading = ref(true);
// 选中数组
const ids = ref([]);
// 选中数组
const codes = ref([]);
// 选中数组(编号)
const number = ref([]);
// 非单个禁用
const single = ref(true);
// 非多个禁用
const multiple = ref(true);
// 显示搜索条件
const showSearch = ref(true);
// 系统工作日期
const sysWorkDate = ref(null);
// 筛选弹窗
const screeningOpen = ref(false);
// 总条数
const total = ref(0);
// 资产单据表格数据
const invoiceList = ref([]);
// 是否显示弹出层
const open = ref(false);
// 单位弹窗
const deptdailogSign = ref(false);
//高度
const height = ref(408);
// 选资产弹窗
const chooseAssetsRef = ref();
// 打开资产信息卡片 -- 房屋卡片
const cardAssetsForm = ref();
// 选资产弹窗开关
const show = ref(false);
const house = ref("house");
// 查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 20,
  dataFilter: null
});
getList();
// 表单参数
const form = ref({});

function tableRowClassName({rowIndex}) {
  if (rowIndex % 2 == 0) {
    return '';
  } else {
    return 'row-even-bg';
  }
}

/** 查询资产单据列表 */
function getList() {
  loading.value = false;
}

// 选资产事件
function checkAssets() {
  show.value = true;
}

// 选资产弹窗确认保存事件回调
function getData(data) {
  // let dataList = data.houseList;
  invoiceList.value = data.houseList;
  // 循环遍历选中的资产，进行判断，是否允许做房屋细化；目前判断逻辑为：①资产大类为16；②资产中的房屋细化信息必须有数据
  // for (let i = 0; i < dataList.length; i++) {
  //     invoiceList.value.push( {
  //        "assetsCode":dataList[i].assetsCode
  //        ,"assetsName":dataList[i].assetsName
  //        ,"assetsTypeName":dataList[i].assetsTypeName
  //        ,"contentAssetsName":dataList[i].contentAssetsName
  //        ,"assetsStandard":dataList[i].assetsStandard
  //        ,"departName":dataList[i].departName
  //        ,"ownershipConditionName":dataList[i].ownershipConditionName
  //        ,"usedrightTypeName":dataList[i].usedrightTypeName
  //        ,"landArea":dataList[i].landArea
  //        ,"landCertificateNo":dataList[i].landCertificateNo
  //        ,"houseCertificateNo":dataList[i].houseCertificateNo
  //        ,"keyCode":dataList[i].keyCode
  //        ,"id":dataList[i].id
  //        });
  // }
}

// 选资产弹窗回调父页面，关闭弹窗
function updateShow(data) {
  if (show.value === true) {
    show.value = data
  }
}

function handleDelete() {
  ids.value.forEach(item => {
    const currIndex = invoiceList.value.findIndex((subItem) => {
      return item === subItem.id
    })
    invoiceList.value.splice(currIndex, 1)
  });
}

/** 修改房屋卡片按钮操作 */
function handleUpdate(row) {
  const id = row.id || ids.value
  if (id != "") {
    const mapFormData = new Map();
    getHouseRefineDetail(id).then(response => {
      mapFormData.set("houseOpenFormData", response.data);
      cardAssetsForm.value.updateOpen(mapFormData, "房屋修改卡片", false, false, false, true, false);
    });
  }
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  codes.value = selection.map(item => item.keyCode)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

// 卡片保存，子页面回调函数
function saveSubmitForm(arrForm) {
  const id = ids.value
  if (null != arrForm.get("houseOpenFormData") && arrForm.get("houseOpenFormData").id != undefined) {
    updateHouseRefineDeatil(arrForm.get("houseOpenFormData")).then(response => {
      proxy.$modal.msgSuccess("修改房屋信息成功");
    });
  } else {
    updateManyHouseRefineDeatil(arrForm.get("houseOpenFormData"), id).then(response => {
      proxy.$modal.msgSuccess("批量替换房屋信息成功");
    });
  }
}

/** 新增房屋卡片按钮操作 */
function handleAllUpdate(row) {
  const id = row.id || ids.value
  if (id != "") {
    cardAssetsForm.value.addOpen("", "房屋新增卡片", false, false, false, true);
  }
}

function handleImport() {
  upload.title = "房屋变更导入";
  upload.open = true;
};

/** 下载模板操作 */
function importTemplate() {
  proxy.download("assets/house/change/detail/importTemplate", {
    "1": "1"
  }, `well_template_${new Date().getTime()}.xlsx`);
};
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "assets/house/query/importData"
});
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};

</script>
