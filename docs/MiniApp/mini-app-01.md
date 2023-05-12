---
title: 小程序 Debug 宝典
icon: mini-app
date: 2023-02-07
article: false
category:
  - mini-app
tag:
  - mini-app
---

# 小程序 Debug 宝典

1. 数据绑定： 在 `WXML` 中动态数据利用 `Mustache` 双括号语法将变量包裹起来，可以绑定动态内容及 组件 class 属性，需注意的是 **控制的变量需要放在双括号内**，才能生效。如：

   ```HTML
   <view wx:if="{{value}}" ></view>
   ```

1. 数据更新 `this.setData` :

   小程序的渲染过程是逻辑层负责生产、处理数据，利用 `setData` 传递数据到渲染层。其中，从逻辑层传递到渲染层是 **异步** 的，而 **`this.data`** 的修改是 **同步** 的。因此，连续多次的调用 `this.setData` 会导致 JS 线程一直处于编译执行渲染阶段，造成卡顿。官方优化建议：

   - 避免频繁调用 `setData` ;
   - 避免每次 `setData` 都传递大量数据;
   - 在后台页面进行 `setData`
