import{_ as o,V as t,W as p,X as n,Y as s,Z as c,$ as a,F as i}from"./framework-2060dede.js";const l={},r=a(`<h1 id="react之项目实战" tabindex="-1"><a class="header-anchor" href="#react之项目实战" aria-hidden="true">#</a> React之项目实战</h1><h2 id="创建项目" tabindex="-1"><a class="header-anchor" href="#创建项目" aria-hidden="true">#</a> 创建项目</h2><p>创建一个新项目：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: npx create-react-app my-app
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>其中，<code>my-app</code> 是项目的名称。这个命令会自动创建一个基本的React项目，包括开发服务器，Webpack构建系统和初始文件结构。</p><h2 id="项目初始化预处理" tabindex="-1"><a class="header-anchor" href="#项目初始化预处理" aria-hidden="true">#</a> 项目初始化预处理</h2><p>项目初始化后，还需要进行一番预处理，首先是清除一些不需要的文件。</p><h3 id="安装依赖" tabindex="-1"><a class="header-anchor" href="#安装依赖" aria-hidden="true">#</a> 安装依赖</h3>`,8),u=a(`<li><p>样式重置</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 安装 normalize.css</span>
$: <span class="token function">npm</span> i normalize.css
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>在 <code>index.js</code> 中引入 <code>normalize</code> : <code>import &quot;normalize.css&quot;</code> 。</p><p>此外，还需要自定义重置一些样式，并一同将其引入：</p><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code><span class="token comment">// reset.less</span>
<span class="token selector">body, button, dd, dl, dt, form, h1, h2, h3, h4, h5, h6, hr, input, li, ol, p, pre, td, textarea, th, ul</span> <span class="token punctuation">{</span>
  <span class="token property">padding</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">margin</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">a</span> <span class="token punctuation">{</span>
  <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">@textColor</span><span class="token punctuation">;</span>
  <span class="token property">text-decoration</span><span class="token punctuation">:</span> none<span class="token punctuation">;</span>
<span class="token punctuation">}</span>


<span class="token selector">img</span> <span class="token punctuation">{</span>
  <span class="token property">vertical-align</span><span class="token punctuation">:</span> top<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">ul, li</span> <span class="token punctuation">{</span>
  <span class="token property">list-style</span><span class="token punctuation">:</span> none<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,1),d=a(`<p>配置 Webpack</p><p>首先介绍一些概念。Create React App (CRA) 是一种快速创建 React 应用程序的工具，它默认提供了一组预配置的 Webpack 和 Babel 配置，并且在开发和构建过程中自动处理大部分细节。然而，在某些情况下，您可能需要修改 CRA 的默认配置，以满足特定的需求。</p><p>以下是一些可以帮助您修改 CRA 配置的方法：</p><ol><li>使用 <code>.env</code> 文件：您可以使用 <code>.env</code> 文件设置环境变量来覆盖 CRA 的默认配置。例如，您可以将 <code>PUBLIC_URL</code> 变量设置为 CDN 或静态资源 URL，或设置其他变量以控制开发、构建和测试行为。</li><li>使用 <code>react-scripts eject</code> 命令：该命令会将 CRA 应用程序的所有配置文件暴露出来，并将其复制到应用程序根目录中。这样，您就可以手动编辑配置文件并对其进行更改。但是，执行此命令后，您将<strong>无法回退到 CRA 的默认配置</strong>，因此请确保在执行此操作之前备份您的代码。</li><li>使用 <code>craco</code>：<code>craco</code> 是 Create React App Configuration Override 的缩写，它允许您使用常规 JavaScript 模块来轻松地覆盖 CRA 配置。使用 <code>craco</code>，您可以添加新的 Babel 插件、Webpack 配置等，也可以扩展 CRA 的功能，例如添加 Less 或 Sass 支持、启用 TypeScript 等。</li></ol><p>需要注意的是，尽管 CRA 提供了许多默认配置和工具，但在修改配置时需要小心。错误的配置可能会导致构建失败或应用程序行为不稳定，因此请确保仔细测试您的应用程序并备份代码，以避免潜在的问题。</p><p>这里我们使用第三种方案，使用<code>craco</code>，因此先安装一下这个库（注意是安装时依赖）：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">npm</span> <span class="token function">install</span> @craco/craco <span class="token parameter variable">-D</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,7),v=n("code",null,"less",-1),k=n("code",null,"craco/less",-1),m=n("code",null,"@craco/craco@7。0",-1),b=n("code",null,"craco-less@alpha",-1),g={href:"https://github.com/DocSpring/craco-less/issues/102",target:"_blank",rel:"noopener noreferrer"},h=a(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token literal-property property">$</span><span class="token operator">:</span> npm i craco<span class="token operator">-</span>less@alpha <span class="token operator">-</span><span class="token constant">D</span>  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>而后，再在根目录</p><ol><li>创建 <code>craco.config.js</code> 文件：在应用程序的根目录中，创建一个名为 <code>craco.config.js</code> 的文件，并使用常规 JavaScript 模块来配置和扩展 CRA。</li></ol><p>例如，如果想添加 Less 支持、配置目录别名等，则可以将以下代码添加到 <code>craco.config.js</code> 文件中：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;path&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> CracoLessPlugin <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;craco-less&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">resolve</span> <span class="token operator">=</span> <span class="token parameter">pathname</span> <span class="token operator">=&gt;</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> pathname<span class="token punctuation">)</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token comment">// less</span>
  <span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token literal-property property">plugin</span><span class="token operator">:</span> CracoLessPlugin<span class="token punctuation">,</span>
      <span class="token literal-property property">options</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">lessLoaderOptions</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token literal-property property">lessOptions</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">modifyVars</span><span class="token operator">:</span> <span class="token punctuation">{</span>  <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token literal-property property">javascriptEnabled</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token comment">// webpack</span>
  <span class="token literal-property property">webpack</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">alias</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token string-property property">&quot;@&quot;</span><span class="token operator">:</span> <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">&quot;src&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">// 配置 ailas 根目录别名</span>
      <span class="token string-property property">&quot;components&quot;</span><span class="token operator">:</span> <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">&quot;src/components&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">// 组件目录别名</span>
      <span class="token string-property property">&quot;utils&quot;</span><span class="token operator">:</span> <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">&quot;src/utils&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">// 自定义工具目录别名</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面的代码中，我们导出了一个包含 <code>plugs</code> 和 <code>webpack</code>的对象模块。</p><p>但是，为了让上述配置生效还需做如下设置：在 <code>create-react-app</code> 的默认配置中，所有的脚本都是由 <code>react-scripts</code> 提供的。然而，如果您希望使用 <code>craco</code> 来扩展或自定义 CRA 的功能和配置，就需要将 <code>react-scripts</code> 替换为 <code>craco</code>。</p><p>具体来说，替换 <code>react-scripts</code> 为 <code>craco</code> 可以让您轻松地覆盖 CRA 的默认配置，并使用常规 JavaScript 模块来自定义和扩展 CRA 的功能。例如，您可以添加新的 Babel 插件、Webpack 配置等等。</p><p>另外，使用 <code>craco</code> 后，您需要向每个脚本添加 <code>craco</code> 前缀，以便在执行脚本时使用 <code>craco</code> 来代替原始的 <code>react-scripts</code>。这是因为 <code>craco</code> 不会自动替换 CRA 中的脚本，而是在您手动指定它们的情况下才会生效。</p><p>简单的讲就是修改 <code>package.json</code> 中的脚本：将 <code>react-scripts</code> 替换为 <code>craco</code>：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token property">&quot;scripts&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token property">&quot;start&quot;</span><span class="token operator">:</span> <span class="token string">&quot;craco start&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;build&quot;</span><span class="token operator">:</span> <span class="token string">&quot;craco build&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;test&quot;</span><span class="token operator">:</span> <span class="token string">&quot;craco test&quot;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如此，项目可以正常引用 <code>less</code> 文件了。</p>`,12),q=a(`<li><p>配置 <code>jsconfig.json</code> ：</p><p><code>jsconfig.json</code> 是一个用于配置 JavaScript 项目的文件，它是 TypeScript 的 <code>tsconfig.json</code> 文件的非 TypeScript 版本。它可以帮助您在没有使用 TypeScript 的情况下，提供一些类型检查和 IntelliSense 的优秀开发体验。</p><p><code>jsconfig.json</code> 允许您定义 JavaScript 项目中的基本配置，例如：</p><ul><li><code>compilerOptions</code>: 定义 JavaScript 编译器的选项，例如启用严格模式、指定 ECMAScript 版本等。 <ul><li><code>target</code>: 编译后的 JavaScript 代码应该针对哪个 ECMAScript 版本进行优化。</li><li><code>module</code>: 使用什么模块系统来组织生成的代码。</li><li><code>baseUrl</code>: 在解析非相对导入时使用的基本路径。</li><li><code>moduleResolution</code>: 指定如何解析模块导入语句。</li><li><code>paths</code>: 定义模块名称到模块路径映射的对象，以便在导入时可以简化路径。</li></ul></li><li><code>jsx</code>: 指定 JSX 代码的输出方式。</li><li><code>lib</code>: 要包含在编译过程中的库文件列表。</li></ul><p>通过这些配置，可以让编辑器更好地了解项目的代码，并提供更准确和有帮助的建议和错误检查。与 TypeScript 相比，<code>jsconfig.json</code> 不需要任何类型注释或类型文件，而是使用 JSDoc 格式的类型推断来实现类型检查。</p><p>需要注意的是，<code>jsconfig.json</code> 仅适用于支持 ES6 模块的代码，如果使用的是 CommonJS 模块，则需要将 <code>.js</code> 文件改为 <code>.cjs</code> 才能充分利用 <code>jsconfig.json</code> 中的配置。</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token comment">// jsconfig.json</span>
<span class="token punctuation">{</span>
  <span class="token property">&quot;compilerOptions&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;target&quot;</span><span class="token operator">:</span> <span class="token string">&quot;es5&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;module&quot;</span><span class="token operator">:</span> <span class="token string">&quot;esnext&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;baseUrl&quot;</span><span class="token operator">:</span> <span class="token string">&quot;./&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;moduleResolution&quot;</span><span class="token operator">:</span> <span class="token string">&quot;node&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;paths&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;@/*&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token string">&quot;src/*&quot;</span>
      <span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;jsx&quot;</span><span class="token operator">:</span> <span class="token string">&quot;preserve&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;lib&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token string">&quot;esnext&quot;</span><span class="token punctuation">,</span>
      <span class="token string">&quot;dom&quot;</span><span class="token punctuation">,</span>
      <span class="token string">&quot;dom.iterable&quot;</span><span class="token punctuation">,</span>
      <span class="token string">&quot;scripthost&quot;</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,1),y=a(`<h2 id="安装路由" tabindex="-1"><a class="header-anchor" href="#安装路由" aria-hidden="true">#</a> 安装路由</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 安装</span>
$: <span class="token function">npm</span> i react-router-dom
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function f(_,j){const e=i("ExternalLinkIcon");return t(),p("div",null,[r,n("ul",null,[u,n("li",null,[d,n("p",null,[s("若是用的 "),v,s(" 则还需安装 "),k,s(" 的库（需要注意的是 "),m,s(" 需要安装 "),b,s(" 的最新版本，可查看"),n("a",g,[s("原 Issue"),c(e)]),s(" ）：")]),h]),q]),y])}const C=o(l,[["render",f],["__file","React07.html.vue"]]);export{C as default};
