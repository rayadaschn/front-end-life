---
title: OpenLayers 安装
icon: sitemap
date: 2024-03-15
category:
  - 框架
tag:
  - gis
sticky: false
---

在这一节里，参照 OpenLayers 官网创建一个项目。

## 快速安装

1. 环境配置： node >= 14，个人目前用的是最新的稳定版本 node@20。下载地址: [传送门 🚪node](https://nodejs.org/en)

2. 官方提供了一个脚手架, 可以快速安装项目:

   ```bash
   $: npm create ol-app my-app
   $: cd my-app
   $: npm start
   ```

3. 或者可以采用笔者所搭建的项目模板: [传送门 🚪](https://github.com/rayadaschn/learning_OpenLayers)

## 踩坑点

1. 同 Cesium 一样, OpenLayers 的 Map 挂在需要在 Vue 的 onMounted 生命周期内。
2. 挂载的节点, 需要手动设置 CSS 宽高, 否则无法自动扩张大小。

```vue
<template>
  <div id="map"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

onMounted(() => {
  const map = new Map({
    target: 'map', // 地图容器挂载 id
    layers: [
      new TileLayer({
        source: new OSM(), // 地图瓦片数据源
      }),
    ],
    view: new View({
      center: [0, 0], // 地图初始点
      zoom: 2, // 地图初始缩放级别
    }),
  })
})
</script>

<style scoped>
@import 'ol/ol.css';

#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
```

Map 类中的 target 属性, 需要设置为挂载的节点 id。所以需要先创建这个挂在节点, 再创建 Map 实例。
