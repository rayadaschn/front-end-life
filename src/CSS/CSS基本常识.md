---
title: CSS 基本常识
icon: style
date: 2023-03-10
category:
  - CSS
tag:
  - CSS

---

# CSS 基本常识

> 三读《CSS 世界》，记录一些基本常识笔记，以便加固理解。

## 基础内容

- 长度单位
  - 相对字体长度单位：`em` 、`rem`、`ch`（字符 0 的宽度）；
  - 现对视区长度单位： `vh`（视高）、`vw`（视宽）。

- 选择器
  - 类 选择器：“`.`” 开头；
  - ID 选择器：“`#`” 开头；
  - 属性选择器： 指含有“`[]`”选择器，如 `[title]{}`；
  - 伪类选择器： 指前面有一个英文冒号（`:`）
  - 伪元素选择器： 指前面有一个英文冒号（`::`），如： `::before`、`::after`。
- 关系选择器
  - 后代选择器： 空格连接；
  - 相邻后代选择器：`>` 连接；
  - 兄弟选择器：`~` 连接；
  - 相邻兄弟选择器：+连接。

- 块级元素

  `display` 为 `block`、`table`和如 `<li>`元素的 `list-item` 。

  代表: `<div>`、`<p>`、`<table>` 等

  块级元素具有换行特性，可以配合 `clear` 属性清除浮动带来的影响。

  -  `list-item`是标记盒子，专门用于存放圆点和数字这些项目符号。
  - 如行内块 `display：inline-block` ，实际上是由俩个盒子共同组成，一个内部块级的“容器盒子”和一个外部的内联级的外在盒子共同组成。

- 内联元素

  `display` 为`inline`、 `inline-bloc` 和 `inline-table`。

  如： `<span>`、 `<button>` 、 `<img>` 、`<em>`

  需要注意的是，内联盒子模型中，存在一个幽灵空白节点，在 `line-height` 和 `vertical-align` 影响巨大。

## width 宽度特性

- `width:auto` 特性

  - 充分利用可用空间
  - 收缩与包裹
  - 收缩到最小
  - 超出容器限制

  `width` 宽度是加在 `content box`内容盒子上的。

  包裹性实用案例:

  页面某个模块文字内容是动态的，希望文字较少时居中显示，文字超过一行时局左显示：

  ```css
  /* 方案一 */
  .box {
    text-align: center;
  }
  .content {
    display: inline-block;
    text-align: left;
  }
  ```

  ```css
  /* 方案二 css3 fit-content */
  .content {
    width: fit-content;
    margin: auto;
  }
  ```

  > `fit-content` 相当于紧身裤，内容多宽，盒子就多宽。
  >
  > 优点: 保留了 `display` 的计算值，让尺寸有了确定的值。

- `box-sizing: border-box` 

  `width` 的宽度最终是施加于 `content box` 内容盒子上。影响盒子的大小可以用 css3 中的 `box-sizing` 改变，或者用 “宽度分离” ，在外部增加一个设置宽度确定的父级元素。

  一般而言，需要重置 `width` 宽度的为：

  ```css
  input, textarea, img, video, object{
    box-sizing: border-box;
  }
  ```

## height 高度特性

- 百分比%

`width` 宽度就算父元素 `width:auto` ，其百分比也是支持的。但是对于 `height` ，百分比高度必须其父级有一个可以生效的高度值！

> 为何父元素高度不指定，子元素的百分比无法渲染计算？这是由浏览器渲染原理造成的。
>
> 浏览器首先，先下载文档内容，加载头部样式资源。然后，**按照从上而下、自外而内的顺序渲染 DOM 内容。即，先渲染父级元素，后渲染子集元素。**
>
> 对于宽度而言，父级元素是先以子元素的占位宽度为加载宽度的，等到子元素渲染时，`width：100%`，便会继承该宽度，多元素宽度叠加超过了父元素宽度，则造成溢出。
>
> 对于高度而言，父级元素的高度没有显示指定（高度由内容决定），并且该元素不是绝对定位，则计算值为 `auto`，因此，子元素的高度用 百分比无法计算。

解决办法:

1. 设定显示高度值；
2. 使用绝对定位。绝对定位的宽高百分比是基于 `padding box`，非绝对定位则是基于 `content box`。

`min-width`、`min-height` 初始值是 `auto`；`min-width`、`min-width`初始值是 `none`。

它们的覆盖值超越 `!important` 。

应用实例，点击按钮，高度动画展开：

```css
.element{
  max-height: 0;
  overflow: hidden;
  transition: max-height .25s;
}
.element.active {
  max-height: 100px;
}
```

> 注意，此处的展开高度应设置的足够小。在回收缩放的时候，使得延迟难以察觉。

## 替换元素 和 非替换元素

替换元素的定义是通过修改某个属性值呈现的内容就可以被替换的元素。如： `<img>`、`<video>`、`<iframe>`和表单元素`<textarea>`和`<input>`都是替换元素。

替换元素的特性：

- 内容的外观不受页面上的 CSS 影响；
- 拥有自己的尺寸，可能为 0；
- 在很多 CSS 属性上拥有自己的一套表现规则：`vertical-align` 非替换元素为字符`x`的下边缘，而替换元素的基线为元素的下边缘。













