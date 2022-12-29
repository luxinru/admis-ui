<!--
 * @Author: Weizheng
 * @Date: 2022-08-18 13:56:52
 * @LastEditTime: 2022-09-15 09:38:38
 * @LastEditors: WeiZheng
 * @Description: 
 * @FilePath: \petro-gsms-device-web\src\views\system\interfaceManage\interfaceGroup.vue
-->
<template>
   <el-card style="height:calc(100vh - 85px)">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
        <el-form-item label="接口组名称" prop="interfaceTeamName">
            <el-input
                v-model="queryParams.interfaceTeamName"
                placeholder="请输入接口组名称"
                @keyup.enter="getInterFaceGroupList"
            />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="Search" @click="getInterFaceGroupList">搜索</el-button>
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
        <el-col :span="1.5">
            <el-button
                type="danger"
                plain
                icon="Delete"
                :disabled="multiple"
                @click="handleDelete"
            >删除</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getInterFace"></right-toolbar>
      </el-row>
      <el-row :gutter="10">
         <h4 style="width:100%" class="form-header h4"></h4>
            <el-table border height="calc(100vh - 300px)" @selection-change="handleSelectionChange" stripe :data="groupTableData">
               <el-table-column type="selection" width="40" align="center" />
               <el-table-column  prop="interfaceTeamName" :show-overflow-tooltip="true" label="接口组名称"/>
               <el-table-column  prop="interfaceTeamCode" :show-overflow-tooltip="true" label="接口组标识"/>
               <el-table-column  prop="isSync" :show-overflow-tooltip="true" label="是否同步">
                    <template #default="scope">
                        <el-tag type="success" v-if="scope.row.isSync==1">{{syncMap[scope.row.isSync]}}</el-tag>
                        <el-tag type="error" v-else>{{syncMap[scope.row.isSync]}}</el-tag>
                    </template>
               </el-table-column>
               <el-table-column  prop="callbackUrl" :show-overflow-tooltip="true" label="回调url"/>
               <!-- <el-table-column header-align="center" :show-overflow-tooltip="true" prop="remark" label="备注"/> -->
               <el-table-column label="操作" class-name="small-padding fixed-width">
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
            <pagination v-show="total>0" :total="total" v-model:page="pageNum" @pagination="getInterfaceGroup"/>
      </el-row>
      <el-dialog width="800px" v-model="open">
        <el-form label-width="100px" :rules="rules" :model="form" ref="interfaceForm">
            <el-row :gutter="15">
                <el-col :span="12">
                    <el-form-item label="接口组名称" prop="interfaceTeamName">
                        <el-input style="width:100%" v-model="form.interfaceTeamName"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="接口组标识" prop="interfaceTeamCode">
                        <el-input style="width:100%" v-model="form.interfaceTeamCode"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="15">
                <el-col :span="12">
                    <el-form-item label="是否同步" prop="isSync">
                        <!-- <el-input style="width:100%" v-model="form.isSync"/> -->
                        <el-select @change="changeSync(form)" v-model="form.isSync" style="width:100%">
                            <el-option
                                v-for="item in syncOptions"
                                :value="item.value"
                                :key="item.value"
                                :label="item.label"/>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="回调url" prop="callbackUrl">
                        <el-input style="width:100%" :disabled="form.isSync==0" v-model="form.callbackUrl"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row >
                <el-col>
                    <el-form-item :show-overflow-tooltip="true" label="备注" prop="remark">
                        <el-input type="textarea" style="width:100%" v-model="form.remark"/>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
        <h4 style="width:100%" class="form-header" h4>接口列表</h4>
        <el-table border stripe ref="interfaceGroupTable" :row-key="getRowKey" :data="interfaceTableData">
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column  prop="interfaceName" label="接口名称"/>
            <el-table-column  prop="interfaceIp" label="服务IP"/>
            <el-table-column  prop="interfacePort" label="服务端口"/>
            <el-table-column  :show-overflow-tooltip="true" prop="interfaceUrl" label="接口url"/>
            <el-table-column  prop="interfaceMethod" label="接口方法"/>
            <el-table-column label="排序"  width="60px">
                <template #default="scope">
                    <el-popover placement="left" trigger="click">
                        <el-input-number size="small" v-model="scope.row.interfaceSort" :min="0" :max="30" />
                        <template #reference>
                            <span class="sortIcon">{{scope.row.interfaceSort}}</span>
                        </template>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="interfaceTotal>0" :total="interfaceTotal" v-model:page="interfacePageNum" @pagination="getInterFace"/>
    </el-dialog>
   </el-card>
