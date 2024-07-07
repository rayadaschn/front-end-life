---
title: Cesium Property 属性机制
icon: sitemap
date: 2024-07-07
category:
  - 框架
tag:
  - gis
sticky: false
---

在此前系列中，笔者梳理了 Cesium 的基本使用方法，但是为了更进阶了解 Cesium，我们需要了解 Cesium 的核心机制，其中之一就是 Property 属性机制。

![Property 类型](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/Property%20%E7%B1%BB%E5%9E%8B.jpg)

## 区分 Entity 和 Property

此前，简单的介绍过 `Entity` 和 `Property` 的区别。

`Entity` 是 Cesium 中最基础的类，它代表了一个三维对象，例如一个球体、一个平面、一个模型等。`Entity` 是一个抽象的概念，它不包含任何具体的几何信息，只包含一些属性，例如位置、颜色、大小等。

`Property` 用于表示属性的值可以随时间变化。它通常用于描述 `Entity` 的动态属性，如位置、颜色、方向等。

总体来说，`Entity` 是表示场景中对象的基本构建块，包含多个静态或动态属性。`Property` 是用于定义这些属性随时间变化的接口和机制，使得 `Entity` 的行为可以根据时间进行动态变化。

## Property 的分类

如开篇图片总结一致，在 Cesium 中 Property 基本上可以分为四类：基本类型、PositionProperty 坐标类型、MaterialProperty 材质类型和其它类型。

在总结它们之间的区别之前，可以先梳理一下，[Property](https://cesium.com/learn/ion-sdk/ref-doc/Property.html?classFilter=Property) 类型的公共属性和方法。

**公共只读属性**:

- `definitionChanged`：当属性的定义发生变化时触发的**事件**。
- `isConstant`：一个布尔值，指示属性是否为常量，用来判断该属性是否会随时间变化。Cesium 会依据该变量来判断物体是否需要更新。

**公共方法**：

- `equals(other)`：比较当前属性与提供的属性是否相等。
- `getValue(time, result)`：获取指定时间的属性值。`time`参数是一个`JulianDate`对象，表示时间；`result`是一个**可选参数**，用于存储返回的值。

### 基本类型

基本类型包括 `ConstantProperty`、`SampledProperty`、`TimeIntervalCollectionProperty` 和 `CompositeProperty`。

- `ConstantProperty`：表示一个恒定的属性值，即该属性的值在所有时间点上都相同。
- `SampledProperty`：表示一个随时间变化的属性值，即该属性的值在多个时间点上进行采样。
- `TimeIntervalCollectionProperty`：表示一个随时间变化的属性值，但是每个时间段的属性值可以不同。
- `CompositeProperty`：表示一个组合属性，即该属性的值由多个子属性组合而成。

#### ConstantProperty

`ConstantProperty` 是一个常量属性，它的值在所有时间点上都相同。它通常用于表示静态属性，例如物体的颜色、大小等。

构造函数: `new Cesium.ConstantProperty(value)`。`value`: 属性值，是可选参数。

虽然说是不可变，实际上是不随时间发生变化，`ConstantProperty` 是具有`setValue(value)`方法的，依据该方法可以修改物体的值。

#### SampledProperty

`SampledProperty` 是一个采样属性，它的值在多个时间点上进行采样。它通常用于表示随时间变化的属性，例如物体的位置、方向等。

构造函数: `new Cesium.SampledProperty(type, derivativeTypes)`。`type` 是属性类型，`derivativeTypes` 是可选数组，表示样本将包含指定类型的导数信息。

创建并使用线性插值的 `Cartesian2` 属性：

```js
const property = new Cesium.SampledProperty(Cesium.Cartesian2)

property.addSample(
  Cesium.JulianDate.fromIso8601('2012-08-01T00:00:00.00Z'),
  new Cesium.Cartesian2(0, 0)
)
property.addSample(
  Cesium.JulianDate.fromIso8601('2012-08-02T00:00:00.00Z'),
  new Cesium.Cartesian2(4, 7)
)

const result = property.getValue(
  Cesium.JulianDate.fromIso8601('2012-08-01T12:00:00.00Z')
)
```

#### TimeIntervalCollectionProperty

`TimeIntervalCollectionProperty` 是一个时间间隔集合属性，它的值在多个时间间隔内可以不同。它通常用于表示随时间间断变化的属性，例如物体的位置、方向等。没有 Sampled 那样插值结果丝滑。

多了一个 `intervals` 只读属性，并以此定义间断收集。

创建一个 `Cartesian2` 间隔属性，包含 2012 年 8 月 1 日的数据，并每 6 小时使用不同的值。

```js
const composite = new Cesium.TimeIntervalCollectionProperty()
composite.intervals.addInterval(
  Cesium.TimeInterval.fromIso8601({
    iso8601: '2012-08-01T00:00:00.00Z/2012-08-01T06:00:00.00Z',
    isStartIncluded: true,
    isStopIncluded: false,
    data: new Cesium.Cartesian2(2.0, 3.4),
  })
)
composite.intervals.addInterval(
  Cesium.TimeInterval.fromIso8601({
    iso8601: '2012-08-01T06:00:00.00Z/2012-08-01T12:00:00.00Z',
    isStartIncluded: true,
    isStopIncluded: false,
    data: new Cesium.Cartesian2(12.0, 2.7),
  })
)
composite.intervals.addInterval(
  Cesium.TimeInterval.fromIso8601({
    iso8601: '2012-08-01T12:00:00.00Z/2012-08-01T18:00:00.00Z',
    isStartIncluded: true,
    isStopIncluded: false,
    data: new Cesium.Cartesian2(5.0, 12.4),
  })
)
composite.intervals.addInterval(
  Cesium.TimeInterval.fromIso8601({
    iso8601: '2012-08-01T18:00:00.00Z/2012-08-02T00:00:00.00Z',
    isStartIncluded: true,
    isStopIncluded: true,
    data: new Cesium.Cartesian2(85.0, 4.1),
  })
)
```

#### CompositeProperty

`CompositeProperty` 是一个组合属性，它的值由多个子属性组合而成。它允许用户定义一个由 `TimeIntervalCollection` 管理的属性集合。每个时间间隔内的 `data` 属性是另一个 `Property` 实例，这个实例会在给定时间被评估。

`CompositeProperty` 类通过 `new Cesium.CompositeProperty()` 构造函数创建。
它使用 `TimeIntervalCollection` 来定义属性，每个时间间隔内的数据属性是另一个 `Property` 实例。

假设现在有两个属性：`constantProperty` 和 `sampledProperty`，使用 `CompositeProperty` 的 `addInterval` 方法添加时间间隔，例如。

```js
const composite = new Cesium.CompositeProperty()
composite.intervals.addInterval(
  Cesium.TimeInterval.fromIso8601({
    iso8601: '2012-08-01T00:00:00.00Z/2012-08-01T12:00:00.00Z',
    data: constantProperty,
  })
)
composite.intervals.addInterval(
  Cesium.TimeInterval.fromIso8601({
    iso8601: '2012-08-01T12:00:00.00Z/2012-08-02T00:00:00.00Z',
    isStartIncluded: false,
    isStopIncluded: false,
    data: sampledProperty,
  })
)
```
