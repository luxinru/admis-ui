<template>
  <div class="block_statistics_root">
    <Box title="区块统计">
      <div class="container">
        <div id="container" class="chart"></div>
      </div>
    </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";
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

  data() {
    return {
      chart: null,
      img: img,
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      if (this.chart) {
        this.chart.destroy();
      }

      const arr = [
        {
          label: "区块一",
          value: 8,
        },
        {
          label: "区块二",
          value: 3,
        },
        {
          label: "区块三",
          value: 1,
        },
        {
          label: "区块四",
          value: 6,
        },
        {
          label: "区块五",
          value: 1,
        },
        {
          label: "区块六",
          value: 6,
        },
      ];
      const self = this;
      // 初始化 Highcharts 图表
      this.chart = Highcharts.chart("container", {
        chart: {
          type: "pie",
          backgroundColor: null,
          plotBackgroundImage: self.img,
          options3d: {
            enabled: true,
            alpha: 65,
          },
        },
        title: {
          text: null,
        },
        legend: {
          itemStyle: {
            color: "#fff",
          },
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
            size: "110%",
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

  .container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

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
