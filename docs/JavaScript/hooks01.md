---
title: 手写一个具备拖拉拽多功能的弹窗
icon: typescript
date: 2023-09-16
category:
  - javascript
tag:
  - hooks

sticky: false
---

手写一个具备拖拉拽多功能的弹窗：

- 能够拖动弹窗位置；
- 能够放大缩小弹窗；
- 能够实现弹窗的最小化和还原最大化。

![拖拉拽弹窗](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202309161721690.png)

## 绘制基本弹框

如上图所示，有四个部分：

1. 弹框主体
2. 第一排拖动和最小化/还原最大化功能区按钮
3. 弹窗内容
4. 右下角弹窗拖拽功能按钮

实现原理：通过 ref 动态控制弹窗的大小和相对于屏幕的位置。

因此，可以先绘制出最基本的弹窗样式。这里我们引入的是 AntDesignVue 的图标库。

```vue
<template>
  <div>
    <h1>拖拉拽弹框</h1>

    <div
      ref="box"
      class="box"
      :class="{ 'unset-size': !state.expanded }"
      @wheel.capture.stop
    >
      <div class="container">
        <div class="action-bar">
          <div ref="dragHandle" class="icon" style="cursor: grab">
            <DragOutlined />
          </div>
          <div
            class="icon"
            style="cursor: pointer"
            @click="state.expanded = !state.expanded"
          >
            <FullscreenExitOutlined v-if="state.expanded" />
            <FullscreenOutlined v-else />
          </div>
        </div>
        <div v-if="state.expanded" class="info">{{ text }}</div>
      </div>

      <div v-if="state.expanded" ref="resizeHandle" class="mouse-sensor">
        <ArrowsAltOutlined />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const box = ref<HTMLElement>()
const dragHandle = ref<HTMLElement>()
const resizeHandle = ref<HTMLElement>()
const state = ref({
  left: 50,
  top: 100,
  width: 250,
  height: 200,
  expanded: true,
})

const text = `Axios is a promise-based HTTP Client for node.js and the browser. It is isomorphic (= it can run in the browser and nodejs with the same codebase). On the server-side it uses the native node.js http module, while on the client (browser) it uses XMLHttpRequests.

Features

- Make XMLHttpRequests from the browser
- Make http requests from node.js
- Supports the Promise API
- Intercept request and response
- Transform request and response data
- Cancel requests
- Timeouts
- Query parameters serialization with support for nested entries

- Automatic request body serialization to:
    a. JSON (application/json)
    b. Multipart / FormData (multipart/form-data)
    c. URL encoded form (application/x-www-form-urlencoded)

- Posting HTML forms as JSON
- Automatic JSON data handling in response
- Progress capturing for browsers and node.js with extra info (speed rate, remaining time)
- Setting bandwidth limits for node.js
- Compatible with spec-compliant FormData and Blob (including node.js)
- Client side support for protecting against XSRF`
</script>

<style scoped lang="less">
.box {
  position: fixed;
  z-index: 2;
  background: #42b983;
  padding: 8px 16px;
  box-shadow: 0px 0px 4px 4px;
  border-radius: 4px;

  &.unset-size {
    width: unset !important;
    height: unset !important;
  }

  .container {
    height: 100%;
    display: flex;
    overflow: hidden;
    flex-direction: column;
  }

  .action-bar {
    display: flex;
    align-items: center;
    user-select: none;

    .icon {
      font-size: 24px;
      padding: 2px 4px;
      border-radius: 4px;

      &:hover {
        background: #374151;
      }
    }

    & > * {
      flex-wrap: wrap;

      &:not(:last-child) {
        margin-right: 8px;
      }
    }
  }

  .info {
    padding-top: 4px;
    word-break: break-all;
    white-space: pre-line;
    overflow: auto;
  }

  .mouse-sensor {
    position: absolute;
    bottom: 1px;
    right: 2px;
    transform: rotate(90deg);
    cursor: se-resize;
    z-index: 1;
    background: #42b983;
    border-radius: 2px;

    font-size: 18px;
    padding: 2px;
  }
}
</style>
```

