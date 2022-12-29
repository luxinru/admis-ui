<template>
  <el-dialog :title="title" v-model="open" width="80%" top="5vh" append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="7">
          <el-form-item label="开工时间" prop="startDate">
            <el-date-picker
                    v-model="form.startDate" @change="compareStartDatePlan"
                    type="date"
                    value-format="YYYY-MM-DD"
                    placeholder="请选择时间"/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="完工时间" prop="endDate">
            <el-date-picker
                    v-model="form.endDate" @change="compareStopDatePlan"
                    type="date"
                    value-format="YYYY-MM-DD"
                    placeholder="请选择时间"/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="工程进度" prop="projectProgress">
            <el-input v-model="form.projectProgress" placeholder="请输入整数%"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="结算金额" prop="settleMoney">
            <el-input v-model="form.settleMoney" placeholder="请输入内容" maxlength="11"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="合同编号" prop="contractCode">
            <el-input v-model="form.contractCode" placeholder="请输入内容" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="合同名称" prop="contractName">
            <el-input v-model="form.contractName" placeholder="请输入内容" maxlength="15"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="合同金额" prop="contractMoney">
            <el-input v-model="form.contractMoney" placeholder="请输入内容" maxlength="11"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="项目编号" prop="projectCode">
            <el-input v-model="form.projectCode" placeholder="请输入内容" maxlength="20" :disabled="show"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="form.projectName" placeholder="请输入内容" maxlength="15" :disabled="show"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="实施维护日期" prop="implementDate">
            <el-date-picker
                    v-model="form.implementDate"
                    type="date"
                    value-format="YYYY-MM-DD"
                    placeholder="请选择时间"/>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="实施维护意见" prop="implementOpinion">
            <el-input v-model="form.implementOpinion" placeholder="请输入内容" maxlength="150"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm()">提 交</el-button>
        <el-button @click="close()">关 闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import deepCopy from 'lodash'
// 标题
const title=ref(null);
// 选中数组
const ids=ref([]);
// 是否显示弹出层
const open=ref(false);
// 业务表单
// const form =ref({});
// 定义表单数据
const formData = reactive({
  form: {}
});
const { form } = toRefs(formData);
// 表单校验
const rules=ref({
  projectProgress: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^(\d|[1-9]\d|100)$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  settleMoney: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ],
  contractMoney: [
    { required: false, message: "请输入正确的数值", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{2})?$/,
      message: "请输入正确的数值",
      trigger: "blur"
    }
  ]
});

const show = ref(false);
const { proxy } = getCurrentInstance();
const emit = defineEmits(['handleEdit']);
defineExpose({
  editOpen
});
// 新增打开方法
function editOpen(formData, titleStr, source) {
  if(source == 'detail'){
    show.value = true;
  }
  reset();
  form.value = formData;
  open.value = true;
  title.value = titleStr;
}
// 提交按钮
function submitForm() {
  proxy.$refs["formRef"].validate(valid => {
    if (valid) {
      emit('handleEdit',deepCopy.cloneDeep(form));
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
    startDate: null,
    endDate: null,
    projectProgress: null,
    settleMoney: null,
    contractCode: null,
    contractName: null,
    contractMoney: null,
    projectCode: null,
    projectName: null,
    implementDate: null,
    implementOpinion: null
  };
  proxy.resetForm("formRef");
}

function compareStartDatePlan(value) {
  if(Date.parse(form.value.startDate)>=Date.parse(form.value.endDate)){
    proxy.$modal.msgError("开工时间需小于完工时间，请重新选择");
    form.value.startDate=null;
  }
}

function compareStopDatePlan(value) {
  if(Date.parse(form.value.startDate)>=Date.parse(form.value.endDate)){
    proxy.$modal.msgError("完工时间需大于开工时间，请重新选择");
    form.value.endDate=null;
  }
}

</script>
