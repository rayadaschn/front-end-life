---
title: Tailwind 05 背景
date: 2023-06-28
icon: style
category:
  - CSS
tag:
  - CSS
---

## 基本规律

常见的"background"类名规律：

- 背景颜色（Background Color）：可以使用类名格式为"`bg-<colorName>`"来设置元素的背景颜色。例如，"`bg-red-500`"表示应用红色系列的背景颜色。

- 背景图片（Background Image）：可以使用类名格式为"`bg-<name>`"来设置指定的背景图片。这需要在配置文件中定义对应的背景图像。例如，"`bg-pattern`"表示应用名为"`pattern`"的背景图片。

- 背景大小（Background Size）：可以使用类名格式为"`bg-<size>`"来设置背景图片的大小。例如，"`bg-cover`"表示以尽可能大的尺寸覆盖元素的背景图片。

- 背景位置（Background Position）：可以使用类名格式为"`bg-<position>`"来设置背景图片的位置。例如，"`bg-center`"表示将背景图片居中放置。

- 背景重复（Background Repeat）：可以使用类名格式为"`bg-<repeat>`"来设置背景图片的重复方式。例如，"`bg-repeat`"表示背景图片在水平和垂直方向上均重复。

- 背景附加效果（Background Attachment）：可以使用类名格式为"`bg-<attachment>`"来设置背景图片的附加效果。例如，"`bg-fixed`"表示背景图片固定在元素上方不随滚动而移动。

## Background Color 背景颜色

背景颜色同文本颜色一致，只是类名改为 bg，在此不再对基础设定进行重复。

改变背景的不透明度。在开发过程中，除了设定背景颜色外，还想同时设定背景颜色不透明度，可以用格式为 “`bg-<colorName>/<number>`” 的类名来改变背景颜色的不透明度。

```html
<button class="bg-sky-500/100 ..."></button>
<button class="bg-sky-500/75 ..."></button>
<button class="bg-sky-500/50 ..."></button>
```

效果如下:

![opacity](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202306271056139.png)

数字代表不透明度的百分比，数值为 0 则完全透明化。

## Background Image 背景图片

背景图片若是使用 类名表述，则需要事先在配置文件中定义对应的背景图像。

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/img/hero-pattern.svg')",
        'footer-texture': "url('/img/footer-texture.png')",
      },
    },
  },
}
```

定义了俩张图片，则可以直接使用它们：

```html
<div class="bg-hero-pattern"></div>
<div class="bg-footer-texture"></div>
```

当然也可自定义图片：

```html
<div class="bg-[url('/img/hero-pattern.svg')]">
  <!-- 使用变量形式进行加载 -->
</div>
```

## Background Size 背景大小

| Class      | Properties                |
| ---------- | ------------------------- |
| bg-auto    | background-size: auto;    |
| bg-cover   | background-size: cover;   |
| bg-contain | background-size: contain; |

自定义图片大小，以 length 开头，下划线连接 `_`：

```html
<div class="bg-[length:200px_100px]">
  <!-- 意为 background-size: 200px 100px; -->
</div>
```

## Background Position 背景位置

| Class           | Properties                         |
| --------------- | ---------------------------------- |
| bg-bottom       | background-position: bottom;       |
| bg-center       | background-position: center;       |
| bg-left         | background-position: left;         |
| bg-left-bottom  | background-position: left bottom;  |
| bg-left-top     | background-position: left top;     |
| bg-right        | background-position: right;        |
| bg-right-bottom | background-position: right bottom; |
| bg-right-top    | background-position: right top;    |
| bg-top          | background-position: top;          |

自定义图片位置，以下划线连接 `_`：

```html
<div class="bg-[center_top_1rem]">
  <!-- 意为 background-position: center top 1rem; -->
</div>
```

## Background Repeat 背景重复

| Class           | Properties                    |
| --------------- | ----------------------------- |
| bg-repeat       | background-repeat: repeat;    |
| bg-no-repeat    | background-repeat: no-repeat; |
| bg-repeat-x     | background-repeat: repeat-x;  |
| bg-repeat-y     | background-repeat: repeat-y;  |
| bg-repeat-round | background-repeat: round;     |
| bg-repeat-space | background-repeat: space;     |

## Background Attachment 背景附加效果

| Class     | Properties                     |
| --------- | ------------------------------ |
| bg-fixed  | background-attachment: fixed;  |
| bg-local  | background-attachment: local;  |
| bg-scroll | background-attachment: scroll; |
