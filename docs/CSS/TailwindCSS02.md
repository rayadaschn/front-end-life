---
title: Tailwind 02 布局
date: 2023-07-26
icon: style
category:
  - CSS
tag:
  - CSS
---

> 本文梳理记录一些 Tailwind 常用的布局书写方式，以作查漏补缺。
> 内容较多，无需一次性全部记忆，但要有所印象。

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

### 父元素整体布局设置

先回顾一下原先到布局设置:

1. **flex-direction** 属性与整体布局方向。

   ```css
   flex-direction: row | row-reverse | column | column-reverse;
   ```

2. **flex-wrap** 属性与整体布局的换行表现。

   ```css
   flex-wrap: nowrap | wrap | wrap-reverse;
   ```

3. **flex-flow** 属性是 **flex-direction** 和 flex-wrap 的缩写。

- 在 Tailwind 中 flex 控制子项的方向 flex-direction 变化较大，直接省略了 direction 转而拼接值；此外 column 也采用缩写 col：

  | Class            | Properties                      |
  | :--------------- | :------------------------------ |
  | flex-row         | flex-direction: row;            |
  | flex-row-reverse | flex-direction: row-reverse;    |
  | flex-col         | flex-direction: column;         |
  | flex-col-reverse | flex-direction: column-reverse; |

- 控制整体是否换行 flex-wrap 同 direction 一样是略去 wrap 关键词直接拼接值：

  | Class             | Properties               |
  | :---------------- | :----------------------- |
  | flex-wrap         | flex-wrap: wrap;         |
  | flex-wrap-reverse | flex-wrap: wrap-reverse; |
  | flex-nowrap       | flex-wrap: nowrap;       |

### 对齐特性

实际上，Tailwind 对齐这一部分同 Grid 网格布局是同享的，先看原先对齐的几个属性值：

1. **justify-content** 属性与整体布局的水平对齐

   ```css
   justify-content: normal | flex-start | flex-end | center | space-between |
     space-around | space-evenly;
   ```

2. 垂直对齐属性 **align-items** 与 **align-self**

   **区别:** **align-self**属性是设置在具体的**某一个 flex 子项**上的，而**align-items**属性是设置**在 flex 容器元素上**的，控制所有 flex 子项的垂直对齐方式。

   ```css
   align-items: stretch | flex-start | flex-end | center | baseline;

   align-self: auto | stretch | flex-start | flex-end | center | baseline;
   ```

   - **auto**是**align-self 属性的默认值**，表示 flex 子项的垂直对齐 方式是由 flex 容器的 align-items 属性值决定的。
   - **stretch**可以看成弹性布局中**align-items 属性的默认值**，表示 flex 子项在垂直方向上拉伸。

3. **align-content** 属性与整体布局的垂直对齐

   **区别:** **align-content** 属性和 **align-items** 属性的区别在于 **align-items** 属性设置的是每一个 **flex** 子项的垂直对齐方式，而 **align-content** 属性将 **所有 flex 子项作为一个整体进行垂直对齐设置**。

   ```css
   align-content: stretch | flex-start | flex-end | center | space-between |
     space-around | space-evenly;
   ```

4. **order** 属性与单个子项的顺序控制

   ```css
   order: <integer>; /* 整数值，默认值是 0 */
   ```

在 Tailwind 中有如下变动:

- justify-content 用于 flex 和 grid 沿容器整体布局的水平对齐方向：

  | Class           | Properties                      |
  | :-------------- | :------------------------------ |
  | justify-start   | justify-content: flex-start;    |
  | justify-end     | justify-content: flex-end;      |
  | justify-center  | justify-content: center;        |
  | justify-between | justify-content: space-between; |
  | justify-around  | justify-content: space-around;  |
  | justify-evenly  | justify-content: space-evenly;  |

- align-content 用于 flex 和 grid 多行沿容器整体布局的垂直对齐方向：

  | Class           | Properties                    |
  | :-------------- | :---------------------------- |
  | content-center  | align-content: center;        |
  | content-start   | align-content: flex-start;    |
  | content-end     | align-content: flex-end;      |
  | content-between | align-content: space-between; |
  | content-around  | align-content: space-around;  |
  | content-evenly  | align-content: space-evenly;  |

- align-items 用于 flex 和 grid 各单行沿容器整体布局的垂直对齐方向：

  | Class          | Properties               |
  | :------------- | :----------------------- |
  | items-start    | align-items: flex-start; |
  | items-end      | align-items: flex-end;   |
  | items-center   | align-items: center;     |
  | items-baseline | align-items: baseline;   |
  | items-stretch  | align-items: stretch;    |

- align-self 用于 flex 和 grid 单个子项沿容器的垂直对齐方向：

  | Class         | Properties              |
  | :------------ | :---------------------- |
  | self-auto     | align-self: auto;       |
  | self-start    | align-self: flex-start; |
  | self-end      | align-self: flex-end;   |
  | self-center   | align-self: center;     |
  | self-stretch  | align-self: stretch;    |
  | self-baseline | align-self: baseline;   |

### flex 属性

flex 属性是 flex-grow、flex-shrink 和 flex-basis 这 3 个属性的缩写。

`flex:auto` 等同于 `flex: 1 1 auto` , 作用为 **flex** 子项自动填满剩余空间或自动收缩;

`flex:none` 等同于 `flex:0 0 auto` , 作用为 **flex** 子项没有弹性, 涉河固定尺寸元素(无需设置**width**属性)。

### flex-grow

| Class       | Properties    |
| :---------- | :------------ |
| flex-grow-0 | flex-grow: 0; |
| flex-grow   | flex-grow: 1; |

### flex-shrink

| Class         | Properties      |
| :------------ | :-------------- |
| flex-shrink-0 | flex-shrink: 0; |
| flex-shrink   | flex-shrink: 1; |

### 属性缩写

属性缩写介绍，可见 [《弹性布局 Flex》](FlexboxLayoutTechniques)。

| Class        | abbreviation   | Properties      |
| :----------- | :------------- | :-------------- |
| flex-1       | flex: 1;       | flex: 1 1 0%;   |
| flex-auto    | flex: auto;    | flex: 1 1 auto; |
| flex-initial | flex: initial; | flex: 1 1 auto; |
| flex-none    | flex: none;    | flex: none;     |
