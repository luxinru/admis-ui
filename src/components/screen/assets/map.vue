<template>
  <div class="map_root" id="map"></div>
</template>

<script>
import bus from "vue3-eventbus";
import { fetchAssetsList } from "@/api/screen/assets";
import useScreenStore from "@/store/modules/screen";

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
    await this.initMap();
    const depart = localStorage.getItem("currentDepart")
      ? JSON.parse(localStorage.getItem("currentDepart"))
      : "";

    if (depart) {
      this.fetchAssetsListFun(depart);
    }
  },

  beforeUnmount() {
    bus.off('onSearchInputClick')
    bus.off('onDepartChange')
  },

  methods: {
    initMap() {
      const self = this;
      const Bmap = window.BMapGL;
      this.map = new BMapGL.Map("map"); // 创建Map实例
      this.map.setMapType(BMAP_SATELLITE_MAP);
      this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      this.map.centerAndZoom("成都市", 13);

      // this.map.addEventListener("click", (e) => {
      //   if (e.overlay) return; // 存在覆盖物退出
      //   if (this.marker) {
      //     this.marker.setIcon(
      //       new BMapGL.Icon("/images/point.png", new BMapGL.Size(70 * 0.7, 97 * 0.7))
      //     );
      //   }
      //   bus.emit("onTopbarClick", 1);
      //   localStorage.removeItem("currentHouse");
      // });

      // this.map.setDisplayOptions({
      //   poiText: false,
      //   poiIcon: false
      // });

      bus.on("onSearchInputClick", (data) => {
        if (this.marker) {
          this.marker.setIcon(
            new BMapGL.Icon(
              "/images/point.png",
              new BMapGL.Size(70 * 0.7, 97 * 0.7)
            )
          );
        }

        const marker = this.markerList.find((item) => item.houseId === data.id);
        if (marker) {
          marker.setIcon(
            new BMapGL.Icon(
              "/images/position-1.png",
              new BMapGL.Size(70 * 0.7, 97 * 0.7)
            )
          );
        }

        self.map.centerAndZoom(
          new BMapGL.Point(data.longitude, data.latitude),
          15
        );
      });

      bus.on("onDepartChange", (depart) => {
        this.markerList.forEach((item) => {
          item.setIcon(
            new BMapGL.Icon(
              "/images/point.png",
              new BMapGL.Size(70 * 0.7, 97 * 0.7)
            )
          );
        });
        self.fetchAssetsListFun(depart);
      });
    },

    async fetchAssetsListFun(depart) {
      const { rows } = await fetchAssetsList({
        departCode: depart.departCode,
        // departCode: "226010006", // todo
        assetsType: localStorage.getItem('assetsType'),
      });

      const list = rows.filter((item) => item.longitude && item.latitude);
      // useScreenStore().setHouseList(list);

      // 函数 创建多个标注
      this.map.clearOverlays();
      this.markerList = [];
      for (let i = 0; i < list.length; i++) {
        let points = new BMapGL.Point(list[i].longitude, list[i].latitude); //创建坐标点
        let icon = new BMapGL.Icon(
          "/images/point.png",
          new BMapGL.Size(70 * 0.7, 97 * 0.7)
        );
        let markers = new BMapGL.Marker(points, {
          icon,
        });

        // markers.addEventListener("click", (e) => {
        //   if (this.marker) {
        //     this.marker.setIcon(
        //       new BMapGL.Icon(
        //         "/images/point.png",
        //         new BMapGL.Size(70 * 0.7, 97 * 0.7)
        //       )
        //     );
        //   }
        //   localStorage.setItem("currentHouse", JSON.stringify(list[i]));
        //   markers.setIcon(
        //     new BMapGL.Icon("/images/position-1.png", new BMapGL.Size(70 * 0.7, 97 * 0.7))
        //   );
        //   this.marker = markers;

        //   bus.emit("onMapItemClick", list[i]);
        //   bus.emit("onTopbarClick", 2);
        //   bus.emit("onHouseInfoOperate", true);
        //   bus.emit("onHouseImgsOperate", true);
        //   // bus.emit("onSearchInputClick", list[i]);

        //   this.map.centerAndZoom(
        //     new BMapGL.Point(list[i].longitude, list[i].latitude),
        //     15
        //   );
        // });

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
