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
      angle: 0,
      option: {},
      labels: [],
    };
  },

  mounted() {
    this.init();
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

      this.angle = 0; //角度，用来做简单的动画效果的
      let color = [
        "#fdd56a",
        "#fdb36a",
        "#fd866a",
        "#73ddff",
        "#73acff",
        "#34c98e",
        "#ef4f2e",
        "#fdd56a",
        "#fdb36a",
        "#fd866a",
        "#73ddff",
        "#73acff",
        "#34c98e",
        "#ef4f2e",
        "#fdd56a",
        "#fdb36a",
        "#fd866a",
        "#73ddff",
        "#73acff",
      ];
      this.labels = [
        {
          name: "油气水井设施",
          color: "#fdd56a",
          value: 0,
        },
        {
          name: "油气水集输处理设施",
          color: "#fdb36a",
          value: 0,
        },
        {
          name: "输油气水管道",
          color: "#fd866a",
          value: 0,
        },
        {
          name: "炼油化工生产装置",
          color: "#73ddff",
          value: 0,
        },
        {
          name: "储油气水及化学化工容器设施",
          color: "#34c98e",
          value: 0,
        },
        {
          name: "油气开采及炼油化工专用设备",
          color: "#ef4f2e",
          value: 0,
        },
        {
          name: "工程机械",
          color: "#fdd56a",
          value: 0,
        },
        {
          name: "运输设备",
          color: "#fdb36a",
          value: 0,
        },
        {
          name: "工程机械",
          color: "#fd866a",
          value: 0,
        },
        {
          name: "动力设备及设施",
          color: "#73ddff",
          value: 0,
        },
        {
          name: "传导设备及设施",
          color: "#34c98e",
          value: 0,
        },
        {
          name: "通信设备",
          color: "#ef4f2e",
          value: 0,
        },
        {
          name: "供排水设施",
          color: "#fdd56a",
          value: 0,
        },
        {
          name: "制造和机修加工设备",
          color: "#fdb36a",
          value: 0,
        },
        {
          name: "工具及仪器",
          color: "#fd866a",
          value: 0,
        },
        {
          name: "生产、生活辅助配套设备",
          color: "#73ddff",
          value: 0,
        },
        {
          name: "房屋",
          color: "#73ddff",
          value: 0,
        },
        {
          name: "构筑物",
          color: "#34c98e",
          value: 0,
        },
        {
          name: "加油气站及加工处理设施",
          color: "#ef4f2e",
          value: 0,
        },
      ];
      this.option = {
        legend: {
          show: false,
        },
        series: [
          {
            name: "ring5",
            type: "custom",
            coordinateSystem: "none",
            renderItem: function (params, api) {
              return {
                type: "arc",
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6,
                  startAngle: ((0 + self.angle) * Math.PI) / 180,
                  endAngle: ((90 + self.angle) * Math.PI) / 180,
                },
                style: {
                  stroke: "#fdcb9b",
                  fill: "transparent",
                  lineWidth: 1.5,
                },
              };
            },
            data: [0],
          },
          {
            name: "ring5",
            type: "custom",
            coordinateSystem: "none",
            renderItem: function (params, api) {
              return {
                type: "arc",
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6,
                  startAngle: ((180 + self.angle) * Math.PI) / 180,
                  endAngle: ((270 + self.angle) * Math.PI) / 180,
                },
                style: {
                  stroke: "#fdcb9b",
                  fill: "transparent",
                  lineWidth: 1.5,
                },
              };
            },
            data: [0],
          },
          {
            name: "ring5",
            type: "custom",
            coordinateSystem: "none",
            renderItem: function (params, api) {
              return {
                type: "arc",
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65,
                  startAngle: ((270 + -self.angle) * Math.PI) / 180,
                  endAngle: ((40 + -self.angle) * Math.PI) / 180,
                },
                style: {
                  stroke: "#fdcb9b",
                  fill: "transparent",
                  lineWidth: 1.5,
                },
              };
            },
            data: [0],
          },
          {
            name: "ring5",
            type: "custom",
            coordinateSystem: "none",
            renderItem: function (params, api) {
              return {
                type: "arc",
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65,
                  startAngle: ((90 + -self.angle) * Math.PI) / 180,
                  endAngle: ((220 + -self.angle) * Math.PI) / 180,
                },
                style: {
                  stroke: "#fdcb9b",
                  fill: "transparent",
                  lineWidth: 1.5,
                },
              };
            },
            data: [0],
          },
          {
            name: "ring5",
            type: "custom",
            coordinateSystem: "none",
            renderItem: function (params, api) {
              let x0 = api.getWidth() / 2;
              let y0 = api.getHeight() / 2;
              let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65;
              let point = self.getCirlPoint(x0, y0, r, 90 + -self.angle);
              return {
                type: "circle",
                shape: {
                  cx: point.x,
                  cy: point.y,
                  r: 4,
                },
                style: {
                  stroke: "#fdcb9b", //粉
                  fill: "#fdcb9b",
                },
              };
            },
            data: [0],
          },
          {
            name: "ring5", //绿点
            type: "custom",
            coordinateSystem: "none",
            renderItem: function (params, api) {
              let x0 = api.getWidth() / 2;
              let y0 = api.getHeight() / 2;
              let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65;
              let point = self.getCirlPoint(x0, y0, r, 270 + -self.angle);
              return {
                type: "circle",
                shape: {
                  cx: point.x,
                  cy: point.y,
                  r: 4,
                },
                style: {
                  stroke: "#fdcb9b", //绿
                  fill: "#fdcb9b",
                },
              };
            },
            data: [0],
          },
          {
            name: "吃猪肉频率",
            type: "pie",
            radius: ["50%", "40%"],
            silent: true,
            clockwise: true,
            startAngle: 180,
            z: 0,
            zlevel: 0,
            color: color,
            itemStyle: {
              borderColor: "rgba(255, 255, 255, 0.01)",
              borderWidth: 15,
            },
            label: {
              show: false,
            },
            data: this.labels,
          },
          {
            type: "pie",
            zlevel: 3,
            silent: true,
            radius: ["30%", "31%"],
            //  center: [index * 34 + 15.5 + '%', '45%'],
            label: {
              show: false,
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: this.dotArr(),
          },
        ],
      };

      this.chart.setOption(this.option);
      setInterval(() => {
        this.draw();
      }, 50);
    },

    dotArr() {
      let dataArr = [];
      for (var i = 0; i < 80; i++) {
        if (i % 2 === 0) {
          dataArr.push({
            name: (i + 1).toString(),
            value: 1,
            itemStyle: {
              normal: {
                color: "#0CD3DB",
                borderWidth: 1,
                borderColor: "#0CD3DB",
              },
            },
          });
        } else {
          dataArr.push({
            name: (i + 1).toString(),
            value: 2,
            itemStyle: {
              normal: {
                color: "rgba(0,0,0,0)",
                borderWidth: 0,
                borderColor: "rgba(0,0,0,0)",
              },
            },
          });
        }
      }
      return dataArr;
    },

    getCirlPoint(x0, y0, r, angle) {
      let x1 = x0 + r * Math.cos((angle * Math.PI) / 180);
      let y1 = y0 + r * Math.sin((angle * Math.PI) / 180);
      return {
        x: x1,
        y: y1,
      };
    },

    draw() {
      this.angle = this.angle + 3;
      this.chart.setOption(this.option, true);
      //window.requestAnimationFrame(draw);
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

    .chart {
      flex: 1 0;
      height: 100%;
      overflow: hidden;
    }

    .labels {
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
