---
title: Lwss 快速 复盘
date: 2024-03-24
icon: style
category:
  - CSS
tag:
  - CSS
sticky: false
---

此前快速复盘过一轮 [Scss](./Scss01.md)，本文则是针对 [Less](https://less.bootcss.com/) 进行复盘梳理。

## 变量

变量以 `@` 开头，在变量声明时，变量名和 `:` 之间可以添加注释，注释内容以 `/**/` 包裹。

```less
@color: #fff;
@width: 100px;
@height: 100px;

.box {
  width: @width;
  height: @height;
  background-color: @color;
}
```

编译后：

```css
.box {
  width: 100px;
  height: 100px;
  background-color: #fff;
}
```

## 导入

less 文件的导入用 `@import` 指令，可以导入其他 less 文件。

```less
@import 'mixins.less';

.box {
  .border-radius(10px);
}
```

## 嵌套

less 支持嵌套语法，可以避免使用无语意的 class。

```less
.box {
  width: 100px;
  height: 100px;
  background-color: #fff;

  .title {
    font-size: 20px;
    color: #000;
  }
}
```

编译后：

```css
.box {
  width: 100px;
  height: 100px;
  background-color: #fff;
}
.box .title {
  font-size: 20px;
  color: #000;
}
```

## 数学计算

less 支持数学计算，可以在变量和表达式中使用加减乘除等运算符。

```less
@width: 100px;
@height: 100px;

.box {
  width: @width + 10px;
  height: @height - 10px;
}
```

编译后：

```css
.box {
  width: 110px;
  height: 90px;
}
```

## 混合

混合（Mixin）用于定义可重复使用的样式，避免了使用无语意的 class。

```less
.border-radius(@radius) {
  -webkit-border-radius: @radius;
  -moz-border-radius: @radius;
  -ms-border-radius: @radius;
  -o-border-radius: @radius;
  border-radius: @radius;
}

.box {
  .border-radius(10px);
}
```

编译后：

```css
.box {
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  -ms-border-radius: 10px;
  -o-border-radius: 10px;
  border-radius: 10px;
}
```

## 选择器

less 使用符号 `&` 来表示父选择器。

```less
.box {
  &:hover {
    color: #fff;
  }
}
```

编译后：

```css
.box:hover {
  color: #fff;
}
```
