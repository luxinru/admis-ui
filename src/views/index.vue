<template>
  <div class="app-container home">
    <el-image :src="indexImage" style="width:84vw;height: 82vh" fit="cover" />
    <el-dialog title="切换单位" :append-to-body='true' width="1000px" v-model="open" :close-on-click-modal='false'
               :before-close="handleDialogClose">
      <div class="dialogDiv" style="height:550px">
        <switch-dept @selectCallBack="closeDialog"></switch-dept>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="Index">
import {getSessionStorage} from "@/utils/sessionStorage"
import {onMounted, ref} from "vue"
import SwitchDept from '@/components/Depart/switchDept'
import indexImage from '@/assets/images/index.jpg';

const departCode = ref(null)
const {proxy} = getCurrentInstance();
const open = ref(false);
const version = ref('3.6.0')
onMounted(() => {
  getDeptSession()
})
const getDeptSession = () => {
  departCode.value = getSessionStorage('departCode');
  if (departCode.value == null) {
    open.value = true;
  }
}
const closeDialog = (value) => {
  open.value = value;
  proxy.$modal.msgSuccess("切换成功")
}
const handleDialogClose = () => {
  departCode.value = getSessionStorage('departCode');
  if (departCode.value == null) {
    proxy.$modal.msgError("必须选择单位");
    return;
  } else {
    open.value = false;
  }
}

function goTarget(url) {
  window.open(url, '__blank')
}
</script>


<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

