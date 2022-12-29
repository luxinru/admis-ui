<template>
  <div>
    <el-button type="primary" style="margin-left: 16px" @click="drawer = true">查看流程</el-button>
    <flow-chart :drawer="drawer" invoice-number="a" invoice-status=7 :flow="data" @drawer:close="drawer=false"></flow-chart>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FlowChart from "@/components/FlowChart";
const drawer = ref(false)
const data = JSON.stringify([{
  "name":"节点11111",
  "number" : "1",
  "shenpi" : false
},{
  "name":"节点22222",
  "number" : "2",
  "shenpi" : true
},{
  "name":"节点33333",
  "number" : "3",
  "shenpi" : false
},{
  "name":"节点44444",
  "number" : "4",
  "shenpi" : false
},{
  "name":"节点55555",
  "number" : "5",
  "shenpi" : false
},{
  "name":"节点66666",
  "number" : "6",
  "shenpi" : false
},{
  "name":"节点77777",
  "number" : "7",
  "shenpi" : false
},{
  "name":"节点88888",
  "number" : "8",
  "shenpi" : false
},{
  "name":"节点99999",
  "number" : "9",
  "shenpi" : false
},{
  "name":"节点99999",
  "number" : "10",
  "shenpi" : false
},{
  "name":"节点99999",
  "number" : "11",
  "shenpi" : false
},{
  "name":"节点99999",
  "number" : "12",
  "shenpi" : false
},{
  "name":"节点99999",
  "number" : "13",
  "shenpi" : false
}]);


</script>

<style scoped>

</style>