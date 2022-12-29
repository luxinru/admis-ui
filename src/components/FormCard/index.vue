<template>
  <el-dialog
    v-if="open"
    :title="title"
    v-model="open"
    width="85vw"
    top="5vh"
    append-to-body
    :close-on-click-modal='false'
    @open="onOpenDialog"
    @close="oncloseDialog"
  >
    <el-row>
      <el-col :span="2">
        <div class="list-menu">
          <div
            class="menu-item"
            v-for="item in listMenu"
            :key="item.id"
            :class="item.id === currMenuId ? 'active' : ''"
            @click="scrollInto(item.id)"
          >
            <span class="title-text">{{ item.text }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="22">
        <slot></slot>
      </el-col>
    </el-row>
    <template #footer>
      <slot name="dialogFooter">
        <div class="dialog-footer">
          <div class="opera-btn">
            <el-button type="primary" @click="saveSubmitForm">确 定</el-button>
            <el-button @click="close">取 消</el-button>
          </div>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup name="index">
// 声明调用方（父组件）变量
const emit = defineEmits(['saveSubmitForm', 'clickItem']);
const props = defineProps({
  title: {
    type: String,
    default: '卡片'
  },
  listMenu: {
    type: Array,
    default: () => []
  }
});
// 导出相关方法
defineExpose({
  add,
  close
})
// 弹窗显示隐藏状态
const open = ref(false);
// 当前菜单id
let currMenuId = ref(props.listMenu[0].id)
// 打开弹窗
function add() {
  open.value = true;
}
// 关闭弹窗
function close() {
  open.value = false;
}
// 监听打开弹窗事件
function onOpenDialog() {

}
// 监听关闭弹窗事件
function oncloseDialog() {

}
// 设置滚动位置
function scrollInto(id) {
  currMenuId.value = id;
  document.getElementById(id).scrollIntoView({
    behavior: "smooth",  // 平滑过渡
    block: "start"  // 上边框与视窗顶部平齐。默认值
  });
  emit('clickItem', currMenuId)
}

// 提交确定
function saveSubmitForm() {
  // 回调父组件传递的方法
  emit('saveSubmitForm');
}

</script>

<style lang="scss" scoped>
.list-menu {
  position: fixed;
  height: 100%;

  .menu-item {
    line-height: 40px;
    font-weight: 700;
    cursor: pointer;

    &.active, &:hover {
      color: var(--el-color-primary);
    }
  }
}

</style>
