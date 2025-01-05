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

## 应用唤醒

企业级桌面应用一般都会定义自己的专属协议，我们可能都遇到过这样的场景：

- 在网页上点击聊天按钮，自动打开 QQ 软件;
- 在百度网盘点击下载，自动打开百度网盘软件;

这是通过**自定义协议**做到的。所谓自定义协议，其实就是给应用起个独一无二的名称，然后注册到操作系统里面，凡是通过这个协议名就能唤起这个软件了，在 Electron 中注册协议只需要一行代码：

```js
app.setAsDefaultProtocolClient('electron-desktop')
```

注册之后，当在浏览器中输入 `electron-desktop://` 之后，会发现弹出跳转提示，点击同意就能启动并跳转到桌面应用了，通过这种协议唤起应用被称为 `scheme` 唤起，而且在唤起的时候还可以带上一些参数，例如：

```js
electron-desktop://width=800&height=600
```

`scheme` 唤起的行为是操作系统默认支持的，操作系统也提供了 API 来监听唤起事件并拿到唤起参数。
关于自定义协议相关的资料：

- Mac 端：`https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app`
- Windows 端：`https://learn.microsoft.com/en-us/windows/uwp/launch-resume/launch-app-with-uri`

Electron 提供了三个与自定义协议相关的方法：

- `setAsDefaultProtocolClient`：设置协议
- `isDefaultProtocolClient`：查询状态
- `removeAsDefaultProtocolClient`：删除协议

### 获取协议参数

自定义协议之后，可以用 `scheme` 唤起桌面应用，这是非常重要的能力，这里面最关键的是需要拿到协议唤起参数，否则唤起 QQ 之后不知道要跟谁聊天，唤起百度网盘之后不知道要下载哪款资料。
在 Mac 和 Windows 上获取协议唤起参数是不一样的，这是由于平台策略不同导致的，所以需要单独讲解。

#### Mac 端协议唤起

在 Mac 上面通过监听 `open-url` 事件，可以拿到唤起的 `scheme` 参数：

```js
app.on('open-url', (event, url) => {
  console.log(url) // 打印 electron-desktop://width=800&height=600
})
```

`url` 里面就是 `scheme` 唤起的完整地址字符串，除了开头的 `electron-desktop://` 前缀之外，后面的内容是完全交给用户自定义的，例如：

- `electron-desktop://hello-juejin`
- `electron-desktop://1+1=2`

这些都可以唤起，上面之所以用 `width=800&height=600` 完全是因为模仿 http 地址栏的 query 参数的格式，有现成的 API 方便解析参数而已。下面给出完整的示例，把 `open-url` 的回调获取到的 scheme 参数解析出来放到全局变量 urlParams 里面：

```js
const { app, BrowserWindow } = require('electron')

const protocol = 'electron-desktop'
app.setAsDefaultProtocolClient(protocol)

let urlParams = {}

app.on('open-url', (event, url) => {
  const scheme = `${protocol}://`
  const urlParams = new URLSearchParams(url.slice(scheme.length))
  urlParams = Object.fromEntries(urlParams.entries())
})

app.whenReady().then(() => {
  createWindow()
})

