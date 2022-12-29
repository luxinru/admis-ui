<template>
  <div class="contain">
    <div class="top">
      <div>
        <p>统计单位：川中油气矿</p>
        <div class="dflex_b_c">
          <p>房屋总量统计</p>
          <p>房屋面积统计</p>
        </div>
      </div>
      <div class="title">房屋可视化管理平台</div>
      <div class="textright">
        <p>{{data.date}}</p>
        <p>出租信息</p>
      </div>
    </div>
    <div class="top_nav dflex_b_c ">
      <div  class="dflex_b_c"> 
        <p><h4>45</h4>幢</p> 
        <p><h4>98.23</h4>万 / M</p>
      </div>
      <div class="dflex_b_c"> 
        <p>原值<span>45</span>万元</p> 
        <p>净值<span>5603.06</span>万元</p> 
        <p>累计折旧<span>4235.67</span>万元</p>
      </div>
      <div class="dflex_b_c"> 
        <p>出租总数<span>45</span>万元</p> 
        <p>同比增长<span>5603.06</span>%</p>
      </div>
    </div>
    <div id="allmap"></div>
    <div class="box" id="content"><img :src="`src/assets/images/${data.img}.png`" alt=""></div>
    <div class="bottom dflex_b_c">
<div class="b-box">

</div>
<div class="b-box">

</div>
<div class="b-box">

</div>
<div class="b-box">

</div>
    </div>
  </div>

</template>
 
<script  setup>
import { nextTick, onMounted, reactive } from "vue";
const data = reactive({
  img: '1',
  date: new Date(),
})
onMounted(() => {
  nextTick(() => {
    setTimeout(() => { initMap(); }, 1000)

  });
});

const initMap = () => {
  var Bmap = window.BMap;
  var map = new BMap.Map("allmap");    // 创建Map实例  
  map.setMapType(BMAP_HYBRID_MAP);
  map.setCurrentCity("成都");          // 设置地图显示的城市 此项是必须设置的
  map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
  map.enableDragging();//启用地图拖拽事件，默认启用(可不写) 
  map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写) 
  map.enableKeyboard();//启用键盘上下左右键移动地图
  map.centerAndZoom(new Bmap.Point(104.04263635868074, 30.556100647961866), 11);
  var mapPoints = [
    { x: 30.556100647961866, y: 104.04263635868074 },
    { x: 30.686100237962366, y: 104.0826363586234 },
    { x: 30.486100237962366, y: 104.0326363586234 },
    { x: 30.386100237962366, y: 104.0726363586234 },
    { x: 30.286100237962366, y: 104.0626363586234 },
  ];
  var i = 0;
  // 函数 创建多个标注 
  for (; i < mapPoints.length; i++) {
    var points = new BMap.Point(mapPoints[i].y, mapPoints[i].x);//创建坐标点
    var markers = new BMap.Marker(points);
    map.addOverlay(markers);
    let opts = {
      width: 60,     // 信息窗口宽度
      height: 30,     // 信息窗口高度
      title: i == 0 ? "成都站" : i == 1 ? "南湖湿地" : "haha", // 信息窗口标题
      message: ""
    };
    let content = `<div style="text-align: center;width:100px;height:30px; ">
              </div>`;
    addClickHandler(content, markers, points, map, opts, i);

  }
}
const addClickHandler = (content, markers, points, map, opts, i) => {
  markers.addEventListener('click', () => {

    let infoWindow = new BMap.InfoWindow(content, opts);
    map.openInfoWindow(infoWindow, points); // 开启信息窗口 
    data.img = ++i
    document.getElementById('content').style.display = 'block';
  });
}



</script>
<style  scoped   >
.contain {
  width: 100%;
  height: 100vh;
  background-color: #041F4D;
  color: #6EE7EF;
}

.textright {
  text-align: right;
}

.dflex_b_c {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  width: 30%; 
  color: #00ABF6;
  text-align: center;
  font-size: 28px;
  line-height:80px;
  border-bottom: 4px solid #5FF1F8;
}

.top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

}

.top p {
  font-size: 12px;
  margin: 10px 20px;
}
.top_nav{
  height:8%;
}
.top_nav p{   
  margin: 10px 20px;
}
.top_nav span{  
  color: #3FF70F;
  margin: 10px 20px;
}
.top_nav h4{ 
  font-size:26px;
  color: #3FF70F;
  margin: 10px 20px;
}

#allmap {
  width: calc(100% - 80px);
  height: 50%;
  margin: auto;
  border: 2px solid #0ac;
}

.box {
  width: 300px;
  height:30%;
  position: absolute;
  top: 200px;
  left: 60px;
  display: none;

}

.box img {
  width: 300px;
  height: 220px;
}
.b-box{
 width: 22%;
 margin: 1%;
 height: 180px;
 border: 1px solid #00ABF6;
}

/* /deep/.BMap_pop div  { 
    background-color: pink !important;
    } 
    /deep/.BMap_pop img   {  display: none;
    } 
    .BMap_bottom {  display: none;
    }  */
</style>