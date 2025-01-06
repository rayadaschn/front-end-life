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

## 集成 Node.js

企业级桌面应用的资源都是本地化的，离线也能使用，所以需要把 html、js、css 这些资源都打包进去，接下来我们就在 `src/renderer` 目录下创建 `index.html` 和 `index.js` 两个文件：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Electron Desktop</title>
  </head>

  <body>
    <p id="platform">操作系统：</p>
    <p id="release">版本号：</p>
    <script src="./index.js"></script>
  </body>
</html>
```

然后在创建窗口函数里面把用 loadURL 加载网页的代码换成 loadFile 加载本地文件：

```js
function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 })
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
}
```

这样就可以加载本地 HTML 文件了，接下来要实现在纯 web 沙箱环境中无法完成的需求：获取用户当前操作系统及其版本号并展示在页面上

因为传统的 Web 网页运行在浏览器沙箱环境里面，没有能力调用操作系统 API，但是 Electron 就不一样了，它支持在 Web 中执行 Node.js 代码。不过这个能力默认是不开启的，要想使用这个能力，必须在创建窗口的时候指定两个参数：

- `nodeIntegration: true`：开启 node.js 环境集成
- `contextIsolation: false`：关闭上下文隔离

```js
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
}
```

然后就可以在 `src/renderer/index.js` 中调用 node.js 的方法：

```js
const os = require('os')
const platform = os.platform()
const release = os.release()
document.getElementById('platform').append(platform)
document.getElementById('release').append(release)
```

### 使用 preload 脚本

直接在网页上调用 node.js 的 API 虽然很爽，但是风险极大，尤其是加载一个第三方的 Web 页面的时候，可能会被植入恶意脚本（例如调用 fs 模块删除文件等）。因此，Electron 官方不推荐开启 nodeIntegration，而是建议大家使用加载 preload 脚本的方式：

```js
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // 不开启 node 集成
      preload: path.join(__dirname, '../preload/index.js'), // 在 preload 脚本中访问 node 的 API
    },
  })
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
}
```

preload 脚本是特殊的 JS 脚本，由 Electron 注入到 index.html 当中，会早于 index.html 文件中引入的其他脚本，而且它有权限访问 node.js 的 API，无论用户是否开启了 nodeIntegration。我们把 `src/renderer/index.js` 的内容删除，改成仅打印一行文字：

```js
console.log('renderer index.js')
```

然后在 src 目录下新增 preload/index.js 文件，代码为：

```js
console.log('preload index.js')
console.log('platform', require('os').platform())
```

运行之后观察一下控制台输出，可以发现 `preload/index.js` 代码先执行，`renderer/index.js` 代码后执行，而且 `preload` 中可以直接调用 node.js 的 API:

![log 打印](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/image.png)

有一点需要特别注意的是：`preload.js` 脚本注入的时机非常之早，执行该脚本的时候，`index.html` 还没有开始解析，所以不能立即操作 `DOM`，需要在 `DOMContentLoaded` 事件之后再操作：

### 上下文隔离

上面讲到，preload.js 脚本中可以访问 node.js 的 全部 API 和 Electron 提供的渲染进程 API，这个脚本最终也是会注入到 index.html 页面里面的，在 webPreferences 的选项当中有个 contextIsolation 配置，表示是否开启上下文隔离（默认开启），它的具体含义为：

> preload.js 脚本和 index.html 是否共享相同的 document 和 window 对象

这个说起来比较抽象，一个最简单的案例就是：

```javascript
const win = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    contextIsolation: true, // 默认就是 true
    preload: path.join(__dirname, '../preload/index.js'),
    sandbox: false,
  },
})
win.loadFile(path.join(__dirname, '../renderer/index.html'))
```

然后在 `preload/index.js` 中，为 window 属性增加一个变量：

```javascript
window.fromPreload = 'something fromPreload'
```

那么在 `renderer/index.html` 当中，是不可以通过脚本获取这个变量的：

```javascript
<script>
  console.log('window.fromPreload = ', window.fromPreload) // undefined
