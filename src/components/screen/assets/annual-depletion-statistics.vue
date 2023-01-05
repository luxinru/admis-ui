<template>
  <div class="annual_depletion_statistics_root">
    <Box title="年折耗统计">
      <div class="container">
        <div class="label">
          <span>
            全年折耗：
            <p>1143.99</p>
            万元
          </span>
        </div>
        <div class="chart" id="annual_depletion_statistics"></div>
      </div>
    </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";
import * as echarts from "echarts";

export default {
  name: "AnnualDepletionStatistics",

  components: {
    Box,
  },

  data() {
    return {
      chart: null,
    };
  },

  mounted() {
    this.init();
  },

  beforeUnmount() {
    echarts.dispose(document.getElementById("annual_depletion_statistics"));
  },

  methods: {
    async init() {
      this.chart = echarts.init(
        document.getElementById("annual_depletion_statistics")
      );

      let arr = [];
      let list = [];
      let series = [];
      let legend = [];
      let fontSize = 12;
      let barWidth = 4;
      let barGap = 0;
      let maxList = [];
      let max = 460; //背景最大值取y轴刻度线（最后注释部分）
      let colorStartList = [
        "transparent",
        "transparent",
        "transparent",
        "transparent",
      ];
      let colorLeftList = ["#000", "#000", "#000", "#000"];
      let colorTopList = ["#1E7EFF", "#FFA75A", "#6ACC29", "#9833FF"];
      let colorEndList = ["#4084EE", "#FF8D28", "#6ACC29", "#9833FF"];
      const chartObj = {
        series: [
          {
            name: "月计提",
            data: [269, 460, 400, 170, 269, 460, 400, 170, 269, 460, 269, 460],
          },
          {
            name: "月补提",
            data: [39, 50, 40, 100, 39, 50, 40, 100, 39, 50, 40, 100],
          },
          {
            name: "累计折旧",
            data: [15, 200, 80, 60, 15, 200, 80, 60, 15, 200, 80, 60],
          },
        ],
        chartList: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
        ],
      };
      function colorRgba(str, alpha) {
        let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var sColor = str.toLowerCase();
        if (sColor == "transparent") {
          return "transparent";
        }
        if (sColor && reg.test(sColor)) {
          if (sColor.length === 4) {
            var sColorNew = "#";
            for (let i = 1; i < 4; i += 1) {
              sColorNew += sColor
                .slice(i, i + 1)
                .concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
          }
          //处理六位的颜色值
          var sColorChange = [];
          for (let i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
          }
          return "rgba(" + sColorChange.join(",") + "," + alpha + ")";
        } else {
          return sColor;
        }
      }
      if (chartObj.series && chartObj.series.length) {
        chartObj.series.forEach((ele, i) => {
          arr = arr.concat(ele.data);
        });
        maxList = chartObj.series[0].data.map(() => {
          return max;
        });
        list = chartObj.series[0].data.map((item, index) => {
          return 1;
        });
        chartObj.series.forEach((item, index) => {
          legend.push({
            name: item.name,
            itemStyle: {
              color: colorEndList[index % colorEndList.length],
            },
          });

          //实际数据顶部切片
          series.push({
            data: item.data,
            type: "pictorialBar",
            tooltip: {
              show: false,
            },
            barMaxWidth: fontSize * 3,
            color: colorTopList[index],
            symbolPosition: "end",
            symbol: "diamond",
            symbolOffset: [
              (-0.5 * (chartObj.series.length - 1) +
                index +
                -0.5 * barGap * 0.01 * (chartObj.series.length - 1) +
                barGap * 0.01 * index) *
                barWidth,
              "-50%",
            ],
            symbolSize: [barWidth, barWidth * 0.4],
            zlevel: 2,
          });
          //实际数据侧边切片
          series.push({
            data: item.data,
            type: "pictorialBar",
            tooltip: {
              show: false,
            },
            barMaxWidth: fontSize * 3,
            color: {
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              type: "linear",
              global: false,
              colorStops: [
                {
                  offset: 0,
                  color: "transparent",
                },
                {
                  offset: 0.2,
                  color: colorRgba(
                    colorLeftList[index % colorLeftList.length],
                    0.2
                  ),
                },
                {
                  offset: 1,
                  color: colorRgba(
                    colorLeftList[index % colorLeftList.length],
                    0.3
                  ),
                },
              ],
            },
            symbolPosition: "end",
            symbol: "rect",
            symbolSize: [barWidth / 2, "100%"],
            symbolOffset: [
              (-0.5 * (chartObj.series.length - 1) +
                index +
                -0.5 * barGap * 0.01 * (chartObj.series.length - 1) +
                barGap * 0.01 * index -
                0.25) *
                barWidth,
              0,
            ],
            zlevel: 1,
          });
          //柱子
          series.push({
            data: item.data,
            type: "bar",
            name: item.name,
            barGap: barGap + "%",
            barWidth: barWidth,
            barMaxWidth: fontSize * 3,
            label: {
              show: false,
              position: "top",
              distance: fontSize * 0.3,
              textStyle: {
                color: colorEndList[index % colorEndList.length],
                fontSize: fontSize,
              },
              // formatter: function (a, b) {
              //     return a.value==0?'':a.value;
              // },
            },
            itemStyle: {
              color: {
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                type: "linear",
                global: false,
                colorStops: [
                  {
                    offset: 0,
                    color: colorStartList[index % colorStartList.length],
                  },
                  {
                    offset: 0.2,
                    color: colorRgba(
                      colorEndList[index % colorEndList.length],
                      0.2
                    ),
                  },
                  {
                    offset: 1,
                    color: colorRgba(
                      colorEndList[index % colorEndList.length],
                      1
                    ),
                  },
                ],
              },
            },
          });
        });
      }
      const option = {
        tooltip: {
          show: true,
          trigger: "item",
        },
        grid: {
          top: '18%',
          left: "2%",
          right: "4%",
          bottom: fontSize,
          containLabel: true, //包括文本，居中
        },
        legend: {
          show: true,
          data: legend,
          selectedMode: false, //图例是否可以点击
          icon: "rect",
          itemWidth: 8,
          itemHeight: 4,
          textStyle: {
            color: "#C3E3F9",
            fontSize: fontSize,
          },
          right: "0%",
        },
        xAxis: {
          data: chartObj.chartList,
          type: "category",
          boundaryGap: true,
          axisLine: {
            //坐标轴轴线相关设置。数学上的x轴
            show: true,
            lineStyle: {
              color: "rgba(87, 107, 139, 0.66)",
            },
          },
          axisLabel: {
            //坐标轴刻度标签的相关设置
            textStyle: {
              color: "rgba(196, 225, 255, 1)",
              fontSize: 14,
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          interval: 0,
        },
        yAxis: [
          {
            type: "value",
            axisLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: "rgba(87, 107, 139, 0.66)",
                type: "dashed",
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: "rgba(87, 107, 139, 0.66)",
                type: "dashed",
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              fontSize: 12,
              color: "rgba(196, 225, 255, 1)",
            },
          },
        ],
        series: series,
      };

      this.chart.setOption(option);
    },
  },
};
</script>

<style scoped lang="scss">
.annual_depletion_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .container {
    position: relative;
    width: 100%;
    height: 100%;

    .label {
      position: absolute;
      top: 0;
      left: 12px;
      display: flex;
      align-items: center;

      span {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;

        p {
          font-size: 16px;
          color: rgba(0, 240, 255, 1);
          margin: 0 5px 0 0;
        }
      }
    }

    .chart {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
