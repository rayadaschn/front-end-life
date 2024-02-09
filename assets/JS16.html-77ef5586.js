import{_ as n,X as s,Y as a,$ as e}from"./framework-97fa2d96.js";const p={},t=e,o=s,l=a,i=t(`<p>本文总结一下自定义一个组件的过程。以 React + Sass 封装 Button 按钮为例。</p><p>过程基本为定义颜色变量，理清功能需求，样式封装等。</p><h2 id="基础配置" tabindex="-1"><a class="header-anchor" href="#基础配置" aria-hidden="true">#</a> 基础配置</h2><p>首先全局自定义颜色，类似于 antDesign UI 组件库一样，需要有基础色、品牌色和功能色三种。</p><p>为了在全局通用，因此选择 sass 的变量形式先将各色系记录下来。</p><figure><img src="https://cdn.jsdelivr.net/gh/rayadaschn/blogImage@master/img/202402081631800.png" alt="基础色" tabindex="0" loading="lazy"><figcaption>基础色</figcaption></figure><p>字体设置，一个是字体类型和等宽字体:</p><div class="language-scss line-numbers-mode" data-ext="scss"><pre class="language-scss"><code><span class="token property"><span class="token variable">$font-family-sans-serif</span></span><span class="token punctuation">:</span> -apple-system<span class="token punctuation">,</span> BlinkMacSystemFont<span class="token punctuation">,</span> <span class="token string">&#39;Segoe UI&#39;</span><span class="token punctuation">,</span> Roboto<span class="token punctuation">,</span>
  <span class="token string">&#39;Helvetica Neue&#39;</span><span class="token punctuation">,</span> Arial<span class="token punctuation">,</span> <span class="token string">&#39;Noto Sans&#39;</span><span class="token punctuation">,</span> sans-serif<span class="token punctuation">,</span> <span class="token string">&#39;Apple Color Emoji&#39;</span><span class="token punctuation">,</span>
  <span class="token string">&#39;Segoe UI Emoji&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;Segoe UI Symbol&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;Noto Color Emoji&#39;</span> <span class="token statement keyword">!default</span><span class="token punctuation">;</span>
<span class="token property"><span class="token variable">$font-family-monospace</span></span><span class="token punctuation">:</span> SFMono-Regular<span class="token punctuation">,</span> Menlo<span class="token punctuation">,</span> Monaco<span class="token punctuation">,</span> Consolas<span class="token punctuation">,</span>
  <span class="token string">&#39;Liberation Mono&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;Courier New&#39;</span><span class="token punctuation">,</span> monospace <span class="token statement keyword">!default</span><span class="token punctuation">;</span>
<span class="token property"><span class="token variable">$font-family-base</span></span><span class="token punctuation">:</span> <span class="token variable">$font-family-sans-serif</span> <span class="token statement keyword">!default</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="功能梳理" tabindex="-1"><a class="header-anchor" href="#功能梳理" aria-hidden="true">#</a> 功能梳理</h2><p>仿照 andDesign 设计 4 种按钮(未添加虚线按钮):</p><ul><li>主按钮：用于主行动点，一个操作区域只能有一个主按钮。</li><li>默认按钮：用于没有主次之分的一组行动点。</li><li>虚线按钮：常用于添加操作。</li><li>文本按钮：用于最次级的行动点。</li><li>链接按钮：一般用于链接，即导航至某位置。</li></ul><p>字体大小: 基础、大号和小号三种。</p><p>还有是否禁用，这三种类别。</p><h2 id="功能实现" tabindex="-1"><a class="header-anchor" href="#功能实现" aria-hidden="true">#</a> 功能实现</h2><p>先看一个普通的按钮使用:</p><div class="language-tsx line-numbers-mode" data-ext="tsx"><pre class="language-tsx"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Button</span></span> <span class="token attr-name">btnType</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>link<span class="token punctuation">&quot;</span></span> <span class="token attr-name">size</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>sm<span class="token punctuation">&quot;</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>https://www.baidu.com<span class="token punctuation">&quot;</span></span> <span class="token attr-name">target</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>_blank<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
  link
</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Button</span></span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因此我们可以定义出按钮的 props 属性:</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">type</span> <span class="token class-name">ButtonSize</span> <span class="token operator">=</span> <span class="token string">&#39;lg&#39;</span> <span class="token operator">|</span> <span class="token string">&#39;sm&#39;</span>
<span class="token keyword">type</span> <span class="token class-name">ButtonType</span> <span class="token operator">=</span> <span class="token string">&#39;primary&#39;</span> <span class="token operator">|</span> <span class="token string">&#39;default&#39;</span> <span class="token operator">|</span> <span class="token string">&#39;danger&#39;</span> <span class="token operator">|</span> <span class="token string">&#39;link&#39;</span>

<span class="token keyword">interface</span> <span class="token class-name">BaseButtonProps</span> <span class="token punctuation">{</span>
  children<span class="token operator">:</span> React<span class="token punctuation">.</span>ReactNode
  className<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span>
  disable<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
  size<span class="token operator">?</span><span class="token operator">:</span> ButtonSize
  btnType<span class="token operator">?</span><span class="token operator">:</span> ButtonType
  href<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是这还不够，因为按钮还有会自己的其它属性如 <code>onClick</code> 等点击事件，为此，还需要对这个进行改造:</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> ButtonHTMLAttributes<span class="token punctuation">,</span> AnchorHTMLAttributes <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;react&#39;</span>

<span class="token comment">// 获取原生按钮事件的 attributes</span>
<span class="token keyword">type</span> <span class="token class-name">NativeButtonProps</span> <span class="token operator">=</span> BaseButtonProps <span class="token operator">&amp;</span> ButtonHTMLAttributes<span class="token operator">&lt;</span>HTMLElement<span class="token operator">&gt;</span>
<span class="token keyword">type</span> <span class="token class-name">AnchorButtonProps</span> <span class="token operator">=</span> BaseButtonProps <span class="token operator">&amp;</span> AnchorHTMLAttributes<span class="token operator">&lt;</span>HTMLElement<span class="token operator">&gt;</span>

<span class="token comment">// \`Partial&lt;Type&gt;\`返回一个新类型，将参数类型\`Type\`的所有属性变为可选属性。</span>
<span class="token keyword">type</span> <span class="token class-name">ButtonProps</span> <span class="token operator">=</span> Partial<span class="token operator">&lt;</span>NativeButtonProps <span class="token operator">&amp;</span> AnchorButtonProps<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时的 ButtonProps 才是符合预期要求的。</p><p>按钮功能的实现：</p><div class="language-tsx line-numbers-mode" data-ext="tsx"><pre class="language-tsx"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> <span class="token constant">FC</span><span class="token punctuation">,</span> ButtonHTMLAttributes<span class="token punctuation">,</span> AnchorHTMLAttributes <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;react&#39;</span>
<span class="token keyword">import</span> classNames <span class="token keyword">from</span> <span class="token string">&#39;classnames&#39;</span>

<span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">ButtonType</span> <span class="token operator">=</span> <span class="token string">&#39;primary&#39;</span> <span class="token operator">|</span> <span class="token string">&#39;default&#39;</span> <span class="token operator">|</span> <span class="token string">&#39;danger&#39;</span> <span class="token operator">|</span> <span class="token string">&#39;link&#39;</span>
<span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">ButtonSize</span> <span class="token operator">=</span> <span class="token string">&#39;lg&#39;</span> <span class="token operator">|</span> <span class="token string">&#39;sm&#39;</span>

<span class="token keyword">interface</span> <span class="token class-name">BaseButtonProps</span> <span class="token punctuation">{</span>
  children<span class="token operator">:</span> React<span class="token punctuation">.</span>ReactNode
  className<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span>
  disable<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
  size<span class="token operator">?</span><span class="token operator">:</span> ButtonSize
  btnType<span class="token operator">?</span><span class="token operator">:</span> ButtonType
  href<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span>
<span class="token punctuation">}</span>

<span class="token comment">/** 按钮组件 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Button<span class="token operator">:</span> <span class="token constant">FC</span><span class="token operator">&lt;</span>ButtonProps<span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token punctuation">(</span>props<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> btnType<span class="token punctuation">,</span> className<span class="token punctuation">,</span> disabled<span class="token punctuation">,</span> size<span class="token punctuation">,</span> children<span class="token punctuation">,</span> href<span class="token punctuation">,</span> <span class="token operator">...</span>restProps <span class="token punctuation">}</span> <span class="token operator">=</span>
    props

  <span class="token keyword">const</span> classes <span class="token operator">=</span> <span class="token function">classNames</span><span class="token punctuation">(</span><span class="token string">&#39;btn&#39;</span><span class="token punctuation">,</span> className<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token punctuation">[</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">btn-</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>btnType<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">]</span><span class="token operator">:</span> btnType<span class="token punctuation">,</span>
    <span class="token punctuation">[</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">btn-</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>size<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">]</span><span class="token operator">:</span> size<span class="token punctuation">,</span>
    disabled<span class="token operator">:</span> btnType <span class="token operator">===</span> <span class="token string">&#39;link&#39;</span> <span class="token operator">&amp;&amp;</span> disabled<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>btnType <span class="token operator">===</span> <span class="token string">&#39;link&#39;</span> <span class="token operator">&amp;&amp;</span> href<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">className</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>classes<span class="token punctuation">}</span></span> <span class="token attr-name">href</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>href<span class="token punctuation">}</span></span> <span class="token spread"><span class="token punctuation">{</span><span class="token operator">...</span>restProps<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        </span><span class="token punctuation">{</span>children<span class="token punctuation">}</span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">&gt;</span></span>
    <span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">className</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>classes<span class="token punctuation">}</span></span> <span class="token attr-name">disabled</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>disabled<span class="token punctuation">}</span></span> <span class="token spread"><span class="token punctuation">{</span><span class="token operator">...</span>restProps<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        </span><span class="token punctuation">{</span>children<span class="token punctuation">}</span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
    <span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">这是一个 button</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token punctuation">}</span>

Button<span class="token punctuation">.</span>defaultProps <span class="token operator">=</span> <span class="token punctuation">{</span>
  disabled<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  btnType<span class="token operator">:</span> <span class="token string">&#39;default&#39;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> Button
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里还引入了 classNames 做 class 类的管理，以区分不同的按钮样式。主要为按钮类型、按钮大小和是否可用三种。</p><h2 id="颜色模块" tabindex="-1"><a class="header-anchor" href="#颜色模块" aria-hidden="true">#</a> 颜色模块</h2><p>由于有不同的按钮类型，这里对颜色的封装采用了 sass 的 <code>@mixin</code> 和 <code>@include</code> 对样式进行封装。下面简单介绍一下这俩个的用法：</p><p>在 Sass 中，<code>@mixin</code> 是一种可以定义并重用一组样式规则的方式，而 <code>@include</code> 则是将定义好的 Mixin 引入到 CSS 规则中的方法。</p><ol><li><p><code>@mixin</code> 允许定义一组样式规则，然后在需要的地方通过 <code>@include</code> 引入这些规则。<code>@mixin</code> 可以包含任意的 CSS 规则，也可以接受参数，以便在不同的地方使用不同的样式。<code>@mixin</code> 使用 <code>@mixin</code> 关键字定义，例如：</p><div class="language-scss line-numbers-mode" data-ext="scss"><pre class="language-scss"><code><span class="token keyword">@mixin</span> <span class="token function">button</span><span class="token punctuation">(</span><span class="token variable">$color</span><span class="token punctuation">,</span> <span class="token variable">$background</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">$color</span><span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> <span class="token variable">$background</span><span class="token punctuation">;</span>
  <span class="token property">padding</span><span class="token punctuation">:</span> 10px 20px<span class="token punctuation">;</span>
  <span class="token property">border</span><span class="token punctuation">:</span> none<span class="token punctuation">;</span>
  <span class="token property">border-radius</span><span class="token punctuation">:</span> 5px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><code>@include</code> 是将 <code>@mixin</code> 引入到 CSS 规则中的方式。通过 <code>@include</code> 关键字，可以在需要的地方引入 <code>@mixin</code>，从而将其包含的样式规则应用到当前规则中。<code>@include</code> 的语法是 <code>@include</code> 后跟 <code>@mixin</code> 的名称和参数（如果有的话），例如：</p><div class="language-scss line-numbers-mode" data-ext="scss"><pre class="language-scss"><code><span class="token selector">.primary-button </span><span class="token punctuation">{</span>
  <span class="token keyword">@include</span> <span class="token function">button</span><span class="token punctuation">(</span>blue<span class="token punctuation">,</span> white<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.secondary-button </span><span class="token punctuation">{</span>
  <span class="token keyword">@include</span> <span class="token function">button</span><span class="token punctuation">(</span>red<span class="token punctuation">,</span> white<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><p>在编译为 CSS 后，以上代码会展开为：</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.primary-button</span> <span class="token punctuation">{</span>
  <span class="token property">color</span><span class="token punctuation">:</span> blue<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> white<span class="token punctuation">;</span>
  <span class="token property">padding</span><span class="token punctuation">:</span> 10px 20px<span class="token punctuation">;</span>
  <span class="token property">border</span><span class="token punctuation">:</span> none<span class="token punctuation">;</span>
  <span class="token property">border-radius</span><span class="token punctuation">:</span> 5px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.secondary-button</span> <span class="token punctuation">{</span>
  <span class="token property">color</span><span class="token punctuation">:</span> red<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> white<span class="token punctuation">;</span>
  <span class="token property">padding</span><span class="token punctuation">:</span> 10px 20px<span class="token punctuation">;</span>
  <span class="token property">border</span><span class="token punctuation">:</span> none<span class="token punctuation">;</span>
  <span class="token property">border-radius</span><span class="token punctuation">:</span> 5px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过 <code>@mixin</code> 和 <code>@include</code> ，可以避免重复书写相似的样式规则，提高代码的可维护性和可重用性。</p><p>因此在组件封装中我们定义俩个 Button 的 mixin:</p><div class="language-sass line-numbers-mode" data-ext="sass"><pre class="language-sass"><code><span class="token atrule-line"><span class="token atrule">@mixin</span> button-size($padding-y, $padding-x, $font-size, $border-raduis) {</span>
<span class="token property-line">  <span class="token property">padding</span><span class="token punctuation">:</span> <span class="token variable">$padding-y</span> <span class="token variable">$padding-x</span>;</span>
<span class="token property-line">  <span class="token property">font-size</span><span class="token punctuation">:</span> <span class="token variable">$font-size</span>;</span>
<span class="token property-line">  <span class="token property">border-radius</span><span class="token punctuation">:</span> <span class="token variable">$border-raduis</span>;</span>
<span class="token selector">}</span>

<span class="token atrule-line"><span class="token atrule">@mixin</span> button-style(</span>
<span class="token variable-line">  <span class="token variable">$background</span>,</span>
<span class="token variable-line">  <span class="token variable">$border</span>,</span>
<span class="token variable-line">  <span class="token variable">$color</span>,</span>
<span class="token variable-line">  <span class="token variable">$hover-background</span><span class="token punctuation">:</span> lighten(<span class="token variable">$background</span>, 7.5<span class="token operator">%</span>),</span>
<span class="token variable-line">  <span class="token variable">$hover-border</span><span class="token punctuation">:</span> lighten(<span class="token variable">$border</span>, 10<span class="token operator">%</span>),</span>
<span class="token variable-line">  <span class="token variable">$hover-color</span><span class="token punctuation">:</span> <span class="token variable">$color</span></span>
<span class="token selector">) {</span>
<span class="token property-line">  <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">$color</span>;</span>
<span class="token property-line">  <span class="token property">background</span><span class="token punctuation">:</span> <span class="token variable">$background</span>;</span>
<span class="token property-line">  <span class="token property">border-color</span><span class="token punctuation">:</span> <span class="token variable">$border</span>;</span>

<span class="token property-line">  <span class="token property">&amp;</span><span class="token punctuation">:</span><span class="token property">hover</span> {</span>
<span class="token property-line">    <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">$hover-color</span>;</span>
<span class="token property-line">    <span class="token property">background</span><span class="token punctuation">:</span> <span class="token variable">$hover-background</span>;</span>
<span class="token property-line">    <span class="token property">border-color</span><span class="token punctuation">:</span> <span class="token variable">$hover-border</span>;</span>
  <span class="token selector">}</span>

<span class="token property-line">  <span class="token property">&amp;</span><span class="token punctuation">:</span><span class="token property">focus,</span></span>
  <span class="token selector">&amp;.focus {</span>
<span class="token property-line">    <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">$hover-color</span>;</span>
<span class="token property-line">    <span class="token property">background</span><span class="token punctuation">:</span> <span class="token variable">$hover-background</span>;</span>
<span class="token property-line">    <span class="token property">border-color</span><span class="token punctuation">:</span> <span class="token variable">$hover-border</span>;</span>
  <span class="token selector">}</span>

<span class="token property-line">  <span class="token property">&amp;</span><span class="token punctuation">:</span><span class="token property">disabled,</span></span>
  <span class="token selector">&amp;.disabled {</span>
<span class="token property-line">    <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">$color</span>;</span>
<span class="token property-line">    <span class="token property">background</span><span class="token punctuation">:</span> <span class="token variable">$background</span>;</span>
<span class="token property-line">    <span class="token property">border-color</span><span class="token punctuation">:</span> <span class="token variable">$border</span>;</span>
  <span class="token selector">}</span>
<span class="token selector">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>而后在组件中统一使用:</p><div class="language-sass line-numbers-mode" data-ext="sass"><pre class="language-sass"><code><span class="token selector">.btn {</span>
<span class="token property-line">  <span class="token property">position</span><span class="token punctuation">:</span> relative;</span>
<span class="token property-line">  <span class="token property">display</span><span class="token punctuation">:</span> inline-block;</span>
<span class="token property-line">  <span class="token property">font-weight</span><span class="token punctuation">:</span> <span class="token variable">$btn-font-weight</span>;</span>
<span class="token property-line">  <span class="token property">line-height</span><span class="token punctuation">:</span> <span class="token variable">$btn-line-height</span>;</span>
<span class="token property-line">  <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">$body-color</span>;</span>
<span class="token property-line">  <span class="token property">white-space</span><span class="token punctuation">:</span> nowrap;</span>
<span class="token property-line">  <span class="token property">text-align</span><span class="token punctuation">:</span> center;</span>
<span class="token property-line">  <span class="token property">vertical-align</span><span class="token punctuation">:</span> middle;</span>
<span class="token property-line">  <span class="token property">background-image</span><span class="token punctuation">:</span> none;</span>
<span class="token property-line">  <span class="token property">border</span><span class="token punctuation">:</span> <span class="token variable">$btn-border-width</span> solid transparent;</span>
<span class="token atrule-line">  <span class="token atrule">@include</span> button-size(</span>
<span class="token variable-line">    <span class="token variable">$btn-padding-y</span>,</span>
<span class="token variable-line">    <span class="token variable">$btn-padding-x</span>,</span>
<span class="token variable-line">    <span class="token variable">$btn-font-size</span>,</span>
<span class="token variable-line">    <span class="token variable">$border-radius</span></span>
  <span class="token selector">);</span>
<span class="token property-line">  <span class="token property">box-shadow</span><span class="token punctuation">:</span> <span class="token variable">$btn-box-shadow</span>;</span>
<span class="token property-line">  <span class="token property">cursor</span><span class="token punctuation">:</span> pointer;</span>
<span class="token property-line">  <span class="token property">transition</span><span class="token punctuation">:</span> <span class="token variable">$btn-transition</span>;</span>

  <span class="token selector">&amp;.disabled</span><span class="token punctuation">,</span>
  <span class="token selector">&amp;[disabled] {</span>
<span class="token property-line">    <span class="token property">cursor</span><span class="token punctuation">:</span> <span class="token operator">not</span>-allowed;</span>
<span class="token property-line">    <span class="token property">opacity</span><span class="token punctuation">:</span> <span class="token variable">$btn-disabled-opacity</span>;</span>
<span class="token property-line">    <span class="token property">box-shadow</span><span class="token punctuation">:</span> none;</span>
    <span class="token selector">&gt; * {</span>
<span class="token property-line">      <span class="token property">pointer-events</span><span class="token punctuation">:</span> none;</span>
    <span class="token selector">}</span>
  <span class="token selector">}</span>
<span class="token selector">}</span>

<span class="token selector">.btn-lg {</span>
<span class="token atrule-line">  <span class="token atrule">@include</span> button-size(</span>
<span class="token variable-line">    <span class="token variable">$btn-padding-y-lg</span>,</span>
<span class="token variable-line">    <span class="token variable">$btn-padding-x-lg</span>,</span>
<span class="token variable-line">    <span class="token variable">$btn-font-size-lg</span>,</span>
<span class="token variable-line">    <span class="token variable">$btn-border-radius-lg</span></span>
  <span class="token selector">);</span>
<span class="token selector">}</span>
<span class="token selector">.btn-sm {</span>
<span class="token atrule-line">  <span class="token atrule">@include</span> button-size(</span>
<span class="token variable-line">    <span class="token variable">$btn-padding-y-sm</span>,</span>
<span class="token variable-line">    <span class="token variable">$btn-padding-x-sm</span>,</span>
<span class="token variable-line">    <span class="token variable">$btn-font-size-sm</span>,</span>
<span class="token variable-line">    <span class="token variable">$btn-border-radius-sm</span></span>
  <span class="token selector">);</span>
<span class="token selector">}</span>

<span class="token selector">.btn-primary {</span>
<span class="token atrule-line">  <span class="token atrule">@include</span> button-style($primary, $primary, $white);</span>
<span class="token selector">}</span>
<span class="token selector">.btn-danger {</span>
<span class="token atrule-line">  <span class="token atrule">@include</span> button-style($danger, $danger, $white);</span>
<span class="token selector">}</span>

<span class="token selector">.btn-default {</span>
<span class="token atrule-line">  <span class="token atrule">@include</span> button-style(</span>
<span class="token variable-line">    <span class="token variable">$white</span>,</span>
<span class="token variable-line">    <span class="token variable">$gray-400</span>,</span>
<span class="token variable-line">    <span class="token variable">$body-color</span>,</span>
<span class="token variable-line">    <span class="token variable">$white</span>,</span>
<span class="token variable-line">    <span class="token variable">$primary</span>,</span>
<span class="token variable-line">    <span class="token variable">$primary</span></span>
  <span class="token selector">);</span>
<span class="token selector">}</span>

<span class="token selector">.btn-link {</span>
<span class="token property-line">  <span class="token property">font-weight</span><span class="token punctuation">:</span> <span class="token variable">$font-weight-normal</span>;</span>
<span class="token property-line">  <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">$btn-link-color</span>;</span>
<span class="token property-line">  <span class="token property">text-decoration</span><span class="token punctuation">:</span> <span class="token variable">$link-decoration</span>;</span>
<span class="token property-line">  <span class="token property">box-shadow</span><span class="token punctuation">:</span> none;</span>
<span class="token property-line">  <span class="token property">&amp;</span><span class="token punctuation">:</span><span class="token property">hover</span> {</span>
<span class="token property-line">    <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">$btn-link-hover-color</span>;</span>
<span class="token property-line">    <span class="token property">text-decoration</span><span class="token punctuation">:</span> <span class="token variable">$link-hover-decoration</span>;</span>
  <span class="token selector">}</span>
<span class="token property-line">  <span class="token property">&amp;</span><span class="token punctuation">:</span><span class="token property">focus,</span></span>
  <span class="token selector">&amp;.focus {</span>
<span class="token property-line">    <span class="token property">text-decoration</span><span class="token punctuation">:</span> <span class="token variable">$link-hover-decoration</span>;</span>
<span class="token property-line">    <span class="token property">box-shadow</span><span class="token punctuation">:</span> none;</span>
  <span class="token selector">}</span>
<span class="token property-line">  <span class="token property">&amp;</span><span class="token punctuation">:</span><span class="token property">disabled,</span></span>
  <span class="token selector">&amp;.disabled {</span>
<span class="token property-line">    <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">$btn-link-disabled-color</span>;</span>
<span class="token property-line">    <span class="token property">pointer-events</span><span class="token punctuation">:</span> none;</span>
  <span class="token selector">}</span>
<span class="token selector">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至于 sass 中的一些颜色和大小的变量，则可依据需要自由定义。</p>`,36),c=[i];function r(u,d){return o(),l("div",null,c)}const v=n(p,[["render",r],["__file","JS16.html.vue"]]);export{v as default};
