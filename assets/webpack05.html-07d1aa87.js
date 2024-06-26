import{_ as n,X as s,Y as a,$ as e}from"./framework-5dd7fabc.js";const o={},p=e,t=s,c=a,i=p(`<h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> 前言</h2><p>首先，我们来看我们在运行 <code>npm run build</code> 或者 <code>npm run watch</code> 时的实际代码是什么？在 <code>package.json</code> 中：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token property">&quot;scripts&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token property">&quot;build&quot;</span><span class="token operator">:</span> <span class="token string">&quot;webpack --mode=production --node-env=production&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;build:dev&quot;</span><span class="token operator">:</span> <span class="token string">&quot;webpack --mode=development&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;build:prod&quot;</span><span class="token operator">:</span> <span class="token string">&quot;webpack --mode=production --node-env=production&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;watch&quot;</span><span class="token operator">:</span> <span class="token string">&quot;webpack --watch&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;serve&quot;</span><span class="token operator">:</span> <span class="token string">&quot;webpack serve&quot;</span><span class="token punctuation">,</span>

  <span class="token property">&quot;myBuild&quot;</span><span class="token operator">:</span> <span class="token string">&quot;webpack --config ./config/comm.config.js --env production&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;myServe&quot;</span><span class="token operator">:</span> <span class="token string">&quot;webpack serve --config ./config/comm.config.js --env development&quot;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面有俩种，一种是 <code>&quot;webpack --node-env=production&quot;</code> 一种是自定义的 <code>&quot;webpack --env production&quot;</code> 。此外，自定义的 <code>myBuild</code> 传递了参数 <code>--config</code> ，这样不再读取默认的 <code>webpack.config.js</code> 配置文件，而是读取自定义的通用配置。</p><p>俩个都是传递的环境参数，区别在于 <code>env.production</code>和<code>p<wbr>rocess.env.NODE_ENV</code>都是用于指定当前 Webpack 构建的环境变量，但它们有不同的作用。</p><p><code>env.production</code>是在 Webpack 配置文件中定义的一个自定义环境变量，用于指示当前是否处于生产环境。接收的是 <code>--env xxx</code> 传递过来的参数。</p><p><code>p<wbr>rocess.env.NODE_ENV</code>是一个 Node.js 环境变量，通常用于指示当前正在运行的应用程序的环境（例如 development 或 production ）。可以直接在 js 中获取。</p><p>在 Webpack 配置文件中，通常会根据<code>p<wbr>rocess.env.NODE_ENV</code>的值来进行不同的操作，例如在生产环境下启用代码压缩等优化。因此，<code>env.production</code>和<code>p<wbr>rocess.env.NODE_ENV</code>都可以用于指定当前 Webpack 构建的环境，但它们的作用略有不同。</p><p>现在， 修改一下 <code>webpack.config.js</code> 的配置：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// webpack.config.js</span>

<span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;path&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> HtmlWebpackPlugin <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;html-webpack-plugin&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> WorkboxWebpackPlugin <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;workbox-webpack-plugin&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> HtmlMinimizerPlugin <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;html-minimizer-webpack-plugin&#39;</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> isProduction <span class="token operator">=</span> process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">NODE_ENV</span> <span class="token operator">==</span> <span class="token string">&#39;production&#39;</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;node 环境: &#39;</span><span class="token punctuation">,</span> process<span class="token punctuation">.</span>env<span class="token punctuation">)</span>

<span class="token keyword">const</span> config <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
<span class="token punctuation">}</span>

module<span class="token punctuation">.</span><span class="token function-variable function">exports</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">envParams</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;webpack 自定义的环境变量 env: &#39;</span><span class="token punctuation">,</span> envParams<span class="token punctuation">)</span>

  <span class="token comment">// 其它设置 ....</span>
  <span class="token keyword">return</span> config
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面可以看到，<code>module.exports</code> 可以写成一个函数形式，此时 <code>webpack.config.js</code> 便可以接收相应的参数 <strong>envParams</strong> 。</p><p>再运行下列代码：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: npx webpack <span class="token parameter variable">--watch</span> --node-env<span class="token operator">=</span>prod <span class="token parameter variable">--env</span><span class="token operator">=</span>production <span class="token parameter variable">--env</span><span class="token operator">=</span>someString
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>控制台会打印如下结果（部分已省略）：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">node</span> 环境，直接获取:  <span class="token punctuation">{</span>
  NVM_INC: <span class="token string">&#39;/Users/huy/.nvm/versions/node/v16.19.1/include/node&#39;</span>,
  <span class="token punctuation">..</span><span class="token punctuation">..</span>
  NODE_ENV: <span class="token string">&#39;prod&#39;</span>,
<span class="token punctuation">}</span>

webpack 自定义的环境变量 env:  <span class="token punctuation">{</span> WEBPACK_WATCH: true, production: true, someString: <span class="token boolean">true</span> <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看出，通过 “<code>--node-env</code>” 传递的参数，是直接定义到 node 环境变量上，可以通过 <code>p<wbr>rocess.env.NODE_ENV</code> 获取（注意！此参数不可随意填写）。</p><p>而通过 <code>--env</code> 传递的参数，最终落到了 webpack 中，并会以对象的形式传递回来。此外需要注意的是传递的参数是以 <code>{ Params: true }</code> 的键值对形式返回，所以如果只需检测是否有该属性即可。</p><h2 id="配置分离" tabindex="-1"><a class="header-anchor" href="#配置分离" aria-hidden="true">#</a> 配置分离</h2><p>了解上述传递参数的方法后，便可以自定义 <code>package.json</code> 中的指令，并给不同的指令配置相应的代码。</p><p>要分离 webpack.config 的相关配置，可以选择保留 <code>webpack.config.js</code>，将其作为通用配置入口，也可以自定义一个 <code>common.config.js</code> 作为通用配置文件，只需在最终运行时将配置文件指定为此文件即可。这里，选择不删除默认 <code>webpack.config.js</code> 文件，并选择 webpack 传参方式。</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code># 目录形式
├── ....
├── dev.config.js
├── prod.config.js
└── webpack.config.js
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code># package.json

<span class="token property">&quot;scripts&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token property">&quot;build&quot;</span><span class="token operator">:</span> <span class="token string">&quot;webpack  --env production&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;serve&quot;</span><span class="token operator">:</span> <span class="token string">&quot;webpack serve --env development&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;ts-check&quot;</span><span class="token operator">:</span> <span class="token string">&quot;tsc --noEmit&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;ts-check-watch&quot;</span><span class="token operator">:</span> <span class="token string">&quot;tsc --noEmit --watch&quot;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过上述配置可在 <code>webpack.config.js</code> 中，获取到不同的环境配置。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// webpack.config.js</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> merge <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;webpack-merge&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> devConfig <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;./dev.config&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> prodConfig <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;./prod.config&#39;</span><span class="token punctuation">)</span>

<span class="token doc-comment comment">/**
 * 抽取开发和生产环境的配置文件
 * 1.将配置文件导出的是一个函数, 而不是一个对象
 * 2.从上向下查看所有的配置属性应该属于哪一个文件
 * 3.针对单独的配置文件进行定义化
 * * css加载: 使用的不同的loader可以根据isProduction动态获取
 */</span>
<span class="token keyword">const</span> <span class="token function-variable function">getCommonConfig</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">isProduction</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    <span class="token comment">// 此对象为 commonConfig 公共配置</span>
    <span class="token literal-property property">entry</span><span class="token operator">:</span> <span class="token string">&#39;./src/main.js&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">output</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">// ...</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// ...</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// webpack 导出一个函数</span>
module<span class="token punctuation">.</span><span class="token function-variable function">exports</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">env</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> isProduction <span class="token operator">=</span> env<span class="token punctuation">.</span>production <span class="token comment">// 返回值为 Boolean</span>
  <span class="token keyword">let</span> mergeConfig <span class="token operator">=</span> isProduction <span class="token operator">?</span> prodConfig <span class="token operator">:</span> devConfig
  <span class="token keyword">return</span> <span class="token function">merge</span><span class="token punctuation">(</span><span class="token function">getCommonConfig</span><span class="token punctuation">(</span>isProduction<span class="token punctuation">)</span><span class="token punctuation">,</span> mergeConfig<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>依据 merge 函数，合并本地 <code>getCommonConfig()</code> 配置和不同环境下的特殊配置。</p>`,25),l=[i];function r(u,d){return t(),c("div",null,l)}const v=n(o,[["render",r],["__file","webpack05.html.vue"]]);export{v as default};
