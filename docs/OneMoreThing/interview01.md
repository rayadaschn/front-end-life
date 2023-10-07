---
title: Interview -- HTML&CSS
icon: note
date: 2023-07-23
category:
  - anonymous
tag:
  - note
star: false
# sticky: true
sticky: false
---

在此系列中开始梳理前端的面试体系内容。

## 目录

1. 如何理解 HTML 语义化？
2. [块状元素和内联元素有哪些？](#块状元素和内联元素有哪些)
3. [盒模型的宽度计算](#盒模型的宽度计算)
4. [BFC 的理解和应用](#4)
5. [float 布局的问题](#5)
6. [flex 布局实现一个三点色子](#6)
7. [absolute 和 relative 定位问题](#7)
8. [居中定位问题](#居中定位问题)
9. [rem 是什么?](#9)
10. [property 和 attribute 有什么区别](#10)

## HTML

HTML 考察较少，内容不多。

### 如何理解 HTML 语义化？ <span id='1' />

1. 让人更易读懂，增加代码的可读性；
2. 让搜索引擎更易读懂（SEO）。

### 块状元素和内联元素有哪些?

1. 块状元素：`display: block/table`，有 div、h1、h2、table、ul、ol、p 等。
2. 内联元素：`display: inline/inline-block`，有 span、img、input、button 等。

## CSS 布局

### 盒模型的宽度计算

offsetWidth = （内容宽度 + 内边距 + 边距），无外边距。

实际上是看 `box-sizing`，默认为 `content-box`，可改为 `border-box`。

### BFC 的理解和应用 <span id='4' />

全称是 Block format context, 块级格式化上下文。独立渲染一块区域，内部元素的渲染不会影响边界以外的元素。

常见形成条件：

1. float 不是 none;
2. position 是 absolute 或 fixed;
3. overflow 不是 visible 或 clip 的块级元素。
4. display 是 flex、inline-block 等。

常见应用是清除浮动。

```css
.clearFix:after {
  content: '';
  display: table;
  clear: both;
}
```

::: tip

原理: 后添加一个空值，且 display 为 table 类型触发 BFC，而后 clear 清除浮动影响。

:::

### float 布局的问题 <span id='5' />

圣杯布局和双飞翼布局的目的：

1. 三栏布局，中间一栏的内容最先加载和渲染；
2. 俩侧内容固定，中间内容岁宽度自适应；
3. 一般用于 PC 网页。

圣杯布局实现的技术要点：

- 使用 float 布局；
- 俩侧使用 margin 负值，以便和中间内容横向重叠；
- 防止中间内容被俩侧覆盖，一个用 padding，一个用 margin。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>圣杯布局</title>
    <style>
      body {
        min-width: 650px;
      }
      #header {
        text-align: center;
        background-color: green;
      }
      .container {
        padding-left: 200px;
        padding-right: 150px;
      }
      #center {
        background-color: blue;
        width: 100%;
      }
      .container .column {
        float: left;
      }
      #left {
        position: relative;
        right: 200px;
        background-color: pink;
        width: 200px;
        margin-left: -100%;
      }
      #right {
        background-color: yellow;
        width: 150px;
        margin-right: -150px;
      }
      #footer {
        clear: both;
        background-color: green;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div id="header">--- 圣杯布局 ---</div>
    <div class="container">
      <div id="center" class="column">中间内容</div>
      <div id="left" class="column">圣杯左侧</div>
      <div id="right" class="column">圣杯右侧</div>
    </div>
    <div id="footer">--- 尾部 ---</div>
  </body>
</html>
```

::: tip

圣杯布局中，right 只用到了 `margin-right: -150px` 将自身宽度给抵消了。因此依据浮动的原理，不占据位置直接上浮。

- margin 属性的百分比值是相对于父元素的宽度（width）来计算的。
- 左侧布局说明:

  - `width: 200px; margin-left: -100%;` 使得左元素覆盖到中间元素的左侧开头;
  - `position: relative; right: 200px;` 使元素向左移动自身宽度距离（亦可 `left: -200xp;`）。

:::

```html
<!DOCTYPE html>
<html>
  <head>
    <title>双飞翼</title>
    <style type="text/css">
      body {
        min-width: 650px;
      }
      #header {
        text-align: center;
        background-color: green;
      }
      .col {
        float: left;
      }
      #main {
        width: 100%;
        background: blue;
        background: #aaccdd;
      }
      #inner {
        margin: 0 200px 0 100px;
      }
      #left {
        width: 100px;
        background: red;
        margin-left: -100%;
      }
      #right {
        width: 200px;
        background: green;
        margin-left: -200px;
      }

      #footer {
        clear: both;
        background-color: green;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div id="header">--- 圣杯布局 ---</div>

    <div id="main" class="col">
      <div id="inner">main</div>
    </div>
    <div id="left" class="col">left</div>
    <div id="right" class="col">right</div>

    <div id="footer">--- 尾部 ---</div>
  </body>
