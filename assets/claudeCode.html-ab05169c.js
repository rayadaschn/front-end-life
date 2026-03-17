import{_ as n,X as s,Y as a,$ as t}from"./framework-5dd7fabc.js";const p={},e=t,o=s,c=a,l=e(`<p>从零开始构建一个 Claude Code，旨在梳理 Agent 的核心原理。</p><h2 id="智能体循环" tabindex="-1"><a class="header-anchor" href="#智能体循环" aria-hidden="true">#</a> 智能体循环</h2><p>智能体循环其实就是 ReAct Agent 模式。</p><p>核心结构：</p><div class="language-markdown line-numbers-mode" data-ext="md"><pre class="language-markdown"><code>用户 → LLM → 工具执行 → 结果 → 回到 LLM → ...（循环）
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>直到：<code>stop_reason != &quot;tool_use&quot;</code>，才结束循环。</p><figure><img src="https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202603172058430.png" alt="ReAct Agent 模式" tabindex="0" loading="lazy"><figcaption>ReAct Agent 模式</figcaption></figure><h3 id="工作原理" tabindex="-1"><a class="header-anchor" href="#工作原理" aria-hidden="true">#</a> 工作原理</h3><ol><li><p>初始化消息</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> messages <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> <span class="token literal-property property">role</span><span class="token operator">:</span> <span class="token string">&#39;user&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">content</span><span class="token operator">:</span> query <span class="token punctuation">}</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p>调用 LLM</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> response <span class="token operator">=</span> client<span class="token punctuation">.</span>messages<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  model<span class="token punctuation">,</span>
  system<span class="token punctuation">,</span>
  message<span class="token punctuation">,</span>
  tools<span class="token punctuation">,</span>
  max_tokens<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>追加响应结果，检查 <code>stop_reason</code> 判断是否结束</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>messages<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">role</span><span class="token operator">:</span> <span class="token string">&#39;assistant&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">content</span><span class="token operator">:</span> response<span class="token punctuation">.</span>content <span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">if</span> <span class="token punctuation">(</span>response<span class="token punctuation">.</span>stop_reason <span class="token operator">!=</span> <span class="token string">&#39;tool_use&#39;</span><span class="token punctuation">)</span> <span class="token keyword">return</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>执行每个工具调用, 收集结果, 作为 user 消息追加。回到第 2 步。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> results <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> block <span class="token keyword">of</span> response<span class="token punctuation">.</span>content<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>block<span class="token punctuation">.</span>type <span class="token operator">===</span> <span class="token string">&#39;tool_use&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> output <span class="token operator">=</span> <span class="token function">runBash</span><span class="token punctuation">(</span>block<span class="token punctuation">.</span>input<span class="token punctuation">.</span>command<span class="token punctuation">)</span>

    results<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;tool_result&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">tool_use_id</span><span class="token operator">:</span> block<span class="token punctuation">.</span>id<span class="token punctuation">,</span>
      <span class="token literal-property property">content</span><span class="token operator">:</span> output<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

messages<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">role</span><span class="token operator">:</span> <span class="token string">&#39;user&#39;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">content</span><span class="token operator">:</span> results<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h3 id="最终代码" tabindex="-1"><a class="header-anchor" href="#最终代码" aria-hidden="true">#</a> 最终代码</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> execSync <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;child_process&#39;</span>
<span class="token keyword">import</span> OpenAI <span class="token keyword">from</span> <span class="token string">&#39;openai&#39;</span>

<span class="token keyword">const</span> client <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">OpenAI</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">apiKey</span><span class="token operator">:</span> process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">OPENAI_API_KEY</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> <span class="token constant">MODEL</span> <span class="token operator">=</span> <span class="token string">&#39;gpt-4.1&#39;</span> <span class="token comment">// 或你用的模型</span>

<span class="token comment">// 一个最简单的 bash 工具</span>
<span class="token keyword">const</span> <span class="token constant">TOOLS</span> <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;function&#39;</span><span class="token punctuation">,</span>
    <span class="token keyword">function</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;run_bash&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&#39;Execute a shell command&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">parameters</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;object&#39;</span><span class="token punctuation">,</span>
        <span class="token literal-property property">properties</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token literal-property property">command</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;string&#39;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&#39;Shell command to run&#39;</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token literal-property property">required</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;command&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span>

<span class="token comment">// 执行 bash</span>
<span class="token keyword">function</span> <span class="token function">runBash</span><span class="token punctuation">(</span><span class="token parameter">command</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">try</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token function">execSync</span><span class="token punctuation">(</span>command<span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">encoding</span><span class="token operator">:</span> <span class="token string">&#39;utf-8&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> result
  <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> err<span class="token punctuation">.</span>message
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// Agent Loop</span>
<span class="token keyword">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">agentLoop</span><span class="token punctuation">(</span><span class="token parameter">query</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> messages <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> <span class="token literal-property property">role</span><span class="token operator">:</span> <span class="token string">&#39;user&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">content</span><span class="token operator">:</span> query <span class="token punctuation">}</span><span class="token punctuation">]</span>

  <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> client<span class="token punctuation">.</span>chat<span class="token punctuation">.</span>completions<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">model</span><span class="token operator">:</span> <span class="token constant">MODEL</span><span class="token punctuation">,</span>
      messages<span class="token punctuation">,</span>
      <span class="token literal-property property">tools</span><span class="token operator">:</span> <span class="token constant">TOOLS</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token keyword">const</span> msg <span class="token operator">=</span> response<span class="token punctuation">.</span>choices<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>message

    <span class="token comment">// 追加 assistant 回复</span>
    messages<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span>

    <span class="token comment">// 没有工具调用则直接结束</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>msg<span class="token punctuation">.</span>tool_calls<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> msg<span class="token punctuation">.</span>content
    <span class="token punctuation">}</span>

    <span class="token comment">// 执行工具</span>
    <span class="token keyword">const</span> toolResults <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> toolCall <span class="token keyword">of</span> msg<span class="token punctuation">.</span>tool_calls<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>toolCall<span class="token punctuation">.</span>function<span class="token punctuation">.</span>name <span class="token operator">===</span> <span class="token string">&#39;run_bash&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> args <span class="token operator">=</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span>toolCall<span class="token punctuation">.</span>function<span class="token punctuation">.</span>arguments<span class="token punctuation">)</span>

        <span class="token keyword">const</span> output <span class="token operator">=</span> <span class="token function">runBash</span><span class="token punctuation">(</span>args<span class="token punctuation">.</span>command<span class="token punctuation">)</span>

        toolResults<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          <span class="token literal-property property">role</span><span class="token operator">:</span> <span class="token string">&#39;tool&#39;</span><span class="token punctuation">,</span>
          <span class="token literal-property property">tool_call_id</span><span class="token operator">:</span> toolCall<span class="token punctuation">.</span>id<span class="token punctuation">,</span>
          <span class="token literal-property property">content</span><span class="token operator">:</span> output<span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 把工具结果喂回模型</span>
    messages<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token operator">...</span>toolResults<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="测试" tabindex="-1"><a class="header-anchor" href="#测试" aria-hidden="true">#</a> 测试</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> agentLoop <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./agent.js&#39;</span>

<span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">agentLoop</span><span class="token punctuation">(</span>
  <span class="token string">&#39;Create a file called hello.py that prints &quot;Hello, World!&quot;&#39;</span>
<span class="token punctuation">)</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>result<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="工具使用-tool-use" tabindex="-1"><a class="header-anchor" href="#工具使用-tool-use" aria-hidden="true">#</a> 工具使用 Tool Use</h2><p>工具调用会有一个问题，就是不能保证 bash 工具执行是否成功，并且 shell 命令的调用并不可控，所以需要对工具进行一些改造。</p><figure><img src="https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202603172113455.png" alt="tool 工具调用" tabindex="0" loading="lazy"><figcaption>tool 工具调用</figcaption></figure><p>dispatch map 本质是一个对象：<code>{ toolName: handlerFunction }</code>。</p><h3 id="dispatch-工作原理" tabindex="-1"><a class="header-anchor" href="#dispatch-工作原理" aria-hidden="true">#</a> dispatch 工作原理</h3><ol><li><p>每个工具有一个处理函数。路径沙箱防止逃逸工作区。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> path <span class="token keyword">from</span> <span class="token string">&#39;path&#39;</span>
<span class="token keyword">import</span> fs <span class="token keyword">from</span> <span class="token string">&#39;fs/promises&#39;</span>

<span class="token keyword">const</span> <span class="token constant">WORKDIR</span> <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>process<span class="token punctuation">.</span><span class="token function">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

<span class="token comment">// 防止路径逃逸</span>
<span class="token keyword">function</span> <span class="token function">safePath</span><span class="token punctuation">(</span><span class="token parameter">p</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> resolved <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token constant">WORKDIR</span><span class="token punctuation">,</span> p<span class="token punctuation">)</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>resolved<span class="token punctuation">.</span><span class="token function">startsWith</span><span class="token punctuation">(</span><span class="token constant">WORKDIR</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Path escapes workspace: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>p<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> resolved
<span class="token punctuation">}</span>

<span class="token comment">// 读取文件</span>
<span class="token keyword">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">runRead</span><span class="token punctuation">(</span><span class="token parameter">filePath<span class="token punctuation">,</span> limit <span class="token operator">=</span> <span class="token keyword">null</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> fullPath <span class="token operator">=</span> <span class="token function">safePath</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>

  <span class="token keyword">const</span> text <span class="token operator">=</span> <span class="token keyword">await</span> fs<span class="token punctuation">.</span><span class="token function">readFile</span><span class="token punctuation">(</span>fullPath<span class="token punctuation">,</span> <span class="token string">&#39;utf-8&#39;</span><span class="token punctuation">)</span>
  <span class="token keyword">let</span> lines <span class="token operator">=</span> text<span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">&#39;\\n&#39;</span><span class="token punctuation">)</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>limit <span class="token operator">&amp;&amp;</span> limit <span class="token operator">&lt;</span> lines<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    lines <span class="token operator">=</span> lines<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> limit<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> lines<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">&#39;\\n&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">50000</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>dispatch map 将工具名映射到处理函数。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// toolHandlers.js</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> runRead <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./tools/read.js&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> runWrite <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./tools/write.js&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> runEdit <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./tools/edit.js&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> runBash <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./tools/bash.js&#39;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token constant">TOOL_HANDLERS</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token function-variable function">bash</span><span class="token operator">:</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> command <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">runBash</span><span class="token punctuation">(</span>command<span class="token punctuation">)</span><span class="token punctuation">,</span>

  <span class="token function-variable function">read_file</span><span class="token operator">:</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> path<span class="token punctuation">,</span> limit <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">runRead</span><span class="token punctuation">(</span>path<span class="token punctuation">,</span> limit<span class="token punctuation">)</span><span class="token punctuation">,</span>

  <span class="token function-variable function">write_file</span><span class="token operator">:</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> path<span class="token punctuation">,</span> content <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">runWrite</span><span class="token punctuation">(</span>path<span class="token punctuation">,</span> content<span class="token punctuation">)</span><span class="token punctuation">,</span>

  <span class="token function-variable function">edit_file</span><span class="token operator">:</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> path<span class="token punctuation">,</span> old_text<span class="token punctuation">,</span> new_text <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span>
    <span class="token function">runEdit</span><span class="token punctuation">(</span>path<span class="token punctuation">,</span> old_text<span class="token punctuation">,</span> new_text<span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>加入到 Agent 循环体中(完全不变):</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> <span class="token constant">TOOL_HANDLERS</span> <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./toolHandlers.js&#39;</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">handleResponse</span><span class="token punctuation">(</span><span class="token parameter">response</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> results <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> block <span class="token keyword">of</span> response<span class="token punctuation">.</span>content<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>block<span class="token punctuation">.</span>type <span class="token operator">===</span> <span class="token string">&#39;tool_use&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> handler <span class="token operator">=</span> <span class="token constant">TOOL_HANDLERS</span><span class="token punctuation">[</span>block<span class="token punctuation">.</span>name<span class="token punctuation">]</span>

      <span class="token keyword">let</span> output
      <span class="token keyword">if</span> <span class="token punctuation">(</span>handler<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        output <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">handler</span><span class="token punctuation">(</span>block<span class="token punctuation">.</span>input<span class="token punctuation">)</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        output <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Unknown tool: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>block<span class="token punctuation">.</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span>
      <span class="token punctuation">}</span>

      results<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;tool_result&#39;</span><span class="token punctuation">,</span>
        <span class="token literal-property property">tool_use_id</span><span class="token operator">:</span> block<span class="token punctuation">.</span>id<span class="token punctuation">,</span>
        <span class="token literal-property property">content</span><span class="token operator">:</span> output<span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> results
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h2 id="增加-todowrite-提醒系统" tabindex="-1"><a class="header-anchor" href="#增加-todowrite-提醒系统" aria-hidden="true">#</a> 增加 ToDoWrite 提醒系统</h2><p>虽然基本的循环调用已经实现了，但是在多步骤任务中，大模型很容易丢失进度：</p><ol><li>重复已经完成的步骤</li><li>跳过关键步骤</li><li>越做越偏</li></ol><p>尤其是对话变长之后：</p><ol><li>工具返回结果不断堆积</li><li>上下文被挤满</li><li>系统提示逐渐失效</li></ol><p>因此需要引入一个带状态的 <strong>Todo 管理器（TodoManager）</strong>，强制模型按步骤执行。</p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token keyword">User</span> → LLM → Tools（包含 todo）
             ↑       ↓
         tool_result（含 todo 状态）
                ↓
        TodoManager（状态机）
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>核心机制：</p><ul><li>任务有状态（<code>pending</code> / <code>in_progress</code> / <code>done</code>）</li><li>同一时间只能有一个 <code>in_progress</code></li><li>如果模型太久不更新 <code>todo</code>，则自动提醒</li></ul><h3 id="todowrite-实现原理" tabindex="-1"><a class="header-anchor" href="#todowrite-实现原理" aria-hidden="true">#</a> ToDoWrite 实现原理</h3><ol><li><p>TodoManager 存储带状态的项目。同一时间只允许一个 in_progress。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">TodoManager</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 存储当前所有任务</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>items <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 更新 todo 列表
   * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">items</span> - LLM 传入的任务数组
   * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> 渲染后的文本（返回给 LLM）
   */</span>
  <span class="token function">update</span><span class="token punctuation">(</span><span class="token parameter">items</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 存放“清洗后的任务”</span>
    <span class="token keyword">const</span> validated <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

    <span class="token comment">// 统计当前有多少个任务是 in_progress</span>
    <span class="token keyword">let</span> inProgressCount <span class="token operator">=</span> <span class="token number">0</span>

    <span class="token comment">// 遍历 LLM 传入的任务</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> item <span class="token keyword">of</span> items<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 如果没写 status，默认是 pending</span>
      <span class="token keyword">const</span> status <span class="token operator">=</span> item<span class="token punctuation">.</span>status <span class="token operator">||</span> <span class="token string">&#39;pending&#39;</span>

      <span class="token comment">// 统计正在进行的任务数量</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>status <span class="token operator">===</span> <span class="token string">&#39;in_progress&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        inProgressCount<span class="token operator">++</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// 只保留我们允许的字段（防止 LLM 乱传）</span>
      validated<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">id</span><span class="token operator">:</span> item<span class="token punctuation">.</span>id<span class="token punctuation">,</span> <span class="token comment">// 任务 id</span>
        <span class="token literal-property property">text</span><span class="token operator">:</span> item<span class="token punctuation">.</span>text<span class="token punctuation">,</span> <span class="token comment">// 任务描述</span>
        <span class="token literal-property property">status</span><span class="token operator">:</span> status<span class="token punctuation">,</span> <span class="token comment">// 状态</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 核心约束：只能有一个任务在进行中</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>inProgressCount <span class="token operator">&gt;</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&#39;Only one task can be in_progress&#39;</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 保存当前状态</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>items <span class="token operator">=</span> validated

    <span class="token comment">// 返回渲染后的文本（给 LLM 看）</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 把任务渲染成文本
   * 例如：
   * [ ] task A
   * [&gt;] task B
   * [x] task C
   */</span>
  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>items
      <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">item</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">let</span> mark

        <span class="token comment">// 根据状态选择标记</span>
        <span class="token keyword">switch</span> <span class="token punctuation">(</span>item<span class="token punctuation">.</span>status<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">case</span> <span class="token string">&#39;done&#39;</span><span class="token operator">:</span>
            mark <span class="token operator">=</span> <span class="token string">&#39;[x]&#39;</span>
            <span class="token keyword">break</span>
          <span class="token keyword">case</span> <span class="token string">&#39;in_progress&#39;</span><span class="token operator">:</span>
            mark <span class="token operator">=</span> <span class="token string">&#39;[&gt;]&#39;</span>
            <span class="token keyword">break</span>
          <span class="token keyword">default</span><span class="token operator">:</span>
            mark <span class="token operator">=</span> <span class="token string">&#39;[ ]&#39;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>mark<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>item<span class="token punctuation">.</span>text<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">&#39;\\n&#39;</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>TODO 的工具注册</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token constant">TODO</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">TodoManager</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> <span class="token constant">TOOL_HANDLERS</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...其他工具</span>

  <span class="token function-variable function">todo</span><span class="token operator">:</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> items <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token constant">TODO</span><span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>items<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>Nag Reminder（自动提醒机制）。如果模型连续 3 轮没有调用 todo，系统自动插入提醒：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">injectReminder</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> roundsSinceTodo<span class="token punctuation">,</span> messages <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>roundsSinceTodo <span class="token operator">&gt;=</span> <span class="token number">3</span> <span class="token operator">&amp;&amp;</span> messages<span class="token punctuation">.</span>length <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> last <span class="token operator">=</span> messages<span class="token punctuation">[</span>messages<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>last<span class="token punctuation">.</span>role <span class="token operator">===</span> <span class="token string">&#39;user&#39;</span> <span class="token operator">&amp;&amp;</span> Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>last<span class="token punctuation">.</span>content<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      last<span class="token punctuation">.</span>content<span class="token punctuation">.</span><span class="token function">unshift</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;text&#39;</span><span class="token punctuation">,</span>
        <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">&#39;&lt;reminder&gt;Update your todos.&lt;/reminder&gt;&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h3 id="todowrite-基本实现" tabindex="-1"><a class="header-anchor" href="#todowrite-基本实现" aria-hidden="true">#</a> ToDoWrite 基本实现</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> roundsSinceTodo <span class="token operator">=</span> <span class="token number">0</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">agentLoop</span><span class="token punctuation">(</span><span class="token parameter">messages</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">injectReminder</span><span class="token punctuation">(</span><span class="token punctuation">{</span> roundsSinceTodo<span class="token punctuation">,</span> messages <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">callLLM</span><span class="token punctuation">(</span>messages<span class="token punctuation">)</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>response<span class="token punctuation">.</span>tool_call<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> name<span class="token punctuation">,</span> args <span class="token punctuation">}</span> <span class="token operator">=</span> response<span class="token punctuation">.</span>tool_call

      <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token constant">TOOL_HANDLERS</span><span class="token punctuation">[</span>name<span class="token punctuation">]</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span>

      messages<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">role</span><span class="token operator">:</span> <span class="token string">&#39;tool&#39;</span><span class="token punctuation">,</span>
        <span class="token literal-property property">content</span><span class="token operator">:</span> result<span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span>name <span class="token operator">===</span> <span class="token string">&#39;todo&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 当前轮执行了 todo，重置计数</span>
        roundsSinceTodo <span class="token operator">=</span> <span class="token number">0</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token comment">// 没有执行 todo，增加计数</span>
        roundsSinceTodo<span class="token operator">++</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token keyword">break</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="子智能体-subagents" tabindex="-1"><a class="header-anchor" href="#子智能体-subagents" aria-hidden="true">#</a> 子智能体 Subagents</h2><p>当智能体运行时间越长，messages 数组会越来越大。这时可以考虑引入子智能体（Subagent）来分担任务。</p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code>Parent agent                     Subagent
<span class="token operator">+</span><span class="token comment">------------------+             +------------------+</span>
<span class="token operator">|</span> messages<span class="token operator">=</span><span class="token punctuation">[</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">]</span>   <span class="token operator">|</span>             <span class="token operator">|</span> messages<span class="token operator">=</span><span class="token punctuation">[</span><span class="token punctuation">]</span>      <span class="token operator">|</span> ← 全新上下文
<span class="token operator">|</span>                  <span class="token operator">|</span>  dispatch   <span class="token operator">|</span>                  <span class="token operator">|</span>
<span class="token operator">|</span> tool: task       <span class="token operator">|</span> <span class="token comment">----------&gt; | while tool_use:  |</span>
<span class="token operator">|</span>   prompt<span class="token operator">=</span><span class="token string">&quot;...&quot;</span>   <span class="token operator">|</span>             <span class="token operator">|</span>   <span class="token keyword">call</span> tools     <span class="token operator">|</span>
<span class="token operator">|</span>                  <span class="token operator">|</span>  summary    <span class="token operator">|</span>   append results <span class="token operator">|</span>
<span class="token operator">|</span>   result<span class="token operator">=</span><span class="token string">&quot;...&quot;</span>   <span class="token operator">|</span> <span class="token operator">&lt;</span><span class="token comment">---------- | return last text |</span>
<span class="token operator">+</span><span class="token comment">------------------+             +------------------+</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>核心原理是:</p><ul><li>父智能体：保持干净上下文</li><li>子智能体：负责“脏活累活”</li><li>子智能体结束后：上下文直接丢弃</li></ul><h3 id="子智能体实现" tabindex="-1"><a class="header-anchor" href="#子智能体实现" aria-hidden="true">#</a> 子智能体实现</h3><ol><li><p>工具定义: 父智能体拥有一个额外的 <code>task</code> 工具，子智能体不能再生成子任务（防止递归）。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token constant">CHILD_TOOLS</span> <span class="token operator">=</span> <span class="token punctuation">[</span>
   <span class="token punctuation">{</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&quot;read_file&quot;</span><span class="token punctuation">,</span> <span class="token operator">...</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
   <span class="token punctuation">{</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&quot;run_command&quot;</span><span class="token punctuation">,</span> <span class="token operator">...</span> <span class="token punctuation">}</span>
 <span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">PARENT_TOOLS</span> <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token operator">...</span><span class="token constant">CHILD_TOOLS</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;task&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&#39;生成一个具有全新上下文的 Subagent 来完成一个子任务&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">input_schema</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;object&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">properties</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">prompt</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;string&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token literal-property property">required</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;prompt&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span>

 <span class="token comment">// 设计上：父智能体不能主动使用这些工具，存在是为了复用工具</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>agentType <span class="token operator">===</span> <span class="token string">&quot;parent&quot;</span> <span class="token operator">&amp;&amp;</span> tool <span class="token operator">!==</span> <span class="token string">&quot;task&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&quot;Parent cannot call this tool&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>子智能体执行逻辑: 子智能体以 <code>messages=[]</code> 启动, 运行自己的循环。只有最终文本返回给父智能体。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">runSubagent</span><span class="token punctuation">(</span><span class="token parameter">prompt</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> subMessages <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> <span class="token literal-property property">role</span><span class="token operator">:</span> <span class="token string">&#39;user&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">content</span><span class="token operator">:</span> prompt <span class="token punctuation">}</span><span class="token punctuation">]</span>

  <span class="token keyword">let</span> finalResponse <span class="token operator">=</span> <span class="token keyword">null</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">30</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// safety limit</span>
    <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> client<span class="token punctuation">.</span>messages<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">model</span><span class="token operator">:</span> <span class="token constant">MODEL</span><span class="token punctuation">,</span>
      <span class="token literal-property property">system</span><span class="token operator">:</span> <span class="token constant">SUBAGENT_SYSTEM</span><span class="token punctuation">,</span>
      <span class="token literal-property property">messages</span><span class="token operator">:</span> subMessages<span class="token punctuation">,</span>
      <span class="token literal-property property">tools</span><span class="token operator">:</span> <span class="token constant">CHILD_TOOLS</span><span class="token punctuation">,</span>
      <span class="token literal-property property">max_tokens</span><span class="token operator">:</span> <span class="token number">8000</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    finalResponse <span class="token operator">=</span> response

    <span class="token comment">// 保存 assistant 输出</span>
    subMessages<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">role</span><span class="token operator">:</span> <span class="token string">&#39;assistant&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">content</span><span class="token operator">:</span> response<span class="token punctuation">.</span>content<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token comment">// 如果没有工具调用，结束</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>response<span class="token punctuation">.</span>stop_reason <span class="token operator">!==</span> <span class="token string">&#39;tool_use&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">break</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">let</span> results <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> block <span class="token keyword">of</span> response<span class="token punctuation">.</span>content<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>block<span class="token punctuation">.</span>type <span class="token operator">===</span> <span class="token string">&#39;tool_use&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> handler <span class="token operator">=</span> <span class="token constant">TOOL_HANDLERS</span><span class="token punctuation">[</span>block<span class="token punctuation">.</span>name<span class="token punctuation">]</span>

        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>handler<span class="token punctuation">)</span> <span class="token keyword">continue</span>

        <span class="token keyword">const</span> output <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">handler</span><span class="token punctuation">(</span>block<span class="token punctuation">.</span>input<span class="token punctuation">)</span>

        results<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;tool_result&#39;</span><span class="token punctuation">,</span>
          <span class="token literal-property property">tool_use_id</span><span class="token operator">:</span> block<span class="token punctuation">.</span>id<span class="token punctuation">,</span>
          <span class="token literal-property property">content</span><span class="token operator">:</span> <span class="token function">String</span><span class="token punctuation">(</span>output<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">50000</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 把工具结果喂回模型</span>
    subMessages<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">role</span><span class="token operator">:</span> <span class="token string">&#39;user&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">content</span><span class="token operator">:</span> results<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 提取最终文本</span>
  <span class="token keyword">const</span> text <span class="token operator">=</span> <span class="token punctuation">(</span>finalResponse<span class="token punctuation">.</span>content <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">b</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> b<span class="token punctuation">.</span>type <span class="token operator">===</span> <span class="token string">&#39;text&#39;</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">b</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> b<span class="token punctuation">.</span>text<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">&#39;&#39;</span><span class="token punctuation">)</span>

  <span class="token keyword">return</span> text <span class="token operator">||</span> <span class="token string">&#39;(no summary)&#39;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h2 id="skills" tabindex="-1"><a class="header-anchor" href="#skills" aria-hidden="true">#</a> Skills</h2><p>工具过多后，智能体可能会不清楚每个工具的作用。即“需要用到什么知识，就加载什么知识”</p><p>而不是把所有知识塞进 <code>system prompt</code>，而是通过 <code>tool_result</code> 动态注入。</p><p>基本原理是采用两层结构，一层是系统提示词，始终存在；另一层是技能提示词，根据需要动态加载。</p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code>
System prompt <span class="token punctuation">(</span>Layer <span class="token number">1</span><span class="token punctuation">,</span>只放技能名称 <span class="token operator">+</span> 简短描述（低成本）<span class="token punctuation">)</span>:
<span class="token operator">+</span><span class="token comment">--------------------------------------+</span>
<span class="token operator">|</span> You are a coding agent<span class="token punctuation">.</span>              <span class="token operator">|</span>
<span class="token operator">|</span> Skills available:                    <span class="token operator">|</span>
<span class="token operator">|</span>   <span class="token operator">-</span> git: Git workflow helpers        <span class="token operator">|</span>
<span class="token operator">|</span>   <span class="token operator">-</span> test: Testing best practices     <span class="token operator">|</span>
<span class="token operator">+</span><span class="token comment">--------------------------------------+</span>


tool_result <span class="token punctuation">(</span>Layer <span class="token number">2</span><span class="token punctuation">,</span>当模型调用时加载<span class="token punctuation">)</span>:
<span class="token operator">+</span><span class="token comment">--------------------------------------+</span>
<span class="token operator">|</span> <span class="token operator">&lt;</span>skill name<span class="token operator">=</span><span class="token string">&quot;git&quot;</span><span class="token operator">&gt;</span>                   <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token keyword">Full</span> git workflow instructions<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>    <span class="token operator">|</span>
<span class="token operator">|</span> Step <span class="token number">1</span>: <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>                          <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token operator">&lt;</span><span class="token operator">/</span>skill<span class="token operator">&gt;</span>                             <span class="token operator">|</span>
<span class="token operator">+</span><span class="token comment">--------------------------------------+</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>skills 目录结构为:</p><div class="language-objectivec line-numbers-mode" data-ext="objectivec"><pre class="language-objectivec"><code>skills<span class="token operator">/</span>
  pdf<span class="token operator">/</span>
    SKILL<span class="token punctuation">.</span>md
  code<span class="token operator">-</span>review<span class="token operator">/</span>
    SKILL<span class="token punctuation">.</span>md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>每个 <code>SKILL.md</code>：</p><div class="language-markdown line-numbers-mode" data-ext="md"><pre class="language-markdown"><code><span class="token front-matter-block"><span class="token punctuation">---</span>
<span class="token front-matter yaml language-yaml"><span class="token key atrule">name</span><span class="token punctuation">:</span> code<span class="token punctuation">-</span>review
<span class="token key atrule">description</span><span class="token punctuation">:</span> Review code quality</span>
<span class="token punctuation">---</span></span>

<span class="token title important"><span class="token punctuation">#</span> Code Review Guide</span>

Step 1: ...
Step 2: ...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="skills-实现原理" tabindex="-1"><a class="header-anchor" href="#skills-实现原理" aria-hidden="true">#</a> Skills 实现原理</h3><p><code>SkillLoader</code> 递归扫描 <code>SKILL.md</code> 文件, 用目录名作为技能标识。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> fs <span class="token keyword">from</span> <span class="token string">&#39;fs&#39;</span>
<span class="token keyword">import</span> path <span class="token keyword">from</span> <span class="token string">&#39;path&#39;</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">SkillLoader</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">skillsDir</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>skills <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">loadSkills</span><span class="token punctuation">(</span>skillsDir<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token function">loadSkills</span><span class="token punctuation">(</span><span class="token parameter">dir</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token function-variable function">walk</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">currentPath</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> files <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token function">readdirSync</span><span class="token punctuation">(</span>currentPath<span class="token punctuation">)</span>

      <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> file <span class="token keyword">of</span> files<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> fullPath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>currentPath<span class="token punctuation">,</span> file<span class="token punctuation">)</span>
        <span class="token keyword">const</span> stat <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token function">statSync</span><span class="token punctuation">(</span>fullPath<span class="token punctuation">)</span>

        <span class="token keyword">if</span> <span class="token punctuation">(</span>stat<span class="token punctuation">.</span><span class="token function">isDirectory</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">walk</span><span class="token punctuation">(</span>fullPath<span class="token punctuation">)</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>file <span class="token operator">===</span> <span class="token string">&#39;SKILL.md&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">const</span> text <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token function">readFileSync</span><span class="token punctuation">(</span>fullPath<span class="token punctuation">,</span> <span class="token string">&#39;utf-8&#39;</span><span class="token punctuation">)</span>
          <span class="token keyword">const</span> <span class="token punctuation">{</span> meta<span class="token punctuation">,</span> body <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">parseFrontmatter</span><span class="token punctuation">(</span>text<span class="token punctuation">)</span>

          <span class="token keyword">const</span> name <span class="token operator">=</span> meta<span class="token punctuation">.</span>name <span class="token operator">||</span> path<span class="token punctuation">.</span><span class="token function">basename</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token function">dirname</span><span class="token punctuation">(</span>fullPath<span class="token punctuation">)</span><span class="token punctuation">)</span>

          <span class="token keyword">this</span><span class="token punctuation">.</span>skills<span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
            meta<span class="token punctuation">,</span>
            body<span class="token punctuation">,</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token function">walk</span><span class="token punctuation">(</span>dir<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token function">parseFrontmatter</span><span class="token punctuation">(</span><span class="token parameter">text</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> match <span class="token operator">=</span> text<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">^---\\n([\\s\\S]*?)\\n---\\n([\\s\\S]*)$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">)</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>match<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token punctuation">{</span> <span class="token literal-property property">meta</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token literal-property property">body</span><span class="token operator">:</span> text <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">const</span> yaml <span class="token operator">=</span> match<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>
    <span class="token keyword">const</span> body <span class="token operator">=</span> match<span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span>

    <span class="token keyword">const</span> meta <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    yaml<span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">&#39;\\n&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">line</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token punctuation">[</span>key<span class="token punctuation">,</span> <span class="token operator">...</span>rest<span class="token punctuation">]</span> <span class="token operator">=</span> line<span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">&#39;:&#39;</span><span class="token punctuation">)</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        meta<span class="token punctuation">[</span>key<span class="token punctuation">.</span><span class="token function">trim</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token operator">=</span> rest<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">&#39;:&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">trim</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token keyword">return</span> <span class="token punctuation">{</span> meta<span class="token punctuation">,</span> body <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token function">getDescriptions</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> Object<span class="token punctuation">.</span><span class="token function">entries</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>skills<span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">[</span>name<span class="token punctuation">,</span> skill<span class="token punctuation">]</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> desc <span class="token operator">=</span> skill<span class="token punctuation">.</span>meta<span class="token punctuation">.</span>description <span class="token operator">||</span> <span class="token string">&#39;&#39;</span>
        <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">  - </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>desc<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">&#39;\\n&#39;</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token function">getContent</span><span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> skill <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>skills<span class="token punctuation">[</span>name<span class="token punctuation">]</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>skill<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Error: Unknown skill &#39;</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&#39;.</span><span class="token template-punctuation string">\`</span></span>
    <span class="token punctuation">}</span>

    <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">&lt;skill name=&quot;</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&quot;&gt;{skill.body}&lt;/skill&gt;</span><span class="token template-punctuation string">\`</span></span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第一层，注入到系统提示词中:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> skillLoader <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SkillLoader</span><span class="token punctuation">(</span><span class="token string">&#39;./skills&#39;</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> <span class="token constant">SYSTEM</span> <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">You are a coding agent.
Skills available:
</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>skillLoader<span class="token punctuation">.</span><span class="token function">getDescriptions</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二层，其实也是一个 <code>dispatch map</code> 工具。 在工具调用时动态加载:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token constant">TOOL_HANDLERS</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token comment">// 其他工具...</span>

  <span class="token function-variable function">load_skill</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> name <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> skillLoader<span class="token punctuation">.</span><span class="token function">getContent</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="上下文压缩-context-compact" tabindex="-1"><a class="header-anchor" href="#上下文压缩-context-compact" aria-hidden="true">#</a> 上下文压缩 context compact</h2><p>由于 LLM 的上下文窗口是有限的，因此需要管理上下文，让 Agent 能长期运行而不崩。</p><p>这里采用三层上下文压缩机制，逐层增强：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">Every turn</span><span class="token punctuation">:</span>
+<span class="token punctuation">---</span><span class="token punctuation">---</span><span class="token punctuation">---</span><span class="token punctuation">---</span><span class="token punctuation">---</span><span class="token punctuation">---</span>+
<span class="token punctuation">|</span> Tool call result <span class="token punctuation">|</span>
+<span class="token punctuation">---</span><span class="token punctuation">---</span><span class="token punctuation">---</span><span class="token punctuation">---</span><span class="token punctuation">---</span><span class="token punctuation">---</span>+
        <span class="token punctuation">|</span>
        v
<span class="token punctuation">[</span><span class="token key atrule">Layer 1</span><span class="token punctuation">:</span> micro_compact<span class="token punctuation">]</span>        (每轮执行，静默)
  老的 tool_result → 占位符
        <span class="token punctuation">|</span>
        v
<span class="token punctuation">[</span><span class="token key atrule">Check</span><span class="token punctuation">:</span> tokens <span class="token punctuation">&gt;</span> 50000<span class="token punctuation">?</span><span class="token punctuation">]</span>
   <span class="token punctuation">|</span>               <span class="token punctuation">|</span>
   no              yes
   <span class="token punctuation">|</span>               <span class="token punctuation">|</span>
   v               v
continue    <span class="token punctuation">[</span><span class="token key atrule">Layer 2</span><span class="token punctuation">:</span> auto_compact<span class="token punctuation">]</span>
              保存完整对话
              LLM 生成摘要
              用 summary 替换上下文
                    <span class="token punctuation">|</span>
                    v
            <span class="token punctuation">[</span><span class="token key atrule">Layer 3</span><span class="token punctuation">:</span> manual compact<span class="token punctuation">]</span>
              模型主动调用 compact

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="第一层轻量压缩" tabindex="-1"><a class="header-anchor" href="#第一层轻量压缩" aria-hidden="true">#</a> 第一层轻量压缩</h3><p>目标是：清理旧的 <code>tool</code> 返回结果，节省 <code>token</code>，但不丢失关键信息。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">microCompact</span><span class="token punctuation">(</span><span class="token parameter">messages<span class="token punctuation">,</span> keepRecent <span class="token operator">=</span> <span class="token number">3</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> toolResults <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

  messages<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">msg<span class="token punctuation">,</span> i</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>msg<span class="token punctuation">.</span>role <span class="token operator">===</span> <span class="token string">&#39;user&#39;</span> <span class="token operator">&amp;&amp;</span> Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>msg<span class="token punctuation">.</span>content<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      msg<span class="token punctuation">.</span>content<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">part<span class="token punctuation">,</span> j</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>part<span class="token operator">?.</span>type <span class="token operator">===</span> <span class="token string">&#39;tool_result&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          toolResults<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span> i<span class="token punctuation">,</span> j<span class="token punctuation">,</span> part <span class="token punctuation">}</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>toolResults<span class="token punctuation">.</span>length <span class="token operator">&lt;=</span> keepRecent<span class="token punctuation">)</span> <span class="token keyword">return</span> messages

  <span class="token comment">// 压缩较旧的 tool result</span>
  <span class="token keyword">const</span> toCompact <span class="token operator">=</span> toolResults<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token operator">-</span>keepRecent<span class="token punctuation">)</span>

  toCompact<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> part <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> content <span class="token operator">=</span> part<span class="token punctuation">.</span>content <span class="token operator">||</span> <span class="token string">&#39;&#39;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>content<span class="token punctuation">.</span>length <span class="token operator">&gt;</span> <span class="token number">100</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> toolName <span class="token operator">=</span> part<span class="token punctuation">.</span>tool_name <span class="token operator">||</span> <span class="token string">&#39;tool&#39;</span>
      part<span class="token punctuation">.</span>content <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">[Previous: used </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>toolName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">]</span><span class="token template-punctuation string">\`</span></span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token keyword">return</span> messages
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="第二层自动压缩" tabindex="-1"><a class="header-anchor" href="#第二层自动压缩" aria-hidden="true">#</a> 第二层自动压缩</h3><p>当 token 超过阈值时，自动调用 LLM 生成摘要(summary)，替换上下文。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> fs <span class="token keyword">from</span> <span class="token string">&#39;fs/promises&#39;</span>
<span class="token keyword">import</span> path <span class="token keyword">from</span> <span class="token string">&#39;path&#39;</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">autoCompact</span><span class="token punctuation">(</span><span class="token parameter">messages<span class="token punctuation">,</span> client<span class="token punctuation">,</span> <span class="token constant">MODEL</span><span class="token punctuation">,</span> <span class="token constant">TRANSCRIPT_DIR</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 1. 保存 transcript</span>
  <span class="token keyword">const</span> fileName <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">transcript_</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.jsonl</span><span class="token template-punctuation string">\`</span></span>
  <span class="token keyword">const</span> filePath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token constant">TRANSCRIPT_DIR</span><span class="token punctuation">,</span> fileName<span class="token punctuation">)</span>

  <span class="token keyword">const</span> lines <span class="token operator">=</span> messages<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">msg</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">&#39;\\n&#39;</span><span class="token punctuation">)</span>
  <span class="token keyword">await</span> fs<span class="token punctuation">.</span><span class="token function">writeFile</span><span class="token punctuation">(</span>filePath<span class="token punctuation">,</span> lines<span class="token punctuation">,</span> <span class="token string">&#39;utf-8&#39;</span><span class="token punctuation">)</span>

  <span class="token comment">// 2. 调用 LLM 做摘要</span>
  <span class="token keyword">const</span> prompt <span class="token operator">=</span>
    <span class="token string">&#39;Summarize this conversation for continuity:\\n\\n&#39;</span> <span class="token operator">+</span>
    <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>messages<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">80000</span><span class="token punctuation">)</span>

  <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> client<span class="token punctuation">.</span>messages<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">model</span><span class="token operator">:</span> <span class="token constant">MODEL</span><span class="token punctuation">,</span>
    <span class="token literal-property property">messages</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> <span class="token literal-property property">role</span><span class="token operator">:</span> <span class="token string">&#39;user&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">content</span><span class="token operator">:</span> prompt <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token literal-property property">max_tokens</span><span class="token operator">:</span> <span class="token number">2000</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token keyword">const</span> summary <span class="token operator">=</span> response<span class="token punctuation">.</span>content<span class="token operator">?.</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token operator">?.</span>text <span class="token operator">||</span> <span class="token string">&#39;Summary unavailable&#39;</span>

  <span class="token comment">// 3. 替换上下文</span>
  <span class="token keyword">return</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token literal-property property">role</span><span class="token operator">:</span> <span class="token string">&#39;user&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">content</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">[Compressed]\\n\\n</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>summary<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
      <span class="token literal-property property">role</span><span class="token operator">:</span> <span class="token string">&#39;assistant&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">content</span><span class="token operator">:</span> <span class="token string">&#39;Understood. Continuing.&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="第三层手动压缩" tabindex="-1"><a class="header-anchor" href="#第三层手动压缩" aria-hidden="true">#</a> 第三层手动压缩</h3><p>主动优化，由模型“主动决定”触发压缩，适用于模型认为需要压缩但又不满足自动压缩条件的情况。</p><p>例如，当模型“感觉上下文开始混乱”或者即将执行复杂任务前, 可以主动调用 <code>manual_compact</code> 工具来压缩上下文。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">manualCompact</span><span class="token punctuation">(</span><span class="token parameter">messages<span class="token punctuation">,</span> client<span class="token punctuation">,</span> <span class="token constant">MODEL</span><span class="token punctuation">,</span> <span class="token constant">TRANSCRIPT_DIR</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">await</span> <span class="token function">autoCompact</span><span class="token punctuation">(</span>messages<span class="token punctuation">,</span> client<span class="token punctuation">,</span> <span class="token constant">MODEL</span><span class="token punctuation">,</span> <span class="token constant">TRANSCRIPT_DIR</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="三层压缩整合进-agent-主循环" tabindex="-1"><a class="header-anchor" href="#三层压缩整合进-agent-主循环" aria-hidden="true">#</a> 三层压缩整合进 Agent 主循环</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">agentLoop</span><span class="token punctuation">(</span><span class="token parameter">messages<span class="token punctuation">,</span> client<span class="token punctuation">,</span> config</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> <span class="token constant">MODEL</span><span class="token punctuation">,</span> <span class="token constant">THRESHOLD</span> <span class="token operator">=</span> <span class="token number">50000</span><span class="token punctuation">,</span> <span class="token constant">TRANSCRIPT_DIR</span> <span class="token punctuation">}</span> <span class="token operator">=</span> config

  <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Layer 1: 每轮压缩</span>
    <span class="token function">microCompact</span><span class="token punctuation">(</span>messages<span class="token punctuation">)</span>

    <span class="token comment">// Layer 2: 自动压缩</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">estimateTokens</span><span class="token punctuation">(</span>messages<span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token constant">THRESHOLD</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> newMessages <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">autoCompact</span><span class="token punctuation">(</span>
        messages<span class="token punctuation">,</span>
        client<span class="token punctuation">,</span>
        <span class="token constant">MODEL</span><span class="token punctuation">,</span>
        <span class="token constant">TRANSCRIPT_DIR</span>
      <span class="token punctuation">)</span>
      messages<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> messages<span class="token punctuation">.</span>length<span class="token punctuation">,</span> <span class="token operator">...</span>newMessages<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 调用 LLM</span>
    <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> client<span class="token punctuation">.</span>messages<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">model</span><span class="token operator">:</span> <span class="token constant">MODEL</span><span class="token punctuation">,</span>
      messages<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token comment">// TODO: 工具执行逻辑</span>
    <span class="token comment">// const toolUsed = ...</span>

    <span class="token comment">// Layer 3: 手动触发</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>response<span class="token operator">?.</span>needs_compact<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> newMessages <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">manualCompact</span><span class="token punctuation">(</span>
        messages<span class="token punctuation">,</span>
        client<span class="token punctuation">,</span>
        <span class="token constant">MODEL</span><span class="token punctuation">,</span>
        <span class="token constant">TRANSCRIPT_DIR</span>
      <span class="token punctuation">)</span>
      messages<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> messages<span class="token punctuation">.</span>length<span class="token punctuation">,</span> <span class="token operator">...</span>newMessages<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    messages<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="任务系统-task-system" tabindex="-1"><a class="header-anchor" href="#任务系统-task-system" aria-hidden="true">#</a> 任务系统 Task System</h2><p>此前的 TodoManager 只能管理单一维度的任务状态，无法处理复杂的多维度任务关系。真实的任务可能是:</p><ul><li>B 依赖 A</li><li>C 和 D 可以并行</li><li>E 依赖 C + D</li></ul><p>解决方案是升级为任务图（Task Graph / DAG）+ 磁盘持久化。</p><p>每个任务就是一个 JSON 文件：</p><div class="language-pgsql line-numbers-mode" data-ext="pgsql"><pre class="language-pgsql"><code>.tasks/
  task_1.json
  task_2.json
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>任务的字段结构可为:</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token comment">// 任务 ID</span>
  <span class="token property">&quot;subject&quot;</span><span class="token operator">:</span> <span class="token string">&quot;task name&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 任务名称</span>
  <span class="token property">&quot;status&quot;</span><span class="token operator">:</span> <span class="token string">&quot;pending&quot;</span><span class="token punctuation">,</span> <span class="token comment">// pending / in_progress / done</span>
  <span class="token property">&quot;blockedBy&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token comment">// 依赖的任务 ID 列表</span>
  <span class="token property">&quot;blocks&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token comment">// 被哪些任务依赖的 ID 列表</span>
  <span class="token property">&quot;owner&quot;</span><span class="token operator">:</span> <span class="token string">&quot;&quot;</span> <span class="token comment">// 负责这个任务的智能体（如果有多个智能体）</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="重构任务管理" tabindex="-1"><a class="header-anchor" href="#重构任务管理" aria-hidden="true">#</a> 重构任务管理</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> promises <span class="token keyword">as</span> fs <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;fs&#39;</span>
<span class="token keyword">import</span> path <span class="token keyword">from</span> <span class="token string">&#39;path&#39;</span>

<span class="token comment">// 任务管理器：负责任务的创建、读取、存储（基于文件系统）</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">TaskManager</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">tasksDir</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 任务存储目录（例如 ./.tasks）</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>dir <span class="token operator">=</span> tasksDir
  <span class="token punctuation">}</span>

  <span class="token comment">// 初始化任务系统（创建目录 + 计算下一个任务 ID）</span>
  <span class="token keyword">async</span> <span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// recursive: true → 目录不存在时自动创建</span>
    <span class="token keyword">await</span> fs<span class="token punctuation">.</span><span class="token function">mkdir</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>dir<span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">recursive</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token comment">// nextId = 当前最大 id + 1（避免重复）</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>nextId <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_maxId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 扫描目录，找出当前最大的 task id</span>
  <span class="token keyword">async</span> <span class="token function">_maxId</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 如果目录不存在，返回空数组（避免报错）</span>
    <span class="token keyword">const</span> files <span class="token operator">=</span> <span class="token keyword">await</span> fs<span class="token punctuation">.</span><span class="token function">readdir</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>dir<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>

    <span class="token keyword">const</span> ids <span class="token operator">=</span> files
      <span class="token comment">// 匹配 task_1.json 这种格式</span>
      <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">f</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> f<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">task_(\\d+)\\.json</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">)</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>Boolean<span class="token punctuation">)</span>
      <span class="token comment">// 提取数字 id</span>
      <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">m</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">parseInt</span><span class="token punctuation">(</span>m<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

    <span class="token comment">// 如果没有任务，返回 0</span>
    <span class="token keyword">return</span> ids<span class="token punctuation">.</span>length <span class="token operator">?</span> Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span><span class="token operator">...</span>ids<span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token number">0</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 根据 id 生成文件路径</span>
  <span class="token function">_filePath</span><span class="token punctuation">(</span><span class="token parameter">id</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>dir<span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">task_</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>id<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.json</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 保存任务到磁盘（覆盖写）</span>
  <span class="token keyword">async</span> <span class="token function">_save</span><span class="token punctuation">(</span><span class="token parameter">task</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">await</span> fs<span class="token punctuation">.</span><span class="token function">writeFile</span><span class="token punctuation">(</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_filePath</span><span class="token punctuation">(</span>task<span class="token punctuation">.</span>id<span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>task<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span> <span class="token comment">// 美化 JSON，方便调试</span>
    <span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 从磁盘读取任务</span>
  <span class="token keyword">async</span> <span class="token function">_load</span><span class="token punctuation">(</span><span class="token parameter">id</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> content <span class="token operator">=</span> <span class="token keyword">await</span> fs<span class="token punctuation">.</span><span class="token function">readFile</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_filePath</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">&#39;utf-8&#39;</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span>content<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 创建新任务</span>
  <span class="token keyword">async</span> <span class="token function">create</span><span class="token punctuation">(</span>subject<span class="token punctuation">,</span> description <span class="token operator">=</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> task <span class="token operator">=</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>nextId<span class="token punctuation">,</span>
      subject<span class="token punctuation">,</span>
      description<span class="token punctuation">,</span>

      <span class="token comment">// 初始状态：待执行</span>
      <span class="token literal-property property">status</span><span class="token operator">:</span> <span class="token string">&#39;pending&#39;</span><span class="token punctuation">,</span>

      <span class="token comment">// 依赖当前任务的前置任务（谁挡着我）</span>
      <span class="token literal-property property">blockedBy</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>

      <span class="token comment">// 当前任务完成后会解锁谁（我挡着谁）</span>
      <span class="token literal-property property">blocks</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>

      <span class="token comment">// 预留字段（未来多 agent 用）</span>
      <span class="token literal-property property">owner</span><span class="token operator">:</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_save</span><span class="token punctuation">(</span>task<span class="token punctuation">)</span>

    <span class="token comment">// 自增 id，保证唯一性</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>nextId <span class="token operator">+=</span> <span class="token number">1</span>

    <span class="token keyword">return</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>task<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当任务完成时，移除其他任务中的依赖，并更新转态：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 清理依赖关系：当某个任务完成时调用</span>
<span class="token keyword">async</span> <span class="token function">_clearDependency</span><span class="token punctuation">(</span><span class="token parameter">completedId</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> files <span class="token operator">=</span> <span class="token keyword">await</span> fs<span class="token punctuation">.</span><span class="token function">readdir</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>dir<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> file <span class="token keyword">of</span> files<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 只处理任务文件</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>file<span class="token punctuation">.</span><span class="token function">startsWith</span><span class="token punctuation">(</span><span class="token string">&quot;task_&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">continue</span><span class="token punctuation">;</span>

    <span class="token keyword">const</span> fullPath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>dir<span class="token punctuation">,</span> file<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> task <span class="token operator">=</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span><span class="token keyword">await</span> fs<span class="token punctuation">.</span><span class="token function">readFile</span><span class="token punctuation">(</span>fullPath<span class="token punctuation">,</span> <span class="token string">&quot;utf-8&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 如果这个任务依赖已完成的任务</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>task<span class="token punctuation">.</span>blockedBy<span class="token operator">?.</span><span class="token function">includes</span><span class="token punctuation">(</span>completedId<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 从依赖列表中移除 → 表示“解锁”</span>
      task<span class="token punctuation">.</span>blockedBy <span class="token operator">=</span> task<span class="token punctuation">.</span>blockedBy<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token parameter">id</span> <span class="token operator">=&gt;</span> id <span class="token operator">!==</span> completedId<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token comment">// 保存更新后的任务</span>
      <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_save</span><span class="token punctuation">(</span>task<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>


<span class="token comment">// 更新任务：状态 + 依赖关系</span>
<span class="token keyword">async</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token parameter">taskId<span class="token punctuation">,</span> <span class="token punctuation">{</span> status<span class="token punctuation">,</span> addBlockedBy<span class="token punctuation">,</span> addBlocks <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> task <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_load</span><span class="token punctuation">(</span>taskId<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// ===== 状态更新 =====</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>status<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    task<span class="token punctuation">.</span>status <span class="token operator">=</span> status<span class="token punctuation">;</span>

    <span class="token comment">// 如果任务完成 → 自动解锁后续任务</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>status <span class="token operator">===</span> <span class="token string">&quot;completed&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_clearDependency</span><span class="token punctuation">(</span>taskId<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// ===== 添加“被谁阻塞” =====</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>addBlockedBy<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 注意：这里没有去重，调用方需要保证合理性</span>
    task<span class="token punctuation">.</span>blockedBy<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token operator">...</span>addBlockedBy<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// ===== 添加“阻塞谁” =====</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>addBlocks<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    task<span class="token punctuation">.</span>blocks<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token operator">...</span>addBlocks<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_save</span><span class="token punctuation">(</span>task<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>task<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>加入到工具调用中：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 初始化全局任务管理器</span>
<span class="token keyword">const</span> <span class="token constant">TASKS</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">TaskManager</span><span class="token punctuation">(</span><span class="token string">&quot;./.tasks&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">await</span> <span class="token constant">TASKS</span><span class="token punctuation">.</span><span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 工具分发：给 agent 调用</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token constant">TOOL_HANDLERS</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token comment">// 创建任务</span>
  <span class="token function-variable function">task_create</span><span class="token operator">:</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> subject <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span>
    <span class="token constant">TASKS</span><span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>subject<span class="token punctuation">)</span><span class="token punctuation">,</span>

  <span class="token comment">// 更新任务（主要用于改状态）</span>
  <span class="token function-variable function">task_update</span><span class="token operator">:</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> task_id<span class="token punctuation">,</span> status <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span>
    <span class="token constant">TASKS</span><span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>task_id<span class="token punctuation">,</span> <span class="token punctuation">{</span> status <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>

  <span class="token comment">// 获取所有任务（用于构建任务图）</span>
  <span class="token function-variable function">task_list</span><span class="token operator">:</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span>
    <span class="token constant">TASKS</span><span class="token punctuation">.</span><span class="token function">listAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>

  <span class="token comment">// 获取单个任务详情</span>
  <span class="token function-variable function">task_get</span><span class="token operator">:</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> task_id <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span>
    <span class="token constant">TASKS</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>task_id<span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>


<span class="token comment">// 列出所有任务（读取整个任务目录）</span>
<span class="token keyword">async</span> <span class="token function">listAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> files <span class="token operator">=</span> <span class="token keyword">await</span> fs<span class="token punctuation">.</span><span class="token function">readdir</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>dir<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> tasks <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> file <span class="token keyword">of</span> files<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 只处理 task_*.json 文件</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>file<span class="token punctuation">.</span><span class="token function">startsWith</span><span class="token punctuation">(</span><span class="token string">&quot;task_&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">continue</span><span class="token punctuation">;</span>

    <span class="token keyword">const</span> task <span class="token operator">=</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span>
      <span class="token keyword">await</span> fs<span class="token punctuation">.</span><span class="token function">readFile</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>dir<span class="token punctuation">,</span> file<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">&quot;utf-8&quot;</span><span class="token punctuation">)</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>

    tasks<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>task<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> tasks<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 获取单个任务</span>
<span class="token keyword">async</span> <span class="token function">get</span><span class="token punctuation">(</span>taskId<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_load</span><span class="token punctuation">(</span>taskId<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,85),i=[l];function u(r,k){return o(),c("div",null,i)}const v=n(p,[["render",u],["__file","claudeCode.html.vue"]]);export{v as default};
