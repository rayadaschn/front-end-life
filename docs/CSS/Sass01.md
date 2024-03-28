---
title: Scss 快速 复盘
date: 2024-03-24
icon: style
category:
  - CSS
tag:
  - CSS
sticky: false
---

虽然 Tailwindcss 已经较为流行，但是 Scss 还是在很多项目中使用，而一直都是轻量使用，故该文旨在快速梳理一遍 Scss 的基本用法和一些踩坑点。

## 基础语法

### 变量

```scss
$color: #fff;
```

设置为全局变量, 用 `!global` 全局标识符。值得注意的是 Scss 中变量赋值是有顺序的。

```scss
$color: #fff;
body {
  color: $color; // 输出 #fff

  .inner-box {
    $color: red !global; // 改全局变量颜色为 red
    color: $color; // 输出 red
  }

  .inner-box2 {
    color: $color; // 输出 red
  }
}
```

### 标识符

1. `!default`：用于定义变量的默认值，只有**在变量未被定义**或者值为 `null` 时才会起作用。

   ```scss
   $color: red !default;
   $color: blue; // 此时$color的值仍为red，因为之前已经定义了默认值
   ```

2. `!global`：用于将局部作用域的变量提升到全局作用域。

   ```scss
   $color: red;

   .container {
     $color: blue !global; // 将局部变量$color提升到全局作用域，并赋值为blue
   }

   .element {
     color: $color; // 此时$color的值为blue，因为已经被提升到全局作用域
   }
   ```

### 单位转换

1. 加减单位会按照第一次定义的进行转化:

   ```scss
   .box {
     width: 60em + 10px; // 输出 em 单位
     height: 60px + 10em; // 输出 px 单位
   }
   ```

2. 乘法只能定义一次单位;
3. 除法带单位会把单位进行运算:

   ```scss
   .box {
     width: 60em / 2; // 输出 30em
     height: 60px / 2px; // 输出 30
   }
   ```

## 控制命令

Scss 和 js 一样可以使用条件语句。

1. `@if` 判断, 注意不可以写 `===` 全等号判断。

   ```scss
   @if 1 + 1 == 2 {
     color: red;
   } @else if 1 + 1 == 3 {
     color: blue;
   } @else {
     color: green;
   }
   ```

2. `@for` 循环, 可以用作网格布局。

   ```scss
   @for $i from 1 through 3 {
     .box-#{$i} {
       width: 20px * $i;
     }
   }
   ```

3. `@while` 循环， 用的较少，一般用 `@for` 进行替换。

   注意 `$i` 必须先定义。

   ```scss
   @while $i < 10 {
     .box-#{$i} {
       width: 20px * $i;
     }
   }
   ```

4. `@each` 循环， 类似 js 中的 `forEach` 方法。

   ```scss
   @each $i in 1, 2, 3 {
     .box-#{$i} {
       width: 20px * $i;
     }
   }
   ```

## mixin 混入

mixin 可重用的样式块，然后在需要的地方引入这些样式块。

1. 使用 `@mixin` 关键字定义 Mixin，后面跟着 Mixin 的名称和参数列表。

   ```scss
   @mixin border-radius($radius) {
     border-radius: $radius;
     -webkit-border-radius: $radius;
     -moz-border-radius: $radius;
   }
   ```

2. `@include` 关键字引用 Mixin，并**传入参数**（如果有的话）。

   ```scss
   .box {
     @include border-radius(5px);
   }
   ```

   传入参数:

   ```scss
   @mixin box-shadow($x, $y, $blur, $color) {
     box-shadow: $x $y $blur $color;
     -webkit-box-shadow: $x $y $blur $color;
     -moz-box-shadow: $x $y $blur $color;
   }

   .element {
     @include box-shadow(2px, 2px, 4px, rgba(0, 0, 0, 0.3));
   }
   ```

当然 Mixin 也可以同 js 一样使用默认参数, 也可以进行嵌套使用。

## 使用技巧

若是辅助性 scss 文件, 可以在文件名前加下滑 `_`, 则该文件不会被编译成 css 文件。

像变量等辅助性 scss 文件, 这个特性非常有用。
