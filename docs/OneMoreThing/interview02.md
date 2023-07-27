---
title: Interview -- JS 异步
icon: note
date: 2023-06-25
category:
  - anonymous
tag:
  - note
star: false
# sticky: true
sticky: false
---

在此梳理 JS 异步的一些问题。

## 目录

1. 请描述 Event Loop(事件循环/事件轮询) 的机制,可画图。
2. 什么是宏任务和微任务，两者有什么区别？
3. Promise 有哪三种状态？如何变化？
4. 场景题 —— async 和 await 的顺序问题

### 请描述 Event Loop(事件循环/事件轮询) 的机制,可画图

JS 是单线程运行，所以异步需要基于回调来实现，Event Loop 就是异步回调的实现原理。
