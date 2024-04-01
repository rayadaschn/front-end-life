const e=JSON.parse('{"key":"v-29de86a2","path":"/JavaScript/JS/JS04.html","title":"前端代码埋点实现","lang":"zh-CN","frontmatter":{"title":"前端代码埋点实现","icon":"javascript","date":"2023-02-25T00:00:00.000Z","category":["javascript"],"tag":["javascript"]},"headers":[{"level":2,"title":"1. 环境及需求介绍","slug":"_1-环境及需求介绍","link":"#_1-环境及需求介绍","children":[]},{"level":2,"title":"2. 封装逻辑","slug":"_2-封装逻辑","link":"#_2-封装逻辑","children":[]},{"level":2,"title":"3. 封装基础库","slug":"_3-封装基础库","link":"#_3-封装基础库","children":[]}],"git":{"createdTime":1711950553000,"updatedTime":1711950553000,"contributors":[{"name":"rayadaschn","email":"115447518+rayadaschn@users.noreply.github.com","commits":1}]},"readingTime":{"minutes":4.29,"words":1287},"filePathRelative":"JavaScript/JS/JS04.md","localizedDate":"2023年2月25日","excerpt":"<h1> 前端代码埋点实现</h1>\\n<h2> 1. 环境及需求介绍</h2>\\n<ul>\\n<li>环境： <code>Vue2.7</code></li>\\n<li>需求：全页面访问、事件点击等全监听</li>\\n</ul>\\n<h2> 2. 封装逻辑</h2>\\n<ul>\\n<li>由于需要监听页面访问事件，为了统一封装，我们将用到 <code>Mixins</code> 混入监听页面的生命周期；</li>\\n<li>所有的事件发送参数分为公参和特定事件参数，因此我们需要将公参数据进行提取，统一修改。</li>\\n<li>埋点的核心逻辑，用到的是 GIF 请求发送</li>\\n</ul>\\n<p>使用 GIF 请求发送的原因其实很好理解：</p>"}');export{e as data};
