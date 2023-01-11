<template>
  <div class="advanced_info_root">
    <ProportionTotalHousing />

    <RentalGrowthRate />

    <ProportionRentalIncome />

    <HousingAcquisition />
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import ProportionTotalHousing from "./proportion-total-housing.vue";
import RentalGrowthRate from "./rental-growth-rate.vue";
import ProportionRentalIncome from "./proportion-rental-income.vue";
import HousingAcquisition from "./housing-acquisition.vue";

export default {
  name: "AdvancedInfo",

  components: {
    ProportionTotalHousing,
    RentalGrowthRate,
    ProportionRentalIncome,
    HousingAcquisition,
  },

  data() {
    return {};
  },

  methods: {},
};
</script>

<style scoped lang="scss">
.advanced_info_root {
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
    left: -27px;
    cursor: pointer;
    transform: rotate(180deg);
    z-index: 1;
  }
}
</style>
