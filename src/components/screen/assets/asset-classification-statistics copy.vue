<template>
  <div class="asset_classification_statistics_root">
    <Box title="资产分类统计">
      <template v-slot:more>
        <section class="all">
          <span
            >原值价值：
            <p>{{ all }}</p>
            万元
          </span>
        </section>
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
        <div
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
        </div>
      </template>
      <div class="container">
        <div class="imgs">
          <img src="@/assets/images/screen/icon-101.png" alt="" />
          <img src="@/assets/images/screen/icon-111.png" alt="" />
          <img src="@/assets/images/screen/icon-121.png" alt="" />
        </div>
        <div class="chart" id="asset_classification_statistics1"></div>
        <div class="labels">
          <div class="item" v-for="(item, index) in labels" :key="index">
            <p :style="{ 'background-color': item.color }"></p>
            <div>{{ item.name }}</div>
            <span>{{ item.value }}</span>
          </div>
        </div>
      </div>
    </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";
import * as echarts from "echarts";
import clickOutSide from "@mahdikhashan/vue3-click-outside";
import { fetchTypeCount } from "@/api/screen/assets/index";

export default {
  name: "AssetClassificationStatistics",

  components: {
    Box,
  },

  directives: {
    clickOutSide,
  },

  data() {
    return {
      chart1: null,
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
      all: 0,
      option: {},
      labels: [],
    };
  },

  mounted() {
    this.init();

    bus.on("onDepartChange", (depart) => {
      this.init();
    });
  },

  beforeUnmount() {
    echarts.dispose(
      document.getElementById("asset_classification_statistics1")
    );
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
      const self = this;
      const depart = JSON.parse(localStorage.getItem("currentDepart") || {});
      const { data } = await fetchTypeCount({
        departCode: depart.departCode,
        dimension: this.currentType1, // 0资产类型 1资产类别
        normType: this.currentType2, // 0财务准则 1会计准则
      });

      this.all = data.allValue;

      if (this.chart) {
        echarts.dispose(
          document.getElementById("asset_classification_statistics1")
        );
      }
      this.chart = echarts.init(
        document.getElementById("asset_classification_statistics1")
      );

      let color = [
        "#0084ff",
        "#37ffc9",
        "#ffe777",
        "#19d6ff",
        "#8676fa",
        "#5f94ff",
        "#ffb66a",
        "#ff4b7d",
        "#60daaa",
        "#359eff",
        "#ff9eb8",
        "#d784e6",
        "#ffd177",
        "#48ecac",
        "#3b75eb",
        "#6bf3ff",
        "#b872cf",
        "#ea735a",
        "#1882e4",
      ];
      this.labels = [
        {
          name: "油气水井设施",
          color: "#0084ff",
          value: 0,
        },
        {
          name: "油气水集输处理设施",
          color: "#37ffc9",
          value: 0,
        },
        {
          name: "输油气水管道",
          color: "#ffe777",
          value: 0,
        },
        {
          name: "炼油化工生产装置",
          color: "#19d6ff",
          value: 0,
        },
        {
          name: "储油气水及化学化工容器设施",
          color: "#8676fa",
          value: 0,
        },
        {
          name: "油气开采及炼油化工专用设备",
          color: "#5f94ff",
          value: 0,
        },
        {
          name: "工程机械",
          color: "#ffb66a",
          value: 0,
        },
        {
          name: "运输设备",
          color: "#ff4b7d",
          value: 0,
        },
        {
          name: "工程机械",
          color: "#60daaa",
          value: 0,
        },
        {
          name: "动力设备及设施",
          color: "#359eff",
          value: 0,
        },
        {
          name: "传导设备及设施",
          color: "#ff9eb8",
          value: 0,
        },
        {
          name: "通信设备",
          color: "#d784e6",
          value: 0,
        },
        {
          name: "供排水设施",
          color: "#ffd177",
          value: 0,
        },
        {
          name: "制造和机修加工设备",
          color: "#48ecac",
          value: 0,
        },
        {
          name: "工具及仪器",
          color: "#3b75eb",
          value: 0,
        },
        {
          name: "生产、生活辅助配套设备",
          color: "#6bf3ff",
          value: 0,
        },
        {
          name: "房屋",
          color: "#b872cf",
          value: 0,
        },
        {
          name: "构筑物",
          color: "#ea735a",
          value: 0,
        },
        {
          name: "加油气站及加工处理设施",
          color: "#1882e4",
          value: 0,
        },
      ];

      let seriesArr = [];
      for (let index = 0; index < 19; index++) {
        seriesArr = seriesArr.concat([
          {
            value: 20,
            name: "yellow",
            itemStyle: {
              color: color[index],
            },
          },
          {
            value: 2,
            name: "",
            itemStyle: {
              color: "transparent",
            },
          },
        ]);
      }

      this.option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          show: false,
        },
        series: [
          {
            name: "占用率",
            type: "pie",
            center: ["50%", "50%"],
            radius: ["45%", "70%"],
            avoidLabelOverlap: false,
            silent: true,
            label: {
              show: false,
            },
            data: seriesArr,
          },
        ],
      };

      this.chart.setOption(this.option);
    },
  },
};
</script>

<style scoped lang="scss">
.asset_classification_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: auto;
  overflow: hidden;

  .all {
    width: max-content;
    height: 34px;
    padding: 8px 8px 0 0;
    box-sizing: border-box;
    display: flex;
    margin-right: 60px;

    span {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
      display: flex;
      align-items: center;

      p {
        font-size: 20px;
        color: rgba(0, 240, 255, 1);
        margin: 0 3px;
      }
    }
  }

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
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    .imgs {
      position: absolute;
      left: 7.1%;
      width: 173px;
      height: 174px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        position: absolute;

        &:nth-child(1) {
          animation: mymove1 10s infinite linear;
        }

        &:nth-child(2) {
          animation: mymove2 10s infinite linear;
        }
      }

      @keyframes mymove1 {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes mymove2 {
        from {
          transform: rotate(360deg);
        }
        to {
          transform: rotate(0deg);
        }
      }
    }

    .chart {
      position: relative;
      flex: 1 0;
      height: 100%;
      overflow: hidden;
    }

    .labels {
      position: relative;
      flex: 2 0;
      height: 100%;
      overflow: hidden;
      padding: 16px 20px 16px 0;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 30%;
        height: 24px;
        display: flex;
        align-items: center;
        margin-left: 30px;
        overflow: hidden;

        &:nth-child(3n + 1) {
          margin-left: 0;
        }
        p {
          width: 16px;
          height: 4px;
          border-radius: 2px;
        }

        div {
          flex: 1 0;
          margin-left: 10px;
          font-size: 13px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        span {
          margin-left: 10px;
          font-size: 18px;
          color: rgba(0, 220, 255, 1);
          font-family: Microsoft YaHei;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
