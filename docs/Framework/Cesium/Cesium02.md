---
title: Cesium 开发环境配置
icon: sitemap
date: 2024-05-30
category:
  - 框架
tag:
  - gis
sticky: false
---

## 背景介绍

Cesium 是一个跨平台、跨浏览器的展示三维地球和地图的开源 Javascript 库。Cesium 不需要任何插件支持，但是浏览器必须支持 WebGL 才能运行 Cesium。

主要功能：

1. 使用 3D Tile 格式可加载大规模的多样化三维数据，如倾斜摄影数据、三维建筑物模型、CAD 软件文件等。
2. 支持全球级别高精度三维地形和图层服务，包含地形（terrain）、网络地图瓦片服务（WMTS）、瓦片地图服务（TMS）及网络地图服务（WMS）等图层服务。
3. 定义 CZML 数据格式，支持大场景时序动态数据的三维可视化，并具备粒子系统，能够模拟各种自然或人为事件，如雨雪天气等。

### 开发环境

这是第一个大坑，这对于前端工程化还是有一定的要求的。若是不愿意折腾可以直接用笔者的配置。

环境：`node v20.9.0`
框架: `Vue3` + `TS` + `Vite`

Github 代码: [传送门 🚪](https://github.com/rayadaschn/learning_cesium/tree/dev)

### 为什么开发环境如此复杂?

以[官网](https://cesium.com/downloads)的下载为例。

![Cesium](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202405292255896.png)

Cesium 的开发包解压后主要的文件夹如下:

1. Apps 文件夹: 包含一个最简单的 HelloWorld 官方实例。
2. Build 文件夹: 包含 Cesium 的开发资源包及其相关依赖文件的集合，是**最主要的开发文件包**。
3. packages 文件夹: 包含的 engine 和 widgets 两个子文件夹，主要是为了模块化使用，其中 engine 这个文件夹通常包含 Cesium 的核心引擎代码，它是构建整个 Cesium 应用程序的基础。它提供了渲染 3D 场景、处理用户交互、加载和显示地形数据、管理地图图层、处理空间查询等功能。widgets 文件夹包含的是 Cesium 提供的一组可重用的 UI 组件，这些组件可以被集成到 Cesium 应用程序中，以提供常见的功能，如地图控件（缩放、平移、旋转）、图层管理器、地理信息标注等。
4. Source 文件夹: 包含 Cesium 自带应用程序代码和数据。
5. Specs 文件夹: 包含 Cesium 单元测试代码。
6. ThirdParty 文件夹: 包含 Cesium 依赖的第三方库。
7. 其它配置文件等。

虽然这样解释了一下它的主要结构，但可能还是不够直观。

由于 Cesium 是纯 js 代码，所以不能直接运行 `index.html` 文件，它需要跑在服务器上，官方推荐的是 node 方法，即用 node 开启一个静态服务器进行挂载。而我们的目的不仅仅是跑官方示例，而是系统开发。所以，需要再深入一点。

以工程化的 vue 项目为例，我们正常开发一个项目，需要安装 node 相关依赖，然后再运行 node 服务，最后才能跑 vue 项目。

但是 Cesium 给我们的包并不是纯粹的 js 包。还有一些它自身的依赖，而我们所需要的资源可能只是其中的一部分。在开发阶段可以将所有资源放在开发环境本地，但是在生产环境中大可不必如此。因此，需要区分环境，以作开发和生产的区分。下面我们来看一下官网的一个基本使用教程。

在官网的教程中，我们是这样用 cesium 的：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Use correct character set. -->
    <meta charset="utf-8" />
    <!-- Tell IE to use the latest, best version. -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- Make the application on mobile take up the full browser screen and disable user scaling. -->
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
    />
    <title>Hello World!</title>
    <script src="../Build/Cesium/Cesium.js"></script>
    <style>
      @import url(../Build/Cesium/Widgets/widgets.css);
      html,
      body,
      #cesiumContainer {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <div id="cesiumContainer"></div>
    <script>
      var viewer = new Cesium.Viewer('cesiumContainer')
    </script>
  </body>
</html>
```

它实际上进行了这几步操作:

1. 引入 `Cesium.js` 核心库。

   ```js
   <script src="../Build/Cesium/Cesium.js"></script>
   ```

2. 导入 Cesium Viewer widget 的样式，使得 Cesium Viewer 能够正确显示。

   ```js
   @import url(../Build/Cesium/Widgets/widgets.css);
   ```

3. 创建一个 Cesium Viewer 实例，并将其挂载到 id 为 cesiumContainer 的 div 上。这个就是我们实际的网页视口元素了。

   ```js
   var viewer = new Cesium.Viewer('cesiumContainer')
   ```

可以看到我们引入的资源都在 `Build` 文件夹底下,也就是含 Cesium 的开发资源包及其相关依赖文件的集合。在开发环境中，我们直接使用这些资源包，而生产环境中，我们则需要将这些资源包进行打包，然后将打包后的资源包放置在服务器上，再通过服务器来提供服务。因此在构建项目时需要格外进行一些配置操作。

当然为了打包速度更快（白嫖官方的 CND），在生产环境中，笔者用 cesium 的本地包，而在开发环境中使用 cnd 加载 cesium 的包。这样的好处在于速度更快，若是要在局域网内使用，则可以考虑使用 nginx 进行代理。将 cesium 的包放置于服务器的指定位置。

::: tip

当然可以使用 vite 的插件 [`vite-plugin-cesium`](https://github.com/nshen/vite-plugin-cesium) 来进行 cesium 的打包，但是由于 cesium 官方的包体积较大，因此在学习过程中不推荐使用。

:::

### 配置 vite 环境

在 vite.config.ts 中，需要对 cesium 进行配置，以区分开发环境和生产环境。首先区分 Base URL，即 cesium 的包路径。

```bash
# 开发模式为: 拷贝后的打包路径
VITE_CESIUM_BASE_URL = libs/cesium/

# 生成环境为：cesium 的 cdn 地址，亦可换成指定的下载地址。
# 注意：需要将 cesium 替换为你的 cesium 版本号，以及末尾用 / 结尾。
VITE_CESIUM_BASE_URL = https://www.unpkg.com/cesium@1.115.0/Build/Cesium/
```

这里你可能会疑惑，为什么开发环境的 Base URL 是 `lib/cesium`，这里是借助了 vite 插件 [`viteStaticCopy`](https://github.com/sapphi-red/vite-plugin-static-copy)，会将 我们所需要的 cesium 的相关包拷贝到浏览器的 `lib/cesium` 目录下。

![拷贝后的打包路径](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202405292353038.png)

再次说明，这里是为了统一开发和生产环境，所以需要将 `libs/cesium` 目录下的文件拷贝到 `lib/cesium` 目录下。以下是 vite.config.ts 中的相关配置。

```ts
// 开发模式，复制 node_modules 下的 cesium 依赖
const cesiumLibraryRoot = 'node_modules/cesium/Build/CesiumUnminified/'
const cesiumLibraryCopyToRootPath = 'libs/cesium/' // 相对于打包后的路径
// 拷贝地址选项
const cesiumStaticSourceCopyOptions = [
  'Assets',
  'ThirdParty',
  'Workers',
  'Widgets',
].map((dirName) => {
  return {
    src: `${cesiumLibraryRoot}${dirName}/*`, // 注意后面的 * 字符，文件夹全量复制
    dest: `${cesiumLibraryCopyToRootPath}${dirName}`,
  }
})

// vite 插件
plugins.push(
  /** viteStaticCopy: https://github.com/sapphi-red/vite-plugin-static-copy */
  viteStaticCopy({
    targets: [
      // 主库文件，开发时选用非压缩版的 IIFE 格式主库文件
      {
        src: `${cesiumLibraryRoot}Cesium.js`,
        dest: cesiumLibraryCopyToRootPath,
      },
      // 四大静态文件夹
      ...cesiumStaticSourceCopyOptions,
    ],
  })
)
```

统一了静态资源后，还需要引入 cesium 的 js 包。这里用到 `insertHtml` 插件，作用是在 html 中插入想要的内容。

```ts
const cesiumBaseUrl = env["VITE_CESIUM_BASE_URL"]; // 环境变量 cesium 地址
const base = "/"; // 默认路径

insertHtml({
  head: [
    // 生产模式使用 CDN 或已部署的 CesiumJS 在线库链接，开发模式用拷贝的库文件，根据 VITE_CESIUM_BASE_URL 自动拼接
    h("script", {
      // 因为涉及前端路径访问，所以开发模式最好显式拼接 base 路径，适配不同 base 路径的情况
      src: isProd
        ? `${cesiumBaseUrl}Cesium.js`
        : `${base}${cesiumBaseUrl}Cesium.js`,
    }),
  ],
}),
```

最后一步，将 cesium 挂在在 window 的全局，以便生成环境和开发环境都能访问到。这里用到插件 `viteExternalsPlugin`。

```ts
viteExternalsPlugin({
  cesium: "Cesium", // 外部化 cesium 依赖，之后全局访问形式是 window['Cesium']
}),
```

下面是完整的 vite 配置代码，当然有些细节可以参考 Github 代码: [传送门 🚪](https://github.com/rayadaschn/learning_cesium/tree/dev):

```ts
import {
  defineConfig,
  type PluginOption,
  splitVendorChunkPlugin,
  loadEnv,
} from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import { insertHtml, h } from 'vite-plugin-insert-html'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import compress from 'vite-plugin-compression'
import { envDir, sourceDir, manualChunks } from './scripts/build'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir)
  const isProd = mode === 'production'

  const cesiumBaseUrl = env['VITE_CESIUM_BASE_URL']

  const base = '/' // 默认路径

  const plugins: PluginOption[] = [
    vue(),
    splitVendorChunkPlugin(),
    viteExternalsPlugin({
      cesium: 'Cesium', // 外部化 cesium 依赖，之后全局访问形式是 window['Cesium']
    }),
    insertHtml({
      head: [
        // 生产模式使用 CDN 或已部署的 CesiumJS 在线库链接，开发模式用拷贝的库文件，根据 VITE_CESIUM_BASE_URL 自动拼接
        h('script', {
          // 因为涉及前端路径访问，所以开发模式最好显式拼接 base 路径，适配不同 base 路径的情况
          src: isProd
            ? `${cesiumBaseUrl}Cesium.js`
            : `${base}${cesiumBaseUrl}Cesium.js`,
        }),
      ],
    }),
  ]
  if (!isProd) {
    // 开发模式，复制 node_modules 下的 cesium 依赖
    const cesiumLibraryRoot = 'node_modules/cesium/Build/CesiumUnminified/'
    const cesiumLibraryCopyToRootPath = 'libs/cesium/' // 相对于打包后的路径
    const cesiumStaticSourceCopyOptions = [
      'Assets',
      'ThirdParty',
      'Workers',
      'Widgets',
    ].map((dirName) => {
      return {
        src: `${cesiumLibraryRoot}${dirName}/*`, // 注意后面的 * 字符，文件夹全量复制
        dest: `${cesiumLibraryCopyToRootPath}${dirName}`,
      }
    })
    plugins.push(
      /** viteStaticCopy: https://github.com/sapphi-red/vite-plugin-static-copy */
      viteStaticCopy({
        targets: [
          // 主库文件，开发时选用非压缩版的 IIFE 格式主库文件
          {
            src: `${cesiumLibraryRoot}Cesium.js`,
            dest: cesiumLibraryCopyToRootPath,
          },
          // 四大静态文件夹
          ...cesiumStaticSourceCopyOptions,
        ],
      })
    )
  }
  plugins.push(
    compress({
      threshold: 10 * 1024, // 10KB 以下不压缩
    })
  )

  return {
    base,
    envDir,
    mode,
    plugins,
    resolve: {
      alias: {
        '@': sourceDir,
      },
    },
  }
})
```
