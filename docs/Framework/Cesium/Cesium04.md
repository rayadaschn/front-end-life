---
title: Cesium 加载数据
icon: sitemap
date: 2024-06-02
category:
  - 框架
tag:
  - gis
sticky: false
---

在上一节，介绍了 cesium 的开发的基础知识，在本小节中将在前文的基础上进入到 cesium 应用的实际开发。

除了 Cesium 的单独令牌（token）外，本节还涉及到了天地图等地图数据的使用。因此也需要额外进行 token 申请。

## 使用地图服务

Cesium 默认使用微软的 Bing 影像图，通过调用 `imageryLayers.addImageryProvider` 函数来加载图层，当然图层数据也需要相应的 api 进行调用，如`WebMapTileServiceImageryProvider`，在下文会统一总结。

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  WebMapTileServiceImageryProvider,
  OpenStreetMapImageryProvider,
  Ion,
  Camera,
  Viewer,
  Rectangle,
} from 'cesium'
import 'cesium/Build/CesiumUnminified/Widgets/widgets.css'

import { CESIUM_TOKEN, TD_TOKEN } from '@/const'

const viewerDivRef = ref<HTMLDivElement>()

/** cesium Token */
Ion.defaultAccessToken = CESIUM_TOKEN

/** 默认矩形视角四轴的位置 */
Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
  89.5, // 西经
  20.4, // 南纬
  110.4, // 东经
  61.2 // 北纬
)

/** 天地图矢量路径图 */
const imageryProvider = new WebMapTileServiceImageryProvider({
  url: `http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${TD_TOKEN}`,
  layer: 'tdtBasicLayer',
  style: 'default',
  format: 'image/jpeg',
  tileMatrixSetID: 'GoogleMapsCompatible',
})

/** 天地图影像图 */
// const imageryProvider = new WebMapTileServiceImageryProvider({
//   url: `http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${TD_TOKEN}`,
//   layer: "tdtBasicLayer",
//   style: "default",
//   format: "image/jpeg",
//   tileMatrixSetID: "GoogleMapsCompatible",
// });

/** openstreetmap 矢量图: 需要科学上网 */
// const imageryProvider = new OpenStreetMapImageryProvider({
//   url: "https://a.tile.openstreetmap.org/",
// });

onMounted(() => {
  const viewer = new Viewer(viewerDivRef.value as HTMLElement, {
    animation: false,
    timeline: false,
    infoBox: false, // 信息提示框使用的 iframe 跨域报错
    geocoder: false, // 搜索框
    homeButton: false,
    sceneModePicker: false, // 控制查看起的显示模式
    baseLayerPicker: false, // 是否显示图层选择器
    navigationHelpButton: false, // 关闭帮助按钮
  })

  // 隐藏 logo
  const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement
  creditContainer.style.display = 'none'

  // 添加图层
  viewer.imageryLayers.addImageryProvider(imageryProvider)
})
</script>

<template>
  <div id="cesium-viewer" ref="viewerDivRef"></div>
</template>

<style scoped>
#cesium-viewer {
  width: 100%;
  height: 100%;
}
</style>
```

图层数据之间也可以相应的进行叠加，后添加的会覆盖前面的，通过设置地图的透明度 alpha 便可实现地图直接的融合。

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  WebMapTileServiceImageryProvider,
  OpenStreetMapImageryProvider,
  Ion,
  Camera,
  Viewer,
  Rectangle,
} from 'cesium'
import 'cesium/Build/CesiumUnminified/Widgets/widgets.css'

import { CESIUM_TOKEN, TD_TOKEN } from '@/const'

const viewerDivRef = ref<HTMLDivElement>()

/** cesium Token */
Ion.defaultAccessToken = CESIUM_TOKEN

/** 默认矩形视角四轴的位置 */
Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
  89.5, // 西经
  20.4, // 南纬
  110.4, // 东经
  61.2 // 北纬
)

/** 天地图矢量路径图 */
const imageryVectorProvider = new WebMapTileServiceImageryProvider({
  url: `http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${TD_TOKEN}`,
  layer: 'tdtBasicLayer',
  style: 'default',
  format: 'image/jpeg',
  tileMatrixSetID: 'GoogleMapsCompatible',
})

/** 天地图影像图 */
const imageryProvider = new WebMapTileServiceImageryProvider({
  url: `http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${TD_TOKEN}`,
  layer: 'tdtBasicLayer',
  style: 'default',
  format: 'image/jpeg',
  tileMatrixSetID: 'GoogleMapsCompatible',
})

onMounted(() => {
  const viewer = new Viewer(viewerDivRef.value as HTMLElement, {
    animation: false,
    timeline: false,
    infoBox: false, // 信息提示框使用的 iframe 跨域报错
    geocoder: false, // 搜索框
    homeButton: false,
    sceneModePicker: false, // 控制查看起的显示模式
    baseLayerPicker: false, // 是否显示图层选择器
    navigationHelpButton: false, // 关闭帮助按钮
  })

  // 隐藏 logo
  const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement
  creditContainer.style.display = 'none'

  // 添加图层
  viewer.imageryLayers.addImageryProvider(imageryVectorProvider)

  // 叠加图层
  const layer = viewer.imageryLayers.addImageryProvider(imageryProvider)
  layer.alpha = 0.5
})
</script>

<template>
  <div id="cesium-viewer" ref="viewerDivRef"></div>
</template>

<style scoped>
#cesium-viewer {
  width: 100%;
  height: 100%;
}
</style>
```

