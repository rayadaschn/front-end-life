---
title: Tailwind 布局
date: 2023-07-26
icon: style
category:
  - CSS
tag:
  - CSS
---

> 本文记录一些常用的布局书写方式，以作查漏补缺。

## 容器

| Class     | Breakpoint   | Properties         |
| :-------- | :----------- | :----------------- |
| container | None         | width: 100%;       |
|           | sm (640px)   | max-width: 640px;  |
|           | md (768px)   | max-width: 768px;  |
|           | lg (1024px)  | max-width: 1024px; |
|           | xl (1280px)  | max-width: 1280px; |
|           | 2xl (1536px) | max-width: 1536px; |

- 容器居中：mx-auto
- 添加水平内边距：px-{size}
- 响应式变体，如只在某个断点上表现出差异：

  ```html
  <!-- Full-width fluid until the `md` breakpoint, then lock to container -->
  <div class="md:container md:mx-auto">
    <!-- ... -->
  </div>
  ```

- 自定义容器在默认情况下居中。通过配置 `theme.container` 部分将 `center` 设置为 `true`：

  ```js
  // tailwind.config.js
  module.exports = {
    theme: {
      container: {
        center: true,
      },
    },
  }
  ```

## Box Sizing

设置盒子类型会和原生有一点不同，由 box 开头：

| Class       | Properties               |
| :---------- | :----------------------- |
| box-border  | box-sizing: border-box;  |
| box-content | box-sizing: content-box; |

## Display 常用布局

| Class              | Properties                   |
| :----------------- | :--------------------------- |
| **block**          | **display: block;**          |
| **inline-block**   | **display: inline-block;**   |
| **inline**         | **display: inline;**         |
| **flex**           | **display: flex;**           |
| inline-flex        | display: inline-flex;        |
| table              | display: table;              |
| inline-table       | display: inline-table;       |
| table-caption      | display: table-caption;      |
| table-cell         | display: table-cell;         |
| table-column       | display: table-column;       |
| table-column-group | display: table-column-group; |
| table-footer-group | display: table-footer-group; |
| table-header-group | display: table-header-group; |
| table-row-group    | display: table-row-group;    |
| table-row          | display: table-row;          |
| flow-root          | display: flow-root;          |
| grid               | display: grid;               |
| inline-grid        | display: inline-grid;        |
| contents           | display: contents;           |
| list-item          | display: list-item;          |
| **hidden**         | **display: none;**           |

## 浮动

浮动在现代布局中用的较少了，但是也有其存在的必要。浮动较为好记，直接用 `-` 进行连接即可。

| Class       | Properties    |
| :---------- | :------------ |
| float-right | float: right; |
| float-left  | float: left;  |
| float-none  | float: none;  |

有浮动，自然也有清除浮动，记忆方法同上，但一般都是用 `clear-both`：

| Class       | Properties    |
| :---------- | :------------ |
| clear-left  | clear: left;  |
| clear-right | clear: right; |
| clear-both  | clear: both;  |
| clear-none  | clear: none;  |

## Position 定位

Position 定位非常便捷，直接书写 potion 的值即可：

| Class    | Properties          |
| :------- | :------------------ |
| static   | position: static;   |
| fixed    | position: fixed;    |
| absolute | position: absolute; |
| relative | position: relative; |
| sticky   | position: sticky;   |

## Top / Right / Bottom / Left

控制定位元素的位置，这个类名较多一般是根据元素值去查表，推荐 VScode 插件来进行书写。

通用公式：`{top|right|bottom|left|inset}-{number}`

若是负值，减号在类名前面：`-{top|right|bottom|left|inset}-{number|string}`

## visibility 可见性

同定位元素一样，直接书写 visibility 的值：

| Class     | Properties           |
| :-------- | :------------------- |
| visible   | visibility: visible; |
| invisible | visibility: hidden;  |

区别于 `display: none`，DOM 元素依旧会存在但是不显示。

## z-index 层叠顺序

层叠顺序也较好记忆：`z-{index}`

## flex 弹性盒子

如上文 Position 所写一样，首先父元素要先设置为 `fixed`，变为弹性盒子。

弹性盒子共分为俩部分，父元素控制整体布局，子元素控制元素细节。可见 [《弹性布局 Flex》](FlexboxLayoutTechniques)