在样式中，我们定义了一个响应式变量 state 用来存储弹窗的初始转态，分别是宽高和距离屏幕的初始位置和是否展开窗体的状态。

> 其它说明:
>
> `:class="{ 'unset-size': !state.expanded }"` 加入了 `unset-size` 属性是为了在最小化弹窗时重置弹窗大小。
>
> `@wheel.capture.stop` 表示在弹窗上监听鼠标滚轮事件，并阻止事件继续传播。这样做的目的可能是为了防止鼠标滚轮事件冒泡到父元素或其他元素上，以避免对页面滚动等行为的干扰。

## 手写拖拽弹窗 Hooks

在上面的初始代码中，我们还定义了三个 ref 用于获取 DOM 元素。它们的作用分别是：

- box：用于响应式的更改窗体大小和位置；
- dragHandle：用于响应式监听拖动窗体位置；
- resizeHandle：用于响应式监听拖拽窗体大小。

因此有 `useResizeAndDrag` 初始定义：

```ts
interface UseResizeAndDragOptions {
  onResize?: (width: number, height: number) => void
  onDrag?: (left: number, top: number) => void
  left?: number
  top?: number
  width?: number
  height?: number
}

function useResizeAndDrag(
  elementRef: Ref<HTMLElement | undefined>,
  resizeHandleRef: Ref<HTMLElement | undefined>,
  dragHandleRef?: Ref<HTMLElement | undefined>,
  options?: UseResizeAndDragOptions
): void {}
```

接下来对窗体进行初始化:

```ts
const resizeHandle = { x: 0, y: 0 }
let startX = 0 // 拖动起始位置, 定义变量便于后续使用
let startY = 0
let startWidth = typeof options?.width === 'number' ? options.width : 0
let startHeight = typeof options?.height === 'number' ? options.height : 0
let startLeft = typeof options?.left === 'number' ? options.left : 0
let startTop = typeof options?.top === 'number' ? options.top : 0
let isDragging = false // 检测是否开始拖动，避免拖动和移动事件鼠标移动监听的冲突

const handleWindowResize = () => {
  if (!elementRef.value || !resizeHandleRef.value) return
  let left = elementRef.value.offsetLeft
  let top = elementRef.value.offsetTop
  let width = elementRef.value.offsetWidth
  let height = elementRef.value.offsetHeight

  // 检查元素是否超过视窗宽度
  if (left + width > window.innerWidth) {
    left = window.innerWidth - width
    if (left < 0) {
      left = 0
      width = window.innerWidth
    }
  }

  // 检查元素是否超过视窗高度
  if (top + height > window.innerHeight) {
    top = window.innerHeight - height
    if (top < 0) {
      top = 0
      height = window.innerHeight
    }
  }

  // 更新元素位置和大小
  elementRef.value.style.left = `${left}px`
  elementRef.value.style.top = `${top}px`
  elementRef.value.style.width = `${width}px`
  elementRef.value.style.height = `${height}px`
}

// 在 hook 中用引入 onMounted 生命周期钩子函数
onMounted(() => {
  if (!elementRef.value || !options) return
  if (typeof options.width === 'number') {
    elementRef.value.style.width = `${options.width}px`
  }
  if (typeof options.height === 'number') {
    elementRef.value.style.height = `${options.height}px`
  }
  if (typeof options.left === 'number') {
    elementRef.value.style.left = `${options.left}px`
  }
  if (typeof options.top === 'number') {
    elementRef.value.style.top = `${options.top}px`
  }
  handleWindowResize()
  window.addEventListener('resize', handleWindowResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleWindowResize)
})
```

