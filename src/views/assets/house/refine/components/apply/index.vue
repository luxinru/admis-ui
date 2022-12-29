<template>
  <el-dialog :title="title" v-model="open" width="40%" top="5vh" append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="复制数量" prop="copyNumber">
            <el-input v-model="form.copyNumber" placeholder="请输入内容"></el-input>
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
const title=ref(null);
// 选中数组
const ids=ref([]);
// 是否显示弹出层
const open=ref(false);
// 业务表单
const form=ref({});
// 表单校验
const rules=ref({
  copyNumber: [
    { required: true, message: "复制数量", trigger: "blur" },
    {
      pattern: /^[0-9]*[1-9][0-9]*$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
});

const { proxy } = getCurrentInstance();
const emit = defineEmits(['handleCopy']);
defineExpose({
  show
})
function test(obj) {
  formCheck.value = obj;
}
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
      emit('handleCopy', form.value.copyNumber);
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
    copyNumber: null
  }
}
</script>
