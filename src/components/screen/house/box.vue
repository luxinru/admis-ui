<template>
  <div class="box_root">
    <section class="title">
      <img class="bac" src="@/assets/images/screen/title-1.png" alt="" />
      <span class="name">{{ title }}</span>

      <!-- <div class="more" @click="onMoreClick">
        <span>More</span>
        <img src="@/assets/images/screen/more-1.png" alt="" />
      </div> -->
    </section>

    <section class="content">
      <slot />
    </section>
  </div>
</template>

<script setup name="Box">
import bus from "vue3-eventbus";

const props = defineProps({
  // 数据
  title: {
    type: String,
    default: "标题",
  },
});

const title = computed(() => {
  return props.title;
});

function onMoreClick() {
  bus.emit("onModalShow");
}
</script>

<style scoped lang="scss">
.box_root {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .title {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 62px;
    display: flex;

    .bac {
      position: absolute;
      height: 100%;
      top: 0;
      left: 0;
    }

    .name {
      position: relative;
      flex: 1 0;
      font-size: 22px;
      font-family: YouSheBiaoTiHei;
      font-weight: 400;
      line-height: 45px;
      background: linear-gradient(0deg, #82c1ff 10%, #ffffff 80%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-left: 50px;
    }

    .more {
      position: relative;
      display: flex;
      align-items: center;
      margin-right: 5px;
      line-height: 55px;
      cursor: pointer;

      span {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(220, 237, 255, 0.7);
        line-height: 55px;
      }

      img {
        height: 15px;
        margin-left: 2px;
      }
    }
  }

  .content {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      0deg,
      rgba(5, 45, 110, 0.66),
      rgba(1, 18, 40, 0.66)
    );
    border: 1px solid;
    border-image: linear-gradient(
        0deg,
        rgba(58, 98, 157, 0.86),
        rgba(34, 50, 70, 0.86)
      )
      1 1;
    border-radius: 6px;
    box-sizing: border-box;
    padding-top: 57px;
  }
}
</style>
