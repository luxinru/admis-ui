<template>
  <div class="classification_statistics_root">
    <Box title="分类统计">
      <template v-slot:more>
        <div
          class="select"
          v-click-out-side="onClickOutside1"
          @click="isShow1 = !isShow1"
        >
          <span>
            {{ currentType1 === 0 ? "资产类型" : "资产类别" }}
          </span>
          <img src="@/assets/images/screen/more-1.png" alt="" />

          <div class="content" v-if="isShow1">
            <span
              class="content_item"
              :class="{
                content_item_active: currentType1 === item.value,
              }"
              v-for="(item, index) in options1"
              :key="index"
              @click="onOptionsClick1(item)"
            >
              {{ item.label }}
            </span>
          </div>
        </div>
        <!-- <div
          class="select"
          v-click-out-side="onClickOutside2"
          @click="isShow2 = !isShow2"
        >
          <span>
            {{ currentType2 === 0 ? "财务准则" : "会计准则" }}
          </span>
          <img src="@/assets/images/screen/more-1.png" alt="" />

          <div class="content" v-if="isShow2">
            <span
              class="content_item"
              :class="{
                content_item_active: currentType2 === item.value,
              }"
              v-for="(item, index) in options2"
              :key="index"
              @click="onOptionsClick2(item)"
            >
              {{ item.label }}
            </span>
          </div>
        </div> -->
      </template>
      <div class="container">
        <section class="item">
          <div class="imgs">
            <img src="@/assets/images/screen/base-2.png" alt="" />
            <img src="@/assets/images/screen/oilwell.png" alt="" />
          </div>
          <div class="labels">
            <span>{{ list.length ? list[0].groupName : "" }}</span>
            <span
              ><CountTo
                :start="0"
                :end="list.length ? Number(list[0].groupValue) : 0"
                :decimals="0"
            /></span>
          </div>
        </section>
        <section class="item">
          <div class="imgs">
            <img src="@/assets/images/screen/base-2.png" alt="" />
            <img src="@/assets/images/screen/oilwell.png" alt="" />
          </div>
          <div class="labels">
            <span>{{ list.length ? list[1].groupName : "" }}</span>
            <span
              ><CountTo
                :start="0"
                :end="list.length ? Number(list[1].groupValue) : 0"
                :decimals="0"
            /></span>
          </div>
        </section>
        <section class="item">
          <div class="imgs">
            <img src="@/assets/images/screen/base-2.png" alt="" />
            <img src="@/assets/images/screen/oilwell.png" alt="" />
          </div>
          <div class="labels">
            <span>{{ list.length ? list[2].groupName : "" }}</span>
            <span
              ><CountTo
                :start="0"
                :end="list.length ? Number(list[2].groupValue) : 0"
                :decimals="0"
            /></span>
          </div>
        </section>
        <section class="item">
          <div class="imgs">
            <img src="@/assets/images/screen/base-2.png" alt="" />
            <img src="@/assets/images/screen/oilwell.png" alt="" />
          </div>
          <div class="labels">
            <span>{{ list.length ? list[3].groupName : "" }}</span>
            <span
              ><CountTo
                :start="0"
                :end="list.length ? Number(list[3].groupValue) : 0"
                :decimals="0"
            /></span>
          </div>
        </section>
      </div>
    </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";
import clickOutSide from "@mahdikhashan/vue3-click-outside";
import { fetchClassCount } from "@/api/screen/assets/index";

export default {
  name: "ClassificationStatistics",

  components: {
    Box,
  },

  directives: {
    clickOutSide,
  },

  data() {
    return {
      chart: null,
      list: [],
      isShow1: false,
      currentType1: 0,
      options1: [
        {
          label: "资产类型",
          value: 0,
        },
        {
          label: "资产类别",
          value: 1,
        },
      ],
      isShow2: false,
      currentType2: 0,
      options2: [
        {
          label: "财务准则",
          value: 0,
        },
        {
          label: "会计准则",
          value: 1,
        },
      ],
    };
  },

  mounted() {
    this.init();

    bus.on("onDepartChange", (depart) => {
      this.init();
    });
  },

  methods: {
    onClickOutside1() {
      this.isShow1 = false;
    },

    onOptionsClick1(data) {
      this.currentType1 = data.value;
      this.isShow1 = false;
      this.init();
    },

    onClickOutside2() {
      this.isShow2 = false;
    },

    onOptionsClick2(data) {
      this.currentType2 = data.value;
      this.isShow2 = false;
      this.init();
    },

    async init() {
      const depart = JSON.parse(localStorage.getItem("currentDepart") || {});

      const { data } = await fetchClassCount({
        departCode: depart.departCode,
        dimension: this.currentType1, // 0资产类型 1资产类别
        normType: this.currentType2, // 0财务准则 1会计准则
      });

      this.list = data;
    },
  },
};
</script>

<style scoped lang="scss">
.classification_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .select {
    position: relative;
    width: max-content;
    height: max-content;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 8px 8px 0 0;
    cursor: pointer;

    &:first-child {
      margin-left: 0;
    }

    img {
      height: 24px;
      margin: 2px 0 0 3px;
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
      height: max-content;
      top: 40px;
      left: 0;
      display: flex;
      flex-direction: column;
      background: rgba(7, 37, 84, 0.9);
      border: 1px solid rgba(10, 71, 167, 0.9);
      border-radius: 3px;
      z-index: 1;
      overflow-y: auto;

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

  .container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 20px 30px 30px;
    box-sizing: border-box;

    .item {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .imgs {
        position: relative;
        width: 94px;
        height: 83px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          position: absolute;
          width: 100%;
          height: 100%;

          &:first-child {
            top: 0;
            left: 0;
          }

          &:last-child {
            top: -5px;
            width: 70px;
            height: 70px;
          }
        }
      }

      .labels {
        flex: 1 0;
        display: flex;
        flex-direction: column;
        margin-left: 10px;

        span {
          &:first-child {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #ffffff;
          }

          &:last-child {
            font-size: 24px;
            font-family: Arial;
            font-weight: 400;
            color: #0fdada;
            margin-top: 8px;
          }
        }
      }
    }
  }
}
</style>
