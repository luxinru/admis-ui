<template>
  <div class="assets_map_root">
    <img src="@/assets/images/screen/base-1.png" alt="" />

    <div id="mapChart" class="chart"></div>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import * as echarts from "echarts";
import provinceJson from "@/assets/json/province.json";
import chengduJson from "@/assets/json/成都市.json";

export default {
  name: "AssetsMap",

  components: {},

  data() {
    return {
      chart: null,
      options: {}
    };
  },

  mounted() {
    this.init();
  },

  beforeUnmount() {
    if (this.chart) {
      this.chart.dispose(document.getElementById("mapChart"));
    }
  },

  methods: {
    init() {
      if (this.chart) {
        this.chart.dispose(document.getElementById("mapChart"));
      }

      echarts.registerMap("my", provinceJson);
      echarts.registerMap("成都市", chengduJson);

      this.chart = echarts.init(document.getElementById("mapChart"));

      this.options = {
        grid: {
          left: "0", // 与容器左侧的距离
          right: "0", // 与容器右侧的距离
          top: "0", // 与容器顶部的距离
          bottom: "0", // 与容器底部的距离
        },
        geo: {
          map: "my",
          aspectScale: 0.85,
          layoutCenter: ["50%", "40%"], //地图位置
          layoutSize: "70%",

          itemStyle: {
            normal: {
              shadowColor: "#276fce",
              shadowOffsetX: 0,
              shadowOffsetY: 15,
              opacity: 0.3,
            },
          },
        },
        series: [
          {
            type: "map",
            mapType: "my",
            aspectScale: 0.85,
            layoutCenter: ["50%", "40%"], //地图位置
            layoutSize: "70%",
            zoom: 1, //当前视角的缩放比例
            // roam: true, //是否开启平游或缩放
            scaleLimit: {
              //滚轮缩放的极限控制
              min: 1,
              max: 1,
            },
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: "#fff",
                },
              },
              emphasis: {
                textStyle: {
                  color: "#fff",
                },
              },
            },
            itemStyle: {
              normal: {
                areaColor: "#0c274b",
                borderColor: "RGBA(52, 140, 250, 1)",
                borderWidth: 2,
                shadowColor: "#092f8f", //外发光
                shadowBlur: 20,
              },
              emphasis: {
                areaColor: {
                  type: "radial",
                  x: 0.5,
                  y: 0.5,
                  r: 0.9,
                  colorStops: [
                    {
                      offset: 0,
                      color: "RGBA(40, 99, 113, 1)", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "RGBA(28, 79, 105, 0.6)", // 100% 处的颜色
                    },
                  ],
                },
                label: {
                  color: "#fff",
                },
              },
            },
          },
        ],
      };

      this.chart.on("click", (params) => {
        console.log("params :>> ", params);
        if (params.componentSubType == "map") {
          this.goDown(params.name);
        }
      });
      this.chart.setOption(this.options);
    },

    async goDown(name) {
      //获取地图数据之后，修改地图options
      // if (!echarts.getMap(name)) {
      //   const newMapJson = await getMapJson(name);
      //   echarts.registerMap(mapname, newMapJson);
      // }
      this.options.geo.map = name;
      this.options.series[0].map = name;
      this.chart.setOption(this.options);
    },
  },
};
</script>

<style scoped lang="scss">
.assets_map_root {
  width: 100%;
  height: 100%;
  background: url("@/assets/images/screen/bj.jpg") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .chart {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  img {
    position: absolute;
    width: 1461px;
    height: 301px;
    margin-top: 15%;
  }
}
</style>
