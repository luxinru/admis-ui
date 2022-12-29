<template>
  <div class="proportion_rental_income_root">
    <Box title="租金收入占比">
      <div class="container">
        <!-- <div class="labels labels1">
          <div class="item">
            <span><CountTo :start="0" :end="25" />%</span>
            <p>成都</p>
          </div>
          <div class="item">
            <span><CountTo :start="0" :end="10" />%</span>
            <p>重庆</p>
          </div>
          <div class="item">
            <span><CountTo :start="0" :end="20" />%</span>
            <p>南充</p>
          </div>
        </div> -->

        <div class="chart_box">
          <div id="chart3" class="chart3"></div>
          <!-- <div class="info">
            <div class="bac"></div>

            <span class="label"> 共计 </span>
            <span class="value">
              <p><CountTo :start="0" :end="all" /></p>
              <span>笔</span>
            </span>
          </div> -->
        </div>

        <!-- <div class="labels labels2">
          <div class="item">
            <p>广元</p>
            <span><CountTo :start="0" :end="10" />%</span>
          </div>
          <div class="item">
            <p>遂宁</p>
            <span><CountTo :start="0" :end="10" />%</span>
          </div>
          <div class="item">
            <p>内江</p>
            <span><CountTo :start="0" :end="10" />%</span>
          </div>
        </div> -->
      </div>
    </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "./box.vue";
import * as echarts from "echarts";
import { fetchVisualRentalIncome } from "@/api/screen/house";

