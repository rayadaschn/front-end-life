---
title: 小程序 快速入门
icon: mini-app
date: 2023-07-04
category:
  - mini-app
tag:
  - mini-app
---

本节对微信小程序做一些基础的介绍梳理。

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

### 渲染页面

页面渲染分为三个部分：如何渲染页面、如何绑定事件和如何修改页面。

- 如何渲染页面：
  在页面初始化的时候，data 数据会以 JSON 的形式由逻辑层传递给渲染层。渲染层通过 **WXML** 对数据进行绑定。
- 如何绑定事件：这块同 Vue 类似，渲染层可以在组件中加入事件绑定。
- 如何修改页面：通过调用 `this.setData()` 方法来修改。
  > 注意 单次设置的数据不要超过 1024kb，并且注意不要见 value 值设置为 underlined。

### 模块化

小程序采用的是 commonJS 的模块化标准。

- 通过 module.exports 导出
- 通过 require 导入

值得注意的是，小程序不支持直接引入 node_modules，这是由小程序自定义组件的特殊性决定的。详情可见[官方说明](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)。

使用 npm 下载的包，需额外添加构建 npm 过程：点击开发者工具中的菜单栏：工具 --> 构建 npm

- js 中引入 npm 包：

```js
const myPackage = require('packageName')
const packageOther = require('packageName/other')
```

- 使用 npm 包中的自定义组件：

```json
{
  "usingComponents": {
    "myPackage": "packageName",
    "package-other": "packageName/other"
  }
}
```

> tips：此处使用 npm 包时如果只引入包名，则默认寻找包名下的 index.js 文件或者 index 组件。

### 原生 API

微信小程序提供了大量好用的 API，基本可以分为三类：事件监听类、同步执行类和异步执行类。

1. 事件监听类

   通常以“on”开头，用于监听某个事件是否触发。这类 API 接收一个回调函数作为参数，当事件触发时会调用这个回调函数，并将相关数据以参数形式传入。

   ```js
   wx.onCompassChange(function (res) {
     console.log(res)
   })
   ```

2. 同步执行类

   通常以“Sync”结尾的 API 都是同步 API，同步 API 的执行结果可以通过函数返回值直接获取，若执行出错则会抛出异常。

   ```js
   try {
     wx.setStorageSync('key', 'value')
   } catch (e) {
     console.error(e)
   }
   ```

3. 异步执行类

   这类 API 通常接收一个 Object 类型的参数，一般有如下字段：

   | 参数名   | 类型     | 是否必填 | 说明                       |
   | :------- | :------- | :------: | :------------------------- |
   | success  | function |    否    | 接口调用**成功**的回调函数 |
   | fail     | function |    否    | 接口调用**失败**的回调函数 |
   | complete | function |    否    | 接口调用**结束**的回调函数 |
   | 其它     | Any      |    -     | 接口定义的其他参数         |

   微信小程序支持 ES6 但是没有给出 Promise API 的调用方法，因此需要对其进行封装：

   ```js
   let getImageInfoPromise = new Promise(function (resolve, reject) {
     wx.getImageInfo({
       src: 'xxx.png',
       success: function (res) {
         resolve(res)
       },
     })
   })
   ```

## 渲染层开发

小程序的渲染层由 WXML(weixin markup language) 和 WXSS(weixin style sheet) 编写，并交由组件来进行展示。

通过将逻辑层的数据渲染成视图，同时将渲染层的事件发送给逻辑层。这里介绍一些常用组件。

### 视图容器

视图容器是包裹其他组件的容器，主要用于界面的布局和展示。如 view、scroll-view、swiper 和 swiper-item 等。

1. view 组件，相当于 HTML 中的 div 标签。有 4 个基本属性。

   - hover-class：设置鼠标悬停时的样式类。
   - hover-stop-propagation：设置鼠标悬停时是否阻止事件冒泡。
   - hover-start-time：设置鼠标悬停开始的延迟时间。
   - hover-stay-time：设置鼠标悬停持续的时间。

2. scroll-view 组件， 是小程序中用于滚动显示内容的组件，其常用的属性如下：

   - scroll-x：设置横向滚动，可以为 true 或 false。
   - scroll-y：设置纵向滚动，可以为 true 或 false。
   - scroll-with-animation：设置滚动时是否使用动画效果，可以为 true 或 false。
   - scroll-left：设置横向滚动条位置，单位为 px。
   - scroll-top：设置纵向滚动条位置，单位为 px。
   - scroll-into-view：设置滚动到指定组件的位置，可以为组件的 id 或选择器。
   - scroll-with-paging：设置是否开启分页滚动，可以为 true 或 false。
   - enable-back-to-top：设置是否开启快速返回顶部功能，可以为 true 或 false。
   - bindscroll：设置滚动时触发的事件处理函数。
   - bindscrolltolower：设置滚动到底部时触发的事件处理函数。
   - bindscrolltoupper：设置滚动到顶部时触发的事件处理函数。

   除了以上属性，scroll-view 组件还有一些其他的属性，例如：

   - scroll-anchoring：设置是否开启滚动时自动定位到最近的锚点位置，可以为 true 或 false。
   - upper-threshold：设置滚动到顶部时触发上拉加载的距离阈值，单位为 px。
   - lower-threshold：设置滚动到底部时触发下拉刷新的距离阈值，单位为 px。
   - scroll-sensitivity：设置滚动灵敏度，即滚动距离与手指滑动距离之间的比例关系。