</template>
<script setup lang='ts'>
import { 
  defineComponent, 
  getCurrentInstance, 
  nextTick, 
  onMounted, 
  reactive, 
  ref,
  toRefs 
} from 'vue';
import {addInterfaceGroup,updateInterfaceGroup,getInterfaceGroup,getInterfaceGroupRelation,deleteInterfaceGroup} from '@/api/system/interfaceGroup'
const { proxy } = getCurrentInstance() as any
const syncOptions = ref([
    {value:0,label:"是"},
    {value:1,label:"否"}
])
const syncMap = ref({
    0:"是",
    1:"否"
})
const showSearch = ref<Boolean>(true);
const total = ref<Number>(0);
const pageNum = ref<Number>(1);
const pageSize = ref<Number>(20);
const interfaceTotal = ref<Number>(0);
const interfacePageNum = ref<Number>(1);
const interfacePageSize = ref<Number>(20);
const open = ref<Boolean>(false);
const single = ref<Boolean>(true);
const multiple = ref<Boolean>(true);
const ids = ref<Number[]>();
const interfaceGroupTable = ref(null);
const interfaceForm = ref(null);
const queryParams = ref({
    interfaceTeamName:undefined,
})
onMounted(()=>{
    getInterFaceList();
    getInterFaceGroupList();
})
const resetQuery=() => {
  proxy.resetForm("queryRef");
  getInterFaceGroupList();
}
const getInterFaceGroupList = () =>{
    let param = {
        size:null,
        data:queryParams.value,
        current:null,
    }
    param.size = pageSize.value;
    param.current = pageNum.value;
    getInterfaceGroup(param).then(response=>{
        groupTableData.value = response.rows;
        total.value = Number(response.total);
    })
}

const changeSync = (val)=>{
    if(val.isSync==0){
        val.callbackUrl = ''
    }
}

const getRowKey = (row) => {
  return row.id;
};
const getInterFaceList = ()=>{
    let data = {    
        size:null,
        data:{},
        current:null,
    };
    data.size = interfacePageSize.value;
    data.current = interfacePageNum.value;
    getInterfaceGroupRelation(data).then(response=>{
        response.data.rows.forEach(item =>{
            if(item.interfaceSort==undefined||item.interfaceSort==null){
                item.interfaceSort = 0;
            }
        })
        interfaceTableData.value = response.rows;
        interfaceTotal.value = Number(response.total);
    })
}

