<template>
  <div class="house_ledger_details_root">
    <img
      class="title_img"
      src="@/assets/images/screen/window-upper.png"
      alt=""
    />

    <div class="container">
      <span class="title">
        {{ type }}
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
                <span
                  :title="
                    [
                      '资产总量统计',
                      '实物资产统计',
                      '本年业务统计',
                      '业务数据统计',
                      '油气产量统计',
                      '年折耗统计',
                    ].indexOf(type) > -1
                      ? item.groupName
                      : item.usedNatureName
                  "
                >
                  {{
                    [
                      "资产总量统计",
                      "实物资产统计",
                      "本年业务统计",
                      "业务数据统计",
                      "油气产量统计",
                      "年折耗统计",
                    ].indexOf(type) > -1
                      ? item.groupName
                      : item.usedNatureName
                  }}
                </span>
                <p
                  v-if="
                    [
                      '资产总量统计',
                      '实物资产统计',
                      '本年业务统计',
                      '业务数据统计',
                      '油气产量统计',
                      '年折耗统计',
                    ].indexOf(type) > -1
                  "
                  :title="item.groupCount"
                >
                  {{ item.groupCount }}
                </p>
              </div>
            </div>
          </div>
          <div
            class="item"
            v-if="
              (['实物资产统计'].indexOf(type) > -1 &&
                (physicalType === '0' || physicalType === '1')) ||
              ['资产总量统计'].indexOf(type) > -1
            "
          >
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
                <span
                  :title="
                    ['资产总量统计', '实物资产统计'].indexOf(type) > -1
                      ? item.groupName
                      : item.usedNatureName
                  "
                >
                  {{
                    ["资产总量统计", "实物资产统计"].indexOf(type) > -1
                      ? item.groupName
                      : item.usedNatureName
                  }}
                </span>
                <p
                  v-if="['资产总量统计', '实物资产统计'].indexOf(type) > -1"
                  :title="item.groupValue"
                >
                  {{ item.groupValue }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="list">
          <section class="table_container">
            <table v-if="['资产总量统计'].indexOf(type) > -1">
              <thead>
                <tr>
                  <th>资产编码</th>
                  <th>资产类别编码</th>
                  <th>资产名称</th>
                  <th>资产类型</th>
                  <th>增加日期</th>
                  <th>原值</th>
                  <th>净值</th>
                  <th>累计折旧</th>
                  <th>减值准备</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in list" :key="index">
                  <td :title="item.assetsCode || '-'">
                    {{ item.assetsCode || "-" }}
                  </td>
                  <td :title="item.contentAssetsCode || '-'">
                    {{ item.contentAssetsCode || "-" }}
                  </td>
                  <td :title="item.assetsName || '-'">
                    {{ item.assetsName || "-" }}
                  </td>
                  <td :title="item.assetsTypeName || '-'">
                    {{ item.assetsTypeName || "-" }}
                  </td>
                  <td :title="item.addVoucherDate || '-'">
                    {{ item.addVoucherDate || "-" }}
                  </td>
                  <td :title="item.originalValue || '-'">
                    {{ item.originalValue || "-" }}
                  </td>
                  <td :title="item.nowValue || '-'">
                    {{ item.nowValue || "-" }}
                  </td>
                  <td :title="item.addDepreciate || '-'">
                    {{ item.addDepreciate || "-" }}
                  </td>
                  <td :title="item.devalueValue || '-'">
                    {{ item.devalueValue || "-" }}
                  </td>
                </tr>
              </tbody>
            </table>

            <table v-if="['实物资产统计'].indexOf(type) > -1">
              <template v-if="physicalType === '0'">
                <thead>
                  <tr>
                    <th>资产编码</th>
                    <th>资产类别编码</th>
                    <th>资产名称</th>
                    <th>资产类型</th>
                    <th>增加日期</th>
                    <th>原值</th>
                    <th>净值</th>
                    <th>累计折旧</th>
                    <th>减值准备</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item, index) in list" :key="index">
                    <td :title="item.assetsCode || '-'">
                      {{ item.assetsCode || "-" }}
                    </td>
                    <td :title="item.contentAssetsCode || '-'">
                      {{ item.contentAssetsCode || "-" }}
                    </td>
                    <td :title="item.assetsName || '-'">
                      {{ item.assetsName || "-" }}
                    </td>
                    <td :title="item.assetsTypeName || '-'">
                      {{ item.assetsTypeName || "-" }}
                    </td>
                    <td :title="item.addVoucherDate || '-'">
                      {{ item.addVoucherDate || "-" }}
                    </td>
                    <td :title="item.originalValue || '-'">
                      {{ item.originalValue || "-" }}
                    </td>
                    <td :title="item.nowValue || '-'">
                      {{ item.nowValue || "-" }}
                    </td>
                    <td :title="item.addDepreciate || '-'">
                      {{ item.addDepreciate || "-" }}
                    </td>
                    <td :title="item.devalueValue || '-'">
                      {{ item.devalueValue || "-" }}
                    </td>
                  </tr>
                </tbody>
              </template>
              <template v-if="physicalType === '1'">
                <thead>
                  <tr>
                    <th>业务类型</th>
                    <th>资产编码</th>
                    <th>资产类别编码</th>
                    <th>资产名称</th>
                    <th>资产类型</th>
                    <th>租赁类型</th>
                    <th>租赁期实际开始日期</th>
                    <th>预计租赁终止日</th>
                    <th>租赁期(年)</th>
                    <th>租赁金额类别</th>
                    <th>承租方单位类型</th>
                    <th>承租方单位编码</th>
                    <th>承租方单位名称</th>
                    <th>租赁金额(不含税)</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item, index) in list" :key="index">
                    <td :title="item.businessType || '-'">
                      {{ item.businessType || "-" }}
                    </td>
                    <td :title="item.assetsCode || '-'">
                      {{ item.assetsCode || "-" }}
                    </td>
                    <td :title="item.contentAssetsCode || '-'">
                      {{ item.contentAssetsCode || "-" }}
                    </td>
                    <td :title="item.assetsName || '-'">
                      {{ item.assetsName || "-" }}
                    </td>
                    <td :title="item.assetsTypeName || '-'">
                      {{ item.assetsTypeName || "-" }}
                    </td>
                    <td :title="item.rentTypeName || '-'">
                      {{ item.rentTypeName || "-" }}
                    </td>
                    <td :title="item.rentStartDate || '-'">
                      {{ item.rentStartDate || "-" }}
                    </td>
                    <td :title="item.rentEndDate || '-'">
                      {{ item.rentEndDate || "-" }}
                    </td>
                    <td :title="item.rentPeriod || '-'">
                      {{ item.rentPeriod || "-" }}
                    </td>
                    <td :title="item.rentMoneyCategoryName || '-'">
                      {{ item.rentMoneyCategoryName || "-" }}
                    </td>
                    <td :title="item.rentDepartTypeName || '-'">
                      {{ item.rentDepartTypeName || "-" }}
                    </td>
                    <td :title="item.rentDepartCode || '-'">
                      {{ item.rentDepartCode || "-" }}
                    </td>
                    <td :title="item.rentDepartName || '-'">
                      {{ item.rentDepartName || "-" }}
                    </td>
                    <td :title="item.rentMoney || '-'">
                      {{ item.rentMoney || "-" }}
                    </td>
                  </tr>
                </tbody>
              </template>
              <template v-if="physicalType === '2'">
                <thead>
                  <tr>
                    <th>业务类型</th>
                    <th>所属单位</th>
                    <th>单据编号</th>
                    <th>资产编码</th>
                    <th>资产类别编码</th>
                    <th>资产名称</th>
                    <th>资产类型</th>
                    <th>业务状态</th>
                    <th>变动日期</th>
                    <th>原值</th>
                    <th>净值</th>
                    <th>累计折旧</th>
                    <th>减值准备</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item, index) in list" :key="index">
                    <td :title="item.businessType || '-'">
                      {{ item.businessType || "-" }}
                    </td>
                    <td :title="item.departCode || '-'">
                      {{ item.departCode || "-" }}
                    </td>
                    <td :title="item.invoiceNumber || '-'">
                      {{ item.invoiceNumber || "-" }}
                    </td>
                    <td :title="item.assetsCode || '-'">
                      {{ item.assetsCode || "-" }}
                    </td>
                    <td :title="item.contentAssetsCode || '-'">
                      {{ item.contentAssetsCode || "-" }}
                    </td>
                    <td :title="item.assetsName || '-'">
                      {{ item.assetsName || "-" }}
                    </td>
                    <td :title="item.assetsTypeName || '-'">
                      {{ item.assetsTypeName || "-" }}
                    </td>
                    <td :title="item.markStatus || '-'">
                      {{ item.markStatus || "-" }}
                    </td>
                    <td :title="item.varDate || '-'">
                      {{ item.varDate || "-" }}
                    </td>
                    <td :title="item.originalValue || '-'">
                      {{ item.originalValue || "-" }}
                    </td>
                    <td :title="item.nowValue || '-'">
                      {{ item.nowValue || "-" }}
                    </td>
                    <td :title="item.addDepreciate || '-'">
                      {{ item.addDepreciate || "-" }}
                    </td>
                    <td :title="item.devalueValue || '-'">
                      {{ item.devalueValue || "-" }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </table>

            <table v-else-if="['本年业务统计'].indexOf(type) > -1">
              <thead>
                <tr>
                  <th>业务类型</th>
                  <th>所属单位</th>
                  <th>单据编号</th>
                  <th>资产编码</th>
                  <th>资产类别编码</th>
                  <th>资产名称</th>
                  <th>资产类型</th>
                  <th>业务状态</th>
                  <th>变动日期</th>
                  <th>原值</th>
                  <th>净值</th>
                  <th>累计折旧</th>
                  <th>减值准备</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in list" :key="index">
                  <td :title="item.businessType || '-'">
                    {{ item.businessType || "-" }}
                  </td>
                  <td :title="item.departCode || '-'">
                    {{ item.departCode || "-" }}
                  </td>
                  <td :title="item.invoiceNumber || '-'">
                    {{ item.invoiceNumber || "-" }}
                  </td>
                  <td :title="item.assetsCode || '-'">
                    {{ item.assetsCode || "-" }}
                  </td>
                  <td :title="item.contentAssetsCode || '-'">
                    {{ item.contentAssetsCode || "-" }}
                  </td>
                  <td :title="item.assetsName || '-'">
                    {{ item.assetsName || "-" }}
                  </td>
                  <td :title="item.assetsTypeName || '-'">
                    {{ item.assetsTypeName || "-" }}
                  </td>
                  <td :title="item.markStatus || '-'">
                    {{ item.markStatus || "-" }}
                  </td>
                  <td :title="item.varDate || '-'">
                    {{ item.varDate || "-" }}
                  </td>
                  <td :title="item.originalValue || '-'">
                    {{ item.originalValue || "-" }}
                  </td>
                  <td :title="item.nowValue || '-'">
                    {{ item.nowValue || "-" }}
                  </td>
                  <td :title="item.addDepreciate || '-'">
                    {{ item.addDepreciate || "-" }}
                  </td>
                  <td :title="item.devalueValue || '-'">
                    {{ item.devalueValue || "-" }}
                  </td>
                </tr>
              </tbody>
            </table>

            <table v-else-if="['年折耗统计'].indexOf(type) > -1">
              <thead>
                <tr>
                  <th>业务类型</th>
                  <th>资产编码</th>
                  <th>资产类别编码</th>
                  <th>资产名称</th>
                  <th>资产类型</th>
                  <th>增加日期</th>
                  <th>折旧方法</th>
                  <th>折旧年限</th>
                  <th>尚可使用月份</th>
                  <th>折旧日期</th>
                  <th>月折旧额</th>
                  <th>月补提额</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in list" :key="index">
                  <td :title="item.businessType || '-'">
                    {{ item.businessType || "-" }}
                  </td>
                  <td :title="item.businessType || '-'">
                    {{ item.businessType || "-" }}
                  </td>
                  <td :title="item.contentAssetsCode || '-'">
                    {{ item.contentAssetsCode || "-" }}
                  </td>
                  <td :title="item.assetsName || '-'">
                    {{ item.assetsName || "-" }}
                  </td>
                  <td :title="item.assetsTypeName || '-'">
                    {{ item.assetsTypeName || "-" }}
                  </td>
                  <td :title="item.addVoucherDate || '-'">
                    {{ item.addVoucherDate || "-" }}
                  </td>
                  <td :title="item.depreciateCode || '-'">
                    {{ item.depreciateCode || "-" }}
                  </td>
                  <td :title="item.depreciateYear || '-'">
                    {{ item.depreciateYear || "-" }}
                  </td>
                  <td :title="item.usableYear || '-'">
                    {{ item.usableYear || "-" }}
                  </td>
                  <td :title="item.depreciateDate || '-'">
                    {{ item.depreciateDate || "-" }}
                  </td>
                  <td :title="item.monthDepreciate || '-'">
                    {{ item.monthDepreciate || "-" }}
                  </td>
                  <td :title="item.patchDepreciate || '-'">
                    {{ item.patchDepreciate || "-" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

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
import Moment from "moment";
import bus from "vue3-eventbus";

import {
  fetchVisualList,
  fetchVisualRentHouse,
  fetchVisualAmountNature,
  fetchVisualValueNature,
  fetchVisualValueRentDepart,
  fetchVisualAmountRentDepart,
} from "@/api/screen/house";

import {
  fetchAssetsList,
  fetchAssetsAmount,
  fetchAssetsValue,
  fetchBusinessList,
  fetchBusinessAmount,
  fetchProductionList,
  fetchProductionValue,
  fetchDepletionList,
  fetchDepletionValue,
  fetchRentList,
  fetchRentAmount,
  fetchRentValue,
} from "@/api/screen/assets";

/**
 * 表格弹窗组件
 */
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
      currentDepart: {}, // 当前单位
      currentHouse: {}, // 当前房屋
      chart1Data: [], // 左侧上边图表
      chart2Data: [], // 左侧下边图表
    };
  },

  computed: {
    /**
     * 根据不同入口展示不同标题
     */
    chart1Title() {
      switch (this.type) {
        case "资产总量统计":
          return "资产分类价值量占比";
        case "实物资产统计":
          if (this.physicalType === "0") {
            return "资产分类价值量占比";
          } else if (this.physicalType === "1") {
            return "出租承租单位性质数量占比";
          } else {
            return "业务数量占比";
          }
        case "本年业务统计":
        case "业务数据统计":
          return "业务数量占比";
        case "油气产量统计":
          return "油气产量分类占比";
        case "年折耗统计":
          return "折耗量分类占比";
        default:
          break;
      }
    },

    /**
     * 根据不同入口展示不同标题
     */
    chart2Title() {
      switch (this.type) {
        case "资产总量统计":
          return "资产分类价值量占比";
        case "实物资产统计":
          return "房屋出租承租单位性质价值量占比";
        case "净值":
          return "使用性质分类净值占比";
        case "折旧":
          return "使用性质分类折旧占比";

        default:
          break;
      }
    },

    normType() {
      return localStorage.getItem("normType") || 0;
    },

    type() {
      return localStorage.getItem("assetsTableType");
    },

    physicalType() {
      return localStorage.getItem("physicalType");
    },

    physicalOption() {
      return localStorage.getItem("physicalOption");
    },
  },

  async mounted() {
    this.currentDepart = JSON.parse(localStorage.getItem("currentDepart")); // 当前单位

    /**
     * 根据不同入口请求不同的接口
     */
    if (["资产总量统计"].indexOf(this.type) > -1) {
      this.fetchAssetsList();
      await this.fetchVisualAmountNatureFun();
      await this.fetchVisualValueNatureFun();

      this.initChart();
    } else if (["本年业务统计", "业务数据统计"].indexOf(this.type) > -1) {
      this.fetchBusinessList();
      await this.fetchBusinessAmount();
      // await this.fetchVisualAmountRentDepartFun();
      this.initChart();
    } else if (["实物资产统计"].indexOf(this.type) > -1) {
      if (this.physicalType === "0") {
        this.fetchAssetsList();
        await this.fetchVisualAmountNatureFun();
        await this.fetchVisualValueNatureFun();

        this.initChart();
      } else if (this.physicalType === "1") {
        this.fetchRentList();
        await this.fetchRentAmount();
        await this.fetchRentValue();

        this.initChart();
      } else {
        this.fetchBusinessList();
        await this.fetchBusinessAmount();
        // await this.fetchVisualAmountRentDepartFun();
        this.initChart();
      }
    } else if (["油气产量统计"].indexOf(this.type) > -1) {
      this.fetchProductionList();
      await this.fetchProductionValue();

      this.initChart();
    } else if (["年折耗统计"].indexOf(this.type) > -1) {
      this.fetchDepletionList();
      await this.fetchDepletionValue();

      this.initChart();
    }
  },

  beforeUnmount() {
    echarts.dispose(document.getElementById("chart4"));
    if (["实物资产统计"].indexOf(this.type) > -1 && this.physicalType === "0") {
      echarts.dispose(document.getElementById("chart5"));
    }
  },

  methods: {
    async fetchRentValue() {
      const options = {
        departCode: this.currentDepart.departCode,
        normType: this.normType,
      };

      if (this.physicalOption === "0") {
        options.statisticalDate = localStorage.getItem("assetsType");
      } else {
        options.statisticalDate = localStorage.getItem("departName");
      }

      const { data } = await fetchRentValue(options);

      this.chart2Data = data || [];
    },

    async fetchRentAmount() {
      const options = {
        departCode: this.currentDepart.departCode,
        normType: this.normType,
      };

      if (this.physicalOption === "0") {
        options.statisticalDate = localStorage.getItem("assetsType");
      } else {
        options.statisticalDate = localStorage.getItem("departName");
      }

      const { data } = await fetchRentAmount(options);

      this.chart1Data = data || [];
    },

    async fetchRentList() {
      const options = {
        departCode: this.currentDepart.departCode,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        normType: this.normType,
        searchYear: localStorage.getItem("assetsType"),
      };

      const { rows, total } = await fetchRentList(options);

      this.list = rows || [];
      this.total = total;
    },

    async fetchDepletionValue() {
      const options = {
        departCode: this.currentDepart.departCode,
        normType: this.normType,
        dimension: localStorage.getItem("dimension"),
        dictCode: localStorage.getItem("dictCode") || "",
        searchMonth: localStorage.getItem("assetsType"),
        groupType: 0,
      };

      const { data } = await fetchDepletionValue(options);

      this.chart1Data = data || [];
    },

    async fetchDepletionList() {
      const options = {
        departCode: this.currentDepart.departCode,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        normType: this.normType,
        dimension: localStorage.getItem("dimension"),
        dictCode: localStorage.getItem("dictCode") || "",
        searchMonth: localStorage.getItem("assetsType"),
      };

      const { rows, total } = await fetchDepletionList(options);

      this.list = rows || [];
      this.total = total;
    },

    async fetchProductionList() {
      const options = {
        departCode: this.currentDepart.departCode,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        normType: this.normType,
        searchMonth: localStorage.getItem("assetsType"),
      };

      const { rows, total } = await fetchProductionList(options);

      this.list = rows || [];
      this.total = total;
    },

    async fetchProductionValue() {
      const options = {
        departCode: this.currentDepart.departCode,
        normType: this.normType,
        groupType: 0,
        searchDate: localStorage.getItem("assetsType"),
      };

      const { data } = await fetchProductionValue(options);

      this.chart1Data = data || [];
    },

    async fetchBusinessAmount() {
      const options = {
        departCode: this.currentDepart.departCode,
        normType: this.normType,
      };

      if (this.type === "本年业务统计") {
        options.dimension = localStorage.getItem("dimension");
        if (options.dimension === "0") {
          options.businessType = localStorage.getItem("assetsType");
        } else if (options.dimension === "1") {
          options.departName = localStorage.getItem("assetsType");
        }
      } else if (this.type === "业务数据统计") {
        options.searchDate = Moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      }

      const { data } = await fetchBusinessAmount(options);

      this.chart1Data = data || [];
    },

    /**
     * 资产明细信息列表查询
     */
    async fetchAssetsList() {
      const options = {
        departCode: this.currentDepart.departCode,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        normType: this.normType,
      };

      if (this.type === "资产总量统计") {
        options.assetsType = localStorage.getItem("assetsType");
      } else if (this.type === "实物资产统计") {
        if (this.physicalType === "0") {
          options.realAssets = 1;
          options.searchYear = localStorage.getItem("assetsType");
        }
      }

      const { rows, total } = await fetchAssetsList(options);

      this.list = rows || [];
      this.total = total;
    },

    /**
     * 业务明细列表查询
     */
    async fetchBusinessList() {
      const options = {
        departCode: this.currentDepart.departCode,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        normType: this.normType,
      };

      if (this.type === "本年业务统计") {
        options.dimension = localStorage.getItem("dimension");
        if (options.dimension === "0") {
          options.businessType = localStorage.getItem("assetsType");
        } else if (options.dimension === "1") {
          options.departName = localStorage.getItem("assetsType");
        }
      } else if (this.type === "业务数据统计") {
        options.searchDate = Moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      } else if (this.type === "实物资产统计") {
        if (this.physicalOption === "0") {
          options.searchYear = localStorage.getItem("assetsType");
        }
      }

      const { rows, total } = await fetchBusinessList(options);

      this.list = rows || [];
      this.total = total;
    },

    /**
     * 表格页码改变
     */
    onCurrentChange(value) {
      this.page.pageNum = value;
      if (["资产总量统计", "实物资产统计"].indexOf(this.type) > -1) {
        this.fetchAssetsList();
      } else {
        this.fetchVisualRentHouseFun();
      }
    },

    /**
     * 房屋使用性质数量占比查询
     */
    async fetchVisualAmountNatureFun() {
      const options = {
        departCode: this.currentDepart.departCode,
        normType: this.normType,
      };

      if (this.type === "资产总量统计") {
        options.assetsType = localStorage.getItem("assetsType");
      } else if (this.type === "实物资产统计") {
        if (this.physicalType === "0") {
          options.realAssets = 1;
          if (this.physicalOption === "0") {
            options.searchDate = localStorage.getItem("assetsType");
          } else {
            options.departName = localStorage.getItem("assetsType");
          }
        } else if (this.physicalType === "2") {
          options.realAssets = 1;
          options.searchYear = localStorage.getItem("assetsType");
        }
      }

      const { data } = await fetchAssetsAmount(options);
      console.log("左侧上方 :>> ", data);

      this.chart1Data = data || [];
    },

    /**
     * 房屋使用性质价值量占比查询
     */
    async fetchVisualValueNatureFun() {
      const options = {
        departCode: this.currentDepart.departCode,
        assetsType: localStorage.getItem("assetsType"),
        normType: this.normType,
      };

      if (this.type === "资产总量统计") {
        options.assetsType = localStorage.getItem("assetsType");
      } else if (this.type === "实物资产统计") {
        if (this.physicalType === "0") {
          options.realAssets = 1;
          if (this.physicalOption === "0") {
            options.searchDate = localStorage.getItem("assetsType");
          } else {
            options.departName = localStorage.getItem("assetsType");
          }
        } else if (this.physicalType === "2") {
          options.realAssets = 1;
          options.searchYear = localStorage.getItem("assetsType");
        }
      }

      const { data } = await fetchAssetsValue(options);

      console.log("左侧下方 :>> ", data);

      this.chart2Data = data || [];
    },

    /**
     * 房屋出租承租单位性质数量占比查询
     */
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

      this.chart2Data = data || [];
    },

    /**
     * 房屋出租承租单位性质价值量占比查询
     */
    async fetchVisualAmountRentDepartFun() {
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

      const { data } = await fetchVisualAmountRentDepart(options);

      this.chart1Data = data || [];
    },

    initChart() {
      echarts.dispose(document.getElementById("chart4"));
      const myChart1 = echarts.init(document.getElementById("chart4"));
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
        case "资产总量统计":
        case "实物资产统计":
        case "本年业务统计":
        case "业务数据统计":
        case "油气产量统计":
          data1 = this.chart1Data.map((item) => {
            return {
              name: item.groupName,
              value: Number(item.groupCount),
            };
          });
          break;
        case "年折耗统计":
          data1 = this.chart1Data.map((item) => {
            return {
              name: item.groupName,
              value: Number(item.groupValue),
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

      myChart1.setOption(options1);

      if (
        ["本年业务统计"].indexOf(this.type) === -1 ||
        (["实物资产统计"].indexOf(this.type) === -1 &&
          this.physicalType === "1") ||
        ["资产总量统计"].indexOf(this.type) === -1
      ) {
        echarts.dispose(document.getElementById("chart5"));
        const myChart2 = echarts.init(document.getElementById("chart5"));
        let data2 = [];

        switch (this.type) {
          case "资产总量统计":
          case "实物资产统计":
            data2 = this.chart2Data.map((item) => {
              return {
                name: item.groupName,
                value: Number(item.groupValue),
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

        myChart2.setOption(options2);
      }
    },

    onModalClose() {
      bus.emit("onAssetsModalShow", false);
    },

    /**
     * 房屋信息台账明细查询
     */
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

    /**
     * 房屋出租信息查询
     */
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
  pointer-events: auto;

  .title_img {
    // width: 100%;
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
            // flex: 1 0;
            display: flex;
            flex-wrap: wrap;

            .info_item {
              width: 50%;
              height: max-content;
              display: flex;
              align-items: center;
              overflow: hidden;

              img {
                width: 23px;
                margin-right: 6px;
              }

              span {
                width: 90px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #ffffff;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              p {
                flex: 1 0;
                font-size: 18px;
                font-family: YouSheBiaoTiHei;
                font-weight: bold;
                color: rgba(0, 162, 255, 1);
                margin: 0 0 0 10px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
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

        .table_container {
          width: 100%;
          flex: 1 0;
          overflow: auto;
          min-height: calc(100% - 63px);

          table {
            width: max-content;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid rgba(57, 158, 233, 0.2);
            border-collapse: collapse;

            thead {
              height: 33px;

              tr {
                width: max-content;
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
              flex: 1 0;

              tr {
                width: max-content;
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
