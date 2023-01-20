<template>
  <div class="block_statistics_root">
    <Box title="区块统计">
      <template v-slot:more>
        <div
          class="select"
          v-click-out-side="onClickOutside1"
          @click="isShow1 = !isShow1"
        >
          <span>
            {{ currentType1 === 0 ? "资产类型" : "资产类别" }}
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
        <!-- <div
          class="select"
          v-click-out-side="onClickOutside2"
          @click="isShow2 = !isShow2"
        >
          <span>
            {{ currentType2 === 0 ? "财务准则" : "会计准则" }}
          </span>
          <img src="@/assets/images/screen/more-1.png" alt="" />

          <div class="content" v-if="isShow2">
            <span
              class="content_item"
              :class="{
                content_item_active: currentType2 === item.value,
              }"
              v-for="(item, index) in options2"
              :key="index"
              @click="onOptionsClick2(item)"
            >
              {{ item.label }}
            </span>
          </div>
        </div> -->
      </template>
      <div class="container">
        <img class="img" src="@/assets/images/screen/base-3.png" alt="" />
        <div id="container" class="chart"></div>
      </div>
    </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";
import clickOutSide from "@mahdikhashan/vue3-click-outside";
import { fetchBlockCount } from "@/api/screen/assets/index";

import Highcharts from "highcharts/highstock";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsDrilldown from "highcharts/modules/drilldown";
import Highcharts3D from "highcharts/highcharts-3d";
import Highmaps from "highcharts/modules/map";

HighchartsMore(Highcharts);
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
Highmaps(Highcharts);

import img from "@/assets/images/screen/base-3.png";

export default {
  name: "BlockStatistics",

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
      ],
      isShow2: false,
      currentType2: 0,
      options2: [
        {
          label: "财务准则",
          value: 0,
        },
        {
          label: "会计准则",
          value: 1,
        },
      ],
    };
  },

  mounted() {
    this.init();

    bus.on("onDepartChange", (depart) => {
      this.init();
    });
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
      this.currentType2 = data.value;
      this.isShow2 = false;
      this.init();
    },

    async init() {
      const depart = JSON.parse(localStorage.getItem("currentDepart") || {});
      const { data } = await fetchBlockCount({
        departCode: depart.departCode,
        dimension: this.currentType1, // 0资产类型 1资产类别
        normType: this.currentType2, // 0财务准则 1会计准则
      });

      console.log("data :>> ", data);

      if (this.chart) {
        this.chart.destroy();
      }

      const arr = data.map((item) => {
        return {
          label: item.groupName,
          value: Number(item.groupValue),
        };
      });
      const self = this;
      // 初始化 Highcharts 图表
      this.chart = Highcharts.chart("container", {
        chart: {
          type: "pie",
          backgroundColor: null,
          options3d: {
            enabled: true,
            alpha: 65,
          },
        },
        colors: [
          "#4b90fe",
          "#3ad0ff",
          "#8dfabc",
          "#ffc178",
          "#2ba5ea",
          "#0074ff",
        ],
        title: {
          text: null,
        },
        legend: {
          itemStyle: {
            color: "#fff",
          },
          itemMarginBottom: 10,
          labelFormatter: function () {
            /*
             *  格式化函数可用的变量：this， 可以用 console.log(this) 来查看包含的详细信息
             *  this 代表当前数据列对象，所以默认的实现是 return this.name
             */
            const finded = arr.find((item) => item.label === this.name);
            return this.name + " " + finded.value;
          },
        },
        plotOptions: {
          pie: {
            size: "130%",
            innerSize: "40%",
            depth: 45,
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: false,
            },
            showInLegend: true,
          },
        },
        series: [
          {
            name: "货物金额",
            data: arr.map((item) => {
              return [item.label, item.value];
            }),
          },
        ],
      });
    },
  },
};
</script>

<style scoped lang="scss">
.block_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .select {
    position: relative;
    width: max-content;
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
    display: flex;
    align-items: center;
    justify-content: center;

    .img {
      position: absolute;
      height: 341px;
      margin-top: 16px;
    }

    .chart {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
  }
}
</style>
