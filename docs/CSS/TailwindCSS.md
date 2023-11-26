---
title: Tailwind 快速入门
date: 2023-11-26
icon: style
category:
  - CSS
tag:
  - CSS
sticky: true
---

> 前言：在接触 Tailwind 的刚开始，并没有感受到它的好处，反而觉得这是一种非常繁琐的事情。入门了几次都以失败告终，非常不适应。但是这一次，终于有一点小感悟了，遂记录下来，梳理总结使用规律和用法。

章节系列共分为 7 个小节，每小节开头介绍使用规律，再介绍具体使用方法，各自小节独立可依照需求进行查阅。

1. [Tailwind 安装及配置](./TailwindCSS01)
2. [Tailwind 布局](./TailwindCSS02)
3. [Tailwind 间距和尺寸](./TailwindCSS03)
4. [Tailwind 排版](./TailwindCSS04)
5. [Tailwind 背景](./TailwindCSS05)
6. [Tailwind 边框](./TailwindCSS06)
7. [Tailwind Transitions & Animation](./TailwindCSS07)

:::tip

Unocss 同兼容 Tailwind，因此仅需学习 Tailwind 的用法即可。

:::

## Tailwind 的优势

利用 Tailwind 去构建 CSS 的一些实在的好处：

- **无需再为给类命名而浪费时间**。觉得这个真的非常棒，这对于统一一代码规范非常友好，不用再纠结这个项目是 BEM(Block-Element-Modifier)的规范，而下一个项目是 SMACSS (Scalable and Modular Architecture for CSS)。Tailwind 用的是 Atomic CSS，全为 inline-style，暂时理解为行内 CSS。
- CSS 的代码不再增加。因为所有的 CSS 都是可复用的，所以在大部分情况下都无需再写新的 CSS 样式了。
- 改写样式更加安全。在以往的项目中，CSS 样式可能是全局的，所以一旦更改可能会对其它 HTML 造成破坏，从一部分情况上看，是降低了用户心智。

## Tailwind 的一些劣势

- 相较于其它的 CSS 构建方法，Tailwind 由于是行内 CSS，所以无法使用类选择器等，只能手动自定义功能类生成变体而后进行引入，并不是很灵活。
- 每个样式各自独立，若是样式过多则较为混乱，这一点上 unocss 更具优势。因为 Unocss 有 `Attributify Mode` 可以将大量的 css 样式进行归类，看起来更加方便，不用转浏览器了，下面是俩者的差异。

```vue
<!-- Tailwindcss CSS -->
<button
  class="bg-blue-400 hover:bg-blue-500 text-sm text-white font-mono font-light py-2 px-4 rounded border-2 border-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600"
>
  Button
</button>

<!-- UnoCSS with Attributify Mode -->
<button
  bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600'
  text="sm white"
  font="mono light"
  p="y-2 X-4"
  border="2 rounded blue-200"
>
  Button
</button>
```

举个例子：在 Unocss 中 `text-sm text-white` 可以合并写成 `text="sm white"`，以**抽取共同的前缀**。

具体使用可见 [Unocss](https://unocss.dev/presets/attributify) 的介绍。

唯一不足的就是在 React + TS 中可能兼容性不佳，推荐在 Vue 中使用。
