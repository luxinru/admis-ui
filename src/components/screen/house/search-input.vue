<template>
  <div class="search_input_root" v-click-out-side="onClickOutside">
    <span class="label"> 房屋信息 </span>
    <img src="@/assets/images/screen/search.png" alt="" />

    <div class="input">
      <input
        v-model="value"
        type="text"
        placeholder="可输入房屋名称、编号、管理单位"
        @focus="isShow = true"
      />
    </div>

    <div v-if="isShow" class="select_container">
      <div
        class="item"
        v-for="(item, index) in showHouseList"
        :key="index"
        @click="onSearchItemClick(item)"
      >
        {{ item.assetsName }}
      </div>
    </div>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import clickOutSide from "@mahdikhashan/vue3-click-outside";
import useScreenStore from "@/store/modules/screen";

export default {
  name: "SearchInput",

  directives: {
    clickOutSide,
  },

  data() {
    return {
      isShow: false,
      value: "",
    };
  },

  computed: {
    houseList() {
      return useScreenStore().houseList;
    },

    showHouseList() {
      return this.houseList.filter(
        (item) =>
          item.assetsName.indexOf(this.value) > -1 ||
          item.assetsCode.indexOf(this.value) > -1 ||
          item.departCode.indexOf(this.value) > -1
      );
    },
  },

  methods: {
    onSearchItemClick(item) {
      this.value = item.assetsName;
      localStorage.setItem("currentHouse", JSON.stringify(item));
      // bus.emit("onTopbarClick", 1);
      bus.emit("onTopbarClick", 2); //todo
      bus.emit("onHouseInfoOperate", true); //todo
      bus.emit("onHouseImgsOperate", true); //todo
      bus.emit("onSearchInputClick", item);
      this.isShow = false;
    },

    onClickOutside() {
      this.isShow = false;
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

  .select_container {
    position: absolute;
    width: 100%;
    top: 52px;
    left: 0;
    height: 230px;
    display: flex;
    flex-direction: column;
    background: rgba(7, 37, 84, 0.9);
    border: 1px solid rgba(10, 71, 167, 0.9);
    border-radius: 3px;
    overflow-y: scroll;

    .item {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 10px 10px;
      box-sizing: border-box;
      font-size: 15px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
      cursor: pointer;
    }
  }
}
</style>
