<template>
  <div class="assets_container_root">
    <section class="part">
      <div class="item">
        <TotalAssetsStatistics />
      </div>
      <div class="item">
        <BusinessStatistics />
      </div>
      <div class="item">
        <BusinessDataStatistics />
      </div>
    </section>

    <section class="center">
      <div class="bar">
        <div class="btns_root">
          <div
            class="item"
            :class="{ active: type === 1 }"
            @click="onItemClick(1)"
          >
            <img src="@/assets/images/screen/icon-6.png" alt="" />
            <span>财务准则</span>
          </div>
          <div
            class="item"
            :class="{ active: type === 2 }"
            @click="onItemClick(2)"
          >
            <img src="@/assets/images/screen/icon-7.png" alt="" />
            <span>会计准则</span>
          </div>
        </div>

        <div class="input">
          <SearchInput />
        </div>
      </div>

      <div class="bottom_info">
        <AssetClassificationStatistics />
      </div>
    </section>

    <section class="part">
      <div class="item">
        <PhysicalAssetStatistics />
      </div>
      <div class="item">
        <ProductionStatistics />
      </div>
      <div class="item">
        <AnnualDepletionStatistics />
      </div>
    </section>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import SearchInput from "./search-input.vue";
import TotalAssetsStatistics from "./total-assets-statistics.vue";
import BusinessStatistics from "./business-statistics.vue";
import BusinessDataStatistics from "./business-data-statistics.vue";
import AssetClassificationStatistics from "./asset-classification-statistics.vue";
import PhysicalAssetStatistics from "./physical-asset-statistics.vue";
import ProductionStatistics from "./production-statistics.vue";
import AnnualDepletionStatistics from "./annual-depletion-statistics.vue";

export default {
  name: "AssetsContainer",

  components: {
    SearchInput,
    TotalAssetsStatistics,
    BusinessStatistics,
    BusinessDataStatistics,
    AssetClassificationStatistics,
    PhysicalAssetStatistics,
    ProductionStatistics,
    AnnualDepletionStatistics,
  },

  data() {
    return {
      type: 1,
    };
  },

  methods: {
    onItemClick(value) {
      this.type = value;
      // bus.emit('onAssetsTypeChange', value)
      bus.emit('onDepartChange', {})
    },
  },
};
</script>

<style scoped lang="scss">
* {
  flex-shrink: 0;
}
.assets_container_root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  pointer-events: none;

  .part {
    flex: 435;
    height: 100%;
    display: grid;
    grid-template-rows: 285fr 315fr 272fr;
    grid-row-gap: 8px;

    .item {
      width: 100%;
      height: 100%;
      pointer-events: auto;
      overflow: hidden;
    }
  }

  .center {
    position: relative;
    flex: 930;
    height: 100%;
    margin: 0 13px;
    display: grid;
    grid-template-rows: 600fr 272fr;
    grid-row-gap: 16px;
    overflow: hidden;

    .bar {
      position: relative;
      width: 100%;
      height: 100%;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;

      .btns_root {
        position: absolute;
        left: 0;
        top: 0;
        width: 129px;
        display: flex;
        flex-direction: column;
        margin-top: 15px;

        .item {
          width: 100%;
          height: 43px;
          display: flex;
          align-items: center;
          padding: 0 13px;
          box-sizing: border-box;
          margin-top: 13px;
          background: url("@/assets/images/screen/secondary-2.png") no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
          pointer-events: auto;

          &:first-child {
            margin-top: 0;
          }

          img {
            width: 21px;
          }

          span {
            font-size: 15px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #ffffff;
            margin-left: 12px;
          }
        }

        .active {
          background: url("@/assets/images/screen/secondary-1.png") no-repeat;
          background-size: 100% 100%;
        }
      }

      .input {
        position: absolute;
        width: 356px;
        height: 41px;
        top: 0;
        pointer-events: auto;
      }
    }

    .bottom_info {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
