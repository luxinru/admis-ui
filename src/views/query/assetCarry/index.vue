<template>
    <div class="app-main-content">
        <!--<el-row>-->
            <!--<el-col>-->
                <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
                    <el-form-item label="日期" prop="addVoucherDate">
                        <el-date-picker v-model="queryParams.addVoucherDate" value-format="YYYY-MM-DD"
                            placeholder="输入日期" style="width: 220px"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="资产类型" prop="assetsType">
                        <el-select v-model="queryParams.assetsType" placeholder="请选择"
                            @change="handleAssetList(queryParams.assetsType)">
                            <el-option v-for="dict in q_asset_type" :key="dict.value" :label="dict.label"
                                :value="dict.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="单位编码" prop="departCode">
                        <el-input v-model="queryParams.departCode" placeholder="输入单位编码" clearable style="width: 220px"
                            @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="资产类别" prop="contentAssetsCode">
                        <el-select v-model="queryParams.contentAssetsCode" placeholder="请选择"
                            @change="handleYesHouse(queryParams.contentAssetsCode)"
                            :disabled="queryParams.contentAssetsCode=='16'">
                            <el-option v-for="dict in AssetArry" :key="dict.value" :label="dict.label"
                                :value="dict.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="准则类别" prop="normType">
                        <el-select v-model="queryParams.normType" placeholder="请选择">
                            <el-option v-for="dict in q_norm_type" :key="dict.value" :label="dict.label"
                                :value="dict.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否房屋" prop="yesHouse">
                        <el-select v-model="yesHouse" placeholder="请选择" :disabled="bool==false"
                            @change=handleYesHouseTwo(yesHouse)>
                            <el-option v-for="dict in yes_no_house" :key="dict.value" :label="dict.label"
                                :value="dict.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>
              <div class="block-divider" v-if="showSearch"></div>
            <!--</el-col>-->
        <!--</el-row>-->

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="Plus" @click="handleCooption" v-hasPermi="['system:role:add']">筛选
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="Edit" :disabled="single" @click="handleInfo"
                    v-hasPermi="['system:role:edit']">资产详情</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['system:role:remove']">打印</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="Download" @click="handleExport"
                    v-hasPermi="['system:role:export']">导出</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="Download" @click="handleExport"
                    v-hasPermi="['system:role:export']">减值原因</el-button>
            </el-col>
            <!-- <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar> -->
        </el-row>
        <!-- 表格数据 -->
        <el-table v-loading="loading" :data="AssetCarryList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column label="资产类型" prop="assetsTypeName" :show-overflow-tooltip="true" width="120"
                align="center" />
            <!-- <el-table-column label="资产编号" prop="realAssetsCode" :show-overflow-tooltip="true" width="120"
                align="center" /> -->
            <el-table-column label="资产编号" prop="assetsCode" :show-overflow-tooltip="true" width="120" align="center" />
            <el-table-column label="资产名称" prop="assetsName" :show-overflow-tooltip="true" width="120" align="center" />
            <el-table-column label="所属单位" prop="departName" width="220" align="center" :show-overflow-tooltip="true"/>
            <el-table-column label="计量单位" prop="unitCodeName" :show-overflow-tooltip="true" width="120"
                align="center" />
            <el-table-column label="规格型号" prop="assetsStandard" :show-overflow-tooltip="true" width="120"
                align="center" />
            <el-table-column label="保管人" prop="userPerson" :show-overflow-tooltip="true" width="120" align="center" />
            <el-table-column label="投产日期" prop="operateDate" :show-overflow-tooltip="true" width="120" align="center" />
            <el-table-column label="原值" prop="originalValue" width="150" align="center" v-if="OnSum" />
            <el-table-column label="净值" prop="nowValue" width="150" align="center" v-if="OnSum" />
            <el-table-column label="累计折旧" prop="addDepreciate" :show-overflow-tooltip="true" width="150" v-if="OnSum"
                align="center" />

        </el-table>
        <el-form :model="sumList" :inline="true" v-if="OnSum" class="mt10">
            <el-form-item label="原始合值" prop="originalValueSum">
                <el-input v-model="sumList.originalValueSum" clearable style="width: 200px" readonly
                    @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="累计折旧合计" prop="addDepreciateSum">
                <el-input v-model="sumList.addDepreciateSum" clearable style="width: 200px" readonly
                    @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="减值准备合计" prop="devalueValueSum">
                <el-input v-model="sumList.devalueValueSum" clearable style="width: 200px" readonly
                    @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="净值合计" prop="nowValueSum">
                <el-input v-model="sumList.nowValueSum" clearable style="width: 200px" readonly
                    @keyup.enter="handleQuery" />
            </el-form-item>
        </el-form>
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize" @pagination="getList" />

        <card-choose ref="card" @submitForm="submitForm"></card-choose>
    </div>
</template>