const groupTableData = ref<interfaceGroup[]>([
]);
interface groupRules{
    interfaceTeamName:any[],
    interfaceTeamCode:any[],
    callbackUrl:any[]
}
const rules = ref<groupRules>({
    interfaceTeamName:[{required:true,message:"接口组名称不能为空",trigger:"blur"}],
    interfaceTeamCode:[{required:true,message:"接口组标识不能为空",trigger:"blur"}],
    // callbackUrl:[{required:true,message:"回调url不能为空",trigger:"blur"}],
    callbackUrl:[]
})
//接口信息表行数据对象接口
interface interfaceRowData{
   id:Number,
   interFaceName:string,
   interfaceIp:string,
   interfacePort:string,
   interfaceUrl:string,
   interfaceMethod:string,
   interfaceHeader:string,
   interfaceRequirementParam:string,
   remark:string,
   checkMark:string
}
interface interfaceGroupRelation{
    interfaceId:Number,
    interfaceSort:Number
}
interface interfaceGroup{
    id:Number,
    interfaceTeamName:string,
    interfaceTeamCode:Number,
    isSync:Number,
    callbackUrl:string,
    remark:string,
    listInterfaceRelationShipQuery:interfaceGroupRelation[],
}
const form = ref<interfaceGroup>({
    id:undefined,
    interfaceTeamName:undefined,
    interfaceTeamCode:undefined,
    isSync:undefined,
    callbackUrl:undefined,
    remark:undefined,
    listInterfaceRelationShipQuery:[]
})
const handleSelectionChange = (selection:interfaceGroup[])=>{
    ids.value = selection.map(item =>item.id);
    single.value = selection.length !=1;
    multiple.value = !selection.length;
}
const handleDelete = (row:interfaceGroup)=>{
    let deleteIds = [];
    if(row.id!=null&&row.id!=undefined){
        deleteIds.push({id:row.id})
    }else{
        ids.value.forEach(item=>{
            deleteIds.push({id:item})
        })
    }
    proxy.$modal.confirm('是否确认删除选中的接口组数据?').then(function (){
    }).then(()=>{
        deleteInterfaceGroup(deleteIds).then(response=>{
            proxy.$modal.msgSuccess("删除成功");
            getInterFaceGroupList();
        })
    }).catch(()=>{})
}
const handleUpdate = (row:interfaceGroup)=>{
    let data = {
        size:null,
        data:{id:row.id},
        current:null
    };
    data.size = interfacePageSize.value;
    data.current = interfacePageNum.value;
    getInterfaceGroupRelation(data).then(response=>{
        response.rows.forEach(item =>{
            if(item.interfaceSort==undefined||item.interfaceSort==null){
                item.interfaceSort = 0;
            }
        })
        interfaceTableData.value = response.rows;
        interfaceTotal.value = Number(response.total);
        form.value = row;
        open.value = true;
        nextTick(()=>{
            selectRows();
        })
    })
}

const selectRows = ()=>{
    interfaceGroupTable.value.clearSelection();
    interfaceTableData.value.forEach((item,index) =>{
        if(item.checkMark==='1'){
            interfaceGroupTable.value.toggleRowSelection(interfaceTableData.value[index]);
        }
    })
}

const interfaceTableData= ref<interfaceRowData[]>([
])
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  propData: {
   type: String,
   default: '',
  },
})
const submitForm = () =>{
    proxy.$refs["interfaceForm"].validate(valid=>{
        if(valid){
            form.value.listInterfaceRelationShipQuery=[];
            let sortArray = [];
            proxy.$refs["interfaceGroupTable"].getSelectionRows().forEach(item=>{
                let a:interfaceGroupRelation = {
                    interfaceId:item.id,
                    interfaceSort:item.interfaceSort
                }
                form.value.listInterfaceRelationShipQuery.push(a);
                sortArray.push(a.interfaceSort);
            })
            let noRepeatArray = Array.from(new Set(sortArray));
            if(noRepeatArray.length==sortArray.length){
                if(form.value.id!=undefined){
                    updateInterfaceGroup(form.value).then(response=>{
                        proxy.$modal.msgSuccess("更新成功");
                        open.value = false;
                        getInterFaceGroupList();
                    })
                }else{
                    addInterfaceGroup(form.value).then(response=>{
                        proxy.$modal.msgSuccess("新增成功");
                        open.value = false;
                        getInterFaceGroupList();
                    })
                }
            }else{
                proxy.$modal.msgError("存在重复排序");
            }
        }
    })
}
const cancel = () =>{
    reset();
    open.value = false;
}
const handleAdd = ()=>{
    let data = {    
        size:null,
        data:{},
        current:null,
    };
    data.size = interfacePageSize.value;
    data.current = interfacePageNum.value;
    getInterfaceGroupRelation(data).then(response=>{
        response.rows.forEach(item =>{
            if(item.interfaceSort==undefined||item.interfaceSort==null){
                item.interfaceSort = 0;
            }
        })
        interfaceTableData.value = response.rows;
        interfaceTotal.value = Number(response.total);
        reset();
        open.value = true;
    })
}
const reset = () =>{
    form.value = {
        id:undefined,
        interfaceTeamName:undefined,
        interfaceTeamCode:undefined,
        isSync:1,
        callbackUrl:undefined,
        remark:undefined,
        listInterfaceRelationShipQuery:[]
    }
}

const {data} = toRefs(reactive({
  //定义数组和对象
  data:''
 }))
const data2 = ref('')//定义普通类型
</script>

<style scoped>
.sortIcon{
   /* float: right; */
   color: blue;
}
.sortIcon:hover{
   cursor: pointer;
}
</style>