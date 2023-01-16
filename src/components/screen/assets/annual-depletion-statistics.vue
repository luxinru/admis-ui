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
          <span :title="currentType2.label"> {{ currentType2.label }} </span>
          <img src="@/assets/images/screen/more-1.png" alt="" />

          <div class="content" v-if="isShow2">
            <span
              class="content_item"
              :class="{
                content_item_active: currentType2.value === item.value,
              }"
              v-for="(item, index) in options2"
              :key="index"
              @click="onOptionsClick2(item)"
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
            <p>{{ all }}</p>
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
import useScreenStore from "@/store/modules/screen";

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
      all: 0,
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
      currentType2: {
        label: "全部分类",
        value: "all",
      },
    };
  },

  computed: {
    classList() {
      return useScreenStore().classList || [];
    },

    options2() {
      let result = [
        {
          label: "全部分类",
          value: "all",
        },
      ];

      result = result.concat(
        this.classList.map((item) => {
          return {
            label: item.dictName,
            value: item.dictCode,
          };
        })
      );

      return result;
    },
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
      this.currentType2 = data;
      this.isShow2 = false;
      this.init();
    },

    async init() {
      const depart = JSON.parse(localStorage.getItem("currentDepart") || {});
      const { data } = await fetchDepletionCount({
        departCode: depart.departCode,
        dimension: this.currentType1, // 0资产类型 1资产类别 2资金渠道
        dictCode:
          this.currentType2.value === "all" ? "" : this.currentType2.value,
        normType: 0, // 0财务准则 1会计准则
      });
      console.log("data :>> ", data);

      data.forEach((item) => {
        this.all += Number(item.cumulativeValue);
      });

      if (this.chart) {
        echarts.dispose(document.getElementById("annual_depletion_statistics"));
      }

      this.chart = echarts.init(
        document.getElementById("annual_depletion_statistics")
      );

      // mock数据
      const dataArr = {
        xdata: data.map((item) => item.month.replace("月", "")),
        vaccination: data.map((item) => item.accrualValue),
        unvaccinated: data.map((item) => item.recoilValue),
        unvaccinatedTwo: data.map((item) => item.cumulativeValue),
      };

      // tooltip
      const tooltip = {
        trigger: "item",
      };
      const legend = {
        data: ["月计提", "月补提", "累计折旧"],
        textStyle: { fontSize: 14, color: "#fff" },
        itemWidth: 8,
        itemHeight: 4,
        top: "0%",
        right: "2%",
        selectedMode: false,
      };
      const grid = { top: "20%", left: "10%", right: "6%", bottom: "15%" };
      // xAxis
      const xAxis = {
        name: "(月)",
        nameGap: 0,
        nameTextStyle: {
          fontSize: 12,
          color: "rgba(196, 225, 255, 1)",
        },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "rgba(87, 107, 139, 0.66)" } },
        axisLabel: {
          textStyle: { fontSize: 12, color: "rgba(196, 225, 255, 1)" },
          interval: 0,
        },
        data: dataArr.xdata,
      };

      // yAxis
      const yAxis = [
        {
          axisTick: { show: false },
          axisLine: { show: true, lineStyle: { type: "dashed" } },
          splitLine: {
            lineStyle: { color: "rgba(255,255,255, .05)", type: "dashed" },
          },
          axisLabel: {
            textStyle: { fontSize: 12, color: "rgba(196, 225, 255, 1)" },
          },
        },
        {
          show: true,
          max: 100,
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            textStyle: { fontSize: 16, color: "#fff" },
            formatter: (params) => {
              return `${params}%`;
            },
          },
        },
      ];

      // series
      const series = [
        {
          z: 1,
          name: "月计提",
          type: "pictorialBar",
          symbolPosition: "end",
          data: dataArr.vaccination,
          symbol: "diamond",
          symbolOffset: ["-50%", "-50%"],
          symbolSize: [12, 6],
          itemStyle: {
            borderColor: "#2fffa4",
            color: "#2fffa4",
          },
        },
        {
          z: 1,
          type: "bar",
          name: "月计提",
          barWidth: 12,
          barGap: "-50%",
          data: dataArr.vaccination,
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              x2: 1,
              y: 0,
              y2: 0,
              colorStops: [
                { offset: 0, color: "rgba(29, 245, 160, .7)" },
                { offset: 0.5, color: "rgba(29, 245, 160, .7)" },
                { offset: 0.5, color: "rgba(29, 245, 160, .3)" },
                { offset: 1, color: "rgba(29, 245, 160, .3)" },
              ],
            },
          },
        },
        {
          z: 2,
          name: "月补提",
          type: "pictorialBar",
          symbolPosition: "end",
          data: dataArr.unvaccinated,
          symbol: "diamond",
          symbolOffset: [0, "-50%"],
          symbolSize: [12, 6],
          itemStyle: {
            borderColor: "#32ffee",
            color: "#32ffee",
          },
        },
        {
          z: 2,
          type: "bar",
          name: "月补提",
          barWidth: 12,
          data: dataArr.unvaccinated,
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              x2: 1,
              y: 0,
              y2: 0,
              colorStops: [
                { offset: 0, color: "rgba(50, 255, 238, .7)" },
                { offset: 0.5, color: "rgba(50, 255, 238, .7)" },
                { offset: 0.5, color: "rgba(50, 255, 238, .3)" },
                { offset: 1, color: "rgba(50, 255, 238, .3)" },
              ],
            },
          },
        },
        {
          z: 3,
          name: "累计折旧",
          type: "pictorialBar",
          symbolPosition: "end",
          data: dataArr.unvaccinatedTwo,
          symbol: "diamond",
          symbolOffset: ["50%", "-50%"],
          symbolSize: [12, 6],
          itemStyle: {
            borderColor: "#ffd11a",
            color: "#ffd11a",
          },
        },
        {
          z: 3,
          type: "bar",
          name: "累计折旧",
          barWidth: 12,
          data: dataArr.unvaccinatedTwo,
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              x2: 1,
              y: 0,
              y2: 0,
              colorStops: [
                { offset: 0, color: "rgba(255, 209, 26, .7)" },
                { offset: 0.5, color: "rgba(255, 209, 26, .7)" },
                { offset: 0.5, color: "rgba(255, 209, 26, .3)" },
                { offset: 1, color: "rgba(255, 209, 26, .3)" },
              ],
            },
          },
        },
      ];
      const option = {
        tooltip,
        xAxis,
        yAxis,
        series,
        grid,
        legend,
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
      margin: 2px 0 0 0;
    }

    span {
      width: 70px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #bdd7e7;
      margin-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .content {
      position: absolute;
      height: max-content;
      max-height: 165px;
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
        height: 32px;
        font-size: 15px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
        border-bottom: 1px solid rgba(55, 130, 255, 0.2);
        padding: 0 10px;
        box-sizing: border-box;
        margin-left: 0;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

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
