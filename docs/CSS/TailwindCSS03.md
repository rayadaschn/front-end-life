---
title: Tailwind 03 间距和尺寸
date: 2023-06-27
icon: style
category:
  - CSS
tag:
  - CSS
---

## 总结规律

- 默认尺寸的是 `1rem = 4px`，所以具体尺寸可以将数字乘以 4 为实际尺寸大小；
- 间距的通用公式：`{p|m|width|height|max-w|min-h|gap|inset|space}-[number]`，若是负间距则在类名前加负号。`p` 和 `m` 为 padding 和 margin 的缩写；
- 间距方向 x 表示水平，y 表示垂直方向，s 表示 start，e 表示 end，t 表示 top，b 表示 bottom，使用公式如：`p{x|y|t|r|b|l|s|e}-[number]`；
- 数值，可用分数表示百分比，另有特殊字符如 full 表示 100%，screen 表示屏幕视口因此有通用公式：`w-{2/5|full|screen|min|max}`等；
- 任意值可以用中括号`[]`书写属性值如 `p-[5px]` 表示间距为 5px。

> 关于间距的详细介绍亦可参考[官网-间距](https://tailwindcss.com/docs/customizing-spacing)

## 默认配置

先看部分默认基础尺寸对照表：

| Name | Size     | Pixels |
| ---- | -------- | ------ |
| 0    | 0px      | 0px    |
| px   | 1px      | 1px    |
| 0.5  | 0.125rem | 2px    |
| 1    | 0.25rem  | 4px    |
| 1.5  | 0.375rem | 6px    |
| 2    | 0.5rem   | 8px    |
| 2.5  | 0.625rem | 10px   |
| 3    | 0.75rem  | 12px   |
| 3.5  | 0.875rem | 14px   |
| 4    | 1rem     | 16px   |
| 5    | 1.25rem  | 20px   |
| 6    | 1.5rem   | 24px   |

从上大概可以看出，默认配置中是 `1rem = 4px`，所以也允许小数的存在。

若需要自定义覆盖设置，则需要在 `tailwind.config.js` 中的 `theme.spacing` 中进行自定义：

```js
// tailwind.config.js
module.exports = {
  theme: {
    spacing: {
      1: '8px',
      2: '12px',
      3: '16px',
      4: '24px',
      5: '32px',
      6: '48px',
    },
  },
}
```

## 基本规律

tailwind 在间距上还是有一定的规律的，默认情况下，间距比例由 padding、 margin、 width、 height、 maxHeight、 gap、 inset、 space 类名和 translate 核心插件继承。

> 同样的，若为负值，则在类名前添加负号如：`-mx-1` 表示：`margin-left: -0.25rem; margin-right: -0.25rem;`

- Padding.(内间距)：
  - "p": padding，表示所有方向（上、右、下、左）的内边距。
  - "py"：表示上下方向的内边距（垂直方向）。
  - "px"：表示左右方向的内边距（水平方向）。
  - "pt"、"pr"、"pb"、"pl"：分别表示上、右、下、左方向的内边距。
- Margin（外边距）：通常使用类名"m"表示所有方向的外边距，以及"mt"、"mr"、"mb"、"ml"分别表示上、右、下、左方向的外边距。

- Width（宽度）和 Height（高度）：这些属性默认以完整的名称表示，并**没有对应的缩写形式**。

- Max Height（最大高度）：类名为"max-h"，后续可以跟尺寸值或命名尺寸（如"max-h-64"）。

- Gap（间距）：类名为"gap"，可在其后加上具体数值或命名尺寸（如"gap-4"）。

- Inset（插入内边距/定位）：有对应的缩写形式。例如，"inset-x"表示左右方位的插入内边距，"inset-y"表示上下方位的插入内边距。

- Space（空间）：目前在 Tailwind CSS 中没有类似的缩写方式来指定空间相关的属性。

- Translate（平移）：类名为"translate-x"和"translate-y"，分别表示水平和垂直方向的平移。

## 宽度

在宽度中，除了上述基础数字外，可能还经常能看见分数，转换成百分比即可。如： `w-2/5` 表示 `width: 40%;`。

还有一些特殊视口：

| **Class**  | **Properties**          |
| ---------- | ----------------------- |
| w-2/5      | width: 40%;             |
| w-full     | width: 100%;            |
| w-screen   | width: 100vw;           |
| w-min      | width: min-content;     |
| w-max      | width: max-content;     |
| min-w-0    | min-width: 0px;         |
| min-w-full | min-width: 100%;        |
| min-w-min  | min-width: min-content; |
| min-w-max  | min-width: max-content; |

其余高度等都是类似书写，不再赘述。

## 任意值

若想要一个元素是自定义的任意值可以使用类似 js 中的中括号`[]`书写属性值:

```html
<div class="p-[5px]">
  <!-- 表示间距为 5px -->
</div>
```