在初始化窗体后，检测窗体大小是否超出可视窗口位置，并添加 resize 事件。（由于添加了 resize 监听事件，所以在最后的 onBeforeUnmount 中进行卸载）

完成初始化后可以开始监听窗体拖拽和滚动事件了，为了兼容手机端因此点击和结束的事件都有俩个:

`mousedown` 和 `touchstart` 对应 `mouseup` 和 `touchend`。

```ts
watch(
  () => [elementRef.value, resizeHandleRef.value, dragHandleRef.value],
  ([element, resizeHandle, dragHandle]) => {
    if (element && resizeHandle) {
      resizeHandle.addEventListener('mousedown', handleResizeMouseDown)
      resizeHandle.addEventListener('touchstart', handleResizeMouseDown)
    }
    if (element && dragHandle) {
      dragHandle.addEventListener('mousedown', handleDragMouseDown)
      dragHandle.addEventListener('touchstart', handleDragMouseDown)
    }
  }
)
```

这便完成了对窗体和功能按钮的监听，当按下按钮后接下来便是开始计算拖拽和移动的位置：

```ts
// 先看拖拽事件
const handleResizeMouseDown = (e: MouseEvent | TouchEvent) => {
  e.stopPropagation() // 阻止事件冒泡
  e.preventDefault() // 阻止原生事件
  if (!elementRef.value || !resizeHandleRef.value) return

  startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  startY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY
  startWidth = elementRef.value.offsetWidth
  startHeight = elementRef.value.offsetHeight
  resizeHandle.x = resizeHandleRef.value.offsetLeft
  resizeHandle.y = resizeHandleRef.value.offsetTop

  // 监听下按
  document.documentElement.addEventListener('mousemove', handleResizeMouseMove)
  document.documentElement.addEventListener('touchmove', handleResizeMouseMove)
  // 监听抬起
  document.documentElement.addEventListener('mouseup', handleResizeMouseUp)
  document.documentElement.addEventListener('touchend', handleResizeMouseUp)
}

const handleResizeMouseMove = (e: MouseEvent | TouchEvent) => {
  if (!elementRef.value || !resizeHandleRef.value) return

  let width =
    startWidth +
    ((e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - startX)
  let height =
    startHeight +
    ((e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - startY)
  let handleX =
    resizeHandle.x +
    ((e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - startX)
  let handleY =
    resizeHandle.y +
    ((e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - startY)

  // 检查窗体是否超出视宽
  if (handleX + resizeHandleRef.value.offsetWidth > window.innerWidth) {
    handleX = window.innerWidth - resizeHandleRef.value.offsetWidth
  }
  if (elementRef.value.offsetLeft + width > window.innerWidth) {
    width = window.innerWidth - elementRef.value.offsetLeft
  }

  // 检查窗体是否超出视高
  if (handleY + resizeHandleRef.value.offsetHeight > window.innerHeight) {
    handleY = window.innerHeight - resizeHandleRef.value.offsetHeight
  }
  if (elementRef.value.offsetTop + height > window.innerHeight) {
    height = window.innerHeight - elementRef.value.offsetTop
  }

  elementRef.value.style.width = `${width}px`
  elementRef.value.style.height = `${height}px`
  resizeHandleRef.value.style.left = `${handleX}px`
  resizeHandleRef.value.style.top = `${handleY}px`

  // 保存当前窗口大小, 后边下次窗口打开复原
  if (options?.onResize) {
    options.onResize(width, height)
  }
}

const handleResizeMouseUp = () => {
  document.documentElement.removeEventListener(
    'mousemove',
    handleResizeMouseMove
  )
  document.documentElement.removeEventListener(
    'touchmove',
    handleResizeMouseMove
  )
  document.documentElement.removeEventListener('mouseup', handleResizeMouseUp)
  document.documentElement.removeEventListener('touchend', handleResizeMouseUp)
}
```

