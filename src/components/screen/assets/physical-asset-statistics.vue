<template>
  <div class="physical_asset_statistics_root">
    <Box title="实物资产统计">
      <div class="container">
        <div class="legend">
          <span
            :class="{ active: type === 1 }"
            @click="
              type = 1;
              init();
            "
          >
            <p></p>
            总数量
          </span>
          <span
            :class="{ active: type === 2 }"
            @click="
              type = 2;
              init();
            "
          >
            <p></p>
            总金额
          </span>
          <span
            :class="{ active: type === 3 }"
            @click="
              type = 3;
              init();
            "
          >
            <p></p>
            总业务量
          </span>
        </div>
        <div class="chart" id="physical_asset_statistics"></div>
      </div>
    </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";
import * as echarts from "echarts";
import { fetchRealAssetsCount } from "@/api/screen/assets/index";

export default {
  name: "PhysicalAssetStatistics",

  components: {
    Box,
  },

  data() {
    return {
      type: 1,
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
    echarts.dispose(document.getElementById("physical_asset_statistics"));
  },

  methods: {
    async init() {
      const depart = JSON.parse(localStorage.getItem("currentDepart") || {});
      const { data } = await fetchRealAssetsCount({
        departCode: depart.departCode,
        dimension: 0,
        normType: 0,
        groupType: 1,
      });
      if (this.chart) {
        echarts.dispose(document.getElementById("physical_asset_statistics"));
      }

      this.chart = echarts.init(
        document.getElementById("physical_asset_statistics")
      );

      let dataArr = data.map((item) => item.groupValue);
      let xData = data.map((item) => item.groupName);
      let singleBarWidth = 6;
      function getColor(color) {
        return {
          type: "linear",
          x: 0,
          y: 1,
          x2: 0,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: color[0], // 0% 处的颜色
            },
            {
              offset: 1,
              color: color[1], // 100% 处的颜色
            },
          ],
        };
      }
      let option = {
        tooltip: {
          trigger: "axis",
          formatter: "{b}: {c}",
        },
        grid: {
          left: "13%",
          right: "5%",
          top: "8%",
          bottom: "14%",
        },
        xAxis: {
          nameTextStyle: {
            fontSize: 12,
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.2)",
            },
          },
          splitLine: { show: false },
          axisTick: { show: false },
          //轴线上的字
          axisLabel: {
            show: true,
            color: "#fff",
            fontSize: 12,
          },
          data: xData,
        },
        yAxis: {
          type: "value",
          // min: 0,
          // max: 100,
          // interval: 20,
          name: "",
          axisTick: { show: false },
          nameTextStyle: {
            color: "#fff",
            fontSize: 12,
          },
          //轴线上的字
          axisLabel: {
            color: "#fff",
            fontSize: 12,
          },
          axisLine: { show: false },
          //网格线
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(183, 200, 235, 0.3)",
              type: "dashed",
              opacity: 0.3,
            },
          },
        },
        series: [
          {
            type: "bar",
            name: "产量",
            data: dataArr,
            barWidth: singleBarWidth, //统计条宽度
            itemStyle: {
              color: getColor([
                "rgba(45, 72, 173, 0.1)",
                "rgba(57, 206, 255, 1)",
              ]),
            },
          },
          {
            type: "bar",
            data: dataArr,
            barWidth: singleBarWidth, //统计条宽度
            barGap: "-2%",
            itemStyle: {
              color: getColor([
                "rgba(20, 43, 128, 0.2)",
                "rgba(36, 201, 255, 1)",
              ]),
            },
          },
          {
            z: 3,
            type: "pictorialBar",
            symbolPosition: "end",
            data: dataArr,
            symbol: "diamond",
            symbolOffset: [0, "-50%"],
            symbolSize: [singleBarWidth * 2, singleBarWidth * 2 * 0.5],
            itemStyle: {
              borderWidth: 0,
              color: "#6FF7FF",
            },
          },
        ],
      };

      this.chart.setOption(option);
    },
  },
};
</script>

<style scoped lang="scss">
.physical_asset_statistics_root {
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
          border: 1px solid rgba(0, 255, 255, 1);
          border-radius: 50%;
          margin-right: 3px;
        }
      }

      .active {
        p {
          background-color: rgba(0, 255, 255, 1);
        }
      }
    }

    .chart {
      width: 100%;
      flex: 1 0;
    }
  }
}
</style>
