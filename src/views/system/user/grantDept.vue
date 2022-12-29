<template>
  <div class="app-container">
    <h4 class="form-header h4">基本信息</h4>
    <el-form :model="form" label-width="80px">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="form.nickName" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="form.userName" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h4 class="form-header h4">部门信息<span><el-input style="width:12%;margin-left:15px" v-model="search"
                                                       placeholder="输入部门编码筛选"><template #append><el-button
        style="cursor:pointer" @click="getDeptRelation" :icon="Search"/></template></el-input></span></h4>
    <el-table border height="calc(100vh - 500px)" v-loading="loading" :row-key="getRowKey" @row-click="clickRow"
              ref="deptRef" @selection-change="handleSelectionChange" :data="relationData">
      <el-table-column label="序号" width="55" type="index" align="center">
        <template #default="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
      <el-table-column prop="departCode">
        <template #header>
          <span>部门编码<i class="el-icon-arrow-down"></i></span>
        </template>
      </el-table-column>
      <el-table-column label="部门名称" prop="departName"/>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
                @pagination="getDeptRelation"/>
    <el-form label-width="100px">
      <div style="text-align: center;margin-left:-120px;margin-top:30px;">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="close()">返回</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { getRelation, saveRelation} from "@/api/system/user";
import { ref, reactive} from "vue";
import {Search} from '@element-plus/icons-vue'

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: null
  }
});
const {queryParams} = toRefs(data);
const departList = ref([]);
const userId = ref("");
const relationData = ref([]);
const route = useRoute();
const {proxy} = getCurrentInstance();
const {sys_normal_disable} = proxy.useDict("sys_normal_disable");
const loading = ref(true);
const total = ref(0);
const deptRef = ref(null);
const search = ref(null);
const form = ref({
  nickName: undefined,
  userName: undefined,
  userId: undefined
});

/** 单击选中行数据 */
function clickRow(row) {
  proxy.$refs["deptRef"].toggleRowSelection(row);
};

/** 保存选中的数据编号 */
function getRowKey(row) {
  return row.departCode;
};

/** 关闭按钮 */
function close() {
  const obj = { path: "/system/user" };
  proxy.$tab.closeOpenPage(obj);
};

/** 提交按钮 */
function submitForm() {
  let data = {};
  data.user = {
    userId:userId.value,
    userName:form.value.userName
  };
  data.departList = [];
  deptRef.value.getSelectionRows().forEach(item => {
    data.departList.push(item);
  });
  saveRelation(data).then(response => {
    proxy.$modal.msgSuccess("关联成功");
    close();
  });
};

function getDeptRelation() {
  loading.value = true;
  getRelation(queryParams.value).then(response => {
    relationData.value = response.rows
    total.value = response.total
    selectRows();
  })
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  departList.value = selection;
};

function selectRows() {
  deptRef.value.clearSelection();
  relationData.value.forEach((item, index) => {
    if (item.userId !== undefined && item.userId !== null) {
      console.log(item, index)
      deptRef.value.toggleRowSelection(item);
    }
  });
  loading.value = false;
}

onMounted(() => {
  //给表格赋值
  form.value = route.params;
  userId.value = route.params.userId;
  //设置查询参数
  queryParams.value.userId = route.params.userId;
  getDeptRelation();
});
</script>
