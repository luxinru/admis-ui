<template>
  <div class="page_root">
    <section v-if="isLoading" class="map">
      <Map />
    </section>

    <img class="top" src="@/assets/images/screen/on.png" alt="" />
    <img class="right" src="@/assets/images/screen/图层1000.png" alt="" />

    <img class="bottom" src="@/assets/images/screen/Under.png" alt="" />
    <img class="left" src="@/assets/images/screen/图层1000.png" alt="" />

    <div class="top_img">
      <img src="@/assets/images/screen/top.png" alt="" />
      <span> 西南油气田资产可视化 </span>
    </div>
    <img class="bottom_img" src="@/assets/images/screen/bottom.png" alt="" />
    <img class="left_img" src="@/assets/images/screen/edge-2.png" alt="" />
    <img class="right_img" src="@/assets/images/screen/edge-2.png" alt="" />

    <img
      class="border_left_top"
      src="@/assets/images/screen/edge-1.png"
      alt=""
    />
    <img
      class="border_right_top"
      src="@/assets/images/screen/edge-1.png"
      alt=""
    />
    <img
      class="border_left_bottom"
      src="@/assets/images/screen/edge-1.png"
      alt=""
    />
    <img
      class="border_right_bottom"
      src="@/assets/images/screen/edge-1.png"
      alt=""
    />

    <section class="topbar">
      <TopBar />
    </section>

    <section class="btns">
      <Btns />
    </section>

    <section
      class="assets_info"
      :class="{ assets_info_close: isAssetsInfoClose }"
    >
      <AssetsInfo />

      <img
        v-if="!isAssetsInfoClose"
        class="closeImg"
        src="@/assets/images/screen/upper1.png"
        alt=""
        @click="onAssetsInfoCloseClick(true)"
      />
      <img
        v-else
        class="closeImg"
        src="@/assets/images/screen/under1.png"
        alt=""
        @click="onAssetsInfoCloseClick(false)"
      />
    </section>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import TopBar from "@/components/screen/house/top-bar.vue";
import Map from "@/components/screen/assets/map.vue";
import Btns from "@/components/screen/assets/btns.vue";
import AssetsInfo from "@/components/screen/assets/assets-info.vue";

export default {
  name: "AssetsIndex",

  components: {
    TopBar,
    Map,
    Btns,
    AssetsInfo,
  },

  data() {
    return {
      type: 1,
      isLoading: false,
      isAssetsInfoClose: false,
    };
  },

  watch: {
    type: {
      handler(newVal) {
        if (newVal === 1) {
          localStorage.removeItem("currentHouse");
        }
      },
      immediate: true,
    },
  },

  created() {
    const self = this;

    bus.on("onDepartChange", () => {
      self.isLoading = true;
    });
  },

  mounted() {
    window.onresize = () => {
      location.reload();
    };
  },

  beforeUnmount() {
    localStorage.removeItem("currentHouse");
    localStorage.removeItem("currentDepart");
  },

  methods: {
    onAssetsInfoCloseClick(value) {
      this.isAssetsInfoClose = value;
    },
  },
};
</script>

<style lang="scss">
.page_root {
  ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    background: rgba(57, 158, 233, 0.2);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-track-piece {
    background: rgba(57, 158, 233, 0.2);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(57, 158, 233, 1);
    border-radius: 4px;
  }
}
</style>

<style scoped lang="scss">
.page_root {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .map {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0 !important;
  }

  .top {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
  }

  .right {
    position: absolute;
    height: 100%;
    top: 0;
    right: 0;
    transform: rotate(180deg);
  }

  .bottom {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
  }

  .left {
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
  }

  .top_img {
    position: absolute;
    width: 1825px;
    height: 106px;
    top: 0;
    display: flex;
    justify-content: center;

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    span {
      position: relative;
      font-size: 45px;
      font-family: YouSheBiaoTiHei;
      font-weight: 400;

      background: linear-gradient(0deg, #82c1ff 40%, #ffffff 80%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-top: 7px;
    }
  }

  .bottom_img {
    position: absolute;
    width: 1816px;
    height: 63px;
    bottom: 0;
  }

  .left_img {
    position: absolute;
    width: 64px;
    height: 811px;
    left: 0;
  }

  .right_img {
    position: absolute;
    width: 64px;
    height: 811px;
    right: 0;
    transform: rotateY(180deg);
  }

  .border_left_top {
    position: absolute;
    width: 154px;
    height: 127px;
    top: 21px;
    left: 16px;
  }

  .border_right_top {
    position: absolute;
    width: 154px;
    height: 127px;
    top: 21px;
    right: 14px;
    transform: rotateY(180deg);
  }

  .border_left_bottom {
    position: absolute;
    width: 154px;
    height: 127px;
    bottom: 18px;
    left: 16px;
    transform: rotateX(180deg);
  }

  .border_right_bottom {
    position: absolute;
    width: 154px;
    height: 127px;
    bottom: 18px;
    right: 14px;
    transform: rotate(180deg);
  }

  .topbar {
    position: absolute;
    top: 0;
    width: 100%;
    height: 106px;
  }

  .btns {
    position: absolute;
    width: 129px;
    top: 124px;
    left: 44px;
  }

  .assets_info {
    position: absolute;
    left: 38px;
    right: 38px;
    bottom: 69px;
    height: 341px;
    display: flex;
    align-items: center;
    justify-content: center;

    .closeImg {
      position: absolute;
      width: 83px;
      height: 24px;
      top: -27px;
      cursor: pointer;
    }
  }

  .assets_info_close {
    height: 0;
  }
}
</style>
