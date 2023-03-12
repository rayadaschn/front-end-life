const n=JSON.parse(`{"key":"v-1877ed7f","path":"/JavaScript/JavaScript%E5%AE%9E%E7%94%A8%E5%B0%8F%E6%8A%80%E5%B7%A7.html","title":"JavaScript实用小技巧","lang":"en-US","frontmatter":{"title":"JavaScript实用小技巧","icon":"javascript","category":["javascript"],"tag":["javascript"],"star":true,"sticky":false,"description":"JavaScript实用小技巧 记录一些 JavaScript 实用的小技巧 对象的比较 由于对象不是常量，所以比较俩个对象是否相同不能用 === 全等或是 == 比较符进行比较。我们很快可以想到用 JSON.stringigy() 函数进行比较。 let a = { name: 'Dionysia', age: 29}; let b = { name: 'Dionysia', age: 29}; console.log(JSON.stringify(a) === JSON.stringify(b)); // true 当然，这里依然有局限性，就是键值的顺序问题，并且 JSON并不能代表所有的类型，它不能识别 undefined ： let a = { name: 'Dionysia'}; let b = { name: 'Dionysia', age: undefined}; console.log(JSON.stringify(a) === JSON.stringify(b)); //true 为此，我们的目标比较俩个对象是否相等的要素有：键值对属性一一对应（属性长度）、是否存在嵌套对象？以下是一种较为朴素的解法： function deepEqual(objA, objB) { // 俩对象指向同一片内存 if (objA === objB) return true; // 判断是否为对象, 若不为对象且不指向同一片内存,则返回 false if ( typeof objA === \\"object\\" &amp;&amp; objA !== null &amp;&amp; typeof objB === \\"object\\" &amp;&amp; objB !== null ) { // 两者均为对象, 开始缩小比较范围 if (Object.keys(objA).length !== Object.keys(objB).length) { return false; } else { // 长度满足要求, 进行深层次比较 for (let item in objA) { // 对象枚举遍历, 检查是否有对应属性 if (objB.hasOwnProperty(item)) { // 迭代遍历属性 防止其为对象 if (!deepEqual(objA[item], objB[item])) return false; } else { return false; } } // 都通过了, 返回 true return true; } } else { return false; } } 但是这依旧有问题，为此较好的处理边界的方式是 Lodash 库里的 _.isEqual()（或者是 Underscore库里的 _.isEqual()）。","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/front-end-life/JavaScript/JavaScript%E5%AE%9E%E7%94%A8%E5%B0%8F%E6%8A%80%E5%B7%A7.html"}],["meta",{"property":"og:site_name","content":"Huy's Blog"}],["meta",{"property":"og:title","content":"JavaScript实用小技巧"}],["meta",{"property":"og:description","content":"JavaScript实用小技巧 记录一些 JavaScript 实用的小技巧 对象的比较 由于对象不是常量，所以比较俩个对象是否相同不能用 === 全等或是 == 比较符进行比较。我们很快可以想到用 JSON.stringigy() 函数进行比较。 let a = { name: 'Dionysia', age: 29}; let b = { name: 'Dionysia', age: 29}; console.log(JSON.stringify(a) === JSON.stringify(b)); // true 当然，这里依然有局限性，就是键值的顺序问题，并且 JSON并不能代表所有的类型，它不能识别 undefined ： let a = { name: 'Dionysia'}; let b = { name: 'Dionysia', age: undefined}; console.log(JSON.stringify(a) === JSON.stringify(b)); //true 为此，我们的目标比较俩个对象是否相等的要素有：键值对属性一一对应（属性长度）、是否存在嵌套对象？以下是一种较为朴素的解法： function deepEqual(objA, objB) { // 俩对象指向同一片内存 if (objA === objB) return true; // 判断是否为对象, 若不为对象且不指向同一片内存,则返回 false if ( typeof objA === \\"object\\" &amp;&amp; objA !== null &amp;&amp; typeof objB === \\"object\\" &amp;&amp; objB !== null ) { // 两者均为对象, 开始缩小比较范围 if (Object.keys(objA).length !== Object.keys(objB).length) { return false; } else { // 长度满足要求, 进行深层次比较 for (let item in objA) { // 对象枚举遍历, 检查是否有对应属性 if (objB.hasOwnProperty(item)) { // 迭代遍历属性 防止其为对象 if (!deepEqual(objA[item], objB[item])) return false; } else { return false; } } // 都通过了, 返回 true return true; } } else { return false; } } 但是这依旧有问题，为此较好的处理边界的方式是 Lodash 库里的 _.isEqual()（或者是 Underscore库里的 _.isEqual()）。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2023-03-12T10:53:21.000Z"}],["meta",{"property":"article:tag","content":"javascript"}],["meta",{"property":"article:modified_time","content":"2023-03-12T10:53:21.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"JavaScript实用小技巧\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-03-12T10:53:21.000Z\\",\\"author\\":[]}"]]},"headers":[],"git":{"createdTime":1678512667000,"updatedTime":1678618401000,"contributors":[{"name":"rayadaschn","email":"115447518+rayadaschn@users.noreply.github.com","commits":2}]},"readingTime":{"minutes":1.37,"words":412},"filePathRelative":"JavaScript/JavaScript实用小技巧.md","localizedDate":"March 11, 2023","excerpt":"<h1> JavaScript实用小技巧</h1>\\n<blockquote>\\n<p>记录一些 JavaScript 实用的小技巧</p>\\n</blockquote>\\n<ul>\\n<li>\\n<p>对象的比较</p>\\n<p>由于对象不是常量，所以比较俩个对象是否相同不能用 <code>===</code> 全等或是 <code>==</code> 比较符进行比较。我们很快可以想到用 <code>JSON.stringigy()</code> 函数进行比较。</p>\\n<div class=\\"language-javascript line-numbers-mode\\" data-ext=\\"js\\"><pre class=\\"language-javascript\\"><code><span class=\\"token keyword\\">let</span> a <span class=\\"token operator\\">=</span> <span class=\\"token punctuation\\">{</span> <span class=\\"token literal-property property\\">name</span><span class=\\"token operator\\">:</span> <span class=\\"token string\\">'Dionysia'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token literal-property property\\">age</span><span class=\\"token operator\\">:</span> <span class=\\"token number\\">29</span><span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token keyword\\">let</span> b <span class=\\"token operator\\">=</span> <span class=\\"token punctuation\\">{</span> <span class=\\"token literal-property property\\">name</span><span class=\\"token operator\\">:</span> <span class=\\"token string\\">'Dionysia'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token literal-property property\\">age</span><span class=\\"token operator\\">:</span> <span class=\\"token number\\">29</span><span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">;</span>\\n\\nconsole<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">log</span><span class=\\"token punctuation\\">(</span><span class=\\"token constant\\">JSON</span><span class=\\"token punctuation\\">.</span><span class=\\"token function\\">stringify</span><span class=\\"token punctuation\\">(</span>a<span class=\\"token punctuation\\">)</span> <span class=\\"token operator\\">===</span> <span class=\\"token constant\\">JSON</span><span class=\\"token punctuation\\">.</span><span class=\\"token function\\">stringify</span><span class=\\"token punctuation\\">(</span>b<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span> <span class=\\"token comment\\">// true</span>\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div><p>当然，这里依然有局限性，就是键值的顺序问题，并且 <code>JSON</code>并不能代表所有的类型，它不能识别 <code>undefined</code> ：</p>\\n<div class=\\"language-JavaScript line-numbers-mode\\" data-ext=\\"JavaScript\\"><pre class=\\"language-JavaScript\\"><code>let a = { name: 'Dionysia'};\\nlet b = { name: 'Dionysia', age: undefined};\\n\\nconsole.log(JSON.stringify(a) === JSON.stringify(b)); //true\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div><p>为此，我们的目标比较俩个对象是否相等的要素有：键值对属性一一对应（属性长度）、是否存在嵌套对象？以下是一种较为朴素的解法：</p>\\n<div class=\\"language-javascript line-numbers-mode\\" data-ext=\\"js\\"><pre class=\\"language-javascript\\"><code><span class=\\"token keyword\\">function</span> <span class=\\"token function\\">deepEqual</span><span class=\\"token punctuation\\">(</span><span class=\\"token parameter\\">objA<span class=\\"token punctuation\\">,</span> objB</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n  <span class=\\"token comment\\">// 俩对象指向同一片内存</span>\\n  <span class=\\"token keyword\\">if</span> <span class=\\"token punctuation\\">(</span>objA <span class=\\"token operator\\">===</span> objB<span class=\\"token punctuation\\">)</span> <span class=\\"token keyword\\">return</span> <span class=\\"token boolean\\">true</span><span class=\\"token punctuation\\">;</span>\\n  <span class=\\"token comment\\">// 判断是否为对象, 若不为对象且不指向同一片内存,则返回 false</span>\\n  <span class=\\"token keyword\\">if</span> <span class=\\"token punctuation\\">(</span>\\n    <span class=\\"token keyword\\">typeof</span> objA <span class=\\"token operator\\">===</span> <span class=\\"token string\\">\\"object\\"</span> <span class=\\"token operator\\">&amp;&amp;</span>\\n    objA <span class=\\"token operator\\">!==</span> <span class=\\"token keyword\\">null</span> <span class=\\"token operator\\">&amp;&amp;</span>\\n    <span class=\\"token keyword\\">typeof</span> objB <span class=\\"token operator\\">===</span> <span class=\\"token string\\">\\"object\\"</span> <span class=\\"token operator\\">&amp;&amp;</span>\\n    objB <span class=\\"token operator\\">!==</span> <span class=\\"token keyword\\">null</span>\\n  <span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token comment\\">// 两者均为对象, 开始缩小比较范围</span>\\n    <span class=\\"token keyword\\">if</span> <span class=\\"token punctuation\\">(</span>Object<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">keys</span><span class=\\"token punctuation\\">(</span>objA<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">.</span>length <span class=\\"token operator\\">!==</span> Object<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">keys</span><span class=\\"token punctuation\\">(</span>objB<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">.</span>length<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n      <span class=\\"token keyword\\">return</span> <span class=\\"token boolean\\">false</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span> <span class=\\"token keyword\\">else</span> <span class=\\"token punctuation\\">{</span>\\n      <span class=\\"token comment\\">// 长度满足要求, 进行深层次比较</span>\\n      <span class=\\"token keyword\\">for</span> <span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">let</span> item <span class=\\"token keyword\\">in</span> objA<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token comment\\">// 对象枚举遍历, 检查是否有对应属性</span>\\n        <span class=\\"token keyword\\">if</span> <span class=\\"token punctuation\\">(</span>objB<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">hasOwnProperty</span><span class=\\"token punctuation\\">(</span>item<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n          <span class=\\"token comment\\">// 迭代遍历属性 防止其为对象</span>\\n          <span class=\\"token keyword\\">if</span> <span class=\\"token punctuation\\">(</span><span class=\\"token operator\\">!</span><span class=\\"token function\\">deepEqual</span><span class=\\"token punctuation\\">(</span>objA<span class=\\"token punctuation\\">[</span>item<span class=\\"token punctuation\\">]</span><span class=\\"token punctuation\\">,</span> objB<span class=\\"token punctuation\\">[</span>item<span class=\\"token punctuation\\">]</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">)</span> <span class=\\"token keyword\\">return</span> <span class=\\"token boolean\\">false</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token punctuation\\">}</span> <span class=\\"token keyword\\">else</span> <span class=\\"token punctuation\\">{</span>\\n          <span class=\\"token keyword\\">return</span> <span class=\\"token boolean\\">false</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token punctuation\\">}</span>\\n      <span class=\\"token punctuation\\">}</span>\\n      <span class=\\"token comment\\">// 都通过了, 返回 true</span>\\n      <span class=\\"token keyword\\">return</span> <span class=\\"token boolean\\">true</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n  <span class=\\"token punctuation\\">}</span> <span class=\\"token keyword\\">else</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token keyword\\">return</span> <span class=\\"token boolean\\">false</span><span class=\\"token punctuation\\">;</span>\\n  <span class=\\"token punctuation\\">}</span>\\n<span class=\\"token punctuation\\">}</span>\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div><p>但是这依旧有问题，为此较好的处理边界的方式是 Lodash 库里的 <code>_.isEqual()</code>（或者是 <code>Underscore</code>库里的 <code>_.isEqual()</code>）。</p>\\n</li>\\n</ul>","autoDesc":true}`);export{n as data};
