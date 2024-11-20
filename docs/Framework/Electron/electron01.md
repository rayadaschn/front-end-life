---
title: electron 笔记
icon: go
date: 2024-10-20

category:
  - 框架
tag:
  - electron
star: false
sticky: false
---

## electron 介绍

## electron 通信

进程间通信（Inter-Process Communication，简称 IPC）是用于在至少两个进程或线程之间传输数据或信号。每个进程都有自己独立的系统资源，彼此隔离。为了实现不同进程之间的资源访问和协调工作，需要使用进程间通信。

在 Electron 中，无论是渲染进程给主进程发消息，还是主进程给渲染进程发消息，都是通过 IPC 机制实现的。此通信过程中随消息发送的 Json 对象会被序列化和反序列化，因此 Json 对象中包含的方法和原型链上的数据不会被传送。

1. 渲染进程向主进程发消息

   ```js
   // 渲染进程发送消息
   const { ipcRenderer } = require('electron')
   ipcRenderer.send('message', 'Hello from renderer process')
   ```

   ```js
   // 主进程接收消息
   const { ipcMain } = require('electron')
   ipcMain.on('message', (event, arg) => {
     // event 包含了 sender 属性，表示发送消息的渲染进程的 webContents 对象实例
     console.log(arg) // Prints: 'Hello from renderer process'
   })
   ```

   注意点，若主进程中设置了多处监听同一管道代码，则渲染进程发送消息时，会触发所有监听该管道的代码；其次，上面的消息传递是异步的，若需要同步传递，则可以使用 `ipcRenderer.sendSync` 和 `ipcMain.onSync`。

2. 主进程向渲染进程发消息

   ```js
   // 主进程发送消息
   win.webContents.send('message', 'Hello from main process')
   ```

   ```js
   // 渲染进程接收消息
   const { ipcRenderer } = require('electron')
   ipcRenderer.on('message', (event, arg) => {
     console.log(arg) // Prints: 'Hello from main process'
   })
   ```

3. 渲染进程之间消息传递

   渲染进程之间传递消息，需要借助主进程作为中介，因为 Electron 的渲染进程之间是相互隔离的，无法直接通信。

   ```js
   // 渲染进程A发送消息
   const { ipcRenderer } = require('electron')
   ipcRenderer.send('message', 'Hello from renderer process A')
   ```

   ```js
   // 主进程接收消息
   const { ipcMain } = require('electron')
   ipcMain.on('message', (event, arg) => {
     console.log(arg) // Prints: 'Hello from renderer process A'
     winB.webContent.send('message', 'Hello from main process')
   })
   ```

   ```js
   // 渲染进程B接收消息
   const { ipcRenderer } = require('electron')
   ipcRenderer.on('message', (event, arg) => {
     console.log(arg) // Prints: 'Hello from main process'
   })
   ```

   当然如果知道窗口 B 的 webContents 对象实例，也可以直接发送消息。利用 `sendTo` 方法。

   ```js
   // 窗口 A 直接向窗口 B 发送消息
   const { ipcRenderer } = require('electron')
   ipcRenderer.sendTo(
     winB.webContents.id,
     'message',
     'Hello from renderer process A'
   )
   ```

   ```js
   // 窗口 B 接收消息
   const { ipcRenderer } = require('electron')
   ipcRenderer.on('message', (event, arg) => {
     console.log(arg) // Prints: 'Hello from renderer process A'
   })
   ```
