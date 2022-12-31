<template>
  <div class="page_root">
    <section v-if="isLoading" class="map">
      <Map />
    </section>

    <img class="top" src="@/assets/images/screen/on.png" alt="" />
    <img
      v-if="type === 1 && !isRightClose"
      class="right"
      src="@/assets/images/screen/right.png"
      alt=""
    />
    <img
      class="right_left"
      v-if="isRightClose"
      src="@/assets/images/screen/图层 1000.png"
      alt=""
    />

    <img class="bottom" src="@/assets/images/screen/Under.png" alt="" />
    <img
      class="left"
      v-if="!isLeftClose"
      src="@/assets/images/screen/left.png"
      alt=""
    />

    <img
      class="little_left"
      v-if="isLeftClose"
      src="@/assets/images/screen/图层 1000.png"
      alt=""
    />

    <div class="top_img">
      <img src="@/assets/images/screen/top.png" alt="" />
      <span> 西南油气田房屋可视化 </span>
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

    <template v-if="isLoading">
      <section class="search_box">
        <SearchInput />
      </section>

      <section class="left_part" :class="{ left_close: isLeftClose }">
        <BasicInfo />
      </section>

      <section
        class="right_part"
        v-if="type === 1"
        :class="{ left_close: isRightClose }"
      >
        <AdvancedInfo />
      </section>

      <section
        v-if="type === 2 && isShowHouseImgs"
        class="house_imgs"
        :class="{ left51: isLeftClose }"
      >
        <HouseImgs />
      </section>

      <section v-if="type === 2 && isShowHouseInfo" class="house_info">
        <HouseInfo />
      </section>

      <section
        v-if="type === 2"
        id="house_table"
        class="house_table"
        :class="{ house_close: isTableClose, left51: isLeftClose }"
      >
        <img
          v-if="!isTableClose"
          class="closeImg"
          src="@/assets/images/screen/upper1.png"
          alt=""
          @click="onTableCloseClick(true)"
        />
        <img
          v-else
          class="closeImg"
          src="@/assets/images/screen/under1.png"
          alt=""
          @click="onTableCloseClick(false)"
        />
        <HouseTable />
      </section>

      <section class="modal" v-if="isShowModal">
        <HouseLedgerDetails />
      </section>
    </template>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import SearchInput from "@/components/screen/house/search-input.vue";
import TopBar from "@/components/screen/house/top-bar.vue";
import BasicInfo from "@/components/screen/house/basic-info.vue";
import AdvancedInfo from "@/components/screen/house/advanced-info.vue";
import HouseLedgerDetails from "@/components/screen/house/house-ledger-details.vue";
import HouseImgs from "@/components/screen/house/house-imgs.vue";
import HouseInfo from "@/components/screen/house/house-info.vue";
import HouseTable from "@/components/screen/house/house-table.vue";
import Map from "@/components/screen/house/map.vue";

export default {
  name: "ScreenIndex",

  components: {
    SearchInput,
    TopBar,
    BasicInfo,
    AdvancedInfo,
    HouseLedgerDetails,
    HouseImgs,
    HouseInfo,
    HouseTable,
    Map,
  },

  data() {
    return {
      isShowModal: false,
      type: 1,
      isShowHouseInfo: false,
      isShowHouseImgs: false,
      isLoading: false,
      isLeftClose: false,
      isRightClose: false,
      isTableClose: false,
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
    bus.on("onModalClose", () => {
      self.isShowModal = false;
    });

    bus.on("onModalShow", () => {
      self.isShowModal = true;
    });

    bus.on("onTopbarClick", (value) => {
      self.type = value;

      if (value === 2) {
        nextTick(() => {
          const elements = document.getElementsByClassName("rental_info_root");
          if (elements && elements.length) {
            const element = elements[0];
            const height = element.clientHeight;
            const houseTable = document.getElementById("house_table");
            if (houseTable) {
              houseTable.style.height = height + "px";
            }
          }
        });
      }
    });

    bus.on("onHouseInfoOperate", (show) => {
      self.isShowHouseInfo = show;
    });

    bus.on("onHouseImgsOperate", (show) => {
      self.isShowHouseImgs = show;
    });

    bus.on("onDepartChange", () => {
      self.isLoading = true;
    });

    bus.on("onLeftCloseClick", (value) => {
      self.isLeftClose = value;
    });

    bus.on("onRightCloseClick", (value) => {
      self.isRightClose = value;
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
    onTableCloseClick(value) {
      this.isTableClose = value;
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
  }

  .right_left {
    position: absolute;
    width: 93px;
    height: 1073px;
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

  .little_left {
    position: absolute;
    width: 93px;
    height: 1073px;
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

  .search_box {
    position: absolute;
    width: 443px;
    height: 52px;
    top: 120px;
  }

  .topbar {
    position: absolute;
    top: 0;
    width: 100%;
    height: 106px;
  }

  .left_part {
    position: absolute;
    width: 390px;
    top: 121px;
    left: 47px;
    bottom: 63px;
  }

  .right_part {
    position: absolute;
    width: 390px;
    top: 121px;
    right: 50px;
    bottom: 65px;
  }

  .left_close {
    width: 0;
  }

  .house_imgs {
    position: absolute;
    width: 435px;
    height: 42.68518%;
    top: 189px;
    left: 470px;
  }

  .house_info {
    position: absolute;
    width: 435px;
    height: 42.68518%;
    top: 189px;
    right: 51px;
  }

  .house_table {
    position: absolute;
    margin-top: 5px;
    bottom: 63px;
    left: 470px;
    right: 51px;
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

  .house_close {
    height: 0 !important;
  }

  .left51 {
    left: 51px;
  }

  .modal {
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 999;
  }
}
</style>
