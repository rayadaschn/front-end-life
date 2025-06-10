---
title: Cesium Property 属性机制
icon: sitemap
date: 2024-12-07
category:
  - 框架
tag:
  - gis
star: true
sticky: false
---

在此前系列中，笔者梳理了 Cesium 的基本使用方法，但是为了更进阶了解 Cesium，我们需要了解 Cesium 的核心机制，其中之一就是 Property 属性机制。

先总览一遍 Property 类型分类。

![Property 类型](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/Property%20%E7%B1%BB%E5%9E%8B_fix.jpg)

## 区分 Entity 和 Property

此前，简单的介绍过 `Entity` 和 `Property` 的区别。

`Entity` 是 Cesium 中最基础的类，它代表了一个三维对象，例如一个球体、一个平面、一个模型等。`Entity` 是一个抽象的概念，它不包含任何具体的几何信息，只包含一些属性，例如位置、颜色、大小等。

```js
const viewer = new Cesium.Viewer('cesiumContainer')
const entity = viewer.entities.add({
  name: 'Satellite',
  position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
  point: {
    pixelSize: 10,
    color: Cesium.Color.RED,
  },
})
```

`Property` 用于表示属性的值可以随时间变化。它通常用于描述 `Entity` 的动态属性，如位置、颜色、方向等。

```js
const position = new Cesium.SampledPositionProperty()
position.addSample(
  Cesium.JulianDate.fromDate(new Date(2024, 7, 7)),
  Cesium.Cartesian3.fromDegrees(-75.0, 40.0)
)
position.addSample(
  Cesium.JulianDate.fromDate(new Date(2024, 7, 7)),
  Cesium.Cartesian3.fromDegrees(-80.0, 45.0)
)

const entity = viewer.entities.add({
  position: position,
  point: {
    pixelSize: 10,
    color: Cesium.Color.BLUE,
  },
})
```

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

`CompositeProperty` 是一个组合属性，它的值由多个子属性组合而成。它允许用户定义一个由 `TimeIntervalCollection` 管理的属性集合。每个时间间隔内的 `data` 属性是另一个 `Property` 实例，这个实例会在给定时间被渲染。

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

### PositionProperty 坐标类型

`PositionProperty` 同基础类型特别相似，只是多了一个 Position，来表示位置信息。

当然也多了一个成员公共方法 `getValueInReferenceFrame(time, referenceFrame, result) :Cartesian3|undefined` ：在提供的时间和参考框架中获取属性的值。

- `time`：要检索值的时间，类型为`JulianDate`。
- `referenceFrame`：所需的结果的参考框架。
- `result`：可选，用于存储值的对象，如果省略，则创建并返回一个新实例。

常见的子类:

1. `ConstantPositionProperty`: 用于定义静态位置。
2. `SampledPositionProperty`: 用于定义随时间变化的位置。
3. `TimeIntervalCollectionPositionProperty`: 用于定义随时间间断变化的位置。
4. `CompositePositionProperty`: 用于组合多个位置属性，按时间间隔定义位置。

由于 `PositionProperty` 同基础类型特别相似，因此下面更多从使用方式上进行总结。

#### ConstantPositionProperty

`ConstantPositionProperty` 在 Cesium 中用于定义静态位置。它通过存储一个固定的位置，来描述对象在所有时间点的位置，通常用于定义地面静态对象（如建筑物、地标等）。

**使用步骤**:

1. 创建 `ConstantPositionProperty` 实例。
2. 设置位置。
3. 将 `ConstantPositionProperty` 赋值给 `Entity` 的 `position` 属性。

```js
// 创建 Cesium Viewer 实例
const viewer = new Cesium.Viewer('cesiumContainer')

// 创建 ConstantPositionProperty 实例
const constantPosition = new Cesium.ConstantPositionProperty(
  Cesium.Cartesian3.fromDegrees(-75.0, 40.0, 1000)
)

// 创建实体并将 ConstantPositionProperty 赋值给 position 属性
const entity = viewer.entities.add({
  position: constantPosition,
  point: {
    pixelSize: 10,
    color: Cesium.Color.RED,
  },
})

// 设置视图到实体
viewer.zoomTo(entity)
```

