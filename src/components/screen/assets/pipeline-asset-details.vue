<template>
  <div class="pipeline_asset_details_root">
    <Box title="管道资产明细">
      <div class="container">
        <div class="tabs">
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

        <section class="table_container">
          <table border="1" style="z-index: 3">
            <thead>
              <tr>
                <th>资产编码</th>
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
              <tr class="td" v-for="item in list" :key="item.keyCode">
                <td>{{ item.assetsCode || '-' }}</td>
                <td>{{ item.assetsName || '-' }}</td>
                <td>{{ item.assetsTypeName || '-' }}</td>
                <td>{{ item.addVoucherDate || '-' }}</td>
                <td>{{ item.originalValue || '-' }}</td>
                <td>{{ item.nowValue || '-' }}</td>
                <td>{{ item.addDepreciate || '-' }}</td>
                <td>{{ item.devalueValue || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </Box>
  </div>
</template>

<script>
import bus from "vue3-eventbus";
import Box from "../house/box.vue";
import { fetchAssetsList } from "@/api/screen/assets/index";

export default {
  name: "PipelineAssetDetails",

  components: {
    Box,
  },

  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 20,
      },
      total: 0,
      list: [],
    };
  },

  mounted() {
    this.init();

    bus.on("onDepartChange", (depart) => {
      this.init();
    });
  },

  methods: {
    async init() {
      const depart = JSON.parse(localStorage.getItem("currentDepart") || {});

      const { rows, total } = await fetchAssetsList({
        departCode: depart.departCode,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize
      });
      this.list = rows || [];
      this.total = total

      console.log("rows :>> ", rows);
    },

    onCurrentChange(value) {
      this.page.pageNum = value;
    },
  },
};
</script>

<style lang="scss">
.pipeline_asset_details_root {
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
.pipeline_asset_details_root {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 24px 0;
    box-sizing: border-box;
    margin-top: -16px;

    .tabs {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: -25px;
      .paging {
        display: flex;
        align-items: center;
      }
    }

    .table_container {
      width: 100%;
      flex: 1 0;
      overflow: auto;
      margin-top: 5px;
      table {
        width: max-content;
        height: max-content;
        min-width: 100%;
        min-height: 100%;
        border: 1px solid rgba(57, 158, 233, 0.2);
        border-collapse: collapse;
        display: flex;
        flex-direction: column;
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
          background-color: #153456;
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
    }
  }
}
</style>
