---
title: 多种方式实现居中
date: 2023-02-11
icon: style
article: false
category:
  - CSS
tag:
  - CSS
---

# 多种方式实现居中

实现元素居中显示，有很多相关总结，但是还是有很多可以絮叨的地方。

先看示例代码：

```html
<body>
  <div class="parent">
    <div class="son son-size">居中内容</div>
  </div>
</body>
```

## 1 居中元素定宽高

若居中元素的大小固定，我们可以采用 `absolute` + `son 元素位置修正` 的方式进行。

```css
.son-size {
  width: 100px;
  heigh: 100px;
}
```

### 1.1 absolute + 负 margin

> **Tips: 绝对定位元素的百分比是基于父元素的宽高计算出来的。**

```css
.parent {
  position: relative;
}
.son {
  posion: absolute;
  top: 50%;
  left: 50%;
  margin-left: -50px;
  margin-top: -50px;
}
```

这种方式思路非常简单，先上下偏移父元素的一半，再依据自身宽高修正居中显示。

实际上容错性非常不好，若日后居中元素发生微小变化，则又需要进行调整。

### 1.2 absolute + calc

同上种方式一样，只是换成了 `calc` 计算便宜位置了。

```css
.parent {
  position: relative;
}
.son {
  posion: absolute;
  top: calc(50% - 50px);
  left: calc(50% - 50px);
}
```

`calc` 中的百分比依旧遵循 _绝对定位元素的百分比是基于父元素的宽高计算出来的。_

### 1.3 absolute + margin auto 较好的实现

其实这种方式已经可以归纳为居中元素不定宽高了，但是由于属于上述俩种方式的优化，所以在此进行归类。

先看代码:

```css
.parent {
  position: relative;
}
.son {
  posion: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
```

在上述代码中，有很多可以讨论的地方。

如，绝对定位中的 `top`、`left`等的含义是什么?

《CSS 世界》中解释： `left/top/right/bottom` 是具有定位特性元素专用的 CSS 属性，当一个绝对定位元素，其对立定位方向属性同时具有具体定位数值到时候，流体特性就发生了。

当统一方向上只有单一属性时，如只有 `left` 或 `top`，这个时候 元素的宽度或高度其实 0；只有当 `left` 和 `right`同时存在（`top` 和 `bottom` 同时存在），这个时候的宽度不为 0。表现为“格式化宽度”——宽度自适应与 包含该对象的 父级块 的 `padding box`。就是说这个时候的 宽高是等于父级元素的。

不是很好的写法：

```css
.parent {
  position: relative;
}
.son {
  posion: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: auto;
}
```

像这种，一边固定，宽度和高度用 `100%` 去继承父级 包含块，就不是很好的用法。因为“格式化宽度”是 父级包含块的 `padding box` ，所以如果父级包含块 有 `padding` 或者 `margin` 等属性时，这个时候 子元素就不是 父级包含块的 宽高大小了。

## 2 居中元素不定高

若居中元素会动态变化，此时要实现居中，则还需要用到一些其它技巧了。

### 2.1 absolute + transform

```css
.parent {
  position: relative;
}
.son {
  posion: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

上述代码中，我们用到了 `css3` 中的 `transform` 属性，通过 `transform` 对自身宽高进行偏移修正。

> **Tips： `transform` 中的百分比是基于自身宽高的，同 `top` 等属性不同。**

### 2.2 lineheight 文本居中

通过将 `parent` 父元素设置为行内元素，则可通过 `text-align` 实现 待居中元素的水平居中。而后，通过 `vertical-align` 将行内元素内容 垂直向上居中，实现整体效果。

```css
.parent {
  line-height: 400px;
  text-align: center; // 行内元素 水平居中
  font-size: 0; // 避免对 垂直居中进行干扰
}
.son {
  font-size: 16px;
  display: inline-block;
  vertical-align: middle;
  line-height: initial;
  text-align: left; // 修正文字
}
```

其实这种方式，还可称为多行文本垂直居中，若是单行文本居中，还有常用方法：

```css
// 让 line-height 等于 height，实现垂直居中
.parent {
  height: 400px;
  line-height: 400px;
  text-align: center; // 行内元素 水平居中
}
```

### 2.3 table 表格居中

过去好像，利用 table 实现元素的居中方式也很流行，只不过如今被 flex 等更加强大的 css3 属性给代替了。

缺点也很明显，代码冗余，且性能不佳。

```html
<table>
  <tbody>
    <tr>
      <td class="parent">
        <div class="son">居中内容</div>
      </td>
    </tr>
  </tbody>
</table>
```

```css
.parent {
  text-align: center;
}
.son {
  display: inline-block;
}
```

当然，如果不用 table 布局，依旧想使用 table 属性，我们可以使用 `css-table` ：

```css
.parent {
  display: table-css;
  text-align: center; // 水平居中
  vertical-align: middle; // 垂直居中
}
.son {
  display: inline-block;
}
```

### 2.4 flex 布局

终于轮到 flex 布局了，现代流行的一维强大布局方式。

```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

代码非常简洁，优雅。

### 2.5 grid 布局

相对于 flex 布局，grid 布局更多用于二维，但是也是布局能手。

```css
.parent {
  display: grid;
}
.son {
  align-self: center;
  justify-self: center;
}
```

也很优雅，但是兼容性可能较差。

差不多，常用的就是这些布局方式了，对于日常工作也够用了。当然还有很多技巧，往后见到再做补充吧。

以上。
