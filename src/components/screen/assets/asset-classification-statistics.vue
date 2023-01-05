<template>
  <div class="asset_classification_statistics_root">
    <Box title="资产分类统计"> </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";

export default {
  name: "AssetClassificationStatistics",

  components: {
    Box,
  },

  data() {
    return {};
  },

  methods: {},
};
</script>

<style scoped lang="scss">
.asset_classification_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