```ts
// 监听拖动事件
const handleDragMouseDown = (e: MouseEvent | TouchEvent) => {
  e.stopPropagation()
  e.preventDefault()
  if (!elementRef.value || !dragHandleRef.value) return
  isDragging = true
  startLeft = elementRef.value.offsetLeft
  startTop = elementRef.value.offsetTop
  startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  startY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY
  document.documentElement.addEventListener('mousemove', handleDragMouseMove)
  document.documentElement.addEventListener('touchmove', handleDragMouseMove)
  document.documentElement.addEventListener('mouseup', handleDragMouseUp)
  document.documentElement.addEventListener('touchend', handleDragMouseUp)
}

const handleDragMouseMove = (e: MouseEvent | TouchEvent) => {
  if (!elementRef.value || !dragHandleRef.value || !isDragging) return
  const left =
    startLeft +
    ((e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - startX)
  const top =
    startTop +
    ((e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - startY)

  // 检查元素是否超出视宽
  if (left < 0) {
    elementRef.value.style.left = '0px'
  } else if (left + elementRef.value.offsetWidth > window.innerWidth) {
    elementRef.value.style.left = `${
      window.innerWidth - elementRef.value.offsetWidth
    }px`
  } else {
    elementRef.value.style.left = `${left}px`
  }

  //  检查元素是否超出视高
  if (top < 0) {
    elementRef.value.style.top = '0px'
  } else if (top + elementRef.value.offsetHeight > window.innerHeight) {
    elementRef.value.style.top = `${
      window.innerHeight - elementRef.value.offsetHeight
    }px`
  } else {
    elementRef.value.style.top = `${top}px`
  }

  if (options?.onDrag) {
    options.onDrag(left, top)
  }
}

const handleDragMouseUp = () => {
  isDragging = false
  document.documentElement.removeEventListener('mousemove', handleDragMouseMove)
  document.documentElement.removeEventListener('touchmove', handleDragMouseMove)
  document.documentElement.removeEventListener('mouseup', handleDragMouseUp)
  document.documentElement.removeEventListener('touchend', handleDragMouseUp)
}
```

拖动事件和移动事件在鼠标移动上有事件监听重复，因此在初始时增加了一个 `isDragging` 变量来隔离俩者。

最后为了防止内存泄漏，在组件卸载时统一将这些事件给予卸载：

```ts
onBeforeUnmount(() => {
  document.documentElement.removeEventListener(
    'mousemove',
    handleResizeMouseMove
  )
  document.documentElement.removeEventListener(
    'touchmove',
    handleResizeMouseMove
  )
  document.documentElement.removeEventListener('mouseup', handleResizeMouseUp)
  document.documentElement.removeEventListener('touchend', handleResizeMouseUp)
  document.documentElement.removeEventListener('mousemove', handleDragMouseMove)
  document.documentElement.removeEventListener('touchmove', handleDragMouseMove)
  document.documentElement.removeEventListener('mouseup', handleDragMouseUp)
  document.documentElement.removeEventListener('touchend', handleDragMouseUp)
  window.removeEventListener('resize', handleWindowResize)
})
```

此处附上 Hooks 的完整代码:

