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

由于工作需要用到 eCharts，虽然官网样例已经非常丰富了，本文旨在对 eCharts 的使用进行快速入门，方便后续查阅。实际使用中同 AntDesign 和 Element 等框架一样，可依据官网文档进行扩展。不用记住各个 API 的配置规则，只需知道如何使用即可。

[eCharts api🚪](https://echarts.apache.org/en/api.html#echarts)

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

当然除了上述的基本配置外，还有如下：

- Grid：控制图表的内边距
- Axis：配置 X、Y 轴及其标签
- DataZoom：数据缩放功能
- VisualMap：视觉映射组件，适用于热力图等场景
- Toolbox：提供图表导出、还原等功能

## 图标配置

- 柱状图 (bar)，series 中的 `type` 字段设置为 `bar`，即可生成柱状图。
- 折线图 (line)，series 中的 `type` 字段设置为 `line`，即可生成折线图。
- 饼图 (pie)，series 中的 `type` 字段设置为 `pie`，即可生成饼图。
- 散点图 (scatter)，series 中的 `type` 字段设置为 `scatter`，即可生成散点图。
- K 线图 (candlestick)，series 中的 `type` 字段设置为 `candlestick`，即可生成 K 线图。
- 雷达图 (radar)
- 地图 (map)
- 漏斗图 (funnel)
- 仪表盘 (gauge)

它们的区别，实际是通过 Option 中的 `series` 来决定的。

### `series` 的作用

1. **指定图表类型**：`series` 中的 `type` 字段用来指定图表的类型，比如 `bar`（柱状图）、`line`（折线图）、`pie`（饼图）等。
2. **定义数据**：`series` 的 `data` 字段用来设置数据内容。例如在柱状图中，它定义每个柱子的数值；在折线图中，它定义每个点的值。

3. **样式和显示效果**：`series` 配置项里还包含了控制图表样式的属性，比如颜色、大小、标签显示、边框样式等。

4. **多个 `series` 实现组合图表**：可以在 `series` 数组中定义多个数据系列，每个系列可以设置成不同的类型，这样可以实现柱状图和折线图结合等复杂的组合图表。

### 示例

一个简单的柱状图 `series` 配置示例：

```javascript
const option = {
  xAxis: {
    type: 'category',
    data: ['A', 'B', 'C', 'D', 'E'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      type: 'bar', // 图表类型：柱状图
      data: [10, 20, 30, 40, 50], // 数据内容
      itemStyle: {
        // 样式设置
        color: '#3398DB',
      },
    },
  ],
}
```

### `series` 中的常用字段

- **type**：图表类型，如 `bar`、`line`、`pie` 等。
- **data**：数据内容，通常是一个数组。
- **name**：系列名称，图例会使用该名称。
- **itemStyle**：控制每个数据项的样式，比如颜色、边框等。
- **label**：控制每个数据项的标签显示，比如显示数值。
- **stack**：用于堆叠效果，适合在柱状图和面积图中实现累计效果。

## 数据联动与动态更新

多图表联动：如何使用 `connect` 方法在多个图表之间进行联动
动态数据更新：使用 `setOption` 动态更新图表数据和样式
事件监听：使用 `chart.on(event, handler)` 监听点击、悬停等事件，实现更丰富的交互效果