## 调用不同的影像服务

地图的服务格式有多种如 WMS、TMS 和 WMTS，它们都是地图服务提供者提供地图服务的不同格式。

- WMS（Web Map Service）：Web 地图服务，是一种基于 HTTP 的地图服务标准，它允许客户端通过 HTTP 请求获取地图数据。
- TMS（Tile Map Service）：切片地图服务，是一种将地图数据切分成多个切片（tile）的地图服务标准，它允许客户端通过 HTTP 请求获取切片地图数据。
- WMTS（Web Map Tile Service）：Web 地图瓦片服务，是一种将地图数据切分成多个瓦片（tile）的地图服务标准，它允许客户端通过 HTTP 请求获取瓦片地图数据。

不同的图层也有相应的调用接口，如 `ArcGisMapServerImageryProvider` 可用于加载 ArcGis Server 发布的数据服务。以下是 Cesium 支持的影像服务加载 APi：

1. `WebMapServiceImageryProvider`：网络地图服务（WMS）；
2. `TileMapServiceImageryProvider`：瓦片地图服务（TMS）；
3. `WebMapTileServiceImageryProvider`：网络地图瓦片服务（WMTS）；
4. `ArcGisMapServerImageryProvider`：ArcGis Server 发布的数据服务；
5. `GoogleEarthEnterpriseMapsProvider`：Google Earth Engine 发布的数据服务；
6. `GoogleStreetViewPanoramaProvider`：Google 街景图；
7. `MapboxStyleImageryProvider`：Mapbox 发布的数据服务；
8. `OpenStreeMapImageryProvider`: OpenStreetMap 发布的数据服务；
9. `SingleTileImageryProvider`：单张图片，加载一张全球图片作为地图底图，没有切片缩放效果；
10. `UrlTemplateImageryProvider`：自定义 URL 模板，连接到各种地图源；

## 加载空间数据

地理数据分为矢量数据和栅格数据。矢量数据就是可以无限放大，数据不会变形，可以自由编辑的点、线、面等数据。栅格数据就是一些像素点数据，只能放大一定倍数，数据会变形，不能自由编辑的图片、地形图等数据。俩者各有各自的好处。

其中栅格数据通常以影像图层的形式呈现，上节中的地形数据和影像数据就是栅格数据。所以会有图像等级。

而矢量数据拓展到三维空间数据就有：

1. 几何形体：点、线、面和体；
2. 三维模型；
3. 标签：文字标签和图标等。

几何形体的创建会涉及到 Primitive API 和 Entity API。这里暂不涉及介绍。

在二维 GIS 中，矢量数据有很多，常见的有 Shapefile（SHP）、DWG、KMZ/KML、GeoJSON 等。由于 Shapefile 文件结构复杂，会给网络传输带来压力，因此 Cesium 更多的是采用 GeoJSON 格式和 KML 格式。

### GeoJSON

GeoJSON 是一种基于 JSON 的地理空间数据格式，它支持多种几何形状（点、线、面和体）和属性（如名称、位置、面积等）。GeoJSON 文件可以被 Cesium 直接读取和使用。

GeoJSON 文件通常包含以下字段：

- type：表示几何形状的类型，可以是点（Point）、线（LineString）、面（Polygon）或体（MultiPolygon）。
- geometry：表示地理数据；
- coordinates：表示地理坐标的数组。

