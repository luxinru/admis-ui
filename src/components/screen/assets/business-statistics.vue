<template>
  <div class="business_statistics_root">
    <Box title="本年业务统计"> </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";

export default {
  name: "BusinessStatistics",

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
.business_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