</script>
```

打印出来的结果是 `undefined`

![](https://cdn.nlark.com/yuque/0/2023/png/756774/1675611293301-b787e8a5-6f9e-47df-a565-45cb950e0b3b.png)

如果把 webPreferences 中的 `contextIsolation` 改成 `false`，那么在 `index.html` 中就可以拿到 `preload.js` 中挂在 window 上的对象：

![](https://cdn.nlark.com/yuque/0/2023/png/756774/1675611543941-bbee5379-bc03-4a14-8bb4-1e0444d07570.png)

在控制台里面，可以点开 top 折叠菜单查看是否存在 Electron Isolated Context 来判断上下文隔离的开启状态：

![](https://cdn.nlark.com/yuque/0/2023/png/756774/1675611775498-df961850-caf8-485a-a1fc-ee50d8edbb7a.png)

默认情况下，上下文隔离是默认开启的，防止污染全局对象，不单单是 Windows 对象，JavaScript 中的所有全局可访问对象都是共享的，例如 Date 对象，假如在 preload.js 中设置了下面的代码：

```javascript
Date.now = () => 1
```

如果没开启上下文隔离，如果在 index.html 中用到了，那么将永远输出 1：

```javascript
<script>console.log('Date.now = ', Date.now()) // 永远输出 1</script>
```

这很有可能对线上业务造成严重的影响，出于安全考虑，Electron 默认开启上下文隔离，如果想在 preload.js 和 index.html 共享变量，可以通过 contextBridge 的方式：

```javascript
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  doSomething: () => {
    console.log('doSomething')
  },
})
```

那么可以在 index.html 可以直接使用 myAPI 全局变量，如果暴露变量名称和已有的全局变量发生冲突，例如：

```javascript
contextBridge.exposeInMainWorld('Date', {
  now: () => 1,
})
```

则程序启动后会报错，挂载失败：

![挂载失败](https://cdn.nlark.com/yuque/0/2023/png/756774/1675613328653-7a3ed6a1-7d7e-4dc8-ac53-22d4012ca26e.png)

如果挂载成功了，这个对象是只读且不可配置的，在 Electron 的源码中可以找到 exposeInMainWorld 的具体实现，在文件 `shell/renderer/api/electron_api_context_bridge.cc `当中：

![挂载成功](https://cdn.nlark.com/yuque/0/2023/png/756774/1675994939890-b7214a4c-6243-475e-8379-7b32cc5cb8fc.png)

#### 总结

- Electron 允许在 Web 页面中直接调用 Node.js 的 API
- Electron 允许开发者指定本地的 preload 脚本，并且在页面开始加载之前就注入进去
- Electron 为了避免 preload 脚本污染页面全局变量，默认开启上下文隔离策略

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

### Mac 端协议唤起

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

### Windows 端协议唤起

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

### 实战

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

## Electron 进程详解

Electron 开发的应用，一般会包含以下 5 个进程：

| **类型** | **作用**                                                                                            |
| -------- | --------------------------------------------------------------------------------------------------- |
| 主进程   | 负责界面显示、用户交互、子进程管理，控制应用程序的地址栏、书签，前进/后退按钮等，同时提供存储等功能 |
| 渲染进程 | 负责网页排版和交互（排版引擎 Blink 和 JavaScript 引擎 V8 都是运行在该进程中）                       |
| GPU 进程 | 负责 GPU 渲染                                                                                       |
| 网络进程 | 负责页面的网络资源加载                                                                              |
| 插件进程 | 负责插件的运行                                                                                      |

它们之间彼此相互协作，构成了完整的桌面应用：

![进程协作](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202501052016344.png)

很多人可能以为：**每创建一个新窗口就是一个独立进程**。其实，这是一个错误的观点，为了能够从进程的角度讲清楚 Electron 中窗口的本质，这里从大家都熟悉 Chrome 开始分析。

### Chrome 中的进程

首先退出 Chrome 浏览器，然后重新打开，在没有任何网页的情况下，打开浏览器的任务管理器，会发现六个进程，如下图所示：

![](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202501052017047.png)

第一个进程，即进程 ID 为 1534 的 Google Chrome 进程，就是浏览器进程，负责创建和管理窗口，它是下面 5 个子进程的父进程。

如果你是 Mac 电脑，打开活动监视器，在显示菜单中选择「**所有进程，分层显示**」，然后在右上角搜索框里面搜索 Google 关键字，可以过滤进程，并看清进程的父子关系。你如果把活动监视器中的 pid 跟上面任务管理器中的进程的关联一下，就会发现任务管理器中的 5 个子进程在活动监视器中都叫 Google Chrome Helper 进程：

![](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202501052017632.png)

为了测试，我新增了三个标签页，分别打开了百度、小米和掘金三个网站，可以看到，任务管理器中多出了三项，活动监视器中也多出三个子进程，也就是说：**<u>浏览器在标签页中加载的每个网站都是一个独立的进程</u>**，对应着活动监视器中名称为 Google Chrome Helper（Renderer）进程：

![](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202501052018626.png)

为了进一步测试，我没有在原窗口打开标签页，而是新开了两个独立窗口，各打开一个标签页，分别加载了知乎和 MDN 两个网站，此时任务管理器和活动监视器中又多出来两个渲染进程，如下图所示：

![](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202501052019915.png)

由此我们可以得出这样的结论：**<u>浏览器多个窗口共用同一个进程，而每个标签页加载网站都会创建单独的渲染进程</u>**。你可能会问，窗口共用的进程是哪个呢？其实就是 ID 为 1534 的那个浏览器进程，无论开多少窗口，都是那个进程在管理。

## Electron 中的进程

在 Electron 中也是如此，我们可以用下面的代码来验证：

```javascript
const { app, BrowserWindow } = require('electron')

