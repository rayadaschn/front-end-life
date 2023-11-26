---
title: Tailwind 04 排版
date: 2023-06-27
icon: style
category:
  - CSS
tag:
  - CSS
---

## 基本规律

在 Tailwind CSS 中，类名以"font"开头的用于控制字体相关属性的规则如下：

- 字体系列（Font Family）：可以使用类名格式为"`font-<name>`"来设置指定字体系列。例如，"`font-sans`"表示使用无衬线字体系列，当然也有其它预设的一些[常用字体](https://tailwindcss.com/docs/font-family)。

- 字体大小（Font Size）：可以使用类名格式为"`text-<size>`"来设置指定的字体大小。例如，"`text-sm`"表示小号字体，"`text-lg`"表示大号字体。

- 字重（Font Weight）：可以使用类名格式为"`font-<weight>`"来设置指定的字重，具体可见下文对照表。例如，"`font-semibold`"表示半粗体字重，也就是 `font-weight: 600;`。

- 斜体（Italic）：可以使用类名格式为“`italic`”来应用斜体样式，正常则是“`not-italic`”。

- 字母间距（Letter Spacing，在一些设计和排版工具中也会用术语 tracking 表示，是的它除了追踪也有间距的含义）：因此使用类名格式为"`tracking-<value>`"来设置指定的字母间距。例如，"`tracking-wide`"表示较大的字母间距。

- 行高（Line Height，印刷术语是 leading，具体原因见下文 👇🏻）：因此使用类名格式为"`leading-<value>`"来设置指定的行高。例如，"`leading-normal`"表示正常的行高。

- 文本对齐（Text align）：可以使用类名格式为“`text-<name>`”来设置文本对齐方向。例如，“`text-center`”表示文本居中，也就是 `text-align: center;`。

- 文本颜色（Text Color）：可以使用类名格式为“`text-<colorName>`”来设置文本颜色，colorName 一般为“颜色名-颜色深度”。也有常用的颜色，无需设置色深，例如，"`text-black`" 表示黑色，也就是`color: rgb(0 0 0);`。

- 文本溢出，用 `text-{ellipsis|clip}`；

- 文本垂直对齐(Vertical Align)，通用公式为 `align-{value}`；

- Whitespace 空格，通用公式为 `whitespace-{normal|nowrap|pre}` 等。

更多介绍可参考[官网-排版](https://tailwindcss.com/docs/font-family)

## Font Size 字体大小

字体大小（font size）的概念不仅仅包括字体大小本身（即 font-size 属性），还包括与之关联的行高（line height）。`line-height: 1.5;` 表示行高为字体大小的 1.5 倍。

- 相对尺寸值：Tailwind CSS 使用相对于根元素（`<html>`）的字体大小的相对单位 "rem" 来定义字体大小。可以使用类名格式为 "`text-<size>`" 来设置不同的字体大小。常见的相对尺寸值包括：

  - "text-xs"：额外小的字体
  - "text-sm"：小号字体
  - "text-base"：基准字体大小（通常为 16px）
  - "text-lg"：大号字体
  - "text-xl"：超大号字体
  - "text-2xl"、"text-3xl"、"text-4xl" 等：更大尺寸的字体

- 命名尺寸：除了相对尺寸值之外，Tailwind CSS 还提供了一些预定义的命名尺寸用于定义字体大小。这些尺寸值可以在配置文件中自定义。通常，可以使用类名格式为 "`text-<size>`" 来应用命名尺寸，例如 "text-xs"、"text-sm"、"text-md"、"text-lg" 等。

- 自定义尺寸：同其它变量一样用中括号将字体大小包裹：

  ```html
  <p class="text-[14px]">
    <!-- 解析为 font-size: 14px; -->
  </p>
  ```

## Font Weight 字重

字重表示字体的粗细，对照表如下：

| Class           | Properties        |
| :-------------- | :---------------- |
| font-thin       | font-weight: 100; |
| font-extralight | font-weight: 200; |
| font-light      | font-weight: 300; |
| font-normal     | font-weight: 400; |
| font-medium     | font-weight: 500; |
| font-semibold   | font-weight: 600; |
| font-bold       | font-weight: 700; |
| font-extrabold  | font-weight: 800; |
| font-black      | font-weight: 900; |

当然在开发过程中不一定能都记忆下来，所以常用的可能是自定义字重大小：

```html
<p class="font-[800]">
  <!-- 解析成 font-weight: 800; -->
</p>
```

记得区分于字体大小 `class="text-[24px]"` 。

## 字母间距

在原生 CSS 中，字母间距是用 letter-spacing 表示。在 tailwind 的中是用 `tracking-{size}` 表示字母间距（track 意为追踪,也有字间距的含义。跟踪的时候保持一定距离）。

| Class            | Properties                |
| :--------------- | :------------------------ |
| tracking-tighter | letter-spacing: -0.05em;  |
| tracking-tight   | letter-spacing: -0.025em; |
| tracking-normal  | letter-spacing: 0em;      |
| tracking-wide    | letter-spacing: 0.025em;  |
| tracking-wider   | letter-spacing: 0.05em;   |
| tracking-widest  | letter-spacing: 0.1em;    |

自定义数值:

```html
<p class="tracking-[.25em]">
  <!-- 意为 letter-spacing: 0.25em;  -->
</p>
```

## Line Height 行高

> 历史上，印刷业使用铅字排版，字母是用铅制成的，而为了在两行文字之间留出足够的空间，通常需要在行的底部添加一些额外的铅(lead)。这个额外的空间被称为 "leading"，因此，"leading" 表示的是两行文字底部之间的空隙，也就是行高。

用法同字母间距一样，这里仅做展示。

| Class           | Properties                       |
| --------------- | -------------------------------- |
| leading-3       | line-height: .75rem; /_ 12px _/  |
| leading-4       | line-height: 1rem; /_ 16px _/    |
| leading-5       | line-height: 1.25rem; /_ 20px _/ |
| leading-6       | line-height: 1.5rem; /_ 24px _/  |
| leading-7       | line-height: 1.75rem; /_ 28px _/ |
| leading-8       | line-height: 2rem; /_ 32px _/    |
| leading-9       | line-height: 2.25rem; /_ 36px _/ |
| leading-10      | line-height: 2.5rem; /_ 40px _/  |
| leading-none    | line-height: 1;                  |
| leading-tight   | line-height: 1.25;               |
| leading-snug    | line-height: 1.375;              |
| leading-normal  | line-height: 1.5;                |
| leading-relaxed | line-height: 1.625;              |
| leading-loose   | line-height: 2;                  |

自定义行高:

```html
<p class="leading-[3rem]">
  <!-- 意为 line-height: 3rem; -->
</p>
```

## Text Align 文本对齐

| Class        | Properties           |
| ------------ | -------------------- |
| text-left    | text-align: left;    |
| text-center  | text-align: center;  |
| text-right   | text-align: right;   |
| text-justify | text-align: justify; |
| text-start   | text-align: start;   |
| text-end     | text-align: end;     |

## Text Color 字体颜色

Tailwind 的颜色有非常多，官方给开发人员提供了一些默认颜色类型，具体可参照[官网](https://tailwindcss.com/docs/customizing-colors)，部分截图如下：

![Colors](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202306271006893.png)

部分对照表如下：

| Class            | Properties               |
| ---------------- | ------------------------ |
| text-inherit     | color: inherit;          |
| text-current     | color: currentColor;     |
| text-transparent | color: transparent;      |
| text-black       | color: rgb(0 0 0);       |
| text-white       | color: rgb(255 255 255); |
| text-slate-50    | color: rgb(248 250 252); |
| text-slate-100   | color: rgb(241 245 249); |
| text-slate-200   | color: rgb(226 232 240); |

有两种形式，一种是默认文本颜色，inherit 继承父类，transparent 透明化；另外一种即是常用的颜色，格式为 “`text-<colorName>`”，colorName 一般为“颜色名-颜色深度”。

自定义颜色:

```html
<p class="text-[#50d71e]">
  <!-- 意为 color: #50d71e -->
</p>
```

## Text Overflow 文本溢出

文本溢出类名较少。

| Class         | Properties               |
| ------------- | ------------------------ |
| truncate      | overflow: hidden;        |
|               | text-overflow: ellipsis; |
|               | white-space: nowrap;     |
| text-ellipsis | text-overflow: ellipsis; |
| text-clip     | text-overflow: clip;     |

Tailwind 非常贴心的为开发者提供了 truncate(截断)，表示文本溢出用省略号表示。

若想要书写则用第二种 `text-ellipsis` 以省略号展示，配合类名 `overflow-hidden`。

`text-clip` 为直接截断。

## Vertical Align 垂直对齐

| Class             | Properties                   |
| ----------------- | ---------------------------- |
| align-baseline    | vertical-align: baseline;    |
| align-top         | vertical-align: top;         |
| align-middle      | vertical-align: middle;      |
| align-bottom      | vertical-align: bottom;      |
| align-text-top    | vertical-align: text-top;    |
| align-text-bottom | vertical-align: text-bottom; |
| align-sub         | vertical-align: sub;         |
| align-super       | vertical-align: super;       |

## Whitespace 空格

| Class                   | Properties                 |
| ----------------------- | -------------------------- |
| whitespace-normal       | white-space: normal;       |
| whitespace-nowrap       | white-space: nowrap;       |
| whitespace-pre          | white-space: pre;          |
| whitespace-pre-line     | white-space: pre-line;     |
| whitespace-pre-wrap     | white-space: pre-wrap;     |
| whitespace-break-spaces | white-space: break-spaces; |
