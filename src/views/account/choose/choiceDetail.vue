<template>
  <div class="app-container">
    <!-- 公共资产选择对话框 -->
    <el-dialog
      :title="title"
      v-model="show"
      width="80%"
      draggable
      append-to-body
      @close="closeDialog"
      @open="openDialog"
    >
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <!-- <el-form-item label="资产编码" prop="assetsCode">
            <el-input v-model="queryParams.assetsCode" placeholder="请输入资产编码" clearable
                @keyup.enter="handleQuery" />
        </el-form-item> -->
        <el-form-item label="资产名称" prop="assetsName">
          <el-input v-model="queryParams.assetsName" placeholder="请输入资产名称" clearable
                    @keyup.enter="handleQuery"/>
        </el-form-item>
        <!-- <el-form-item label="资产名称" prop="dataLevel">
                <el-select v-model="queryParams.dataLevel" placeholder="定义级别" clearable size="small"
                    style="width: 240px">
                    <el-option v-for="dict in dict.type.sys_data_level" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                </el-select>
            </el-form-item> -->
        <el-form-item label="所属单位" prop="departName">
          <el-input v-model="queryParams.departName" placeholder="请输入单位" clearable
                    @keyup.enter="handleQuery"/>
        </el-form-item>
        <el-form-item label="保管人" prop="yearMonth">
          <el-input v-model="queryParams.yearMonth" placeholder="请输入保管人" clearable
                    @keyup.enter="handleQuery"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="Plus" @click="screenData" v-hasPermi="['system:detail:add']">
            筛选条件
          </el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns">
        </right-toolbar>
      </el-row>
      <!-- ref="multipleTable" @row-click="handleTableRow"-->
      <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="detailList"
          @selection-change="handleSelectionChange"
          :max-height="height"
          :row-key="getRowKeys"
      >
        <el-table-column type="selection" width="55" align="center" :reserve-selection="true"/>
        <el-table-column label="序号" type="index" width="50" align="center" :index="indexNumber"/>
        <el-table-column label="业务状态" align="center" key="markStatus" prop="markStatus"
                         v-if="columns[0].visible" width="200"/>
        <el-table-column label="资产类型" align="center" key="assetsTypeName" prop="assetsTypeName"
                         v-if="columns[1].visible"/>
        <el-table-column label="资产编码" align="center" key="assetsCode" prop="assetsCode"
                         v-if="columns[2].visible" width="180"/>
        <el-table-column label="资产名称" align="center" key="assetsName" prop="assetsName"
                         v-if="columns[3].visible" width="200" :show-overflow-tooltip="true"/>
        <el-table-column label="规格型号" align="center" key="assetsStandard" prop="assetsStandard"
                         v-if="columns[4].visible" width="100" :show-overflow-tooltip="true"/>
        <el-table-column label="数量" align="center" key="singerAmount" prop="singerAmount"
                         v-if="columns[5].visible"/>
        <el-table-column label="原值" align="center" key="orginalValue" prop="orginalValue"
                         v-if="columns[6].visible"/>
        <el-table-column label="计量单位" align="center" key="unitCode" prop="unitCode" v-if="columns[7].visible"/>
        <el-table-column label="制造厂家" align="center" key="makeFactory" prop="makeFactory"
                         v-if="columns[8].visible" width="140" :show-overflow-tooltip="true"/>
        <el-table-column label="出厂日期" align="center" key="productDate" prop="productDate"
                         v-if="columns[9].visible" width="140"/>
        <el-table-column label="单位编码" align="center" key="departCode" prop="departCode"
                         v-if="columns[10].visible" width="180"/>
        <el-table-column label="所属单位" align="center" key="departName" prop="departName"
                         v-if="columns[11].visible" :show-overflow-tooltip="true" width="200"/>
        <el-table-column label="投产日期" align="center" key="operateDate" prop="operateDate"
                         v-if="columns[12].visible" width="140"/>
        <el-table-column label="存放(安装)地点" align="center" key="storePlace" prop="storePlace"
                         v-if="columns[13].visible" width="180" :show-overflow-tooltip="true"/>
        <el-table-column label="责任人" align="center" key="dutyPerson" prop="dutyPerson"
                         v-if="columns[14].visible"/>
        <el-table-column label="增加原因" align="center" key="addReasonName" prop="addReasonName"
                         v-if="columns[15].visible"/>
        <el-table-column label="保管人" align="center" key="userPerson" prop="userPerson"
                         v-if="columns[16].visible" width="100" :show-overflow-tooltip="true"/>
        <el-table-column label="资产状态" align="center" key="assetsStatusCode" prop="assetsStatusCode"
                         v-if="columns[17].visible"/>
        <el-table-column label="设备类型" align="center" key="equipTypeCode" prop="equipTypeCode"
                         v-if="columns[18].visible"/>
        <el-table-column label="使用状况" align="center" key="usedState" prop="usedState"
                         v-if="columns[19].visible"/>
        <el-table-column label="条码" align="center" key="条码" prop="条码" v-if="columns[20].visible"/>

      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                  v-model:limit="queryParams.pageSize" @pagination="getList"/>

      <el-table
        v-if="hideHouseTable"
        ref="houseMultipleTable"
        style="margin-top:40px"
        v-loading="loading"
        :data="houseList"
        @selection-change="houseHandleSelectionChange"
        :max-height="height"
        :row-key="getHouseRowKeys"
      >
        <el-table-column type="selection" width="55" align="center" :reserve-selection="true"/>
        <el-table-column label="房屋编号" align="center" prop="invoiceNumber" width="120" :show-overflow-tooltip="true"/>
        <el-table-column label="宗地编号" align="center" prop="parcelCode" width="120" :show-overflow-tooltip="true"/>
        <el-table-column label="使用权类型" align="center" prop="usedrightTypeName" width="100" :show-overflow-tooltip="true"/>
        <el-table-column label="土地证号" align="center" prop="landCertificateNo" width="120" :show-overflow-tooltip="true" />
        <el-table-column label="土地使用人" align="center" prop="landUsedHolder" width="160" :show-overflow-tooltip="true"/>
        <el-table-column label="房产证号" align="center"  prop="houseCertificateNo" width="120" :show-overflow-tooltip="true" />
        <!--<el-table-column label="办证状况" align="center" key="orginalValue" prop="orginalValue"-->
        <el-table-column label="省" align="center" prop="province" width="80" :show-overflow-tooltip="true"/>
        <el-table-column label="市" align="center"  prop="city" width="80" :show-overflow-tooltip="true"/>
        <el-table-column label="区" align="center" prop="county" width="80" :show-overflow-tooltip="true"/>
        <el-table-column label="房屋结构" align="center" prop="houseStructureName"/>
        <el-table-column label="建筑面积" align="center" prop="buildArea"/>
        <el-table-column label="责任人联系方式" align="center" prop="managerDutyPhone" width="180" :show-overflow-tooltip="true"/>
        <!--<el-table-column label="土地使用税解缴" align="center"  prop="storePlace"-->
        <!--                />-->
        <!--<el-table-column label="房产税解缴" align="center" key="dutyPerson" prop="dutyPerson"-->
        <!--                 />-->
        <el-table-column label="征税机关" align="center" prop="taxOffice" width="120" :show-overflow-tooltip="true"/>
        <el-table-column label="使用性质" align="center" prop="usedNatureName" width="120" :show-overflow-tooltip="true" />
        <el-table-column label="实际用途" align="center" prop="actualUsedName" width="120" :show-overflow-tooltip="true"/>
      </el-table>
      <pagination v-show="totalHouse > 0" :total="totalHouse" v-model:page="queryParamsHouse.pageNum" v-model:limit="queryParamsHouse.pageSize" @pagination="getListHouse"/>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="mainHandleDefine">确 定</el-button>
          <el-button @click="mainCancel">取 消</el-button>
        </div>
      </template>

      <template>
        <el-dialog v-model="innerOpen" width="50%" draggable title="条件配置" append-to-body>
          <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
            <el-checkbox :disabled="isOther" label="0101">固定资产</el-checkbox>
            <el-checkbox :disabled="isOther" label="0102">油气资产</el-checkbox>
            <el-checkbox :disabled="isOther" label="0103">投资性房地产</el-checkbox>
            <el-checkbox :disabled="isOther" label="0201">无形资产</el-checkbox>
            <el-checkbox label="0301" :disabled="isShowMatter">实物资产</el-checkbox>
          </el-checkbox-group>
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="筛选条件" name="first">
              <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                  <el-button type="primary" text @click="lineHandleAdd">新增
                  </el-button>
                </el-col>
                <!-- <el-col :span="1.5">
                    <el-button type="danger" text @click="lineHandleDel">删除</el-button>
                </el-col> -->
              </el-row>

              <el-table :data="lineConditionData" :height="390">
                <el-table-column label="条件列" align="center" key="conLine" prop="conLine">

                  <template #default="scope">
                    <el-select filterable v-model="scope.row.conLine" placeholder="可搜索">
                      <el-option v-for="item in columnList" :key="item.columnName"
                                 :label="item.columnTitle" :value="item.columnName">
                        <span style="float: left">{{ item.columnTitle }}</span>
                        <span
                            style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">{{
                            item.columnName
                          }}</span>
                      </el-option>
                    </el-select>
                  </template>

                </el-table-column>
                <el-table-column label="条件符" align="center" key="conTag" prop="conTag"  v-if="columns[2].visible">
                  <template #default="scope">
                    <el-select v-model="scope.row.conTag" class="m-2" placeholder="请选择">
                      <el-option v-for="item in lineList" :key="item.value" :label="item.label"  :value="item.value"/>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="条件值" align="center" key="conValue" prop="conValue">
                  <template #default="scope">
                    <!-- <el-input type="text" v-model="scope.row.conValue" /> -->
                    <el-input type="text" v-model="scope.row.conValue"></el-input>
                    {{ scope.row.conValue }}
                  </template>
                </el-table-column>
                <el-table-column label="逻辑符" align="center" key="conLogical" prop="conLogical">
                  <template #default="scope">

                    <el-select v-model="scope.row.conLogical" class="m-2" placeholder="请选择">
                      <el-option v-for="item in logicalList" :key="item.value" :label="item.label"
                                 :value="item.value"/>
                    </el-select>


                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                  <template #default="scope">
                    <el-button type="danger" text
                               @click="columnDel(scope.$index, scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>


                <!-- <el-table-column label="条件列" align="center" key="assetsTypeName" prop="assetsTypeName"
                    v-if="columns[1].visible" /> -->
                <!-- <el-table-column label="条件符" align="center" key="assetsCode" prop="assetsCode"
                    v-if="columns[2].visible" />
                <el-table-column label="条件值" align="center" key="assetsName" prop="assetsName"
                    v-if="columns[3].visible" />
                <el-table-column label="括号" align="center" key="assetsStandard" prop="assetsStandard"
                    v-if="columns[4].visible" />
                <el-table-column label="逻辑符" align="center" key="singerAmount" prop="singerAmount"
                    v-if="columns[5].visible" /> -->
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="资产编码" name="second">
              <el-input v-model="queryParams.assetsCode" :rows="20" type="textarea"
                        placeholder="Please input"/>
            </el-tab-pane>
            <el-tab-pane label="原资产编码" name="third">
              <el-input v-model="textarea2" :rows="20" type="textarea" placeholder="Please input"/>
            </el-tab-pane>

          </el-tabs>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="handleDefine">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </template>
        </el-dialog>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="ChoiceDetail">
