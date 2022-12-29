<template>
  <div class="advanced_info_root">
    <ProportionTotalHousing />

    <RentalGrowthRate />

    <ProportionRentalIncome />

    <HousingAcquisition />
  </div>
</template>

<script setup name="AdvancedInfo">
import ProportionTotalHousing from "./proportion-total-housing.vue";
import RentalGrowthRate from "./rental-growth-rate.vue";
import ProportionRentalIncome from "./proportion-rental-income.vue";
import HousingAcquisition from "./housing-acquisition.vue";
</script>

<style scoped lang="scss">
.advanced_info_root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