#### SampledPositionProperty

`SampledPositionProperty` 在 Cesium 中用于定义随时间变化的位置。它通过存储一系列时间和位置的样本，来描述对象在不同时间点的位置。这在模拟动态运动（如卫星轨道、飞行路径等）时非常有用。

**使用步骤**:

1. 创建 `SampledPositionProperty` 实例。
2. 添加时间和位置样本。
3. 将 `SampledPositionProperty` 赋值给 `Entity` 的 `position` 属性。

```js
// 创建 Cesium Viewer 实例
const viewer = new Cesium.Viewer('cesiumContainer')

// 创建 SampledPositionProperty 实例
const position = new Cesium.SampledPositionProperty()

// 定义样本时间点和位置
const startTime = Cesium.JulianDate.fromDate(new Date(2020, 2, 2, 12, 0, 0))
const endTime = Cesium.JulianDate.fromDate(new Date(2020, 2, 2, 12, 10, 0))

const position1 = Cesium.Cartesian3.fromDegrees(-75.0, 40.0, 1000)
const position2 = Cesium.Cartesian3.fromDegrees(-80.0, 45.0, 2000)

// 添加样本到 SampledPositionProperty
position.addSample(startTime, position1)
position.addSample(endTime, position2)

// 创建实体并将 SampledPositionProperty 赋值给 position 属性
const entity = viewer.entities.add({
  position: position,
  point: {
    pixelSize: 10,
    color: Cesium.Color.BLUE,
  },
})

// 设置视图到实体
viewer.zoomTo(entity)

// 通过 timeline 和 clock 演示位置变化
viewer.clock.startTime = startTime.clone()
viewer.clock.stopTime = endTime.clone()
viewer.clock.currentTime = startTime.clone()
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP // 循环
viewer.clock.multiplier = 10 // 时间流速倍率
```

#### TimeIntervalCollectionPositionProperty

`TimeIntervalCollectionPositionProperty` 用于间断的定义物体在不同时间区间的位置，每个时间区间 (`TimeInterval`) 可以包含一个不同的属性值。在 `TimeIntervalCollectionPositionProperty` 中，这些时间区间用于定义不同时间段的不同位置。

使用方法同 SampledPositionProperty 类似，只是需要使用 `TimeIntervalCollectionProperty` 来定义时间区间和位置。

```js
// 创建 Cesium Viewer 实例
const viewer = new Cesium.Viewer('cesiumContainer')

// 创建 TimeIntervalCollectionPositionProperty 实例
const timeIntervalCollection =
  new Cesium.TimeIntervalCollectionPositionProperty()

// 定义时间区间和对应的位置
const startTime = Cesium.JulianDate.fromDate(new Date(2020, 2, 2, 12, 0, 0))
const midTime = Cesium.JulianDate.fromDate(new Date(2020, 2, 2, 12, 5, 0))
const endTime = Cesium.JulianDate.fromDate(new Date(2020, 2, 2, 12, 10, 0))

const position1 = Cesium.Cartesian3.fromDegrees(-75.0, 40.0, 1000)
const position2 = Cesium.Cartesian3.fromDegrees(-80.0, 45.0, 2000)
const position3 = Cesium.Cartesian3.fromDegrees(-85.0, 50.0, 3000)

// 添加时间区间到 TimeIntervalCollectionPositionProperty
timeIntervalCollection.intervals.addInterval(
  new Cesium.TimeInterval({
    start: startTime,
    stop: midTime,
    data: position1,
  })
)
timeIntervalCollection.intervals.addInterval(
  new Cesium.TimeInterval({
    start: midTime,
    stop: endTime,
    data: position2,
  })
)
timeIntervalCollection.intervals.addInterval(
  new Cesium.TimeInterval({
    start: endTime,
    stop: Cesium.JulianDate.addMinutes(endTime, 5, new Cesium.JulianDate()),
    data: position3,
  })
)

// 创建实体并将 TimeIntervalCollectionPositionProperty 赋值给 position 属性
const entity = viewer.entities.add({
  position: timeIntervalCollection,
  point: {
    pixelSize: 10,
    color: Cesium.Color.YELLOW,
  },
})

// 设置视图到实体
viewer.zoomTo(entity)

// 通过 timeline 和 clock 演示位置变化
viewer.clock.startTime = startTime.clone()
viewer.clock.stopTime = Cesium.JulianDate.addMinutes(
  endTime,
  5,
  new Cesium.JulianDate()
)
viewer.clock.currentTime = startTime.clone()
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP // 循环
viewer.clock.multiplier = 10 // 时间流速倍率
```

