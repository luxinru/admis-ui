<template>
  <div class="app-container">
      <el-form :model="refineQueryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="69px">
        <el-form-item label="资产类别编码" prop="contentAssetsCode">
          <el-input v-model="refineQueryParams.contentAssetsCode" @keyup.enter="handleQuery" style="width: 220px" clearable
            placeholder="请输入资产类别编号" />
        </el-form-item>
        <el-form-item label="规格型号" prop="assetsStandard">
          <el-input v-model="refineQueryParams.assetsStandard" @keyup.enter="handleQuery" style="width: 220px" clearable
            placeholder="请输入规格型号" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button type="primary" icon="Filter">筛选</el-button>
          <el-button type="danger" icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    <!--财务核对明細页面-->
    <div class="div-editor-container-grey">
      <div class="app-container">
        <!--按钮操作部分-->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Upload"  :disabled="single"
                       @click="openAttachPage">附件</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Filter" :disabled="single" @click="openSharePage">分摊</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Upload"  @click="handleImport" v-hasPermi="['system:user:import']"
                      >导入</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="detailList"></right-toolbar>
        </el-row>

        <!--明细表格-->
        <el-table v-loading="loading" :data="refineList" @selection-change="handleSelectionChange" :height="height">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="资产名称" align="center" prop="assetsName" />
          <el-table-column label="资产类别" align="center" prop="contentAssetsCode" />
          <el-table-column label="规格型号" align="center" prop="assetsStandard" />
          <el-table-column label="出厂日期" align="center" prop="productDate" />
          <el-table-column label="使用单位" align="center" prop="useDepartName" />
          <el-table-column label="计量单位" align="center" prop="unitCodeName" />
          <el-table-column label="计量数量" align="center" prop="singleAmount" />
          <el-table-column label="复合数量" align="center" prop="charItem5" />
          <el-table-column label="预备费" align="center" prop="prepareCost" />
          <el-table-column label="建设期贷款利息" align="center" prop="loanInterest" />
          <el-table-column label="车辆购置税" align="center" prop="autoPurchaseTax" />
          <el-table-column label="是否相符" align="center" width="100">
            <template #default="scope">
               <el-switch
                  v-model="scope.row.valueCheckResult"
                  :active-value="0"
                  :inactive-value="1"
                  @change="handleStatusChange(scope.row)"
               ></el-switch>
            </template>
         </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" />
        </el-table>
        <pagination v-show="refineTotal > 0" :total="refineTotal" v-model:page="refineQueryParams.pageNum"
          v-model:limit="refineQueryParams.pageSize" @pagination="detailList" />
      </div>

      </div>

    <!--分摊弹窗区域-->
    <el-dialog :title="title" v-model="open" width="800px" top="5vh" append-to-body>
      <div class="div-editor-container-grey">
        <div class="app-container">
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
        <div class="app-container">
          <el-table v-loading="loading" :data="selectDetails" :height="height">
            <el-table-column label="资产名称" align="center" prop="assetsName" />
            <el-table-column label="资产类别" align="center" prop="contentAssetsCode" />
            <el-table-column label="规格型号" align="center" prop="assetsStandard" />
            <el-table-column label="出厂日期" align="center" prop="productDate" />
            <el-table-column label="使用单位" align="center" prop="useDepartName" />
            <el-table-column label="计量单位" align="center" prop="unitCodeName" />
            <el-table-column label="计量数量" align="center" prop="singleAmount" />
            <el-table-column label="复合数量" align="center" prop="charItem5" />
            <el-table-column label="分摊比例" align="center" width="100" v-if="shareRatioFlag">
              <template #default="scope">
                <el-input placeholder="请输入分摊比例" v-model="scope.row.shareRatio" maxlength="4" type="number"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="预备费" align="center" width="100" v-if="prepareCostFlag">
              <template #default="scope">
                <el-input placeholder="请输入预备费" v-model="scope.row.prepareCost" maxlength="15"
                          type="number"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="建设期贷款利息" align="center" width="100" v-if="loanInterestFlag">
              <template #default="scope">
                <el-input placeholder="请输入建设期贷款利息" v-model="scope.row.loanInterest" maxlength="15"
                          type="number"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="车辆购置税" align="center" width="100" v-if="autoPurchaseTaxFlag">
              <template #default="scope">
                <el-input placeholder="请输入车辆购置税" v-model="scope.row.autoPurchaseTax" maxlength="15"
                          type="number"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark" />
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

<script setup name="financeCheck">
// 引入单据操作方法
import { listInvoice, getInvoice,checkInvoice } from "@/api/value/add/financeCheck/invoice/invoice";
// 引入明细操作方法
import { listDetail, getDetail, changeCheckStatus, updateDetail } from "@/api/value/add/financeCheck/detail/detail";
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';

const { proxy } = getCurrentInstance();
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const selectDetails = ref([]);
const ids = ref([]);
const number = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
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

// 获取单据类型
const parentInvoiceType = ref(route.query.invoiceType);

/** 明细区域函数 start */