Cesium 设置 [GeoJsonDataSource API](https://cesium.com/learn/ion-sdk/ref-doc/GeoJsonDataSource.html?classFilter=GeoJsonDataSource) 来加载 GeoJSON 数据。

```js
const viewer = new Cesium.Viewer('cesiumContainer')
viewer.dataSources.add(
  Cesium.GeoJsonDataSource.load('../../SampleData/ne_10m_us_states.topojson', {
    stroke: Cesium.Color.HOTPINK,
    fill: Cesium.Color.PINK,
    strokeWidth: 3,
    clampToGround: true, // 是否贴着地形
  })
)
```

实际运用:

```ts
// 加载geojson数据
const dataGeo = GeoJsonDataSource.load(
  'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
  {
    stroke: Color.RED,
    fill: Color.SKYBLUE.withAlpha(0.5),
    strokeWidth: 4,
  }
)

dataGeo.then((dataSources) => {
  console.log('🚀 ~ dataGeo.then ~ dataSources:', dataSources)
  viewer.dataSources.add(dataSources)

  const entities = dataSources.entities.values
  entities.forEach((entity, i) => {
    entity.polygon!.material = new ColorMaterialProperty(
      Color.fromRandom({
        alpha: 1,
      })
    )
    entity.polygon!.outline = new ConstantProperty(false) // 不显示多边形的边界
    const randomNum = Math.floor(Math.random() * 5)
    entity.polygon!.extrudedHeight = new ConstantProperty(100000 * randomNum) // 拓展高度
  })
})
```

![GeoJSON](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202406021306415.png)

### KML

KML（Keyhole Markup Language）是一种基于 XML 的地理空间数据格式。用发与 GeoJSON 类似，但 KML 文件通常包含更多的元数据和标签。

Cesium 设置 [KMLDataSource API](https://cesium.com/learn/ion-sdk/ref-doc/KmlDataSource.html#KmlDataSource) 来加载 KML 数据。

```js
const viewer = new Cesium.Viewer('cesiumContainer')
viewer.dataSources.add(
  Cesium.KmlDataSource.load('../../SampleData/facilities.kmz', {
    camera: viewer.scene.camera,
    canvas: viewer.scene.canvas,
  })
)
```

### 建筑、标签和三维模型

建筑和标签的添加需要用到 Primitive 和 Entity。实际上影像数据中有二维的建筑样式，可以利用 `primitives` 自带生成三维建筑。

```js
const viewer = new Cesium.Viewer('cesiumContainer')

// 添加3D建筑, 注意这里也是异步渲染
const osmBuildings = viewer.scene.primitives.add(
  await createOsmBuildingsAsync() // 自带渲染
)
```

标签就是物体显示的名称，一般为文字标签：

```js
// 添加文字和广告牌
const label = viewer.entities.add({
  position: Cartesian3.fromDegrees(116.3904, 39.906, 20),
  label: {
    text: ' 天安门',
    font: '24px sans-serif',
    fillColor: Color.WHITE,
    outlineColor: Color.BLACK,
    outlineWidth: 4,
    // FILL填充文字，OUTLINE勾勒标签，FILL_AND_OUTLINE填充文字和勾勒标签
    style: LabelStyle.FILL_AND_OUTLINE,
    // 设置文字的偏移量
    pixelOffset: new Cartesian2(0, -24),
    // 设置文字的显示位置,LEFT /RIGHT /CENTER
    horizontalOrigin: HorizontalOrigin.CENTER,
    // 设置文字的显示位置
    verticalOrigin: VerticalOrigin.BOTTOM,
  },
})
```

![三维建筑和标签](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202406021300670.png)

三维模型同理：

```js
// 添加3D模型
const airplane = viewer.entities.add({
  name: 'Airplane',
  position: Cartesian3.fromDegrees(116.3904, 39.906, 1500),
  model: {
    uri: './model/Air.glb', // 静态文件加载
    // 设置飞机的最小像素
    minimumPixelSize: 128,
    // 设置飞机的轮廓
    silhouetteSize: 1,
    // 设置轮廓的颜色
    silhouetteColor: Color.WHITE,
    // 设置相机距离模型多远的距离显示
    distanceDisplayCondition: new DistanceDisplayCondition(0, 200000),
  },
})
```

![3D 模型](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202406021302546.png)
