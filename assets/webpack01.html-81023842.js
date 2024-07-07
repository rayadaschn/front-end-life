const e=JSON.parse('{"key":"v-1df0b4b7","path":"/Framework/Webpack/webpack01.html","title":"解决前端跨域问题","lang":"zh-CN","frontmatter":{"title":"解决前端跨域问题","icon":"build","date":"2023-03-27T00:00:00.000Z","category":["框架"],"tag":["webpack"],"sticky":false},"headers":[{"level":2,"title":"前言-同源策略","slug":"前言-同源策略","link":"#前言-同源策略","children":[]},{"level":2,"title":"跨域的解决方案总结","slug":"跨域的解决方案总结","link":"#跨域的解决方案总结","children":[{"level":3,"title":"常见方案","slug":"常见方案","link":"#常见方案","children":[]},{"level":3,"title":"CORS","slug":"cors","link":"#cors","children":[]},{"level":3,"title":"Node 服务器代理","slug":"node-服务器代理","link":"#node-服务器代理","children":[]},{"level":3,"title":"Nginx 反向代理","slug":"nginx-反向代理","link":"#nginx-反向代理","children":[]},{"level":3,"title":"JSONP 解决跨域","slug":"jsonp-解决跨域","link":"#jsonp-解决跨域","children":[]}]}],"git":{"createdTime":1703991106000,"updatedTime":1711950553000,"contributors":[{"name":"rayadaschn","email":"115447518+rayadaschn@users.noreply.github.com","commits":2}]},"readingTime":{"minutes":7.99,"words":2397},"filePathRelative":"Framework/Webpack/webpack01.md","localizedDate":"2023年3月27日","excerpt":"<h1> 解决前端跨域问题</h1>\\n<h2> 前言-同源策略</h2>\\n<p>同源策略（Same-Origin Policy，简称 SOP）是一种重要的安全策略，用于 Web 浏览器保护用户隐私和安全。它指定浏览器在加载文档或执行脚本时，只能访问与原始文档具有相同协议、主机名和端口号的资源。</p>\\n<p>简单来说，如果一个网页中使用了 JavaScript 脚本或其他方式加载了其他来源的资源（例如图片、脚本、样式表等），那么这些资源的加载和访问将受到同源策略的限制，只能访问与该网页同源的资源，不能访问其他来源的资源。这种限制可以有效防止恶意网站窃取用户的信息，保护用户隐私和安全。</p>\\n"}');export{e as data};