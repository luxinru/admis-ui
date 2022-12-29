<template>
  <div class="house_table_root">
    <img
      class="close"
      src="@/assets/images/screen/close.png"
      alt=""
      @click="onClose"
    />

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
            layout="prev, pager, next"
            :total="total"
            :page-size="20"
            :current-page="page.pageNum"
            @current-change="onCurrentChange"
          />
        </div>
      </div>

      <template v-if="type === 1">
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
              <td :title="item.nowValue || '-'">{{ item.nowValue || "-" }}</td>
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
      </template>

      <template v-if="type === 2">
        <table border="1" style="z-index: 3">
          <thead>
            <tr>
              <th>省(直辖市)</th>
              <th>市</th>
              <th>区(县)</th>
              <th>房屋结构</th>
              <th>建筑面积</th>
              <th>地上总层</th>
              <th>地下总层</th>
              <th>备注</th>
              <th>资产编号</th>
              <th>资产名称</th>
              <th>计量单位</th>
              <th>贮存数量</th>
              <th>投产日期</th>
              <th>规格型号</th>
              <th>原值</th>
              <th>净值</th>
              <th>已提减值准备</th>
              <th>宗地编码</th>
              <th>权属状况</th>
              <th>使用权资产</th>
              <th>土地面积</th>
              <th>土地证号</th>
              <th>土地使用人</th>
              <th>房产证号</th>
              <th>证载所有权人</th>
              <th>办证情况</th>
              <th>记账是否相符</th>
              <th>无证原因</th>
              <th>管理单位情况</th>
              <th>使用单位情况</th>
            </tr>
          </thead>

          <tbody>
            <tr class="td" v-for="(item, index) in list" :key="index">
              <td :title="item.province || '-'">
                {{ item.province || "-" }}
              </td>
              <td :title="item.city || '-'">
                {{ item.city || "-" }}
              </td>
              <td :title="item.county || '-'">
                {{ item.county || "-" }}
              </td>
              <td :title="item.houseStructureName || '-'">
                {{ item.houseStructureName || "-" }}
              </td>
              <td :title="item.buildArea || '-'">
                {{ item.buildArea || "-" }}
              </td>
              <td :title="item.floorsUpName || '-'">
                {{ item.floorsUpName || "-" }}
              </td>
              <td :title="item.floorsDownName || '-'">
                {{ item.floorsDownName || "-" }}
              </td>
              <td :title="item.remark || '-'">
                {{ item.remark || "-" }}
              </td>
              <td :title="item.assetsCode || '-'">
                {{ item.assetsCode || "-" }}
              </td>
              <td :title="item.assetsName || '-'">
                {{ item.assetsName || "-" }}
              </td>
              <td :title="item.unitCodeName || '-'">
                {{ item.unitCodeName || "-" }}
              </td>
              <td>{{ "-" }}</td>
              <td :title="item.operateDate || '-'">
                {{ item.operateDate || "-" }}
              </td>
              <td :title="item.assetsStandard || '-'">
                {{ item.assetsStandard || "-" }}
              </td>
              <td :title="item.originalValue || '-'">
                {{ item.originalValue || "-" }}
              </td>
              <td :title="item.nowValue || '-'">
                {{ item.nowValue || "-" }}
              </td>
              <td :title="item.devalueValue || '-'">
                {{ item.devalueValue || "-" }}
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
              <td :title="item.landArea || '-'">
                {{ item.landArea || "-" }}
              </td>
              <td :title="item.landCertificateNo || '-'">
                {{ item.landCertificateNo || "-" }}
              </td>
              <td :title="item.landUsedHolder || '-'">
                {{ item.landUsedHolder || "-" }}
              </td>
              <td :title="item.houseCertificateNo || '-'">
                {{ item.houseCertificateNo || "-" }}
              </td>
              <td :title="item.certificateHolder || '-'">
                {{ item.certificateHolder || "-" }}
              </td>
              <td :title="item.certificateHandlingName || '-'">
                {{ item.certificateHandlingName || "-" }}
              </td>
              <td :title="item.bookkeeping || '-'">
                {{ item.bookkeeping || "-" }}
              </td>
              <td :title="item.noCertificateReason || '-'">
                {{ item.noCertificateReason || "-" }}
              </td>
              <td :title="item.managerDepartThreeName || '-'">
                {{ item.managerDepartThreeName || "-" }}
              </td>
              <td :title="item.usedDepartThreeName || '-'">
                {{ item.usedDepartThreeName || "-" }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <template v-if="type === 3">
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
      </template>

      <template v-if="type === 4">
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
      </template>

      <template v-if="type === 5">
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

export default {
  name: "HouseTable",

  data() {
    return {
      type: 1,
      list: [],
      page: {
        pageNum: 1,
        pageSize: 20,
      },
      total: 0,
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
    async onTypeClick(value) {
      this.type = value;

      this.list = [];
      const depart = JSON.parse(localStorage.getItem("currentDepart"));
      const house = JSON.parse(localStorage.getItem("currentHouse"));
      switch (this.type) {
        case 1:
          const { rows: rows1, total: total1 } = await fetchVisualList({
            parentHouseCode: house.id,
            pageNum: this.page.pageNum,
            pageSize: this.page.pageSize,
          });
          this.list = rows1 || [];
          this.total = total1 || 0;
          break;
        case 2:
          const { rows: rows4, total: total4 } = await fetchVisualList({
            houseCode: house.id,
            pageNum: this.page.pageNum,
            pageSize: this.page.pageSize,
          });
          this.list = rows4 || [];
          this.total = total4 || 0;
          break;
        case 3:
          const { rows: rows5, total: total5 } = await fetchListFilesByKeyCode({
            keyCode: house.keyCode,
          });
          this.list = rows5 || [];
          this.total = total5 || 0;
          break;
        case 4:
          const { rows: rows2, total: total2 } = await fetchVisualRentHouse({
            houseCode: house.id,
            pageNum: this.page.pageNum,
            pageSize: this.page.pageSize,
          });
          this.list = rows2 || [];
          this.total = total2 || 0;
          break;
        case 5:
          const { rows: rows3, total: total3 } = await fetchVisualReformHouse({
            houseCode: house.id,
            pageNum: this.page.pageNum,
            pageSize: this.page.pageSize,
          });
          this.list = rows3 || [];
          this.total = total3 || 0;
          break;
      }
    },

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

    onClose() {
      bus.emit("onHouseTableOperate", false);
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
  overflow: hidden;

  .close {
    position: absolute;
    right: 0;
    top: 0;
    width: 24px;
    z-index: 1;
  }

  .title {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 62px;
    display: flex;

    .bac {
      position: absolute;
      width: 100%;
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
      line-height: 55px;
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
    margin-top: 62px;
    padding: 16px 13px 24px 29px;
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

    table {
      width: 100%;
      flex: 1 0;
      border: 1px solid rgba(57, 158, 233, 0.2);
      border-collapse: collapse;
      display: flex;
      flex-direction: column;
      overflow-x: scroll;
      overflow-y: hidden;
      tr {
        width: max-content;
        height: 34px;
        display: flex;
        align-items: center;
        th {
          width: 200px;
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
          width: 200px;
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
        background-color: #153456;
      }

      tbody {
        min-width: 100%;
        width: max-content;
        flex: 1 0;
        overflow-y: scroll;
        overflow-x: hidden;
        tr {
          &:nth-child(2n) {
            background-color: rgba(51, 133, 238, 0.1);
          }
        }
      }
    }
  }
}
</style>
