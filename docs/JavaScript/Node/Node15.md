---
title: Node 中一些方法
icon: nodeJS
date: 2025-06-22
category:
  - javascript
tag:
  - node
---

本文用于记录常用 Node 的一些方法，方便记忆。

## `process` 模块

`process` 在`Node.js`中每个应用程序都是一个进程类的**实例对象**。

使用`process`对象代表该应用程序,这是一个全局对象，可以通过它来获取`Node.js`应用程序以及运行该程序的用户、环境等各种信息的属性、方法和事件。

### 进程对象属性

- `execPath` 可执行文件的绝对路径,如 `/usr/local/bin/node`
- `version` 版本号
- `versions` 依赖库的版本号
- `platform` 运行平台。 如 `darwin`、`freebsd`、`linux`、`sunos`、`win32`
- `stdin` 标准输入流可读流，默认暂停状态
- `stdout` 标准输出可写流，同步操作
- `stderr` 错误输出可写流，同步操作
- `argv` 属性值为数组。
  如 `node your-script.js arg1 arg2 arg3`, 则 :

  ```js
  console.log(process.argv)
  // 输出结果为:
  [
    '/usr/local/bin/node', // process.argv[0]：Node 可执行文件路径
    '/path/to/your-script.js', // process.argv[1]：你运行的脚本路径
    'arg1', // 从 argv[2] 开始是你传的参数
    'arg2',
    'arg3',
  ]
  ```

- `env` 操作系统环境信息
- `pid` 应用程序进程 ID
- `title` 窗口标题
- `arch` 处理器架构 `arm`、`ia32`、`x64`

### fs 模块

`fs` 模块是 Node.js 中用于文件系统操作的模块。它提供了一组方法，用于读取、写入、删除、重命名等操作文件和目录。

基本可以分为三类:回调式、Promises 异步、Sync 同步。

1. 回调式 API

   特点：回调函数为最后一个参数;第一个参数永远是 error 对象，如果没有错误则为 null。

   ```js
   fs.readFile(path, (err, data) => {})
   fs.writeFile(path, content, (err) => {})
   fs.stat(path, (err, stats) => {})
   ```

2. Promises 异步 API(现代写法)

   特点：只是挂在 fs.promises 下。返回一个 Promise 对象，Promise 对象的状态由异步操作的结果决定。

   ```js
   fs.promises.readFile(path).then((data) => {})
   fs.promises.writeFile(path, content).then(() => {})
   fs.promises.stat(path).then((stats) => {})
   ```

3. Sync 同步 API(阻塞式,少用)

   格式为: `xxxSync`。特点：会阻塞当前线程，直到操作完成。没有回调函数，直接返回结果。如果发生错误则抛出异常。

   ```js
   fs.readFileSync(path)
   fs.writeFileSync(path)
   fs.statSync(path)
   fs.mkdirSync(path)
   fs.rmSync(path)
   ```

### 进程方法

- `process.cwd()` 方法: 返回当前目录，不使用任何参数
- `process.exit()`: 退出当前 node 应用程序。
  - 可以传递一个参数，参数为 0 或 1。
  - 0 表示正常退出，1 表示非正常退出。
  - 如果不传递参数，默认退出状态码为 0。

## 子进程 `child_process` 模块

在`Node.js`中，只有一个线程执行所有操作，如果某个操作需要大量消耗 CPU 资源的情况下，后续操作都需要等待。

在`Node.js`中，提供了一个`child_process`模块,通过它可以开启多个子进程，在多个子进程之间可以共享内存空间，可以通过子进程的互相通信来实现信息的交换。

### `spawn` 衍生方法

`spawn` 的意思是启动一个新的子进程(异步方法)，并与它保持流式通信（stdin、stdout、stderr）。

语法: `child_process.spawn(command, [args], [options])`

