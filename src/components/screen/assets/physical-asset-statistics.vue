<template>
  <div class="physical_asset_statistics_root">
    <Box title="实物资产统计"> </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";

export default {
  name: "PhysicalAssetStatistics",

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
.physical_asset_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