app.whenReady().then(() => {
  createWindow(0)
  createWindow(0)
  createWindow(0)
  createWindow(0)
})

function createWindow(flag) {
  const win = new BrowserWindow({ width: 800, height: 600 })
  if (flag) win.loadURL('https://www.baidu.com')
}
```

无论创建了多少 BrowserWindow，活动监视器中始终都只有 3 个进程。

![](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202501052019498.png)

而如果把代码改成：

```javascript
const { app, BrowserWindow } = require('electron')

app.whenReady().then(() => {
  createWindow(1)
  createWindow(1)
  createWindow(1)
  createWindow(1)
})

function createWindow(flag) {
  const win = new BrowserWindow({ width: 800, height: 600 })
  if (flag) win.loadURL('https://www.baidu.com')
}
```

再看活动监视器，就会发现多出了 4 个 Electron Helper (Renderer) 的渲染进程：

![](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202501052019216.png)

这 4 个渲染进程其实是执行 `win.loadURL`函数时创建的。如果再修改代码，不创建任何窗口：

```javascript
const { app, BrowserWindow } = require('electron')

app.whenReady().then(() => {
  // 这里什么不都做，连窗口都不创建
})
```

在活动监视器中依然会看到三个进程：

![](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202501052020461.png)

到这里，应该可以解释清楚了：**并非每开一个窗口就创建一个进程，而是所有窗口都由 Electron 主进程管理**。因此：

> 在 Electron 应用中，不创建任何窗口和创建 100 个窗口，对应用的进程数量没有任何影响。

### 其他进程

主进程和渲染进程是 Electron 中的核心组件，除此之外，还有：

- Utility 进程主要负责处理一些系统级别的任务和 API 调用，例如系统菜单的创建和管理、对话框的显示和处理等。与主进程和渲染进程不同，utility 进程是一个隐藏的进程，用户无法直接访问它。
- GPU 进程是一个独立的子进程，用于处理与渲染相关的任务，例如绘制页面、动画、视频等。GPU 进程使用了 Chromium 中的 GPU 加速技术，通过硬件加速来提高渲染性能和流畅度。与主进程和渲染进程不同，GPU 进程是由 Chromium 自动创建和管理的，开发者无法显式地控制它的创建和销毁。在 Electron 应用程序中，GPU 进程的启动是由 Chromium 内核自动完成的。
- Network 进程负责处理所有网络请求和响应。该进程由浏览器进程启动，运行在单独的沙箱中，具有较高的安全性，主要负责以下任务：
  - 处理所有网络请求和响应，包括 HTTP、HTTPS、WebSocket、DNS 等。
  - 实现浏览器的网络安全策略，例如跨域访问限制、内容安全策略等。
  - 缓存和管理网络请求和响应，包括 HTTP 缓存和 DNS 缓存等。
  - 实现 HTTP/2 和 QUIC 等新型网络协议。
  - 处理浏览器的网络代理设置，例如 PAC 和代理服务器等。
- Plugin 进程负责运行浏览器插件，例如 Flash、Java、PDF 等。

## 参考资料

- [Electron](https://www.yuque.com/elixiao/pyltwx/nbd65nx2o70ye3r0)
