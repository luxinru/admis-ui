<template>
  <el-dialog :title="title" v-model="open" width="40%" top="5vh" append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="审批（退回）原因" prop="returnAuditOpinion">
            <el-input v-model="form.returnAuditOpinion" type="textarea" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="审批意见" prop="auditOpinion">
            <el-radio-group v-model="form.auditOpinion" placeholder="请选择贴码状态" @change="test">
              <el-radio :label=true>通过</el-radio>
              <el-radio :label=false>否决</el-radio>
            </el-radio-group>
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
import { nextTick } from 'vue'
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
  auditOpinion: [
    { required: true, message: "审批意见不能为空", trigger: "blur" }
  ],
  returnAuditOpinion: [
    { required: true, message: "审批（退回）原因不能为空", trigger: "blur" }
  ],
});

const { proxy } = getCurrentInstance();
const emit = defineEmits(['handleAudit']);
defineExpose({
  show
})
function test(obj) {
  formCheck.value = obj;
  if (obj) {
    rules.value.returnAuditOpinion[0].required = false;
  } else {
    rules.value.returnAuditOpinion[0].required = true;
  }
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
      emit('handleAudit',form.value.auditOpinion,form.value.returnAuditOpinion);
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
    auditOpinion: null,
    returnAuditOpinion: null
  };
  nextTick(() => {
    proxy.$refs["formRef"].resetFields()
  });
}
</script>
