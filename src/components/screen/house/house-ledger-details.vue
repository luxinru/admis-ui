<template>
  <div class="house_ledger_details_root">
    <img
      class="title_img"
      src="@/assets/images/screen/window-upper.png"
      alt=""
    />

    <div class="container">
      <span class="title">
        {{
          [
            "原值",
            "净值",
            "折旧",
            "房屋总量",
            "房屋分类占比",
            "房屋取得情况",
          ].indexOf(type) > -1
            ? "房屋台账明细信息查询"
            : "房屋出租明细查询"
        }}
        <img
          class="close"
          src="@/assets/images/screen/close.png"
          alt=""
          @click="onModalClose"
        />
      </span>

      <div class="table">
        <div class="charts">
          <div class="item">
            <div class="item_title">
              <img src="@/assets/images/screen/more-1.png" alt="" />
              <span> {{ chart1Title }} </span>
            </div>

            <div class="chart_box">
              <div class="bac"></div>
              <div id="chart4" class="chart4"></div>
            </div>

            <div class="info">
              <div
                class="info_item"
                v-for="(item, index) in chart1Data"
                :key="index"
              >
                <img src="@/assets/images/screen/mark.png" alt="" />
                <span>
                  {{
                    ["出租总收入", "租金增长率", "租金收入占比"].indexOf(type) >
                    -1
                      ? item.rentDepartName
                      : item.usedNatureName
                  }}
                </span>
                <p
                  v-if="
                    [
                      '原值',
                      '净值',
                      '折旧',
                      '房屋总量',
                      '房屋分类占比',
                      '房屋取得情况',
                    ].indexOf(type) > -1
                  "
                >
                  {{ item.countValue }}
                </p>
                <p v-if="['房屋面积'].indexOf(type) > -1">
                  {{ item.landArea }}
                </p>
                <p
                  v-if="
                    ['出租总收入', '租金增长率', '租金收入占比'].indexOf(type) >
                    -1
                  "
                >
                  {{ item.rentMoney }}
                </p>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="item_title">
              <img src="@/assets/images/screen/more-1.png" alt="" />
              <span> {{ chart2Title }} </span>
            </div>

            <div class="chart_box">
              <div class="bac"></div>
              <div id="chart5" class="chart4"></div>
            </div>

            <div class="info">
              <div
                class="info_item"
                v-for="(item, index) in chart2Data"
                :key="index"
              >
                <img src="@/assets/images/screen/mark.png" alt="" />
                <span>
                  {{
                    ["出租总收入", "租金增长率", "租金收入占比"].indexOf(type) >
                    -1
                      ? item.rentDepartName
                      : item.usedNatureName
                  }}
                </span>
                <p
                  v-if="
                    [
                      '原值',
                      '房屋总量',
                      '房屋面积',
                      '房屋分类占比',
                      '房屋取得情况',
                    ].indexOf(type) > -1
                  "
                >
                  {{ item.originalValue }}
                </p>
                <p v-if="['净值'].indexOf(type) > -1">
                  {{ item.nowValue }}
                </p>
                <p v-if="['折旧'].indexOf(type) > -1">
                  {{ item.addDepreciate }}
                </p>
                <p
                  v-if="
                    ['出租总收入', '租金增长率', '租金收入占比'].indexOf(type) >
                    -1
                  "
                >
                  {{ item.rentMoney }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="list">
          <table
            v-if="
              ['出租总收入', '租金收入占比', '租金增长率'].indexOf(type) > -1
            "
          >
            <thead>
              <tr>
                <th>资产编码</th>
                <th>资产类型</th>
                <th>
                  资产名称
                  <div class="sort">
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                  </div>
                </th>
                <th>
                  资产类别编码
                  <div class="sort">
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                  </div>
                </th>
                <th>
                  租赁期实际开始日期
                  <div class="sort">
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                  </div>
                </th>
                <th>
                  预计租赁终止日
                  <div class="sort">
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                  </div>
                </th>
                <th>承租方单位类型</th>
                <th>承租方单位</th>
                <th>租赁金额</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in list" :key="index">
                <td :title="item.assetsCode || '-'">
                  {{ item.assetsCode || "-" }}
                </td>
                <td :title="item.assetsType || '-'">
                  {{ item.assetsType || "-" }}
                </td>
                <td :title="item.assetsName || '-'">
                  {{ item.assetsName || "-" }}
                </td>
                <td :title="item.contentAssetsCode || '-'">
                  {{ item.contentAssetsCode || "-" }}
                </td>
                <td :title="item.rentStartDate || '-'">
                  {{ item.rentStartDate || "-" }}
                </td>
                <td :title="item.rentEndDate || '-'">
                  {{ item.rentEndDate || "-" }}
                </td>
                <td :title="item.rentDepartTypeName || '-'">
                  {{ item.rentDepartTypeName || "-" }}
                </td>
                <td :title="item.rentDepartName || '-'">
                  {{ item.rentDepartName || "-" }}
                </td>
                <td :title="item.rentMoney || '-'">
                  {{ item.rentMoney || "-" }}
                </td>
              </tr>
            </tbody>
          </table>

          <table v-else>
            <thead>
              <tr>
                <th>资产编码</th>
                <th>资产类型</th>
                <th>
                  资产名称
                  <div class="sort">
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                  </div>
                </th>
                <th>
                  资产类别编码

                  <div class="sort">
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                  </div>
                </th>
                <th>
                  规格型号

                  <div class="sort">
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                  </div>
                </th>
                <th>
                  所属单位

                  <div class="sort">
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                  </div>
                </th>
                <th>宗地编码</th>
                <th>权属情况</th>
                <th>
                  使用权类型

                  <div class="sort">
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                    <img src="@/assets/images/screen/triangular.png" alt="" />
                  </div>
                </th>
                <th v-if="type === '原值'">原值</th>
                <th v-if="type === '净值'">净值</th>
                <th v-if="type === '折旧'">折旧</th>
                <th v-if="type === '房屋面积'">土地面积</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in list" :key="index">
                <td :title="item.assetsCode || '-'">
                  {{ item.assetsCode || "-" }}
                </td>
                <td :title="item.assetsType || '-'">
                  {{ item.assetsType || "-" }}
                </td>
                <td :title="item.assetsName || '-'">
                  {{ item.assetsName || "-" }}
                </td>
                <td :title="item.contentAssetsCode || '-'">
                  {{ item.contentAssetsCode || "-" }}
                </td>
                <td :title="item.assetsStandard || '-'">
                  {{ item.assetsStandard || "-" }}
                </td>
                <td :title="item.departName || '-'">
                  {{ item.departName || "-" }}
                </td>
                <td :title="item.parcelCode || '-'">
                  {{ item.parcelCode || "-" }}
                </td>
                <td :title="item.ownershipConditionName || '-'">
                  {{ item.ownershipConditionName || "-" }}
                </td>
                <td :title="item.usedrightTypeName || '-'">
                  {{ item.usedrightTypeName || "-" }}
                </td>
                <td v-if="type === '原值'" :title="item.originalValue || '-'">
                  {{ item.originalValue || "-" }}
                </td>
                <td v-if="type === '净值'" :title="item.nowValue || '-'">
                  {{ item.nowValue || "-" }}
                </td>
                <td v-if="type === '折旧'" :title="item.addDepreciate || '-'">
                  {{ item.addDepreciate || "-" }}
                </td>
                <td v-if="type === '房屋面积'" :title="item.landArea || '-'">
                  {{ item.landArea || "-" }}
                </td>
              </tr>
            </tbody>
          </table>

          <div class="paging">
            <el-pagination
              layout="prev, pager, next"
              :total="total"
              :page-size="20"
              :current-page="page.pageNum"
              @current-change="onCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import bus from "vue3-eventbus";

import {
  fetchVisualList,
  fetchVisualRentHouse,
  fetchVisualAmountNature,
  fetchVisualValueNature,
  fetchVisualValueRentDepart,
} from "@/api/screen/house";

export default {
  name: "HouseLedgerDetails",

  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 20,
      },
      total: 0,
      list: [],
      type: "原值",
      currentDepart: {},
      currentHouse: {},
      chart1Data: [],
      chart2Data: [],
    };
  },

  computed: {
    chart1Title() {
      switch (this.type) {
        case "原值":
        case "净值":
        case "折旧":
        case "房屋总量":
        case "房屋面积":
        case "房屋分类占比":
        case "房屋取得情况":
          return "使用性质分类占比";
        case "出租总收入":
        case "租金增长率":
        case "租金收入占比":
          return "承租单位性质分类占比";
        default:
          break;
      }
    },

    chart2Title() {
      switch (this.type) {
        case "原值":
        case "房屋总量":
        case "房屋面积":
        case "房屋分类占比":
        case "房屋取得情况":
          return "使用性质分类原值占比";
        case "净值":
          return "使用性质分类净值占比";
        case "折旧":
          return "使用性质分类折旧占比";
        case "出租总收入":
        case "租金增长率":
        case "租金收入占比":
          return "承租单位性质分类租金额占比";

        default:
          break;
      }
    },
  },

  async mounted() {
    this.type = localStorage.getItem("tableType");
    this.currentDepart = JSON.parse(localStorage.getItem("currentDepart"));
    this.currentHouse = localStorage.getItem("currentHouse")
      ? JSON.parse(localStorage.getItem("currentHouse"))
      : undefined;

    if (
      [
        "原值",
        "净值",
        "折旧",
        "房屋总量",
        "房屋面积",
        "房屋分类占比",
        "房屋取得情况",
      ].indexOf(this.type) > -1
    ) {
      this.fetchVisualHouseAccountFun();
      await this.fetchVisualAmountNatureFun();
      await this.fetchVisualValueNatureFun();

      this.initChart();
    } else {
      this.fetchVisualRentHouseFun();
      await this.fetchVisualValueRentDepartFun();

      this.initChart();
    }
  },

  beforeUnmount() {
    echarts.dispose(document.getElementById("chart4"));
    echarts.dispose(document.getElementById("chart5"));
  },

  methods: {
    onCurrentChange(value) {
      this.page.pageNum = value;
      if (
        [
          "原值",
          "净值",
          "折旧",
          "房屋总量",
          "房屋面积",
          "房屋分类占比",
          "房屋取得情况",
        ].indexOf(this.type) > -1
      ) {
        this.fetchVisualHouseAccountFun();
      } else {
        this.fetchVisualRentHouseFun();
      }
    },

    async fetchVisualAmountNatureFun() {
      const options = {
        departCode: this.currentDepart.departCode,
      };

      if (this.type === "房屋分类占比") {
        options.departName = this.currentDepart.departName;
      }

      const { data } = await fetchVisualAmountNature(options);

      this.chart1Data = data || [];
    },

    async fetchVisualValueNatureFun() {
      const options = {
        departCode: this.currentDepart.departCode,
      };

      if (this.type === "房屋分类占比") {
        options.departName = this.currentDepart.departName;
      }

      const { data } = await fetchVisualValueNature(options);

      this.chart2Data = data || [];
    },

    async fetchVisualValueRentDepartFun() {
      const options = {
        departCode: this.currentDepart.departCode,
      };

      if (this.type === "出租总收入" && localStorage.getItem("出租总收入")) {
        options.statisticalDate = localStorage.getItem("出租总收入");
      }

      if (
        (this.type === "租金增长率" || this.type === "租金收入占比") &&
        localStorage.getItem("租金增长率")
      ) {
        options.city = localStorage.getItem("租金增长率");
      }

      const { data } = await fetchVisualValueRentDepart(options);

      this.chart1Data = data || [];
      this.chart2Data = data || [];
    },

    initChart() {
      echarts.dispose(document.getElementById("chart4"));
      echarts.dispose(document.getElementById("chart5"));
      const myChart1 = echarts.init(document.getElementById("chart4"));
      const myChart2 = echarts.init(document.getElementById("chart5"));

      const gradList = [
        new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: "#03c",
          },
          {
            offset: 1,
            color: "#18f",
          },
        ]),

        new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: "#46f",
          },
          {
            offset: 1,
            color: "#4cd",
          },
        ]),

        new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: "#3a7",
          },
          {
            offset: 1,
            color: "#4db",
          },
        ]),

        new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: "#03c",
          },
          {
            offset: 1,
            color: "#9db",
          },
        ]),

        new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: "#06b",
          },
          {
            offset: 1,
            color: "#4bf",
          },
        ]),

        new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: "#06b",
          },
          {
            offset: 1,
            color: "#0bb",
          },
        ]),

        new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: "#8ec",
          },
          {
            offset: 1,
            color: "#dea",
          },
        ]),
      ];

      let data1 = [];
      switch (this.type) {
        case "原值":
        case "净值":
        case "折旧":
        case "房屋总量":
        case "房屋分类占比":
        case "房屋取得情况":
          data1 = this.chart1Data.map((item) => {
            return {
              name: item.usedNatureName,
              value: Number(item.countValue),
            };
          });
          break;
        case "房屋面积":
          data1 = this.chart1Data.map((item) => {
            return {
              name: item.usedNatureName,
              value: Number(item.landArea),
            };
          });
          break;
        case "出租总收入":
        case "租金增长率":
        case "租金收入占比":
          data1 = this.chart1Data.map((item) => {
            return {
              name: item.rentDepartName,
              value: Number(item.rentMoney),
            };
          });
          break;

        default:
          break;
      }

      const options1 = {
        series: [
          {
            name: "数据统计",
            type: "pie",
            center: ["50%", "50%"],
            radius: ["20%", "75%"],
            roseType: true,
            itemStyle: {
              normal: {
                color: function (params) {
                  return gradList[params.dataIndex];
                },
              },
            },
            label: {
              show: false,
            },
            data: data1,
          },
        ],
      };

      let data2 = [];

      switch (this.type) {
        case "原值":
        case "房屋总量":
        case "房屋面积":
        case "房屋分类占比":
        case "房屋取得情况":
          data2 = this.chart2Data.map((item) => {
            return {
              name: item.usedNatureName,
              value: Number(item.originalValue),
            };
          });
          break;
        case "净值":
          data2 = this.chart2Data.map((item) => {
            return {
              name: item.usedNatureName,
              value: Number(item.nowValue),
            };
          });
          break;
        case "折旧":
          data2 = this.chart2Data.map((item) => {
            return {
              name: item.usedNatureName,
              value: Number(item.addDepreciate),
            };
          });
          break;
        case "出租总收入":
        case "租金增长率":
        case "租金收入占比":
          data2 = this.chart2Data.map((item) => {
            return {
              name: item.rentDepartName,
              value: Number(item.rentMoney),
            };
          });
          break;

        default:
          break;
      }

      const options2 = {
        series: [
          {
            name: "数据统计",
            type: "pie",
            center: ["50%", "50%"],
            radius: ["20%", "75%"],
            roseType: true,
            itemStyle: {
              normal: {
                color: function (params) {
                  return gradList[params.dataIndex];
                },
              },
            },
            label: {
              show: false,
            },
            data: data2,
          },
        ],
      };

      myChart1.setOption(options1);
      myChart2.setOption(options2);
    },

    onModalClose() {
      bus.emit("onModalClose");
    },

    async fetchVisualHouseAccountFun() {
      const { rows, total } = await fetchVisualList({
        houseName: "",
        houseCode: this.currentHouse ? this.currentHouse.id : "",
        departCode: this.currentDepart.departCode,
        assetsCode: "",
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
      });

      this.list = rows || [];
      this.total = total;
    },

    async fetchVisualRentHouseFun() {
      const { rows, total } = await fetchVisualRentHouse({
        houseName: "",
        houseCode: this.currentHouse ? this.currentHouse.id : "",
        departCode: this.currentDepart.departCode,
        assetsCode: "",
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
      });

      this.list = rows || [];
      this.total = total;
    },
  },
};
</script>

