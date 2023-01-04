<template>
  <div class="classification_statistics_root">
    <Box title="分类统计">
      <div class="container">
        <section class="item">
          <div class="imgs">
            <img src="@/assets/images/screen/base-2.png" alt="" />
            <img src="@/assets/images/screen/oilwell.png" alt="" />
          </div>
          <div class="labels">
            <span>油井</span>
            <span><CountTo :start="0" :end="4556" :decimals="0" /></span>
          </div>
        </section>
        <section class="item">
          <div class="imgs">
            <img src="@/assets/images/screen/base-2.png" alt="" />
            <img src="@/assets/images/screen/oilwell.png" alt="" />
          </div>
          <div class="labels">
            <span>其他油井</span>
            <span><CountTo :start="0" :end="4556" :decimals="0" /></span>
          </div>
        </section>
        <section class="item">
          <div class="imgs">
            <img src="@/assets/images/screen/base-2.png" alt="" />
            <img src="@/assets/images/screen/oilwell.png" alt="" />
          </div>
          <div class="labels">
            <span>一般气井</span>
            <span><CountTo :start="0" :end="4556" :decimals="0" /></span>
          </div>
        </section>
        <section class="item">
          <div class="imgs">
            <img src="@/assets/images/screen/base-2.png" alt="" />
            <img src="@/assets/images/screen/oilwell.png" alt="" />
          </div>
          <div class="labels">
            <span>三高气井</span>
            <span><CountTo :start="0" :end="4556" :decimals="0" /></span>
          </div>
        </section>
      </div>
    </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";

export default {
  name: "ClassificationStatistics",

  components: {
    Box,
  },

  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.classification_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 20px 30px 30px;
    box-sizing: border-box;

    .item {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .imgs {
        position: relative;
        width: 94px;
        height: 83px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          position: absolute;
          width: 100%;
          height: 100%;

          &:first-child {
            top: 0;
            left: 0;
          }

          &:last-child {
            top: -5px;
            width: 70px;
            height: 70px;
          }
        }
      }

      .labels {
        flex: 1 0;
        display: flex;
        flex-direction: column;
        margin-left: 10px;

        span {
          &:first-child {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #ffffff;
          }

          &:last-child {
            font-size: 24px;
            font-family: Arial;
            font-weight: 400;
            color: #0fdada;
            margin-top: 8px;
          }
        }
      }
    }
  }
}
</style>
