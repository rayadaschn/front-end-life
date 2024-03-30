const s=JSON.parse(`{"key":"v-6c964c40","path":"/JavaScript/JS18.html","title":"实现 Promise.allSettled","lang":"zh-CN","frontmatter":{"title":"实现 Promise.allSettled","icon":"javascript","date":"2024-03-05T00:00:00.000Z","category":["javascript"],"tag":["javascript"],"sticky":false},"headers":[],"git":{"createdTime":1709646366000,"updatedTime":1710033820000,"contributors":[{"name":"rayadaschn","email":"115447518+rayadaschn@users.noreply.github.com","commits":2}]},"readingTime":{"minutes":0.94,"words":281},"filePathRelative":"JavaScript/JS18.md","localizedDate":"2024年3月5日","excerpt":"<p>在 MDN 上, 对 <code>Promise.allSettled</code> 的解释是: <code>Promise.allSettled()</code> 静态方法将一个 Promise 可迭代对象作为输入，并返回一个单独的 Promise。当所有输入的 Promise 都已敲定时（包括传入空的可迭代对象时），返回的 Promise 将被兑现，并带有描述每个 Promise 结果的对象数组。</p>\\n<div class=\\"language-javascript line-numbers-mode\\" data-ext=\\"js\\"><pre class=\\"language-javascript\\"><code><span class=\\"token keyword\\">const</span> promise1 <span class=\\"token operator\\">=</span> Promise<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">resolve</span><span class=\\"token punctuation\\">(</span><span class=\\"token number\\">3</span><span class=\\"token punctuation\\">)</span>\\n<span class=\\"token keyword\\">const</span> promise2 <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">Promise</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\">resolve<span class=\\"token punctuation\\">,</span> reject</span><span class=\\"token punctuation\\">)</span> <span class=\\"token operator\\">=&gt;</span>\\n  <span class=\\"token function\\">setTimeout</span><span class=\\"token punctuation\\">(</span>reject<span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">100</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'foo'</span><span class=\\"token punctuation\\">)</span>\\n<span class=\\"token punctuation\\">)</span>\\n<span class=\\"token keyword\\">const</span> promises <span class=\\"token operator\\">=</span> <span class=\\"token punctuation\\">[</span>promise1<span class=\\"token punctuation\\">,</span> promise2<span class=\\"token punctuation\\">]</span>\\n\\nPromise<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">allSettled</span><span class=\\"token punctuation\\">(</span>promises<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">.</span><span class=\\"token function\\">then</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\">results</span><span class=\\"token punctuation\\">)</span> <span class=\\"token operator\\">=&gt;</span>\\n  results<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">forEach</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\">result</span><span class=\\"token punctuation\\">)</span> <span class=\\"token operator\\">=&gt;</span> console<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">log</span><span class=\\"token punctuation\\">(</span>result<span class=\\"token punctuation\\">.</span>status<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">)</span>\\n<span class=\\"token punctuation\\">)</span>\\n\\n<span class=\\"token comment\\">// Expected output:</span>\\n<span class=\\"token comment\\">// \\"fulfilled\\"</span>\\n<span class=\\"token comment\\">// \\"rejected\\"</span>\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>"}`);export{s as data};