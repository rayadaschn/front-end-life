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

## HTML

HTML 考察较少，内容不多。

### 如何理解 HTML 语义化？

  <details>
    <summer>

1. 让人更易读懂，增加代码的可读性；
2. 让搜索引擎更易读懂（SEO）。

</summer>

  </details>

### **块状元素**和**内联元素**有哪些？

  <details>
    <summer>

      1. 块状元素：`display: block/table`，有 div、h1、h2、table、ul、ol、p 等。
      2. 内联元素：`display: inline/inline-block`，有 span、img、input、button 等。


    </summer>

  </details>

## CSS 布局

### 盒模型的宽度计算

offsetWidth = （内容宽度 + 内边距 + 边距），无外边距。

实际上是看 `box-sizing`，默认为 `content-box`，可改为 `border-box`。

### BFC 的理解和应用

全称是 Block format context, 块级格式化上下文。独立渲染一块区域，内部元素的渲染不会影响边界以外的元素。

常见形成条件：

1. float 不是 none;
2. position 是 absolute 或 fixed;
3. overflow 不是 visible 或 clip 的块级元素。
4. display 是 flex、inline-block 等。

常见应用是清除浮动。

```css
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
```

:::TiP
原理: 后添加一个空值，且 display 为 table 类型触发 BFC，而后 clear 清除浮动影响。
:::

### float 布局的问题

圣杯布局和双飞翼布局的目的：

1. 三栏布局，中间一栏的内容最先加载和渲染；
2. 俩侧内容固定，中间内容岁宽度自适应；
3. 一般用于 PC 网页。

实现的技术要点：

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

::: Tip
圣杯布局中，right 只用到了 `margin-right: -150px` 将自身宽度给抵消了。因此依据浮动的原理，不占据位置直接上浮。
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

::: Tip
双飞翼布局中，需要多用一个 div 盒子包裹主体内容，使其具有延展性。同时也用到了`margin` 负值将自身宽度给抵消了。

同圣杯的区别，双飞翼将俩侧撑开是用的 margin，而圣杯是用 padding。
:::

### flex 布局实现一个三点色子

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
