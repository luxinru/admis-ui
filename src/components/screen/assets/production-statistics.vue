<template>
  <div class="production_statistics_root">
    <Box title="油气产量统计"> </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";

export default {
  name: "ProductionStatistics",

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
.production_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
