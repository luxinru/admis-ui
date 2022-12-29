<template>
  <div class="production_value_info_root">
    <Box title="产值信息">
      <div class="container">
        <div class="imgs">
          <img class="img1" src="@/assets/images/screen/oildrum.png" alt="" />
          <img class="img2" src="@/assets/images/screen/building.png" alt="" />
        </div>

        <div class="list">
          <div class="item" @click="onItemClick('原值')">
            <span class="label"> 原值 (万元) </span>
            <div class="box">
              <img src="@/assets/images/screen/more-1.png" alt="" />
              <span>
                <CountTo :start="0" :end="original" />
              </span>
            </div>
          </div>

          <div class="item" @click="onItemClick('净值')">
            <span class="label"> 净值 (万元) </span>
            <div class="box">
              <img src="@/assets/images/screen/more-1.png" alt="" />
              <span><CountTo :start="0" :end="now" /></span>
            </div>
          </div>

          <div class="item" @click="onItemClick('折旧')">
            <span class="label"> 折旧 (万元) </span>
            <div class="box">
              <img src="@/assets/images/screen/more-1.png" alt="" />
              <span><CountTo :start="0" :end="acc" /></span>
            </div>
          </div>
        </div>
      </div>
    </Box>
  </div>
</template>

<script setup name="ProductionValueInfo">
import bus from "vue3-eventbus";

import Box from "./box.vue";

const original = ref(0);
const now = ref(0);
const acc = ref(0);

function onItemClick(value) {
  localStorage.setItem('tableType', value)
  bus.emit("onModalShow");
}

onMounted(() => {
  bus.on("fetchBasicStatsFun", (data) => {
    const { originalValue, nowValue, accDepreciation } = data;

    original.value = Number(originalValue) || 0;
    now.value = Number(nowValue) || 0;
    acc.value = Number(accDepreciation) || 0;
  });
});
</script>

<style scoped lang="scss">
.production_value_info_root {
  width: 100%;
  flex: 290;
  overflow: hidden;

  .container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .imgs {
      position: relative;
      width: 117px;
      height: 177px;
      display: flex;
      align-items: center;
      justify-content: center;

      .img1 {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .img2 {
        position: absolute;
        width: 60px;
        animation: move 2s linear infinite;
      }

      @keyframes move {
        0% {
          margin-bottom: 0;
        }

        50% {
          margin-bottom: 16px;
        }

        100% {
          margin-bottom: 0;
        }
      }
    }

    .list {
      flex: 1 0;
      display: flex;
      flex-direction: column;

      .item {
        width: 100%;
        height: 55px;
        display: flex;
        flex-direction: column;
        background: url("../../../assets/images/screen/title-3.png") no-repeat;
        background-size: 100% 100%;
        margin-top: 16px;
        padding-left: 22px;
        cursor: pointer;

        .label {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(252, 253, 255, 1);
          margin: -14px 0 0 10px;
        }

        .box {
          width: 100%;
          display: flex;
          align-items: center;
          margin: 0 0 0 0;
          img {
            height: 20px;
            transform: rotate(-90deg);
          }

          span {
            width: 100%;
            font-size: 22px;
            font-family: YouSheBiaoTiHei;
            font-weight: 400;
            color: #2993ff;
          }
        }
      }
    }
  }
}
</style>
