import{_ as n,X as s,Y as a,$ as e}from"./framework-5dd7fabc.js";const t={},p=e,c=s,o=a,i=p(`<h2 id="electron-介绍" tabindex="-1"><a class="header-anchor" href="#electron-介绍" aria-hidden="true">#</a> electron 介绍</h2><h2 id="electron-通信" tabindex="-1"><a class="header-anchor" href="#electron-通信" aria-hidden="true">#</a> electron 通信</h2><p>进程间通信（Inter-Process Communication，简称 IPC）是用于在至少两个进程或线程之间传输数据或信号。每个进程都有自己独立的系统资源，彼此隔离。为了实现不同进程之间的资源访问和协调工作，需要使用进程间通信。</p><p>在 Electron 中，无论是渲染进程给主进程发消息，还是主进程给渲染进程发消息，都是通过 IPC 机制实现的。此通信过程中随消息发送的 Json 对象会被序列化和反序列化，因此 Json 对象中包含的方法和原型链上的数据不会被传送。</p><ol><li><p>渲染进程向主进程发消息</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 渲染进程发送消息</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> ipcRenderer <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;electron&#39;</span><span class="token punctuation">)</span>
ipcRenderer<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token string">&#39;message&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;Hello from renderer process&#39;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 主进程接收消息</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> ipcMain <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;electron&#39;</span><span class="token punctuation">)</span>
ipcMain<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&#39;message&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">event<span class="token punctuation">,</span> arg</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token comment">// event 包含了 sender 属性，表示发送消息的渲染进程的 webContents 对象实例</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span> <span class="token comment">// Prints: &#39;Hello from renderer process&#39;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意点，若主进程中设置了多处监听同一管道代码，则渲染进程发送消息时，会触发所有监听该管道的代码；其次，上面的消息传递是异步的，若需要同步传递，则可以使用 <code>ipcRenderer.sendSync</code> 和 <code>ipcMain.onSync</code>。</p></li><li><p>主进程向渲染进程发消息</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 主进程发送消息</span>
win<span class="token punctuation">.</span>webContents<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token string">&#39;message&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;Hello from main process&#39;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 渲染进程接收消息</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> ipcRenderer <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;electron&#39;</span><span class="token punctuation">)</span>
ipcRenderer<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&#39;message&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">event<span class="token punctuation">,</span> arg</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span> <span class="token comment">// Prints: &#39;Hello from main process&#39;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>渲染进程之间消息传递</p><p>渲染进程之间传递消息，需要借助主进程作为中介，因为 Electron 的渲染进程之间是相互隔离的，无法直接通信。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 渲染进程A发送消息</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> ipcRenderer <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;electron&#39;</span><span class="token punctuation">)</span>
ipcRenderer<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token string">&#39;message&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;Hello from renderer process A&#39;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 主进程接收消息</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> ipcMain <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;electron&#39;</span><span class="token punctuation">)</span>
ipcMain<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&#39;message&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">event<span class="token punctuation">,</span> arg</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span> <span class="token comment">// Prints: &#39;Hello from renderer process A&#39;</span>
  winB<span class="token punctuation">.</span>webContent<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token string">&#39;message&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;Hello from main process&#39;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 渲染进程B接收消息</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> ipcRenderer <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;electron&#39;</span><span class="token punctuation">)</span>
ipcRenderer<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&#39;message&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">event<span class="token punctuation">,</span> arg</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span> <span class="token comment">// Prints: &#39;Hello from main process&#39;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然如果知道窗口 B 的 webContents 对象实例，也可以直接发送消息。利用 <code>sendTo</code> 方法。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 窗口 A 直接向窗口 B 发送消息</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> ipcRenderer <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;electron&#39;</span><span class="token punctuation">)</span>
ipcRenderer<span class="token punctuation">.</span><span class="token function">sendTo</span><span class="token punctuation">(</span>
  winB<span class="token punctuation">.</span>webContents<span class="token punctuation">.</span>id<span class="token punctuation">,</span>
  <span class="token string">&#39;message&#39;</span><span class="token punctuation">,</span>
  <span class="token string">&#39;Hello from renderer process A&#39;</span>
<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 窗口 B 接收消息</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> ipcRenderer <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;electron&#39;</span><span class="token punctuation">)</span>
ipcRenderer<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&#39;message&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">event<span class="token punctuation">,</span> arg</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span> <span class="token comment">// Prints: &#39;Hello from renderer process A&#39;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol>`,5),l=[i];function u(r,d){return c(),o("div",null,l)}const v=n(t,[["render",u],["__file","electron01.html.vue"]]);export{v as default};