<template>
  <div class="basic_info_root">
    <ProductionValueInfo />

    <HousingInfo />

    <RentalInfo />
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import ProductionValueInfo from "./production-value-info.vue";
import HousingInfo from "./housing-info.vue";
import RentalInfo from "./rental-info.vue";
import { fetchBasicStats } from "@/api/screen/house";

/**
 * 左侧信息栏容器
 */
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
}
</style>
