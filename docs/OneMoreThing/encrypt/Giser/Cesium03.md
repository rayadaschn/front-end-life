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
