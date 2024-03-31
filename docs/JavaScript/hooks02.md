---
title: 用 canvas 绘制一个矩形并实现其拖动
icon: typescript
date: 2024-02-05
category:
  - javascript
tag:
  - hooks

sticky: false
---

该文为上篇[《手写一个具备拖拉拽多功能的弹窗》](./hooks01)的延续。

首先需要区分 `e.clientX` 和 `e.offsetX` 的区别:

- `e.clientX` 是相对于整个文档左上角的坐标。
- `e.offsetX` 是相对于触发事件的元素左上角的坐标。

设计思路:

1. 绘制获取 Canvas 元素。
2. 创建存储绘制矩形的数组, 后续依据这个数组来遍历绘制矩阵;
3. 创建绘制矩阵的类, 包含绘制矩阵的方法, 以及矩形的四角信息;
4. 监听 Canvas 的鼠标按下事件 onmousedown, 分俩种情况, 一种是点击了已绘制矩形, 另一种是点击了空白处开始绘制矩形;
5. 创建判断是否是绘制块, 创建依据遍历绘制数组, 绘制 Canvas。

关键代码:

```js
// 创建 Canvas
const cvs = document.querySelector('canvas')
const ctx = cvs.getContext('2d')

// 绘制矩阵
ctx.beginPath() // 开始绘制新的路径
ctx.moveTo(10, 10) // 移动到指定点
ctx.lineTo(100, 10) // 绘制一条线
// ...
ctx.stroke() // 绘制路径
ctx.fillStyle = black
ctx.lineCap = 'square' // 消除锯齿状
ctx.fill() // 填充路径

// 监听点击

// 1. 获取 Canvas 元素位置信息
const bounding = cvs.getBoundingClientRect() // 获取了 cvs 元素相对于视口（viewport）的位置信息
// 2. 遍历 Array 数组, 判断是否点击了已绘制的矩形
// 3. 点击未绘制的矩形, 则开始绘制矩形, 依据创建的 矩形类创建新的实例, 并将其推入数组; 同时监听修改该数组的四角信息;
// 4. 点击已绘制的矩形, 则修改该矩形的四角信息;

// 绘制函数，使用 requestAnimationFrame 实现动画效果
requestAnimationFrame(draw)
// 清理原有的视图
ctx.clearRect(0, 0, cvs.width, cvs.height)
```

可以有如下代码:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Canvas 绘制及拖拽</title>
    <style>
      canvas {
        border: 1px solid black;
      }
    </style>
  </head>
  <body>
    <!-- 颜色选择器 -->
    <input type="color" />
    <!-- 画布元素 -->
    <canvas></canvas>

    <script>
      // 获取颜色选择器和画布元素
      const colorPicker = document.querySelector('input')
      const cvs = document.querySelector('canvas')
      const ctx = cvs.getContext('2d')
      const devicePixelRatio = window.devicePixelRatio || 1

      // 初始化画布
      function init() {
        const w = 500,
          h = 300
        cvs.width = w * devicePixelRatio
        cvs.height = h * devicePixelRatio
        cvs.style.width = `${w}px`
        cvs.style.height = `${h}px`
      }

      // 调用初始化函数
      init()

      // 存储绘制矩形的数组
      const shapes = []

      // 矩形类
      class Rectangle {
        constructor(color, startX, startY) {
          this.color = color
          this.startX = startX
          this.startY = startY
          this.endX = startX
          this.endY = startY
        }

        // 获取矩形的最小 X 坐标
        get minX() {
          return Math.min(this.startX, this.endX)
        }

        // 获取矩形的最大 X 坐标
        get maxX() {
          return Math.max(this.startX, this.endX)
        }

        // 获取矩形的最小 Y 坐标
        get minY() {
          return Math.min(this.startY, this.endY)
        }

        // 获取矩形的最大 Y 坐标
        get maxY() {
          return Math.max(this.startY, this.endY)
        }

        // 绘制矩形
        draw() {
          ctx.beginPath() // 开始绘制新的路径
          ctx.moveTo(this.minX * devicePixelRatio, this.minY * devicePixelRatio)
          ctx.lineTo(this.maxX * devicePixelRatio, this.minY * devicePixelRatio)
          ctx.lineTo(this.maxX * devicePixelRatio, this.maxY * devicePixelRatio)
          ctx.lineTo(this.minX * devicePixelRatio, this.maxY * devicePixelRatio)
          ctx.lineTo(this.minX * devicePixelRatio, this.minY * devicePixelRatio)
          ctx.fillStyle = this.color
          ctx.lineCap = 'square' // 消除锯齿状
          ctx.fill()
          // 绘制白边
          ctx.strokeStyle = 'blue'
          ctx.lineWidth = 3 * devicePixelRatio
          ctx.stroke()
        }
      }

      // 监听 canvas 点击
      cvs.onmousedown = (e) => {
        const bounding = cvs.getBoundingClientRect() // 获取了 cvs 元素相对于视口（viewport）的位置信息
        const rect = new Rectangle(
          colorPicker.value,
          e.clientX - bounding.left,
          e.clientY - bounding.top
        )

        const shape = getShape(
          e.clientX - bounding.left,
          e.clientY - bounding.top
        )
        if (shape) {
          console.log('拖动')
          const { startX, startY, endX, endY } = shape
          const mouseX = e.clientX - bounding.left
          const mouseY = e.clientY - bounding.top
          window.onmousemove = (e) => {
            const disX = e.clientX - bounding.left - mouseX
            const disY = e.clientY - bounding.top - mouseY
            shape.startX = startX + disX
            shape.startY = startY + disY
            shape.endX = endX + disX
            shape.endY = endY + disY
          }
        } else {
          shapes.push(rect)

          // 监听鼠标移动
          window.onmousemove = (e) => {
            rect.endX = e.clientX - bounding.left
            rect.endY = e.clientY - bounding.top
          }
        }

        // 监听鼠标松开
        window.onmouseup = () => {
          window.onmousemove = null
          window.onmouseup = null
        }
      }

      // 判断是否是绘制块
      function getShape(x, y) {
        // 从后向前, 后面绘制的, 可能会覆盖前面的
        for (let i = shapes.length - 1; i >= 0; i--) {
          const shape = shapes[i]
          if (
            x >= shape.minX &&
            x <= shape.maxX &&
            y >= shape.minY &&
            y <= shape.maxY
          ) {
            return shape
          }
        }
        return false
      }

      // 绘制函数，使用 requestAnimationFrame 实现动画效果
      function draw() {
        requestAnimationFrame(draw)
        ctx.clearRect(0, 0, cvs.width, cvs.height)

        // 遍历绘制所有矩形
        for (const shape of shapes) {
          shape.draw()
        }
      }

      // 调用绘制函数
      draw()
    </script>
  </body>
</html>
```