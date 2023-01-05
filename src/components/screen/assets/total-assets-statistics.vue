<template>
  <div class="total_assets_statistics_root">
    <Box title="资产总量统计">
    </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";

export default {
  name: "TotalAssetsStatistics",

  components: {
    Box
  },

  data() {
    return {};
  },

  methods: {},
};
</script>

<style scoped lang="scss">
.total_assets_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
