<template>
  <div class="app-main-content">
    <el-form :model="refineQueryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="资产类别编码" prop="contentAssetsCode">
        <el-input v-model="refineQueryParams.contentAssetsCode" @keyup.enter="handleQuery" style="width: 220px"
          clearable placeholder="请输入资产类别编号" />
      </el-form-item>
      <el-form-item label="规格型号" prop="assetsStandard">
        <el-input v-model="refineQueryParams.assetsStandard" @keyup.enter="handleQuery" style="width: 220px" clearable
          placeholder="请输入规格型号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <!--<el-button type="primary" icon="Filter">筛选</el-button>-->
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="block-divider" v-if="showSearch"></div>
    <!--造价核对明細页面-->
    <div class="div-editor-container-grey">
      <div class="table-box">
        <!--按钮操作部分-->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Upload" :disabled="single" @click="openAttachPage">附件</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Filter" :disabled="single" @click="openSharePage">分摊</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="detailList"></right-toolbar>
        </el-row>

        <!--明细表格-->
        <el-table v-loading="loading" :data="refineList" @selection-change="handleSelectionChange" :height="height" :row-class-name="tableRowClassName">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="资产名称" align="center" prop="assetsName" width="200" :show-overflow-tooltip="true"/>
          <el-table-column label="资产类别" align="center" prop="contentAssetsCode" />
          <el-table-column label="规格型号" align="center" prop="assetsStandard" />
          <el-table-column label="出厂日期" align="center" prop="productDate" />
          <el-table-column label="使用单位" align="center" prop="useDepartName" width="200" :show-overflow-tooltip="true" />
          <el-table-column label="计量单位" align="center" prop="unitCodeName" />
          <el-table-column label="数量" align="center" prop="singleAmount" />
          <el-table-column label="复合数量" align="center" prop="charItem5" />
          <el-table-column label="建筑安装费" align="center" prop="installationCost" />
          <el-table-column label="工程建设其他费用" align="center" prop="otherCost" />
          <el-table-column label="备注" align="center" prop="remark" width="160" :show-overflow-tooltip="true" />
        </el-table>
        <pagination v-show="refineTotal > 0" :total="refineTotal" v-model:page="refineQueryParams.pageNum"
          v-model:limit="refineQueryParams.pageSize" @pagination="detailList" />
      </div>

    </div>
    <!--分摊弹窗区域-->
    <el-dialog :title="title" v-model="open" width="800px" top="5vh" append-to-body>
      <div class="div-editor-container-grey">
        <div class="table-box">
          <el-form ref="detailShareRef" :model="shareForm" :rules="shareRules" label-width="150px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="分摊方式" prop="shareModeCost">
                  <el-select v-model="shareForm.shareModeCost" placeholder="请选择分摊方式" style="width:240px;"
                    @change="shareModeCostChange">
                    <el-option v-for="item in shareModeCostOption" :key="item.value" :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="分摊对象" prop="shareObjectCost">
                  <el-select v-model="shareForm.shareObjectCost" placeholder="请选择分摊对象" style="width:240px;"
                    @change="shareObjectCostChange">
                    <el-option v-for="item in shareObjectCostOption" :key="item.value" :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="分摊金额" prop="shareCost" v-show="shareCostFlag">
                  <el-input placeholder="请输入分摊金额" v-model="shareForm.shareCost" maxlength="15" type="number"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="table-box">
          <el-table v-loading="loading" :data="selectDetails" :height="height" :row-class-name="tableRowClassName">
            <el-table-column label="资产名称" align="center" prop="assetsName" width="200" :show-overflow-tooltip="true" />
            <el-table-column label="资产类别" align="center" prop="contentAssetsCode" />
            <el-table-column label="规格型号" align="center" prop="assetsStandard" />
            <el-table-column label="出厂日期" align="center" prop="productDate" />
            <el-table-column label="使用单位" align="center" prop="useDepartName" width="200" :show-overflow-tooltip="true"/>
            <el-table-column label="计量单位" align="center" prop="unitCodeName" />
            <el-table-column label="计量数量" align="center" prop="singleAmount" />
            <el-table-column label="复合数量" align="center" prop="charItem5" />
            <el-table-column label="分摊比例" align="center" width="100" v-if="shareRatioFlag">
              <template #default="scope">
                <el-input placeholder="请输入分摊比例" v-model="scope.row.shareRatio" maxlength="4" type="number"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="建筑安装费" align="center" width="100" v-if="installationCostFlag">
              <template #default="scope">
                <el-input placeholder="请输入建筑安装费" v-model="scope.row.installationCost" maxlength="15"
                  type="number"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="工程建设其他费用" align="center" width="100" v-if="otherCostFlag">
              <template #default="scope">
                <el-input placeholder="请输入工程建设其他费用" v-model="scope.row.otherCost" maxlength="15"
                  type="number"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark" width="160" :show-overflow-tooltip="true" />
          </el-table>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitShareForm()">提 交</el-button>
          <el-button @click="closeShareForm()">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="buildCostCheck">
