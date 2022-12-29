<template>
  <div class="housing_info_root">
    <Box title="房屋信息">
      <div class="container">
        <div class="item">
          <div class="imgs">
            <img class="img1" src="@/assets/images/screen/icon-bj.png" alt="" />
            <img
              class="img2"
              src="@/assets/images/screen/Housing-quantity.png"
              alt=""
            />
          </div>
          <div class="info" @click="onItemClick('房屋总量')">
            <span>房屋总量(幢)</span>
            <span>
              <CountTo :start="0" :end="totalHouseNum" :decimals="0"/>
            </span>
          </div>
        </div>

        <div class="item" @click="onItemClick('房屋面积')">
          <div class="imgs">
            <img class="img1" src="@/assets/images/screen/icon-bj.png" alt="" />
            <img class="img2" src="@/assets/images/screen/area.png" alt="" />
          </div>
          <div class="info">
            <span>房屋面积(万㎡)</span>
            <span>
              <CountTo :start="0" :end="totalHouseArea" />
            </span>
          </div>
        </div>
      </div>
    </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "./box.vue";

export default {
  name: "HousingInfo",

  components: {
    Box,
  },

  data() {
    return {
      totalHouseNum: 0,
      totalHouseArea: 0,
    };
  },

  mounted() {
    bus.on("fetchBasicStatsFun", (data) => {
      const { totalHouseNum: value1, totalHouseArea: value2 } = data;

      this.totalHouseNum = Number(value1) || 0;
      this.totalHouseArea = Number(value2) / 10000 || 0;
    });
  },

  methods: {
    onItemClick(value) {
      localStorage.setItem("tableType", value);
      bus.emit("onModalShow");
    },
  },
};
</script>

<style scoped lang="scss">
.housing_info_root {
  width: 100%;
  flex: 209;
  margin-top: 5px;
  overflow: hidden;

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .item {
      display: flex;
      align-items: center;

      .imgs {
        position: relative;
        width: 90px;
        height: 88px;
        display: flex;
        align-items: center;
        justify-content: center;

        .img1 {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .img2 {
          position: relative;
          width: 34px;
          margin-bottom: 22px;
        }
      }

      .info {
        display: flex;
        flex-direction: column;
        margin: 0 0 14px 0px;
        cursor: pointer;

        span {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;

          &:last-child {
            font-size: 24px;
            font-family: YouSheBiaoTiHei;
            font-weight: 400;
            color: #2177cf;
            -webkit-text-stroke: 1px #ffffff;
            text-stroke: 1px #ffffff;

            background: linear-gradient(
              0deg,
              rgba(137, 162, 172, 0.94) 0%,
              rgba(229, 245, 255, 0.94) 20.2880859375%,
              rgba(255, 255, 255, 0.94) 79.4189453125%,
              rgba(255, 255, 255, 0.94) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 16px 0 0 0;
          }
        }
      }
    }
  }
}
</style>
