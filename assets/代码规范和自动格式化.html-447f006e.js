import{_ as t,V as o,W as p,X as n,Y as s,Z as e,a0 as i,F as r}from"./framework-acd93724.js";const l={},c=n("h1",{id:"代码规范和自动格式化",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#代码规范和自动格式化","aria-hidden":"true"},"#"),s(" 代码规范和自动格式化")],-1),u={href:"https://cn.eslint.org/docs/user-guide/configuring",target:"_blank",rel:"noopener noreferrer"},d=n("strong",null,"ESlint",-1),v=n("code",null,"JS",-1),k=n("code",null,"Vue",-1),m=n("code",null,"JSX",-1),b=n("h2",{id:"安装和使用",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#安装和使用","aria-hidden":"true"},"#"),s(" 安装和使用")],-1),q={href:"https://nodejs.org/zh-cn/",target:"_blank",rel:"noopener noreferrer"},g=i(`<p>可以使用 <strong>npm</strong> 安装 ESlint（开发时依赖） : <code>npm install ESlint -d</code></p><p>其次，你需要为 ESlint 设置配置文件: <code>npx eslint --init</code></p><p>采用 <code>init</code> 初始化指令时，可以依据你的需求，为 ESlint 设置配置文件，最后会在当前文件夹下生成 <code>.eslintre.js</code> 的配置文件。并且我们可以在配置文件中看到许多 <strong>rules</strong> 配置规则。</p><p>此时，我们可以<strong>通过指令: <code>npx eslint . --fix</code> 修复全部代码</strong>。</p><h3 id="eslint-配合-vscode-插件使用" tabindex="-1"><a class="header-anchor" href="#eslint-配合-vscode-插件使用" aria-hidden="true">#</a> ESlint 配合 VScode 插件使用</h3><p>虽然通过指令，可以做到统一修复代码，但是如果想在编写代码的时候立即发现不合规的地方，我们还是需要通过 <strong>VScode</strong> 插件 <strong>“ESLint“</strong> 来完成。</p><p>但我们安装完 <strong>“ESLint“</strong> 插件后，便会在编辑文件中，看到报错提示信息。当然，我们可以更进一步，利用 <strong>ESLint</strong> 进行自动修复（更流行的是用 <strong>Prettier</strong> 进行修复，下文会介绍），通过 <code>设置</code>打开 <code>setting.json</code> , 在其中编辑改写:</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token property">&quot;editor.codeActionsOnSave&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token property">&quot;source.fixAll.eslint&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>即，保存文件时执行——”ESLint 自动修复文件“。</p><p>但是，由于自带的代码格式化功能并不彻底，所以目前社区更流行将 <strong>ESlint</strong> 作为单一的语法检测工具，代码自动修复交由更专业的 <strong>Prettier</strong> 工具实现。</p><h3 id="设置-prettier" tabindex="-1"><a class="header-anchor" href="#设置-prettier" aria-hidden="true">#</a> 设置 Prettier</h3><p>如上文所述，<strong>Prettier</strong> 的代码格式化功能更加强大，但是其语法和 **ESLint ** 却并不相同，所以还需要额外再设置一番。</p><ol><li><p>在<code>VScode</code> 中安装 <code>Prettier</code> 插件，并在项目中局部安装: <code>npm install -d prettier</code></p></li><li><p>由于目的是配合 <strong>ESLint</strong> 使用，因此，我们在根目录创建 <code>.eslintrc.js</code> 配置文件，以下列出部分通用设置：</p><div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre class="language-JavaScript"><code>{
  &quot;useTabs&quot;: false,
  &quot;tabWidth&quot;: 2,
  &quot;printWidth&quot;: 100,
  &quot;singleQuote&quot;: true,
  &quot;trailingComma&quot;: &quot;none&quot;,
  &quot;bracketSpacing&quot;: true,
  &quot;semi&quot;: false
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>这个时候，我们就可以对项目进行初步格式化操作了： <code>npx prettier --write .</code></p></li></ol><p>但是这并不是我们想要的。我们需要让 <code>ESLint</code> 检测代码，<code>Prettier</code> 修复这部分问题代码。而俩者的语法并不相同，因此，我们接下来解决这部分的冲突。</p><ul><li><p>使用 <code>eslint-config-prettier</code> 这个插件，用来关闭所有和 <strong>Prettier</strong> 冲突的 <strong>ESLint</strong> 规则。</p><p>安装插件: <code>npm i eslint-config-prettier -d</code></p></li><li><p>a. 在 <code>.eslintrc.js</code> 配置文件中的<code>extends</code> 处加入 <code>prettier</code> 的扩展：</p><div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre class="language-JavaScript"><code>// .eslintrc.js
module.exports = {
  ......
  extends: [..., &#39;prettier&#39;], // 现在是以 prettier 为主,覆盖eslint格式配置。写在最后面，”...“代表其它插件
  ......
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>b. 继续修改:</p><div class="language-JavaScript line-numbers-mode" data-ext="JavaScript"><pre class="language-JavaScript"><code>// .eslintrc.js
module.exports = {
  ......
  extends: [..., &#39;plugin:prettier/recommended&#39;], // 现在是以 prettier/recommend 为主, 解决了与 eslint 的冲突
  ......
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h3 id="配合-typescript" tabindex="-1"><a class="header-anchor" href="#配合-typescript" aria-hidden="true">#</a> 配合 Typescript</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// .eslintrc.js</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token keyword">extends</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">&quot;eslint-config-airbnb-base&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;plugin:@typescript-eslint/recommended&quot;</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">parser</span><span class="token operator">:</span> <span class="token string">&quot;@typescript-eslint/parser&quot;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;@typescript-eslint&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">rules</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string-property property">&quot;import/extensions&quot;</span><span class="token operator">:</span> <span class="token string">&quot;off&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 不在 import其它 moudle时填写文件后缀名</span>
    <span class="token string-property property">&quot;no-use-before-define&quot;</span><span class="token operator">:</span> <span class="token string">&quot;off&quot;</span><span class="token punctuation">,</span> <span class="token comment">// typescript中的interface以及type不存在变量提升的问题</span>
    <span class="token string-property property">&quot;@typescript-eslint/no-use-before-define&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token string">&quot;error&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span> <span class="token literal-property property">ignoreTypeReferences</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token comment">// 保证eslint见到interface或者type在声明前使用时不会报错</span>
    <span class="token string-property property">&quot;import/prefer-default-export&quot;</span><span class="token operator">:</span> <span class="token string">&quot;off&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 如果单文件中只有一个导出项，则eslint会告诉你使用export default的方式导出, 关闭次功能</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">settings</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string-property property">&quot;import/resolver&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">node</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">extensions</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;.js&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;.ts&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token literal-property property">moduleDirectory</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;node_modules&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;./src&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">parserOptions</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">project</span><span class="token operator">:</span> <span class="token string">&quot;./tsconfig.json&quot;</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token comment">// setting.json</span>
  <span class="token comment">/* ESlint 设置 */</span>
  <span class="token property">&quot;eslint.alwaysShowStatus&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token property">&quot;eslint.format.enable&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// 开启eslint自动修复js/ts/jsx/tsx功能</span>
  <span class="token property">&quot;eslint.trace.server&quot;</span><span class="token operator">:</span> <span class="token string">&quot;verbose&quot;</span><span class="token punctuation">,</span> <span class="token comment">//在输出中看到更多日志</span>
  <span class="token property">&quot;eslint.validate&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">&quot;javascript&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;javascriptreact&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;typescript&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;javascriptreact&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;typescriptreact&quot;</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token comment">// eslint 作用范围</span>
  <span class="token property">&quot;typescript.tsdk&quot;</span><span class="token operator">:</span> <span class="token string">&quot;node_modules/typescript/lib&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;editor.formatOnSave&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// 保存时格式化</span>
  <span class="token comment">// 设置js的formatter为eslint</span>
  <span class="token property">&quot;[javascript]&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;editor.defaultFormatter&quot;</span><span class="token operator">:</span> <span class="token string">&quot;dbaeumer.vscode-eslint&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;[typescript]&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;editor.defaultFormatter&quot;</span><span class="token operator">:</span> <span class="token string">&quot;dbaeumer.vscode-eslint&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;[json]&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;editor.defaultFormatter&quot;</span><span class="token operator">:</span> <span class="token string">&quot;vscode.json-language-features&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">// jsonc是有注释的json</span>
  <span class="token property">&quot;[jsonc]&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;editor.defaultFormatter&quot;</span><span class="token operator">:</span> <span class="token string">&quot;vscode.json-language-features&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;eslint.codeActionsOnSave.mode&quot;</span><span class="token operator">:</span> <span class="token string">&quot;problems&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;editor.defaultFormatter&quot;</span><span class="token operator">:</span> <span class="token string">&quot;esbenp.prettier-vscode&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 默认格式化 用 Prettier</span>
  <span class="token comment">// 将json文件识别为jsonc格式</span>
  <span class="token property">&quot;files.associations&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;*.json&quot;</span><span class="token operator">:</span> <span class="token string">&quot;jsonc&quot;</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,18);function y(h,f){const a=r("ExternalLinkIcon");return o(),p("div",null,[c,n("p",null,[s("​ 在团队开发中，统一代码规范是必不可少的。"),n("a",u,[d,e(a)]),s(" 是我们前端工程化中代码检测的一款常用工具。它不仅可以检测 "),v,s(" 还支持 "),k,s(" 和 "),m,s(" 。")]),b,n("p",null,[s("环境要求: "),n("a",q,[s("Node.js"),e(a)]),s(" (>=6.14), npm version 3+。")]),g])}const j=t(l,[["render",y],["__file","代码规范和自动格式化.html.vue"]]);export{j as default};
