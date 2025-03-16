const e=JSON.parse('{"key":"v-e90f71de","path":"/JavaScript/JS/JS35.html","title":"关于 Iterator 迭代器","lang":"zh-CN","frontmatter":{"title":"关于 Iterator 迭代器","icon":"javascript","date":"2025-03-17T00:00:00.000Z","category":["javascript"],"tag":["javascript"],"sticky":false},"headers":[{"level":2,"title":"常见可迭代对象","slug":"常见可迭代对象","link":"#常见可迭代对象","children":[]},{"level":2,"title":"js 简单实现","slug":"js-简单实现","link":"#js-简单实现","children":[]},{"level":2,"title":"对象实现迭代","slug":"对象实现迭代","link":"#对象实现迭代","children":[]},{"level":2,"title":"关于 Reflect.ownKeys 的额外总结","slug":"关于-reflect-ownkeys-的额外总结","link":"#关于-reflect-ownkeys-的额外总结","children":[]},{"level":2,"title":"迭代运行的时间","slug":"迭代运行的时间","link":"#迭代运行的时间","children":[]}],"git":{"createdTime":1742142898000,"updatedTime":1742142898000,"contributors":[{"name":"rayadaschn","email":"115447518+rayadaschn@users.noreply.github.com","commits":1}]},"readingTime":{"minutes":3.59,"words":1078},"filePathRelative":"JavaScript/JS/JS35.md","localizedDate":"2025年3月17日","excerpt":"<p>迭代器的协议规范是：一个对象必须实现一个特定的接口，该接口包含一个名为 <code>next</code> 的方法，该方法返回一个对象，该对象包含两个属性：<code>value</code> 和 <code>done</code>。</p>\\n<p><code>value</code> 属性表示迭代器返回的当前值，<code>done</code> 属性是一个布尔值，表示迭代器是否已经迭代完所有元素。</p>\\n<div class=\\"language-javascript line-numbers-mode\\" data-ext=\\"js\\"><pre class=\\"language-javascript\\"><code><span class=\\"token punctuation\\">{</span>\\n  <span class=\\"token literal-property property\\">value</span><span class=\\"token operator\\">:</span> any<span class=\\"token punctuation\\">,</span>\\n  <span class=\\"token literal-property property\\">done</span><span class=\\"token operator\\">:</span> boolean\\n<span class=\\"token punctuation\\">}</span>\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>"}');export{e as data};
