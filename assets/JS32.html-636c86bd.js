import{_ as n,X as s,Y as a,$ as t}from"./framework-5dd7fabc.js";const p={},e=t,o=s,c=a,l=e(`<p>fetch 请求在现在被用的越来越多了，因此起草一个简易的 fetch 请求库，方便以后使用。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 封装一个 fetch 请求
 * url 请求地址
 * method 请求方式 * GET POST PUT DELETE OPTIONS
 * credentials 携带资源凭证 * include same-origin * omit * credentials
 * headers: null 自定义的请求头信息 「格式必须是纯粹对象」
 * body：null 请求主体信息「只针对 POST 系列请求， 根据当前服务器要求，如果用户传递的是一个纯粹对象, 则需要把其变为 urlencoded 格式字符串(设定请求头中的 Content-Type) 」
 * params: null 设定问号传参信息「格式必须是纯粹对象, 在内部把其拼接到 url 的末尾」
 * responseType: &#39;json&#39; 请求响应的数据类型 * json text blob arrayBuffer
 * timeout: 5000 请求超时时间
 * signal: 中断请求的信号
 */</span>
<span class="token keyword">const</span> <span class="token function-variable function">http</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">config</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> config <span class="token operator">!==</span> <span class="token string">&#39;object&#39;</span><span class="token punctuation">)</span> config <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  config <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">assign</span><span class="token punctuation">(</span>
    <span class="token punctuation">{</span>
      <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">method</span><span class="token operator">:</span> <span class="token string">&#39;GET&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">credentials</span><span class="token operator">:</span> <span class="token string">&#39;include&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">headers</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
      <span class="token literal-property property">body</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
      <span class="token literal-property property">params</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
      <span class="token literal-property property">responseType</span><span class="token operator">:</span> <span class="token string">&#39;json&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">timeout</span><span class="token operator">:</span> <span class="token number">5000</span><span class="token punctuation">,</span>
      <span class="token literal-property property">signal</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    config
  <span class="token punctuation">)</span>

  <span class="token comment">// 必要参数判断</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>config<span class="token punctuation">.</span>url<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&#39;url is required&#39;</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> config<span class="token punctuation">.</span>headers <span class="token operator">!==</span> <span class="token string">&#39;object&#39;</span><span class="token punctuation">)</span> config<span class="token punctuation">.</span>headers <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>config<span class="token punctuation">.</span>params <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token keyword">typeof</span> config<span class="token punctuation">.</span>params <span class="token operator">!==</span> <span class="token string">&#39;object&#39;</span><span class="token punctuation">)</span>
    config<span class="token punctuation">.</span>params <span class="token operator">=</span> <span class="token keyword">null</span>

  <span class="token comment">// 处理细节</span>
  <span class="token keyword">let</span> <span class="token punctuation">{</span>
    url<span class="token punctuation">,</span>
    method<span class="token punctuation">,</span>
    credentials<span class="token punctuation">,</span>
    headers<span class="token punctuation">,</span>
    body<span class="token punctuation">,</span>
    params<span class="token punctuation">,</span>
    responseType<span class="token punctuation">,</span>
    timeout<span class="token punctuation">,</span>
  <span class="token punctuation">}</span> <span class="token operator">=</span> config

  <span class="token comment">// 处理问号传参</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>params<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> paramsStr <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>params<span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">key</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>params<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">&#39;&amp;&#39;</span><span class="token punctuation">)</span>
    url <span class="token operator">+=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>url<span class="token punctuation">.</span><span class="token function">includes</span><span class="token punctuation">(</span><span class="token string">&#39;?&#39;</span><span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token string">&#39;&amp;&#39;</span> <span class="token operator">:</span> <span class="token string">&#39;?&#39;</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>paramsStr<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span> <span class="token comment">// 拼接时是否带问号</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 处理请求主体信息</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> body <span class="token operator">===</span> <span class="token string">&#39;object&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    body <span class="token operator">=</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>body<span class="token punctuation">)</span>
    headers<span class="token punctuation">[</span><span class="token string">&#39;Content-Type&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">&#39;application/json&#39;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">const</span> token <span class="token operator">=</span> localStorage<span class="token punctuation">.</span><span class="token function">getItem</span><span class="token punctuation">(</span><span class="token string">&#39;token&#39;</span><span class="token punctuation">)</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>token<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    headers<span class="token punctuation">[</span><span class="token string">&#39;Authorization&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Bearer </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>token<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 超时处理</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>signal <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    signal <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AbortController</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>signal
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> timeoutId <span class="token operator">=</span> <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    signal<span class="token punctuation">.</span><span class="token function">abort</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> timeout<span class="token punctuation">)</span>

  <span class="token comment">// 发起请求</span>
  method <span class="token operator">=</span> method<span class="token punctuation">.</span><span class="token function">toUpperCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  config <span class="token operator">=</span> <span class="token punctuation">{</span>
    method<span class="token punctuation">,</span>
    credentials<span class="token punctuation">,</span>
    headers<span class="token punctuation">,</span>
    <span class="token literal-property property">cache</span><span class="token operator">:</span> <span class="token string">&#39;no-cache&#39;</span><span class="token punctuation">,</span>
    signal<span class="token punctuation">,</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">&#39;POST&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;PUT&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;PATCH&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">includes</span><span class="token punctuation">(</span>method<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    config<span class="token punctuation">.</span>body <span class="token operator">=</span> body
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> <span class="token function">fetch</span><span class="token punctuation">(</span>url<span class="token punctuation">,</span> config<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">response</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> status<span class="token punctuation">,</span> statusText <span class="token punctuation">}</span> <span class="token operator">=</span> response
      <span class="token keyword">if</span> <span class="token punctuation">(</span>status <span class="token operator">&gt;=</span> <span class="token number">200</span> <span class="token operator">&amp;&amp;</span> status <span class="token operator">&lt;</span> <span class="token number">300</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 请求成功</span>
        <span class="token keyword">let</span> result

        <span class="token keyword">switch</span> <span class="token punctuation">(</span>responseType<span class="token punctuation">.</span><span class="token function">toLowerCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">case</span> <span class="token string">&#39;json&#39;</span><span class="token operator">:</span>
            result <span class="token operator">=</span> response<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
            <span class="token keyword">break</span>
          <span class="token keyword">case</span> <span class="token string">&#39;text&#39;</span><span class="token operator">:</span>
            result <span class="token operator">=</span> response<span class="token punctuation">.</span><span class="token function">text</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
            <span class="token keyword">break</span>
          <span class="token keyword">case</span> <span class="token string">&#39;blob&#39;</span><span class="token operator">:</span>
            result <span class="token operator">=</span> response<span class="token punctuation">.</span><span class="token function">blob</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
            <span class="token keyword">break</span>
          <span class="token keyword">case</span> <span class="token string">&#39;arraybuffer&#39;</span><span class="token operator">:</span>
            result <span class="token operator">=</span> response<span class="token punctuation">.</span><span class="token function">arrayBuffer</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
            <span class="token keyword">break</span>
          <span class="token keyword">default</span><span class="token operator">:</span>
            result <span class="token operator">=</span> response<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">return</span> response<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// 请求失败: HTTP 状态码失败</span>
      <span class="token keyword">return</span> Promise<span class="token punctuation">.</span><span class="token function">reject</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">code</span><span class="token operator">:</span> <span class="token operator">-</span><span class="token number">100</span><span class="token punctuation">,</span>
        status<span class="token punctuation">,</span>
        statusText<span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">reason</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> code<span class="token punctuation">,</span> status <span class="token punctuation">}</span> <span class="token operator">=</span> reason
      <span class="token keyword">if</span> <span class="token punctuation">(</span>code <span class="token operator">===</span> <span class="token operator">-</span><span class="token number">100</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">switch</span> <span class="token punctuation">(</span><span class="token operator">+</span>status<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">case</span> <span class="token number">401</span><span class="token operator">:</span>
            console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&#39;未授权，请重新登录！&#39;</span><span class="token punctuation">)</span>
            <span class="token keyword">break</span>
          <span class="token keyword">case</span> <span class="token number">403</span><span class="token operator">:</span>
            console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&#39;禁止访问！&#39;</span><span class="token punctuation">)</span>
            <span class="token keyword">break</span>
          <span class="token keyword">case</span> <span class="token number">404</span><span class="token operator">:</span>
            console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&#39;请求的资源不存在！&#39;</span><span class="token punctuation">)</span>
            <span class="token keyword">break</span>
          <span class="token keyword">case</span> <span class="token number">500</span><span class="token operator">:</span>
            console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&#39;服务器内部错误，请稍后再试！&#39;</span><span class="token punctuation">)</span>
            <span class="token keyword">break</span>
          <span class="token keyword">default</span><span class="token operator">:</span>
            console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&#39;当前网络繁忙，请稍后再试！&#39;</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">return</span> Promise<span class="token punctuation">.</span><span class="token function">reject</span><span class="token punctuation">(</span>reason<span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token comment">// 快捷方法</span>
<span class="token comment">// [&quot;GET&quot;, &quot;HEAD&quot;, &quot;DELETE&quot;, &quot;OPTIONS&quot;].forEach(method =&gt; {</span>
<span class="token comment">//   http[method.toLowerCase()] = function(url, config) {</span>
<span class="token comment">//     if (typeof config !== &#39;object&#39;) {</span>
<span class="token comment">//       config[&#39;url&#39;] = url</span>
<span class="token comment">//       config[&#39;method&#39;] = method</span>
<span class="token comment">//       return http(config)</span>
<span class="token comment">//     }</span>
<span class="token comment">//   }</span>
<span class="token comment">// })</span>

<span class="token comment">// [&quot;POST&quot;, &quot;PUT&quot;, &quot;PATCH&quot;].forEach(method =&gt; {</span>
<span class="token comment">//   http[method.toLowerCase()] = function(url, body, config) {</span>
<span class="token comment">//     if (typeof config !== &#39;object&#39;) {</span>
<span class="token comment">//       config[&#39;url&#39;] = url</span>
<span class="token comment">//       config[&#39;method&#39;] = method</span>
<span class="token comment">//       config[&quot;body&quot;] = body;</span>
<span class="token comment">//       return http(config)</span>
<span class="token comment">//     }</span>
<span class="token comment">//   }</span>
<span class="token comment">// })</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> http
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),i=[l];function u(r,k){return o(),c("div",null,i)}const v=n(p,[["render",u],["__file","JS32.html.vue"]]);export{v as default};
