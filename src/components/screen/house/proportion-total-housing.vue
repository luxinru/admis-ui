<template>
  <div class="housing_info_root">
    <Box title="房屋总量占比">
      <template v-slot:more>
        <div
          class="select"
          v-click-out-side="onClickOutside"
          @click="isShow = !isShow"
        >
          <span> {{ currentType === 0 ? "行政区域" : "所属单位" }} </span>
          <img src="@/assets/images/screen/more-1.png" alt="" />

          <div class="content" v-if="isShow">
            <span
              class="content_item"
              :class="{
                content_item_active: currentType === item.value,
              }"
              v-for="(item, index) in options"
              :key="index"
              @click="onOptionsClick(item)"
            >
              {{ item.label }}
            </span>
          </div>
        </div>
      </template>

      <div class="container">
        <div class="chart_box">
          <img src="@/assets/images/screen/icon-bj3.png" alt="" />
          <div id="chart7" class="chart7"></div>
        </div>

        <div class="labels">
          <div
            class="item"
            v-for="(item, index) in list"
            :key="index"
            @click="onItemClick('房屋分类占比')"
          >
            <img src="@/assets/images/screen/mark.png" alt="" />
            <span :title="item.name"> {{ item.name }} </span>
            <p>
              <CountTo :start="0" :end="Number(item.value)" :decimals="0" />
            </p>
          </div>
        </div>
      </div>
    </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "./box.vue";
import * as echarts from "echarts";
import "echarts-gl";
import clickOutSide from "@mahdikhashan/vue3-click-outside";
import { fetchVisualAmount } from "@/api/screen/house";

/**
 * 房屋总量占比
 */