// 引入单据操作方法
import { listInvoice, getInvoice, checkInvoice } from "@/api/value/add/buildCostCheck/invoice/invoice";
// 引入明细操作方法
import { listDetail, updateDetail } from "@/api/value/add/buildCostCheck/detail/detail";
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';

const { proxy } = getCurrentInstance();
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const selectDetails = ref([]);
const number = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
// 高度
const height = ref(408);
// loading加载
const refineLoading = ref(true);
// 分页初始条数
const refineTotal = ref(0);
// 分页列表数据
const refineList = ref([]);

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
const { refineQueryParams } = toRefs(refineData);

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
  selectDetails.value = selection;
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
  number.value = selection.map(item => item.invoiceNumber)
}


/** 明细区域函数 end */

/** 分摊区域函数 start */
//分摊总金额显隐控制
const shareCostFlag = ref(false);
//分摊比例显隐控制
const shareRatioFlag = ref(false);
//建筑安装费显隐控制
const installationCostFlag = ref(false);
//工程建设其他费用显隐控制
const otherCostFlag = ref(false);

const shareData = reactive({
  shareForm: {},
  shareRules: {
    shareModeCost: [
      { required: true, message: "分摊方式不能为空", trigger: "blur" }
    ],
    shareObjectCost: [
      { required: true, message: "分摊对象不能为空", trigger: "blur" }
    ],
    shareCost: [
      { required: shareCostFlag, message: "分摊金额不能为空", trigger: "blur" }
    ]
  }
});

const { shareForm, shareRules } = toRefs(shareData);


// 分摊方式
let shareModeCostOption = reactive([
  {
    value: '1',
    label: '价值分摊'
  }, {
    value: '2',
    label: '平均分摊'
  }, {
    value: '3',
    label: '手工分摊'
  }
]);
// 分摊对象
let shareObjectCostOption = reactive([
  {
    value: '1',
    label: '建筑安装费'
  }, {
    value: '2',
    label: '工程建设其他'
  }
]);

/**
 * 分摊按钮操作
 */
function openSharePage() {
  //无选中行情况提示是否操作当前页全部行
  if (!selectDetails.value.length) {
    proxy.$modal.confirm('确认操作当前页全部明细吗?').then(function () {
      proxy.resetForm("detailShareRef");
      //resetDetail();
      selectDetails.value = refineList;
      open.value = true;
      title.value = "价值分摊";
    }).then(() => { }).catch(function () { });
  } else {
    proxy.resetForm("detailShareRef");
    //resetDetail();
    open.value = true;
    title.value = "价值分摊";
  }
  //分摊总金额隐藏
  shareCostFlag.value = false;
  //分摊比例列隐藏
  shareRatioFlag.value = false;
  //建筑安装费列隐藏
  installationCostFlag.value = false;
  //工程建设其他费用列隐藏
  otherCostFlag.value = false;
}

/**
 * 分摊方式变更
 */
function shareModeCostChange(val) {
  //分摊方式选择价值分摊
  if (val == '1') {
    //分摊总金额显示
    shareCostFlag.value = true;
    //分摊比例列显示
    shareRatioFlag.value = true;
    //建筑安装费列隐藏
    installationCostFlag.value = false;
    //工程建设其他费用列隐藏
    otherCostFlag.value = false;
  }
  //分摊方式选择平均分摊
  if (val == '2') {
    //分摊总金额显示
    shareCostFlag.value = true;
    //分摊比例列隐藏
    shareRatioFlag.value = false;
    //建筑安装费列隐藏
    installationCostFlag.value = false;
    //工程建设其他费用列隐藏
    otherCostFlag.value = false;
  }

  //分摊方式选择手工分摊
  if (val == '3') {
    //分摊总金额隐藏
    shareCostFlag.value = false;
    //分摊比例列隐藏
    shareRatioFlag.value = false;
    if (shareForm.value.shareObjectCost && shareForm.value.shareObjectCost == '1') {
      //建筑安装费列显示
      installationCostFlag.value = true;
      //工程建设其他费用列隐藏
      otherCostFlag.value = false;
    }

    if (shareForm.value.shareObjectCost && shareForm.value.shareObjectCost == '2') {
      //建筑安装费列隐藏
      installationCostFlag.value = false;
      //工程建设其他费用列显示
      otherCostFlag.value = true;
    }
  }
}

