<template>
  <div class="basic_info_root">
    <ProductionValueInfo />

    <HousingInfo />

    <RentalInfo />

    <img
      v-if="!isClose"
      class="closeImg"
      src="@/assets/images/screen/left1.png"
      alt=""
      @click="onCloseClick(true)"
    />
    <img
      v-else
      class="closeImg"
      src="@/assets/images/screen/right1.png"
      alt=""
      @click="onCloseClick(false)"
    />
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import ProductionValueInfo from "./production-value-info.vue";
import HousingInfo from "./housing-info.vue";
import RentalInfo from "./rental-info.vue";
import { fetchBasicStats } from "@/api/screen/house";

export default {
  name: "BasicInfo",

  components: {
    ProductionValueInfo,
    HousingInfo,
    RentalInfo,
  },

  data() {
    return {
      original: 0,
      now: 0,
      acc: 0,
      currentDepart: {},
      isClose: false,
    };
  },

  mounted() {
    const self = this;
    bus.on("onDepartChange", (depart) => {
      self.currentDepart = depart;
      self.fetchBasicStatsFun();
    });

    const depart = localStorage.getItem("currentDepart")
      ? JSON.parse(localStorage.getItem("currentDepart"))
      : "";

    if (depart) {
      this.currentDepart = depart;
      this.fetchBasicStatsFun();
    }
  },

  methods: {
    async fetchBasicStatsFun() {
      const { data } = await fetchBasicStats({
        departCode: this.currentDepart.departCode,
      });
      bus.emit("fetchBasicStatsFun", data);
    },

    onCloseClick (value) {
      this.isClose = value
      bus.emit('onLeftCloseClick', value)
    }
  },
};
</script>

<style scoped lang="scss">
.basic_info_root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .closeImg {
    position: absolute;
    width: 24px;
    height: 83px;
    right: -27px;
    cursor: pointer;
    z-index: 1;
  }
}
</style>
