<template>
  <div class="map_root" id="map"></div>
</template>

<script>
import bus from "vue3-eventbus";
import { fetchVisualList } from "@/api/screen/house";
import useScreenStore from "@/store/modules/screen";

/**
 * 地图组件
 */
export default {
  name: "Map",

  data() {
    return {
      map: {},
      marker: undefined,
      markerList: [],
    };
  },

  async mounted() {
    bus.on("onSearchInput", (value) => {
      /**
       * 更改打点颜色 以替换图片的方式实现
       */
      if (value === '' && this.marker) {
        this.marker.setIcon(
          new BMapGL.Icon(
            "/images/position-2.png",
            new BMapGL.Size(67 - 67 / 3, 72)
          )
        );
        bus.emit("onTopbarClick", 1); // 放回首页
        localStorage.removeItem("currentHouse");
      }
    });

    /**
     * 先渲染地图 等待接口返回单位列表再渲染打点数据
     */
    await this.initMap();
    const depart = localStorage.getItem("currentDepart")
      ? JSON.parse(localStorage.getItem("currentDepart"))
      : "";

    if (depart) {
      this.fetchVisualListFun(depart);
    }
  },

  methods: {
    initMap() {
      const self = this;
      const Bmap = window.BMapGL;
      this.map = new BMapGL.Map("map"); // 创建Map实例
      this.map.setMapType(BMAP_SATELLITE_MAP);
      this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      this.map.centerAndZoom("成都市", 13);

      this.map.addEventListener("click", (e) => {
        if (e.overlay) return; // 存在覆盖物退出
        /**
         * 更改打点颜色 以替换图片的方式实现
         */
        if (this.marker) {
          this.marker.setIcon(
            new BMapGL.Icon(
              "/images/position-2.png",
              new BMapGL.Size(67 - 67 / 3, 72)
            )
          );
        }
        bus.emit("onTopbarClick", 1); // 放回首页
        localStorage.removeItem("currentHouse");
      });

      // this.map.setDisplayOptions({
      //   poiText: false,
      //   poiIcon: false
      // });

      bus.on("onSearchInputClick", (data) => {
        /**
         * 更改打点颜色 以替换图片的方式实现
         */
        if (this.marker) {
          this.marker.setIcon(
            new BMapGL.Icon(
              "/images/position-2.png",
              new BMapGL.Size(67 - 67 / 3, 72)
            )
          );
        }

        /**
         * 将原来已经点亮的打点恢复
         */
        const marker = this.markerList.find((item) => item.houseId === data.id);
        if (marker) {
          marker.setIcon(
            new BMapGL.Icon(
              "/images/position-1.png",
              new BMapGL.Size(67 - 67 / 3, 72)
            )
          );
        }

        /**
         * 地图中心设置为检索点击的单位
         */
        self.map.centerAndZoom(
          new BMapGL.Point(data.longitude, data.latitude),
          15
        );
      });

      bus.on("onDepartChange", (depart) => {
        /**
         * 更改单位时触发
         * 将所有的点亮点位恢复
         */
        this.markerList.forEach((item) => {
          item.setIcon(
            new BMapGL.Icon(
              "/images/position-2.png",
              new BMapGL.Size(67 - 67 / 3, 72)
            )
          );
        });
        /**
         * 根据单位code获取地图点位信息
         */
        self.fetchVisualListFun(depart);
      });
    },

    async fetchVisualListFun(depart) {
      const { rows } = await fetchVisualList({
        houseName: "",
        houseCode: "",
        departCode: depart.departCode,
        // departCode: "226010006", // todo
        assetsCode: "",
      });

      const list = rows.filter((item) => item.longitude && item.latitude); // 筛选不含有经纬度的数据
      useScreenStore().setHouseList(list);

      // 函数 创建多个标注
      this.map.clearOverlays();
      this.markerList = [];
      for (let i = 0; i < list.length; i++) {
        let points = new BMapGL.Point(list[i].longitude, list[i].latitude); //创建坐标点
        let icon = new BMapGL.Icon(
          "/images/position-2.png",
          new BMapGL.Size(67 - 67 / 3, 72)
        );
        let markers = new BMapGL.Marker(points, {
          icon,
        });

        markers.addEventListener("click", (e) => {
          /**
           * 地图点位信息添加点击事件
           */
          if (this.marker) {
            this.marker.setIcon(
              new BMapGL.Icon(
                "/images/position-2.png",
                new BMapGL.Size(67 - 67 / 3, 72)
              )
            );
          }
          localStorage.setItem("currentHouse", JSON.stringify(list[i]));
          markers.setIcon(
            new BMapGL.Icon(
              "/images/position-1.png",
              new BMapGL.Size(67 - 67 / 3, 72)
            )
          );
          this.marker = markers;

          bus.emit("onMapItemClick", list[i]); // 像各个子组件传达点击点位信息事件
          bus.emit("onTopbarClick", 2); // 页面更换为副业
          bus.emit("onHouseInfoOperate", true); // 打开房屋信息弹窗
          bus.emit("onHouseImgsOperate", true); // 打开房屋图片信息弹窗
          // bus.emit("onSearchInputClick", list[i]);

          this.map.centerAndZoom(
            new BMapGL.Point(list[i].longitude, list[i].latitude),
            15
          );
        });

        markers.houseId = list[i].id;

        this.map.addOverlay(markers);
        this.markerList.push(markers);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.map_root {
  width: 100%;
  height: 100%;
}
</style>