#### CompositePositionProperty

`CompositePositionProperty` 则是组合式。可以定义多个不同的物体，在不同时间区间内的表现。

```js
// 创建 Cesium Viewer 实例
const viewer = new Cesium.Viewer('cesiumContainer')

// 定义时间区间
const startTime = Cesium.JulianDate.fromDate(new Date(2020, 2, 2, 12, 0, 0))
const midTime = Cesium.JulianDate.fromDate(new Date(2020, 2, 2, 12, 5, 0))
const endTime = Cesium.JulianDate.fromDate(new Date(2020, 2, 2, 12, 10, 0))

// 定义第一个 PositionProperty
const sampledPosition1 = new Cesium.SampledPositionProperty()
sampledPosition1.addSample(
  startTime,
  Cesium.Cartesian3.fromDegrees(-75.0, 40.0, 1000)
)
sampledPosition1.addSample(
  midTime,
  Cesium.Cartesian3.fromDegrees(-80.0, 45.0, 2000)
)

// 定义第二个 PositionProperty
const sampledPosition2 = new Cesium.SampledPositionProperty()
sampledPosition2.addSample(
  midTime,
  Cesium.Cartesian3.fromDegrees(-80.0, 45.0, 2000)
)
sampledPosition2.addSample(
  endTime,
  Cesium.Cartesian3.fromDegrees(-85.0, 50.0, 3000)
)

// 创建 CompositePositionProperty 实例
const compositePosition = new Cesium.CompositePositionProperty()

// 将两个 PositionProperty 添加到 CompositePositionProperty，并定义它们的有效时间区间
compositePosition.intervals.addInterval(
  new Cesium.TimeInterval({
    start: startTime,
    stop: midTime,
    data: sampledPosition1,
  })
)
compositePosition.intervals.addInterval(
  new Cesium.TimeInterval({
    start: midTime,
    stop: endTime,
    data: sampledPosition2,
  })
)

// 创建实体并将 CompositePositionProperty 赋值给 position 属性
const entity = viewer.entities.add({
  position: compositePosition,
  point: {
    pixelSize: 10,
    color: Cesium.Color.GREEN,
  },
})

// 设置视图到实体
viewer.zoomTo(entity)

// 通过 timeline 和 clock 演示位置变化
viewer.clock.startTime = startTime.clone()
viewer.clock.stopTime = endTime.clone()
viewer.clock.currentTime = startTime.clone()
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP // 循环
viewer.clock.multiplier = 10 // 时间流速倍率
```

### MaterialProperty 材质类型

`MaterialProperty` 定义了所有表示材质 `uniforms` 的属性对象的接口。

相对于其他类型，它也多了一个公共方法 `getType(time): string`，用于获取指定时间的材质类型。

常用的材质有:

1. `ColorMaterialProperty` 颜色类型;
2. `CompositeMaterialProperty` 组合多个材质类型;
3. `GridMaterialProperty` 网格图案类型;
4. `ImageMaterialProperty` 图像材质类型;
5. `PolylineGlowMaterialProperty` 折线类型;
6. `PolylineOutlineMaterialProperty` 折线轮廓类型;
7. `StripeMaterialProperty` 条纹图案类型;

