<template>
  <div class="annual_depletion_statistics_root">
    <Box title="年折耗统计">
      <template v-slot:more>
        <div
          class="select"
          v-click-out-side="onClickOutside1"
          @click="isShow1 = !isShow1"
        >
          <span>
            {{
              currentType1 === 0
                ? "资产类型"
                : currentType1 === 1
                ? "资产类别"
                : "资金渠道"
            }}
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
          <span> {{ "全部分类" }} </span>
          <img src="@/assets/images/screen/more-1.png" alt="" />

          <div class="content" v-if="isShow2">
            <span
              class="content_item"
              :class="{
                content_item_active: currentType2 === item.value,
              }"
              v-for="(item, index) in options2"
              :key="index"
              @click="onOptionsClick1(item)"
            >
              {{ item.label }}
            </span>
          </div>
        </div>
      </template>
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
import clickOutSide from "@mahdikhashan/vue3-click-outside";
import { fetchDepletionCount } from "@/api/screen/assets/index";

export default {
  name: "AnnualDepletionStatistics",

  components: {
    Box,
  },

  directives: {
    clickOutSide,
  },

  data() {
    return {
      chart: null,
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
        {
          label: "资金渠道",
          value: 1,
        },
      ],
      isShow2: false,
      currentType2: "all",
      options2: [
        {
          label: "全部分类",
          value: "all",
        },
      ],
    };
  },

  mounted() {
    this.init();
  },

  beforeUnmount() {
    echarts.dispose(document.getElementById("annual_depletion_statistics"));
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
      this.currentType1 = data.value;
      this.isShow2 = false;
      this.init();
    },

    async init() {
      const depart = JSON.parse(localStorage.getItem("currentDepart") || {});
      const { data } = await fetchDepletionCount({
        departCode: depart.departCode,
        dimension: this.currentType1, // 0资产类型 1资产类别 2资金渠道
        dictCode: "",
        normType: 0, // 0财务准则 1会计准则
      });
      console.log("data :>> ", data);

      if (this.chart) {
        echarts.dispose(document.getElementById("annual_depletion_statistics"));
      }

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
            data: data.map((item) => item.accrualValue),
          },
          {
            name: "月补提",
            data: data.map((item) => item.recoilValue),
          },
          {
            name: "累计折旧",
            data: data.map((item) => item.cumulativeValue),
          },
        ],
        chartList: data.map((item) => item.month.replace("月", "")),
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
          top: "18%",
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
            interval: 0,
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

  .select {
    position: relative;
    flex: 1 0;
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
