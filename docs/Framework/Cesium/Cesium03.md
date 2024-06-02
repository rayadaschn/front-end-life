---
title: Cesium 快速入门
icon: sitemap
date: 2024-06-01
category:
  - 框架
tag:
  - gis
sticky: false
---

在上一节，介绍了 cesium 的开发环境配置，在本小节中将在前文的基础上开发第一个 cesium 应用。

在开发之前，建议开发者自行申请一个单独令牌（token），便于调用默认的 Bing 地图。申请方式在 cesium [官网](https://cesium.com/)。

::: tip

若开发过程中不展现三维地图，或者控制台报错找不到 API key 或 Invalid access token 等，都是因为令牌 token 未配置好的缘故。

本项目中的 token 文件未被 git 追踪，请自行申请。

:::

![Token 过期](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202406011540244.png)

## 开发第一个 cesium 应用

首先在页面定义一个铺满整个屏幕的 div 元素，并设置其 id 为 `cesiumContainer`，在 vue 中要获取到该元素则需要额外挂载 `ref`。

```vue
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

再创建一个 Cesium 实例，挂载到 `ref` 定义的 div 元素上。便可以在页面中看到一个三维地球了。值得注意的是，在 vue 中，Cesium 实例的挂载要在 `onMounted` 生命周期函数中进行（created 时，元素还未创建，无法挂载）。

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Ion, Viewer } from 'cesium'
import 'cesium/Build/CesiumUnminified/Widgets/widgets.css'
import { CESIUM_TOKEN } from '@/const'

const viewerDivRef = ref<HTMLDivElement>()

/** cesium Token */
Ion.defaultAccessToken = CESIUM_TOKEN

onMounted(() => {
  const viewer = new Viewer(viewerDivRef.value as HTMLElement)
  console.log('🚀 ~ onMounted ~ viewer:', viewer)
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

![初始 Cesium 应用](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202406011555945.png)

## 开发基础

本节将迅速过一遍 Cesium 开发的基础知识，以便开发者能够快速上手。

### Cesium 核心类

1. Viewer：三维地球的容器，是 Cesium 应用的核心类。
2. Scene：场景，是三维地球的容器，包含相机、光源、渲染器等。
3. Entity：实体，是三维场景中的一个对象，可以添加到场景中。
4. Primitive：原始图形，是三维场景中的一个对象，可以添加到场景中。
5. DataSourceCollection：数据源集合，用于管理数据源。

#### Viewer

Viewer 类是 Cesium 应用的核心类，它负责创建和维护 Cesium 场景。

```js
const viewer = new Cesium.Viewer('cesiumContainer', Options)
```

创建语法为，传入一个 Cesium 地图主窗口的 div 的 ID，在 vue 中，需要传入 `ref` 定义的 div 的 ID。

而常用的 Options 选项为：

```js
const viewer = new Cesium.Viewer('cesiumContainer', {
  animation: true, // 是否显示动画控件
  baseLayerPicker: true, // 是否显示图层选择控件
  fullscreenButton: true, // 是否显示全屏按钮
  geocoder: true, // 是否显示 Geo(右上角查询按钮)
  homeButton: true, // 是否显示home按钮
  infoBox: true, // 是否显示信息框
  sceneModePicker: true, // 是否显示场景控制面板(三维/二维切换按钮)
  selectionIndicator: true, // 是否显示图层选择控件(鼠标点击显示绿框)
  navigationHelpButton: true, // 是否显示帮助信息控件
  timeline: true, // 是否显示时间线控件
  navigationInstructionsInitiallyVisible: true, // 是否显示导航说明控件
  scene3DOnly: true, // 是否只显示三维地图
  shouldAnimate: true, // 是否自动播放动画
  shadows: true, // 是否显示光照投射的阴影
  clock: new Cesium.Clock(), // 场景的时钟
  // 设置底层地图服务, 仅在 baseLayerPicker 设置为 false 时生效
  imageryProvider: new Cesium.UrlTemplateImageryProvider({
    url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
  }),
})
```

#### Scene

Scene 类是 Cesium 场景配置的容器，包含相机、光源、渲染器等。详细配置在后续展开。

```js
const viewer = new Cesium.Viewer('cesiumContainer', {
  sceneModePicker: false,
})
const scene = viewer.scene
```

#### Entity

Entity 类是 Cesium 场景中的一个对象，可以添加到场景中。它是由 Primitive 类派生出来的，可以添加到场景中的对象，比如点、线、面等。

```js
const viewer = new Cesium.Viewer('cesiumContainer', {
  sceneModePicker: false,
})
const scene = viewer.scene
const entity = new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(116.40332, 39.90498, 100000),
  point: {
    pixelSize: 10,
    color: Cesium.Color.RED,
  },
})
scene.primitives.add(entity)
```

#### Primitive

Primitive 类是 Cesium 场景中的一个对象，可以添加到场景中。后续详细介绍。

#### DataSourceCollection

DataSourceCollection 是 Cesium 中加载矢量数据的主要方式之一，最大特点是支持加载矢量数据集与外部文件的调用，主要分为 CzmlDataSource 和 GeoJsonDataSource 和 KmlDataSource 三种，分别对应 CZML、GeoJSON、KML 三种格式。

### Cesium 坐标系系统

Cesium 坐标系系统分共有三种：屏幕坐标系、笛卡尔空间坐标系和地理坐标系。

1. 屏幕坐标系：屏幕坐标系是二维笛卡尔坐标系以屏幕左上角为原点的坐标系，x 轴向右，y 轴向下。
2. 笛卡尔空间坐标系：笛卡尔坐标系是以三维空间中的原点为原点的坐标系，x 轴向垂直屏幕，y 轴向右，z 轴向上。
   ![笛卡尔空间坐标系](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202406012315509.png)
3. 地理坐标系：地理坐标系一般是指由经度(longitude)、纬度(latitude)和相对高度组成的坐标系，能够标示地球上的任何一个位置。在测绘领域常用的就是 GPS 的 WGS84 坐标系，其坐标原点为地球中心，x 轴指向赤道，y 轴指向东经，z 轴垂直地球表面。
   ![地理坐标系](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202406012320066.png)

在开发中，需要掌握的就是它们之间的转换关系。

1. 角度和弧度之间的转换。
   **弧度**定义是圆弧长度等于半径时的圆心角。以度数表示的角，把数字乘以 `𝜋/180` 便转换成弧度；以弧度表示的角，乘以 `180/𝜋` 便转换成度数。

   ![弧度](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202406012328743.png)

   角度转弧度在 Cesium 中的实现为：

   ```js
   const radians = Cesium.Math.toRadians(degrees)
   ```

   弧度转角度在 Cesium 中的实现为：

   ```js
   const degrees = Cesium.Math.toDegrees(radians)
   ```

2. 经纬度和笛卡尔空间坐标之间的转换。

   2.1 直接通过经纬度进行转化，Cesium 默认 WGS-84 经纬度坐标，可直接使用。

   ```js
   const cartesian = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
   ```

   2.2 通过椭球体进行转化。通过其他空间坐标系转换为笛卡尔空间坐标系。

   ```js
   const ellipsoid = Cesium.Ellipsoid.WGS84
   const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
   const cartographic = ellipsoid.cartesianToCartographic(position) // 经纬度坐标系
   const cartesian = ellipsoid.cartographicToCartesian(cartographic) // 笛卡尔空间坐标系
   ```

3. 屏幕坐标和笛卡尔空间坐标系之间转换。

   通常二维是转换不了三维的，想象一下视线从屏幕上经过一个三维物体，屏幕上显示的只有二维的投影。实际上就是获取三维投影的二维坐标，该点可确定唯一。

   3.1 屏幕坐标系转场景空间直角坐标系，这里的场景包含了地形、倾斜摄影测量模型等其他三维模型的坐标。

   ```js
   const ray = viewer.camera.getPickRay(windowPosition) // 屏幕坐标系
   const cartesian = viewer.scene.globe.pick(ray, viewer.scene) // 场景空间直角坐标系
   ```

   3.2 屏幕坐标系转椭球面笛卡尔空间坐标

   ```js
   const canvas = viewer.scene.canvas
   const center = new Cesium.Cartesian2(
     canvas.clientWidth / 2.0,
     canvas.clientHeight / 2.0
   )
   const ellipsoid = viewer.scene.globe.ellipsoid
   const result = viewer.camera.pickEllipsoid(center, ellipsoid)
   ```

### Cesium 相机系统

首先明确 cesium 中相机方向 orientation 设定原理和右手笛卡尔坐标系含义相似。如下图所示，将右手的中指指向自己，即为 cesium 中的相机坐标系。

1. y 轴（heading）：朝上，默认正北。旋转的正角度同地球自转，自西向东，由**偏航角**。简单理解就是站立的人左右旋转角度。
2. x 轴（pitch）：朝右，默认正东。旋转角度像一张平铺的纸，默认旋转角度为 `-90`，即朝向地面。旋转起来像人俯视向下，或仰视抬头，所以又叫**俯仰角**。
3. z 轴（roll）：朝自己。默认旋转角度为 0，正角度向右旋转，像一个人左右侧空翻，所以又叫**翻滚角**。

![左手坐标系和右手坐标系](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202406020037386.png)

以上三项构成了相机视角的方向:

```js
const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
viewer.camera.setView({
  destination: position, // 相机目的地
  orientation: {
    heading: Cesium.Math.toRadians(0), // 偏航角
    pitch: Cesium.Math.toRadians(-90), // 俯仰角
    roll: 0, // 翻滚角
  },
})
```

> 记忆技巧:
> 可以拿拳头 👊🏻 代表一架飞机，这三个单词都与飞行动力学相关。
> heading 是航向的意思，即飞机的左右飞行方向，表示偏航角，也就是拳头朝左朝右；
> pitch 是抛、投的意思，想象一下投铅球的样子，向上抛或者向下抛，所以表示俯仰角，也就是拳头朝上朝下；
> roll 是滚动的意思，拳头左右转动，就是表示飞机在空中翻滚了。
> 由这三个就能得到 720 度的视角了。

**操作相机的方法:**

Camera 类提供了一系列方法来控制相机，包括：

- `setView`：设置相机位置和方向，但没有视角域飞行的过程。。
- `viewBoundingSphere`：同 `setView` 一样都是视角域切换到目标点，没有视角域飞行的过程。同名称一致是一个外接圆，适用于相机固定，视角绕定点 360 度定点环游。
- `flyTo`：相机视角域切换到目标点，并视角域飞行到目标点。
- `lookAt`：设置相机位置和方向，并使其朝向指定位置。
- `zoomIn`：相机朝向当前位置，并放大。
- `zoomOut`：相机朝向当前位置，并缩小。
- `rotateLeft`：相机朝向当前位置，并左转。
- `rotateRight`：相机朝向当前位置，并右转。
- `rotateUp`：相机朝向当前位置，并向上旋转。
- `rotateDown`：相机朝向当前位置，并向下旋转。

由于文档经常更新，具体用法可参见 cesium 的[官方文档的 Camera 部分](https://cesium.com/learn/cesiumjs/ref-doc/Camera.html)，此处暂不做解释，待日后补充。

### 相关数据

Cesium 支持的数据很多，大致分为俩类：

1. 地形数据和影像数据。地形数据相当于骨架，将轮廓撑开来了，而影像数据就是外衣，给骨架“化妆”同一座山，它可以是雪山 🏔 也可以是草地 🌳。地形数据一般是不变的，而影像地图是可变的。
2. 模型数据。除了上述俩种和地球本身相关的数据，其它都可以统称为模型数据。模型数据可以理解为一个三维的模型，可以用来表示建筑、树木、车辆等。

关于数据的加载，放在下一小节进行。
