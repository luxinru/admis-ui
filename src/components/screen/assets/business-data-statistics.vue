<template>
  <div class="business_data_statistics_root">
    <Box title="业务数据统计"> </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";

export default {
  name: "BusinessDataStatistics",

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
.business_data_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
