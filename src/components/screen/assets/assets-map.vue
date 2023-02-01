<template>
  <div class="assets_map_root">
    <img class="img1" src="@/assets/images/screen/circle11.png" alt="" />
    <img class="img2" src="@/assets/images/screen/circle.png" alt="" />

    <div class="tips">
      <img src="@/assets/images/screen/light-spot.png" alt="" />
      <img src="@/assets/images/screen/light-spot.png" alt="" />
      <img src="@/assets/images/screen/light-spot.png" alt="" />
      <img src="@/assets/images/screen/light-spot.png" alt="" />
    </div>

    <div id="mapChart" class="chart"></div>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import * as echarts from "echarts";
import sichuanJson from "@/assets/json/四川省.json";
import chongqingJson from "@/assets/json/重庆市.json";

/**
 * 四川省
 */
import chengduJson from "@/assets/json/成都市.json";
import abazangzuqiangzuJson from "@/assets/json/阿坝藏族羌族自治州.json";
import bazhongJson from "@/assets/json/巴中市.json";
import dazhouJson from "@/assets/json/达州市.json";
import deyangJson from "@/assets/json/德阳市.json";
import ganzizangzuJson from "@/assets/json/甘孜藏族自治州.json";
import guanganJson from "@/assets/json/广安市.json";
import guangyuanJson from "@/assets/json/广元市.json";
import leshanJson from "@/assets/json/乐山市.json";
import lianshanyizuJson from "@/assets/json/凉山彝族自治州.json";
import luzhouJson from "@/assets/json/泸州市.json";
import meishanJson from "@/assets/json/眉山市.json";
import mianyangJson from "@/assets/json/绵阳市.json";
import nanchongJson from "@/assets/json/南充市.json";
import neijiangJson from "@/assets/json/内江市.json";
import panzhihuaJson from "@/assets/json/攀枝花市.json";
import suiningJson from "@/assets/json/遂宁市.json";
import yaanJson from "@/assets/json/雅安市.json";
import yibinJson from "@/assets/json/宜宾市.json";
import ziyangJson from "@/assets/json/资阳市.json";
import zigongJson from "@/assets/json/自贡市.json";

import { fetchDepartList } from "@/api/screen/assets/index";

