<template>
  <div class="assets_map_root">
    <img src="@/assets/images/screen/base-1.png" alt="" />

    <div id="mapChart" class="chart"></div>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import * as echarts from "echarts";
import sichuanJson from "@/assets/json/四川省.json";
import chengduJson from "@/assets/json/成都市.json";
import { fetchDepartList } from "@/api/screen/assets/index";

export default {
  name: "AssetsMap",

  components: {},

  data() {
    return {
      chart: null,
      options: {},
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
    async init() {
      // const depart = JSON.parse(localStorage.getItem("currentDepart") || {});
      // const { data } = await fetchDepartList({
      //   departCode: depart.departCode,
      //   departName: '成都市',
      //   levelSearch: 0
      // });

      // console.log('AssetsMap :>> ', data);

      if (this.chart) {
        this.chart.dispose(document.getElementById("mapChart"));
      }

      echarts.registerMap("四川省", sichuanJson);
      echarts.registerMap("成都市", chengduJson);

      this.chart = echarts.init(document.getElementById("mapChart"));

      this.options = {
        backgroundColor: "transparent",
        tooltip: {
          // 指示器
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          top: "5",
          right: "20",
          itemWidth: 20,
          itemHeight: 20,
          data: [
            {
              name: "标记点1",
            },
            {
              name: "标记点2",
            },
            {
              name: "标记点3",
            },
          ],
          textStyle: {
            color: "#fff",
            fontSize: 15,
          },
        },
        geo: {
          map: "四川省",
          // zoom: 0.4, // 设置地图显示大小比例
          zoom: 0.55, // 设置地图显示大小比例
          label: {
            normal: {
              show: true, //显示区域名称
              fontSize: "14",
              color: "#fff",
            },
            emphasis: {
              //对应的鼠标悬浮效果
              show: true,
              textStyle: {
                color: "gold",
              },
            },
          },
          roam: true, //设置为false,不启动roam就无所谓缩放拖曳同步了
          layoutCenter: ["50%", "40%"],
          layoutSize: "100%",
          itemStyle: {
            normal: {
              color: "#0362bd", //地图块颜色
              borderColor: "#1ad0f9", //鼠标覆盖地图块颜色
            },
            emphasis: {
              color: "#0070ff",
              areaColor: "rgb(0,112,255)",
            },
          },
        },
        //配置属性
        series: [
          {
            name: "四川省",
            type: "map",
            geoIndex: 0,
            data: [],
            itemStyle: {
              normal: {
                // show: true,
                // color: "#BE14E4", //点颜色
                label: {
                  show: true,
                  textStyle: {
                    fontWeight: "bold", //字体
                    fontSize: 18, //字体大小
                    color: "#fff",
                  },
                },
              },
            },
          },
          // {
          //   name: "标记点1",
          //   type: "effectScatter",
          //   coordinateSystem: "geo",
          //   showEffectOn: "render", //涟漪
          //   zlevel: 2,
          //   rippleEffect: {
          //     //period: 2.5, //波纹秒数
          //     brushType: "stroke", //stroke(涟漪)和fill(扩散)，两种效果
          //     scale: 3, //波纹范围
          //   },
          //   hoverAnimation: true,
          //   label: {
          //     normal: {
          //       formatter: "{b}",
          //       position: "top",
          //       show: false, //不显示
          //       textStyle: {
          //         // 地图上散点的字体样式
          //         fontSize: 15,
          //         fontWeight: "bold",
          //         color: "blue",
          //       },
          //     },
          //   },
          //   itemStyle: {
          //     normal: {
          //       show: true,
          //       color: "#E4E214", //字体和点颜色
          //       label: {
          //         textStyle: {
          //           fontWeight: "bold", //字体
          //           fontSize: 18, //字体大小
          //           color: "#E4E214",
          //         },
          //       },
          //     },
          //   },
          //   data: [
          //     {
          //       name: "类型1-标记点1",
          //       value: [102.359817, 26.721043, 280],
          //       product: "200",
          //       scale: "21",
          //       symbolSize: 10,
          //     },
          //     {
          //       name: "类型1-标记点2",
          //       value: [104.062156, 30.651066, 200],
          //       product: "260",
          //       scale: "33",
          //       symbolSize: 15,
          //     },
          //     {
          //       name: "类型1-标记点3",
          //       value: [100.062156, 30.651066, 200],
          //       product: "280",
          //       scale: "55",
          //       symbolSize: 50 / 2,
          //     },
          //   ],
          // },
          // {
          //   name: "标记点2",
          //   type: "effectScatter",
          //   coordinateSystem: "geo",
          //   showEffectOn: "render",
          //   zlevel: 2,
          //   rippleEffect: {
          //     //period: 2.5, //波纹秒数
          //     brushType: "stroke", //stroke(涟漪)和fill(扩散)，两种效果
          //     scale: 3, //波纹范围
          //   },
          //   hoverAnimation: true,
          //   label: {
          //     normal: {
          //       formatter: "{b}",
          //       position: "top",
          //       show: false, //不显示
          //       textStyle: {
          //         // 地图上散点的字体样式
          //         fontSize: 15,
          //         fontWeight: "bold",
          //         color: "#BE14E4", // 点上字的颜色
          //       },
          //     },
          //   },
          //   itemStyle: {
          //     normal: {
          //       show: true,
          //       color: "#ff7e7e", //点颜色
          //       label: {
          //         textStyle: {
          //           fontWeight: "bold", //字体
          //           fontSize: 18, //字体大小
          //           color: "#BE14E4",
          //         },
          //       },
          //     },
          //   },
          //   data: [
          //     {
          //       name: "类型2-标记点1",
          //       value: [102.062156, 32.651066, 200],
          //       product: "200",
          //       scale: "21",
          //       symbolSize: 10,
          //     },
          //     {
          //       name: "类型2-标记点2",
          //       value: [103.062156, 28.651066, 200],
          //       product: "260",
          //       scale: "32",
          //       symbolSize: 15,
          //     },
          //     {
          //       name: "类型2-标记点2",
          //       value: [103.062156, 30.651066, 200],
          //       product: "280",
          //       scale: "51",
          //       symbolSize: 25,
          //     },
          //   ],
          // },
          // {
          //   name: "标记点3",
          //   type: "effectScatter",
          //   coordinateSystem: "geo",
          //   showEffectOn: "render",
          //   zlevel: 2,
          //   rippleEffect: {
          //     //period: 2.5, //波纹秒数
          //     brushType: "stroke", //stroke(涟漪)和fill(扩散)，两种效果
          //     scale: 3, //波纹范围
          //   },
          //   hoverAnimation: true,
          //   label: {
          //     normal: {
          //       formatter: "{b}",
          //       position: "top",
          //       show: false, //不显示
          //       textStyle: {
          //         // 地图上散点的字体样式
          //         fontSize: 15,
          //         fontWeight: "bold",
          //         color: "#BE14E4", // 点上字的颜色
          //       },
          //     },
          //   },
          //   itemStyle: {
          //     normal: {
          //       show: true,
          //       color: "#02f2b3", //点颜色
          //       label: {
          //         textStyle: {
          //           fontWeight: "bold", //字体
          //           fontSize: 18, //字体大小
          //           color: "#BE14E4",
          //         },
          //       },
          //     },
          //   },
          //   data: [
          //     {
          //       name: "类型3-标记点1",
          //       value: [104.062156, 32.651066, 200],
          //       product: "200",
          //       scale: "21",
          //       symbolSize: 10,
          //     },
          //     {
          //       name: "类型3-标记点2",
          //       value: [105.062156, 28.651066, 200],
          //       product: "260",
          //       scale: "32",
          //       symbolSize: 15,
          //     },
          //     {
          //       name: "类型3-标记点2",
          //       value: [105.062156, 30.651066, 200],
          //       product: "280",
          //       scale: "51",
          //       symbolSize: 25,
          //     },
          //   ],
          // },
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
