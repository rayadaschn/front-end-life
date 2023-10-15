---
title: vite proxy 代理
icon: build
date: 2023-09-23

category:
  - 框架
tag:
  - vite
sticky: false
---

给 Vite Proxy 代理添加响应头。

vite 的 proxy 代理同 webpack 类型，在 `server.proxy` 下进行:

类型为： `Record<string, string | ProxyOptions>`，意思是期望接收一个 { key: options } 对象。任何请求路径以 key 值开头的请求将被代理到对应的目标。如果 key 值以 `^` 开头，将被识别为 RegExp。`configure` 选项可用于访问 proxy 实例。

:::tip

如果使用了非相对的 基础路径 base，则必须在每个 key 值前加上该 base。

:::

使用示例:

```ts
export default defineConfig({
  server: {
    proxy: {
      // 字符串简写写法：http://localhost:5173/foo -> http://localhost:4567/foo
      '/foo': 'http://localhost:4567',
      // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // 正则表达式写法：http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, ''),
      },
      // 使用 proxy 实例
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy 是 'http-proxy' 的实例
        },
      },
      // 代理 websockets 或 socket.io 写法：ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
      '/socket.io': {
        target: 'ws://localhost:5174',
        ws: true,
      },
    },
  },
})
```

## 添加代理访问的真实地址

由于走的是代理，因此在浏览器上并不能显示的获取实际本地服务的请求，我们这里做点小改动。

通过 ts 的类型定义可以知道 ProxyOptions 有以下属性:

![ProxyOptions](https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202309231058072.png)

1. `rewrite?: (path: string) => string;`：这是一个可选属性，表示重写路径的函数。它接受一个字符串参数 path，并返回一个新的字符串作为重写后的路径。

2. `configure?: (proxy: HttpProxy.Server, options: ProxyOptions) => void;`：这也是一个可选属性，表示配置代理服务器的函数。它接受两个参数，一个是 proxy，表示代理服务器对象，另一个是 options，表示 ProxyOptions 对象本身。这个函数可以用来监听代理服务器的事件或进行其他配置操作。

3. `bypass?: (req: http.IncomingMessage, res: http.ServerResponse, options: ProxyOptions) => void | null | undefined | false | string;`：同样是可选属性，表示类似于 webpack-dev-server 的绕过函数，也就是代理的核心通过它来实现代理转发。它接受三个参数，分别是 HTTP 请求对象 req、HTTP 响应对象 res 和 ProxyOptions 对象本身。

   在 bypass 函数中，可以**根据具体的逻辑来判断是否需要绕过代理服务器**。如果需要绕过，可以执行一些自定义的操作，比如直接发送请求给目标服务器，或返回自定义的响应。如果不需要绕过，可以不执行任何操作，让代理服务器按照正常的流程进行转发和响应。

   需要注意的是，bypass 函数可以返回以下几种值：

   - `void`：表示不绕过代理服务器，继续按照正常流程处理请求。
   - `null、undefined、false`：表示绕过代理服务器，不执行转发操作。
   - **字符串**：表示绕过代理服务器，并将请求转发到指定的路径或 URL。

所以利用 bypass 函数，我们可以在返回响应头上添加实际请求的路径。

在 vite.config.ts 中的 server 属性里进行配置：

```ts
/**
 * 本地开发服务，也可以配置接口代理
 *
 * @see https://cn.vitejs.dev/config/#server-proxy
 */
server: {
  port: 3000,
  proxy: {
    '/devapi': {
      target: 'http://jsonplaceholder.typicode.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/devapi/, ''),
      bypass(req, res, options) {
        if (options.rewrite && req.url) {
          const proxyUrl = new URL(
            options.rewrite(req.url),
            options.target as string,
          ).href
          res.setHeader('x-req-proxyUrl', proxyUrl)
          console.info(proxyUrl) // 服务器打印访问代理地址
        }
      },
    },
  },
},
```

`'/devapi'`：这是代理的路径匹配模式，当客户端请求的路径以/devapi 开头时，将触发代理服务器的转发操作。

`target: 'http://jsonplaceholder.typicode.com'`：目标服务器的 URL，代理服务器会将匹配到的请求转发到该 URL 指定的服务器上。

`changeOrigin: true`：设置为 true 时，代理服务器会在转发请求时修改 Host 请求头，确保目标服务器能够正确识别请求的来源。

`rewrite: (path) => path.replace(/^\/devapi/, '')`：重写函数，用于修改请求路径。在这个例子中，将请求路径中的`/devapi`部分替换为空字符串，以便在转发请求时去掉该部分路径。

`bypass(req, res, options)`：绕过函数，用于自定义操作。在这个例子中，如果定义了 rewrite 函数并且请求的 URL 存在，就会执行以下操作：

使用 `options.rewrite(req.url)` （即上文中自定义的重写 rewrite 函数）将请求 URL 进行重写，得到一个新的 URL 地址。

将重写后的 URL 设置为响应头的`x-req-proxyUrl`字段，以便在响应中返回给客户端。

在服务器的控制台打印访问代理地址（重写后的 URL）的信息。

## 参考

- [开发服务器选项](https://cn.vitejs.dev/config/server-options.html#server-proxy)
