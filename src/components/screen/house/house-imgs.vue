<template>
  <div class="house_imgs_root">
    <img
      class="close"
      src="@/assets/images/screen/close1.png"
      alt=""
      @click="onClose"
    />

    <div class="title">
      {{ house.assetsName }}
    </div>

    <template v-if="imgList.length">
      <img class="main_img" :src="imgList[currentImgIndex].filePath" alt="" />

      <div class="more">
        <div class="part" @click="onPreview()">
          <img src="@/assets/images/screen/more-2.png" alt="" />
        </div>
        <div class="imgs">
          <div
            v-for="(item, index) in showImgs"
            :key="index"
            class="preview"
            :class="{ active: item.imgIndex === currentImgIndex }"
          >
            <img :src="item.filePath" alt="" />
          </div>
        </div>
        <div class="part right" @click="onNext()">
          <img src="@/assets/images/screen/more-2.png" alt="" />
        </div>
      </div>
    </template>

    <template v-else>
      <section class="no_data">
        <img src="@/assets/images/screen/Nopicture.png" alt="" />
        <span>暂无数据</span>
      </section>
    </template>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import { fetchListFilesByKeyCode } from "@/api/screen/house";
import { cloneDeep } from "lodash";

export default {
  name: "HouseImgs",

  data() {
    return {
      imgList: [],
      house: {},
      currentImgIndex: 0,
    };
  },

  computed: {
    showImgs() {
      if (this.currentImgIndex < 3) {
        // 前三张
        const list = cloneDeep(this.imgList);
        return list.splice(0, 3);
      } else if (this.currentImgIndex > this.imgList.length - 3) {
        // 后三张
        const list = cloneDeep(this.imgList);
        return list.splice(this.imgList.length - 3, 3);
      } else {
        const list = cloneDeep(this.imgList);
        return list.splice(this.currentImgIndex - 2, 3);
      }
    },
  },

  mounted() {
    const self = this;
    this.house = JSON.parse(localStorage.getItem("currentHouse"));
    this.fetchListFilesByKeyCodeFun();

    bus.on("onMapItemClick", async (data) => {
      self.house = JSON.parse(localStorage.getItem("currentHouse"));
      self.fetchListFilesByKeyCodeFun();
    });
  },

  methods: {
    onClose () {
      bus.emit('onHouseImgsOperate', false)
    },

    onPreview() {
      if (this.currentImgIndex === 0) return;
      this.currentImgIndex -= 1;
    },

    onNext() {
      if (this.currentImgIndex === this.imgList.length - 1) return;
      this.currentImgIndex += 1;
    },

    async fetchListFilesByKeyCodeFun() {
      const { rows } = await fetchListFilesByKeyCode({
        keyCode: this.house.keyCode,
      });

      this.imgList =
        rows.map((item, index) => {
          return {
            ...item,
            imgIndex: index,
          };
        }) || [];
    },
  },
};
</script>

<style scoped lang="scss">
* {
  flex-shrink: 0;
}
.house_imgs_root {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: url("../../../assets/images/screen/window-1.png") no-repeat;
  background-size: 100% 100%;
  padding: 4px 25px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  .close {
    position: absolute;
    right: 8px;
    top: 10px;
    width: 24px;
    cursor: pointer;
  }

  .title {
    width: 100%;
    height: 51px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0px 1px 1px rgba(0, 11, 10, 0.43);
    text-align: center;
  }

  .main_img {
    width: 100%;
    height: 58%;
    margin-top: 16px;
  }

  .more {
    width: 100%;
    flex: 1 0;
    margin-top: 10px;
    display: flex;
    align-items: center;
    overflow: hidden;

    .part {
      width: 19px;
      height: 100%;
      background: rgba(57, 158, 233, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 7px 0 0;
      cursor: pointer;

      img {
        height: 17px;
      }
    }

    .right {
      margin: 0 0 0 7px;
      img {
        transform: rotate(180deg);
      }
    }

    .imgs {
      flex: 1 0;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow-x: scroll;

      &::-webkit-scrollbar {
        display: none;
      }

      .preview {
        width: 100px;
        height: 100%;
        margin-left: 9px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .active {
        border: 1px solid rgba(55, 130, 255, 1);
      }
    }

    .ml0 {
      margin-left: 0;
    }
  }

  .no_data {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    img {
      width: 30%;
      margin-right: 10%;
    }

    span {
      margin-top: 10px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
    }
  }
}
</style>
