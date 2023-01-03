<template>
  <div class="pipeline_asset_details_root">
    <Box title="管道资产明细"> </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";

export default {
  name: "PipelineAssetDetails",

  components: {
    Box,
  },
};
</script>

<style scoped lang="scss">
.pipeline_asset_details_root {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
