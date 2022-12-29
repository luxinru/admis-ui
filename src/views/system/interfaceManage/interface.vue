<!--
 * @Author: Weizheng
 * @Date: 2022-08-23 09:19:43
 * @LastEditTime: 2022-09-07 09:20:28
 * @LastEditors: WeiZheng
 * @Description: 
 * @FilePath: \petro-gsms-device-web\src\views\system\interfaceManage\interface.vue
-->
<template>
    <div>
        <el-card style="height:calc(100vh - 85px)">
            <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
                <el-form-item label="接口名称" prop="interfaceName">
                    <el-input
                        v-model="queryParams.interfaceName"
                        placeholder="请输入接口名称"
                        @keyup.enter="getInterFace"
                    />
                </el-form-item>
                <el-form-item label="接口Url" prop="interfaceUrl">
                    <el-input
                        v-model="queryParams.interfaceUrl"
                        placeholder="请输入接口url"
                        @keyup.enter="getInterFace"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="Search" @click="getInterFace">搜索</el-button>
                    <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button
                        type="primary"
                        plain
                        icon="Plus"
                        @click="handleAdd"
                    >新增</el-button>
                </el-col>
                <!-- <el-col :span="1.5">
                    <el-button
                        type="danger"
                        plain
                        icon="Delete"
                        :disabled="multiple"
                        @click="handleDelete"
                    >删除</el-button>
                </el-col> -->
                <right-toolbar v-model:showSearch="showSearch" @queryTable="getInterFace"></right-toolbar>
            </el-row>
            <el-row>
                <h4 style="width:100%" class="form-header h4"></h4>
                <el-table border height="calc(100vh - 300px)" v-loading="loading" ref="relationTable" @selection-change="handleSelectionChange" :data="relationData">
                    <!-- <el-table-column type="index" label="序号" width="50" /> -->
                    <!-- <el-table-column type="selection" width="55" align="center" /> -->
                    <el-table-column type="expand">
                        <template #default="props">
                            <el-row :gutter="15">
                                <el-col :span="12">
                                    <span style="padding-left:10px;font-weight:600">请求头信息</span>
                                    <el-table border :data="props.row.headerArray" :show-header="false">
                                        <el-table-column>
                                            <template #default="scope">
                                                <el-input v-model="Object.keys(scope.row)[0]" :disabled="true">
                                                    <template #prepend>配置名</template>
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="20px">
                                            <span>:</span>
                                        </el-table-column>
                                        <el-table-column>
                                            <template #default="scope">
                                                <el-input v-model="Object.values(scope.row)[0]" :disabled="true">
                                                    <template #prepend>配置值</template>
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                                <el-col :span="12">
                                    <span style="padding-left:10px;font-weight:600">请求参数</span>
                                    <el-table border :data="props.row.paramArray" :show-header="false">
                                        <el-table-column>
                                            <template #default="scope">
                                                <el-input v-model="Object.keys(scope.row)[0]" :disabled="true">
                                                    <template #prepend>参数名</template>
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="20px">
                                            <span>:</span>
                                        </el-table-column>
                                        <el-table-column>
                                            <template #default="scope">
                                                <el-input v-model="Object.values(scope.row)[0]" :disabled="true">
                                                    <template #prepend>参数值</template>
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="接口名称" prop="interfaceName"/>
                    <el-table-column label="接口IP" prop="interfaceIp"/>
                    <el-table-column label="接口端口" prop="interfacePort"/>
                    <el-table-column label="接口url" prop="interfaceUrl"/>
                    <el-table-column label="接口方法" prop="interfaceMethod"/>
                    <!-- <el-table-column label="接口请求头信息" prop="interfaceHeader"/>
                    <el-table-column label="接口必要参数" prop="interfaceRequirementParam"/> -->
                    <!-- <el-table-column label="备注" :show-overflow-tooltip="true" prop="remark"/> -->
                    <el-table-column label="操作"  class-name="small-padding fixed-width">
                        <template #default="scope">
                            <el-button
                                type="text"
                                icon="Edit"
                                @click="handleUpdate(scope.row)"
                            >修改</el-button>
                            <el-button
                                type="text"
                                icon="Delete"
                                @click="handleDelete(scope.row)"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total>0" :total="total" v-model:page="pageNum" v-model:limit="pageSize" @pagination="getInterFace"/>
            </el-row>
            <el-dialog width="1100px" v-model="open">
                <el-form :rules="rules" :model="form" label-width="100px" ref="deptRef">
                    <el-row :gutter="15">
                        <el-col :span="12">
                            <el-form-item label="接口名称" prop="interfaceName">
                                <el-input style="width:100%"  v-model="form.interfaceName"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="接口服务IP" prop="interfaceIp">
                                <el-input style="width:100%"  v-model="form.interfaceIp"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="15">
                        <el-col :span="12">
                            <el-form-item label="接口服务端口"   prop="interfacePort">
                                <el-input style="width:100%" @keyup="replaceNumber(form.interfacePort)" v-model="form.interfacePort"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="接口url" prop="interfaceUrl">
                                <el-input style="width:100%"  v-model="form.interfaceUrl"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="15">
                        <el-col :span="12">
                            <el-form-item label="接口方法" prop="interfaceMethod">
                                <!-- <el-input style="width:100%"  v-model="form.interfaceMethod"/> -->
                                <el-select style="width:100%" v-model="form.interfaceMethod">
                                    <el-option
                                        v-for="item in methodOptions"
                                        :value="item.value"
                                        :key="item.value"
                                        :label="item.label"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="备注" prop="remark">
                                <el-input type="textarea" style="width:100%"  v-model="form.remark"/>
                            </el-form-item>
                        </el-col>  
                    </el-row>
                    <el-row :gutter="15">
                        <el-col :span="12">
                            <span style="font-size:12px;font-weight:700;padding-left:28px">请求头信息</span>
                            <span @click="addHeaderItem" class="pointIcon" style="font-size:16px;float:right"><el-icon><CirclePlus /></el-icon></span>
                            <el-divider />
                            <el-table @contextmenu.prevent @row-contextmenu="deleteHeader" :data="form.interfaceHeaderArray" :show-header="false">
                                <el-table-column>
                                    <template #default="scope">
                                        <el-input v-model="scope.row.key">
                                            <template #prepend>配置名</template>
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column width="20px">
                                    <span>:</span>
                                </el-table-column>
                                <el-table-column>
                                    <template #default="scope">
                                        <el-input v-model="scope.row.value">
                                            <template #prepend>配置值</template>
                                        </el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                        <el-col :span="12">
                            <span style="font-size:12px;font-weight:700;padding-left:42px">必要参数</span>
                            <span @click="addParamItem" class="pointIcon" style="font-size:16px;float:right"><el-icon><CirclePlus /></el-icon></span>
                            <el-divider />
                            <el-table @contextmenu.prevent @row-contextmenu="deleteParam" :data="form.interfaceRequirementParamArray" :show-header="false">
                                <el-table-column>
                                    <template #default="scope">
                                        <el-input v-model="scope.row.key">
                                            <template #prepend>参数名</template>
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column width="20px">
                                    <span>:</span>
                                </el-table-column>
                                <el-table-column>
                                    <template #default="scope">
                                        <el-input v-model="scope.row.value">
                                            <template #prepend>参数值</template>
                                        </el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button type="primary" @click="submitForm">确 定</el-button>
                        <el-button @click="cancel">取 消</el-button>
                    </div>
                </template>
            </el-dialog>
        </el-card>
    </div>
