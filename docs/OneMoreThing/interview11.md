---
title: Interview -- 综合应用
icon: note
date: 2022-08-12
category:
  - anonymous
tag:
  - note
star: false
# sticky: true
sticky: false
---

## H5 页面如何进行首屏优化?

- 使用 SSR 优化，`Nuxt.js`(Vue) 和 `Next.js`(React)
- App 预获取
- 针对列表页进行分页，默认只展示第一页内容，上滑加载更多
- 图片懒加载 lazyLoad，注意图片尽量设置好尺寸；
- 路由懒加载
