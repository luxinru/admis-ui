<template>
  <div class="physical_asset_statistics_root">
    <Box title="实物资产统计">
      <div class="container">
        <div class="legend">
          <span :class="{ active: type === 1 }" @click="type = 1">
            <p></p>
            总数量
          </span>
          <span :class="{ active: type === 2 }" @click="type = 2">
            <p></p>
            总金额
          </span>
          <span :class="{ active: type === 3 }" @click="type = 3">
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
  },

  beforeUnmount() {
    echarts.dispose(document.getElementById("physical_asset_statistics"));
  },

  methods: {
    async init() {
      this.chart = echarts.init(
        document.getElementById("physical_asset_statistics")
      );

      let xaxisData = [
        "川中油气矿",
        "重庆气矿",
        "蜀南气矿",
        "川西北气矿",
        "蜀南气矿",
      ];
      let yaxisData = [90, 80, 100, 70, 65];

      const offsetX = 6;
      const offsetY = 5;
      // 绘制左侧面
      const CubeLeft = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          // 会canvas的应该都能看得懂，shape是从custom传入的
          const xAxisPoint = shape.xAxisPoint;
          const c0 = [shape.x, shape.y];
          const c1 = [shape.x - offsetX, shape.y - offsetY];
          const c2 = [xAxisPoint[0] - offsetX, xAxisPoint[1] - offsetY];
          const c3 = [xAxisPoint[0], xAxisPoint[1]];
          ctx
            .moveTo(c0[0], c0[1])
            .lineTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .closePath();
        },
      });

      // 绘制右侧面
      const CubeRight = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          const xAxisPoint = shape.xAxisPoint;
          const c1 = [shape.x, shape.y];
          const c2 = [xAxisPoint[0], xAxisPoint[1]];
          const c3 = [xAxisPoint[0] + offsetX, xAxisPoint[1] - offsetY];
          const c4 = [shape.x + offsetX, shape.y - offsetY];
          ctx
            .moveTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .lineTo(c4[0], c4[1])
            .closePath();
        },
      });

      // 绘制顶面
      const CubeTop = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          const c1 = [shape.x, shape.y];
          const c2 = [shape.x + offsetX, shape.y - offsetY]; //右点
          const c3 = [shape.x, shape.y - offsetX];
          const c4 = [shape.x - offsetX, shape.y - offsetY];
          ctx
            .moveTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .lineTo(c4[0], c4[1])
            .closePath();
        },
      });

      // 注册三个面图形
      echarts.graphic.registerShape("CubeLeft", CubeLeft);
      echarts.graphic.registerShape("CubeRight", CubeRight);
      echarts.graphic.registerShape("CubeTop", CubeTop);

      const option = {
        tooltip: {
          trigger: "item",
        },
        grid: {
          left: "2%",
          right: "2%",
          top: "10%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: xaxisData,
          minInterval: 1,
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "rgba(87, 107, 139, 0.66)",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            fontSize: 12,
            color: "rgba(196, 225, 255, 1)",
          },
        },
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
            type: "custom",
            renderItem: (params, api) => {
              const location = api.coord([api.value(0), api.value(1)]);
              return {
                type: "group",
                children: [
                  {
                    type: "CubeLeft",
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "rgba(57, 206, 255, 1)",
                        },
                        {
                          offset: 0.9,
                          color: "rgba(57, 206, 255, 0)",
                        },
                      ]),
                    },
                  },
                  {
                    type: "CubeRight",
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "rgba(57, 206, 255, 1)",
                        },
                        {
                          offset: 0.9,
                          color: "rgba(57, 206, 255, 0)",
                        },
                      ]),
                    },
                  },
                  {
                    type: "CubeTop",
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: "rgba(57, 206, 255, 1)",
                    },
                  },
                ],
              };
            },
            data: yaxisData,
          },
          {
            type: "bar",
            itemStyle: {
              color: "transparent",
            },
            data: yaxisData,
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
