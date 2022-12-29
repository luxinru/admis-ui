<template>
  <div class="rental_growth_rate_root">
    <Box title="租金增长率">
      <div class="container">
        <div class="title">
          <div class="part">
            <img src="@/assets/images/screen/more-1.png" alt="" />
            <span class="label"> 年同比 </span>
            <p><CountTo :start="0" :end="year" />%</p>
          </div>
        </div>

        <div id="chart1" class="chart1"></div>
      </div>
    </Box>
  </div>
</template>

<script setup name="RentalGrowthRate">
import bus from "vue3-eventbus";
import Box from "./box.vue";
import * as echarts from "echarts";
import { fetchRentalGrowth } from "@/api/screen/house";

const year = ref(0);
const currentDepart = ref({});

function onItemClick(value, isAll = true) {
  if (isAll) {
    localStorage.removeItem("租金增长率");
  }
  localStorage.setItem("tableType", value);
  bus.emit("onModalShow");
}

function initChart(data) {
  echarts.dispose(document.getElementById("chart1"));
  const myChart = echarts.init(document.getElementById("chart1"));

  const { basicData, xAreaData, yearData, yearOnYear } = data;

  year.value = Number(yearOnYear) || 0;

  myChart.setOption({
    legend: {
      show: true,
      right: 0,
      top: '2%',
      icon: "circle",
      itemWidth: 6,
      textStyle: {
        color: "#fff",
        fontSize: 12,
      },
    },
    tooltip: {
      show: true,
      trigger: "axis",
      valueFormatter: (value) => Number(value).toFixed(2) + "%",
    },
    grid: {
      top: "22%",
      left: "3%",
      right: "3%",
      bottom: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xAreaData,
      axisLine: {
        lineStyle: {
          color: "rgba(87, 107, 139, 0.66)",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "rgba(196, 225, 255, 1)",
        interval: 0,
        rotate: 35
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "rgba(87, 107, 139, 0.66)",
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "rgba(87, 107, 139, 0.66)",
        },
      },
      axisLabel: {
        color: "rgba(255, 255, 255, 0.6)",
      },
      max: (value) => {
        return Number((value.max + value.max * 0.3).toFixed(0));
      },
    },
    series: [
      {
        name: "同比增长",
        type: "line",
        data: basicData.map(item => Number(item)),
        symbol: "none",
        smooth: true,
        lineStyle: {
          color: "rgba(125, 237, 155, 1)",
        },
      },

      // {
      //   name: "同比增长",
      //   type: "line",
      //   data: basicData.map(item => {
      //     return Number(item) - Number(item) * 0.2
      //   }),
      //   symbol: "none",
      //   smooth: true,
      //   lineStyle: {
      //     color: "RGBA(9, 29, 54, 1)",
      //   },
      // },

      {
        name: "环比增长",
        type: "line",
        data: yearData.map(item => Number(item)),
        symbol: "none",
        smooth: true,
        lineStyle: {
          color: "rgba(75, 185, 244, 1)",
        },
      },

      // {
      //   name: "环比增长",
      //   type: "line",
      //   data: yearData.map(item => {
      //     return Number(item) - Number(item) * 0.2
      //   }),
      //   symbol: "none",
      //   smooth: true,
      //   lineStyle: {
      //     color: "RGBA(9, 29, 54, 1)",
      //   },
      // },
    ],
  });

  myChart.getZr().on("click", (params) => {
    let pointInPixel = [params.offsetX, params.offsetY];
    if (myChart.containPixel("grid", pointInPixel)) {
      //点击第几个柱子
      let pointInGrid = myChart.convertFromPixel(
        { seriesIndex: 0 },
        pointInPixel
      );
      // 也可以通过params.offsetY 来判断鼠标点击的位置是否是图表展示区里面的位置
      // 也可以通过name[xIndex] != undefined，name是x轴的坐标名称来判断是否还是点击的图表里面的内容
      // x轴数据的索引
      let xIndex = pointInGrid[0];

      localStorage.setItem("租金增长率", xAreaData[xIndex]);
      onItemClick("租金增长率", false);
    }
  });
}

async function fetchRentalGrowthFun() {
  const { data } = await fetchRentalGrowth({
    departCode: currentDepart.value.departCode,
    groupType: 0,
  });

  initChart(data);
}

onMounted(() => {
  bus.on("onDepartChange", (depart) => {
    currentDepart.value = depart;
    fetchRentalGrowthFun();
  });

  const depart = localStorage.getItem("currentDepart")
    ? JSON.parse(localStorage.getItem("currentDepart"))
    : "";

  if (depart) {
    currentDepart.value = depart;
    fetchRentalGrowthFun();
  }
});

onBeforeUnmount(() => {
  echarts.dispose(document.getElementById("chart1"));
});
</script>

<style scoped lang="scss">
.rental_growth_rate_root {
  width: 100%;
  flex: 1 0;
  margin-top: 5px;
  overflow: hidden;

  .container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 16px;
    box-sizing: border-box;

    .title {
      width: 100%;
      height: max-content;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .part {
        display: flex;
        align-items: center;

        img {
          height: 24px;
          margin-left: 13px;
          transform: rotate(-90deg);
        }

        .label {
          margin-left: 2px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
        }

        p {
          margin: 0 0 0 10px;
          font-size: 18px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(75, 185, 244, 1);
          padding-top: 3px;
          font-weight: bold;
        }

        .item {
          display: flex;
          align-items: center;
          margin-left: 21px;

          .dot {
            width: 6px;
            height: 6px;
            background: #7ded9b;
            border-radius: 50%;
          }

          div {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #ffffff;
            margin-left: 8px;
          }

          &:last-child {
            .dot {
              width: 6px;
              height: 6px;
              background: #4bb9f4;
              border-radius: 50%;
            }
          }
        }
      }
    }

    .chart1 {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
}
</style>
