<template>
  <div class="block_statistics_root">
    <Box title="区块统计"> </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";

export default {
  name: "BlockStatistics",

  components: {
    Box,
  },
};
</script>

<style scoped lang="scss">
.block_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
