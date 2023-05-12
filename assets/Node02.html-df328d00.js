const e=JSON.parse('{"key":"v-fc5eb6e8","path":"/JavaScript/Node02.html","title":"Node 服务器开发基础","lang":"zh-CN","frontmatter":{"title":"Node 服务器开发基础","icon":"nodeJS","date":"2023-02-25T00:00:00.000Z","article":false,"category":["javascript"],"tag":["node"]},"headers":[{"level":2,"title":"文件读写的 Stream","slug":"文件读写的-stream","link":"#文件读写的-stream","children":[{"level":3,"title":"可读流（Readable Stream）","slug":"可读流-readable-stream","link":"#可读流-readable-stream","children":[]},{"level":3,"title":"可写流（Writable Stream）","slug":"可写流-writable-stream","link":"#可写流-writable-stream","children":[]},{"level":3,"title":"拷贝流（Copy Stream）","slug":"拷贝流-copy-stream","link":"#拷贝流-copy-stream","children":[]},{"level":3,"title":"双工流（Duplex Stream）","slug":"双工流-duplex-stream","link":"#双工流-duplex-stream","children":[]}]},{"level":2,"title":"Web 服务器","slug":"web-服务器","link":"#web-服务器","children":[{"level":3,"title":"HTTP 模块","slug":"http-模块","link":"#http-模块","children":[]},{"level":3,"title":"URL 的处理","slug":"url-的处理","link":"#url-的处理","children":[]},{"level":3,"title":"区别不同的 method","slug":"区别不同的-method","link":"#区别不同的-method","children":[]},{"level":3,"title":"解析 Body 参数","slug":"解析-body-参数","link":"#解析-body-参数","children":[]},{"level":3,"title":"Header 参数","slug":"header-参数","link":"#header-参数","children":[]},{"level":3,"title":"响应对象","slug":"响应对象","link":"#响应对象","children":[]},{"level":3,"title":"发送数据请求","slug":"发送数据请求","link":"#发送数据请求","children":[]},{"level":3,"title":"实现一个服务器接收用户上传图片的代码","slug":"实现一个服务器接收用户上传图片的代码","link":"#实现一个服务器接收用户上传图片的代码","children":[]}]},{"level":2,"title":"Web 开发小工具","slug":"web-开发小工具","link":"#web-开发小工具","children":[]}],"git":{"createdTime":1683516320000,"updatedTime":1683871684000,"contributors":[{"name":"rayadaschn","email":"115447518+rayadaschn@users.noreply.github.com","commits":2}]},"readingTime":{"minutes":20.88,"words":6264},"filePathRelative":"JavaScript/Node02.md","localizedDate":"2023年2月25日","excerpt":"<h1> Node 服务器开发基础</h1>\\n<p>首先要理解一个概念，在前面的文章中，谈到文件读取的几种方法。但是这些方法都是直接将文件读取放到内存中进行管理，但是如果我们需要读取一部超长的电影，这个时候服务器的内存可能并没有那么大，所以，导致我们不能够直接读取到完整的一部电影。我们可以片段的读取想要的电影片段（这并不会打断我们看电影的过程）。</p>\\n<p>那么 Node 是如何实现的呢？通过 Stream 流，是连续字节的一种表现形式和抽象概念，它可以读也可以写。</p>\\n<h2> 文件读写的 Stream</h2>\\n<p>实际上，Node 中很多对象是基于流实现的，并且所有的流都是 <code>EventEmitter</code> 的实例。在 Node.js 中，有四种基本流类型：</p>"}');export{e as data};
