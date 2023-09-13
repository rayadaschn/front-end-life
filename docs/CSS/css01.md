---
title: css 技巧
date: 2023-09-12
icon: style
category:
  - CSS
tag:
  - CSS
---

## 禁止文本选择

通过设置 CSS 属性 user-select 为 none，可以阻止用户选择页面上的文本。

```css
body {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, supported by most modern browsers */
}
```

用户将无法选择页面上的文本内容。值得注意的是，这只会禁止选择文本，但不能阻止用户通过其他方式复制文本内容。