// 定义分页查询数据
const refineData = reactive({
  refineQueryParams: {
    pageNum: 1,
    pageSize: 10,
    invoiceNumber: parentInvoiceNumber.value==""?"xz":parentInvoiceNumber.value,
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
  $refs.attach.show(keycode,tableName);
}


/** 是否相符修改 */
function handleStatusChange(row) {

  let text = row.valueCheckResult === 0 ? "相符" : "不相符";

  proxy.$modal.confirm('确认"'  + row.assetsName + '"的资产"'+ text + '"吗?').then(function () {
    return changeCheckStatus(row.keyCode,row.id, row.valueCheckResult);
  }).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
  }).catch(function () {
    row.realCheckResult = row.valueCheckResult === 1 ? 0 : 1;
      console.log(row.valueCheckResult);
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
  selectDetails.value = selection;
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
  number.value = selection.map(item => item.invoiceNumber)
}


/** 明细区域函数 end */
detailList();

/** 分摊区域函数 start */
//分摊总金额显隐控制
const shareCostFlag = ref(false);
//分摊比例显隐控制
const shareRatioFlag = ref(false);
//预备费显隐控制
const prepareCostFlag = ref(false);
//建设期贷款利息显隐控制
const loanInterestFlag = ref(false);
//车辆购置税
const autoPurchaseTaxFlag = ref(false);

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
    label: '预备费'
  }, {
    value: '2',
    label: '建设期贷款利息'
  }, {
    value: '3',
    label: '车辆购置税'
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
      console.log(selectDetails);
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
  //预备费列隐藏
  prepareCostFlag.value = false;
  //建设期贷款利息列隐藏
  loanInterestFlag.value = false;
  //车辆购置税列隐藏
  autoPurchaseTaxFlag.value = false;
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
    //预备费列隐藏
    prepareCostFlag.value = false;
    //建设期贷款利息列隐藏
    loanInterestFlag.value = false;
    //车辆购置税列隐藏
    autoPurchaseTaxFlag.value = false;

  }
  //分摊方式选择平均分摊
  if (val == '2') {
    //分摊总金额显示
    shareCostFlag.value = true;
    //分摊比例列隐藏
    shareRatioFlag.value = false;
    //预备费列隐藏
    prepareCostFlag.value = false;
    //建设期贷款利息列隐藏
    loanInterestFlag.value = false;
    //车辆购置税列隐藏
    autoPurchaseTaxFlag.value = false;

  }

  //分摊方式选择手工分摊
  if (val == '3') {
    //分摊总金额隐藏
    shareCostFlag.value = false;
    //分摊比例列隐藏
    shareRatioFlag.value = false;
    if (shareForm.value.shareObjectCost && shareForm.value.shareObjectCost == '1') {
      //预备费列显示
      prepareCostFlag.value = true;
      //建设期贷款利息列隐藏
      loanInterestFlag.value = false;
      //车辆购置税列隐藏
      autoPurchaseTaxFlag.value = false;
    }

    if (shareForm.value.shareObjectCost && shareForm.value.shareObjectCost == '2') {
      //预备费列隐藏
      prepareCostFlag.value = false;
      //建设期贷款利息列显示
      loanInterestFlag.value = true;
      //车辆购置税列隐藏
      autoPurchaseTaxFlag.value = false;
    }

    if (shareForm.value.shareObjectCost && shareForm.value.shareObjectCost == '3') {
      //预备费列隐藏
      prepareCostFlag.value = false;
      //建设期贷款利息列隐藏
      loanInterestFlag.value = false;
      //车辆购置税列显示
      autoPurchaseTaxFlag.value = true;
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
      //预备费列显示
      prepareCostFlag.value = true;
      //建设期贷款利息列隐藏
      loanInterestFlag.value = false;
      //车辆购置税列隐藏
      autoPurchaseTaxFlag.value = false;
    }
    if (val == '2') {
      //预备费列隐藏
      prepareCostFlag.value = false;
      //建设期贷款利息列显示
      loanInterestFlag.value = true;
      //车辆购置税列隐藏
      autoPurchaseTaxFlag.value = false;

    }
    if (val == '3') {
      //预备费列隐藏
      prepareCostFlag.value = false;
      //建设期贷款利息列显示
      loanInterestFlag.value = false;
      //车辆购置税列显示
      autoPurchaseTaxFlag.value = true;

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
          //预备费
          if (shareForm.value.shareObjectCost == '1') {
            detail.prepareCost = shareForm.value.shareCost * (detail.shareRatio / 100)
          }
          if (shareForm.value.shareObjectCost == '2') {
            //建设期贷款利息
            detail.loanInterest = shareForm.value.shareCost * (detail.shareRatio / 100)
          }
          //分摊方式
          detail.shareModeCost = shareForm.value.shareModeCost;
          //分摊对象
          detail.shareObjectCost = shareForm.value.shareObjectCost;

          detail.invoiceType = parentInvoiceType ;
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
          //预备费
          if (shareForm.value.shareObjectCost == '1') {
            detail.prepareCost = shareForm.value.shareCost * (detail.shareRatio / 100)
          }
          if (shareForm.value.shareObjectCost == '2') {
            //建设期贷款利息
            detail.loanInterest = shareForm.value.shareCost * (detail.shareRatio / 100)
          }
          //分摊方式
          detail.shareModeCost = shareForm.value.shareModeCost;
          //分摊对象
          detail.shareObjectCost = shareForm.value.shareObjectCost;

          detail.invoiceType = parentInvoiceType ;
        })

      }
      //手工分摊
      if (shareForm.value.shareModeCost == '3') {
        //循环明细计算分摊金额
        selectDetails.value.forEach(detail => {
          //预备费
          if (shareForm.value.shareObjectCost == '1') {
            //预备费置空 不更新
            detail.prepareCost = null;
          }
          if (shareForm.value.shareObjectCost == '2') {
            //建设期贷款利息置空 不更新
            detail.loanInterest = null;
          }
          if (shareForm.value.shareObjectCost == '3') {
            //建设期贷款利息置空 不更新
            detail.autoPurchaseTaxFlag = null;
          }
          //分摊方式
          detail.shareModeCost = shareForm.value.shareModeCost;
          //分摊对象
          detail.shareObjectCost = shareForm.value.shareObjectCost;

          detail.invoiceType = parentInvoiceType ;


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
</script>
