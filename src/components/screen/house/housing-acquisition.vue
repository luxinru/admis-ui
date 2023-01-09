<template>
  <div class="housing_acquisition_root">
    <Box title="房产证取得情况">
      <div class="container" @click="onItemClick('房屋取得情况')">
        <div id="chart6" class="chart6"></div>
        <div class="box"></div>
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

  myChart.setOption({
    title: {
      show: false,
    },
    // color: colorList,
    tooltip: {
      show: true,
      trigger: "item",
      padding: [8, 15],
      backgroundColor: "rgba(12, 51, 115,0.8)",
      borderColor: "rgba(3, 11, 44, 0.5)",
      textStyle: {
        color: "rgba(255, 255, 255, 1)",
      },
    },
    legend: {
      show: true,
      top: "middle",
      right: "12%",
      orient: "vertical",
      icon: "none",
      formatter: function (name) {
        const finded = results.find((item) => item.name === name);
        return `{b|${name}}：{c|${finded.value}%}`;
      },
      textStyle: {
        color: "#fff",

        rich: {
          b: {
            color: "#fff",
            fontSize: 12,
          },
          c: {
            color: "#4bb9f4",
            fontSize: 14,
          },
        },
      },

      // formatter: "{b|{b}：}{c|{d}%}",
    },
    grid: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 10,
    },
    series: [
      {
        startAngle: 90,
        name: "房屋取得情况",
        type: "pie",
        radius: ["50%", "60%"],
        center: ["35%", "50%"],
        data: results,

        itemStyle: {
          normal: {
            borderRadius: 80,
            borderCap: "round",
          },
        },
        label: {
          show: false,
        },
      },
    ],
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

    .box {
      position: absolute;
      left: 29%;
      width: 50px;
      height: 50px;
      border: 5px solid rgba(23, 154, 255, 0.1);
      border-radius: 50%;
    }
  }
}
</style>
