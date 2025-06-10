---
title: 页面滚动动画库 AOS
date: 2023-06-29
icon: style
star: false
category:
  - CSS
tag:
  - CSS
---

在现代网页开发中，有很多监听页面滚动距离而后触发动画效果的需求。但是这有一个弊病就是滚轮回退想要让效果回退可能又需要重新写一遍动画效果。

AOS（Animate on Scroll）动画库就是用来改善页面滚动交互的一个动画库。使用较为简单，真滴很好用。（虽然 Github 上已经很久没有更新了= =）本文对 AOS 进行梳理。

## 简介

[Animate On Scroll Library (AOS)](https://michalsnik.github.io/aos/) 是由 Michał Sajnóg 开发的库。该库的主要目标是检测元素的位置，然后在它们出现在视口中时为动画添加适当的类。

## 在 Vue3 中集成 AOS

## 安装

```bash
$: npm install aos --save
```

## 引入

> 注意，AOS 要在 APP mounted 挂载之后再进行初始化。

### 方法 1: 在 `main.ts` 中直接引入 AOS(包括其 CSS 样式)，并将其初始化

```ts {1, 5, 13, 14}
import AOS from 'aos'
import { createApp } from 'vue'

import './style.css'
import 'aos/dist/aos.css'

import App from './App.vue'

const app = createApp(App)

app.mount('#app')

// 初始化 AOS
AOS.init()
```

### 方法 2: 在 App.vue 中的 onmounted 生命周期内进行初始化

```vue
<!-- App.vue -->

<script setup lang="ts">
import { onMounted } from 'vue'
import AOS from 'aos'

onMounted(() => {
  AOS.init()
})
</script>
```

但是样式文件 `Aos.css` 依旧需要在 `main.ts` 中进行全局引用。

```ts
// main.ts

import { createApp } from 'vue'
import App from './App.vue'

// importing AOS css style globally
import 'aos/dist/aos.css'

const app = createApp(App)

app.mount('#app')
```

## 使用

对需要添加动画的元素增加 AOS 的相关属性(attribute)，格式为：

```html
<div data-aos="animation_name"></div>
```

其中的 `animation_name` 为动画名。例如:

```html
<div class="displayBox" data-aos="zoom-in">
  <p>Animated element using zoom-in.</p>
</div>
```

这就完成了一个基础的动画，用于在元素进入视图时应用缩放动画。即当用户滚动到包含 data-aos="zoom-in" 属性的元素时，AOS 库会自动为该元素添加缩放动画。

## 动画基本功能

还有其他动画设置，如动画持续时间、动画延迟、页面滚动偏移量等。

| Attribute                     | Description                                                                    | Example value | Default value |
| :---------------------------- | :----------------------------------------------------------------------------- | :------------ | ------------- |
| _`data-aos-offset`_           | 更改偏移量以迟早触发动画，单位是 px，但是不用写！直接传入数值即可。            | 200           | 120           |
| _`data-aos-duration`_         | 动画持续时间 (ms)                                                              | 600           | 400           |
| _`data-aos-easing`_           | 缓动函数以不同的方式移动元素                                                   | ease-in-sine  | ease          |
| _`data-aos-delay`_            | 动画延迟 (ms)                                                                  | 300           | 0             |
| _`data-aos-anchor`_           | 锚元素，其偏移量将被计数以触发动画，而不是实际的元素偏移量                     | #selector     | null          |
| _`data-aos-anchor-placement`_ | 锚的位置-当指定锚元素出现在屏幕上时触发动画                                    | top-center    | top-bottom    |
| _`data-aos-once`_             | 设置动画是否只触发一次，若为 false 则每次向上/向下滚动到元素时都会重复触发动画 | true          | false         |

## 全局设置

当然也可以在全局对上述属性设置一些通用属性，需要在 AOS 初始化时进行定义：

```js
 <script>
    AOS.init({
      offset: 200,
      duration: 600,
      easing: 'ease-in-sine',
      delay: 100,
    });
  </script>
```

## 动画样式

在 AOS 中，这些动画样式是通过 HTML 属性 `data-aos` 来指定的，用于在元素进入视图时添加动画效果。以下是每个动画样式的简要说明：

- 淡入淡出动画:

  - fade：元素逐渐变为不透明，创建一个平滑的淡入效果。
  - fade-up：元素从底部逐渐淡入，创建一个从下往上的淡入效果。
  - fade-down：元素从顶部逐渐淡入，创建一个从上往下的淡入效果。
  - fade-left：元素从右侧逐渐淡入，创建一个从右往左的淡入效果。
  - fade-right：元素从左侧逐渐淡入，创建一个从左往右的淡入效果。
  - fade-up-right：元素从右下角逐渐淡入，创建一个从右下角往上的淡入效果。
  - fade-up-left：元素从左下角逐渐淡入，创建一个从左下角往上的淡入效果。
  - fade-down-right：元素从右上角逐渐淡入，创建一个从右上角往下的淡入效果。
  - fade-down-left：元素从左上角逐渐淡入，创建一个从左上角往下的淡入效果。

- 翻转动画:

  - flip-up：元素从下方翻转进入视图。
  - flip-down：元素从上方翻转进入视图。
  - flip-left：元素从右侧翻转进入视图。
  - flip-right：元素从左侧翻转进入视图。

- 滑动动画:

  - slide-up：元素从底部滑入视图。
  - slide-down：元素从顶部滑入视图。
  - slide-left：元素从右侧滑入视图。
  - slide-right：元素从左侧滑入视图。

- 缩放动画:

  - zoom-in：元素逐渐放大进入视图。
  - zoom-in-up：元素从底部放大进入视图。
  - zoom-in-down：元素从顶部放大进入视图。
  - zoom-in-left：元素从右侧放大进入视图。
  - zoom-in-right：元素从左侧放大进入视图。
  - zoom-out：元素逐渐缩小进入视图。
  - zoom-out-up：元素从底部缩小进入视图。
  - zoom-out-down：元素从顶部缩小进入视图。
  - zoom-out-left：元素从右侧缩小进入视图。
  - zoom-out-right：元素从左侧缩小进入视图。

## 锚点位置

在 AOS（Animate On Scroll）中，锚元素位置指的是在页面中特定元素的位置，用于触发 AOS 库中的动画效果。

AOS 库允许使用各种锚元素位置来触发动画效果，包括：

1. top-bottom：当元素的顶部进入视图时触发动画。

2. top-center：当元素的中心进入视图时触发动画。

3. top-top：当元素的顶部完全进入视图时触发动画。

4. center-bottom：当元素的底部进入视图时触发动画。

5. center-center：当元素的中心完全进入视图时触发动画。

6. center-top：当元素的顶部与视图的顶部对齐时触发动画。

7. bottom-bottom：当元素的底部完全进入视图时触发动画。

8. bottom-center：当元素的底部与视图的中心对齐时触发动画。

9. bottom-top：当元素的底部与视图的顶部对齐时触发动画。

这些锚元素位置可以在 AOS 的 HTML 属性中指定，例如：

```html
<div data-aos="fade-up" data-aos-anchor="bottom-top">...</div>
```

在上面的示例中，当元素的底部与视图的顶部对齐时，AOS 库将添加 fade-up 动画效果。

## 缓动函数

Easing functions（缓动函数）是用于动画和过渡效果中的数学函数，用于控制动画的速度和变化率。在动画中，物体通常不是匀速移动的，而是随着时间的推移逐渐加速或减速。这种变化的速度和程度可以通过缓动函数来控制，从而使动画看起来更加自然流畅。使用缓动函数可以使动画看起来更加自然和舒适，为用户提供更好的用户体验。

1. linear：匀速缓动函数，动画的速度保持恒定。
2. ease：默认缓动函数，动画开始时加速，然后逐渐减速。
3. ease-in：加速缓动函数，动画开始时缓慢，然后加速到最后。
4. ease-out：减速缓动函数，动画开始时快速，然后逐渐减速到最后。
5. ease-in-out：先加速后减速缓动函数，动画开始时缓慢，然后加速到一半，然后逐渐减速到最后。
6. ease-in-back：带回弹效果的加速缓动函数，动画开始时缓慢，然后加速到最后，并在结尾处产生回弹效果。
7. ease-out-back：带回弹效果的减速缓动函数，动画开始时快速，然后逐渐减速到最后，并在结尾处产生回弹效果。
8. ease-in-out-back：带回弹效果的先加速后减速缓动函数，动画开始时缓慢，然后加速到一半，然后逐渐减速到最后，并在结尾处产生回弹效果。
9. ease-in-sine：正弦加速缓动函数，动画开始时缓慢，然后逐渐加速到最后。
10. ease-out-sine：正弦减速缓动函数，动画开始时快速，然后逐渐减速到最后。
11. ease-in-out-sine：正弦先加速后减速缓动函数，动画开始时缓慢，然后加速到一半，然后逐渐减速到最后。
12. ease-in-quad：二次方加速缓动函数，动画开始时缓慢，然后逐渐加速到最后。
13. ease-out-quad：二次方减速缓动函数，动画开始时快速，然后逐渐减速到最后。
14. ease-in-out-quad：二次方先加速后减速缓动函数，动画开始时缓慢，然后加速到一半，然后逐渐减速到最后。
15. ease-in-cubic：三次方加速缓动函数，动画开始时缓慢，然后逐渐加速到最后。
16. ease-out-cubic：三次方减速缓动函数，动画开始时快速，然后逐渐减速到最后。
17. ease-in-out-cubic：三次方先加速后减速缓动函数，动画开始时缓慢，然后加速到一半，然后逐渐减速到最后。
18. ease-in-quart：四次方加速缓动函数，动画开始时缓慢，然后逐渐加速到最后。
19. ease-out-quart：四次方减速缓动函数，动画开始时快速，然后逐渐减速到最后。
20. ease-in-out-quart：四次方先加速后减速缓动函数，动画开始时缓慢，然后加速到一半，然后逐渐减速到最后。