<style lang="scss">
.house_ledger_details_root {
  .el-pagination {
    button {
      background-color: rgba(51, 133, 238, 0.3);
      border: 1px solid rgba(51, 133, 238, 0.5);
    }

    li {
      background-color: rgba(51, 133, 238, 0.3);
      border: 1px solid rgba(51, 133, 238, 0.5);
      color: rgba(57, 158, 233, 1);
      margin-right: 5px;
    }

    .is-active {
      background-color: rgba(51, 133, 238, 0.5);
      border: 1px solid rgba(51, 133, 238, 0.8);
      color: rgba(255, 255, 255, 1);
    }

    .el-icon {
      color: rgba(57, 158, 233, 1);
    }

    .btn-prev {
      margin-right: 5px;
    }
  }
}
</style>

<style scoped lang="scss">
* {
  flex-shrink: 0;
}
.house_ledger_details_root {
  width: 1700px;
  height: 804px;
  display: flex;
  flex-direction: column;

  .title_img {
    width: 100%;
    height: 48px;
  }

  .container {
    width: 100%;
    flex: 1 0;
    margin-top: 8px;
    border: 1px solid;
    border-image: linear-gradient(
        0deg,
        rgba(7, 70, 142, 0.93),
        rgba(57, 125, 202, 0.93),
        rgba(189, 225, 255, 0.93),
        rgba(57, 125, 202, 0.93),
        rgba(7, 70, 142, 0.93)
      )
      1 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: url("../../../assets/images/screen/window-under.png") no-repeat;
    background-size: 100% 100%;
    overflow: hidden;

    .title {
      position: relative;
      width: 100%;
      height: 81px;
      font-size: 30px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0px 1px 1px rgba(0, 11, 10, 0.43);
      display: flex;
      align-items: center;
      justify-content: center;

      .close {
        position: absolute;
        top: 0;
        right: 0;
        width: 34px;
        height: 34px;
        cursor: pointer;
      }
    }

    .table {
      width: 100%;
      flex: 1 0;
      overflow: hidden;
      display: flex;
      padding: 0 17px;
      box-sizing: border-box;
      overflow: hidden;

      .charts {
        width: 500px;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 0 8px 63px;
        box-sizing: border-box;

        .item {
          width: 100%;
          flex: 1 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 16px;

          &:first-child {
            margin-top: 0;
          }

          .item_title {
            width: 100%;
            display: flex;
            align-items: center;

            img {
              height: 24px;
              transform: rotate(-90deg);
              margin-right: 9px;
            }

            span {
              font-size: 20px;
              font-family: YouSheBiaoTiHei;
              font-weight: 400;
              color: #ffffff;
            }
          }

          .chart_box {
            position: relative;
            width: 178px;
            height: 178px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 5px;
            box-sizing: border-box;
            margin: 10px 0;

            .bac {
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              border: 1px dashed rgba(0, 246, 255, 0.2);
            }

            .chart4 {
              position: absolute;
              width: 100%;
              height: 100%;
            }
          }

          .info {
            width: 100%;
            flex: 1 0;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 0 10px;

            .info_item {
              display: flex;
              align-items: center;

              img {
                width: 23px;
                margin-right: 6px;
              }

              span {
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #ffffff;
              }

              p {
                font-size: 18px;
                font-family: YouSheBiaoTiHei;
                font-weight: bold;
                color: rgba(0, 162, 255, 1);
                margin: 0 0 0 10px;
              }
            }
          }
        }
      }

      .list {
        flex: 1 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        table {
          width: 100%;
          flex: 1 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(57, 158, 233, 0.2);
          border-collapse: collapse;
          overflow-x: scroll;
          overflow-y: hidden;
          thead {
            width: calc(100% - 7px);
            height: 33px;

            tr {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;

              th {
                width: 200px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #91ccff;
                border: 1px solid rgba(57, 158, 233, 0.2);
                background-color: rgba(51, 133, 238, 0.3);

                .sort {
                  display: flex;
                  flex-direction: column;
                  margin-left: 5px;

                  img {
                    width: 8px;

                    &:last-child {
                      transform: rotate(180deg);
                    }
                  }
                }
              }
            }
          }

          tbody {
            width: max-content;
            flex: 1 0;
            overflow-y: scroll;
            overflow-x: hidden;

            tr {
              width: 100%;
              height: 40px;
              display: flex;
              align-items: center;

              &:nth-child(2n) {
                background-color: rgba(51, 133, 238, 0.1);
              }

              td {
                width: 200px;
                height: 100%;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #ffffff;
                border: 1px solid rgba(57, 158, 233, 0.2);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                padding: 0 10px;
                box-sizing: border-box;
                line-height: 40px;
                text-align: center;
              }
            }
          }
        }

        .paging {
          width: 100%;
          height: 63px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