export default {
  name: "AssetsMap",

  components: {},

  data() {
    return {
      chart: null,
      options: {},
      map: "四川省",
    };
  },

  mounted() {
    this.init();

    bus.on("onDepartChange", (depart) => {
      this.init();
    });

    bus.on("onMapChange", (map) => {
      this.map = map;
      this.init();
    });

    bus.on("onSearchInputBlur", (str) => {
      this.init(str);
    });
  },

  beforeUnmount() {
    if (this.chart) {
      this.chart.dispose(document.getElementById("mapChart"));
    }
    bus.off("onDepartChange");
    bus.off("onMapChange");
    bus.off("onSearchInputBlur");
  },

  methods: {
    async init(str = "") {
      const depart = JSON.parse(localStorage.getItem("currentDepart") || {});
      const { rows } = await fetchDepartList({
        departCode: depart.departCode,
        // departName: "成都市",
        levelSearch: 0,
      });

      let data = rows.filter((item) => item.longitude && item.latitude);

      data = data.filter((item) => item.departName.indexOf(str) > -1);

      if (this.chart) {
        this.chart.dispose(document.getElementById("mapChart"));
      }

      if (!echarts.getMap(this.map)) {
        switch (this.map) {
          case "四川省":
            echarts.registerMap(this.map, sichuanJson);
            break;
          case "重庆市":
            echarts.registerMap(this.map, chongqingJson);
            break;
          default:
            break;
        }
      }

      this.chart = echarts.init(document.getElementById("mapChart"));

      this.options = {
        backgroundColor: "transparent",
        tooltip: {
          // 指示器
          show: true,
        },
        legend: {
          shwo: false,
        },
        geo: {
          map: this.map,
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
          layoutCenter: ["50%", "50%"],
          layoutSize: "160%",
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
          selectedMode: "single",
          select: {
            itemStyle: {
              areaColor: "#0362bd",
              color: "#fff",
            },
          },
        },
        //配置属性
        series: [
          {
            name: this.map,
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
            selectedMode: "single",
            select: {
              itemStyle: {
                areaColor: "#0362bd",
                color: "#fff",
              },
            },
          },
          {
            name: "",
            type: "effectScatter",
            coordinateSystem: "geo",
            showEffectOn: "render", //涟漪
            zlevel: 2,
            rippleEffect: {
              //period: 2.5, //波纹秒数
              brushType: "stroke", //stroke(涟漪)和fill(扩散)，两种效果
              scale: 3, //波纹范围
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: "{b}",
                position: "top",
                show: false, //不显示
                textStyle: {
                  // 地图上散点的字体样式
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "blue",
                },
              },
            },
            itemStyle: {
              show: true,
              color: "#02f2b3", //字体和点颜色
              label: {
                show: true,
                textStyle: {
                  fontWeight: "bold", //字体
                  fontSize: 18, //字体大小
                  color: "#fff",
                },
              },
            },
            selectedMode: "single",
            select: {
              itemStyle: {
                color: "#E4E214",
              },
            },
            data: data.map((item) => {
              return {
                name: item.departName,
                value: [Number(item.longitude), Number(item.latitude)],
                symbolSize: 50 / Number(item.departLevel),
                select: {
                  disabled: item.departLevel === "4",
                },
                tooltip: {
                  formatter: "{b}",
                },
                ...item,
              };
            }),
          },
        ],
      };

      this.chart.setOption(this.options);

      this.chart.on("click", (params) => {
        if (params.componentSubType == "map") {
          this.goDown(params.name);
        }

        if (params.componentSubType === "effectScatter") {
          if (params.data.departLevel === "4") return;
          this.$modal
            .confirm("是否更改统计单位？")
            .then(() => {
              bus.emit("updateDepart", params.data);
            })
            .catch(() => {
              this.init();
            });
        }
      });
    },

    async goDown(name) {
      // 获取地图数据之后，修改地图options
      let isChange = false;
      if (!echarts.getMap(name)) {
        switch (name) {
          case "阿坝藏族羌族自治州":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, abazangzuqiangzuJson);
            break;
          case "巴中市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, bazhongJson);
            break;
          case "成都市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, chengduJson);
            break;
          case "达州市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, dazhouJson);
            break;
          case "德阳市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, deyangJson);
            break;
          case "甘孜藏族自治州":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, ganzizangzuJson);
            break;
          case "广安市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, guanganJson);
            break;
          case "广元市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, guangyuanJson);
            break;
          case "乐山市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, leshanJson);
            break;
          case "凉山彝族自治州":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, lianshanyizuJson);
            break;
          case "泸州市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, luzhouJson);
            break;
          case "眉山市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, meishanJson);
            break;
          case "绵阳市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, mianyangJson);
            break;
          case "南充市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, nanchongJson);
            break;
          case "内江市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, neijiangJson);
            break;
          case "攀枝花市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, panzhihuaJson);
            break;
          case "遂宁市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, suiningJson);
            break;
          case "雅安市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, yaanJson);
            break;
          case "宜宾市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, yibinJson);
            break;
          case "资阳市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, ziyangJson);
            break;
          case "自贡市":
            this.map = name;
            isChange = true;
            echarts.registerMap(this.map, zigongJson);
            break;
          default:
            break;
        }
      } else {
        isChange = true;
      }

      if (echarts.getMap(name) && isChange) {
        bus.emit("onMapDown");
        this.options.geo.map = name;
        this.options.series[0].map = name;
        this.chart.setOption(this.options, true);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.assets_map_root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;

  .chart {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .img1 {
    position: absolute;
    top: 27%;
    width: 80%;
    transform: rotateX(78deg)
  }

  .img2 {
    position: absolute;
    top: 27%;
    width: 80%;
    animation: move 20s infinite linear;
  }

  @keyframes move {
    from {
      transform: rotateX(78deg) rotate(0deg);
    }

    to {
      transform: rotateX(78deg) rotate(360deg);
    }
  }

  .tips {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 0 14.5%;
    box-sizing: border-box;

    img {
      height: 68px;
      &:nth-child(1) {
        margin-bottom: 13.5%;
        animation: opacitykf1 2s infinite linear;
      }
      &:nth-child(4) {
        margin-bottom: 13.5%;
        animation: opacitykf2 2s infinite linear;
      }

      &:nth-child(2) {
        margin-bottom: 5%;
        animation: opacitykf2 2s infinite linear;
      }
      &:nth-child(3) {
        margin-bottom: 5%;
        animation: opacitykf1 2s infinite linear;
      }
    }

    @keyframes opacitykf1 {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.3;
      }
      100% {
        opacity: 1;
      }
    }

    @keyframes opacitykf2 {
      0% {
        opacity: 0.3;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0.3;
      }
    }
  }
}
</style>
