<template>
  <div class="house_table_root">
    <section class="title">
      <img class="bac" src="@/assets/images/screen/title-2.png" alt="" />
      <span class="name">房屋明细信息</span>

      <!-- <div class="more" @click="onMoreClick">
        <span>More</span>
        <img src="@/assets/images/screen/more-1.png" alt="" />
      </div> -->
    </section>

    <section class="table">
      <div class="tabs">
        <div class="part">
          <span :class="{ active: type === 1 }" @click="onTypeClick(1)">
            基础信息
          </span>
          <span :class="{ active: type === 2 }" @click="onTypeClick(2)">
            资产信息
          </span>
          <span :class="{ active: type === 3 }" @click="onTypeClick(3)">
            房屋档案
          </span>
          <span :class="{ active: type === 4 }" @click="onTypeClick(4)">
            出租信息
          </span>
          <span :class="{ active: type === 5 }" @click="onTypeClick(5)">
            改造信息
          </span>
        </div>

        <div class="paging">
          <el-pagination
            v-if="type !== 2"
            layout="prev, pager, next"
            :total="total"
            :page-size="20"
            :current-page="page.pageNum"
            @current-change="onCurrentChange"
          />
        </div>
      </div>

      <template v-if="type === 1">
        <section class="table_container">
          <table border="1" style="z-index: 3">
            <thead>
              <tr>
                <th>房屋名称</th>
                <th>使用单位</th>
                <th>原值</th>
                <th>净值</th>
                <th>折旧</th>
                <th>使用性质</th>
                <th>实际用途</th>
                <th>使用状态</th>
              </tr>
            </thead>

            <tbody>
              <tr class="td" v-for="(item, index) in list" :key="index">
                <td :title="item.assetsName || '-'">
                  {{ item.assetsName || "-" }}
                </td>
                <td :title="item.usedDepartThreeName || '-'">
                  {{ item.usedDepartThreeName || "-" }}
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
                <td :title="item.usedNatureName || '-'">
                  {{ item.usedNatureName || "-" }}
                </td>
                <td :title="item.actualUsedName || '-'">
                  {{ item.actualUsedName || "-" }}
                </td>
                <td :title="item.usedStateName || '-'">
                  {{ item.usedStateName || "-" }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </template>

      <template v-if="type === 2">
        <section
          class="table_container"
          :style="{
            width: '100%',
            overflow: 'hidden',
            border: '1px solid rgba(57, 158, 233, 0.2)',
          }"
        >
          <div class="details">
            <div class="item">
              <span class="label"> 省(直辖市) </span>
              <span class="value" :title="currentHouse.province || '-'">
                {{ currentHouse.province || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 市 </span>
              <span class="value" :title="currentHouse.city || '-'">
                {{ currentHouse.city || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 区(县) </span>
              <span class="value" :title="currentHouse.county || '-'">
                {{ currentHouse.county || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 房屋结构 </span>
              <span
                class="value"
                :title="currentHouse.houseStructureName || '-'"
              >
                {{ currentHouse.houseStructureName || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 建筑面积 </span>
              <span class="value" :title="(currentHouse.buildArea || '-') + '㎡'">
                {{ currentHouse.buildArea || "-" }}㎡
              </span>
            </div>
            <div class="item">
              <span class="label"> 地上总层 </span>
              <span class="value" ::title="currentHouse.floorsUpName || '-'">
                {{ currentHouse.floorsUpName || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 地下总层 </span>
              <span class="value" ::title="currentHouse.floorsDownName || '-'">
                {{ currentHouse.floorsDownName || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 备注 </span>
              <span class="value" ::title="currentHouse.remark || '-'">
                {{ currentHouse.remark || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 资产编号 </span>
              <span class="value" :title="currentHouse.assetsCode || '-'">
                {{ currentHouse.assetsCode || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 资产名称 </span>
              <span class="value" :title="currentHouse.assetsName || '-'">
                {{ currentHouse.assetsName || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 计量单位 </span>
              <span class="value" :title="currentHouse.unitCodeName || '-'">
                {{ currentHouse.unitCodeName || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 贮存数量 </span>
              <span class="value" ::title="'-'">
                {{ "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 投产日期 </span>
              <span class="value" :title="currentHouse.operateDate || '-'">
                {{ currentHouse.operateDate || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 规格型号 </span>
              <span class="value" :title="currentHouse.assetsStandard || '-'">
                {{ currentHouse.assetsStandard || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 原值 </span>
              <span class="value" :title="currentHouse.originalValue || '-'">
                {{ currentHouse.originalValue || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 净值 </span>
              <span class="value" :title="currentHouse.nowValue || '-'">
                {{ currentHouse.nowValue || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 已提减值准备 </span>
              <span class="value" :title="currentHouse.devalueValue || '-'">
                {{ currentHouse.devalueValue || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 宗地编码 </span>
              <span class="value" :title="currentHouse.parcelCode || '-'">
                {{ currentHouse.parcelCode || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 权属状况 </span>
              <span
                class="value"
                :title="currentHouse.ownershipConditionName || '-'"
              >
                {{ currentHouse.ownershipConditionName || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 使用权资产 </span>
              <span
                class="value"
                :title="currentHouse.usedrightTypeName || '-'"
              >
                {{ currentHouse.usedrightTypeName || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 土地面积 </span>
              <span class="value" :title="currentHouse.landArea || '-'">
                {{ currentHouse.landArea || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 土地证号 </span>
              <span
                class="value"
                :title="currentHouse.landCertificateNo || '-'"
              >
                {{ currentHouse.landCertificateNo || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 土地使用人 </span>
              <span class="value" :title="currentHouse.landUsedHolder || '-'">
                {{ currentHouse.landUsedHolder || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 房产证号 </span>
              <span
                class="value"
                ::title="currentHouse.houseCertificateNo || '-'"
              >
                {{ currentHouse.houseCertificateNo || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 证载所有权人 </span>
              <span
                class="value"
                ::title="currentHouse.certificateHolder || '-'"
              >
                {{ currentHouse.certificateHolder || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 办证情况 </span>
              <span
                class="value"
                ::title="currentHouse.certificateHandlingName || '-'"
              >
                {{ currentHouse.certificateHandlingName || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 记账是否相符 </span>
              <span class="value" ::title="currentHouse.bookkeeping || '-'">
                {{ currentHouse.bookkeeping || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 无证原因 </span>
              <span
                class="value"
                :title="currentHouse.noCertificateReason || '-'"
              >
                {{ currentHouse.noCertificateReason || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 管理单位情况 </span>
              <span
                class="value"
                :title="currentHouse.managerDepartThreeName || '-'"
              >
                {{ currentHouse.managerDepartThreeName || "-" }}
              </span>
            </div>
            <div class="item">
              <span class="label"> 使用单位情况 </span>
              <span
                class="value"
                :title="currentHouse.usedDepartThreeName || '-'"
              >
                {{ currentHouse.usedDepartThreeName || "-" }}
              </span>
            </div>
          </div>
        </section>
      </template>

      <template v-if="type === 3">
        <section class="table_container">
          <table border="1" style="z-index: 3">
            <thead>
              <tr>
                <th style="width: 500px">档案名称</th>
                <th>档案类型</th>
                <th>关联业务</th>
              </tr>
            </thead>

            <tbody>
              <tr class="td" v-for="(item, index) in list" :key="index">
                <td
                  :title="item.fileName || '-'"
                  style="width: 500px; cursor: pointer; color: #91ccff"
                  @click="onDownload(item)"
                >
                  {{ item.fileName || "-" }}
                </td>
                <td :title="item.fileType || '-'">
                  {{ item.fileType || "-" }}
                </td>
                <td :title="item.busType || '-'">
                  {{ item.busType || "-" }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </template>

      <template v-if="type === 4">
        <section class="table_container">
          <table border="1" style="z-index: 3">
            <thead>
              <tr>
                <th>合同编号</th>
                <th>合同名称</th>
                <th>资产编码</th>
                <th>资产名称</th>
                <th>履行开始日期</th>
                <th>履行结束日期</th>
                <th>承租方单位名称</th>
                <th>租赁金额（不含税）</th>
              </tr>
            </thead>

            <tbody>
              <tr class="td" v-for="(item, index) in list" :key="index">
                <td :title="item.contractCode || '-'">
                  {{ item.contractCode || "-" }}
                </td>
                <td :title="item.contracName || '-'">
                  {{ item.contracName || "-" }}
                </td>
                <td :title="item.assetsCode || '-'">
                  {{ item.assetsCode || "-" }}
                </td>
                <td :title="item.assetsName || '-'">
                  {{ item.assetsName || "-" }}
                </td>
                <td :title="item.performStartDate || '-'">
                  {{ item.performStartDate || "-" }}
                </td>
                <td :title="item.performEndDate || '-'">
                  {{ item.performEndDate || "-" }}
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
        </section>
      </template>

      <template v-if="type === 5">
        <section class="table_container">
          <table border="1" style="z-index: 3">
            <thead>
              <tr>
                <th>合同编号</th>
                <th>合同名称</th>
                <th>资产编码</th>
                <th>资产名称</th>
                <th>开工时间</th>
                <th>完工时间</th>
                <th>合同金额</th>
                <th>工程进度</th>
                <th>结算金额</th>
              </tr>
            </thead>

            <tbody>
              <tr class="td" v-for="(item, index) in list" :key="index">
                <td :title="item.contractCode || '-'">
                  {{ item.contractCode || "-" }}
                </td>
                <td :title="item.contracName || '-'">
                  {{ item.contracName || "-" }}
                </td>
                <td :title="item.assetsCode || '-'">
                  {{ item.assetsCode || "-" }}
                </td>
                <td :title="item.assetsName || '-'">
                  {{ item.assetsName || "-" }}
                </td>
                <td :title="item.startDate || '-'">
                  {{ item.startDate || "-" }}
                </td>
                <td :title="item.endDate || '-'">{{ item.endDate || "-" }}</td>
                <td :title="item.contracMoney || '-'">
                  {{ item.contracMoney || "-" }}
                </td>
                <td :title="item.projectProgress || '-'">
                  {{ item.projectProgress || "-" }}
                </td>
                <td :title="item.settleMoney || '-'">
                  {{ item.settleMoney || "-" }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </template>
    </section>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import {
  fetchVisualList,
  fetchVisualRentHouse,
  fetchVisualReformHouse,
  fetchListFilesByKeyCode,
} from "@/api/screen/house";

/**
 * 底部表格组件
 */
export default {
  name: "HouseTable",

  data() {
    return {
      type: 1, // 1基础信息 2资产信息 3房屋档案 4出租信息 5改造信息
      list: [],
      page: {
        pageNum: 1,
        pageSize: 20,
      },
      total: 0,
      currentHouse: {},
    };
  },

  mounted() {
    const self = this;
    self.onTypeClick(1);

    bus.on("onMapItemClick", async (data) => {
      self.onTypeClick(1);
    });
  },

  methods: {
    /**
     * 点击顶部tabs
     */
    async onTypeClick(value) {
      this.type = value;

      this.list = [];
      const depart = JSON.parse(localStorage.getItem("currentDepart"));
      this.currentHouse =
        JSON.parse(localStorage.getItem("currentHouse")) || {};
      /**
       * 根据不同的tab调不同的方法
       */
      switch (this.type) {
        case 1:
          // 房屋信息查询接口
          const { rows: rows1, total: total1 } = await fetchVisualList({
            houseCode: this.currentHouse.keyCode,
            pageNum: this.page.pageNum,
            pageSize: this.page.pageSize,
          });
          this.list = rows1 || [];
          this.total = total1 || 0;
          break;
        case 2:
          // todo 不请求接口，后续客户自己调整
          // const { rows: rows4, total: total4 } = await fetchVisualList({
          //   houseCode: house.keyCode,
          //   pageNum: this.page.pageNum,
          //   pageSize: this.page.pageSize,
          // });
          // this.list = rows4 || [];
          // this.total = total4 || 0;
          break;
        case 3:
          // 获取房屋图片信息
          const { rows: rows5, total: total5 } = await fetchListFilesByKeyCode({
            keyCode: this.currentHouse.keyCode,
          });
          this.list = rows5 || [];
          this.total = total5 || 0;
          break;
        case 4:
          // 房屋出租信息查询接口
          const { rows: rows2, total: total2 } = await fetchVisualRentHouse({
            houseCode: this.currentHouse.keyCode,
            pageNum: this.page.pageNum,
            pageSize: this.page.pageSize,
          });
          this.list = rows2 || [];
          this.total = total2 || 0;
          break;
        case 5:
          // 房屋改造信息接口
          const { rows: rows3, total: total3 } = await fetchVisualReformHouse({
            houseCode: this.currentHouse.keyCode,
            pageNum: this.page.pageNum,
            pageSize: this.page.pageSize,
          });
          this.list = rows3 || [];
          this.total = total3 || 0;
          break;
      }
    },

    /**
     * 下载房屋图片
     */
    onDownload(file) {
      const canvas = document.createElement("canvas");
      const img = document.createElement("img");
      img.onload = function (e) {
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, img.width, img.height);
        canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
        canvas.toBlob((blob) => {
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = file.fileName;
          link.click();
        }, `image/${file.fileType}`);
      };
      img.setAttribute("crossOrigin", "Anonymous");
      img.src = file.filePath;
    },

    onCurrentChange(value) {
      this.page.pageNum = value;
      this.onTypeClick(this.type);
    },
  },
};
</script>

<style lang="scss">
.house_table_root {
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
.house_table_root {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, rgba(1, 18, 40, 0.9), rgba(1, 18, 40, 0.9));
  border: 1px solid;
  border-image: linear-gradient(
      0deg,
      rgba(58, 98, 157, 0.86),
      rgba(34, 50, 70, 0.86)
    )
    1 1;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .title {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 62px;
    display: flex;

    .bac {
      position: absolute;
      height: 100%;
      top: 0;
      left: 0;
    }

    .name {
      position: relative;
      flex: 1 0;
      font-size: 22px;
      font-family: YouSheBiaoTiHei;
      font-weight: 400;
      line-height: 45px;
      background: linear-gradient(0deg, #82c1ff 10%, #ffffff 80%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-left: 66px;
    }

    .more {
      position: relative;
      display: flex;
      align-items: center;
      margin-right: 5px;
      line-height: 55px;
      cursor: pointer;

      span {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(220, 237, 255, 0.7);
        line-height: 55px;
      }

      img {
        height: 15px;
        margin-left: 2px;
      }
    }
  }

  .table {
    width: 100%;
    height: calc(100% - 62px);
    display: flex;
    flex-direction: column;
    margin-top: 42px;
    padding: 16px 24px 0;
    box-sizing: border-box;

    .tabs {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .part {
        display: flex;
        align-items: center;

        span {
          width: 80px;
          height: 30px;
          background: rgba(51, 133, 238, 0.2);
          border: 1px solid #113c73;
          border-radius: 5px 5px 0px 0px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #91ccff;
          margin-left: 3px;
          cursor: pointer;

          &:first-child {
            margin-left: 0;
          }
        }

        .active {
          background: rgba(51, 133, 238, 0.6);
          border: 1px solid #2177cf;
          border-radius: 5px 5px 0px 0px;
          color: rgba(255, 255, 255, 1);
        }
      }

      .paging {
        display: flex;
        align-items: center;
      }
    }

    .table_container {
      width: 100%;
      flex: 1 0;
      overflow: auto;
      table {
        width: max-content;
        height: max-content;
        min-width: 100%;
        min-height: 100%;
        border: 1px solid rgba(57, 158, 233, 0.2);
        border-collapse: collapse;
        display: flex;
        flex-direction: column;
        overflow: visible;
        tr {
          width: 100%;
          height: 34px;
          display: flex;
          align-items: center;
          th {
            flex: 1 0;
            min-width: 200px;
            height: 34px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #91ccff;
            text-align: center;
            line-height: 34px;
            border: 1px solid rgba(57, 158, 233, 0.2);
            background-color: #153456;
          }
          td {
            flex: 1 0;
            min-width: 200px;
            height: 34px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #ffffff;
            text-align: center;
            line-height: 34px;
            border: 1px solid rgba(57, 158, 233, 0.2);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 0 10px;
            box-sizing: border-box;
            text-align: center;
          }
        }

        thead {
          width: 100%;
          position: sticky;
          background-color: #195198;
          top: 0;
        }

        tbody {
          width: 100%;
          width: 100%;
          flex: 1 0;
          tr {
            &:nth-child(2n) {
              background-color: rgba(51, 133, 238, 0.1);
            }
          }
        }
      }

      .details {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-row-gap: 16px;
        // grid-column-gap: 16px;
        padding: 24px;
        box-sizing: border-box;
        overflow-y: scroll;
        overflow-x: hidden;

        .item {
          width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
          overflow: hidden;

          .label {
            width: 90px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #91ccff;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;

            &::after {
              content: "：";
            }
          }

          .value {
            flex: 1 0;
            color: rgba(255, 255, 255, 1);
            margin-right: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
