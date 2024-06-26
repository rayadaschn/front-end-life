import{_ as p,Z as t,a0 as e,F as o,a1 as c,X as l,Y as i,$ as u}from"./framework-5dd7fabc.js";const r={},n=t,s=e,k=o,d=c,v=u,m=l,b=i,y=v(`<h1 id="关于-js-对象的二三事" tabindex="-1"><a class="header-anchor" href="#关于-js-对象的二三事" aria-hidden="true">#</a> 关于 JS 对象的二三事</h1><blockquote><p>记录一些 JavaScript 实用的小技巧</p></blockquote><ul><li><p>对象的比较</p><p>由于对象不是常量，所以比较俩个对象是否相同不能用 <code>===</code> 全等或是 <code>==</code> 比较符进行比较。我们很快可以想到用 <code>JSON.stringigy()</code> 函数进行比较。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> a <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;Dionysia&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">age</span><span class="token operator">:</span> <span class="token number">29</span> <span class="token punctuation">}</span>
<span class="token keyword">let</span> b <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;Dionysia&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">age</span><span class="token operator">:</span> <span class="token number">29</span> <span class="token punctuation">}</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>b<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// true</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然，这里依然有局限性，就是键值的顺序问题，并且 <code>JSON</code>并不能代表所有的类型，它不能识别 <code>undefined</code> ：</p><div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre class="language-JavaScript"><code>let a = { name: &#39;Dionysia&#39;};
let b = { name: &#39;Dionysia&#39;, age: undefined};

console.log(JSON.stringify(a) === JSON.stringify(b)); //true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为此，我们的目标比较俩个对象是否相等的要素有：键值对属性一一对应（属性长度）、是否存在嵌套对象？以下是一种较为朴素的解法：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">deepEqual</span><span class="token punctuation">(</span><span class="token parameter">objA<span class="token punctuation">,</span> objB</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 俩对象指向同一片内存</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>objA <span class="token operator">===</span> objB<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token boolean">true</span>
  <span class="token comment">// 判断是否为对象, 若不为对象且不指向同一片内存,则返回 false</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>
    <span class="token keyword">typeof</span> objA <span class="token operator">===</span> <span class="token string">&#39;object&#39;</span> <span class="token operator">&amp;&amp;</span>
    objA <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span>
    <span class="token keyword">typeof</span> objB <span class="token operator">===</span> <span class="token string">&#39;object&#39;</span> <span class="token operator">&amp;&amp;</span>
    objB <span class="token operator">!==</span> <span class="token keyword">null</span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 两者均为对象, 开始缩小比较范围</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>objA<span class="token punctuation">)</span><span class="token punctuation">.</span>length <span class="token operator">!==</span> Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>objB<span class="token punctuation">)</span><span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// 长度满足要求, 进行深层次比较</span>
      <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> item <span class="token keyword">in</span> objA<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 对象枚举遍历, 检查是否有对应属性</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>objB<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token comment">// 迭代遍历属性 防止其为对象</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">deepEqual</span><span class="token punctuation">(</span>objA<span class="token punctuation">[</span>item<span class="token punctuation">]</span><span class="token punctuation">,</span> objB<span class="token punctuation">[</span>item<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token boolean">false</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          <span class="token keyword">return</span> <span class="token boolean">false</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      <span class="token comment">// 都通过了, 返回 true</span>
      <span class="token keyword">return</span> <span class="token boolean">true</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token boolean">false</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是这依旧有问题，为此较好的处理边界的方式是 Lodash 库里的 <code>_.isEqual()</code>（或者是 <code>Underscore</code>库里的 <code>_.isEqual()</code>）。</p></li></ul><h2 id="手写深拷贝" tabindex="-1"><a class="header-anchor" href="#手写深拷贝" aria-hidden="true">#</a> 手写深拷贝</h2><p>既然谈到了对象的深度比较，那也有深拷贝，简单的就是利用 JSON 两次转化了:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token constant">A</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">a</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
  <span class="token literal-property property">b</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
  <span class="token literal-property property">c</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
<span class="token keyword">const</span> <span class="token constant">B</span> <span class="token operator">=</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span><span class="token constant">A</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// 转化</span>
<span class="token constant">B</span><span class="token punctuation">.</span>c<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">99</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token constant">A</span><span class="token punctuation">)</span> <span class="token comment">// { a: 1, b: 2, c: [ 4, 5, 6 ] }</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token constant">B</span><span class="token punctuation">)</span> <span class="token comment">// { a: 1, b: 2, c: [ 4, 99, 6 ] }</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来手写一个兼容数组 + 递归调用的深拷贝:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">deepClone</span><span class="token punctuation">(</span><span class="token parameter">target</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> result
  <span class="token comment">// 判断是否为非 null 型 Object 类型</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>target <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token keyword">typeof</span> target <span class="token operator">===</span> <span class="token string">&#39;object&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 判断是否为数组</span>
    result <span class="token operator">=</span> Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

    <span class="token comment">// 递归遍历</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> item <span class="token keyword">in</span> target<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      result<span class="token punctuation">[</span>item<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">deepClone</span><span class="token punctuation">(</span>target<span class="token punctuation">[</span>item<span class="token punctuation">]</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// 不为 object 为常量直接返回</span>
    <span class="token keyword">return</span> target
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> result
<span class="token punctuation">}</span>

<span class="token comment">// 测试</span>
<span class="token keyword">const</span> <span class="token constant">A</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">a</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
  <span class="token literal-property property">b</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
  <span class="token literal-property property">c</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
<span class="token keyword">const</span> <span class="token constant">B</span> <span class="token operator">=</span> <span class="token function">deepClone</span><span class="token punctuation">(</span><span class="token constant">A</span><span class="token punctuation">)</span> <span class="token comment">// 转化</span>
<span class="token constant">B</span><span class="token punctuation">.</span>c<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">99</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token constant">A</span><span class="token punctuation">)</span> <span class="token comment">// { a: 1, b: 2, c: [ 4, 5, 6 ] }</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token constant">B</span><span class="token punctuation">)</span> <span class="token comment">// { a: 1, b: 2, c: [ 4, 99, 6 ] }</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的深拷贝解决了常见的拷贝问题，但还不够，属性中可能存在自引用，从而导致循环引用的问题。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 循环引用</span>
<span class="token keyword">const</span> <span class="token constant">A</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">a</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
  <span class="token literal-property property">b</span><span class="token operator">:</span> <span class="token constant">A</span><span class="token punctuation">,</span> <span class="token comment">// 此处自引用</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那如何解决呢？很简单，在进行深拷贝之前，再做一层拦截，将对象存储到 Map （ES6 中的新语法）中即可。解决循环引用问题，</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">deepClone</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> map <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 此处 new Map 会在全程起作用, 递归调用时会将初始 map 传入保证同步</span>
  <span class="token keyword">let</span> result
  <span class="token keyword">if</span> <span class="token punctuation">(</span>target <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token keyword">typeof</span> target <span class="token operator">===</span> <span class="token string">&#39;object&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 类型判断</span>
    result <span class="token operator">=</span> Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

    <span class="token comment">// 循环守卫</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>map<span class="token punctuation">.</span><span class="token function">has</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">return</span> map<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>
    map<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> result<span class="token punctuation">)</span>

    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> item <span class="token keyword">in</span> target<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      result<span class="token punctuation">[</span>item<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">deepClone</span><span class="token punctuation">(</span>target<span class="token punctuation">[</span>item<span class="token punctuation">]</span><span class="token punctuation">,</span> map<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> target
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> result
<span class="token punctuation">}</span>

<span class="token comment">// 测试</span>
<span class="token keyword">const</span> <span class="token constant">A</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">a</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
  <span class="token literal-property property">b</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
  <span class="token literal-property property">c</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
<span class="token constant">A</span><span class="token punctuation">.</span>d <span class="token operator">=</span> <span class="token constant">A</span> <span class="token comment">// 自引用</span>
<span class="token keyword">const</span> <span class="token constant">B</span> <span class="token operator">=</span> <span class="token function">deepClone</span><span class="token punctuation">(</span><span class="token constant">A</span><span class="token punctuation">)</span> <span class="token comment">// 转化</span>
<span class="token constant">B</span><span class="token punctuation">.</span>c<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">99</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token constant">A</span><span class="token punctuation">)</span> <span class="token comment">// { a: 1, b: 2, c: [ 4, 5, 6 ] }</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token constant">B</span><span class="token punctuation">)</span> <span class="token comment">// { a: 1, b: 2, c: [ 4, 99, 6 ] }</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,12),g={href:"https://www.cnblogs.com/echolun/p/16157161.html",target:"_blank",rel:"noopener noreferrer"},f=n("p",null,[s("在浏览器中, 可以使用 "),n("code",null,"structuredClone()"),s(" 方法。这是在浏览器环境中使用的一种深拷贝方法，它可以复制包括函数在内的大多数 JavaScript 数据类型。这个方法通常用于复制可传输的对象，比如在 Web Workers、IndexedDB、postMessage 等场景中。")],-1),w=n("pre",null,[n("code",null,`1. **使用方法**：\`structuredClone()\` 方法是作为\`Window\`对象的一个方法存在的，因此在浏览器中可以直接调用。例如：

\`\`\`javascript
const clonedObject = window.structuredClone(obj)
\`\`\`

2. **支持的数据类型**：\`structuredClone()\` 方法可以复制大多数 JavaScript 数据类型，包括对象、数组、字符串、数字、布尔值、日期对象、正则表达式、Map、Set 等。它还可以复制函数，但是不会复制函数的闭包。

3. **不支持的数据类型**：\`structuredClone()\` 方法无法复制一些特殊的对象，比如 DOM 元素、Error 对象、WeakMap、WeakSet、Symbol 等。

4. **注意事项**：

   - \`structuredClone()\` 方法是一个异步操作，因为它可能需要复制大量数据。
   - 由于它是在浏览器环境中使用的，因此在 Node.js 等非浏览器环境中无法直接使用。

5. **示例**：

\`\`\`javascript
const obj = {
  name: 'Alice',
  age: 30,
  hobbies: ['reading', 'painting'],
}

const clonedObj = window.structuredClone(obj)
console.log(clonedObj)
\`\`\`
`)],-1);function j(h,_){const a=k("ExternalLinkIcon");return m(),b("div",null,[y,n("p",null,[s("当然，深拷贝不止于此，还有各种函数、正则等深拷贝。可以看该文"),n("a",g,[s("《JS 从零手写一个深拷贝（进阶篇）》"),d(a)]),s("。")]),f,w])}const S=p(r,[["render",j],["__file","JS07.html.vue"]]);export{S as default};
