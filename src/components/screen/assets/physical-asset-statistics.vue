<template>
  <div class="physical_asset_statistics_root">
    <Box title="实物资产统计">
      <template v-slot:more>
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
        <div class="legend">
          <span
            :class="{ active: type === 0 }"
            @click="
              type = 0;
              init();
            "
          >
            <p></p>
            总数量
          </span>
          <span
            :class="{ active: type === 1 }"
            @click="
              type = 1;
              init();
            "
          >
            <p></p>
            总金额
          </span>
          <span
            :class="{ active: type === 2 }"
            @click="
              type = 2;
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
import clickOutSide from "@mahdikhashan/vue3-click-outside";

export default {
  name: "PhysicalAssetStatistics",

  components: {
    Box,
  },
  directives: {
    clickOutSide,
  },

  data() {
    return {
      type: 0,
      chart: null,
      isShow2: false,
      currentType2: {
        label: "时间",
        value: 0,
      },
      options2: [
        {
          label: "时间",
          value: 0,
        },
        {
          label: "机构",
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

  beforeUnmount() {
    echarts.dispose(document.getElementById("physical_asset_statistics"));
  },

  methods: {
    onClickOutside2() {
      this.isShow2 = false;
    },

    onOptionsClick2(data) {
      this.currentType2 = data;
      this.isShow2 = false;
      this.init();
    },

    async init() {
      const self = this
      const depart = JSON.parse(localStorage.getItem("currentDepart") || {});
      const { data } = await fetchRealAssetsCount({
        departCode: depart.departCode,
        dimension: this.type,
        normType: 0,
        groupType: this.currentType2.value,
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

      /**
       * echarts点击事件
       * 声明入口
       */
      this.chart.on("click", (params) => {
        if (self.type === 0) {
          localStorage.setItem("physicalType", self.currentType2.value);
          localStorage.setItem("assetsType", params.name);
          self.onItemClick("实物资产统计", false);
        }
      });
    },

    /**
     * 点击打开表格弹窗
     * value 表明入口
     */
    onItemClick(value, isAll = true) {
      if (isAll) {
        localStorage.removeItem("实物资产统计");
      }
      localStorage.setItem("assetsTableType", value);
      bus.emit("onAssetsModalShow", true);
    },
  },
};
</script>

<style scoped lang="scss">
.physical_asset_statistics_root {
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
      margin: 2px 0 0 0;
    }

    span {
      width: 70px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #bdd7e7;
      margin-left: 10px;
      text-align: right;
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
        width: 100px;
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