</template>
<script lang='ts' setup>
import { 
  defineComponent, 
  getCurrentInstance, 
  onMounted, 
  reactive, 
  ref,
  toRefs,
  watch 
} from 'vue';
import {listInterface,addInterface,updateInterface,deleteInterface} from '@/api/system/interface'
const { proxy } = getCurrentInstance() as any
const queryParams = ref({
    interfaceName:undefined,
    interfaceUrl:undefined
})
const departInfo = ref({
    id:null,
    deptCode:null,
    deptName:null,
    contrastType:null,
    contrastCode:null,
    contrastName:null,
});
const methodOptions = ref([
    {value:"GET",label:"GET"},
    {value:"POST",label:"POST"},
    {value:"PUT",label:"PUT"},
    {value:"DELETE",label:"DELETE"},
])
const props = defineProps({
  propData: {
   type: String,
   default: '',
  },
});
const resetQuery=() => {
  proxy.resetForm("queryRef");
  getInterFace();
}
onMounted(()=>{
    getInterFace();
})
/**
 * 表格相关
 */
const loading = ref<Boolean>(false);
interface RelationDataT{
    id:Number,
    interfaceName:string,
    interfaceIp:string,
    interfacePort:string,
    interfaceUrl:string,
    interfaceMethod:string,
    interfaceHeader:string,
    interfaceRequirementParam:string,
    remark:string,
    interfaceHeaderArray:any[],
    interfaceRequirementParamArray:any[],
    headerArray:any[],
    paramArray:any[]
}
interface tableRules{
    interfaceName:any[],
    interfaceIp:any[],
    interfacePort:any[],
    interfaceUrl:any[],
    interfaceMethod:any[]
}

const rules =  ref<tableRules>({
    interfaceName:[{required:true,message:"接口名称不能为空",trigger:"blur"}],
    interfaceIp:[{required:true,message:"接口IP不能为空",trigger:"blur"}],
    interfacePort:[{required:true,message:"接口端口不能为空",trigger:"blur"}],
    interfaceUrl:[{required:true,message:"接口url不能为空",trigger:"blur"}],
    interfaceMethod:[{required:true,message:"接口方法不能为空",trigger:"blur"}]
})
const relationData = ref<RelationDataT[]>([
])
/**
 * 数据操作
 */