从使用上来看同基本类型等都类似，但是由于材质的类型较多，本文并不会对所有的材质类型进行介绍，挑选几种旨在梳理总结其用法特点。具体可见官网 [MaterialProperty API](https://cesium.com/learn/ion-sdk/ref-doc/MaterialProperty.html)。

#### ColorMaterialProperty

`ColorMaterialProperty` 是一种颜色材质，可以设置颜色和透明度。

**使用方法**:

1. 创建 `ColorMaterialProperty` 实例。
2. 将 `ColorMaterialProperty` 赋值给实体的材质属性。

```js
// 创建 Cesium Viewer 实例
const viewer = new Cesium.Viewer('cesiumContainer')

// 创建 ColorMaterialProperty 实例
const colorMaterial = new Cesium.ColorMaterialProperty(Cesium.Color.RED)

// 创建实体并将 ColorMaterialProperty 赋值给材质属性
const entity = viewer.entities.add({
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArray([
      -115.0, 37.0, -115.0, 32.0, -107.0, 33.0, -102.0, 31.0, -102.0, 35.0,
    ]),
    material: colorMaterial,
  },
})

// 设置视图到实体
viewer.zoomTo(entity)
```

当然，可以结合之前的 `SampledProperty` 使得物体颜色随时间进行变化:

```js
// 创建 Cesium Viewer 实例
const viewer = new Cesium.Viewer('cesiumContainer')

// 定义颜色随时间变化
const startTime = Cesium.JulianDate.fromDate(new Date(2020, 2, 2, 12, 0, 0))
const endTime = Cesium.JulianDate.fromDate(new Date(2020, 2, 2, 12, 10, 0))

const colorProperty = new Cesium.SampledProperty(Cesium.Color)
colorProperty.addSample(startTime, Cesium.Color.RED)
colorProperty.addSample(
  Cesium.JulianDate.addMinutes(startTime, 5, new Cesium.JulianDate()),
  Cesium.Color.GREEN
)
colorProperty.addSample(endTime, Cesium.Color.BLUE)

// 创建 ColorMaterialProperty 实例
const colorMaterial = new Cesium.ColorMaterialProperty(colorProperty)

// 创建实体并将 ColorMaterialProperty 赋值给材质属性
const entity = viewer.entities.add({
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArray([
      -115.0, 37.0, -115.0, 32.0, -107.0, 33.0, -102.0, 31.0, -102.0, 35.0,
    ]),
    material: colorMaterial,
  },
})

// 设置视图到实体
viewer.zoomTo(entity)

// 通过 timeline 和 clock 演示颜色变化
viewer.clock.startTime = startTime.clone()
viewer.clock.stopTime = endTime.clone()
viewer.clock.currentTime = startTime.clone()
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP // 循环
viewer.clock.multiplier = 10 // 时间流速倍率
```

#### CompositeMaterialProperty

`CompositeMaterialProperty` 组合材质类型，用于设定各种材质在指定时间区间内的效果。

```js
const compositeMaterial = new Cesium.CompositeMaterialProperty()
compositeMaterial.intervals.addInterval(
  new Cesium.TimeInterval({
    start: startTime,
    stop: midTime,
    data: new Cesium.ColorMaterialProperty(Cesium.Color.RED),
  })
)
compositeMaterial.intervals.addInterval(
  new Cesium.TimeInterval({
    start: midTime,
    stop: endTime,
    data: new Cesium.ColorMaterialProperty(Cesium.Color.BLUE),
  })
)
```

### 其它类型

说是其它类型，但都是基于 `ReferenceProperty` 和 `CallbackProperty` 俩种。

#### ReferenceProperty

`ReferenceProperty` 是 Cesium 中用于引用其他实体属性的特殊属性类型。它允许一个实体的属性动态地引用另一个实体的属性，从而实现更复杂的关系和依赖。

**构造函数**:

`Cesium.ReferenceProperty(targetCollection, targetId, targetPropertyNames)`

- `targetCollection`: `EntityCollection` 类型，用于解析引用的实体集合。
- `targetId`: `string` 类型，被引用实体的 ID。
- `targetPropertyNames`: `Array<string>` 类型，目标实体上使用的属性名称数组。

**使用场景**:

1. 让一个实体的位置、方向等属性跟随另一个实体的属性变化;
2. 在多个实体之间创建动态依赖关系。

**使用方法**:

1. 创建被引用的实体。
2. 创建引用属性 (`ReferenceProperty`)。
3. 将引用属性赋值给引用实体的属性。

示例 1: 引用另一实体的位置。

```js
const viewer = new Cesium.Viewer('cesiumContainer')

// 创建被引用的实体
const referencedEntity = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(-75.0, 40.0, 1000),
  point: {
    pixelSize: 10,
    color: Cesium.Color.RED,
  },
})

// 创建引用属性
const positionReference = new Cesium.ReferenceProperty(
  viewer.entities,
  referencedEntity.id,
  ['position']
)

// 创建引用实体并将引用属性赋值给 position 属性
const referencingEntity = viewer.entities.add({
  position: positionReference,
  point: {
    pixelSize: 10,
    color: Cesium.Color.BLUE,
  },
})

// 设置视图到实体
viewer.zoomTo(viewer.entities)
```

示例 2: 引用另一个实体的颜色。

```js
const viewer = new Cesium.Viewer('cesiumContainer')

// 创建被引用的实体
const referencedEntity = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(-75.0, 40.0, 1000),
  point: {
    pixelSize: 10,
    color: Cesium.Color.RED,
  },
})

// 创建引用属性
const colorReference = new Cesium.ReferenceProperty(
  viewer.entities,
  referencedEntity.id,
  ['point', 'color']
)

// 创建引用实体并将引用属性赋值给 point 的 color 属性
const referencingEntity = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(-70.0, 35.0, 1000),
  point: {
    pixelSize: 10,
    color: colorReference,
  },
})

// 设置视图到实体
viewer.zoomTo(viewer.entities)
```

#### CallbackProperty

`CallbackProperty` 是 Cesium 中用于定义动态属性的工具。它允许你使用一个回调函数动态计算属性的值，这对于需要实时更新的属性特别有用，比如随时间变化的位置、颜色、大小等。

**构造函数**:

`Cesium.CallbackProperty(callback, isConstant)`

- `callback`: `Function` 类型，用于计算属性值的回调函数。
  该回调函数可以传入俩个参数:
  - `time`：`JulianDate`类型，检索值的时间。
  - `result`：可选，用于存储值的对象。如果省略，函数必须创建并返回一个新实例。
- `isConstant`: `Boolean` 类型，指示属性值是否始终不变，默认为 `false`。

**使用场景**:

1. 动态计算属性值;
2. 实现复杂的属性变化逻辑;
3. 属性值依赖于外部状态或条件。

**使用方法**:

1. 定义回调函数：计算属性值的函数;
2. 创建 `CallbackProperty` 实例：传入回调函数和一个标志参数;
3. 将 `CallbackProperty` 赋值给实体的属性。

```js
const viewer = new Cesium.Viewer('cesiumContainer')

const startTime = Cesium.JulianDate.now()
const speed = 100 // 米每秒

// 定义回调函数
function computePosition(time, result) {
  const seconds = Cesium.JulianDate.secondsDifference(time, startTime)
  const position = Cesium.Cartesian3.fromDegrees(
    -75.0 + seconds * 0.01,
    40.0 + Math.sin(seconds) * 0.1
  )
  return Cesium.Cartesian3.clone(position, result)
}

// 创建 CallbackProperty 实例
const positionProperty = new Cesium.CallbackProperty(computePosition, false)

// 创建实体并将 CallbackProperty 赋值给 position 属性
const entity = viewer.entities.add({
  position: positionProperty,
  point: {
    pixelSize: 10,
    color: Cesium.Color.RED,
  },
})

// 设置视图到实体
viewer.zoomTo(entity)
```
