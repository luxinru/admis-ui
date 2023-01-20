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
        <template v-if="!isSingle">
          <div class="chart" id="asset_classification_statistics1"></div>
          <div class="chart" id="asset_classification_statistics2"></div>
        </template>

        <template v-else>
          <div class="imgs">
            <img src="@/assets/images/screen/icon-101.png" alt="" />
            <img src="@/assets/images/screen/icon-111.png" alt="" />
            <img src="@/assets/images/screen/icon-121.png" alt="" />
          </div>
          <div class="chart3" id="asset_classification_statistics3"></div>
          <div class="labels">
            <div class="item" v-for="(item, index) in labels" :key="index">
              <p :style="{ 'background-color': item.color }"></p>
              <div>{{ item.name }}</div>
              <span>{{ item.value }}</span>
            </div>
          </div>
        </template>
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
import _ from "lodash";

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
      chart2: null,
      chart3: null,
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
      labels: [],
      isSingle: false,
    };
  },
  async mounted() {
    this.init();

    bus.on("onDepartChange", (depart) => {
      this.init();
    });
  },
  beforeUnmount() {
    echarts.dispose(
      document.getElementById("asset_classification_statistics1")
    );
    echarts.dispose(
      document.getElementById("asset_classification_statistics2")
    );
    bus.off('onDepartChange')
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
      const { data } = await fetchTypeCount({
        departCode: depart.departCode,
        dimension: this.currentType1, // 0资产类型 1资产类别
        normType: this.currentType2, // 0财务准则 1会计准则
      });

      this.all = data.allValue;

      const list = data.groupMap || [];

      if (list.length > 10) {
        this.isSingle = true;
        this.$nextTick(() => {
          this.init3(list);
        });
      } else {
        this.isSingle = false;
        this.$nextTick(() => {
          this.init1(list);
          this.init2(list);
        });
      }
    },

    async init1(arr) {
      this.chart1 = echarts.init(
        document.getElementById("asset_classification_statistics1")
      );
      let data1 = arr.map((item) => item.groupName);
      let data2 = arr.map((item) => {
        return {
          value: item.groupValue,
          name: item.groupName,
        };
      });
      var colorList = [
        {
          c1: " #7DEBFF",
          c2: "#3BB3FF",
        },
        {
          c1: "#5FE48E",
          c2: "#37C76A",
        },
        {
          c1: "#9085FF",
          c2: "#503EFF",
        },
        {
          c1: "#F9D172",
          c2: "#FFBB18",
        },
        {
          c1: " #85C9FF",
          c2: "#8AC2F9",
        },
        {
          c1: " #7DEBFF",
          c2: "#3BB3FF",
        },
      ];
      const option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          right: "15%",
          top: "center",
          itemWidth: 16,
          itemHeight: 4,
          itemGap: 13,
          data: data1,
          textStyle: {
            color: "#fff",
          },
          icon: "rect",
        },
        series: [
          {
            name: "资产",
            type: "pie",
            radius: "65%",
            center: ["40%", "50%"],
            data: data2,
            roseType: "radius",
            startAngle: 90,
            // roseType:false,
            label: {
              show: false,
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    {
                      //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                      offset: 0,
                      color: colorList[params.dataIndex].c1,
                    },
                    {
                      offset: 1,
                      color: colorList[params.dataIndex].c2,
                    },
                  ]);
                  // return colorList[params.dataIndex % colorList.length];
                },
              },
            },
          },
        ],
      };
      this.chart1.setOption(option);

      /**
       * echarts点击事件
       * 声明入口
       */
      const self = this;
      this.chart1.on("click", (params) => {
        localStorage.setItem("assetsType", params.name);
        self.onItemClick("资产总量统计");
      });
    },

    /**
     * 点击打开表格弹窗
     * value 表明入口
     */
    onItemClick(data) {
      localStorage.setItem("assetsTableType", data);
      bus.emit("onAssetsModalShow", true);
    },

    async init2(arr) {
      this.chart2 = echarts.init(
        document.getElementById("asset_classification_statistics2")
      );

      const values1 = arr.map((item) => Number(item.groupValue));
      const values2 = arr.map((item) => Number(item.groupCount));

      let max = 0;
      let max1 = _.max(values1);
      let max2 = _.max(values2);

      max = max1 > max2 ? max1 : max2;

      const option = {
        tooltip: {},
        legend: {
          right: "10%",
          top: "center",
          itemWidth: 16,
          itemHeight: 4,
          textStyle: {
            color: "#fff",
          },
          icon: "rect",
          orient: "vertical",
          data: [
            {
              name: "资产价值",
            },
            {
              name: "资产数量",
            },
          ],
        },
        radar: {
          name: {
            textStyle: {
              color: "rgba(255, 255, 255, 1)",
              fontSize: 13,
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "rgba(159, 165, 173, 0.5)", // 设置网格的颜色
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "rgba(159, 165, 173, 0.5)", // 设置网格的颜色
            },
          },
          splitArea: {
            show: false,
          },
          indicator: arr.map((item) => {
            return {
              name: item.groupName,
              max: max,
            };
          }),
          center: ["30%", "50%"],
          radius: "60%",
        },
        series: [
          {
            type: "radar",
            data: [
              {
                value: arr.map((item) => Number(item.groupValue)),
                name: "资产价值",
                symbol: "none",
                areaStyle: {
                  normal: {
                    color: "rgba(0, 128, 255, 1)",
                    opacity: 0.3,
                  },
                },
                lineStyle: {
                  width: 2,
                  color: "rgba(0, 128, 255, 1)",
                },
              },
              {
                value: arr.map((item) => Number(item.groupCount)),
                name: "资产数量",
                symbol: "none",
                areaStyle: {
                  normal: {
                    color: "rgba(61, 223, 183, 1)",
                    opacity: 0.3,
                  },
                },
                lineStyle: {
                  width: 2,
                  color: "rgba(61, 223, 183, 1)",
                },
              },
            ],
          },
        ],
      };
      this.chart2.setOption(option);

      /**
       * echarts点击事件
       * 声明入口
       */
      const self = this;
      this.chart2.on("click", (params) => {
        localStorage.setItem("assetsType", params.name);
        self.onItemClick("资产总量统计");
      });
    },

    async init3(list) {
      if (this.chart3) {
        echarts.dispose(
          document.getElementById("asset_classification_statistics3")
        );
      }
      this.chart3 = echarts.init(
        document.getElementById("asset_classification_statistics3")
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
      this.labels = list.map((item, index) => {
        return {
          name: item.groupName,
          color: color[index],
          value: Number(item.groupValue),
        };
      });

      let seriesArr = [];
      for (let index = 0; index < list.length; index++) {
        seriesArr = seriesArr.concat([
          {
            value: Number(list[index].groupValue),
            name: list[index].groupName,
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

      const option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          show: false,
        },
        series: [
          {
            name: "资产价值",
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

      this.chart3.setOption(option);
      /**
       * echarts点击事件
       * 声明入口
       */
      const self = this;
      this.chart3.on("click", (params) => {
        localStorage.setItem("assetsType", params.name);
        self.onItemClick("资产总量统计");
      });
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
    .chart {
      flex: 1 0;
      height: 100%;
      overflow: hidden;
    }

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

    .chart3 {
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
