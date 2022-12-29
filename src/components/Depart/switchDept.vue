<!--
 * @Author: Weizheng
 * @Date: 2022-08-30 10:32:09
 * @LastEditTime: 2022-11-08 09:20:04
 * @LastEditors: WeiZheng
 * @Description: 
 * @FilePath: \petro-gsms-device-web\src\components\Depart\switchDept.vue
-->
<template>
  <div style="height:100%">
    <el-table border height='100%' row-key="deptId"
              :default-expand-all="info.expand!=null&&info.expand!=undefined?info.expand:false"
              :tree-props="{ children: 'children'}" v-loading="loading" @row-dblclick="handleDept" :data="deptData">
      <el-table-column label="部门编码" prop="departCode"/>
      <el-table-column label="部门名称" prop="departName"/>

    </el-table>
  </div>
</template>
<script setup>
import {
  computed,
  getCurrentInstance,
  onMounted, reactive,
  ref,
  toRefs
} from 'vue';
import {setSessionStorage} from '@/utils/sessionStorage'
import {getMyRelation, getRelation} from "@/api/system/user"

const {proxy} = getCurrentInstance()
const emit = defineEmits(['selectCallBack'])
const search = ref(null)
const loading = ref(false);
const props = defineProps({
  //子组件接收父组件传递过来的值
  info: {
    type: Object,
    default: {}
  },
});
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  }
});
const {queryParams} = toRefs(data);
const {info} = toRefs(props)

onMounted(() => {
  loading.value = true;

  getMyRelation(queryParams.value).then(response => {
    deptData.value = response.rows;
    loading.value = false;
  })
})
const deptData = ref([]);
const filterDeptData = computed(() => deptData.value.filter(
    (data) => !search.value || data.departCode.toLowerCase().includes(search.value.toLowerCase())
))
const handleDept = (row, column, event) => {
  proxy.$modal.confirm('是否要切换用户的单位').then(() => {
  }).then(() => {
    setSessionStorage("departCode", row.departCode);
    setSessionStorage("departName", row.departName);
    emit('selectCallBack', false);
  }).catch(() => {
  });
}
</script>

<style scoped>

</style>