const total = ref<Number>(0);
const pageNum = ref<Number>(1);
const pageSize = ref<Number>(20);
const open = ref<Boolean>(false);
const single = ref<Boolean>(true);
const multiple = ref<Boolean>(true);
const ids = ref<Number[]>();
const showSearch = ref<Boolean>(true);
const form = ref<RelationDataT>({
    id:undefined,
    interfaceName:undefined,
    interfaceIp:undefined,
    interfacePort:undefined,
    interfaceUrl:undefined,
    interfaceMethod:undefined,
    interfaceHeader:undefined,
    interfaceRequirementParam:undefined,
    interfaceHeaderArray:[],
    interfaceRequirementParamArray:[],
    headerArray:undefined,
    paramArray:undefined,
    remark:undefined,
});

const handleSelectionChange = (selection:RelationDataT[])=>{
    ids.value = selection.map(item =>item.id)
    single.value = selection.length !=1;
    multiple.value = !selection.length;
}
const handleAdd = ()=>{
    reset();
    open.value = true;
}

const replaceNumber = (val)=>{
    form.value.interfacePort=val.replace(/[^\.\d]/g,'')
}
const handleUpdate = (row:RelationDataT)=>{
    row.interfaceHeaderArray = [];
    row.interfaceRequirementParamArray = [];
    row.headerArray.forEach(item=>{
        row.interfaceHeaderArray.push({'key':Object.keys(item)[0],'value':Object.values(item)[0]});
    })
    row.paramArray.forEach(item=>{
        row.interfaceRequirementParamArray.push({'key':Object.keys(item)[0],'value':Object.values(item)[0]});
    })
    form.value = row;
    open.value = true;
}
const submitForm = () =>{
    proxy.$refs["deptRef"].validate(valid =>{
        if(valid) {
            form.value.headerArray = [];
            form.value.interfaceHeaderArray.forEach(item=>{
                let a = {};
                a[item.key] = item.value;
                form.value.headerArray.push(a)
            });
            form.value.paramArray = [];
            form.value.interfaceRequirementParamArray.forEach(item=>{
                let a = {};
                a[item.key] = item.value;
                form.value.paramArray.push(a);
            })
            if(form.value.id !=undefined) {
                updateInterface(form.value).then(response=>{
                    proxy.$modal.msgSuccess("更新成功");
                    open.value = false;
                    getInterFace();
                })
            }else{
                addInterface(form.value).then(response =>{
                    proxy.$modal.msgSuccess("新增成功");
                    open.value = false;
                    getInterFace();
                })
            }
        }
    })
}
const addHeaderItem = ()=>{
    form.value.interfaceHeaderArray.push({});
}
const addParamItem = () =>{
    form.value.interfaceRequirementParamArray.push({});
}
const getInterFace = () =>{
    let data = {
        size:null,
        data:queryParams.value,
        current:null,
    };
    data.size = pageSize.value;
    data.current = pageNum.value;
    listInterface(data).then(response=>{
        relationData.value = response.rows;
        total.value = Number(response.total);
    })
}
const handleDelete = (row:RelationDataT)=>{
    const relationIds = row.id
    proxy.$modal.confirm('是否确认删除id为"'+relationIds+'"的接口数据?').then(function () {
    }).then(()=>{
        deleteInterface({id:relationIds}).then(response=>{
            proxy.$modal.msgSuccess("删除成功");
            getInterFace();
        })
    }).catch(()=>{});
};
const cancel = () =>{
    reset();
    open.value = false;
}
const deleteHeader = (row)=>{
    form.value.interfaceHeaderArray.splice(form.value.interfaceHeaderArray.indexOf(row),1);
}
const deleteParam = (row) =>{
    form.value.interfaceRequirementParamArray.splice(form.value.interfaceRequirementParamArray.indexOf(row),1);
}
const reset = () =>{
    form.value = {
        id:undefined,
        interfaceName:undefined,
        interfaceIp:undefined,
        interfacePort:undefined,
        interfaceUrl:undefined,
        interfaceMethod:undefined,
        interfaceHeader:undefined,
        interfaceRequirementParam:undefined,
        remark:undefined,
        interfaceHeaderArray:[],
        interfaceRequirementParamArray:[],
        headerArray:[],
        paramArray:[],
    }
}
const data2 = ref('')//定义普通类型
</script>

<style scoped>
    :v-deep(.el-divider--horizontal) {
        margin: 11px 0;
    }
    .pointIcon{
        cursor:pointer
    }
    .pointIcon:hover{
        color: blue;
    }
    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    }
</style>