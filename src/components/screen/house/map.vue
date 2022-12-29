<template>
  <div class="map_root" id="map"></div>
</template>

<script>
import bus from "vue3-eventbus";
import { fetchVisualList } from "@/api/screen/house";
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
        if (this.marker) {
          this.marker.setIcon(
            new BMapGL.Icon("/images/position-2.png", new BMapGL.Size(67, 108))
          );
        }
        bus.emit("onTopbarClick", 1);
        localStorage.removeItem("currentHouse");
      });

      // this.map.setDisplayOptions({
      //   poiText: false,
      //   poiIcon: false
      // });

      bus.on("onSearchInputClick", (data) => {
        if (this.marker) {
          this.marker.setIcon(
            new BMapGL.Icon("/images/position-2.png", new BMapGL.Size(67, 108))
          );
        }

        const marker = this.markerList.find((item) => item.houseId === data.id);
        if (marker) {
          marker.setIcon(
            new BMapGL.Icon("/images/position-1.png", new BMapGL.Size(67, 108))
          );
        }

        self.map.centerAndZoom(
          new Bmap.Point(data.longitude, data.latitude),
          15
        );
      });

      bus.on("onDepartChange", (depart) => {
        this.markerList.forEach((item) => {
          item.setIcon(
            new BMapGL.Icon("/images/position-2.png", new BMapGL.Size(67, 108))
          );
        });
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

      const list = rows.filter((item) => item.longitude && item.latitude);
      useScreenStore().setHouseList(list);

      // 函数 创建多个标注
      this.map.clearOverlays();
      this.markerList = [];
      for (let i = 0; i < list.length; i++) {
        let points = new BMapGL.Point(list[i].longitude, list[i].latitude); //创建坐标点
        let icon = new BMapGL.Icon(
          "/images/position-2.png",
          new BMapGL.Size(67, 108)
        );
        let markers = new BMapGL.Marker(points, {
          icon,
        });

        markers.addEventListener("click", (e) => {
          if (this.marker) {
            this.marker.setIcon(
              new BMapGL.Icon(
                "/images/position-2.png",
                new BMapGL.Size(67, 108)
              )
            );
          }
          localStorage.setItem("currentHouse", JSON.stringify(list[i]));
          markers.setIcon(
            new BMapGL.Icon("/images/position-1.png", new BMapGL.Size(67, 108))
          );
          this.marker = markers;

          bus.emit("onMapItemClick", list[i]);
          bus.emit("onTopbarClick", 2);
          bus.emit("onHouseInfoOperate", true);
          bus.emit("onHouseImgsOperate", true);
          bus.emit("onHouseTableOperate", true);
          // bus.emit("onSearchInputClick", list[i]);
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
