<template>
  <div class="rental_info_root">
    <Box title="出租信息">
      <div class="container">
        <div class="top" @click="onItemClick('出租总收入')">
          <div class="imgs">
            <img
              class="img1"
              src="@/assets/images/screen/icon-bj2.png"
              alt=""
            />

            <img class="img2" src="@/assets/images/screen/income.png" alt="" />
          </div>

          <div class="info">
            <span> 出租总收入(万元) </span>

            <p><CountTo :start="0" :end="rentalIncome" /></p>
          </div>
        </div>

        <div class="chart_box">
          <div id="chart" class="chart"></div>
        </div>
      </div>
    </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import * as echarts from "echarts";
import Moment from "moment";
import Box from "./box.vue";

export default {
  name: "RentalInfo",

  components: {
    Box,
  },

  data() {
    return {
      rentalIncome: 0,
    };
  },

  mounted() {
    /**
     * 切换单位时更新数据
     */
    bus.on("fetchBasicStatsFun", (data) => {
      const { rentalIncome: value } = data;
      this.rentalIncome = Number(value) || 0;

      this.initChart(data);
    });
  },

  beforeUnmount() {
    echarts.dispose(document.getElementById("chart"));
  },

  methods: {
    Moment,

    /**
     * 点击打开表格弹窗
     * value 表明入口
     */
    onItemClick(value, isAll = true) {
      if (isAll) {
        localStorage.removeItem("出租总收入");
      }

      localStorage.setItem("tableType", value);
      bus.emit("onModalShow");
    },

    initChart(data) {
      const self = this;
      echarts.dispose(document.getElementById("chart"));
      const myChart = echarts.init(document.getElementById("chart"));
      const { chainlGrowth, yearOnYearGrowth } = data;
      const labels = chainlGrowth.map((item) => item.month + "月");

      myChart.setOption({
        legend: {
          show: true,
          top: 5,
          right: 0,
          icon: "rect",
          data: [
            {
              name: "同比增长",
            },
            {
              name: "环比增长",
            },
          ],
          textStyle: {
            color: "#fff",
            fontSize: this.vw(14),
          },
          itemWidth: 10,
          itemHeight: 10,
          inactiveBorderWidth: 0,
        },
        tooltip: {
          show: true,
          trigger: "axis",
        },
        grid: {
          top: "22%",
          left: "3%",
          right: "3%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: labels,
          axisLine: {
            lineStyle: {
              color: "rgba(87, 107, 139, 0.66)",
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: "rgba(87, 107, 139, 0.66)",
            },
          },
          axisLabel: {
            color: "rgba(196, 225, 255, 1)",
            fontSize: this.vw(12),
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
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
            fontSize: this.vw(12),
          },
          /**
           * 坐标轴最大值为数据最大值的1.5倍 为了美观
           */
          max: (value) => {
            return value.max + value.max * 0.5;
          },
        },
        series: [
          {
            name: "同比增长",
            type: "line",
            data: yearOnYearGrowth.map((item) => Number(item.value)),
            symbol: "none",
            lineStyle: {
              color: "rgba(76,164,255,1)",
              width: 1,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0.5, 0, 0.5, 1, [
                {
                  offset: 0,
                  color: "rgba(76,164,255,0.3)",
                },
                {
                  offset: 0.7,
                  color: "rgba(76,164,255,0)",
                },
              ]),
            },
          },
          {
            name: "环比增长",
            type: "line",
            data: chainlGrowth.map((item) => Number(item.value)),
            symbol: "none",
            lineStyle: {
              color: "rgba(131,255,180,1)",
              width: 1,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0.5, 0, 0.5, 1, [
                {
                  offset: 0,
                  color: "rgba(131,255,180,0.3)",
                },
                {
                  offset: 0.7,
                  color: "rgba(131,255,180,0)",
                },
              ]),
            },
          },
        ],
      });

      /**
       * echarts点击事件
       * 声明入口
       */
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

          localStorage.setItem(
            "出租总收入",
            Moment().format(`YYYY-${chainlGrowth[xIndex].month}`)
          );
          self.onItemClick("出租总收入", false);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.rental_info_root {
  width: 100%;
  height: 40.17857%;
  margin-top: 5px;
  overflow: hidden;

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 10px;
    box-sizing: border-box;

    .top {
      width: 100%;
      height: 98px;
      border-bottom: 1px solid rgba(23, 154, 255, 0.3);
      display: flex;
      align-items: center;

      .imgs {
        position: relative;
        width: 106px;
        height: 66px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 15%;

        .img1 {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .img2 {
          position: absolute;
          width: 35px;
          top: -10px;
          margin-left: 5px;
          animation: move2 2s linear infinite;
        }

        @keyframes move2 {
          0% {
            top: -10px;
          }

          50% {
            top: -15px;
          }

          100% {
            top: -10px;
          }
        }
      }

      .info {
        flex: 1 0;
        display: flex;
        flex-direction: column;
        margin-left: 11px;
        cursor: pointer;

        span {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
        }

        p {
          width: 100%;
          font-size: 36px;
          font-family: YouSheBiaoTiHei;
          font-weight: 400;
          font-style: italic;
          color: rgba(222, 237, 255, 0);

          background: linear-gradient(
            180deg,
            #eafff5 50%,
            rgba(153, 227, 127, 0.76) 80%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 10px 3px 0;
        }
      }
    }

    .chart_box {
      position: relative;
      flex: 1 0;
      width: 100%;

      .chart {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      .legend {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        align-items: center;

        .item {
          display: flex;
          align-items: center;
          margin-left: 18px;

          img {
            width: 10px;
            height: 10px;
          }

          span {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #ffffff;
            margin-left: 8px;
          }
        }
      }
    }
  }
}
</style>
