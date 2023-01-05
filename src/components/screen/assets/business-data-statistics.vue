<template>
  <div class="business_data_statistics_root">
    <Box title="业务数据统计">
      <div class="container">
        <div class="legend">
          <span :class="{ active: type === 1 }" @click="type = 1">
            <p></p>
            当日
          </span>
          <span :class="{ active: type === 2 }" @click="type = 2">
            <p></p>
            当月
          </span>
          <span :class="{ active: type === 3 }" @click="type = 3">
            <p></p>
            当年
          </span>
        </div>
        <div class="chart" id="business_data_statistics"></div>
        <div class="labels">
          <div class="part">
            <div class="item">
              <img src="@/assets/images/screen/icon-11.png" alt="" />
              <span>
                当日业务笔数
                <p>1276</p>
                笔
              </span>
            </div>
            <div class="item">
              <img src="@/assets/images/screen/icon-12.png" alt="" />
              <span>
                当日变动金额
                <p>2344</p>
                万元
              </span>
            </div>
          </div>
          <div class="part">
            <div class="item">
              <img src="@/assets/images/screen/icon-13.png" alt="" />
              <span>
                当日折旧笔数
                <p>1276</p>
                笔
              </span>
            </div>
            <div class="item">
              <img src="@/assets/images/screen/icon-14.png" alt="" />
              <span>
                当日变动金额
                <p>2344</p>
                万元
              </span>
            </div>
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

export default {
  name: "BusinessDataStatistics",

  components: {
    Box,
  },

  data() {
    return {
      chart: null,
      type: 1,
    };
  },

  mounted() {
    this.init();
  },

  beforeUnmount() {
    echarts.dispose(document.getElementById("business_data_statistics"));
  },

  methods: {
    async init() {
      this.chart = echarts.init(
        document.getElementById("business_data_statistics")
      );
      const xData = [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
      ];
      const tq2 = [
        10, 50, 50, 27, 49, 58, 80, 80, 19, 60, 30, 30, 49, 18, 90, 20, 19, 60,
        30, 30, 49, 18, 90, 20,
      ]; // 已出核酸检测结果

      const option = {
        title: {
          show: false,
        },
        grid: {
          top: "4%",
          left: "2%",
          right: "4%",
          bottom: "5%",
          containLabel: true,
        },
        tooltip: {
          trigger: "item",
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
                fontSize: 12,
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            data: xData,
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
            name: "业务笔数",
            type: "line",
            showAllSymbol: true,
            symbol: "circle",
            symbolSize: 6,
            lineStyle: {
              normal: {
                color: "#009EF8",
              },
            },
            label: {
              show: false,
              position: "top",
              textStyle: {
                color: "#009EF8",
              },
            },
            itemStyle: {
              color: "#fff",
              borderColor: "#009EF8",
              borderWidth: 2,
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0, 166, 255, 1)",
                    },
                    {
                      offset: 1,
                      color: "rgba(0, 166, 255, .4)",
                    },
                  ],
                  false
                ),
              },
            },
            data: tq2, //data.values
          },
        ],
      };

      this.chart.setOption(option);
    },
  },
};
</script>

<style scoped lang="scss">
.business_data_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .legend {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
        margin-left: 36px;

        &:first-child {
          margin-left: 0;
        }

        p {
          width: 9px;
          height: 9px;
          border: 1px solid #ffffff;
          border-radius: 50%;
          margin-right: 3px;
        }
      }

      .active {
        p {
          background-color: rgba(5, 97, 252, 1);
        }
      }
    }

    .chart {
      width: 100%;
      flex: 1 0;
    }

    .labels {
      width: 100%;
      display: flex;
      flex-direction: column;

      .part {
        width: calc(100% - 12px * 2);
        height: 34px;
        background: rgba(59, 132, 255, 0.2);
        border: 1px solid rgba(0, 189, 250, 0.2);
        display: flex;
        align-items: center;
        margin: 3px 12px 0;
        padding: 0 26px;
        box-sizing: border-box;

        &:last-child {
          margin-bottom: 10px;
        }

        .item {
          flex: 1 0;
          display: flex;
          align-items: center;

          &:last-child {
            margin-left: 16px;
          }

          img {
            width: 17px;
            margin-right: 8px;
          }

          span {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #ffffff;
            display: flex;
            align-items: center;

            p {
              font-size: 16px;
              font-weight: bold;
              color: rgba(35, 120, 218, 1);
              margin: 0 5px;
            }
          }
        }
      }
    }
  }
}
</style>
