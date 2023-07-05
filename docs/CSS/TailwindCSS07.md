---
title: Tailwind 05 Transitions & Animation
date: 2023-06-28
icon: style
category:
  - CSS
tag:
  - CSS
---

在 Tailwind CSS 中，"transitions"和"animation"类名规律用于控制元素的过渡效果和动画效果。

一些相关的类名规律：

- 过渡（Transitions）：可以使用类名格式为"`transition-<property>`"来指定需要添加过渡效果的属性。例如，"transition-opacity"表示当元素的透明度发生变化时应用过渡效果。

- 过渡持续时间（Transition Duration）：可以使用类名格式为"`duration-<value>`"来设置过渡的持续时间，其中"value"可以是预定义的时间值如"fast"、"normal"、"slow"，也可以使用自定义时间值。例如，"duration-500"表示过渡的持续时间为 500 毫秒。

- 过渡的时间函数（timing function）：可以使用类名格式为"`ease-<type>`"来设置过渡的时间函数类型。常见的时间函数类型包括："ease-in"（加速开始）、"ease-out"（减速结束）、"ease-in-out"（加速开始和减速结束）、"linear"（线性变化）等。

- 过渡延迟（Transition Delay）：可以使用类名格式为"`delay-<value>`"来设置过渡的延迟时间，其中"value"可以是预定义的时间值或自定义时间值。例如，"delay-200"表示过渡的延迟时间为 200 毫秒。

- 动画（Animation）：可以使用类名格式为"c`"来应用预定义的动画效果。例如，"animate-spin"表示应用旋转动画效果。

## Transitions 过渡

| Class                  | Properties                                                                                                                                                                                                                                                  |
| :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transition-none`      | transition-property: none;                                                                                                                                                                                                                                  |
| `transition-all`       | transition-property: all; <br />transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); <br />transition-duration: 150ms;                                                                                                                                 |
| `transition`           | transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; <br />transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); <br />transition-duration: 150ms; |
| `transition-colors`    | transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; <br />transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); <br />transition-duration: 150ms;                                                          |
| `transition-opacity`   | transition-property: opacity; <br />transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); <br />transition-duration: 150ms;                                                                                                                             |
| `transition-shadow`    | transition-property: box-shadow; <br />transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); <br />transition-duration: 150ms;                                                                                                                          |
| `transition-transform` | transition-property: transform; <br />transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); <br />transition-duration: 150ms;                                                                                                                           |

自定义其它过渡属性:

```html
<div class="transition-[height]">
  <!-- 意为  transition-property: height;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 150ms; -->
</div>
```

## Transition Duration 持续时间

格式为 `duration-{amount}`​ 来控制元素的过渡持续时间。

| Class         | Properties                   |
| :------------ | :--------------------------- |
| duration-0    | transition-duration: 0s;     |
| duration-75   | transition-duration: 75ms;   |
| duration-100  | transition-duration: 100ms;  |
| duration-150  | transition-duration: 150ms;  |
| duration-200  | transition-duration: 200ms;  |
| duration-300  | transition-duration: 300ms;  |
| duration-500  | transition-duration: 500ms;  |
| duration-700  | transition-duration: 700ms;  |
| duration-1000 | transition-duration: 1000ms; |

自定义时间：

```html
<div class="duration-[2000ms]">
  <!-- 意为 transition-duration: 2000ms;  -->
</div>
```

## Transition Timing Function 过渡的时间函数

格式为: `ease-{timing}`，用于控制元素的缓和曲线。

| Class       | Properties                                                |
| :---------- | :-------------------------------------------------------- |
| ease-linear | transition-timing-function: linear;                       |
| ease-in     | transition-timing-function: cubic-bezier(0.4, 0, 1, 1);   |
| ease-out    | transition-timing-function: cubic-bezier(0, 0, 0.2, 1);   |
| ease-in-out | transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); |

## Transition Delay 延迟时间

格式为: `delay-{amount}`​ ，用来来控制某个元素的过渡延迟属性。

| Class      | Properties                |
| ---------- | ------------------------- |
| delay-0    | transition-delay: 0s;     |
| delay-75   | transition-delay: 75ms;   |
| delay-100  | transition-delay: 100ms;  |
| delay-150  | transition-delay: 150ms;  |
| delay-200  | transition-delay: 200ms;  |
| delay-300  | transition-delay: 300ms;  |
| delay-500  | transition-delay: 500ms;  |
| delay-700  | transition-delay: 700ms;  |
| delay-1000 | transition-delay: 1000ms; |

自定义延迟时间:

```html
<div class="delay-[2000ms]">
  <!-- 意为 transition-delay: 2000ms;  -->
</div>
```

## Animation 动画

格式为：`animate-<name>`，用来表示动画类型。

原生默认的动画有四个：

- spin: 旋转
- ping: 雷达
- pulse: 脉冲
- bounce: 反弹

自定义动画：

```html
<div class="animate-[wiggle_1s_ease-in-out_infinite]">
  <!-- 意为 animation: wiggle 1s ease-in-out infinite; -->
</div>
```
