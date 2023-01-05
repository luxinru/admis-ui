<template>
  <div class="asset_classification_statistics_root">
    <Box title="资产分类统计">
      <div class="container">
        <div class="chart" id="asset_classification_statistics1"></div>
        <div class="chart" id="asset_classification_statistics2"></div>
      </div>
    </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";
import * as echarts from "echarts";

export default {
  name: "AssetClassificationStatistics",

  components: {
    Box,
  },

  data() {
    return {
      chart1: null,
      chart2: null,
    };
  },

  mounted() {
    this.init1();
    this.init2();
  },

  beforeUnmount() {
    echarts.dispose(
      document.getElementById("asset_classification_statistics1")
    );
    echarts.dispose(
      document.getElementById("asset_classification_statistics2")
    );
  },

  methods: {
    async init1() {
      this.chart = echarts.init(
        document.getElementById("asset_classification_statistics1")
      );

      let data1 = [
        "固定资产",
        "无形资产",
        "长摊资产",
        "实物资产",
        "房屋资产",
        "弃置资产",
      ];
      let data2 = [
        {
          value: 210,
          name: "固定资产",
        },
        {
          value: 235,
          name: "无形资产",
        },
        {
          value: 274,
          name: "长摊资产",
        },
        {
          value: 310,
          name: "实物资产",
        },
        {
          value: 435,
          name: "房屋资产",
        },
        {
          value: 435,
          name: "弃置资产",
        },
      ];
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

      this.chart.setOption(option);
    },

    async init2() {
      this.chart = echarts.init(
        document.getElementById("asset_classification_statistics2")
      );

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
              name: "无形数量",
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
          indicator: [
            { name: "固定资产", max: 6500 },
            { name: "房屋资产", max: 6500 },
            { name: "弃置资产", max: 6500 },
            { name: "实物资产", max: 6500 },
            { name: "长摊资产", max: 6500 },
            { name: "无形资产", max: 6500 },
          ],
          center: ["30%", "50%"],
          radius: "60%",
        },
        series: [
          {
            type: "radar",
            data: [
              {
                value: [5000, 5000, 5000, 5000, 5000, 5000],
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
                value: [6500, 5000, 4000, 5500, 4000, 2100],
                name: "无形数量",
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

      this.chart.setOption(option);
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
