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

    bus.on("onDepartChange", (depart) => {
      this.init();
    });
  },

  beforeUnmount() {
    echarts.dispose(document.getElementById("production_statistics"));
    bus.off('onDepartChange')
  },

  methods: {
    async init() {
      const depart = JSON.parse(localStorage.getItem("currentDepart") || {});
      const { data } = await fetchProductionCount({
        departCode: depart.departCode,
      });

      console.log('data :>> ', data);

      const names = data.map((item) => item.groupName);
      const labels = data[0].groupValue.map((item) => item.month);
      // const labels = data.forEchar

      if (this.chart) {
        echarts.dispose(document.getElementById("production_statistics"));
      }

      this.chart = echarts.init(
        document.getElementById("production_statistics")
      );

      let xLabel = labels;
      let goToSchool = data[0].groupValue.map((item) => item.value);
      let goOutSchool = data[1].groupValue.map((item) => item.value);

      const option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "0%",
          textStyle: {
            color: "rgba(255, 255, 255, 1)",
            fontSize: this.vw(12),
          },
          icon: "rect",
          itemWidth: 8,
          itemHeight: 4,
          selectedMode: false
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
                fontSize: this.vw(14),
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
            fontSize: this.vw(12),
            color: "rgba(196, 225, 255, 1)",
          },
        },
        series: [
          {
            name: "气产量",
            type: "line",
            smooth: true,
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
            name: "油产量",
            type: "line",
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

      /**
       * echarts点击事件
       * 声明入口
       */
      const self = this;
      this.chart.on("click", (params) => {
        console.log("params :>> ", params);
        localStorage.setItem("assetsType", params.name)
        self.onItemClick("油气产量统计");
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
  },
};
</script>

<style scoped lang="scss">
.production_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: auto;

  .container {
    position: relative;
    width: 100%;
    height: 100%;

    .chart {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
