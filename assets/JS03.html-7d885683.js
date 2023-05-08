import{_ as n,V as s,W as a,$ as e}from"./framework-2060dede.js";const t={},i=e(`<h1 id="异步小案例" tabindex="-1"><a class="header-anchor" href="#异步小案例" aria-hidden="true">#</a> 异步小案例</h1><h2 id="红绿灯控制任务" tabindex="-1"><a class="header-anchor" href="#红绿灯控制任务" aria-hidden="true">#</a> 红绿灯控制任务</h2><p>红灯 3s 亮一次，绿灯 1s 亮一次，黄灯 2s 亮一次，如果让 3 个灯不断交替地重复亮呢？</p><div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre class="language-JavaScript"><code>function red() {
    console.log(&#39;red&#39;);
}

function green() {
    console.log(&#39;green&#39;)
}

function yellow() {
    console.log(&#39;yellow&#39;)
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="callback-实现" tabindex="-1"><a class="header-anchor" href="#callback-实现" aria-hidden="true">#</a> callback 实现</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token function-variable function">task</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">timer<span class="token punctuation">,</span> light<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>light <span class="token operator">===</span> <span class="token string">&quot;red&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">red</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>light <span class="token operator">===</span> <span class="token string">&quot;green&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">green</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>light <span class="token operator">===</span> <span class="token string">&quot;yellow&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">yellow</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 执行完毕,进行回调</span>
    <span class="token function">callback</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> timer<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">// 回调重复执行</span>
<span class="token keyword">const</span> <span class="token function-variable function">taskRunner</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token function">task</span><span class="token punctuation">(</span><span class="token number">3000</span><span class="token punctuation">,</span> <span class="token string">&quot;red&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token function">task</span><span class="token punctuation">(</span><span class="token number">2000</span><span class="token punctuation">,</span> <span class="token string">&quot;green&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token function">task</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">,</span> <span class="token string">&quot;yellow&quot;</span><span class="token punctuation">,</span> taskRunner<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token function">taskRunner</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="promise-实现" tabindex="-1"><a class="header-anchor" href="#promise-实现" aria-hidden="true">#</a> Promise 实现</h3><div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre class="language-JavaScript"><code>const task = (timer, light) =&gt; {
  return new Promise((resolve, reject) =&gt; {
    setTimeout(() =&gt; {
      if (light === &quot;red&quot;) {
        red();
      } else if (light === &quot;green&quot;) {
        green();
      } else if (light === &quot;yellow&quot;) {
        yellow();
      }
      resolve();
    }, timer);
  });
};

const taskRunner = () =&gt; {
  task(3000, &quot;red&quot;)
    .then(() =&gt; task(2000, &quot;green&quot;))
    .then(() =&gt; task(1000, &quot;yellow&quot;))
    .then(taskRunner);
};

taskRunner();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="async-await-实现" tabindex="-1"><a class="header-anchor" href="#async-await-实现" aria-hidden="true">#</a> async/await 实现</h3><div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre class="language-JavaScript"><code>// Promise 主体部分相同
const taskRunner = async () =&gt; {
  await task(3000, &quot;red&quot;);
  await task(2000, &quot;green&quot;);
  await task(1000, &quot;yellow&quot;);
  await taskRunner();
};

taskRunner();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10),c=[i];function l(p,o){return s(),a("div",null,c)}const d=n(t,[["render",l],["__file","JS03.html.vue"]]);export{d as default};