/**
 * 分摊对象变更
 * @param {*} val
 */
function shareObjectCostChange(val) {
  //分摊对象为工程建设其他时 判断所有明细是否均已完成建筑安装费分摊
  if (val == '2') {
    const filterRow = selectDetails.value.filter(item => {
      return item.shareObjectCost == null;
    });
    //存在未完成建筑安装费分摊资产进行提示
    if (filterRow.length != 0) {
      const assetsNames = filterRow.map(item => item.assetsName);
      proxy.$modal.msgError(`只有完成建筑安装费资产才可以进行工程建设其他费用分摊！以下资产不符合条件限制:` + assetsNames);
      shareForm.value.shareObjectCost = '';
      return;
    }
  }
  //分摊方式选择手工分摊
  if (shareForm.value.shareModeCost && shareForm.value.shareModeCost == '3') {
    //分摊总金额隐藏
    shareCostFlag.value = false;
    //分摊比例列隐藏
    shareRatioFlag.value = false;
    if (val == '1') {
      //建筑安装费列显示
      installationCostFlag.value = true;
      //工程建设其他费用列隐藏
      otherCostFlag.value = false;
    }
    if (val == '2') {
      //建筑安装费列隐藏
      installationCostFlag.value = false;
      //工程建设其他费用列显示
      otherCostFlag.value = true;
    }
  }
}

/**
 * 分摊表单提交
 */
function submitShareForm() {
  proxy.$refs["detailShareRef"].validate(valid => {
    if (valid) {
      //价值分摊
      if (shareForm.value.shareModeCost == '1') {
        //循环所有明细 判断分摊比例是否合法
        const shareRatio = selectDetails.value.reduce((acc, score) => acc + score.shareRatio, 0);
        if (shareRatio > 100) {
          proxy.$modal.msgError(`所有明细分摊比例累加已超过100%!请确认!`);
          return;
        }
        //循环明细计算分摊金额
        selectDetails.value.forEach(detail => {
          //建筑安装费
          if (shareForm.value.shareObjectCost == '1') {
            detail.installationCost = shareForm.value.shareCost * (detail.shareRatio / 100)
          }
          if (shareForm.value.shareObjectCost == '2') {
            //工程建设其他费用
            detail.otherCost = shareForm.value.shareCost * (detail.shareRatio / 100)
          }
          //分摊方式
          detail.shareModeCost = shareForm.value.shareModeCost;
          //分摊对象
          detail.shareObjectCost = shareForm.value.shareObjectCost;
        })
      }
      //平均分摊
      if (shareForm.value.shareModeCost == '2') {
        //计算分摊比例
        const shareRatio = Math.ceil(100 / (selectDetails.value.length));
        //循环所有明细 写入分摊比例
        selectDetails.value.forEach(detail => {
          detail.shareRatio = shareRatio;
        });
        //最后一个明细进行补余数操作
        selectDetails.value[selectDetails.value.length - 1].shareRatio += 100 % (selectDetails.value.length)
        //循环明细计算分摊金额
        selectDetails.value.forEach(detail => {
          //建筑安装费
          if (shareForm.value.shareObjectCost == '1') {
            detail.installationCost = shareForm.value.shareCost * (detail.shareRatio / 100)
          }
          if (shareForm.value.shareObjectCost == '2') {
            //工程建设其他费用
            detail.otherCost = shareForm.value.shareCost * (detail.shareRatio / 100)
          }
          //分摊方式
          detail.shareModeCost = shareForm.value.shareModeCost;
          //分摊对象
          detail.shareObjectCost = shareForm.value.shareObjectCost;
        })

      }
      //手工分摊
      if (shareForm.value.shareModeCost == '3') {
        //循环明细计算分摊金额
        selectDetails.value.forEach(detail => {
          //建筑安装费
          if (shareForm.value.shareObjectCost == '1') {
            //工程建设其他费用置空 不更新
            detail.otherCost = null;
          }
          if (shareForm.value.shareObjectCost == '2') {
            //建筑安装费置空 不更新
            detail.installationCost = null;
          }
          //分摊方式
          detail.shareModeCost = shareForm.value.shareModeCost;
          //分摊对象
          detail.shareObjectCost = shareForm.value.shareObjectCost;
        })
      }
      updateDetail(selectDetails.value).then(response => {
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        detailList();
      });

    }
  })
}

/**
 * 分摊表单关闭
 */
function closeShareForm() {
  open.value = false;
  detailList();
}
/** 分摊区域函数 end */
function tableRowClassName({ rowIndex }){
  if (rowIndex % 2 == 0) {
    return '';
  } else {
    return 'row-even-bg';
  }
}
detailList();

</script>
