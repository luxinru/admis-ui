<template>
  <el-dialog :title="title" v-model="open" width="40%" top="5vh" append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="退回意见" prop="returnAuditOpinion">
            <el-input v-model="form.returnAuditOpinion" type="textarea" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm()" v-if="!visible">提 交</el-button>
        <el-button @click="close()">关 闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>

const formCheck = ref(false);
// 标题
const title=ref(null)
// 选中数组
const ids=ref([])
// 是否显示弹出层
const open=ref(false)
// 业务表单
const form=ref({})
// 表单校验
const rules=ref({
  returnAuditOpinion: [
    { required: true, message: "退回意见不能为空", trigger: "blur" }
  ],
});

const { proxy } = getCurrentInstance();
const emit = defineEmits(['handleAudit'])
defineExpose({
  show
})
// 新增打开方法
function show(titleStr) {
  reset();
  open.value = true;
  title.value = titleStr;
}
// 提交按钮
function submitForm() {
  proxy.$refs["formRef"].validate(valid => {
    if (valid) {
      emit('handleAudit', form.value.returnAuditOpinion);
      close();
    }
  });
}
// 关闭按钮
function close() {
  reset();
  open.value = false;
}
// 重置表单
function reset() {
  form.value = {
    returnAuditOpinion: null
  }
}
</script>
