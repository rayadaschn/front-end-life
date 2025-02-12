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

最终效果图如下:

![Canvas 绘制及拖动](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/Kapture%202024-05-27%20at%2000.02.01.gif)

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

上述是在绘制连线的基础上进行的，实际上还可以简化代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Canvas 画矩形</title>
    <style>
      body {
        margin: 0;
      }
      .container {
        width: 1024px;
        height: 600px;
        margin: 50px auto 0;
        box-shadow: 0 0 10px #000;
        border-radius: 10px;
        overflow: hidden;
        cursor: crosshair;
      }

      /* 工具栏 */
      .tool-bar {
        width: 1024px;
        height: 80px;
        margin: 18px auto;
        border-radius: 5px;
        display: flex;
        align-items: center;
        /* background-color: #8b8888;  */
      }

      .tool-bar div,
      input {
        width: 78px;
        height: 78px;
        border: 1px solid #b3b2b2;
        margin: 0 2px;
        cursor: pointer;
      }
      .tool-bar .remove {
        text-align: center;
        line-height: 78px;
        font-size: 40;
      }
    </style>
  </head>
  <body>
    <!-- 画板主体 -->
    <div class="container">
      <canvas id="myCanvas" class="canvas" width="1024" height="600" />
    </div>

    <!-- 工具栏 -->
    <div class="tool-bar">
      <!-- 颜色选择器 -->
      <input class="color" type="color" />
      <div class="remove">擦除</div>
    </div>

    <script>
      var can = document.getElementById('myCanvas')
      var tools = document.getElementsByClassName('tool-bar')[0]
      var colorPicker = document.getElementsByClassName('color')[0]
      var ctx = can.getContext('2d')
      var cWidth = can.width
      var cHeight = can.height
      var lineWidth = 4
      var x = 0
      var y = 0

      var curRect = null
      var isMoveRect = false
      var moveRect = null

      var rectLists = [] // 所有矩形列表, 依据这个进行绘制
      class Rectangle {
        constructor(startX, startY, color) {
          this.startX = startX
          this.startY = startY
          this.endX = startX
          this.endY = startY
          this.color = color
        }

        // 更新矩形
        draw() {
          ctx.beginPath()
          ctx.fillStyle = this.color
          ctx.strokeStyle = 'black'
          ctx.lineWidth = lineWidth || 1
          ctx.fillRect(
            this.startX,
            this.startY,
            this.endX - this.startX,
            this.endY - this.startY
          )
          ctx.closePath()
          ctx.stroke()
        }
      }

      /** 绑定事件 */
      function bindEvent() {
        // 画布事件
        can.addEventListener(
          'mousedown',
          function (e) {
            mouseDown(e)

            document.addEventListener('mousemove', mouseMove, false)
            document.addEventListener('mouseup', mouseUp, false)
          },
          false
        )

        // 工具栏事件
        tools.addEventListener('click', clickTool, false)
      }

      /** 鼠标点击 */
      function mouseDown(e) {
        setCanXY(e) // 更新 x、y
        curRect = new Rectangle(x, y, colorPicker.value)

        var rect = getRect(x, y)
        // 判断是否点击到了已有的矩形
        if (rect) {
          isMoveRect = true
          moveRect = rect
        } else {
          rectLists.push(curRect) // 补充当前矩形
        }
      }

      /** 移动鼠标 */
      function mouseMove(e) {
        // 保存当前鼠标位置
        var startX = x
        var startY = y
        // 更新鼠标位置
        setCanXY(e) // 更新 x、y

        // 是否移动矩形
        if (isMoveRect) {
          // 移动点击矩形
          disX = startX - x
          disY = startY - y
          moveRect.startX -= disX
          moveRect.startY -= disY
          moveRect.endX -= disX
          moveRect.endY -= disY
        } else {
          // 开始绘制矩形
          curRect.endX = x
          curRect.endY = y
        }
      }

      /** 鼠标抬起 */
      function mouseUp(e) {
        isMoveRect = false
        document.removeEventListener('mousemove', mouseMove, false)
        document.removeEventListener('mouseup', mouseUp, false)
      }

      /** 设置落笔位置 */
      function setCanXY(e) {
        var e = e || window.event

        var xPos = e.clientX - can.offsetLeft
        var yPos = e.clientY - can.offsetTop
        // 边界限制
        x = xPos < 0 ? 0 : xPos > cWidth ? cWidth : xPos
        y = yPos < 0 ? 0 : yPos > cHeight ? cHeight : yPos
      }

      /** 点击工具栏 */
      function clickTool(e) {
        var e = e || window.event
        var tar = e.target || e.srcElement

        // 检查是否点击了擦除工具
        if (tar.classList.contains('remove')) {
          rectLists.length = 0 // 清空绘制数组
          // ctx.clearRect(0, 0, cWidth, cHeight);
        }
      }

      /** 尝试获取矩形, 判断当前 x,y 是否在已绘制矩形内, 以最开始绘制为准 */
      function getRect(x, y) {
        for (var inx = 0; inx < rectLists.length; inx++) {
          var rect = rectLists[inx]
          var rectMinX = Math.min(rect.startX, rect.endX)
          var rectMaxX = Math.max(rect.startX, rect.endX)
          var rectMinY = Math.min(rect.startY, rect.endY)
          var rectMaxY = Math.max(rect.startY, rect.endY)

          if (
            x >= rectMinX &&
            x <= rectMaxX &&
            y >= rectMinY &&
            y <= rectMaxY
          ) {
            return rect
          }
        }
        return null
      }

      /** 绘制所有矩形 */
      function drawAllRect() {
        requestAnimationFrame(drawAllRect)
        ctx.clearRect(0, 0, cWidth, cHeight)
        // 在动画帧下, 依次绘制每个矩形
        for (var i = 0; i < rectLists.length; i++) {
          rectLists[i].draw()
        }
      }

      // 初始化
      var init = function () {
        bindEvent() // 绑定事件
        drawAllRect() // 绘制所有矩形
      }

      init()
    </script>
  </body>
</html>
```
