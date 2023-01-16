<template>
  <div class="business_statistics_root">
    <Box title="本年业务统计">
      <template v-slot:more>
        <div
          class="select"
          v-click-out-side="onClickOutside2"
          @click="isShow2 = !isShow2"
        >
          <span :title="currentType2.label"> {{ currentType2.label }} </span>
          <img src="@/assets/images/screen/more-1.png" alt="" />

          <div class="content" v-if="isShow2">
            <span
              class="content_item"
              :class="{
                content_item_active: currentType2.value === item.value,
              }"
              v-for="(item, index) in options2"
              :key="index"
              @click="onOptionsClick2(item)"
            >
              {{ item.label }}
            </span>
          </div>
        </div>
      </template>
      <div class="container">
        <div class="imgs">
          <img src="@/assets/images/screen/container.png" alt="" />
          <img src="@/assets/images/screen/RubiksCube.png" alt="" />
        </div>

        <div class="table">
          <div class="title">
            <span>排名</span>
            <span>业务名称</span>
            <span>业务金额</span>
          </div>

          <div class="list">
            <div class="item" v-for="(item, index) in list" :key="index">
              <span>
                <img
                  v-if="index + 1 === 1"
                  src="@/assets/images/screen/No1.png"
                  alt=""
                />
                <img
                  v-if="index + 1 === 2"
                  src="@/assets/images/screen/No2.png"
                  alt=""
                />
                <img
                  v-if="index + 1 === 3"
                  src="@/assets/images/screen/No3.png"
                  alt=""
                />
                <p v-if="[1, 2, 3].indexOf(index + 1) === -1">
                  {{ index + 1 }}
                </p>
              </span>
              <span>
                {{ item.groupName }}
              </span>
              <span>
                {{ item.groupValue }}
                <img v-if="item.trend === 0" src="" alt="" />
                <img v-else src="" alt="" />

                <p
                  :style="{
                    color:
                      item.trend === 0
                        ? 'rgba(147, 243, 137, 1)'
                        : 'rgba(255, 0, 0, 1)',
                  }"
                >
                  {{ item.trend === 0 ? "↑" : "↓" }}
                </p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";
import clickOutSide from "@mahdikhashan/vue3-click-outside";
import { fetchBusinessCount } from "@/api/screen/assets/index";

export default {
  name: "BusinessStatistics",

  components: {
    Box,
  },

  directives: {
    clickOutSide,
  },

  data() {
    return {
      list: [],
      isShow2: false,
      currentType2: {
        label: "热点业务榜",
        value: 0,
      },
      options2: [
        {
          label: "热点业务榜",
          value: 0,
        },
        {
          label: "热点单位",
          value: 1,
        },
      ],
    };
  },

  mounted() {
    this.init();

    bus.on("onDepartChange", (depart) => {
      this.init();
    });
  },

  methods: {
    onOptionsClick2(data) {
      this.currentType2 = data;
      this.isShow2 = false;
      this.init();
    },

    onClickOutside2() {
      this.isShow2 = false;
    },
    
    async init() {
      const depart = JSON.parse(localStorage.getItem("currentDepart") || {});
      const { data } = await fetchBusinessCount({
        departCode: depart.departCode,
        dimension: 0,
        normType: 0,
      });
      this.list = data || [];
    },
  },
};
</script>

<style scoped lang="scss">
.business_statistics_root {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .select {
    position: relative;
    flex: 1 0;
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
      margin: 2px 0 0 0;
    }

    span {
      width: 100px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #bdd7e7;
      margin-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: right;
    }

    .content {
      position: absolute;
      height: max-content;
      max-height: 165px;
      top: 40px;
      right: 0;
      display: flex;
      flex-direction: column;
      background: rgba(7, 37, 84, 0.9);
      border: 1px solid rgba(10, 71, 167, 0.9);
      border-radius: 3px;
      z-index: 1;
      overflow-y: auto;

      .content_item {
        width: 163px;
        height: 32px;
        font-size: 15px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
        border-bottom: 1px solid rgba(55, 130, 255, 0.2);
        padding: 0 10px;
        box-sizing: border-box;
        margin-left: 0;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

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
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    padding: 11px 11px 27px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .imgs {
      width: 129px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        position: absolute;

        &:first-child {
          margin-top: 20%;
        }

        &:last-child {
          margin-bottom: 20%;
          animation: animation1 5s linear infinite;
        }
      }

      @keyframes animation1 {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    }

    .table {
      flex: 1 0;
      height: 100%;
      margin-left: 11px;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .title {
        width: 100%;
        height: 32px;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        background: url("@/assets/images/screen/Table-bj.png") no-repeat;
        background-size: 100% 100%;

        span {
          flex: 1 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          font-style: italic;
          color: #ffffff;
        }
      }

      .list {
        flex: 1 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;

        .item {
          width: 100%;
          height: 35px;
          display: flex;
          align-items: center;
          background-color: rgba(4, 43, 109, 0.25);
          flex-shrink: 0;

          &:nth-child(2n) {
            background-color: rgba(4, 43, 109, 0.55);
          }

          img {
            height: 17px;
          }

          span {
            flex: 1 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #ffffff;

            &:nth-child(1) {
              font-size: 18px;
              font-family: Impact;
              font-weight: 400;
              font-style: italic;
              color: #ffffff;
            }

            &:nth-child(3) {
              font-size: 16px;
              font-family: Alibaba PuHuiTi;
              font-weight: 400;
              color: #00f0ff;

              img {
                width: 5px;
                height: 15px;
                margin-left: 5px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
