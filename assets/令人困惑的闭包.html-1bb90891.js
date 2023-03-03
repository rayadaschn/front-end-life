const n=JSON.parse(`{"key":"v-5dc87674","path":"/JavaScript/%E4%BB%A4%E4%BA%BA%E5%9B%B0%E6%83%91%E7%9A%84%E9%97%AD%E5%8C%85.html","title":"令人困惑的闭包","lang":"en-US","frontmatter":{"title":"令人困惑的闭包","icon":"javascript","order":9,"category":["javascript"],"tag":["javascript"],"star":true,"sticky":true,"description":"令人困惑的闭包 终于来到闭包了，闭包其实挺难的。不信，你看下面的代码： const foo = (function () { var item = 0; return () =&gt; { return item++; }; })(); for (let index = 0; index &lt; 10; index++) { foo(); } console.log(foo());","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/front-end-life/JavaScript/%E4%BB%A4%E4%BA%BA%E5%9B%B0%E6%83%91%E7%9A%84%E9%97%AD%E5%8C%85.html"}],["meta",{"property":"og:site_name","content":"Huy's Blog"}],["meta",{"property":"og:title","content":"令人困惑的闭包"}],["meta",{"property":"og:description","content":"令人困惑的闭包 终于来到闭包了，闭包其实挺难的。不信，你看下面的代码： const foo = (function () { var item = 0; return () =&gt; { return item++; }; })(); for (let index = 0; index &lt; 10; index++) { foo(); } console.log(foo());"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2023-03-03T07:59:18.000Z"}],["meta",{"property":"article:tag","content":"javascript"}],["meta",{"property":"article:modified_time","content":"2023-03-03T07:59:18.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"令人困惑的闭包\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-03-03T07:59:18.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"1 前置基础知识","slug":"_1-前置基础知识","link":"#_1-前置基础知识","children":[{"level":3,"title":"1.1 作用域","slug":"_1-1-作用域","link":"#_1-1-作用域","children":[]},{"level":3,"title":"1.2 块级作用域和暂时性死区","slug":"_1-2-块级作用域和暂时性死区","link":"#_1-2-块级作用域和暂时性死区","children":[]},{"level":3,"title":"1.3 执行上下文/作用域","slug":"_1-3-执行上下文-作用域","link":"#_1-3-执行上下文-作用域","children":[]},{"level":3,"title":"1.4 调用栈","slug":"_1-4-调用栈","link":"#_1-4-调用栈","children":[]}]},{"level":2,"title":"2 闭包","slug":"_2-闭包","link":"#_2-闭包","children":[{"level":3,"title":"2.1 到底是什么?","slug":"_2-1-到底是什么","link":"#_2-1-到底是什么","children":[]},{"level":3,"title":"2.2 内存回收机制","slug":"_2-2-内存回收机制","link":"#_2-2-内存回收机制","children":[]}]},{"level":2,"title":"参考资料","slug":"参考资料","link":"#参考资料","children":[]}],"git":{"createdTime":1676646774000,"updatedTime":1677830358000,"contributors":[{"name":"Huy","email":"rayadaschn@gmail.com","commits":1},{"name":"rayadaschn","email":"rayadaschn@gmail.com","commits":1}]},"readingTime":{"minutes":10.35,"words":3104},"filePathRelative":"JavaScript/令人困惑的闭包.md","localizedDate":"February 17, 2023","excerpt":"<h1> 令人困惑的闭包</h1>\\n<p>终于来到闭包了，闭包其实挺难的。不信，你看下面的代码：</p>\\n<div class=\\"language-javascript line-numbers-mode\\" data-ext=\\"js\\"><pre class=\\"language-javascript\\"><code><span class=\\"token keyword\\">const</span> foo <span class=\\"token operator\\">=</span> <span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">function</span> <span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n  <span class=\\"token keyword\\">var</span> item <span class=\\"token operator\\">=</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">;</span>\\n  <span class=\\"token keyword\\">return</span> <span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token operator\\">=&gt;</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token keyword\\">return</span> item<span class=\\"token operator\\">++</span><span class=\\"token punctuation\\">;</span>\\n  <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n\\n<span class=\\"token keyword\\">for</span> <span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">let</span> index <span class=\\"token operator\\">=</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">;</span> index <span class=\\"token operator\\">&lt;</span> <span class=\\"token number\\">10</span><span class=\\"token punctuation\\">;</span> index<span class=\\"token operator\\">++</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n  <span class=\\"token function\\">foo</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token punctuation\\">}</span>\\n\\nconsole<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">log</span><span class=\\"token punctuation\\">(</span><span class=\\"token function\\">foo</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}`);export{n as data};