</html>
```

::: tip

双飞翼布局中，需要多用一个 div 盒子包裹主体内容，使其具有延展性。同时也用到了`margin` 负值将自身宽度给抵消了。

两者的区别，双飞翼将俩侧撑开是中间主体盒子用的 margin 撑出两侧，因此右盒子是 margin-left 负值；

而圣杯是共同的外部盒子用 padding 撑出俩侧，因此右盒子是用 margin-right 负值将自身宽度给去除。

:::

### flex 布局实现一个三点色子 <span id='6' />

![色子三点](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202307232214664.png)

flex 常见语法：

- flex-direction
- justify-content
- align-item
- flex-wrap
- align-self

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>色子三点</title>
    <style>
      body {
        min-width: 650px;
      }

      .box {
        width: 200px;
        height: 200px;
        border: 2px solid #ccc;
        border-radius: 10px;
        padding: 20px;

        display: flex;
        justify-content: space-between;
      }
      .item {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #666;
      }

      .item:nth-child(2) {
        align-self: center;
      }

      .item:nth-child(3) {
        align-self: flex-end;
      }
    </style>
  </head>
  <body>
    <div class="box">
      <span class="item"></span>
      <span class="item"></span>
      <span class="item"></span>
    </div>
  </body>
</html>
```

### absolute 和 relative 定位问题 <span id='7' />

- relative 依据自身定位
- absolute 依据最近一层的定位元素定位，定位元素即 absolute、relative、fixed，若都没有则依据 body 进行定位。

### 居中定位问题

水平居中:

- inline 元素: `text-align:center`
- block 元素: `margin: auto`
- absolute 元素: left: 50% + margin-left 负自身一半宽度

垂直居中：

- inline 元素：line-height 的值等于 heigh 值（实际上只设置 line-height 行高即可）；
- absolute 元素： top：50% + margin-top 负自身一半高度；
- absolute 元素：`transform(-50%, -50%)`;
- absolute 元素：`top,left,bottom,right = 0` + `margin: auto`

更多可查看在另外一篇的总结 [《多种方式实现居中》](../CSS/DifferentMethodsToAchieveCentering)

### rem 是什么? <span id='9' />

- px：绝对长度单位；
- em：现对长度单位，现对于父元素；
- rem：相对长度单位，相对于根元素 html，响应式布局。

响应式布局的常见方案：media-query，根据不同的屏幕宽度设置根元素 font-size，而后用 rem，基于根元素的相对单位。

网页的视口宽度:

- 屏幕高度: `window.screen.height`
- 网页视口高度: `window.innerHeight`
- body 高度: `document.body.clientHeight`

### property 和 attribute 有什么区别 <span id='10' />

在 HTML 中，"property"（属性）和"attribute"（特性）也是两个相关但不完全相同的概念。它们在 HTML 中的含义和用法略有不同。

属性（Property）：
属性是 DOM 元素对象的成员，可以通过 JavaScript 访问和操作。在 HTML 中，属性是元素在 DOM 中对应的 JavaScript 对象的属性。属性通常反映了元素的当前状态或值，可以读取和修改。

例如，考虑以下 HTML 元素：

```html
<input type="text" id="myInput" value="Hello" />
```

在 JavaScript 中，我们可以通过 `id` 属性和 `value` 属性来访问和修改该元素的属性：

```javascript
const inputElement = document.getElementById('myInput')
console.log(inputElement.value) // 输出 "Hello"
inputElement.value = 'New Value' // 修改 value 属性的值
```

在这个例子中，`value` 是元素的属性，可以通过 JavaScript 对象的属性访问和修改。

特性（Attribute）：
特性是 HTML 元素在 HTML 标记中定义的附加信息，反映了元素的初始状态或设置。特性在 HTML 中以字符串形式表示，并包含在元素的标记中。特性可以影响元素的行为、样式、标识等。

例如，在以下 HTML 元素中：

```html
<input type="text" id="myInput" value="Hello" />
```

`type`、`id` 和 `value` 都是元素的特性。这些特性提供了关于元素的附加信息，如输入框的类型、唯一标识符和初始值。

需要注意的是，特性和属性之间并不总是一一对应。某些特性在 DOM 对象中没有相应的属性，而某些属性是通过特定的 DOM 接口提供的，而不是直接映射到 HTML 的特性。

在一些情况下，特性和属性的值是同步的，当特性值发生变化时，属性值也会相应更新。但是，这种同步并非始终如此，特别是在使用 JavaScript 动态修改属性或特性时，它们之间的同步可能会有所不同。

总结：
在 HTML 中，Property 属性是 DOM 元素对象的属性，可以通过 JavaScript 访问和操作，而特性是元素在 HTML 标记中定义的附加信息，反映了元素的初始状态或设置。属性是 JavaScript 对象的一部分，特性是 HTML 标记的一部分。属性通常用于表示元素的当前状态，而特性用于提供元素的初始设置或附加信息。
