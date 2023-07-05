---
title: 小程序 快速入门 01
icon: mini-app
date: 2023-07-04
category:
  - mini-app
tag:
  - mini-app
---

## 适用场景

不同的技术对应不同的应用场景，下面是小程序、APP 和 H5 的比较

| 运行载体 | 运行环境 | 功能性 |  便捷性  |   交互体验   | 开发成本 | 推广难度 | 消息推送 |
| :------: | :------: | :----: | :------: | :----------: | :------: | :------: | :------: |
|  小程序  |   微信   | 轻应用 | 无需安装 | 解决原生 APP |    中    |    低    |   受限   |
|  公众号  |    H5    |  简单  | 无需安装 |     一般     |    低    |    低    |   支持   |
|   APP    | 原生系统 |  丰富  | 需要安装 |    最流畅    |    高    |    高    |   支持   |

为什么会快？这个实际上和小程序的架构有关。

传统的 Web 技术在做页面渲染时，页面的逻辑执行脚本和页面 DOM 渲染是共用同一个线程。因此，业务逻辑和 UI 渲染常常相互抢占资源，容易出现性能问题。

而小程序是采用了 Hybrid 技术，使用的是混合开发模式。界面采用 Web 技术渲染，再将客户端原生能力封装成接口供开发者调用，并通过双线程模型分离界面渲染和逻辑处理，从而提高小程序的渲染性能和管控安全。

## 小程序的文件结构

```tree
├──app.wxss              小程序公共样式表【非必须】
├──app.json              小程序公共应用配置【必须】
├──app.js                小程序逻辑【必须】
├──project.config.json   小程序项目配置【必须】
└──pages
    ├─index.js           页面逻辑【必须】
    ├─index.json         页面配置【必须】
    ├─index.wxml         页面结构【非必须】
    └─index.wxss         页面样式表【非必须】
```

> 注意：为了方便开发者减少配置项，**描述页面的四个文件必须具有相同的路径与文件名**。
> 在小程序中，`project.config.json` 和 `app.json` 是两个重要的配置文件，它们之间有以下区别：
>
> - `project.config.json`：这个文件是整个小程序项目的配置文件，用于配置项目的基本信息，如项目名称、版本号、appid、开发者信息等。它是整个小程序项目的配置文件中**最高级别的文件**，它的配置会影响到整个小程序项目的所有部分。
> - `app.json`：这个文件是小程序应用的配置文件，用于配置小程序的全局设置，如页面路径、窗口背景色、导航栏样式、底部 tab 栏等。它是小程序中每个页面的配置文件的父级文件，它的配置会影响到所有小程序页面的表现和功能。

由上可知，一个小程序项目主要分为两部分：主体文件和页面文件。

- 主体文件必须放在项目的根目录，它的配置会影响整个小程序项目。
- 页面文件必须放在 pages 目录下，每个页面都有一个独立的文件夹。

## 小程序的生命周期

![小程序的主要生命周期](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202307041625994.png)

如上图所示，一个完整的小程序生命周期实际上包括**组件生命周期**和**页面生命周期**两部分。

- 一个微信小程序启动后，首次加载页面，会触发页面的 **onLoad** 事件（这个事件只会在页面首次加载时才会触发）；
- 当页面显示的时候会触发 **onShow** 事件，若这个页面是首次渲染完成，则会接着触发 **onReady** 事件；
- 若将小程序切换到后台，页面就会被隐藏同时触发 **onHide** 事件；下次从后台切换到前台时，则会再次触发 **onShow** 事件。
- 最后，当页面被回收销毁时，会触发 **onUnload** 事件。

完整的生命周期：

![完整的生命周期](https://res.wx.qq.com/wxdoc/dist/assets/img/page-lifecycle.2e646c86.png)

### 项目生命周期

小程序的生命周期一般使用 App（Object object）来注册小程序， 从而管理自己的生命周期。

> 注意，App() 方法有且只有一个,不能注册多个,否则会出现无法与其的后果。

在根目录下的 `app.js` 文件中书写生命周期:

```js
// app.js
App({
  onLaunch: function(options) {
    // 监听小程序初始化
  },
  onShow: function(options) {
    // 监听小程序 显示
  },
  onHide: function(options) {
    // 监听小程序隐藏
  },
  onError: function(options) {
    // 监听错误
  },
  // 全局数据对象
  globalData: {...}
})
```

### 页面生命周期的注册

在页面下的 index.js 中使用 Page 构造器注册页面:

```js
// index.js
Page({
  data: {
    text: '页面注册生命周期'
  },
  onLoad: function(options) {},
  onReady: function(options) {},
  onShow: function(options) {},
  onHide: function(options) {},
  onUnload: function(options) {},
  onPullDownRefresh: function(options) {},
  onReachBottom: function(options) {},
  onShareAppMessage: function(options) {},
  ...
})
```

## 参考文档

- 《小程序开发原理与实战》
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
