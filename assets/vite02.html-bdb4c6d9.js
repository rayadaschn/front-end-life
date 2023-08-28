import{_ as p,Z as o,a0 as l,F as c,a1 as i,X as u,Y as r,$ as d}from"./framework-97fa2d96.js";const k={},n=o,s=l,v=c,t=i,a=d,m=u,b=r,g=n("p",null,[s('vite 生态里面有很多好用的插件，以托尼老师为例，开发出了很多以 "unplugin" 为代表的实用工具。该文简述其中俩款常用插件：'),n("code",null,"unplugin-auto-import/vite"),s(" 和 "),n("code",null,"unplugin-vue-components/vite"),s("。")],-1),f=n("p",null,"俩款插件的共同点都是按需自动导入。",-1),x=n("h2",{id:"unplugin-auto-import-vite",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#unplugin-auto-import-vite","aria-hidden":"true"},"#"),s(" unplugin-auto-import/vite")],-1),h={href:"https://github.com/antfu/unplugin-auto-import#configuration",target:"_blank",rel:"noopener noreferrer"},y=a(`<p>这个插件的作用是：根据需要自动导入 Vite，Webpack，Rspack，Rollup 和 esbuild API。支持 TypeScript。</p><p>来看个实例:</p><p>在 Vue3 开发中，有很多响应式 API 例如 ref 和 computed 等，在每个 vue 文件中，都需要导入方能使用：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> computed<span class="token punctuation">,</span> ref <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>

<span class="token keyword">const</span> count <span class="token operator">=</span> <span class="token function">ref</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> doubled <span class="token operator">=</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> count<span class="token punctuation">.</span>value <span class="token operator">*</span> <span class="token number">2</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是如果引入了插件<code>unplugin-auto-import/vite</code>后，就无需依次导入这些 API 了：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> count <span class="token operator">=</span> <span class="token function">ref</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> doubled <span class="token operator">=</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> count<span class="token punctuation">.</span>value <span class="token operator">*</span> <span class="token number">2</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>可以直接使用，而不会报错。</p><h3 id="安装使用" tabindex="-1"><a class="header-anchor" href="#安装使用" aria-hidden="true">#</a> 安装使用</h3><ol><li><p>安装: <code>npm i -D unplugin-auto-import</code></p></li><li><p>使用插件:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// vite.config.ts</span>
<span class="token keyword">import</span> AutoImport <span class="token keyword">from</span> <span class="token string">&#39;unplugin-auto-import/vite&#39;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token function">AutoImport</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token comment">/* options */</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><p>在这里面，我们需要在 options 里面对需要全局按需导入的 API 进行注册。 options 有很多配置，这里我们以最常见的进行介绍：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token function">autoImport</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  imports<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;vue&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;vue-router&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;pinia&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  dts<span class="token operator">:</span> <span class="token string">&#39;src/types/declaration-files/auto-import.d.ts&#39;</span><span class="token punctuation">,</span>
  eslintrc<span class="token operator">:</span> <span class="token punctuation">{</span>
    enabled<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    filepath<span class="token operator">:</span> <span class="token string">&#39;./.eslintrc-auto-import.json&#39;</span><span class="token punctuation">,</span>
    globalsPropValue<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,11),_=a(`<li><p>imports: imports 属性为全局按需导入的注册入口，以数组形式定义:</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>Options<span class="token punctuation">.</span>imports<span class="token operator">?</span><span class="token operator">:</span> Arrayable<span class="token operator">&lt;</span>ImportsMap <span class="token operator">|</span> <span class="token string">&quot;ahooks&quot;</span> <span class="token operator">|</span> <span class="token string">&quot;@vueuse/core&quot;</span> <span class="token operator">|</span> <span class="token string">&quot;@vueuse/math&quot;</span> <span class="token operator">|</span> <span class="token string">&quot;@vueuse/head&quot;</span> <span class="token operator">|</span> <span class="token string">&quot;mobx&quot;</span> <span class="token operator">|</span> <span class="token string">&quot;mobx-react-lite&quot;</span> <span class="token operator">|</span> <span class="token string">&quot;preact&quot;</span> <span class="token operator">|</span> <span class="token string">&quot;quasar&quot;</span> <span class="token operator">|</span> <span class="token string">&quot;react&quot;</span> <span class="token operator">|</span> <span class="token string">&quot;react-router&quot;</span> <span class="token operator">|</span> <span class="token string">&quot;react-router-dom&quot;</span> <span class="token operator">|</span> <span class="token operator">...</span> <span class="token number">27</span> more <span class="token operator">...</span> <span class="token operator">|</span> InlinePreset<span class="token operator">&gt;</span> <span class="token operator">|</span> <span class="token keyword">undefined</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>一般我们定义为: <code>imports: [&#39;vue&#39;, &#39;vue-router&#39;, &#39;pinia&#39;]</code> 即可，也可以自定义一些导入，但是可能会影响代码的可读性，所以，我们只对熟知的 API 进行导入。</p></li><li><p>dts：自动生成 <code>.d.ts</code> 的文件路径。若是我们引用了 ts，则该配置为必填项:</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>Options<span class="token punctuation">.</span>dts<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token builtin">boolean</span> <span class="token operator">|</span> <span class="token keyword">undefined</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>依据定义可知，该配置可显式的传入自动生成声明文件的路径；若是传 true 则在当前目录下自动生成；若是 false 则不自动生成。</p><p>我们这里给它固定的类型声明地址：<code>dts: &#39;src/types/declaration-files/auto-import.d.ts&#39;</code>。</p></li>`,2),q=n("code",null,".eslintrc-auto-import.json",-1),w={href:"https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals",target:"_blank",rel:"noopener noreferrer"},j=a(`<div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>Options<span class="token punctuation">.</span>eslintrc<span class="token operator">?</span><span class="token operator">:</span> ESLintrc <span class="token operator">|</span> <span class="token keyword">undefined</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>依据定义可知这里传入的是 eslint 的配置参数，我们自理定义为：启用该全局配置、生成 eslintrc 的文件地址。</p>`,2),V=a(`<h3 id="完整配置" tabindex="-1"><a class="header-anchor" href="#完整配置" aria-hidden="true">#</a> 完整配置</h3><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token function">AutoImport</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token comment">// 转换目标</span>
  include<span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\\.[tj]sx?$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span> <span class="token comment">// .ts, .tsx, .js, .jsx</span>
    <span class="token operator">/</span>\\<span class="token punctuation">.</span>vue$<span class="token operator">/</span><span class="token punctuation">,</span>
    <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\\.vue\\?vue</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span> <span class="token comment">// .vue</span>
    <span class="token operator">/</span>\\<span class="token punctuation">.</span>md$<span class="token operator">/</span><span class="token punctuation">,</span> <span class="token comment">// .md</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>

  <span class="token comment">// 全局按需导入注册</span>
  imports<span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token comment">// 预设自动导入类</span>
    <span class="token string">&#39;vue&#39;</span><span class="token punctuation">,</span>
    <span class="token string">&#39;vue-router&#39;</span><span class="token punctuation">,</span>
    <span class="token comment">// 自定义自动按需导入类</span>
    <span class="token punctuation">{</span>
      <span class="token string-property property">&#39;@vueuse/core&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token comment">// 导入名</span>
        <span class="token string">&#39;useMouse&#39;</span><span class="token punctuation">,</span> <span class="token comment">// import { useMouse } from &#39;@vueuse/core&#39;,</span>
        <span class="token comment">// 导入别名</span>
        <span class="token punctuation">[</span><span class="token string">&#39;useFetch&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;useMyFetch&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token comment">// import { useFetch as useMyFetch } from &#39;@vueuse/core&#39;,</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
      axios<span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token comment">// 默认导入名</span>
        <span class="token punctuation">[</span><span class="token string">&#39;default&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;axios&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token comment">// import { default as axios } from &#39;axios&#39;,</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token string-property property">&#39;[package-name]&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token string">&#39;[import-names]&#39;</span><span class="token punctuation">,</span>
        <span class="token comment">// 别名</span>
        <span class="token punctuation">[</span><span class="token string">&#39;[from]&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;[alias]&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// 示例类型导入</span>
    <span class="token punctuation">{</span>
      from<span class="token operator">:</span> <span class="token string">&#39;vue-router&#39;</span><span class="token punctuation">,</span>
      imports<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;RouteLocationRaw&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      type<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token comment">// 为目录下的默认模块导出启用按文件名自动导入</span>
  defaultExportByFilename<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>

  <span class="token comment">// 自动导入目录下的模块导出</span>
  <span class="token comment">// 默认情况下，它只扫描目录下的一级模块</span>
  dirs<span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token comment">// &#39;./hooks&#39;,</span>
    <span class="token comment">// &#39;./composables&#39; // only root modules</span>
    <span class="token comment">// &#39;./composables/**&#39;, // all nested modules</span>
    <span class="token comment">// ...</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>

  <span class="token comment">// 自动生成对应的. d.ts 文件的定义地址</span>
  <span class="token comment">// 默认为“ ./auto-import. d.ts”</span>
  dts<span class="token operator">:</span> <span class="token string">&#39;./auto-imports.d.ts&#39;</span><span class="token punctuation">,</span>

  <span class="token comment">// 是否在 Vue 模板中自动导入</span>
  <span class="token comment">// see https://github.com/unjs/unimport/pull/15 and https://github.com/unjs/unimport/pull/72</span>
  vueTemplate<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>

  <span class="token comment">// 自定义解析器，与“ unplugin-vue-Component”兼容</span>
  <span class="token comment">// see https://github.com/antfu/unplugin-auto-import/pull/23/</span>
  resolvers<span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token comment">/* ... */</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>

  <span class="token comment">// 控制自动导入的模块在代码中的位置</span>
  <span class="token comment">// 当 injectAtEnd 设置为 true 时，自动导入的模块将在其他导入语句的末尾被注入。</span>
  injectAtEnd<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>

  <span class="token comment">// 生成相应的. eslintrc-auto-import. json 文件。</span>
  <span class="token comment">// eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals</span>
  eslintrc<span class="token operator">:</span> <span class="token punctuation">{</span>
    enabled<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">// Default \`false\`</span>
    filepath<span class="token operator">:</span> <span class="token string">&#39;./.eslintrc-auto-import.json&#39;</span><span class="token punctuation">,</span> <span class="token comment">// Default \`./.eslintrc-auto-import.json\`</span>
    globalsPropValue<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// Default \`true\`, (true | false | &#39;readonly&#39; | &#39;readable&#39; | &#39;writable&#39; | &#39;writeable&#39;)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="unplugin-vue-components-vite" tabindex="-1"><a class="header-anchor" href="#unplugin-vue-components-vite" aria-hidden="true">#</a> unplugin-vue-components/vite</h2><p>同自动按需导入 API 一样，插件<code>unplugin-vue-components/vite</code>为自动按需导入 vue 组件。</p><p>例如常规的在父组件中引入子组件是需要先导入子组件的:</p><div class="language-vue line-numbers-mode" data-ext="vue"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>HelloWorld</span> <span class="token attr-name">msg</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>Hello Vue 3.0 + Vite<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> HelloWorld <span class="token keyword">from</span> <span class="token string">&#39;./src/components/HelloWorld.vue&#39;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;App&#39;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">components</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    HelloWorld<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当我们全局引入该插件后，就无需导入了，全交由 vite 进行处理，所以在一些项目中没有看到子组件的引入便可在 vite 中查看是不是用了这类插件了:</p><div class="language-vue line-numbers-mode" data-ext="vue"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>HelloWorld</span> <span class="token attr-name">msg</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>Hello Vue 3.0 + Vite<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;App&#39;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h3><ol><li><p>安装: <code>npm i unplugin-vue-components -D</code></p></li><li><p>使用插件:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// vite.config.ts</span>
<span class="token keyword">import</span> Components <span class="token keyword">from</span> <span class="token string">&#39;unplugin-vue-components/vite&#39;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token function">Components</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token comment">/* options */</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><p>常用 options 的介绍:</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token function">components</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  dirs<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;src/components&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  extensions<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;vue&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;ts&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;tsx&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  deep<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  directoryAsNamespace<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  dts<span class="token operator">:</span> <span class="token string">&#39;src/types/declaration-files/components.d.ts&#39;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>dirs：到目录的相对路径来搜索组件，即全局按需导入的组件的存放地址。</li><li>extensions：组件的有效文件扩展名。</li><li>deep：是否搜索子目录。</li><li>directoryAsNamespace：是否允许子目录作为组件的命名空间前缀。</li><li>dts: ts 类型声明地址。同上一样，若是采用了 ts，则该配置可以自动生成相应的类型声明。</li></ul><p>完整配置:</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token function">Components</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token comment">// 用于搜索组件的目录的相对路径。</span>
  dirs<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;src/components&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>

  <span class="token comment">// 组件的有效文件扩展名。</span>
  extensions<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;vue&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token comment">// 搜索子目录</span>
  deep<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token comment">// 自定义组件的解析器</span>
  resolvers<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>

  <span class="token comment">//生成\`components.d.ts\`的全局声明,</span>
  <span class="token comment">//也接受自定义文件名的路径</span>
  <span class="token comment">// 如果安装了typescript包default: true</span>
  dts<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>

  <span class="token comment">// 允许子目录作为组件的名称空间前缀。</span>
  directoryAsNamespace<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>

  <span class="token comment">// 是否允许折叠文件夹和组件的使用相同前缀(驼峰敏感)</span>
  <span class="token comment">// 以防止名称空间组件名称内部的重复。</span>
  collapseSamePrefixes<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>

  <span class="token comment">// 忽略名称空间前缀的子目录路径</span>
  <span class="token comment">// 当\`directoryAsNamespace: true\`时工作</span>
  globalNamespaces<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>

  <span class="token comment">// 自动导入指令</span>
  <span class="token comment">// 默认:&#39; true &#39;用于Vue 3， &#39; false &#39;用于Vue 2</span>
  <span class="token comment">// Vue 2需要使用Babel进行转换，出于性能考虑，它在默认情况下是禁用的</span>
  <span class="token comment">// 要安装Babel，运行:&#39; npm install -D @babel/parser &#39;</span>
  directives<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>

  <span class="token comment">// 在解析之前转换路径</span>
  <span class="token function-variable function">importPathTransform</span><span class="token operator">:</span> <span class="token punctuation">(</span>v<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> v<span class="token punctuation">,</span>

  <span class="token comment">// 允许组件覆盖具有相同名称的其他组件</span>
  allowOverrides<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>

  <span class="token comment">// 变换目标的滤波器</span>
  include<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">.vue$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">.vue?vue</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  exclude<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">[\\/]node_modules[\\/]</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">[\\/].git[\\/]</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">[\\/].nuxt[\\/]</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">]</span><span class="token punctuation">,</span>

  <span class="token comment">// Vue版本的项目。如果没有指定，它将自动检测。</span>
  <span class="token comment">// 取值范围: 2 | 2.7 | 3</span>
  version<span class="token operator">:</span> <span class="token number">2.7</span><span class="token punctuation">,</span>

  <span class="token comment">// 只提供库中组件的类型(全局注册)</span>
  types<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,15);function A(I,N){const e=v("ExternalLinkIcon");return m(),b("div",null,[g,f,x,n("p",null,[n("a",h,[s("官网 🚪"),t(e)])]),y,n("ul",null,[_,n("li",null,[n("p",null,[s("eslintrc: 生成相应的"),q,s(" 文件。这个主要是生产全局 eslint 变量名的配置文件。具体可看 "),n("a",w,[s("eslint global🚪"),t(e)])]),j])]),V])}const E=p(k,[["render",A],["__file","vite02.html.vue"]]);export{E as default};