- `command` 必须指定的参数，指定需要执行的命令
- `args` 数组，存放了所有运行该命令需要的参数
- `options` 参数为一个对象，用于指定开启子进程时使用的选项
  - `cwd` 子进程的工作目录
  - `env` 环境变量
  - `detached` 如果为`true`,该子进程将成为一个进程组中的领头进程，当父进程不存在时也可以独立存在。
  - `stdio` 三个元素的数组，设置标准输入/输出
    - `pipe` 在父进程和子进程之间创建一个管道，父进程可以通过子进程的`stdio[0]`访问子进程的标准输入，通过`stdio[1]`访问标准输出,`stdio[2]`访问错误输出
    - `ipc` 在父进程和子进程之间创建一个专用与传递消息的 IPC 通道。可以调用子进程的 send 方法向子进程发消息，子进程会触发 message 事件
    - `ignore` 指定不为子进程设置文件描述符。这样子进程的标准输入、标准输出和错误输出被忽略
    - `stream` 子进程和父进程共享一个终端设备、文件、端口或管道
    - 正整数值 和共享一个 steam 是一样的
    - `null`或`undefined` 在子进程中创建与父进程相连的管道

```js
// 从当前进程中生出（spawn）一个新的子进程
const { spawn } = require('child_process')

const ls = spawn('ls', ['-lh', '/usr']) // 相当于运行命令：ls -lh /usr

// 当子进程的标准输出流有数据写入时，会触发子进程对象的stdout事件
ls.stdout.on('data', (data) => {
  console.log(`输出: ${data}`)
})

// 当子进程的标准【错误输出】流有数据写入时，会触发子进程对象的stderr事件
ls.stderr.on('data', (data) => {
  console.error(`错误: ${data}`)
})

// 当子进程退出时，会触发子进程对象的exit事件。这里的退出【不管资源是否清理完】。
// 因为多个进程可能会共享同一个输入/输出流，所以当子进程退出时，子进程的输入/输出可能并未终止。
ls.on('exit', (code) => {
  console.log(`子进程退出，退出码：${code}`)
})

// 当子进程所有输入输出都【终止】时，会触发子进程对象的close事件。这里是【真正的退出】
// 该事件的参数code为子进程的退出码，0表示正常退出，1表示非正常退出。
ls.on('close', (code) => {
  console.log(`子进程退出，退出码：${code}`)
})
```

- `spawn`方法返回一个隐式创建的代表子进程的`ChildProcess`对象;
- 子进程对象同样拥有`stdin`属性值为一个可用于读入子进程的标准输入流对象
- 子进程对象同样拥有`stdiout`属性值和`stderr`属性值可分别用于写入子进程的标准输出流与标准错误输出流

### `exec` 同步开启子进程

`exec`方法可以开启一个用于运行某个命令的子进程并缓存子进程的输出结果

`spawn`是一个异步方法，`exec`是一个同步方法，衍生一个 shell 并在 shell 上运行命令

语法: `child_process.exec(command,[options],[callback]);`

- `command` 需要执行的命令
- `options` 选项对象
- `cwd` 子进程的当前工作目录
- `env` 指定子进程的环境变量
- `encoding` 指定输出的编码
- `timeout` 子进程的超时时间
- `maxbuffer` 指定缓存标准输出和错误输出的缓存区最大长度
- `killSignal` 指定关闭子进程的信号，默认值为 "SIGTERM"
- `callback` 指定子进程终止时调用的回调函数: `(error, stdout, stderr) => { ... }`
  - `error` 子进程的错误信息
  - `stdout` 子进程的标准输出
  - `stderr` 子进程的标准错误输出

### `execFile` 开启子进程

可以使用 `execFile` 开启一个专门用于运行某个可执行文件的子进程。类似 `child_process.exec()`，但直接衍生命令，且无需先衍生一个 `shell`。

语法: `child_process.execFile(file,[args],[optioins],[callback]);`

- `file` 可执行文件的路径
- `args` 数组，存放了所有运行该命令需要的参数
- `options` 参数为一个对象，用于指定开启子进程时使用的选项
  - `cwd` 子进程的工作目录
  - `env` 环境变量
  - `detached` 如果为`true`,该子进程将成为一个进程组中的领头进程，当父进程不存在时也可以独立存在。
  - `stdio` 三个元素的数组，设置标准输入/输出
