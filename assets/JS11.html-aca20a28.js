import{_ as n,X as s,Y as a,$ as t}from"./framework-5dd7fabc.js";const p={},e=t,o=s,c=a,l=e(`<div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token doc-comment comment">/**
 * 手写柯里化
 */</span>

<span class="token keyword">function</span> <span class="token function">curry</span><span class="token punctuation">(</span>fn<span class="token operator">:</span> <span class="token builtin">Function</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 获取传入函数的参数长度</span>
  <span class="token keyword">const</span> fnArrayLength <span class="token operator">=</span> fn<span class="token punctuation">.</span>length
  <span class="token keyword">let</span> args<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

  <span class="token comment">// 在 ts 中, 独立的函数的 this 要声明类型</span>
  <span class="token keyword">function</span> <span class="token function">calc</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> <span class="token operator">...</span>newArgs<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 积累参数</span>
    args <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token operator">...</span>args<span class="token punctuation">,</span> <span class="token operator">...</span>newArgs<span class="token punctuation">]</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>args<span class="token punctuation">.</span>length <span class="token operator">&lt;</span> fnArrayLength<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 参数不够, 返回函数</span>
      <span class="token keyword">return</span> calc
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// 参数够了, 返回执行结果</span>
      <span class="token keyword">return</span> <span class="token function">fn</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> args<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> fnArrayLength<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// 参数进行截断, 防止参数过多</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> calc
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">add</span><span class="token punctuation">(</span>a<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">,</span> b<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">,</span> c<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">number</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> a <span class="token operator">+</span> b <span class="token operator">+</span> c
<span class="token punctuation">}</span>

<span class="token keyword">const</span> res <span class="token operator">=</span> <span class="token function">curry</span><span class="token punctuation">(</span>add<span class="token punctuation">)</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token function">res</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),i=[l];function u(r,k){return o(),c("div",null,i)}const v=n(p,[["render",u],["__file","JS11.html.vue"]]);export{v as default};
