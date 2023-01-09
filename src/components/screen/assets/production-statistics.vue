<template>
  <div class="production_statistics_root">
    <Box title="油气产量统计">
      <div class="container">
        <div class="chart" id="production_statistics"></div>
      </div>
    </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";
import * as echarts from "echarts";
import { fetchProductionCount } from "@/api/screen/assets/index";

export default {
  name: "ProductionStatistics",

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
    echarts.dispose(document.getElementById("production_statistics"));
  },

  methods: {
    async init() {
      const depart = JSON.parse(localStorage.getItem("currentDepart") || {});
      const { data } = await fetchProductionCount({
        departCode: depart.departCode,
      });

      console.log('data :>> ', data);

      const names = data.map(item => item.groupName)
      // const labels = data.forEchar

      if (this.chart) {
        echarts.dispose(document.getElementById("production_statistics"));
      }

      this.chart = echarts.init(
        document.getElementById("production_statistics")
      );

      let xLabel = ["1月", "2月", "3月", "4月", "5月", "6月"];
      let goToSchool = ["40", "60", "22", "85", "50", "50"];
      let goOutSchool = ["20", "50", "12", "65", "30", "50"];

      const option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "0%",
          textStyle: {
            color: "rgba(255, 255, 255, 1)",
            fontSize: 12,
          },
          icon: 'rect',
          itemWidth: 8,
          itemHeight: 4,
          data: [
            {
              name: names[0],
            },
            {
              name: names[1],
            },
          ],
        },
        grid: {
          top: "15%",
          left: "2%",
          right: "4%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
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
            data: xLabel,
          },
        ],
        yAxis: {
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
        series: [
          {
            name: names[0],
            type: "line",
            smooth: true,
            showAllSymbol: true,
            symbolSize: 0,
            lineStyle: {
              normal: {
                width: 2,
                color: "rgba(59, 176, 242, 1)", // 线条颜色
              },
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(59, 176, 242, 0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(59, 176, 242, 0)",
                    },
                  ],
                  false
                ),
              },
            },
            data: goToSchool,
          },
          {
            name: names[1],
            type: "line",
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
            lineStyle: {
              normal: {
                width: 2,
                color: "rgba(46, 255, 169, 1)", // 线条颜色
              },
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(46, 255, 169, 0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(46, 255, 169, 0)",
                    },
                  ],
                  false
                ),
              },
            },
            data: goOutSchool,
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>

<style scoped lang="scss">
.production_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .container {
    width: 100%;
    height: 100%;

    .chart {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