import {getToken} from "@/utils/auth";
import {listDetail, listHouse, listColumn} from "@/api/account/choose/detail";
import {iteratee, reduce, sortedUniq} from "lodash";
import {alertEffects} from "element-plus";


const {proxy} = getCurrentInstance();
const loading = ref(true);
const total = ref(0);
const showSearch = ref(true);
// const show = ref(true);
const height = ref(260);
const detailList = ref([]);
//隐藏table
const hideHouseTable = ref(true);
const innerOpen = ref(false);


const textarea1 = ref()
const textarea2 = ref()
//创建两个数组存数据 和 存keyCode
const mainDataList = ref([]);
const keyCodeList = ref([]);

//接收房屋明细数组
const houseList = ref([]);

const mainHouseList = ref([]);

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  dieAway: {
    type: String,
    default: "other"

  }
});

const activeName = ref('first');

const emit = defineEmits(['update:show', 'get:data']);
//传递给父组件

// 列信息
const columns = ref([
  {key: 0, label: `单据编码`, visible: true},
  {key: 1, label: `资产类型`, visible: true},
  {key: 2, label: `资产编码，`, visible: true},
  {key: 3, label: `资产名称`, visible: true},
  {key: 4, label: `规格型号`, visible: true},
  {key: 5, label: `数量`, visible: true},
  {key: 6, label: `原值`, visible: true},
  {key: 7, label: `计量单位`, visible: true},
  {key: 8, label: `制造厂家`, visible: true},
  {key: 9, label: `出厂日期`, visible: true},
  {key: 10, label: `单位编码`, visible: true},
  {key: 11, label: `所属单位`, visible: true},
  {key: 12, label: `投产日期`, visible: true},
  {key: 13, label: `存放(安装)地点`, visible: true},
  {key: 14, label: `责任人`, visible: true},
  {key: 15, label: `增加原因`, visible: true},
  {key: 16, label: `保管人`, visible: true},
  {key: 17, label: `资产状态`, visible: true},
  {key: 18, label: `设备类型`, visible: true},
  {key: 19, label: `使用状况`, visible: true},
  {key: 20, label: `条码`, visible: true},
]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    detailParam: "rent",
    departCode: "",
    assetsCode: "",
    assetsTypes: ['0101'],
    sql: '',
  }
});
const totalHouse = ref(0);
const queryParamsHouse = reactive({
  pageNum: 1,
  pageSize: 10,
  keyCode: []
})
const { queryParams, form, rules } = toRefs(data);
const { show, dieAway } = toRefs(props)

