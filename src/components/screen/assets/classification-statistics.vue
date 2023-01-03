<template>
  <div class="classification_statistics_root">
    <Box title="分类统计"> </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";

export default {
  name: "ClassificationStatistics",

  components: {
    Box,
  },
};
</script>

<style scoped lang="scss">
.classification_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
