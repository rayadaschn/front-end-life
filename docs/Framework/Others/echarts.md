---
title: eCharts 快速入门
icon: go
date: 2024-10-25

category:
  - 框架
tag:
  - eCharts
star: false
sticky: false
---

由于工作需要用到 eCharts，虽然官网样例已经非常丰富了，本文旨在对 eCharts 的使用进行快速入门，方便后续查阅。

## 基本配置项

除基本数据外，图标最基础的三种配置项为：标题 title、图例 legend、工具提示 tooltip。

### 标题 title

标题分为主标题和副标题，主标题和副标题的属性基本一致，可以单独设置。

```js
title: {
  show: true, // 是否显示标题
  text: '主标题',
  subtext: '副标题',
  x: 'center', // 水平位置，可选值：'center'、'left'、'right',
  y: 'top', // 垂直位置，可选值：'top'、'middle'、'bottom',
  textStyle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtextStyle: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'normal',
  },
},
```

### 图例 legend

图例是图表的标识，用于表现不同系列的数据。

```js
legend: {
  show: true, // 是否显示图例
  icon: "circle",//图例样式
  inactiveColor: "#fffddd", // 图例关闭时的颜色。
},
xAxis: {
  data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
},
series: [
  {
    name: "销量",
    type: "bar",
    data: [5, 20, 36, 10, 10, 20],
  },
],
```

### 工具提示 tooltip

工具提示是鼠标悬停时显示的提示框，用于展示数据。

```js
tooltip: {
  show: true, // 是否显示工具提示
  trigger: "axis", // 触发类型，可选值：'item'、'axis'、'none'
  axisPointer: {
    type: "shadow", // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
  }, // 提示框内容
  // showContent: true, //是否显示提示框浮层，默认显示。
  // triggerOn: 'mouseover', // 触发时机'click'鼠标点击时触发。
  // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式。
  formatter: function(arg) {
      return arg[0].name + '的分数是:' + arg[0].data
  }
}
```
