<template>
  <div class="total_assets_statistics_root">
    <Box title="资产总量统计">
      <div class="container">
        <div class="chart" id="total_assets_statistics"></div>
      </div>
    </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";
import * as echarts from "echarts";
import { fetchAssetsCount } from "@/api/screen/assets/index";

export default {
  name: "TotalAssetsStatistics",

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
    echarts.dispose(document.getElementById("total_assets_statistics"));
  },

  methods: {
    async init() {
      const depart = JSON.parse(localStorage.getItem("currentDepart") || {});
      const { data } = await fetchAssetsCount({
        departCode: depart.departCode,
        normType: 0,
      });

      this.chart = echarts.init(
        document.getElementById("total_assets_statistics")
      );

      var xData = data.map((item) => item.assetsType);
      var lastYearData = data.map((item) => item.assetsCount);
      var thisYearData = data.map((item) => item.assetsValue);
      var timeLineData = [1];
      let legend = ["进库数", "出库数"];
      var background = "#0e2147"; //背景
      let textColor = "#fff";
      let lineColor = "rgba(255,255,255,0.2)";
      let colors = [
        {
          start: "rgba(25, 190, 238, 1)",
          end: "rgba(1, 243, 177, 1)",
        },
        {
          start: "rgba(25, 225, 238, 1)",
          end: "rgba(0, 69, 255, 1)",
        },
      ];
      let borderData = [];
      let scale = 2;
      borderData = xData.map((item) => {
        return scale;
      });

      const option = {
        baseOption: {
          timeline: {
            show: false,
            top: 0,
            data: [],
          },
          tooltip: {
            trigger: "item",
          },
          grid: [
            // 左边
            {
              show: false,
              left: "2%",
              top: "10%",
              bottom: "5%",
              containLabel: true,
              width: "37%",
            },
            // 中间
            {
              show: false,
              left: "52%",
              top: "10%",
              bottom: "5%",
              width: "26%",
            },
            // 右边
            {
              show: false,
              right: "2%",
              top: "10%",
              bottom: "5%",
              containLabel: true,
              width: "37%",
            },
          ],
          xAxis: [
            {
              type: "value",
              inverse: true,
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              position: "bottom",
              axisLabel: {
                show: false,
              },
              splitLine: {
                show: false,
              },
            },
            {
              gridIndex: 1,
              show: false,
            },
            {
              gridIndex: 2,
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              position: "bottom",
              axisLabel: {
                show: false,
              },
              splitLine: {
                show: false,
              },
            },
          ],
          yAxis: [
            {
              name: "数量",
              nameLocation: "start",
              nameGap: 0,
              nameTextStyle: {
                color: "rgba(64, 167, 255, 1)",
                align: "right",
              },
              type: "category",
              inverse: true,
              axisLine: {
                show: false,
              },

              axisTick: {
                show: false,
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: "rgba(255, 255, 255, 1)",
                  fontSize: "12",
                },
                formatter: function (value) {
                  const finded = data.find((item) => item.assetsType === value);
                  return finded.assetsCount;
                },
              },
              data: xData,
            },
            {
              gridIndex: 1,
              type: "category",
              inverse: true,
              position: "left",
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                show: true,
                // padding:[10,0,0,0],
                textStyle: {
                  color: "rgba(206, 221, 239, 1)",
                  fontSize: 12,
                },
              },
              data: xData.map(function (value) {
                return {
                  value: value,
                  textStyle: {
                    align: "center",
                  },
                };
              }),
            },
            {
              name: "总价值（万元）",
              nameLocation: "start",
              nameGap: 0,
              nameTextStyle: {
                color: "rgba(64, 167, 255, 1)",
                align: "left",
              },
              gridIndex: 2,
              type: "category",
              inverse: true,
              position: "right",
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: "rgba(255, 255, 255, 1)",
                  fontSize: "12",
                },
                formatter: function (value) {
                  const finded = data.find((item) => item.assetsType === value);
                  return finded.assetsValue.toFixed(2);
                },
              },
              data: xData,
            },
          ],
          series: [],
        },
        options: [],
      };

      // option.baseOption.timeline.data.push(timeLineData[0])
      option.options.push({
        series: [
          {
            name: "数量",
            type: "bar",
            barWidth: 6,
            stack: "1",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: colors[0].start,
                  },
                  {
                    offset: 1,
                    color: colors[0].end,
                  },
                ]),
              },
            },
            showBackground: true,
            backgroundStyle: {
              color: "rgba(118, 168, 255, 0.1)",
            },
            data: lastYearData,
          },
          {
            name: "总价值",
            type: "bar",
            stack: "2",
            barWidth: 6,
            xAxisIndex: 2,
            yAxisIndex: 2,
            showBackground: true,
            backgroundStyle: {
              color: "rgba(118, 168, 255, 0.1)",
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: colors[1].start,
                  },
                  {
                    offset: 1,
                    color: colors[1].end,
                  },
                ]),
              },
            },
            data: thisYearData,
          },
        ],
      });

      this.chart.setOption(option);
    },
  },
};
</script>

<style scoped lang="scss">
.total_assets_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: auto;

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
  }
}
</style>
