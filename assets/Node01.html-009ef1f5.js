const e=JSON.parse(`{"key":"v-ffc86826","path":"/JavaScript/Node01.html","title":"node 基础","lang":"zh-CN","frontmatter":{"title":"node 基础","icon":"nodeJS","category":["javascript"],"tag":["node"],"description":"Node 基础 首先要理解服务器开发是什么？简单的说就是通过一门语音，操作处理各种文件——增删改查。 Node 是什么? Node.js 是一个基于 V8 JavaScript 引擎的 JavaScrip t 运行时环境。简单理解，就是 Node 是基于 V8 引擎的能够在本地运行 JavaScript 代码的环境。当然由于 Chrome 浏览器内部还需要解析、渲染 HTML 和 CSS 等相关渲染引擎，另外还需要提供支持浏览器操作的 API、浏览器自己的事件循环等，这部分做了取舍。但是同时由于要处理本地文件，所以 Node 自身也添加了一些额外的 API 如文件系统读/写、网络 IO、加密、压缩解压文件等。","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/front-end-life/JavaScript/Node01.html"}],["meta",{"property":"og:site_name","content":"Huy's Blog"}],["meta",{"property":"og:title","content":"node 基础"}],["meta",{"property":"og:description","content":"Node 基础 首先要理解服务器开发是什么？简单的说就是通过一门语音，操作处理各种文件——增删改查。 Node 是什么? Node.js 是一个基于 V8 JavaScript 引擎的 JavaScrip t 运行时环境。简单理解，就是 Node 是基于 V8 引擎的能够在本地运行 JavaScript 代码的环境。当然由于 Chrome 浏览器内部还需要解析、渲染 HTML 和 CSS 等相关渲染引擎，另外还需要提供支持浏览器操作的 API、浏览器自己的事件循环等，这部分做了取舍。但是同时由于要处理本地文件，所以 Node 自身也添加了一些额外的 API 如文件系统读/写、网络 IO、加密、压缩解压文件等。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-04-11T02:26:35.000Z"}],["meta",{"property":"article:tag","content":"node"}],["meta",{"property":"article:modified_time","content":"2023-04-11T02:26:35.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"node 基础\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-04-11T02:26:35.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"Node 是什么?","slug":"node-是什么","link":"#node-是什么","children":[{"level":3,"title":"体系架构","slug":"体系架构","link":"#体系架构","children":[]}]},{"level":2,"title":"文件系统 File System","slug":"文件系统-file-system","link":"#文件系统-file-system","children":[{"level":3,"title":"CommonJS 导入模块","slug":"commonjs-导入模块","link":"#commonjs-导入模块","children":[]},{"level":3,"title":"读取文件的三种方式","slug":"读取文件的三种方式","link":"#读取文件的三种方式","children":[]},{"level":3,"title":"文件描述符的使用","slug":"文件描述符的使用","link":"#文件描述符的使用","children":[]},{"level":3,"title":"文件写入","slug":"文件写入","link":"#文件写入","children":[]},{"level":3,"title":"文件夹操作","slug":"文件夹操作","link":"#文件夹操作","children":[]}]},{"level":2,"title":"Events 模块","slug":"events-模块","link":"#events-模块","children":[]},{"level":2,"title":"Buffer 类","slug":"buffer-类","link":"#buffer-类","children":[{"level":3,"title":"创建 Buffer","slug":"创建-buffer","link":"#创建-buffer","children":[]},{"level":3,"title":"Buffer 的创建过程","slug":"buffer-的创建过程","link":"#buffer-的创建过程","children":[]}]},{"level":2,"title":"参考文章","slug":"参考文章","link":"#参考文章","children":[]}],"git":{"createdTime":1681104428000,"updatedTime":1681179995000,"contributors":[{"name":"rayadaschn","email":"115447518+rayadaschn@users.noreply.github.com","commits":2}]},"readingTime":{"minutes":18.02,"words":5407},"filePathRelative":"JavaScript/Node01.md","localizedDate":"2023年4月10日","excerpt":"<h1> Node 基础</h1>\\n<p>首先要理解服务器开发是什么？简单的说就是通过一门语音，操作处理各种文件——增删改查。</p>\\n<h2> Node 是什么?</h2>\\n<p><strong>Node.js</strong> 是一个基于 V8 JavaScript 引擎的 JavaScrip t 运行时环境。简单理解，就是 Node 是基于 V8 引擎的能够在本地运行 JavaScript 代码的环境。当然由于 Chrome 浏览器内部还需要解析、渲染 HTML 和 CSS 等相关渲染引擎，另外还需要提供支持浏览器操作的 API、浏览器自己的事件循环等，这部分做了取舍。但是同时由于要处理本地文件，所以 Node 自身也添加了一些额外的 API 如文件系统读/写、网络 IO、加密、压缩解压文件等。</p>","autoDesc":true}`);export{e as data};