3. swiper-item 组件则是一种用于轮播显示内容的容器，通常用于显示轮播图或幻灯片等场景。swiper-item 组件必须嵌套在 swiper 组件中使用，而且它只能包含图片或者其他 swiper-item 组件。swiper 组件可以通过设置 autoplay、circular、indicator-dots 等属性来控制轮播的效果和样式。

### 基础组件

基础组件包括图标（icon）、进度条（progress）、富文本（rich-text）和文本（text）等。

### 表单组件

表单组件包括 button 按钮、checkbox、checkbox-group、editor、form、input、label、picker、picker-view、picker-view-column、radio、radio-group 等。

### WXML 页面结构

1. 数据绑定
   WXML 中的动态数据均来自对应 Page 的 data。数据绑定同 Vue 一样采用 Mustache 语法，双括号将变量包起来。一般可以将绑定内容和组件属性（class 类等），还可以把数据绑定用在控制语句中。

2. 列表渲染
   在组件上使用 `wx:for` 控制属性绑定一个数组，即可使用数组中的各项数据重复渲染该组件。
   此外，需要使用 `wx:key` 来指定列表中项目的唯一标识符。

3. 条件渲染
   `wx:if` 条件渲染代码块，同时可以配合 `wx:elif` 和 `wx:else` 来添加 else 块。

   ```html
   <!--wxml-->
   <view wx:if="{{view === 'webview'}}"> webview </view>
   <view wx:elif="{{view === 'app'}}"> elif app </view>
   <view wx:else="{{view === 'other'}}"> else other </view>
   ```

4. 模版
   WXML 提供了模版，可以在模版中定义代码片段，然后在不同的地方调用。
   使用 name 属性作为模版的名字，然后在内定义代码的片段：

   ```html
   <!--wxml-->
   <template is="staffName" data="{{...staffA}}"></template>
   ```

5. 事件
   事件是渲染层到逻辑层的通信方式，可以将用户的行为反馈到逻辑层进行处理。事件可以绑定在组件上，当触发时间时，就会执行逻辑层中对应的事件处理函数。事件对象可以携带额外信息，如 id、dataset 和 touches。

   在组件中绑定一个事件处理函数，如 `bindtap`，当用户点击该组件的时候，会在该页面对应的 Page 中找到相应的事件处理函数。

   ```html
   <view bindtap="app">{{ count }}</view>
   ```

   在相应的 Page 定义中写上相应的事件处理函数，参数是 event：

   ```js
   Page({
     data: {
       count: 1,
     },
     add: function (e) {
       this.setData({
         count: this.data.count + 1,
       })
     },
   })
   ```

   事件分为冒泡事件和非冒泡事件。

   - 冒泡事件：当一个组件上的事件被触发后，该事件**会**向父节点传递；
   - 非冒泡事件：当一个组件上的事件被触发后，该事件**不会**向父节点传递。

### WXSS

1. 值得注意的是，微信中采用的尺寸单位是 `rpx` ，类似于 CSS 中的 `rem` 单位。微信采用的是 iPhone6 的屏幕尺寸，iPhone6 上，屏幕实际宽度为 375px，共有 750 个物理像素。因此，750rpx = 375px = 750 物理像素，1rpx = 0.5px。而其它设备宽度则不一定为 375px，因此 1rpx 可能不为 0.5px。但是开发者不需要关系不同设备下的宽度。只需遵守“所有的设备屏幕宽度都为 750rpx ”这一约定即可，小程序会对任意屏幕进行自适应布局。当然这样的做法可能在较小的屏幕上会产生“毛刺”，所以还是需要注意的。

2. 另外，对于一些特殊机型，如 iPhoneX 后面的新机型，在底部会有一条黑线条遮挡，这个时候应该使用 `padding-bottom: env(safe-area-inset-bottom)` 来告诉微信进行自动适配。 这个函数式用于设定安全区域与边界的距离。

3. 样式导入。在小程序中可以用 `@import` 语句导入外联样式表。`@import` 后面跟需要导入的外联岩石表的相对路径，用“`；`”表示语句结束。

   ```css
   /** app.wxss */
   @import 'common.wxss';
   .middle-p {
     padding: 15rex;
   }
   ```

## 参考文档

- 《小程序开发原理与实战》
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
