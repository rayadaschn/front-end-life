import{_ as n,X as s,Y as a,$ as t}from"./framework-5dd7fabc.js";const e={},p=t,o=s,c=a,l=p(`<p>在项目目录中我有如下目录文件，想将其转化为对象结构：</p><div class="language-tree line-numbers-mode" data-ext="tree"><pre class="language-tree"><code>.
├── bar
│   ├── a
│   │   ├── n1.js
│   │   └── n2.js
│   └── b
│       ├── n1.js
│       └── n2.js
└─── foo
   ├── a
   │   ├── n1.ts
   │   └── n2.ts
   └── b
       ├── n1.ts
       └── n2.ts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以 <code>n1.js</code> 为例，其内容为：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token function">m</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;n1&#39;</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="代码实现" tabindex="-1"><a class="header-anchor" href="#代码实现" aria-hidden="true">#</a> 代码实现</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> modules <span class="token operator">=</span> <span class="token keyword">import</span><span class="token punctuation">.</span>meta<span class="token punctuation">.</span><span class="token function">glob</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">&#39;./bar/**/*.js&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;./foo/**/*.ts&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">eager</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// 立即加载这些文件，而不是延迟加载</span>
  <span class="token keyword">import</span><span class="token operator">:</span> <span class="token string">&#39;default&#39;</span><span class="token punctuation">,</span> <span class="token comment">// 导入模式</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;🚀 ~ modules:&#39;</span><span class="token punctuation">,</span> modules<span class="token punctuation">)</span>

<span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> path <span class="token keyword">in</span> modules<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> moduleDefault <span class="token operator">=</span> modules<span class="token punctuation">[</span>path<span class="token punctuation">]</span> <span class="token comment">// 实际导出结果</span>

  <span class="token keyword">const</span> matched <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">[^\\/\\.]+</span><span class="token regex-delimiter">/</span><span class="token regex-flags">g</span></span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token comment">// 按路径分割</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;🚀 ~ matched:&#39;</span><span class="token punctuation">,</span> matched<span class="token punctuation">)</span>

  <span class="token keyword">let</span> current <span class="token operator">=</span> result <span class="token comment">// 初始上层</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> matched<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> key <span class="token operator">=</span> matched<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
    current<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> current<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">// 初始化层级</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">===</span> matched<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      current<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> moduleDefault <span class="token comment">// 最后一层赋值</span>
    <span class="token punctuation">}</span>

    current <span class="token operator">=</span> current<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token comment">// 更新上层</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;🚀 ~ result:&#39;</span><span class="token punctuation">,</span> result<span class="token punctuation">)</span>

result<span class="token punctuation">.</span>bar<span class="token punctuation">.</span>a<span class="token punctuation">.</span>n1<span class="token punctuation">.</span><span class="token function">m</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="打印结果" tabindex="-1"><a class="header-anchor" href="#打印结果" aria-hidden="true">#</a> 打印结果</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token punctuation">{</span>
    <span class="token string-property property">&quot;bar&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token string-property property">&quot;a&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token string-property property">&quot;n1&quot;</span><span class="token operator">:</span> fn<span class="token punctuation">,</span>
            <span class="token string-property property">&quot;n2&quot;</span><span class="token operator">:</span> fn
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token string-property property">&quot;b&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token string-property property">&quot;n1&quot;</span><span class="token operator">:</span> fn<span class="token punctuation">,</span>
            <span class="token string-property property">&quot;n2&quot;</span><span class="token operator">:</span> fn
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),i=[l];function u(r,d){return o(),c("div",null,i)}const v=n(e,[["render",u],["__file","JS30.html.vue"]]);export{v as default};
