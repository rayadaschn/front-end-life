const n=JSON.parse('{"key":"v-5bdd18e8","path":"/Framework/React/React08.html","title":"React之手写 Hooks","lang":"zh-CN","frontmatter":{"title":"React之手写 Hooks","icon":"react","date":"2024-02-20T00:00:00.000Z","category":["框架"],"tag":["React"],"sticky":false},"headers":[{"level":2,"title":"手写 useState","slug":"手写-usestate","link":"#手写-usestate","children":[{"level":3,"title":"具体实现","slug":"具体实现","link":"#具体实现","children":[]}]},{"level":2,"title":"手写 useReducer","slug":"手写-usereducer","link":"#手写-usereducer","children":[]},{"level":2,"title":"手写 memo 函数","slug":"手写-memo-函数","link":"#手写-memo-函数","children":[]}],"git":{"createdTime":1708517971000,"updatedTime":1708612276000,"contributors":[{"name":"rayadaschn","email":"115447518+rayadaschn@users.noreply.github.com","commits":2}]},"readingTime":{"minutes":4.32,"words":1295},"filePathRelative":"Framework/React/React08.md","localizedDate":"2024年2月20日","excerpt":"<p>Hooks 的好处很多，为了加强对 Hooks 的理解，手动实现一遍 React 的一些 Hooks 方法，便是再好不过的了。</p>\\n<p>本文中，我们统一规定 初始 <code>App.jsx</code> 如下：</p>\\n<div class=\\"language-jsx line-numbers-mode\\" data-ext=\\"jsx\\"><pre class=\\"language-jsx\\"><code><span class=\\"token keyword\\">import</span> <span class=\\"token punctuation\\">{</span> root<span class=\\"token punctuation\\">,</span> useState<span class=\\"token punctuation\\">,</span> <span class=\\"token operator\\">...</span>otherHooks <span class=\\"token punctuation\\">}</span> <span class=\\"token keyword\\">from</span> <span class=\\"token string\\">\\"./React\\"</span><span class=\\"token punctuation\\">;</span>\\n\\n<span class=\\"token keyword\\">function</span> <span class=\\"token function\\">App</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n  <span class=\\"token comment\\">// useHook 的使用</span>\\n  <span class=\\"token keyword\\">return</span> <span class=\\"token punctuation\\">(</span> <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>div</span><span class=\\"token punctuation\\">&gt;</span></span><span class=\\"token plain-text\\">....具体代码</span><span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>div</span><span class=\\"token punctuation\\">&gt;</span></span> <span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token punctuation\\">}</span>\\n\\nroot<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">render</span><span class=\\"token punctuation\\">(</span><span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span><span class=\\"token class-name\\">App</span></span> <span class=\\"token punctuation\\">/&gt;</span></span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n\\n<span class=\\"token keyword\\">export</span> <span class=\\"token keyword\\">default</span> App<span class=\\"token punctuation\\">;</span>\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>"}');export{n as data};
