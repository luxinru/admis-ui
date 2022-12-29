<template>
  <el-dialog :title="title" v-model="attachmentOpen" width="400px" append-to-body>
    <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls, .png" :headers="headers.value"
               :action="url.value" :disabled="isUploading"
               :data="dataValue.value"
               :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <span>仅允许导入xls、xlsx、.png格式。</span>
        </div>
      </template>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitUpload">确 定</el-button>
        <el-button @click="attachmentCancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { getToken } from "@/utils/auth";
import deepCopy from 'lodash'
// 标题
const title=ref(null);
const attachmentOpen = ref(false);
const isUploading = ref(false);
const headers = ref({ Authorization: "Bearer " + getToken() });
const url = ref("http://localhost:8010" + "/assets/house/repair/invoice/upload");
const fileList = ref([]);
const dataValue= ref({ywlx: "ywlxxxxxxxx"});
const { proxy } = getCurrentInstance();
const emit = defineEmits(['handleEdit']);
defineExpose({
  editOpen
});
// 新增打开方法
function editOpen(titleStr) {
  attachmentOpen.value = true;
  title.value = titleStr;
}
// 关闭按钮
function close() {
  attachmentOpen.value = false;
}

function submitUpload() {
  // attachmentOpen.value = false;
  proxy.$refs["uploadRef"].submit();
  alert(url.value);
}
function attachmentCancel() {
  attachmentOpen.value = false;
}
// 文件上传中处理
function handleFileUploadProgress(event, file, fileList) {
  isUploading.value = true;
}
// 文件上传成功处理
function handleFileSuccess(response, file, fileList) {
  isUploading.value = false;
  alert(response.msg);
}
</script>
