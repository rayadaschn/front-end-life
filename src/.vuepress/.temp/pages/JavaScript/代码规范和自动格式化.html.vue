<template><div><h1 id="代码规范和自动格式化" tabindex="-1"><a class="header-anchor" href="#代码规范和自动格式化" aria-hidden="true">#</a> 代码规范和自动格式化</h1>
<p>​	在团队开发中，统一代码规范是必不可少的。<a href="https://cn.eslint.org/docs/user-guide/configuring" target="_blank" rel="noopener noreferrer"><strong>ESlint</strong><ExternalLinkIcon/></a> 是我们前端工程化中代码检测的一款常用工具。它不仅可以检测 <code v-pre>JS</code> 还支持 <code v-pre>Vue</code> 和 <code v-pre>JSX</code> 。</p>
<h2 id="安装和使用" tabindex="-1"><a class="header-anchor" href="#安装和使用" aria-hidden="true">#</a> 安装和使用</h2>
<p>环境要求: <a href="https://nodejs.org/zh-cn/" target="_blank" rel="noopener noreferrer">Node.js<ExternalLinkIcon/></a> (&gt;=6.14), npm version 3+。</p>
<p>可以使用 <strong>npm</strong> 安装 ESlint（开发时依赖） : <code v-pre>npm install ESlint -d</code></p>
<p>其次，你需要为 ESlint 设置配置文件: <code v-pre>npx eslint --init</code></p>
<p>采用 <code v-pre>init</code> 初始化指令时，可以依据你的需求，为 ESlint 设置配置文件，最后会在当前文件夹下生成 <code v-pre>.eslintre.js</code> 的配置文件。并且我们可以在配置文件中看到许多 <strong>rules</strong> 配置规则。</p>
<p>此时，我们可以<strong>通过指令: <code v-pre>npx eslint . --fix</code>  修复全部代码</strong>。</p>
<h3 id="eslint-配合vscode插件使用" tabindex="-1"><a class="header-anchor" href="#eslint-配合vscode插件使用" aria-hidden="true">#</a> ESlint 配合VScode插件使用</h3>
<p>虽然通过指令，可以做到统一修复代码，但是如果想在编写代码的时候立即发现不合规的地方，我们还是需要通过 <strong>VScode</strong> 插件 <strong>“ESLint“</strong> 来完成。</p>
<p>但我们安装完  <strong>“ESLint“</strong> 插件后，便会在编辑文件中，看到报错提示信息。当然，我们可以更进一步，利用 <strong>ESLint</strong> 进行自动修复（更流行的是用 <strong>Prettier</strong> 进行修复，下文会介绍），通过 <code v-pre>设置</code>打开 <code v-pre>setting.json</code> , 在其中编辑改写:</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token property">"editor.codeActionsOnSave"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token property">"source.fixAll.eslint"</span><span class="token operator">:</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>即，保存文件时执行——”ESLint自动修复文件“。</p>
<p>但是，由于自带的代码格式化功能并不彻底，所以目前社区更流行将 <strong>ESlint</strong> 作为单一的语法检测工具，代码自动修复交由更专业的 <strong>Prettier</strong> 工具实现。</p>
<h3 id="设置-prettier" tabindex="-1"><a class="header-anchor" href="#设置-prettier" aria-hidden="true">#</a> 设置 Prettier</h3>
<p>如上文所述，<strong>Prettier</strong> 的代码格式化功能更加强大，但是其语法和 **ESLint ** 却并不相同，所以还需要额外再设置一番。</p>
<ol>
<li>
<p>在<code v-pre>VScode</code> 中安装 <code v-pre>Prettier</code> 插件，并在项目中局部安装: <code v-pre>npm install -d prettier</code></p>
</li>
<li>
<p>由于目的是配合 <strong>ESLint</strong> 使用，因此，我们在根目录创建 <code v-pre>.eslintrc.js</code> 配置文件，以下列出部分通用设置：</p>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>{
  &quot;useTabs&quot;: false,
  &quot;tabWidth&quot;: 2,
  &quot;printWidth&quot;: 100,
  &quot;singleQuote&quot;: true,
  &quot;trailingComma&quot;: &quot;none&quot;,
  &quot;bracketSpacing&quot;: true,
  &quot;semi&quot;: false
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>这个时候，我们就可以对项目进行初步格式化操作了： <code v-pre>npx prettier --write .</code></p>
</li>
</ol>
<p>但是这并不是我们想要的。我们需要让 <code v-pre>ESLint</code> 检测代码，<code v-pre>Prettier</code> 修复这部分问题代码。而俩者的语法并不相同，因此，我们接下来解决这部分的冲突。</p>
<ul>
<li>
<p>使用 <code v-pre>eslint-config-prettier</code> 这个插件，用来关闭所有和 <strong>Prettier</strong> 冲突的 <strong>ESLint</strong> 规则。</p>
<p>安装插件: <code v-pre>npm i eslint-config-prettier -d</code></p>
</li>
<li>
<p>a. 在 <code v-pre>.eslintrc.js</code> 配置文件中的<code v-pre>extends</code> 处加入 <code v-pre>prettier</code> 的扩展：</p>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>// .eslintrc.js
module.exports = {
  ......
  extends: [..., 'prettier'], // 现在是以 prettier 为主,覆盖eslint格式配置。写在最后面，”...“代表其它插件
  ......
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>b. 继续修改:</p>
<div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre v-pre class="language-JavaScript"><code>// .eslintrc.js
module.exports = {
  ......
  extends: [..., 'plugin:prettier/recommended'], // 现在是以 prettier/recommend 为主, 解决了与 eslint 的冲突
  ......
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="配合-typescript" tabindex="-1"><a class="header-anchor" href="#配合-typescript" aria-hidden="true">#</a> 配合 Typescript</h3>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// .eslintrc.js</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token keyword">extends</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">'eslint-config-airbnb-base'</span><span class="token punctuation">,</span> <span class="token string">'plugin:@typescript-eslint/recommended'</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">parser</span><span class="token operator">:</span> <span class="token string">'@typescript-eslint/parser'</span><span class="token punctuation">,</span>
  <span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">'@typescript-eslint'</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">rules</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string-property property">'import/extensions'</span><span class="token operator">:</span> <span class="token string">'off'</span><span class="token punctuation">,</span>  <span class="token comment">// 不在 import其它 moudle时填写文件后缀名</span>
    <span class="token string-property property">'no-use-before-define'</span><span class="token operator">:</span> <span class="token string">'off'</span><span class="token punctuation">,</span> <span class="token comment">// typescript中的interface以及type不存在变量提升的问题</span>
    <span class="token string-property property">'@typescript-eslint/no-use-before-define'</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">'error'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">ignoreTypeReferences</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>  <span class="token comment">// 保证eslint见到interface或者type在声明前使用时不会报错</span>
    <span class="token string-property property">'import/prefer-default-export'</span><span class="token operator">:</span> <span class="token string">'off'</span><span class="token punctuation">,</span> <span class="token comment">// 如果单文件中只有一个导出项，则eslint会告诉你使用export default的方式导出, 关闭次功能</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">settings</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string-property property">'import/resolver'</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">node</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">extensions</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">'.js'</span><span class="token punctuation">,</span> <span class="token string">'.ts'</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token literal-property property">moduleDirectory</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">'node_modules'</span><span class="token punctuation">,</span> <span class="token string">'./src'</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">parserOptions</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">project</span><span class="token operator">:</span> <span class="token string">'./tsconfig.json'</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token comment">// setting.json</span>
  <span class="token comment">/* ESlint 设置 */</span>
  <span class="token property">"eslint.alwaysShowStatus"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token property">"eslint.format.enable"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// 开启eslint自动修复js/ts/jsx/tsx功能</span>
  <span class="token property">"eslint.trace.server"</span><span class="token operator">:</span> <span class="token string">"verbose"</span><span class="token punctuation">,</span> <span class="token comment">//在输出中看到更多日志</span>
  <span class="token property">"eslint.validate"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">"javascript"</span><span class="token punctuation">,</span>
    <span class="token string">"javascriptreact"</span><span class="token punctuation">,</span>
    <span class="token string">"typescript"</span><span class="token punctuation">,</span>
    <span class="token string">"javascriptreact"</span><span class="token punctuation">,</span>
    <span class="token string">"typescriptreact"</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token comment">// eslint 作用范围</span>
  <span class="token property">"typescript.tsdk"</span><span class="token operator">:</span> <span class="token string">"node_modules/typescript/lib"</span><span class="token punctuation">,</span>
  <span class="token property">"editor.formatOnSave"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// 保存时格式化</span>
  <span class="token comment">// 设置js的formatter为eslint</span>
  <span class="token property">"[javascript]"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"editor.defaultFormatter"</span><span class="token operator">:</span> <span class="token string">"dbaeumer.vscode-eslint"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"[typescript]"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"editor.defaultFormatter"</span><span class="token operator">:</span> <span class="token string">"dbaeumer.vscode-eslint"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"[json]"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"editor.defaultFormatter"</span><span class="token operator">:</span> <span class="token string">"vscode.json-language-features"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">// jsonc是有注释的json</span>
  <span class="token property">"[jsonc]"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"editor.defaultFormatter"</span><span class="token operator">:</span> <span class="token string">"vscode.json-language-features"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"eslint.codeActionsOnSave.mode"</span><span class="token operator">:</span> <span class="token string">"problems"</span><span class="token punctuation">,</span>
  <span class="token property">"editor.defaultFormatter"</span><span class="token operator">:</span> <span class="token string">"esbenp.prettier-vscode"</span><span class="token punctuation">,</span> <span class="token comment">// 默认格式化 用 Prettier</span>
  <span class="token comment">// 将json文件识别为jsonc格式</span>
  <span class="token property">"files.associations"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"*.json"</span><span class="token operator">:</span> <span class="token string">"jsonc"</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


