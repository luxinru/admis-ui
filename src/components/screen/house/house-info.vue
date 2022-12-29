<template>
  <div class="house_info_root">
    <img
      class="close"
      src="@/assets/images/screen/close.png"
      alt=""
      @click="onClose"
    />

    <div class="title">
      {{ house.actualName }}
    </div>

    <div class="content">
      <div class="tr">
        <div class="item">
          <span class="label">省(直辖市)</span>
          <span class="value" :title="house.province || '-'">{{
            house.province || "-"
          }}</span>
        </div>
        <div class="item">
          <span class="label">市</span>
          <span class="value" :title="house.city || '-'">{{
            house.city || "-"
          }}</span>
        </div>
      </div>

      <div class="tr">
        <div class="item">
          <span class="label">区(县)</span>
          <span class="value" :title="house.county || '-'">{{
            house.county || "-"
          }}</span>
        </div>
        <div class="item">
          <span class="label">房屋结构</span>
          <span class="value" :title="house.houseStructureName || '-'">{{
            house.houseStructureName || "-"
          }}</span>
        </div>
      </div>

      <div class="tr">
        <div class="item">
          <span class="label">建筑面积</span>
          <span class="value" :title="house.buildArea || '-'"
            >{{ house.buildArea || "-" }}㎡</span
          >
        </div>
        <div class="item">
          <span class="label">地上总层</span>
          <span class="value" :title="house.floorsUpName || '-'">{{
            house.floorsUpName || "-"
          }}</span>
        </div>
      </div>

      <div class="tr">
        <div class="item">
          <span class="label">地下总层</span>
          <span class="value" :title="house.floorsDownName || '-'">{{
            house.floorsDownName || "-"
          }}</span>
        </div>
        <div class="item">
          <span class="label">备注</span>
          <span class="value" :title="house.remark || '-'">{{
            house.remark || "-"
          }}</span>
        </div>
      </div>

      <div class="tr">
        <div class="item">
          <span class="label">资产编号</span>
          <span class="value" :title="house.assetsCode || '-'">{{
            house.assetsCode || "-"
          }}</span>
        </div>
        <div class="item">
          <span class="label">资产名称</span>
          <span class="value" :title="house.assetsName || '-'">{{
            house.assetsName || "-"
          }}</span>
        </div>
      </div>

      <div class="tr">
        <div class="item">
          <span class="label">计量单位</span>
          <span class="value" :title="house.unitCodeName || '-'">{{
            house.unitCodeName || "-"
          }}</span>
        </div>
        <div class="item">
          <span class="label">贮存数量</span>
          <span class="value">{{ "-" }}</span>
        </div>
      </div>

      <div class="tr">
        <div class="item">
          <span class="label">投产日期</span>
          <span class="value" :title="house.operateDate || '-'">{{
            house.operateDate || "-"
          }}</span>
        </div>
        <div class="item">
          <span class="label">规格型号</span>
          <span class="value" :title="house.assetsStandard || '-'">{{
            house.assetsStandard || "-"
          }}</span>
        </div>
      </div>
      <div class="tr">
        <div class="item">
          <span class="label">原值</span>
          <span class="value" :title="house.originalValue || '-'">{{
            house.originalValue || "-"
          }}</span>
        </div>
        <div class="item">
          <span class="label">净值</span>
          <span class="value" :title="house.nowValue || '-'">{{
            house.nowValue || "-"
          }}</span>
        </div>
      </div>
      <div class="tr">
        <div class="item">
          <span class="label">已提减值准备</span>
          <span class="value" :title="house.devalueValue || '-'">{{
            house.devalueValue || "-"
          }}</span>
        </div>
        <div class="item">
          <span class="label">宗地编码</span>
          <span class="value" :title="house.parcelCode || '-'">{{
            house.parcelCode || "-"
          }}</span>
        </div>
      </div>
      <div class="tr">
        <div class="item">
          <span class="label">权属状况</span>
          <span class="value" :title="house.ownershipConditionName || '-'">{{
            house.ownershipConditionName || "-"
          }}</span>
        </div>
        <div class="item">
          <span class="label">使用权资产</span>
          <span class="value" :title="house.usedrightTypeName || '-'">{{
            house.usedrightTypeName || "-"
          }}</span>
        </div>
      </div>
      <div class="tr">
        <div class="item">
          <span class="label">土地面积</span>
          <span class="value" :title="house.landArea || '-'">{{
            house.landArea || "-"
          }}</span>
        </div>
        <div class="item">
          <span class="label">土地证号</span>
          <span class="value" :title="house.landCertificateNo || '-'">{{
            house.landCertificateNo || "-"
          }}</span>
        </div>
      </div>
      <div class="tr">
        <div class="item">
          <span class="label">土地使用人</span>
          <span class="value" :title="house.landUsedHolder || '-'">{{
            house.landUsedHolder || "-"
          }}</span>
        </div>
        <div class="item">
          <span class="label">房产证号</span>
          <span class="value" :title="house.houseCertificateNo || '-'">{{
            house.houseCertificateNo || "-"
          }}</span>
        </div>
      </div>
      <div class="tr">
        <div class="item">
          <span class="label">证载所有权人</span>
          <span class="value" :title="house.certificateHolder || '-'">{{
            house.certificateHolder || "-"
          }}</span>
        </div>
        <div class="item">
          <span class="label">办证情况</span>
          <span class="value" :title="house.certificateHandlingName || '-'">{{
            house.certificateHandlingName || "-"
          }}</span>
        </div>
      </div>
      <div class="tr">
        <div class="item">
          <span class="label">记账是否相符</span>
          <span class="value" :title="house.bookkeeping || '-'">{{
            house.bookkeeping || "-"
          }}</span>
        </div>
        <div class="item">
          <span class="label">无证原因</span>
          <span class="value" :title="house.noCertificateReason || '-'">{{
            house.noCertificateReason || "-"
          }}</span>
        </div>
      </div>
      <div class="tr">
        <div class="item">
          <span class="label">管理单位情况</span>
          <span class="value" :title="house.managerDepartThreeName || '-'">{{
            house.managerDepartThreeName || "-"
          }}</span>
        </div>
        <div class="item">
          <span class="label">使用单位情况</span>
          <span class="value" :title="house.usedDepartThreeName || '-'">{{
            house.usedDepartThreeName || "-"
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "vue3-eventbus";

export default {
  name: "HouseInfo",

  data() {
    return {
      house: {},
    };
  },

  mounted() {
    const self = this;
    this.house = JSON.parse(localStorage.getItem("currentHouse"));

    bus.on("onMapItemClick", async (data) => {
      self.house = JSON.parse(localStorage.getItem("currentHouse"));
    });
  },

  methods: {
    onClose() {
      bus.emit("onHouseInfoOperate", false);
    },
  },
};
</script>

<style scoped lang="scss">
* {
  flex-shrink: 0;
}
.house_info_root {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: url("../../../assets/images/screen/window-1.png") no-repeat;
  background-size: 100% 100%;
  padding: 38px 25px 48px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  .close {
    position: absolute;
    right: 16px;
    top: 38px;
    width: 24px;
  }

  .title {
    width: 100%;
    height: 51px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0px 1px 1px rgba(0, 11, 10, 0.43);
    text-align: center;
  }

  .content {
    width: 100%;
    flex: 1 0;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;

    .tr {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(57, 158, 233, 0.4);

      .item {
        flex: 1 0;
        height: 100%;
        display: flex;
        align-items: center;
        overflow: hidden;

        .label {
          width: 80px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(145, 204, 255, 1);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .value {
          flex: 1 0;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
