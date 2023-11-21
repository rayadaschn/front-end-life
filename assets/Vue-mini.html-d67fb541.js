import{_ as n,X as s,Y as a,$ as t}from"./framework-97fa2d96.js";const e={},p=t,o=s,l=a,c=p(`<blockquote><p>尤雨溪：框架的设计过程其实是一个不断取舍的过程。</p></blockquote><h2 id="理解命令式和声明式" tabindex="-1"><a class="header-anchor" href="#理解命令式和声明式" aria-hidden="true">#</a> 理解命令式和声明式</h2><p>&quot;命令式&quot;（Imperative）和&quot;声明式&quot;（Declarative）是两种编程范式，用来描述编程语言或编程风格的不同方式。</p><ol><li><p><strong>命令式（Imperative）</strong>：</p><ul><li><strong>关注步骤和过程：</strong> 命令式编程关注如何完成一个任务，通过指定每个步骤来达到目标。</li><li><strong>具体的控制流：</strong> 开发者需要详细说明程序的控制流程，包括循环、条件语句等。</li><li><strong>修改状态：</strong> 程序通过改变状态来实现目标，通常使用变量来存储和修改状态。</li><li><strong>示例：</strong> 常见的命令式编程语言包括 C、C++、Java。例如，下面是一个简单的命令式编程的示例，计算阶乘的函数：</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 计算阶乘的命令式函数</span>

  <span class="token keyword">function</span> <span class="token function">factorial</span><span class="token punctuation">(</span><span class="token parameter">n</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> result <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> n<span class="token punctuation">;</span> <span class="token operator">++</span>i<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  result \\<span class="token operator">*=</span> i<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> result<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">factorial</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 输出: 120</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>声明式（Declarative）</strong>：</p><ul><li><p><strong>关注结果而非步骤：</strong> 声明式编程关注定义要达到的目标，而不是详细说明如何实现这个目标。</p></li><li><p><strong>抽象控制流：</strong> 具体的控制流程由编程语言或框架隐式处理，而不需要开发者明确指定。</p></li><li><p><strong>不修改状态：</strong> 避免直接修改状态，而是通过声明式的方式描述所需的状态。</p></li><li><p><strong>示例：</strong> 常见的声明式编程语言包括 SQL、HTML、React 中的 JSX。以下是一个声明式的 React 组件示例：</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">function</span> <span class="token function">Greeting</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> name <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">Hello, </span><span class="token punctuation">{</span>name<span class="token punctuation">}</span><span class="token plain-text">!</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li></ol><p>总的来说，声明式代码更利于阅读，也更利于维护，但是性能弱于命令式（步骤更多）。</p><h2 id="区分运行时和编译时" tabindex="-1"><a class="header-anchor" href="#区分运行时和编译时" aria-hidden="true">#</a> 区分运行时和编译时</h2><p>Vue 是一个运行时 ➕ 编译时的框架。</p><p>通过 compiler 解析 html 模版，生成 render 函数，再通过 runtime 解析 render，从而挂载真实 DOM。</p>`,8),i=[c];function u(r,d){return o(),l("div",null,i)}const v=n(e,[["render",u],["__file","Vue-mini.html.vue"]]);export{v as default};