function createWindow() {
  const mainWindow = new BrowserWindow({ width: 800, height: 600 })
  mainWindow.loadURL('https://www.juejin.cn')
}
```

协议唤起在 Mac 平台上有两点需要注意：

- `open-url` 要在 `ready` 事件之前注册，因为有些场景是需要拿到参数之后再决定如何创建窗口的，如果放在 `ready` 回调里面，`createWindow` 可能会拿不到该参数了。
- 在应用支持多实例场景下
  - 如果程序未启动，会立即启动应用，在 `open-url` 中获取到唤起参数
  - 如果存在正在运行的实例（可能有多个），会激活（其中一个）已经运行的程序，**而不会开启新的实例**，被激活的实例可以通过 open-url 回调获取唤起参数

#### Windows 端协议唤起

Windows 平台上没有提供 `open-url` 事件，而是会把 `scheme` 作为启动参数传递给应用程序，在代码里面可以用 `process.argv` 拿到所有参数，它是一个数组，格式如下：

```js
const argv = [
  'electron-desktop.exe',
  '--allow-file-access-from-files',
  'electron-desktop://width=400&height=300',
]
```

第一个参数是应用程序的路径，后面的就是其他的启动参数，如果是 `scheme` 唤起的，也会在里面，所以可以用下面的代码进行判断：

```js
const url = process.argv.find((v) => v.startsWith(scheme))
if (url) {
  // 如果发现 electron-desktop:// 前缀，说明是通过 scheme 唤起
  console.log(url)
}
```

如果程序支持多示例，每次都会启动新的程序，上面的代码就够用了。但如果是单实例的场景，情况就稍稍不同了，因为本质上还是会打开新的程序，只不过程序里判断单实例锁被占用，从而则立即退出，所以必须要有办法在 scheme 唤起的时候，能够通知到当前正在运行的那个实例。这里用到的仍然是 `second-instance` 事件：

```js
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, argv, workingDirectory) => {
    // Mac 平台只需要展示窗口即可
    mainWindow.restore()
    mainWindow.show()

    // Windows 平台上需要判断新的实例是否被 scheme 唤起
    const url = argv.find((v) => v.startsWith(scheme))
    if (url) {
      // 如果发现 electron-desktop:// 前缀，说明是通过 scheme 唤起
      console.log(url)
    }
  })
}
```

关键在于第二个参数 `argv`，如果是通过 `scheme` 唤起的话，`argv` 里面会包含 `scheme` 协议，与 `process.argv` 类似，格式是一个数组，第一项就是 `electron-desktop.exe` 的位置，后面是一些参数，例如：

```js
const argv = [
  'electron-desktop.exe',
  '--allow-file-access-from-files',
  'electron-desktop://width=400&height=300',
  'C:\\Windows\\system32',
]
```

#### 实战

做一个「桌面掘金」，需求是：

1. 可以打包成 `juejin.app` (MacOS) 和 `juejin.exe` 桌面应用
2. 打开应用后立即进入掘金首页
3. 限制桌面掘金为单实例运行
4. 支持用 `juejin://` 这个 `scheme` 唤起应用
5. 支持用 `juejin://width=500&heigh=300` 这个 scheme 指定窗口大小

```js
const { app, BrowserWindow } = require('electron')

let mainWindow // 主窗口对象

const protocol = 'juejin' // 自定义协议名称
const scheme = `${protocol}://` // 自定义协议的完整格式
app.setAsDefaultProtocolClient(protocol) // 设置应用为该协议的默认处理程序

let urlParams = {} // 用于存储从协议中解析的 URL 参数

// 在启动应用时处理协议唤醒
handleSchemeWakeup(process.argv)

const gotTheLock = app.requestSingleInstanceLock() // 确保应用为单实例
if (!gotTheLock) {
  // 如果另一个实例正在运行，则退出当前实例
  app.quit()
} else {
  // 当应用已有实例运行时，监听第二个实例的唤醒
  app.on('second-instance', (event, argv) => {
    // 如果主窗口最小化了，恢复窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus() // 聚焦窗口
    }
    handleSchemeWakeup(argv) // 处理新实例传递的协议参数
  })
}

// 处理 macOS 中通过协议唤醒的事件
app.on('open-url', (event, url) => {
  event.preventDefault() // 防止默认行为
  handleSchemeWakeup([url]) // 处理传入的协议 URL
})

app.whenReady().then(() => {
  createWindow() // 当应用准备就绪时创建主窗口

  // macOS 中，当点击 Dock 图标重新激活应用时，创建新窗口（如果不存在）
  app.on('activate', () => {
    if (!mainWindow) createWindow()
  })
})

// 创建主窗口
function createWindow() {
  // 从 URL 参数中获取窗口的宽度和高度，默认为 800x600
  const width = parseInt(urlParams.width) || 800
  const height = parseInt(urlParams.height) || 600

  if (mainWindow) {
    // 如果窗口已经存在，调整尺寸并聚焦
    mainWindow.setSize(width, height)
    mainWindow.focus()
  } else {
    // 创建新窗口
    mainWindow = new BrowserWindow({ width, height })
    mainWindow.loadURL('https://www.juejin.cn') // 加载指定的 URL

    // 当窗口关闭时，清除主窗口引用
    mainWindow.on('closed', () => {
      mainWindow = null
    })
  }
}

// 处理通过协议唤醒的逻辑
function handleSchemeWakeup(argv) {
  // 从命令行参数或传递的参数中查找符合自定义协议的 URL, 兼容 windows 组成数组
  const url = [].concat(argv).find((v) => v.startsWith(scheme))
  if (!url) return // 如果未找到协议 URL，则直接返回

  // 解析协议 URL 的查询参数部分
  const searchParams = new URLSearchParams(url.slice(scheme.length))
  urlParams = Object.fromEntries(searchParams.entries()) // 将查询参数转换为对象

  // 如果应用已准备好，更新窗口内容
  if (app.isReady()) createWindow()
}
```