export default {
  name: "ProportionTotalHousing",

  components: {
    Box,
  },

  directives: {
    clickOutSide,
  },

  data() {
    return {
      list: [],
      currentDepart: {},
      colorList: [
        "#4167ef",
        "#47cbff",
        "#35f3db",
        "#80faa1",
        "#ff8a6a",
        "#fffe73",
        "#ff7c7c",
        "#a06af0",
        "#4167ef",
        "#47cbff",
        "#35f3db",
        "#80faa1",
        "#ff8a6a",
        "#fffe73",
        "#ff7c7c",
        "#a06af0",
        "#4167ef",
        "#47cbff",
        "#35f3db",
        "#80faa1",
        "#ff8a6a",
        "#fffe73",
        "#ff7c7c",
        "#a06af0",
        "#4167ef",
        "#47cbff",
        "#35f3db",
        "#80faa1",
        "#ff8a6a",
        "#fffe73",
        "#ff7c7c",
        "#a06af0",
      ],
      isShow: false,
      currentType: 0,
      options: [
        {
          label: "行政区域",
          value: 0,
        },
        {
          label: "所属单位",
          value: 1,
        },
      ],
    };
  },

  mounted() {
    const self = this;
    /**
     * 切换单位时更新数据
     */
    bus.on("onDepartChange", (depart) => {
      self.currentDepart = depart;
      self.fetchVisualAmountFun();
    });

    const depart = localStorage.getItem("currentDepart")
      ? JSON.parse(localStorage.getItem("currentDepart"))
      : "";

    if (depart) {
      self.currentDepart = depart;
      self.fetchVisualAmountFun();
    }
  },

  beforeUnmount() {
    echarts.dispose(document.getElementById("chart7"));
  },

  methods: {
    onClickOutside() {
      this.isShow = false;
    },

    onOptionsClick(data) {
      this.currentType = data.value;
      this.isShow = false;
      this.fetchVisualAmountFun();
    },

    /**
     * 点击打开表格弹窗
     * value 表明入口
     */
    onItemClick(value) {
      if (this.currentType === 0) {
        localStorage.setItem("city", value);
      } else {
        localStorage.setItem("departName", value);
      }
      localStorage.setItem("tableType", value);
      bus.emit("onModalShow");
    },

    initChart(data) {
      const self = this;
      echarts.dispose(document.getElementById("chart7"));
      const myChart = echarts.init(document.getElementById("chart7"));

      const optionsData = data.map((item, index) => {
        return {
          name: item.name,
          value: Number(item.value),
          itemStyle: {
            color: self.colorList[index],
          },
        };
      });

      const option = this.getPie3D(optionsData, 0.59);

      myChart.setOption(option);

      let hoveredIndex = "";

      //  修正取消高亮失败的 bug
      // 监听 mouseover，近似实现高亮（放大）效果
      myChart.on("mouseover", function (params) {
        // 准备重新渲染扇形所需的参数
        let isSelected;
        let isHovered;
        let startRatio;
        let endRatio;
        let k;
        let i;

        // 如果触发 mouseover 的扇形当前已高亮，则不做操作
        if (hoveredIndex === params.seriesIndex) {
          return;

          // 否则进行高亮及必要的取消高亮操作
        } else {
          // 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
          if (hoveredIndex !== "") {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
            isSelected = option.series[hoveredIndex].pieStatus.selected;
            isHovered = false;
            startRatio = option.series[hoveredIndex].pieData.startRatio;
            endRatio = option.series[hoveredIndex].pieData.endRatio;
            k = option.series[hoveredIndex].pieStatus.k;
            i =
              option.series[hoveredIndex].pieData.value ===
              option.series[0].pieData.value
                ? 35
                : 10;
            // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
            option.series[hoveredIndex].parametricEquation =
              self.getParametricEquation(
                startRatio,
                endRatio,
                isSelected,
                isHovered,
                k,
                i
              );
            option.series[hoveredIndex].pieStatus.hovered = isHovered;

            // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
            hoveredIndex = "";
          }

          // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
          if (params.seriesName !== "mouseoutSeries") {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
            isSelected = option.series[params.seriesIndex].pieStatus.selected;
            isHovered = true;
            startRatio = option.series[params.seriesIndex].pieData.startRatio;
            endRatio = option.series[params.seriesIndex].pieData.endRatio;
            k = option.series[params.seriesIndex].pieStatus.k;

            // 对当前点击的扇形，执行高亮操作（对 option 更新）
            option.series[params.seriesIndex].parametricEquation =
              self.getParametricEquation(
                startRatio,
                endRatio,
                isSelected,
                isHovered,
                k,
                option.series[params.seriesIndex].pieData.value + 5
              );
            option.series[params.seriesIndex].pieStatus.hovered = isHovered;

            // 记录上次高亮的扇形对应的系列号 seriesIndex
            hoveredIndex = params.seriesIndex;
          }

          // 使用更新后的 option，渲染图表
          myChart.setOption(option);
        }
      });

      // 修正取消高亮失败的 bug
      myChart.on("globalout", function () {
        let isSelected;
        let isHovered;
        let startRatio;
        let endRatio;
        let k;
        let i;

        if (hoveredIndex !== "") {
          // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
          isSelected = option.series[hoveredIndex].pieStatus.selected;
          isHovered = false;
          k = option.series[hoveredIndex].pieStatus.k;
          startRatio = option.series[hoveredIndex].pieData.startRatio;
          endRatio = option.series[hoveredIndex].pieData.endRatio;
          // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
          i =
            option.series[hoveredIndex].pieData.value ===
            option.series[0].pieData.value
              ? 35
              : 10;
          option.series[hoveredIndex].parametricEquation =
            self.getParametricEquation(
              startRatio,
              endRatio,
              isSelected,
              isHovered,
              k,
              i
            );
          option.series[hoveredIndex].pieStatus.hovered = isHovered;

          // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
          hoveredIndex = "";
        }

        // 使用更新后的 option，渲染图表
        myChart.setOption(option);
      });

      myChart.on("click", (params) => {
        localStorage.setItem('tableOptionType', this.currentType)
        localStorage.setItem('tableValue', params.seriesName)
        this.onItemClick("房屋分类占比");
      });
    },

    async fetchVisualAmountFun() {
      const { data } = await fetchVisualAmount({
        departCode: this.currentDepart.departCode,
        groupType: this.currentType,
      });

      this.list = data;
      // this.initChart(data);
      this.$nextTick(() => {
        this.initChart(data);
      });
    },

    // 生成扇形的曲面参数方程
    getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
      // 计算
      const midRatio = (startRatio + endRatio) / 2;

      const startRadian = startRatio * Math.PI * 2;
      const endRadian = endRatio * Math.PI * 2;
      const midRadian = midRatio * Math.PI * 2;

      // 如果只有一个扇形，则不实现选中效果。
      if (startRatio === 0 && endRatio === 1) {
        // eslint-disable-next-line no-param-reassign
        isSelected = false;
      }

      // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
      // eslint-disable-next-line no-param-reassign
      k = typeof k !== "undefined" ? k : 1 / 3;

      // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
      const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
      const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;

      // 计算高亮效果的放大比例（未高亮，则比例为 1）
      const hoverRate = isHovered ? 1.1 : 1;

      // 返回曲面参数方程
      return {
        u: {
          min: -Math.PI,
          max: Math.PI * 3,
          step: Math.PI / 32,
        },

        v: {
          min: 0,
          max: Math.PI * 2,
          step: Math.PI / 20,
        },

        x(u, v) {
          if (u < startRadian) {
            return (
              offsetX +
              Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
            );
          }
          if (u > endRadian) {
            return (
              offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
            );
          }
          return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
        },

        y(u, v) {
          if (u < startRadian) {
            return (
              offsetY +
              Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
            );
          }
          if (u > endRadian) {
            return (
              offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
            );
          }
          return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
        },

        z(u, v) {
          if (u < -Math.PI * 0.5) {
            return Math.sin(u);
          }
          if (u > Math.PI * 2.5) {
            return Math.sin(u) * h * 0.1;
          }
          // 当前图形的高度是Z根据h（每个value的值决定的）
          return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
        },
      };
    },

    // 生成模拟 3D 饼图的配置项
    getPie3D(pieData, internalDiameterRatio) {
      const series = [];
      // 总和
      let sumValue = 0;
      let startValue = 0;
      let endValue = 0;
      const legendData = [];
      const k = 1;

      // 为每一个饼图数据，生成一个 series-surface 配置
      for (let i = 0; i < pieData.length; i += 1) {
        sumValue += pieData[i].value;

        const seriesItem = {
          name:
            typeof pieData[i].name === "undefined"
              ? `series${i}`
              : pieData[i].name,
          type: "surface",
          parametric: true,
          wireframe: {
            show: false,
          },
          pieData: pieData[i],
          pieStatus: {
            selected: false,
            hovered: false,
            k,
          },
        };

        if (typeof pieData[i].itemStyle !== "undefined") {
          const { itemStyle } = pieData[i];

          // eslint-disable-next-line no-unused-expressions
          typeof pieData[i].itemStyle.color !== "undefined"
            ? (itemStyle.color = pieData[i].itemStyle.color)
            : null;
          // eslint-disable-next-line no-unused-expressions
          typeof pieData[i].itemStyle.opacity !== "undefined"
            ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
            : null;

          seriesItem.itemStyle = itemStyle;
        }
        series.push(seriesItem);
      }
      // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
      // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
      for (let i = 0; i < series.length; i += 1) {
        endValue = startValue + series[i].pieData.value;

        series[i].pieData.startRatio = startValue / sumValue;
        series[i].pieData.endRatio = endValue / sumValue;
        series[i].parametricEquation = this.getParametricEquation(
          series[i].pieData.startRatio,
          series[i].pieData.endRatio,
          false,
          false,
          k,
          // 我这里做了一个处理，使除了第一个之外的值都是10
          series[i].pieData.value === series[0].pieData.value ? 35 : 10
        );

        startValue = endValue;

        legendData.push(series[i].name);
      }

      // 准备待返回的配置项，把准备好的 legendData、series 传入。
      const option = {
        // animation: false,
        tooltip: {
          show: true,
          appendToBody: true,
          formatter: (params) => {
            if (params.seriesName !== "mouseoutSeries") {
              return `${
                params.seriesName
              }<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                params.color
              };"></span>${option.series[params.seriesIndex].pieData.value}`;
            }
          },
        },
        xAxis3D: {
          min: -2,
          max: 2,
        },
        yAxis3D: {
          min: -2,
          max: 2,
        },
        zAxis3D: {
          min: -2,
          max: "dataMax",
        },
        grid3D: {
          show: false,
          boxHeight: 30,
          viewControl: {
            // 3d效果可以放大、旋转等，请自己去查看官方配置
            alpha: 35,
            // beta: 30,
            rotateSensitivity: 1,
            zoomSensitivity: 0,
            panSensitivity: 0,
            autoRotate: true,
            distance: 150,
          },
          // 后处理特效可以为画面添加高光、景深、环境光遮蔽（SSAO）、调色等效果。可以让整个画面更富有质感。
          postEffect: {
            // 配置这项会出现锯齿，请自己去查看官方配置有办法解决
            enable: false,
            bloom: {
              enable: true,
              bloomIntensity: 0.1,
            },
            SSAO: {
              enable: true,
              quality: "medium",
              radius: 2,
            },
            // temporalSuperSampling: {
            //   enable: true,
            // },
          },
        },
        series,
      };
      return option;
    },
  },
};
</script>

