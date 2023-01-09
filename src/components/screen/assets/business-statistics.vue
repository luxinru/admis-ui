<template>
  <div class="business_statistics_root">
    <Box title="本年业务统计">
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
import { fetchBusinessCount } from "@/api/screen/assets/index";

export default {
  name: "BusinessStatistics",

  components: {
    Box,
  },

  data() {
    return {
      list: [],
    };
  },

  mounted() {
    this.init();
  },

  methods: {
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
        background: url('@/assets/images/screen/Table-bj.png') no-repeat;
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
