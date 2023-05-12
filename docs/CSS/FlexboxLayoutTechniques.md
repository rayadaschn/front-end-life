---
title: 弹性布局 flex
date: 2023-02-12
icon: style
category:
  - CSS
tag:
  - CSS
---

# 弹性布局 flex

> 读《CSS 新世界》flex 布局篇笔记

## 子项特性

1. flex 子项块转化
2. flex 子项浮动失效
3. flex 子项支持 z-index 属性
4. **flex 子项的 margin 值不会合并**
5. flex 子项是格式化的尺寸
6. flex 子项若被绝对定位，则会脱离弹性布局

## 布局设置

1. **flex-direction** 属性与整体布局方向

   ```css
   flex-direction: row | row-reverse | column | column-reverse;
   ```

2. **flex-wrap** 属性与整体布局的换行表现

   ```css
   flex-wrap: nowrap | wrap | wrap-reverse;
   ```

3. **flex-flow** 属性是 **flex-direction** 和 flex-wrap 的缩写

## css 对齐特性综述

通用描述性:

- **justify** 表示水平方向的样式设置;
- **align** 表示垂直方向的样式设置;
- **items** _(有 s)_ 表示**全体元素**的样式设置;
- **content** 表示**整体布局**的样式设置;
- **self** 表示元素自身的样式设置，其一定是应用在子元素上的。

> **_重要提示：_**
>
> **justify-content 属性 表示整体布局的水平对齐设置；**
>
> **align-items 属性 表示全体元素的垂直对齐样式设置。**

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

## 深入理解 flex 属性

**flex 属性是 flex-grow、flex-shrink 和 flex-basis 这 3 个属性的缩写。**

`flex:auto` 等同于 `flex: 1 1 auto` , 作用为 **flex** 子项自动填满剩余空间或自动收缩;

`flex:none` 等同于 `flex:0 0 auto` , 作用为 **flex** 子项没有弹性, 涉河固定尺寸元素(无需设置**width**属性)。

**语法：**

```css
flex: auto;
flex: none;
flex: <'flex-grow'> <'flex-shrink'>? || <'flex-basis'>

flex-grow: <number>; /* 数值，可以是小数，默认值是 0 */
flex-shrink: <number>; /* 数值，默认值是 1 */
flex-basis: <length> | auto; /* 默认值是 auto */
```

**【注】只有 flex-basis 的属性值支持长度值**

| 单值语法<img width=200/> | 等同于<img width=200/> | 备注                                                                                                                                                                                              |
| ------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **flex: initiate**       | **flex: 0 1 auto**     | 初始值, 通常用来还原已经设置的 CSS 属性,常用于**希望元素尺寸收缩**，同时**元素内容较多又能自动换行**的场景中可以不做任何 flex 属性设置。                                                          |
| flex: 0                  | flex: 0 1 0%           | 使用场景少，**元素尺寸表现为最小内容宽度。** 适用于: 元素内容的主体是替换元素，这种情况下文字内容就会被包围在替换元素的宽度下。                                                                   |
| **flex: none**           | **flex: 0 0 auto**     | 推荐，**元素最终尺寸通常表现为最大内容宽度。** 适合设置在内容不能换行显示的小控件元素上，如按钮。                                                                                                 |
| **flex: 1**              | **flex: 1 1 0%**       | 推荐，**在容器尺寸不足时会优先最小化内容尺寸**，常用于等分列表或等比例列表。                                                                                                                      |
| flex: auto               | flex: 1 1 auto         | 适用场景少, 但很有用。**在容器尺寸不足时会优先最大化内容尺寸。** 多用于内容固定和内容可控的布局场景，例如**导航数量不固定且每个导航文字数量也不固定**的导航效果。**适合基于内容动态适配的布局。** |

### flex-basis 属性与尺寸计算规则：

**最大最小尺寸限制 > 弹性增长或收缩 > 基础尺寸**

## \* 弹性布局最后一行不对齐的处理

**通用思路: 使用足够的空白标签进行填充占位，具体的占位数量是由最多列数的个数决定的。**

1. **若每一行列数固定**

   A. 模拟 **`space-between`** 属性值和间隙大小，也就是说，我们不使用`justify-content:space-between`声明模拟两 端对齐效果，而使用 margin 对最后一行内容中出现的间隙进行控制。

   ```css
   .container {
     display: flex;
     flex-wrap: wrap;
   }
   .list {
     width: 24%;
     height: 100px;
     background-color: skyblue;
     margin-top: 15px;
   }
   .list:not(:nth-child(4n)) {
     margin-right: calc(4% / 3);
   }
   ```

   B. 根据元素的个数给最后一个元素设置动态 margin 值。

   ```css
   .container {
     display: flex;
     /* 两端对齐 */
     justify-content: space-between;
     flex-wrap: wrap;
   }
   .list {
     width: 24%;
     height: 100px;
     background-color: skyblue;
     margin-top: 15px;
   }
   /* 如果最后一行是3个元素 */
   .list:last-child:nth-child(4n - 1) {
     margin-right: calc(24% + 4% / 3);
   }
   /* 如果最后一行是2个元素 */
   .list:last-child:nth-child(4n - 2) {
     margin-right: calc(48% + 8% / 3);
   }
   ```

2. **若 flex 子项宽度不固定 (常用)**

   A. 给最后一项设置 `margin-right:auto`

   ```css
   .container {
     display: flex;
     justify-content: space-between;
     flex-wrap: wrap;
   }
   .list {
     background-color: skyblue;
     margin: 10px;
   }
   /* 最后一项margin-right:auto */
   .list:last-child {
     margin-right: auto;
   }
   ```

   B. 使用伪元素在列表的末尾创建一个 flex 子项，并设置 `flex:auto` 或设置 `flex:1`

   ```css
   .container {
     display: flex;
     justify-content: space-between;
     flex-wrap: wrap;
   }
   .list {
     background-color: skyblue;
     margin: 10px;
   }
   /* 使用伪元素辅助左对齐 */
   .container::after {
     content: "";
     flex: auto; /* 或者flex: 1 */
   }
   ```

3. **若每一行列数不固定**

   通用思路, 利用空白标签进行占位填充:

   ```html
   <div class="container">
     <div class="list"></div>
     <div class="list"></div>
     <div class="list"></div>
     <div class="list"></div>
     <div class="list"></div>
     <div class="list"></div>
     <div class="list"></div>
     <i></i><i></i><i></i><i></i><i></i>
   </div>
   <style>
     .container {
       display: flex;
       justify-content: space-between;
       flex-wrap: wrap;
       margin-right: -10px;
     }
     .list {
       width: 100px;
       height: 100px;
       background-color: skyblue;
       margin: 15px 10px 0 0;
     }
     /* 与列表元素一样的元素宽度和margin值 */
     .container > i {
       width: 100px;
       margin-right: 10px;
     }
   </style>
   ```

4. 若列数不固定且 HTML 又无法调整: 改用 Grid 布局
