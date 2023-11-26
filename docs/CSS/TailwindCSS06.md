---
title: Tailwind 06 边框
date: 2023-06-28
icon: style
category:
  - CSS
tag:
  - CSS
---

## 基本规律

关于常见的"border"类名规律：

- 边框粗细（Border Width）：可以使用类名格式为"`border-<width>`"来设置边框的粗细。例如，"`border`"表示默认宽度的边框，"`border-2`"表示 2 个像素宽度的边框。

- 边框颜色（Border Color）：可以使用类名格式为"`border-<color>`"来设置边框的颜色。例如，"`border-red-500`"表示应用红色系列的边框颜色。

- 边框样式（Border Style）：可以使用类名格式为"`border-<style>`"来设置边框的样式，如实线、虚线等。例如，"`border-dashed`"表示使用虚线边框样式。

- 圆角边框（Border Radius）：可以使用类名格式为"`rounded-<size>`"来设置边框的圆角效果。例如，"`rounded`"表示默认圆角边框，"`rounded-lg`"表示更大程度的圆角边框。

## Border Width 边框粗细

常见的"border-width"类名规律：

- 边框宽度（Border Width）：可以使用类名格式为"`border-<size>`"来设置边框的宽度。例如，"`border`"表示默认宽度的边框，"`border-2`"表示 2 个像素宽度的边框。

- 特定方向的边框宽度（Specific Directions）：如果你只想应用边框到特定的方向，可以使用特定方向的类名来设置边框宽度。这些类名的格式为"`border-<direction>-<size>`"。例如，"`border-l-4`"表示只在左侧应用 4 个像素宽度的边框。

- 上、下、左、右边框宽度（Individual Sides）：可以使用单独边框宽度的类名设置仅限于上、下、左、右边的边框宽度。这些类名的格式为"`border-<side>-<size>`"。例如，"`border-t-2`"表示仅应用 2 个像素宽度的顶部边框。

部分对照表：

| Class      | Properties                                       |
| ---------- | ------------------------------------------------ |
| border-0   | border-width: 0px;                               |
| border-2   | border-width: 2px;                               |
| border-4   | border-width: 4px;                               |
| border-8   | border-width: 8px;                               |
| border     | border-width: 1px;                               |
| border-x-0 | border-left-width: 0px; border-right-width: 0px; |

## Border Color 边框颜色

"border-color"类名规律：

- 边框颜色（Border Color）：可以使用类名格式为"`border-<color>`"来设置边框的颜色。例如，"`border-red-500`"表示应用红色系列的边框颜色。

- 不透明度（Opacity）：你还可以使用不透明度类名来调整边框的透明度。这些类名的格式为"`border-<color>/<value>`"，其中"value"可以是从 0 到 100 的整数值。例如，"`border-indigo-500/50`"表示边框透明度为 50%。

- 特定方向的边框颜色：类名格式为 "`border-<side>-<color>`"。例如，“`border-t-indigo-500`”表示顶部边框有颜色。

- 自定义边框颜色：

  ```html
  <button class="border-[#243c5a]">
    <!-- 意为 border-color: #243c5a; -->
  </button>
  ```

## Border Style 边框样式

格式为：`border-{style}`

| Class         | Properties            |
| ------------- | --------------------- |
| border-solid  | border-style: solid;  |
| border-dashed | border-style: dashed; |
| border-dotted | border-style: dotted; |
| border-double | border-style: double; |
| border-hidden | border-style: hidden; |
| border-none   | border-style: none;   |

## Border Radius 圆角边框

设置边框圆角的规则较多，大体可以分为如下几种情况：

- 圆角边框（Border Radius）：可以使用类名格式为"`rounded-<size>`"来设置边框的圆角效果。例如，"`rounded`"表示默认圆角边框，"`rounded-lg`"表示更大程度的圆角边框。

- 特定方向的圆角边框（Specific Directions）：除了整体圆角边框外，还可以使用特定方向的类名来控制某个方向的圆角边框。这些类名的格式为"`rounded-<direction>-<size>`"。例如，"`rounded-tl-lg`"表示左上角（top left）有更大程度的圆角。

- 椭圆形边框（Ellipse）：通过使用类名"rounded-full"，可以将元素的边框变成椭圆形，使其看起来是一个圆形。

部分对照表：

| Class        | Properties                                                           |
| :----------- | :------------------------------------------------------------------- |
| rounded-none | border-radius: 0px;                                                  |
| rounded-sm   | border-radius: 0.125rem; /_ 2px _/                                   |
| rounded      | border-radius: 0.25rem; /_ 4px _/                                    |
| rounded-md   | border-radius: 0.375rem; /_ 6px _/                                   |
| rounded-t-sm | border-top-left-radius: 0.125rem; border-top-right-radius: 0.125rem; |
