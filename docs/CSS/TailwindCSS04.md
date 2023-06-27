---
title: Tailwind 04 排版
date: 2023-07-27
icon: style
category:
  - CSS
tag:
  - CSS
---

详细介绍可参考[官网-排版](https://tailwindcss.com/docs/font-family)

## 基本规律

在 Tailwind CSS 中，类名以"font"开头的用于控制字体相关属性的规则如下：

- 字体系列（Font Family）：可以使用类名格式为"`font-<name>`"来设置指定字体系列。例如，"`font-sans`"表示使用无衬线字体系列，当然也有预设的一些常用字体。

- 字体大小（Font Size）：可以使用类名格式为"`text-<size>`"来设置指定的字体大小。例如，"`text-sm`"表示小号字体，"`text-lg`"表示大号字体。

- 字重（Font Weight）：可以使用类名格式为"`font-<weight>`"来设置指定的字重。例如，"`font-semibold`"表示半粗体字重。

- 斜体（Italic）：可以使用类名格式为"`italic`"来应用斜体样式。

- 字母间距（Letter Spacing）：可以使用类名格式为"`tracking-<value>`"来设置指定的字母间距。例如，"`tracking-wide`"表示较大的字母间距。

- 行高（Line Height）：可以使用类名格式为"`leading-<value>`"来设置指定的行高。例如，"`leading-normal`"表示正常的行高。

## Font Size 字体大小

字体大小不光包含 font-size，还有 line-height。

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
