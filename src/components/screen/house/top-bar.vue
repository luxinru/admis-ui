<template>
  <div class="top_bar_root">
    <section class="left">
      <div class="item" @click="onBackToPlatform">
        <img src="@/assets/images/screen/system.png" alt="" />
        <span> 系统平台 </span>
      </div>

      <div class="item" @click="onPlatformClick">
        <img src="@/assets/images/screen/unit.png" alt="" />
        <span> {{ currentDepart.departName || "未命名单位" }} </span>
      </div>
    </section>

    <section class="modal" v-if="isDepartListShow">
      <div class="title">
        <span>单位切换</span>
        <img
          src="@/assets/images/screen/close1.png"
          alt=""
          @click="isDepartListShow = false"
        />
      </div>

      <div class="content" v-if="isDepartListShow">
        <span
          class="content_item"
          :class="{
            content_item_active: currentDepart.departCode === item.departCode,
          }"
          v-for="(item, index) in departList"
          :key="index"
          @click="onDepartClick(item)"
        >
          {{ item.departName || "未命名单位" }}
        </span>
      </div>
    </section>

    <section class="right">
      <div class="item" :class="{ active: type === 1 }" @click="onItemClick(1)">
        <img
          v-show="type === 1"
          src="@/assets/images/screen/assets-1.png"
          alt=""
        />
        <img
          v-show="type !== 1"
          src="@/assets/images/screen/assets.png"
          alt=""
        />
        <span> 资产可视化 </span>
      </div>
      <div class="item" :class="{ active: type === 2 }" @click="onItemClick(2)">
        <img
          v-show="type === 2"
          src="@/assets/images/screen/house-1.png"
          alt=""
        />
        <img
          v-show="type !== 2"
          src="@/assets/images/screen/house.png"
          alt=""
        />
        <span> 房屋可视化 </span>
      </div>
      <div class="item" :class="{ active: type === 3 }" @click="onItemClick(3)">
        <img
          v-show="type === 3"
          src="@/assets/images/screen/pipe-1.png"
          alt=""
        />
        <img v-show="type !== 3" src="@/assets/images/screen/pipe.png" alt="" />
        <span> 工艺管网可视化 </span>
      </div>
    </section>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import clickOutSide from "@mahdikhashan/vue3-click-outside";
import { fetchMyrelationList } from "@/api/screen/house";

export default {
  name: "TopBar",

  directives: {
    clickOutSide,
  },

  data() {
    return {
      area: {},
      departList: [],
      isDepartListShow: false,
      currentDepart: {},
      getCurrentInstance: getCurrentInstance(),
    };
  },

  created() {
    this.type = this.$route.path.indexOf("assets") > -1 ? 1 : 2;
  },

  mounted() {
    this.fetchMyrelationListFun();
    // bus.emit("onDepartChange", this.currentDepart); // todo
  },

  methods: {
    /**
     * 点击头部右侧房屋可视化按钮、资产可是换按钮
     */
    onItemClick(value) {
      const { proxy } = this.getCurrentInstance;
      if (value === 3) return proxy.$modal.msg("暂未开放！");
      switch (value) {
        case 2:
          this.$router.push("/screen/house");
          break;

        default:
          this.$router.push("/screen/assets");
          break;
      }
      // this.type = value;
      // bus.emit("onTopbarClick", value);
      this.onDepartClick(this.currentDepart);
    },

    onClickOutside() {
      this.isDepartListShow = false;
    },

    onBackToPlatform() {
      this.$router.replace("/index");
    },

    onPlatformClick() {
      // bus.emit("onTopbarClick", 1);
      // localStorage.removeItem("currentHouse");
      this.isDepartListShow = true;
    },

    /**
     * 单位切换
     * 返回首页
     * 传播单位切换事件
     */
    onDepartClick(depart) {
      this.currentDepart = depart;
      this.isDepartListShow = false;
      bus.emit("onTopbarClick", 1);
      localStorage.removeItem("currentHouse");
      bus.emit("onDepartChange", depart);
    },

    async fetchMyrelationListFun() {
      const { rows } = await fetchMyrelationList();

      this.departList = rows || [];

      const departCode = sessionStorage.getItem("departCode") || "";

      if (departCode) {
        const depart = this.departList.find(
          (item) => item.departCode === departCode
        );
        this.currentDepart = depart ? depart : rows[0];
      } else {
        this.currentDepart = rows[0];
      }

      localStorage.setItem("currentDepart", JSON.stringify(this.currentDepart));

      bus.emit("onDepartChange", this.currentDepart);
    },
  },
};
</script>

<style scoped lang="scss">
.top_bar_root {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 13px 53px;
  box-sizing: border-box;

  .left {
    position: relative;
    flex: 1 0;
    display: flex;
    align-items: center;

    .item {
      height: 42px;
      position: relative;
      display: flex;
      align-items: center;
      margin-left: 37px;
      cursor: pointer;

      &:first-child {
        margin-left: 0;
      }

      img {
        height: 24px;
      }

      span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #bdd7e7;
        margin-left: 10px;
      }
    }
  }

  .right {
    flex: 1 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 5px;
      cursor: pointer;
      height: 42px;
      padding: 0 13px;

      &:first-child {
        margin-left: 0;
      }

      img {
        height: 24px;
      }

      span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #bdd7e7;
        margin-left: 10px;
      }
    }

    .active {
      background: url("../../../assets/images/screen/select.png") no-repeat;
      background-size: 100% 100%;
    }
  }

  .modal {
    position: fixed;
    top: calc(50vh - (423px / 2));
    left: calc(50vw - (415px / 2));
    width: 423px;
    height: 415px;
    display: flex;
    flex-direction: column;
    background: url("@/assets/images/screen/window-1.png") no-repeat;
    background-size: 100% 100%;
    z-index: 9;
    // padding-top: 22px;

    .title {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;

      span {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #ffffff;
        text-shadow: 0px 1px 1px rgba(0, 11, 10, 0.43);
      }

      img {
        height: 20px;
        position: absolute;
        right: 16px;
        cursor: pointer;
      }
    }

    .content {
      width: 100%;
      flex: 1 0;
      display: flex;
      flex-direction: column;
      z-index: 1;
      overflow-y: auto;
      padding: 10px 10px;
      box-sizing: border-box;

      .content_item {
        width: 100%;
        height: 43px;
        display: flex;
        align-items: center;
        font-size: 15px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
        border-bottom: 1px solid rgba(55, 130, 255, 0.2);
        padding: 10px 10px;
        box-sizing: border-box;
        margin-left: 0;
        cursor: pointer;

        &:hover {
          background-color: rgba(28, 176, 237, 0.1);
        }

        &:last-child {
          border-bottom: none;
        }
      }

      .content_item_active {
        background-color: rgba(28, 176, 237, 0.1);
      }
    }
  }
}
</style>
