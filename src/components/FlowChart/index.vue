<template>
  <el-drawer v-model="drawer" title="业务流程" size="60%" direction="btt" :before-close="handleClose" @opened="opened">
    <!--图例-->
    <el-row class="row-bg" justify="end">
      <el-col style="display: flex;" :span="2">已处理<div  style="width: 40px; height:100%;background: #97a8be" /></el-col>
      <el-col style="display: flex;" :span="2">处理中<div  style="width: 40px; height:100%;background: green" /></el-col>
      <el-col style="display: flex;" :span="2">未处理<div  style="width: 40px; height:100%;background: #b3e5fc" /></el-col>
    </el-row>
    <!-- 流程图 -->
    <div id="demo-tiger">
      <div class="mermaid"></div>
    </div>
    <!-- 审批流程 -->
    <el-drawer
      size="50%"
      direction="btt"
      v-model="innerDrawer"
      title="审批流程"
      :append-to-body="true"
    ></el-drawer>
  </el-drawer>
</template>

<script setup>
import mermaid from "mermaid";
import svgPanZoom from 'svg-pan-zoom'
import {getCurrentInstance, onMounted} from "vue";

const {proxy} = getCurrentInstance();

const props = defineProps({
  invoiceNumber: String,
  invoiceStatus: Number,
  flow: String,
  drawer: Boolean
})

//声明抽屉关闭事件
defineEmits(['drawer:close'])

// const data = [{
//   "name":"节点111",
//   "number" : "1",
//   "shenpi" : false
// },{
//   "name":"节点2",
//   "number" : "2",
//   "shenpi" : true
// },{
//   "name":"节点3",
//   "number" : "3",
//   "shenpi" : false
// }];

//业务流程定义数据，包含节点名称，节点单据编号，是否是审批节点
const data = JSON.parse(props.flow);

const innerDrawer = ref(false);
//点击审批节点的回调事件
const callback = function () {
  //展开内层抽屉
  innerDrawer.value = true
};

//将vue内部方法输出到全局，供mermaid调用
onMounted(() => {
  window.callback = callback;

})

//业务流程打开回调
function opened() {
  console.log("业务流程抽屉已打开")
  //构建流程图
  build();
  svgPanZoom('#mermaid')
}

//业务流程关闭回调
const handleClose = (done) => {
  //发送关闭事件，通知父组件
  proxy.$emit('drawer:close')
}

//构建svg图片字符串
function build() {
  //声明图片类型和方向
  let markdown = "flowchart LR \n";
  for (let index in data) {
    markdown += index + "((" + data[index].name + ")) " + "-->";
  }
  markdown = markdown.substring(0, markdown.length - 3);
  //设置点击事件
  for (let index in data) {
    if (data[index].shenpi) {
      markdown += "\n";
      markdown += "click " + index + " callback"
    }
  }

  //设置样式
  for (let index in data) {
    if (data[index].shenpi) {
      markdown += "\n";
      markdown += "class " + index + " cssClass"
    }
  }
  markdown += "\n";
  markdown += "classDef cssClass fill:#f9f,stroke:#333,stroke-width:4px;"

  let element = document.querySelector('.mermaid')
  console.log(element)
  // const insertSvg = ;
  mermaid.mermaidAPI.render(
      "mermaid",
      markdown,
      (svgCode, bindFunctions) => {
        //将svg图片输出到指定元素中
        element.innerHTML = svgCode;
        //绑定click事件
        bindFunctions(element);
      }
  );
}

//初始化mermaid
function init() {
  mermaid.initialize({
    securityLevel: "loose",
    wrap: true
  });
}

init();

</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
