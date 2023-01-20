<template>
  <div class="search_input_root">
    <span class="label"> 单位查询 </span>
    <img src="@/assets/images/screen/search.png" alt="" />

    <div class="input">
      <input
        v-model="value"
        type="text"
        placeholder="可输入单位名称、编号"
        @blur="onBlur"
      />
    </div>
  </div>
</template>

<script>
import bus from "vue3-eventbus";

export default {
  name: "SearchInput",

  data() {
    return {
      value: "",
    };
  },

  computed: {
    houseList() {
      return [
        {
          departLevel: "2",
          departCode: "11700",
          departName: "中国石油西南油气田分公司",
        },
        {
          latitude: 30.6629614,
          departLevel: "3",
          departCode: "117000002",
          departName: "西南油气田/重庆气矿",
          longitude: 104.0987796,
        },
        {
          latitude: 30.502384,
          departLevel: "4",
          departCode: "1170000020001",
          departName: "西南油气田/重庆气矿/机关",
          longitude: 104.0638337,
        },
      ];
    },
  },

  methods: {
    onBlur() {
      bus.emit("onSearchInputBlur", this.value);
    },
  },
};
</script>

<style scoped lang="scss">
.search_input_root {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    0deg,
    rgba(5, 45, 110, 0.66),
    rgba(1, 18, 40, 0.66)
  );
  border: 1px solid;
  border-image: linear-gradient(
      0deg,
      rgba(58, 98, 157, 0.86),
      rgba(34, 50, 70, 0.86)
    )
    1 1;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  z-index: 2;

  .label {
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ffffff;
    padding: 0 12px;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;
  }

  img {
    height: 21px;
    margin-left: 15px;
  }

  .input {
    flex: 1 0;
    height: 100%;
    margin: 0 13px;
    padding-top: 3px;
    box-sizing: border-box;

    input {
      width: 100%;
      height: 100%;
      color: rgba(189, 215, 231, 1);
      background-color: transparent;
      outline: none;
      border: none;

      &::placeholder {
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(189, 215, 231, 0.8);
      }
    }
  }
}
</style>
