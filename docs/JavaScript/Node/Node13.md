---
title: 大文件上传
icon: nodeJS
date: 2025-06-07
category:
  - javascript
tag:
  - node
---

此前简单梳理过一次大文件的分片上传，这里又重新实现一遍。功能点加上秒传、断点续传、web worker 等。

前端简单用 vite + react19 + antd + axios 实现。后端用 express 实现。[代码仓库](https://github.com/rayadaschn/fileUploader)

## 功能点总结

1. 前端分片上传与断点续传

   - 文件切片：用 `File.prototype.slice` 将大文件分割为多个小块（chunk），每块独立上传。
   - 断点续传：上传前先向后端查询已上传分片，前端只上传未完成的分片，实现断点续传和秒传。
   - 上传进度管理：每个分片上传时通过 onUploadProgress 事件实时更新进度条，整体进度通过所有分片进度的平均值计算。
   - 取消与暂停：利用 `axios` 的 `CancelToken` 实现上传任务的取消和暂停，支持恢复上传。

2. Web Worker 计算文件 hash
   `- Web Worker 基础：用 Worker 在浏览器主线程外异步计算大文件 hash，避免 UI 卡顿。
   - 主线程与 Worker 通信：通过 `postMessage` 和 `onmessage` 实现主线程与 Worker 的数据交互。
   - SubtleCrypto API：在 Worker 内用 `crypto.subtle.digest` 计算文件内容的 SHA-256 hash，生成唯一文件名。
3. React 组件与自定义 Hook

   - 自定义 Hook：用 `useDrag` 实现拖拽上传、点击上传、文件校验、预览等功能，提升组件复用性。
   - `useRef`/`useState`/`useEffect`：管理 DOM 引用、状态和副作用，确保事件监听和资源释放的正确性。

4. Node.js 服务端分片处理
   - Express 路由设计：实现 `/api/upload`（分片上传）、`/api/check`（查询已上传分片）、`/api/merge`（合并分片）等接口。
   - 流式处理：用 `fs.createReadStream` 和 `fs.createWriteStream` 实现分片的高效写入和合并，避免大文件占用过多内存。
   - 慢速 Transform 流：自定义 `SlowTransform`，通过 `setTimeout` 控制写入速度，方便前端调试进度条和断点续传。
   - 分片合并与 hash 校验：合并所有分片后，流式计算合并文件的 hash，与前端生成的 hash 比较，确保文件完整性。
5. 性能优化
   - 并行上传与合并：前端并行上传多个分片，后端可并行或串行合并，提升效率。
   - 内存优化：所有大文件操作均采用流式处理，避免内存溢出。
   - 兼容性与用户体验：支持拖拽、点击、进度反馈、错误提示、断点续传等，提升易用性。

## 基础知识点总结

1. Blob、ArrayBuffer 和 Uint8Array 的区别

   | 名称          | 类比               | 作用                                                           |
   | ------------- | ------------------ | -------------------------------------------------------------- |
   | `ArrayBuffer` | 一块内存（生数据） | 原始二进制数据，不能直接访问                                   |
   | `Uint8Array`  | 眼镜/视图          | 用来访问 `ArrayBuffer` 中的内容                                |
   | `Blob`        | 文件/盒子          | 表示一段数据，可以是字符串、二进制、文件等，不提供直接访问方式 |

   ```js
   // 1. 创建一个 Uint8Array（8 位二进制数组）
   const uint8 = new Uint8Array([1, 2, 3])

   // 2. 把它打包成 Blob（像是准备上传的文件）
   const blob = new Blob([uint8], { type: 'application/octet-stream' })

   // 3. 异步把 Blob 转回 ArrayBuffer（像是打开文件）
   blob.arrayBuffer().then((buf) => {
     // 4. 用视图读取 buffer 内容
     const view = new Uint8Array(buf)
     console.log(view) // Uint8Array(3) [1, 2, 3]
   })
   ```

2. 关于 web worker

   简单入门可以看阮一峰老师总结: [web worker](https://javascript.ruanyifeng.com/htmlapi/webworker.html)

   这里需要说明的是，使用 web worker 并不能提高性能，因为它仍然是单线程的。它的主要作用是将耗时的计算任务从主线程中分离出来，避免阻塞 UI 渲染。