export default {
  name: "ProportionRentalIncome",

  components: {
    Box,
  },

  data() {
    return {
      all: 0,
      currentDepart: {},
    };
  },

  mounted() {
    const self = this;
    bus.on("onDepartChange", (depart) => {
      self.currentDepart = depart;
      self.fetchVisualRentalIncomeFun();
    });

    const depart = localStorage.getItem("currentDepart")
      ? JSON.parse(localStorage.getItem("currentDepart"))
      : "";

    if (depart) {
      this.currentDepart = depart;
      this.fetchVisualRentalIncomeFun();
    }
  },

  beforeUnmount() {
    echarts.dispose(document.getElementById("chart3"));
  },

  methods: {
    onItemClick(value, isAll = true) {
      if (isAll) {
        localStorage.removeItem("租金增长率");
      }
      localStorage.setItem("tableType", value);
      bus.emit("onModalShow");
    },

    initChart(data) {
      const self = this;
      echarts.dispose(document.getElementById("chart3"));
      const myChart = echarts.init(document.getElementById("chart3"));

      const { areaName, areaNum, areaValue } = data;
      this.all = Number(areaNum) || 0;
      let max = 0;
      areaValue.forEach((item) => {
        max += Number(item);
      });

      const colorList1 = [
        "#00A3F0",
        "#00FED2",
        "#FFD37A",
        "#F08200",
        "#F04900",
        "#F00000",
        "#F000A9",
        "#8200F0",
        "#ea7ccc",
        "#00A3F0",
        "#00FED2",
        "#FFD37A",
        "#F08200",
        "#F04900",
        "#F00000",
        "#F000A9",
        "#8200F0",
        "#ea7ccc",
        "#00A3F0",
        "#00FED2",
        "#FFD37A",
        "#F08200",
        "#F04900",
        "#F00000",
        "#F000A9",
        "#8200F0",
        "#ea7ccc",
        "#00A3F0",
        "#00FED2",
        "#FFD37A",
        "#F08200",
        "#F04900",
        "#F00000",
        "#F000A9",
        "#8200F0",
        "#ea7ccc",
        "#00A3F0",
        "#00FED2",
        "#FFD37A",
        "#F08200",
        "#F04900",
        "#F00000",
        "#F000A9",
        "#8200F0",
        "#ea7ccc",
      ];

      const colorList2 = [
        "rgba(0, 163, 240, 0)",
        "rgba(0, 254, 210, 0)",
        "rgba(255, 211, 122, 0)",
        "rgba(240, 130, 0, 0)",
        "rgba(240, 73, 0, 0)",
        "rgba(240, 0, 0, 0)",
        "rgba(240, 0, 169, 0)",
        "rgba(130, 0, 240, 0)",
        "rgba(234, 124, 204, 0)",
        "rgba(0, 163, 240, 0)",
        "rgba(0, 254, 210, 0)",
        "rgba(255, 211, 122, 0)",
        "rgba(240, 130, 0, 0)",
        "rgba(240, 73, 0, 0)",
        "rgba(240, 0, 0, 0)",
        "rgba(240, 0, 169, 0)",
        "rgba(130, 0, 240, 0)",
        "rgba(234, 124, 204, 0)",
        "rgba(0, 163, 240, 0)",
        "rgba(0, 254, 210, 0)",
        "rgba(255, 211, 122, 0)",
        "rgba(240, 130, 0, 0)",
        "rgba(240, 73, 0, 0)",
        "rgba(240, 0, 0, 0)",
        "rgba(240, 0, 169, 0)",
        "rgba(130, 0, 240, 0)",
        "rgba(234, 124, 204, 0)",
        "rgba(0, 163, 240, 0)",
        "rgba(0, 254, 210, 0)",
        "rgba(255, 211, 122, 0)",
        "rgba(240, 130, 0, 0)",
        "rgba(240, 73, 0, 0)",
        "rgba(240, 0, 0, 0)",
        "rgba(240, 0, 169, 0)",
        "rgba(130, 0, 240, 0)",
        "rgba(234, 124, 204, 0)",
        "rgba(0, 163, 240, 0)",
        "rgba(0, 254, 210, 0)",
        "rgba(255, 211, 122, 0)",
        "rgba(240, 130, 0, 0)",
        "rgba(240, 73, 0, 0)",
        "rgba(240, 0, 0, 0)",
        "rgba(240, 0, 169, 0)",
        "rgba(130, 0, 240, 0)",
        "rgba(234, 124, 204, 0)",
      ];
      const results = areaName
        ? areaName.map((item, index) => {
            return {
              name: item,
              value: ((Number(areaValue[index]) / max) * 100).toFixed(2),
              label: item,
            };
          })
        : [];

      myChart.setOption({
        title: {
          show: true,
          left: "2%",
          text: "{a|共计}" + `{b|${this.all}}` + "{a|笔}",
          textStyle: {
            rich: {
              a: {
                fontSize: 12,
                color: "#fff",
                fontWeight: "normal",
              },
              b: {
                fontSize: 16,
                color: "RGBA(77, 174, 244, 1)",
                fontWeight: "bold",
                padding: [0, 5, 0, 3],
              },
            },
          },
        },
        legend: {
          show: false,
        },
        tooltip: {
          show: true,
          trigger: "axis",
          valueFormatter: (value) => value + "%",
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "3%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: results ? results.map((item) => item.name) : [],
          axisLine: {
            lineStyle: {
              color: "rgba(87, 107, 139, 0.66)",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "rgba(196, 225, 255, 1)",
            interval: 0,
            interval: 0,
            rotate: 35,
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: "rgba(87, 107, 139, 0.66)",
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "rgba(87, 107, 139, 0.66)",
            },
          },
          axisLabel: {
            color: "rgba(255, 255, 255, 0.6)",
            formatter: "{value}%",
          },
          max: (value) => {
            return Number((value.max + value.max * 0.3).toFixed(0));
          },
        },
        series: [
          {
            name: "租金收入",
            type: "bar",
            data: results.map((item, index) => {
              return {
                value: item.value || 0,
                itemStyle: {
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: colorList1[index], // 0% 处的颜色
                      },
                      {
                        offset: 0.9,
                        color: colorList2[index], // 100% 处的颜色
                        opacity: 0,
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                },
              };
            }),
            barWidth: 10,
          },
          {
            z: 1,
            type: "pictorialBar",
            symbolPosition: "end",
            symbolRotate: "-90",
            symbolSize: [10, 10],
            // color: "rgb(4,128,224)",
            data: results.map((item, index) => {
              return {
                value: item.value || 0,
                itemStyle: {
                  color: colorList1[index],
                },
              };
            }),
            symbol: "triangle",
            symbolOffset: [0, -5],
            tooltip: {
              show: false,
            },
          },
        ],
      });

      myChart.getZr().on("click", (params) => {
        let pointInPixel = [params.offsetX, params.offsetY];
        if (myChart.containPixel("grid", pointInPixel)) {
          //点击第几个柱子
          let pointInGrid = myChart.convertFromPixel(
            { seriesIndex: 0 },
            pointInPixel
          );
          // 也可以通过params.offsetY 来判断鼠标点击的位置是否是图表展示区里面的位置
          // 也可以通过name[xIndex] != undefined，name是x轴的坐标名称来判断是否还是点击的图表里面的内容
          // x轴数据的索引
          let xIndex = pointInGrid[0];

          localStorage.setItem("租金增长率", areaName[xIndex]);
          self.onItemClick("租金收入占比", false);
        }
      });
    },

    async fetchVisualRentalIncomeFun() {
      const { data } = await fetchVisualRentalIncome({
        departCode: this.currentDepart.departCode,
        groupType: 0,
      });

      this.initChart(data);
    },
  },
};
</script>

<style scoped lang="scss">
.proportion_rental_income_root {
  width: 100%;
  flex: 1 0;
  overflow: hidden;
  margin-top: 5px;

  .container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .labels {
      flex: 1 0;
      display: flex;
      flex-direction: column;
      .item {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;

        span {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #4bb9f4;
        }
      }
    }

    .labels1 {
      align-items: flex-end;

      .item {
        span {
          margin-right: 5px;
        }

        &:nth-child(2) {
          margin-right: 20px;
        }
      }
    }

    .labels2 {
      .item {
        span {
          margin-left: 5px;
        }

        &:nth-child(2) {
          margin-left: 20px;
        }
      }
    }

    .chart_box {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .chart3 {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .info {
        position: relative;
        width: 79px;
        height: 79px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .bac {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 5px solid RGBA(18, 51, 90, 1);
          border-radius: 50%;
        }

        .label {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
        }

        .value {
          display: flex;
          align-items: center;

          p {
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #4bb9f4;
            font-weight: bold;
            margin: 3px 3px 0 0;
          }

          span {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #ffffff;
            margin: 5px 0 0 0;
          }
        }
      }
    }
  }
}
</style>
