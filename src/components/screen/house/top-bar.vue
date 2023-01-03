<template>
  <div class="top_bar_root">
    <section class="left">
      <div class="item" @click="onBackToPlatform">
        <img src="@/assets/images/screen/system.png" alt="" />
        <span> 系统平台 </span>
      </div>

      <div
        class="item"
        @click="onPlatformClick"
        v-click-out-side="onClickOutside"
      >
        <img src="@/assets/images/screen/unit.png" alt="" />
        <span> {{ currentDepart.departName || "未命名单位" }} </span>

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
      type: 2,
      area: {},
      departList: [],
      isDepartListShow: false,
      currentDepart: {},
      getCurrentInstance: getCurrentInstance(),
    };
  },

  mounted() {
    this.fetchMyrelationListFun();
    // bus.emit("onDepartChange", this.currentDepart); // todo
  },

  methods: {
    onItemClick(value) {
      const { proxy } = this.getCurrentInstance;
      if (value === 3) return proxy.$modal.msg("暂未开放！");
      switch (value) {
        case 2:
          this.$router.push('/screen/house')
          break;
      
        default:
          this.$router.push('/screen/assets')
          break;
      }
      this.type = value;
      // bus.emit("onTopbarClick", value);
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

    onDepartClick(depart) {
      this.currentDepart = depart;
      this.isDepartListShow = false
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

      .content {
        position: absolute;
        height: 230px;
        top: 30px;
        left: 0;
        display: flex;
        flex-direction: column;
        background: rgba(7, 37, 84, 0.9);
        border: 1px solid rgba(10, 71, 167, 0.9);
        border-radius: 3px;
        z-index: 1;
        overflow-y: scroll;

        .content_item {
          width: 163px;
          font-size: 15px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
          border-bottom: 1px solid rgba(55, 130, 255, 0.2);
          padding: 10px 10px;
          box-sizing: border-box;
          margin-left: 0;

          &:last-child {
            border-bottom: none;
          }
        }

        .content_item_active {
          background-color: rgba(55, 130, 255, 1);
        }
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
}
</style>
