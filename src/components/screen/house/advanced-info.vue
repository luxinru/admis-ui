<template>
  <div class="advanced_info_root">
    <ProportionTotalHousing />

    <RentalGrowthRate />

    <ProportionRentalIncome />

    <HousingAcquisition />

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
import ProportionTotalHousing from "./proportion-total-housing.vue";
import RentalGrowthRate from "./rental-growth-rate.vue";
import ProportionRentalIncome from "./proportion-rental-income.vue";
import HousingAcquisition from "./housing-acquisition.vue";

export default {
  name: 'AdvancedInfo',

  components: {
    ProportionTotalHousing,
    RentalGrowthRate,
    ProportionRentalIncome,
    HousingAcquisition
  },

  data () {
    return {
      isClose: false
    }
  },

  methods: {
    onCloseClick (value) {
      this.isClose = value
      bus.emit('onRightCloseClick', value)
    }
  }
}

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
  }
}
</style>
