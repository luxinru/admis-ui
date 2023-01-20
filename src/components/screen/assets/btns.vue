<template>
  <div class="btns_root">
    <div class="item" @click="onItemClick(1)">
      <img src="@/assets/images/screen/icon-8.png" alt="" />
      <span>返回首页</span>
    </div>
    <div class="item" :class="{ active: type === 2 }" @click="onItemClick(2)">
      <img src="@/assets/images/screen/icon-6.png" alt="" />
      <span>财务准则</span>
    </div>
    <div class="item" :class="{ active: type === 3 }" @click="onItemClick(3)">
      <img src="@/assets/images/screen/icon-7.png" alt="" />
      <span>会计准则</span>
    </div>
  </div>
</template>

<script>
import bus from "vue3-eventbus";

export default {
  name: "Btns",

  components: {},

  data() {
    return {
      type: 1,
    };
  },

  mounted() {
    this.type = localStorage.getItem("normType") === "0" ? 2 : 3;
  },

  methods: {
    onItemClick(value) {
      this.type = value;
      if (value === 1) {
        bus.emit("onAssetsTypeChange", value);
      } else {
        localStorage.setItem("normType", value === 2 ? 0 : 1);
        bus.emit("onDepartChange");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.btns_root {
  width: 100%;
  display: flex;
  flex-direction: column;

  .item {
    width: 100%;
    height: 43px;
    display: flex;
    align-items: center;
    padding: 0 13px;
    box-sizing: border-box;
    margin-top: 13px;
    background: url("@/assets/images/screen/secondary-2.png") no-repeat;
    background-size: 100% 100%;
    cursor: pointer;

    &:first-child {
      margin-top: 0;
    }

    img {
      width: 21px;
    }

    span {
      font-size: 15px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
      margin-left: 12px;
    }
  }

  .active {
    background: url("@/assets/images/screen/secondary-1.png") no-repeat;
    background-size: 100% 100%;
  }
}
</style>
