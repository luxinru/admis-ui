<template>
  <div class="assets_info_root">
    <div class="item">
      <ClassificationStatistics />
    </div>
    <div class="item">
      <BlockStatistics />
    </div>
    <div class="item">
      <PipelineAssetDetails />
    </div>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import ClassificationStatistics from "./classification-statistics.vue";
import BlockStatistics from "./block-statistics.vue";
import PipelineAssetDetails from "./pipeline-asset-details.vue";

export default {
  name: "AssetsInfo",

  components: {
    ClassificationStatistics,
    BlockStatistics,
    PipelineAssetDetails
  },

  data() {
    return {};
  },

  methods: {},
};
</script>

<style scoped lang="scss">
.assets_info_root {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  grid-column-gap: 7px;
  overflow: hidden;
}
</style>