```ts
import { onMounted, onBeforeUnmount, type Ref, watch } from 'vue'

interface ResizeHandle {
  x: number
  y: number
}

interface UseResizeAndDragOptions {
  onResize?: (width: number, height: number) => void
  onDrag?: (left: number, top: number) => void
  left?: number
  top?: number
  width?: number
  height?: number
}

export function useResizeAndDrag(
  elementRef: Ref<HTMLElement | undefined>,
  resizeHandleRef: Ref<HTMLElement | undefined>,
  dragHandleRef: Ref<HTMLElement | undefined>,
  options?: UseResizeAndDragOptions
) {
  const resizeHandle: ResizeHandle = { x: 0, y: 0 }
  let startX = 0
  let startY = 0
  let startWidth = typeof options?.width === 'number' ? options.width : 0
  let startHeight = typeof options?.height === 'number' ? options.height : 0
  let startLeft = typeof options?.left === 'number' ? options.left : 0
  let startTop = typeof options?.top === 'number' ? options.top : 0
  let isDragging = false

  const handleResizeMouseDown = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!elementRef.value || !resizeHandleRef.value) return

    startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
    startY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY
    startWidth = elementRef.value.offsetWidth
    startHeight = elementRef.value.offsetHeight
    resizeHandle.x = resizeHandleRef.value.offsetLeft
    resizeHandle.y = resizeHandleRef.value.offsetTop

    // 监听下按
    document.documentElement.addEventListener(
      'mousemove',
      handleResizeMouseMove
    )
    document.documentElement.addEventListener(
      'touchmove',
      handleResizeMouseMove
    )
    // 监听抬起
    document.documentElement.addEventListener('mouseup', handleResizeMouseUp)
    document.documentElement.addEventListener('touchend', handleResizeMouseUp)
  }

  const handleResizeMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!elementRef.value || !resizeHandleRef.value) return

    let width =
      startWidth +
      ((e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - startX)
    let height =
      startHeight +
      ((e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - startY)
    let handleX =
      resizeHandle.x +
      ((e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - startX)
    let handleY =
      resizeHandle.y +
      ((e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - startY)

    // 检查窗体是否超出视宽
    if (handleX + resizeHandleRef.value.offsetWidth > window.innerWidth) {
      handleX = window.innerWidth - resizeHandleRef.value.offsetWidth
    }
    if (elementRef.value.offsetLeft + width > window.innerWidth) {
      width = window.innerWidth - elementRef.value.offsetLeft
    }

    // 检查窗体是否超出视高
    if (handleY + resizeHandleRef.value.offsetHeight > window.innerHeight) {
      handleY = window.innerHeight - resizeHandleRef.value.offsetHeight
    }
    if (elementRef.value.offsetTop + height > window.innerHeight) {
      height = window.innerHeight - elementRef.value.offsetTop
    }

    elementRef.value.style.width = `${width}px`
    elementRef.value.style.height = `${height}px`
    resizeHandleRef.value.style.left = `${handleX}px`
    resizeHandleRef.value.style.top = `${handleY}px`

    // 保存当前窗口大小, 后边下次窗口打开复原
    if (options?.onResize) {
      options.onResize(width, height)
    }
  }

  const handleResizeMouseUp = () => {
    document.documentElement.removeEventListener(
      'mousemove',
      handleResizeMouseMove
    )
    document.documentElement.removeEventListener(
      'touchmove',
      handleResizeMouseMove
    )
    document.documentElement.removeEventListener('mouseup', handleResizeMouseUp)
    document.documentElement.removeEventListener(
      'touchend',
      handleResizeMouseUp
    )
  }

  const handleDragMouseDown = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!elementRef.value || !dragHandleRef.value) return
    isDragging = true
    startLeft = elementRef.value.offsetLeft
    startTop = elementRef.value.offsetTop
    startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
    startY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY
    document.documentElement.addEventListener('mousemove', handleDragMouseMove)
    document.documentElement.addEventListener('touchmove', handleDragMouseMove)
    document.documentElement.addEventListener('mouseup', handleDragMouseUp)
    document.documentElement.addEventListener('touchend', handleDragMouseUp)
  }

  const handleDragMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!elementRef.value || !dragHandleRef.value || !isDragging) return
    const left =
      startLeft +
      ((e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - startX)
    const top =
      startTop +
      ((e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - startY)

    // 检查元素是否超出视宽
    if (left < 0) {
      elementRef.value.style.left = '0px'
    } else if (left + elementRef.value.offsetWidth > window.innerWidth) {
      elementRef.value.style.left = `${
        window.innerWidth - elementRef.value.offsetWidth
      }px`
    } else {
      elementRef.value.style.left = `${left}px`
    }

    //  检查元素是否超出视高
    if (top < 0) {
      elementRef.value.style.top = '0px'
    } else if (top + elementRef.value.offsetHeight > window.innerHeight) {
      elementRef.value.style.top = `${
        window.innerHeight - elementRef.value.offsetHeight
      }px`
    } else {
      elementRef.value.style.top = `${top}px`
    }

    if (options?.onDrag) {
      options.onDrag(left, top)
    }
  }

  const handleDragMouseUp = () => {
    isDragging = false
    document.documentElement.removeEventListener(
      'mousemove',
      handleDragMouseMove
    )
    document.documentElement.removeEventListener(
      'touchmove',
      handleDragMouseMove
    )
    document.documentElement.removeEventListener('mouseup', handleDragMouseUp)
    document.documentElement.removeEventListener('touchend', handleDragMouseUp)
  }

  const handleWindowResize = () => {
    if (!elementRef.value || !resizeHandleRef.value) return
    let left = elementRef.value.offsetLeft
    let top = elementRef.value.offsetTop
    let width = elementRef.value.offsetWidth
    let height = elementRef.value.offsetHeight

    // 检查是否超出视宽
    if (left + width > window.innerWidth) {
      left = window.innerWidth - width
      if (left < 0) {
        left = 0
        width = window.innerWidth
      }
    }

    // 检查是否超出视高
    if (top + height > window.innerHeight) {
      top = window.innerHeight - height
      if (top < 0) {
        top = 0
        height = window.innerHeight
      }
    }

    // 更新窗体大小
    elementRef.value.style.left = `${left}px`
    elementRef.value.style.top = `${top}px`
    elementRef.value.style.width = `${width}px`
    elementRef.value.style.height = `${height}px`
  }

  onMounted(() => {
    if (!elementRef.value || !options) return
    if (typeof options.width === 'number') {
      elementRef.value.style.width = `${options.width}px`
    }
    if (typeof options.height === 'number') {
      elementRef.value.style.height = `${options.height}px`
    }
    if (typeof options.left === 'number') {
      elementRef.value.style.left = `${options.left}px`
    }
    if (typeof options.top === 'number') {
      elementRef.value.style.top = `${options.top}px`
    }
    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
  })

  onBeforeUnmount(() => {
    document.documentElement.removeEventListener(
      'mousemove',
      handleResizeMouseMove
    )
    document.documentElement.removeEventListener(
      'touchmove',
      handleResizeMouseMove
    )
    document.documentElement.removeEventListener('mouseup', handleResizeMouseUp)
    document.documentElement.removeEventListener(
      'touchend',
      handleResizeMouseUp
    )
    document.documentElement.removeEventListener(
      'mousemove',
      handleDragMouseMove
    )
    document.documentElement.removeEventListener(
      'touchmove',
      handleDragMouseMove
    )
    document.documentElement.removeEventListener('mouseup', handleDragMouseUp)
    document.documentElement.removeEventListener('touchend', handleDragMouseUp)
    window.removeEventListener('resize', handleWindowResize)
  })

  watch(
    () => [elementRef.value, resizeHandleRef.value, dragHandleRef.value],
    ([element, resizeHandle, dragHandle]) => {
      if (element && resizeHandle) {
        resizeHandle.addEventListener('mousedown', handleResizeMouseDown)
        resizeHandle.addEventListener('touchstart', handleResizeMouseDown)
      }
      if (element && dragHandle) {
        dragHandle.addEventListener('mousedown', handleDragMouseDown)
        dragHandle.addEventListener('touchstart', handleDragMouseDown)
      }
    }
  )

  return {
    handleResizeMouseDown,
    handleDragMouseDown,
  }
}
```

在最后，暴露了俩个事件 `handleResizeMouseDown` 和 `handleDragMouseDown` 为 Hooks 的返回便于定制化更改窗体大小和位置。
