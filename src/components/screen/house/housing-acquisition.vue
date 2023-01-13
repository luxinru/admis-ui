<template>
  <div class="housing_acquisition_root">
    <Box title="房产证取得情况">
      <div class="container" @click="onItemClick('房屋取得情况')">
        <div id="chart6" class="chart6"></div>
      </div>
    </Box>
  </div>
</template>

<script setup name="HousingAcquisition">
import bus from "vue3-eventbus";
import Box from "./box.vue";
import { fetchVisualPaper } from "@/api/screen/house";

import * as echarts from "echarts";

const currentDepart = ref({});

function onItemClick(value) {
  localStorage.setItem("tableType", value);
  bus.emit("onModalShow");
}

function initChart(data) {
  echarts.dispose(document.getElementById("chart6"));
  const myChart = echarts.init(document.getElementById("chart6"));

  const { housePaperData, housePaperValue } = data;
  const results = housePaperData.map((item, index) => {
    return {
      name: item,
      value: housePaperValue[index],
    };
  });

  let dataPie2 = results;
  let dataColor2 = [
    {
      type: "linear",
      x: 0,
      x2: 0,
      y: 1,
      y2: 0,
      colorStops: [
        { offset: 0, color: "rgba(5, 75, 170, 1)" },
        { offset: 0.3, color: "rgba(10, 138, 222, 1)" },
        { offset: 0.6, color: "rgba(6, 91, 184, 1)" },
        { offset: 1, color: "rgba(11, 151, 232, 1)" },
      ],
    },
    {
      type: "linear",
      x: 0,
      x2: 0,
      y: 1,
      y2: 0,
      colorStops: [
        { offset: 0, color: "rgba(3, 120, 134, 1)" },
        { offset: 1, color: "rgba(0, 200, 188, 1)" },
      ],
    },
    {
      type: "linear",
      x: 0,
      x2: 0,
      y: 1,
      y2: 0,
      colorStops: [
        { offset: 0, color: "rgba(241, 108, 114, 1)" },
        { offset: 1, color: "rgba(169, 14, 69, 1)" },
      ],
    },
    {
      type: "linear",
      x: 0,
      x2: 0,
      y: 1,
      y2: 0,
      colorStops: [
        { offset: 0, color: "rgba(5, 75, 170, 1)" },
        { offset: 0.3, color: "rgba(10, 138, 222, 1)" },
        { offset: 0.6, color: "rgba(6, 91, 184, 1)" },
        { offset: 1, color: "rgba(11, 151, 232, 1)" },
      ],
    },
    {
      type: "linear",
      x: 0,
      x2: 0,
      y: 1,
      y2: 0,
      colorStops: [
        { offset: 0, color: "rgba(3, 120, 134, 1)" },
        { offset: 1, color: "rgba(0, 200, 188, 1)" },
      ],
    },
    {
      type: "linear",
      x: 0,
      x2: 0,
      y: 1,
      y2: 0,
      colorStops: [
        { offset: 0, color: "rgba(241, 108, 114, 1)" },
        { offset: 1, color: "rgba(169, 14, 69, 1)" },
      ],
    },
  ];
  let legendData = [],
    seriesData = [],
    radiusValue = 70, // 图形大小
    total = 0;
  let startAngle = [];

  total = dataPie2.reduce((a, c) => a + c.value, 0);

  dataPie2.reduce((a, c) => {
    startAngle.push((a / total) * 360);
    return a + c.value;
  }, 0);
  for (var i = 0; i < dataPie2.length; i++) {
    legendData.push(dataPie2[i].name);
    seriesData.push({
      type: "pie",
      clockWise: true, //饼图的扇区是否是顺时针排布
      radius: [radiusValue - 8 * i + "%", radiusValue - 4 - 8 * i + 15 + "%"],
      center: ["25%", "50%"],
      label: {
        normal: {
          show: false, //隐藏引导线标识
        },
      },
      hoverAnimation: false, //关闭 hover 在扇区上的放大动画效果
      startAngle: 180 + startAngle[i], //起始角度
      data: [
        {
          //透明伞形
          z: 1,
          value: total - dataPie2[i].value,
          tooltip: {
            show: false,
          },
          itemStyle: {
            //设置透明伞形
            color: "rgba(60, 79, 154, 0.2)", //伞形颜色
            // borderWidth: 10,
            // borderColor: 'rgba(60, 79, 154, 0.2)',
            label: {
              show: false,
            },
          },
        },
        {
          z: 2,
          value: dataPie2[i].value,
          name: dataPie2[i].name,

          itemStyle: {
            // borderWidth: 10,
            borderRadius: "50%",
            // borderColor: dataColor2[i],
            color: dataColor2[i],
          },
        },
      ],
    });
  }
  seriesData.push(
    {
      type: "pie",
      name: "内层细圆环",
      radius: ["20%", "21%"],
      center: ["25%", "50%"],
      hoverAnimation: false,
      clockWise: false,
      itemStyle: {
        //   opacity: 0.5,
        color: "rgba(160,160,160,0.5)",
      },
      label: {
        show: false,
      },
      data: [100],
    },
    {
      name: "大环",
      type: "gauge",
      splitNumber: 15,
      radius: "27%",
      center: ["25%", "50%"],
      startAngle: 90,
      endAngle: -269.9999,
      axisLine: {
        show: false,
        lineStyle: {
          opacity: 0.5,
          color: [[0, "rgba(160,160,160,0.5)"]],
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        length: 12,
        lineStyle: {
          color: "auto",
          width: 3.5,
        },
      },
      axisLabel: {
        show: false,
      },
      detail: {
        show: false,
      },
    }
    // {
    //   name: "小环",
    //   type: "gauge",
    //   splitNumber: 15,
    //   radius: "32%",
    //   center: ["25%", "50%"],
    //   startAngle: 90,
    //   endAngle: -269.9999,
    //   axisLine: {
    //     show: false,
    //   },
    //   axisTick: {
    //     show: true,
    //     lineStyle: {
    //       opacity: 0.5,
    //       color: "rgba(160,160,160,1)",
    //       width: 3,
    //     },
    //     length: 20,
    //     splitNumber: 5,
    //   },
    //   splitLine: {
    //     show: false,
    //   },
    //   axisLabel: {
    //     show: false,
    //   },
    //   detail: {
    //     show: false,
    //   },
    // }
  );

  myChart.setOption({
    tooltip: {
      show: false,
    },
    legend: {
      data: legendData,
      orient: "vertical",
      top: "center",
      right: 30,
      itemWidth: 8,
      itemHeight: 6,
      selectedMode: false,
      formatter: function (name) {
        let target, percent;
        for (let i = 0; i < dataPie2.length; i++) {
          if (dataPie2[i].name === name) {
            target = dataPie2[i].value;
            percent = ((target / total) * 100).toFixed(2);
          }
        }
        let arr = ["{blue|" + name + "}" + " " + " {white|" + percent + "%}"];
        return arr;
      },
      textStyle: {
        color: "#a5dbff",
        align: "right",
        rich: {
          white: {
            color: "#4bb9f4",
            align: "right",
            fontWeight: "bold",
            fontSize: 14,
          },
          blue: {
            color: "#fff",
            align: "left",
            fontSize: 12,
            width: 50,
          },
        },
      },
    },
    series: seriesData,
  });
}

async function fetchVisualPaperFun() {
  const { data } = await fetchVisualPaper({
    departCode: currentDepart.value.departCode,
  });

  initChart(data);
}

onMounted(() => {
  bus.on("onDepartChange", (depart) => {
    currentDepart.value = depart;
    fetchVisualPaperFun();
  });

  const depart = localStorage.getItem("currentDepart")
    ? JSON.parse(localStorage.getItem("currentDepart"))
    : "";

  if (depart) {
    currentDepart.value = depart;
    fetchVisualPaperFun();
  }
});

onBeforeUnmount(() => {
  echarts.dispose(document.getElementById("chart6"));
});
</script>

<style scoped lang="scss">
.housing_acquisition_root {
  width: 100%;
  flex: 1 0;
  margin-top: 5px;
  overflow: hidden;

  .container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .chart6 {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