<script setup name="AssetCarry">
import { listAssetCarry } from "@/api/query/assetCarry";
import { listByParam } from "@/api/system/asset";
import _ from 'lodash';
import { ref } from "vue";
const { proxy } = getCurrentInstance();
const { q_asset_class, q_asset_type, q_norm_type } = proxy.useDict("q_asset_class", "q_asset_type", "q_norm_type");
const AssetCarryList = ref([
]);
const card = ref();
const yesHouse = ref('');
const AssetArry = ref([]);
// 显隐字段
// const OnAccount = ref(true);
const OnSum = ref(true);

//判断枚举
const ASSET_STATUS = {
    // 房屋
    HOUSE: '16',
    // 实物
    ON_ACOUNT: '0108',

}
//下拉数组是否
const yes_no_house = ref([
    {
        value: '',
        label: '否',
    },
    {
        value: '16',
        label: '是',
    },
]);

const sumList = ref({});
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        addVoucherDate: undefined,
        assetsType: '0101',
        departCode: undefined,
        contentAssetsCode: '',
        normType: ''
    },
    // rules: {
    //     roleName: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
    //     roleKey: [{ required: true, message: "权限字符不能为空", trigger: "blur" }],
    //     roleSort: [{ required: true, message: "角色顺序不能为空", trigger: "blur" }]
    // },
});
const asstRow = ref({});
const { queryParams, form, rules } = toRefs(data);

/** 查询列表 */
function getList() {

    //实物资产显隐
    if (queryParams.value.assetsType == ASSET_STATUS.ON_ACOUNT) {
        OnSum.value = false
        // OnAccount.value = false
    } else {
        OnSum.value = true
        // OnAccount.value = true
    }
    loading.value = true;
    listAssetCarry(proxy.addDateRange(queryParams.value)).then(response => {
        AssetCarryList.value = response.rows;
        total.value = response.total;
        sumList.value = response.value;
        loading.value = false;
        console.log( AssetCarryList.value)
    });

}

/** 根据codetype和data——level获取资产目录的数据 */
const bool = ref(false)
function getAssetList() {
    bool.value = false;
    AssetArry.value = []
    const params = ref({
        codeType: queryParams.value.assetsType.substring(1, 2)
    });
    // loading.value = true;
    listByParam(params.value).then(response => {
        queryParams.value.contentAssetsCode = ''
        response.data.forEach(element => {
            if (element.contentsCode == ASSET_STATUS.HOUSE) {
                bool.value = true;
            }
            const asset = {
                label: element.contentsName,
                value: element.contentsCode
            }
            AssetArry.value.push(asset)
        });
        if (bool.value == false) {
            if (yesHouse.value == ASSET_STATUS.HOUSE) {
                proxy.$modal.msgWarning("该类型没有房屋!");
            }
            yesHouse.value = ''
            queryParams.value.contentAssetsCode = ''

        }
        if(bool.value==true){
            if(yesHouse.value==ASSET_STATUS.HOUSE){
                queryParams.value.contentAssetsCode ='16'
            }
        }
        // loading.value = false;
    });
}
function handleAssetList(value) {
    // 首先判断改变的值
    if (value != undefined) {
        if (value == ASSET_STATUS.HOUSE) {
            return;
        }
        proxy.getAssetList();
    }

};

//资产类别判断
function handleYesHouse(value) {
    // 首先判断改变的值
    if (value != undefined) {
        if (value != ASSET_STATUS.HOUSE) {
            yesHouse.value = ''
        }
        if (value == ASSET_STATUS.HOUSE) {
            yesHouse.value = '16'
        }
    }
}
//是否房屋判断回显
function handleYesHouseTwo(value) {

    // 首先判断改变的值
    if (value != undefined) {
        if (value != ASSET_STATUS.HOUSE) {
            console.log(value)
            queryParams.value.contentAssetsCode = ''
        }
        if (value == ASSET_STATUS.HOUSE) {
            console.log(value)
            queryParams.value.contentAssetsCode = '16'
        }
    }


}
/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
}
/** 重置按钮操作 */
function resetQuery() {
    // dateRange.value = [];
    proxy.resetForm("queryRef");
    handleQuery();
}
/** 导出按钮操作 */
function handleExport() {
    proxy.download("system/role/export", {
        ...queryParams.value,
    }, `role_${new Date().getTime()}.xlsx`);
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
    // card.value.close()
    if (selection.length == 1) {
        asstRow.value = selection[0]
    }
    single.value = selection.length != 1;
    multiple.value = !selection.length;
}

/** 筛选选 */
function handleCooption() {
    reset();
    open.value = true;
    title.value = "添加角色";
}
/** 详情 */
function handleInfo() {
    if (asstRow.value.contentAssetsCode == ASSET_STATUS.HOUSE) {
        proxy.$modal.notify("房屋资产")
        return;
    }

    if (asstRow.value.assetsType == ASSET_STATUS.ON_ACOUNT) {
        const title = ref("实物资产")
        card.value.view(_.cloneDeep(asstRow.id), title)
    } else {
        proxy.$modal.notify("在账资产")
    }

}



getList();
getAssetList()
</script>