function indexNumber(index) {
  const page = queryParams.value.pageNum
  const pageSize = queryParams.value.pageSize
  return index + 1 + (page - 1) * pageSize
}

/** 查询参数表列表 */
function getList() {
  loading.value = true;
  listDetail(proxy.addDateRange(queryParams.value)).then(response => {
    detailList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
};

// 查询子资产列表
function getListHouse() {
  loading.value = true;
  const keyCode = mainDataList.value.map(item => item.keyCode);
  queryParamsHouse.keyCode = keyCode
  listHouse(queryParamsHouse).then(response => {
    houseList.value = response.rows;
    totalHouse.value = response.total;
    loading.value = false;
  });
};

// 保留行单选数据
function getRowKeys(row) {
  return row.keyCode
}

//选取行和获取数据  rent house 带明细  other
/*function handleTableRow(row, event, column) {


    if (row.contentAssetsCode.substring(0, 2) != '16') {
        proxy.$modal.msgError("这不是房屋资产!");
    }

    //如果存在就不添加
    if (!keyCodeList.value.includes(row.keyCode)) {
        keyCodeList.value.push(row.keyCode)
        listHouse(row.keyCode).then(response => {
            response.data.forEach(element => {
                houseList.value.push(element)
            });


        });

    }
    //勾选了点击
    proxy.$refs.multipleTable.toggleRowSelection(row, true);

}*/
// 多选框选中数据
function handleSelectionChange(selection) {
  /*if (mainDataList.value.length === 0 && selection.length === 1) {
      mainDataList.value = selection;
      return;
  }
  if (selection.length === 0) {
      keyCodeList.value.splice(0, keyCodeList.value.length)
      houseList.value.splice(0, houseList.value.length)
      mainDataList.value = selection;
      return;
  }

  if (mainDataList.value.length > selection.length) {
      // alert("进来")

      const arrCode = []

      selection.forEach(s => {
          arrCode.push(s.keyCode)

      });

      keyCodeList.value = keyCodeList.value.filter(function (item) {
          return arrCode.includes(item)
      })


      //删除房屋明细
      houseList.value = houseList.value.filter(function (item) {
          return keyCodeList.value.includes(item.pkKeyCode)
      })


  }*/
  mainDataList.value = selection
  if (dieAway !== "other") {
    getListHouse();
  }
};

// 房屋明细行单选数据
function getHouseRowKeys(row) {
  return row.copied
}

//勾选房屋明细
function houseHandleSelectionChange(selection) {
  // mainHouseList.value = selection
  keyCodeList.value = selection
}

//给主页面
function mainHandleDefine() {
  const houseMap = {}
  keyCodeList.value.forEach(k => {
    const arr = []
    mainHouseList.value.forEach(h => {
      if (k === h.pkKeyCode) {
        arr.push(h)
      }
    });

    if (arr.length != 0) {
      houseMap[`${k}`] = arr
    }
  });

  const data = {
    list: mainDataList.value,
    houseList: keyCodeList.value,
    houseMap: houseMap
  }
  mainDataList.value = []
  houseList.value = []
  emit('get:data', data);
  emit('update:show', false)

};

//数据取消
function mainCancel() {
  //传递给父组件
  emit('update:show', false)
  //    show.value=false
  show.value = false
  mainDataList.value = []
  houseList.value = []
  // proxy.getList();
};


function cancel() {
  innerOpen.value = false
};

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
function resetQuery() {
  queryParams.value.departCode = '';
  proxy.resetForm("queryRef");
  handleQuery();
};

const checkList = ref(['0101'])
//显隐实物资产
const isShowMatter = ref(true)
const isOther = ref(false)

function handleCheckedCitiesChange(value) {


  if (value.length === 0) {
    isShowMatter.value = false
    isOther.value = false
  } else if (value[0] === '0301') {
    purpose.value = 'real'
    isOther.value = true
  } else {
    purpose.value = 'account'
    isShowMatter.value = true
  }
  getColumn()
  queryParams.value.assetsTypes = value


}

/**关闭*/
function closeDialog() {
  if (show.value) {
    emit('update:show', false)
  }
  mainDataList.value = []
  keyCodeList.value = []
}

function openDialog() {
  if (show.value) {
    if (dieAway.value === 'other') {
      // 隐藏房屋子资产信息
      height.value = 500
      hideHouseTable.value = false;
    };
    innerOpen.value = true
    getColumn()
    queryParams.value.detailParam = dieAway.value
    getList()
  }
}

//条件列信息
const lineConditionData = ref([]);
//

//添加
function lineHandleAdd() {
  const lineInfo = reactive({
    conLine: '',
    conTag: '',
    conValue: '',
    conLogical: '',
    iseditor: true
  })
  lineConditionData.value.push(lineInfo)
}


//编辑下拉
function columnSelectEdit({row, column}) {
  if (column.property === 'conLine') {
    row.iseditorX = false
  } else if (column.property === 'conTag') {
    row.iseditorY = false
  } else if (column.property === 'conValue') {
    row.iseditorZ = false
  } else if (column.property === 'conLogical') {
    row.iseditorU = false
  } else {
    return false
  }
}

//删除
function columnDel(index, row) {
  lineConditionData.value.splice(index, 1)
}

//条件符
const lineList = [
  {
    value: '大于',
    label: '大于',
  },
  {
    value: '小于',
    label: '小于',
  },
  {
    value: '等于',
    label: '等于',
  },
  {
    value: '大于等于',
    label: '大于等于',
  },
  {
    value: '小于等于',
    label: '小于等于',
  },
  {
    value: '不等于',
    label: '不等于',
  },
  {
    value: '包含',
    label: '包含',
  },
  {
    value: '不包含',
    label: '不包含',
  },
  {
    value: '开头是',
    label: '开始是',
  },
  {
    value: '结尾是',
    label: '结尾是',
  },
  {
    value: '开头不是',
    label: '开始不是',
  },
  {
    value: '结尾不是',
    label: '结尾不是',
  },
]

//逻辑符
const logicalList = [
  {
    value: '无',
    label: '无',
  },
  {
    value: 'and',
    label: '且',
  },
  {
    value: 'or',
    label: '或',
  },
]

//获取下拉字段
const purpose = ref("account")
const columnList = ref([])

function getColumn() {
  listColumn(purpose.value).then(response => {
    columnList.value = response.data
  })
}


//确定条件数组
function handleDefine() {
  if (queryParams.value.assetsTypes.length === 0) {
    proxy.$modal.msgError('请选择资产类型');
  }
  let pinsql = ''
  let _isEnd = false;
  lineConditionData.value.forEach(function (e, index, array) {
    if (e.conLine === '') {
      proxy.$modal.msgError("条件列不能为空");
      _isEnd = true
      return
    }
    if (e.conLogical === '') {
      proxy.$modal.msgError("逻辑符不能为空");
      _isEnd = true
      return
    }
    if (e.conTag === '') {
      proxy.$modal.msgError("条件符不能为空");
      _isEnd = true
      return
    }
    if (e.conValue === '') {
      proxy.$modal.msgError("条件值不能为空");
      _isEnd = true
      return
    }
    // param.push(e.conValue)
    pinsql += e.conLine + " "

    switch (e.conTag) {
      case '大于': //状态一
        pinsql += '> ' + e.conValue + ' '

        break
      case '小于': //状态二
        pinsql += '< ' + e.conValue + ' '
        X
        break
      case '等于'://状态三
        pinsql += '< ' + e.conValue + ' '

        break
      case '大于等于'://状态三
        pinsql += '>= ' + e.conValue + ' '

        break
      case '小于等于'://状态三
        pinsql += '<= ' + e.conValue + ' '

        break
      case '包含'://状态三
        pinsql += 'like %' + e.conValue + '%' + ' '

        break
      case '不包含'://状态三
        pinsql += 'not like %' + e.conValue + '%' + ' '

        break

      case '开头是'://状态三
        pinsql += 'like %' + e.conValue + ' '

        break
      case '结尾是'://状态三
        pinsql += 'like ' + e.conValue + '%' + ' '

        break
      case '开头不是'://状态三
        pinsql += 'not like %' + e.conValue + ' '

        break
      case '结尾不是'://状态三
        pinsql += 'like ' + e.conValue + '%' + ' '

        break

    }

    if (array.length - 1 === index) {
      innerOpen
      return;
    }
    //拼接逻辑符
    pinsql += e.conLogical + ' '


  });

  if (_isEnd) {
    return
  }

  queryParams.value.sql = pinsql
  getList()
  innerOpen.value = false

}


//筛选条件
function screenData() {
  innerOpen.value = true
}


</script>

<style lang="scss" scoped>

</style>
