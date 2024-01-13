---
title: Interview -- 手写防抖节流
icon: note
date: 2023-08-10
category:
  - anonymous
tag:
  - note
star: false
# sticky: true
sticky: false
---

防抖和节流是俩兄弟，要会用才会写防抖节流。在这里简单实现一下，以作巩固。

## 防抖 debounce

简单核心要素版

```js
function debounce(fn, delay = 500) {
  let timer = null
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    fn()
    timer = null
  }, delay)
}
```

防抖实现 this 和参数问题版

```js
function debounce(fn, delay = 500) {
  let timer = null
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
```

测试:

```js
const inputEl = document.getElementById('input1')

inputEl.addEventListener(
  'keyup',
  debounce(() => {
    console.log('点击~', inputEl2.value)
  }, 1000)
)
```

## 节流 throttle

场景: 拖拽

节流相比于防抖相对简单，只需将 timer 设置成固定时间即可。

```js
function throttle(fn, delay = 100) {
  let timer = null
  return function () {
    if (timer) return
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, delay)
  }
}
```

测试:

```js
const divEl = document.getElementById('drag')

divEl.addEventListener(
  'drag',
  throttle(function (e) {
    console.log(e.offsetX, e.offsetY)
  }, 200)
)
```
