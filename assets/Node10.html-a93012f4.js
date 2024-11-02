import{_ as n,X as s,Y as a,$ as e}from"./framework-5dd7fabc.js";const p={},t=e,o=s,c=a,l=t(`<h2 id="commonjs" tabindex="-1"><a class="header-anchor" href="#commonjs" aria-hidden="true">#</a> CommonJS</h2><h3 id="概念" tabindex="-1"><a class="header-anchor" href="#概念" aria-hidden="true">#</a> 概念</h3><p>CommonJS 是一种模块化规范，它允许我们在一个文件中定义模块，然后在另一个文件中引入和使用这些模块。CommonJS 是运行时的这点和 ESModule 不同。</p><p>可以简单思考一下，这个文件导出后的结果是什么？</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// commonjs 待导出文件</span>
<span class="token keyword">this</span><span class="token punctuation">.</span>a <span class="token operator">=</span> <span class="token number">1</span>
exports<span class="token punctuation">.</span>b <span class="token operator">=</span> <span class="token number">2</span>
exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">c</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">d</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

exports<span class="token punctuation">.</span>e <span class="token operator">=</span> <span class="token number">5</span>
<span class="token keyword">this</span><span class="token punctuation">.</span>f <span class="token operator">=</span> <span class="token number">6</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>结果是 <code>{d:4}</code>，通过简单实现 <code>require</code> 来更好理解这个想象，下面来简单实现一下。</p><h2 id="伪代码实现" tabindex="-1"><a class="header-anchor" href="#伪代码实现" aria-hidden="true">#</a> 伪代码实现</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token parameter">modulePath</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 1. 根据传递模块路径, 得到模块完整的绝对路径</span>
  <span class="token keyword">var</span> moduleId <span class="token operator">=</span> <span class="token function">getModuleId</span><span class="token punctuation">(</span>modulePath<span class="token punctuation">)</span>
  <span class="token comment">// 2. 根据模块id, 查找缓存中是否已经存在</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>cache<span class="token punctuation">[</span>moduleId<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> cache<span class="token punctuation">[</span>moduleId<span class="token punctuation">]</span><span class="token punctuation">.</span>exports
  <span class="token punctuation">}</span>
  <span class="token comment">// 3. 如果不存在, 真正运行模块代码的辅助函数</span>
  <span class="token keyword">function</span> <span class="token function">_require</span><span class="token punctuation">(</span><span class="token parameter">exports<span class="token punctuation">,</span> require<span class="token punctuation">,</span> module<span class="token punctuation">,</span> __filename<span class="token punctuation">,</span> __dirname</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 运行导入的模块代码</span>
    <span class="token comment">// ...</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 准备并运行辅助函数</span>
  <span class="token keyword">var</span> module <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">id</span><span class="token operator">:</span> moduleId<span class="token punctuation">,</span>
    <span class="token literal-property property">exports</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">var</span> exports <span class="token operator">=</span> module<span class="token punctuation">.</span>exports

  <span class="token comment">// 得到模块文件的绝对路径</span>
  <span class="token keyword">var</span> __filename <span class="token operator">=</span> moduleId
  <span class="token comment">// 得到模块文件所在目录的绝对路径, 通过内置模块 getDirname</span>
  <span class="token keyword">var</span> __dirname <span class="token operator">=</span> <span class="token function">getDirname</span><span class="token punctuation">(</span>__filename<span class="token punctuation">)</span>

  <span class="token comment">// 用 call 绑定 this, 即 exports</span>
  <span class="token function">_require</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>exports<span class="token punctuation">,</span> exports<span class="token punctuation">,</span> require<span class="token punctuation">,</span> module<span class="token punctuation">,</span> __filename<span class="token punctuation">,</span> __dirname<span class="token punctuation">)</span>

  <span class="token comment">// 4. 将运行结果缓存起来</span>
  cache<span class="token punctuation">[</span>moduleId<span class="token punctuation">]</span> <span class="token operator">=</span> module<span class="token punctuation">.</span>exports

  <span class="token comment">// 5. 返回模块的导出结果</span>
  <span class="token keyword">return</span> module<span class="token punctuation">.</span>exports
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="验证理解" tabindex="-1"><a class="header-anchor" href="#验证理解" aria-hidden="true">#</a> 验证理解</h2><p>通过上面的伪代码，可以更好的理解下面的代码导出结果：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// commonjs 待导出文件</span>
<span class="token keyword">this</span><span class="token punctuation">.</span>a <span class="token operator">=</span> <span class="token number">1</span>
exports<span class="token punctuation">.</span>b <span class="token operator">=</span> <span class="token number">2</span>
exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">c</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">d</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

exports<span class="token punctuation">.</span>e <span class="token operator">=</span> <span class="token number">5</span>
<span class="token keyword">this</span><span class="token punctuation">.</span>f <span class="token operator">=</span> <span class="token number">6</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么实际上这个文件导出的结果是什么呢？我们来一行一行理解</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 1. 最开始的时候, this 和 exports 都指向 module.exports</span>
console<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token keyword">this</span> <span class="token operator">===</span> module<span class="token punctuation">.</span>exports<span class="token punctuation">,</span> exports <span class="token operator">===</span> module<span class="token punctuation">.</span>exports<span class="token punctuation">)</span> <span class="token comment">// true true</span>

<span class="token comment">// 2. this.a = 1, module.exports.a = 1</span>
<span class="token keyword">this</span><span class="token punctuation">.</span>a <span class="token operator">=</span> <span class="token number">1</span>

<span class="token comment">// 3. exports.b = 2, module.exports.b = 2</span>
exports<span class="token punctuation">.</span>b <span class="token operator">=</span> <span class="token number">2</span>

<span class="token comment">// 4. 此时 exports 改变了地址指向，指向了一个新的对象</span>
exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">c</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

<span class="token comment">// 5. 此时 exports 和 module.exports 指向的不是同一个对象了, 只有 this 还指向原来的对象。</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">d</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

<span class="token comment">// 这个时候三者的状态是:</span>
<span class="token comment">// this: { a: 1, b: 2}; exports: { c: 3 }; module.exports: { d: 4 }</span>

<span class="token comment">// 6. 继续改变 exports 和 this 的对象值</span>
exports<span class="token punctuation">.</span>e <span class="token operator">=</span> <span class="token number">5</span>
<span class="token keyword">this</span><span class="token punctuation">.</span>f <span class="token operator">=</span> <span class="token number">6</span>

<span class="token comment">// 最终导出的结果是:</span>
<span class="token comment">// this: { a: 1, b: 2, f: 6 };</span>
<span class="token comment">// exports: { c: 3, e: 5 };</span>
<span class="token comment">// module.exports: { d: 4 }</span>

<span class="token comment">// 从伪代码中可以知道，最终导出的是 module.exports 的值, 浏览器缓存的也是它, 因此该文件的输出为 { d: 4 }</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13),i=[l];function r(u,d){return o(),c("div",null,i)}const k=n(p,[["render",r],["__file","Node10.html.vue"]]);export{k as default};