<style scoped lang="scss">
.housing_info_root {
  width: 100%;
  flex: 1 0;
  overflow: hidden;

  .select {
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
      margin: 2px 0 0 3px;
    }

    span {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #bdd7e7;
      margin-left: 10px;
    }

    .content {
      position: absolute;
      height: 84px;
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
        width: 163px;
        font-size: 15px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
        border-bottom: 1px solid rgba(55, 130, 255, 0.2);
        padding: 10px 10px;
        box-sizing: border-box;
        margin-left: 0;

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
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .chart_box {
      position: relative;
      width: 166px;
      height: 122px;
      margin-left: 10%;

      .chart7 {
        position: absolute;
        width: 150%;
        height: 150%;
        top: -45px;
        left: -40px;
      }

      img {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
      }
    }

    .labels {
      flex: 1 0;
      height: 80%;
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-left: 10px;
      overflow-y: auto;
      margin-right: 10px;

      .item {
        width: 100%;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        margin-top: 5px;
        cursor: pointer;
        overflow: hidden;

        &:first-child {
          margin-top: 0;
        }

        img {
          width: 17px;
          margin-right: 5px;
        }

        span {
          flex: 1 0;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        p {
          width: 70px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(145, 204, 255, 1);
          font-size: 16px;
          margin: 0 0 0 10px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
