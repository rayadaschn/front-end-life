import{_ as p,Z as e,a2 as o,F as c,a1 as i,X as l,Y as u,$ as r}from"./framework-b7a1e62f.js";const k={},s=e,n=o,d=c,v=i,a=r,m=l,b=u,g=a(`<p>在<a href="Vue03">《Vue3 中的懒加载》</a> 一文中，我们总结了懒加载的实现方式。那懒加载最好用在什么地方呢？其实很常见，如在后台管理系统中，因为权限不同我们需要依据后端返回的数据，展现不同的菜单。菜单不同对应的二级列表路由地址不同，这个时候可不能一股脑的将所有子组件全部注册进去，否则，依据地址我们可以实现越权查看不同权限人的界面。</p><h2 id="动物园里有什么" tabindex="-1"><a class="header-anchor" href="#动物园里有什么" aria-hidden="true">#</a> 动物园里有什么</h2><p>我们先来看看我们的需求是什么？</p><ul><li>依据后端接口返回的数据，筛选出需要注册的二级组件，进行注册；</li><li>由于是动态加载，我们还需要考虑注册缓存的问题。（即，刷新后依旧能正常展现页面）</li></ul><p>采用的方案：</p><p>在《<a href="Vue03">Vue3 中的懒加载</a> 》一文中，我们有多种懒加载的方法，但是由于我们还是要获取到所有的二级组件，所以，我们选取的 <code>i<wbr>mport.meta.glob</code> 方案:</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 异步组件: vite 打包 i<wbr>mport.meta.glob 方法</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> defineAsyncComponent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>
<span class="token keyword">const</span> modules <span class="token operator">=</span> <span class="token keyword">import</span><span class="token punctuation">.</span>meta<span class="token punctuation">.</span><span class="token function">glob</span><span class="token punctuation">(</span><span class="token string">&#39;@views/*.vue&#39;</span><span class="token punctuation">)</span> <span class="token comment">// 导入所有 vue 组件,返回对象, key 为路径名称</span>

<span class="token keyword">const</span> routes<span class="token operator">:</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span>RouteRecordRaw<span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    path<span class="token operator">:</span> <span class="token string">&#39;/&#39;</span><span class="token punctuation">,</span>
    name<span class="token operator">:</span> <span class="token string">&#39;home&#39;</span><span class="token punctuation">,</span>
    component<span class="token operator">:</span> modules<span class="token punctuation">[</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">@views/home.vue</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),y=s("code",null,"router.addRoute",-1),w={href:"https://router.vuejs.org/zh/guide/advanced/dynamic-routing.html",target:"_blank",rel:"noopener noreferrer"},f=s("code",null,"router.addRoute",-1),h=a(`<p>要将嵌套路由添加到现有的路由中，可以<strong>将路由的 <em>name</em> 作为第一个参数传递给 <code>router.addRoute()</code></strong>，这将有效地添加路由，就像通过 <code>children</code> 添加的一样：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>router<span class="token punctuation">.</span><span class="token function">addRoute</span><span class="token punctuation">(</span><span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">&#39;admin&#39;</span><span class="token punctuation">,</span> path<span class="token operator">:</span> <span class="token string">&#39;/admin&#39;</span><span class="token punctuation">,</span> component<span class="token operator">:</span> Admin <span class="token punctuation">}</span><span class="token punctuation">)</span>
router<span class="token punctuation">.</span><span class="token function">addRoute</span><span class="token punctuation">(</span><span class="token string">&#39;admin&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> path<span class="token operator">:</span> <span class="token string">&#39;settings&#39;</span><span class="token punctuation">,</span> component<span class="token operator">:</span> AdminSettings <span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>这等效于：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>router<span class="token punctuation">.</span><span class="token function">addRoute</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token string">&#39;admin&#39;</span><span class="token punctuation">,</span>
  path<span class="token operator">:</span> <span class="token string">&#39;/admin&#39;</span><span class="token punctuation">,</span>
  component<span class="token operator">:</span> Admin<span class="token punctuation">,</span>
  children<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> path<span class="token operator">:</span> <span class="token string">&#39;settings&#39;</span><span class="token punctuation">,</span> component<span class="token operator">:</span> AdminSettings <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="把大象装进冰箱" tabindex="-1"><a class="header-anchor" href="#把大象装进冰箱" aria-hidden="true">#</a> 把大象装进冰箱</h2><p>我们先来看看后端给我们的 &quot;大象 🐘&quot; 有哪些数据：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">const</span> userMenus <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    id<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    name<span class="token operator">:</span> <span class="token string">&#39;analysis&#39;</span><span class="token punctuation">,</span>
    child<span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        id<span class="token operator">:</span> <span class="token string">&#39;1-1&#39;</span><span class="token punctuation">,</span>
        name<span class="token operator">:</span> <span class="token string">&#39;overview&#39;</span><span class="token punctuation">,</span>
        url<span class="token operator">:</span> <span class="token string">&#39;/main/analysis/overview&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        id<span class="token operator">:</span> <span class="token string">&#39;1-2&#39;</span><span class="token punctuation">,</span>
        name<span class="token operator">:</span> <span class="token string">&#39;dashboard&#39;</span><span class="token punctuation">,</span>
        url<span class="token operator">:</span> <span class="token string">&#39;/main/analysis/dashboard&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    id<span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
    name<span class="token operator">:</span> <span class="token string">&#39;system&#39;</span><span class="token punctuation">,</span>
    child<span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        id<span class="token operator">:</span> <span class="token string">&#39;2-1&#39;</span><span class="token punctuation">,</span>
        name<span class="token operator">:</span> <span class="token string">&#39;user&#39;</span><span class="token punctuation">,</span>
        url<span class="token operator">:</span> <span class="token string">&#39;/main/system/user&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        id<span class="token operator">:</span> <span class="token string">&#39;2-2&#39;</span><span class="token punctuation">,</span>
        name<span class="token operator">:</span> <span class="token string">&#39;department&#39;</span><span class="token punctuation">,</span>
        url<span class="token operator">:</span> <span class="token string">&#39;/main/system/department&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        id<span class="token operator">:</span> <span class="token string">&#39;2-3&#39;</span><span class="token punctuation">,</span>
        name<span class="token operator">:</span> <span class="token string">&#39;menu&#39;</span><span class="token punctuation">,</span>
        url<span class="token operator">:</span> <span class="token string">&#39;/main/system/menu&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>共拥有俩个一级列表和多个二级列表。但是我们的组件可能拥有数十个（假设在<code>@/router/main/**/*</code> 目录下），我们通过 <code>i<wbr>mport.meta.glob</code> 先把它们收集起来：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 收集所有的路由组件</span>
<span class="token keyword">import</span> <span class="token keyword">type</span> <span class="token punctuation">{</span> RouteRecordRaw <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-router&#39;</span>

<span class="token comment">// 导入所有子路由</span>
<span class="token keyword">function</span> <span class="token function">loadLocalRoutes</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// * 路由对象都在独立的文件中</span>
  <span class="token comment">// * 从文件中将所有路由对象先读取数组中</span>
  <span class="token keyword">const</span> localRoutes<span class="token operator">:</span> RouteRecordRaw<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token comment">// 收集的所有路由对象</span>
  <span class="token comment">// 从文件中读取所有 ts 文件</span>
  <span class="token keyword">const</span> files<span class="token operator">:</span> Record<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token builtin">any</span><span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token keyword">import</span><span class="token punctuation">.</span>meta<span class="token punctuation">.</span><span class="token function">glob</span><span class="token punctuation">(</span><span class="token string">&#39;@/router/main/**/*.ts&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
    eager<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token comment">// 加载路由</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> key <span class="token keyword">in</span> files<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> module <span class="token operator">=</span> files<span class="token punctuation">[</span>key<span class="token punctuation">]</span>
    localRoutes<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>module<span class="token punctuation">.</span>default<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> localRoutes
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述返回的 <code>localRoutes</code> 就是所有路由对象数组了:</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// localRoutes 打印结果</span>
<span class="token punctuation">[</span>
  <span class="token number">0</span><span class="token operator">:</span> <span class="token punctuation">{</span>path<span class="token operator">:</span> <span class="token string">&#39;/main/analysis/dashboard&#39;</span><span class="token punctuation">,</span> component<span class="token operator">:</span> ƒ<span class="token punctuation">}</span>
  <span class="token number">1</span><span class="token operator">:</span> <span class="token punctuation">{</span>path<span class="token operator">:</span> <span class="token string">&#39;/main/analysis/overview&#39;</span><span class="token punctuation">,</span> component<span class="token operator">:</span> ƒ<span class="token punctuation">}</span>
  <span class="token number">2</span><span class="token operator">:</span> <span class="token punctuation">{</span>path<span class="token operator">:</span> <span class="token string">&#39;/main/product/category&#39;</span><span class="token punctuation">,</span> name<span class="token operator">:</span> <span class="token string">&#39;category&#39;</span><span class="token punctuation">,</span> children<span class="token operator">:</span> <span class="token function">Array</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">,</span> component<span class="token operator">:</span> ƒ<span class="token punctuation">}</span>
  <span class="token operator">...</span><span class="token operator">...</span>
<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们可以从打印结果中看到有很多组件是我们不需要的，所以对其进行筛选，<code>userMenus</code> 为后端返回的目录数据（具体见上文），我们需要对其进行遍历，获取实际需要的二级路由列表：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// userMenus 为后端返回数据</span>
<span class="token comment">// 依据上文打印的 localRoutes 结果, 将本地的路由中的 path 与 后端返回的目录中的 url 进行匹配</span>
<span class="token keyword">const</span> routes <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token comment">// 最终匹配需要注册的二级路由</span>
<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> menu <span class="token keyword">of</span> userMenus<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> subMenu <span class="token keyword">of</span> menu<span class="token punctuation">.</span>child<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> route <span class="token operator">=</span> localRoutes<span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span>
      <span class="token punctuation">(</span>itemRoute<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> itemRoute<span class="token punctuation">.</span>path <span class="token operator">===</span> subMenu<span class="token punctuation">.</span>url
    <span class="token punctuation">)</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>route<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      routes<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>route<span class="token punctuation">)</span> <span class="token comment">// 匹配到路由</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>经过上述遍历，我们拿到了最终需要注册的二级路由 <code>route</code> ，我们依次对其进行嵌套注册（当然也可以在上述匹配过程直接嵌套注册）：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// 嵌套注册在 main 以及路由下</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> useRouter <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-router&#39;</span>

<span class="token keyword">const</span> router <span class="token operator">=</span> <span class="token function">useRouter</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
routes<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>route<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> router<span class="token punctuation">.</span><span class="token function">addRoute</span><span class="token punctuation">(</span><span class="token string">&#39;main&#39;</span><span class="token punctuation">,</span> route<span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上，我们就已经完成了动态注册路由的绝大部分工作了。但是，还有一个隐藏 <code>Bug</code> ，就是在我们注册的二级路由地址下，我们一旦刷新，则动态加载的组件数据则就没有了。因此，我们还需要将待需要动态注册的路由进行本地缓存，并在页面加载时，进行提取。</p><h2 id="防止二级路由刷新数据丢失" tabindex="-1"><a class="header-anchor" href="#防止二级路由刷新数据丢失" aria-hidden="true">#</a> 防止二级路由刷新数据丢失</h2><blockquote><p><code>Tips</code> 需要注意的是，在本地缓存的是后端返回的当前帐户数据，刷新时会对页面进行鉴权。因此，可以假设此方案可行，并且在用户退出时，应当将本地缓存的该数据进行清除处理。</p></blockquote><p>此处的细节较多，请多多检查。以下，给出一种解决方法。</p><p>首先，我们要保障数据的安全性，所以在项目中我们会预先在本地缓存 <code>LOGIN_TOKEN</code> ，为了简化叙述，我们假设只要本地有 <code>LOGIN_TOKEN</code>文件便可通过鉴权，直接访问页面（实际项目中，可能还需要同后端进行校验）。</p><p>我们先准备一些封装的函数，将上文中的几个基础功能函数进行封装，便于统一调用，这里我们注意它们各自所在文件，亦可通过函数名进行全文查找。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// &#39;@/utils/useMapMenus.ts&#39;</span>
<span class="token keyword">import</span> <span class="token keyword">type</span> <span class="token punctuation">{</span> RouteRecordRaw <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-router&#39;</span>

<span class="token comment">// 导入所有子路由</span>
<span class="token keyword">function</span> <span class="token function">loadLocalRoutes</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// * 路由对象都在独立的文件中</span>
  <span class="token comment">// * 从文件中将所有路由对象先读取数组中</span>
  <span class="token keyword">const</span> localRoutes<span class="token operator">:</span> RouteRecordRaw<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token comment">// 收集的所有路由对象</span>
  <span class="token comment">// 从文件中读取所有 ts 文件</span>
  <span class="token keyword">const</span> files<span class="token operator">:</span> Record<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token builtin">any</span><span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token keyword">import</span><span class="token punctuation">.</span>meta<span class="token punctuation">.</span><span class="token function">glob</span><span class="token punctuation">(</span><span class="token string">&#39;@/router/main/**/*.ts&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
    eager<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  <span class="token comment">// 加载路由</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> key <span class="token keyword">in</span> files<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> module <span class="token operator">=</span> files<span class="token punctuation">[</span>key<span class="token punctuation">]</span>
    localRoutes<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>module<span class="token punctuation">.</span>default<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> localRoutes
<span class="token punctuation">}</span>

<span class="token comment">// 从所有子路由中赛选出最终需要的子路由</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">mapMenusToRoutes</span><span class="token punctuation">(</span>userMenus<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> localRoutes <span class="token operator">=</span> <span class="token function">loadLocalRoutes</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">const</span> routes <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token comment">// 最终筛选出的路由</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> menu <span class="token keyword">of</span> userMenus<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> subMenu <span class="token keyword">of</span> menu<span class="token punctuation">.</span>child<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> route <span class="token operator">=</span> localRoutes<span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span>
        <span class="token punctuation">(</span>itemRoute<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> itemRoute<span class="token punctuation">.</span>path <span class="token operator">===</span> subMenu<span class="token punctuation">.</span>url
      <span class="token punctuation">)</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>route<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        routes<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>route<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> routes <span class="token comment">// 导出最终需要加载的子路由结果</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里，再贴出一个使用对数据进行换存封装方法，实际使用可以依据自己的项目来进行：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// &#39;@/utils/useCache.ts&#39;</span>
<span class="token keyword">enum</span> CacheType <span class="token punctuation">{</span>
  <span class="token comment">// 枚举是使用 LocalStorage 还是 sessionStorage</span>
  Local<span class="token punctuation">,</span>
  Session<span class="token punctuation">,</span>
<span class="token punctuation">}</span>
<span class="token keyword">class</span> <span class="token class-name">Cache</span> <span class="token punctuation">{</span>
  storage<span class="token operator">:</span> Storage
  <span class="token function">constructor</span><span class="token punctuation">(</span>type<span class="token operator">:</span> CacheType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 枚举匹配</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>storage <span class="token operator">=</span> type <span class="token operator">===</span> CacheType<span class="token punctuation">.</span>Local <span class="token operator">?</span> localStorage <span class="token operator">:</span> sessionStorage
  <span class="token punctuation">}</span>

  <span class="token function">setCache</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> value<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 设置本地缓存</span>
    value <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>storage<span class="token punctuation">.</span><span class="token function">setItem</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token function">getCache</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 获取缓存</span>
    <span class="token keyword">const</span> value <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>storage<span class="token punctuation">.</span><span class="token function">getItem</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token function">removeCache</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 删除指定缓存</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>storage<span class="token punctuation">.</span><span class="token function">removeItem</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  <span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 清空缓存</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>storage<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> localCache <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Cache</span><span class="token punctuation">(</span>CacheType<span class="token punctuation">.</span>Local<span class="token punctuation">)</span>
<span class="token keyword">const</span> sessionCache <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Cache</span><span class="token punctuation">(</span>CacheType<span class="token punctuation">.</span>Session<span class="token punctuation">)</span>

<span class="token keyword">export</span> <span class="token punctuation">{</span> localCache<span class="token punctuation">,</span> sessionCache <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>好了，基本的函数就是以上这几个，我们还需要注意的是，我们请求到的后端数据，我们如何进行处理。</p><p><strong>依据项目不同，处理方法有很多，我们这里先给出适用于本文的部分代码，请务必依据自身项目来进行操作</strong>：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// &#39;@/store/login/login.ts&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> defineStore <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;pinia&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> localCache <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@/utils/useCache&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> <span class="token constant">LOGIN_TOKEN</span> <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@/utils/useConst&#39;</span>
<span class="token keyword">import</span> router <span class="token keyword">from</span> <span class="token string">&#39;@/router&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> mapMenusToRoutes <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@/utils/useMapMenu&#39;</span>

<span class="token keyword">const</span> useLoginStore <span class="token operator">=</span> <span class="token function">defineStore</span><span class="token punctuation">(</span><span class="token string">&#39;loginStore&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token function-variable function">state</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
    name<span class="token operator">:</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span>
    password<span class="token operator">:</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span>
    token<span class="token operator">:</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span>
    userMenus<span class="token operator">:</span> <span class="token operator">&lt;</span><span class="token builtin">any</span><span class="token operator">&gt;</span><span class="token punctuation">[</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  actions<span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// 初次登录操作</span>
    <span class="token function">loginAction</span><span class="token punctuation">(</span>name<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> password<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name
      <span class="token keyword">this</span><span class="token punctuation">.</span>password <span class="token operator">=</span> password
      <span class="token keyword">this</span><span class="token punctuation">.</span>token <span class="token operator">=</span> <span class="token string">&#39;*******&#39;</span>

      <span class="token comment">// 1. 设置本地 TOKEN 缓存</span>
      localCache<span class="token punctuation">.</span><span class="token function">setCache</span><span class="token punctuation">(</span><span class="token constant">LOGIN_TOKEN</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>token<span class="token punctuation">)</span>

      <span class="token comment">// 依据用户信息请求菜单</span>
      <span class="token comment">// !!! 我们这里直接给出结果, 方便查看 !!!</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>userMenus <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token comment">// ... 上文的后端数据 ]</span>

      <span class="token comment">// 2. 依据请求到的菜单数据进行本地缓存</span>
      localCache<span class="token punctuation">.</span><span class="token function">setCache</span><span class="token punctuation">(</span><span class="token string">&#39;userMenus&#39;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>userMenus<span class="token punctuation">)</span>

      <span class="token comment">// 3. 动态添加路由</span>
      <span class="token comment">// 依据 mapMenusToRoutes 将后端数据转换为我们需要注册的路由数据</span>
      <span class="token keyword">const</span> routes <span class="token operator">=</span> <span class="token function">mapMenusToRoutes</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>userMenus<span class="token punctuation">)</span>
      routes<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>route<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        router<span class="token punctuation">.</span><span class="token function">addRoute</span><span class="token punctuation">(</span><span class="token string">&#39;main&#39;</span><span class="token punctuation">,</span> route<span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>

      <span class="token comment">// 跳转首页</span>
      router<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token string">&#39;/main&#39;</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>

    <span class="token comment">// 再次刷新操作</span>
    <span class="token function">loadLocalCacheAction</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 用户进行刷新,默认加载本地缓存数据</span>
      <span class="token keyword">const</span> token <span class="token operator">=</span> localCache<span class="token punctuation">.</span><span class="token function">getCache</span><span class="token punctuation">(</span><span class="token constant">LOGIN_TOKEN</span><span class="token punctuation">)</span>
      <span class="token comment">// .... 还有其它加载,如用户信息等</span>
      <span class="token keyword">const</span> userMenus <span class="token operator">=</span> localCache<span class="token punctuation">.</span><span class="token function">getCache</span><span class="token punctuation">(</span><span class="token string">&#39;userMenus&#39;</span><span class="token punctuation">)</span> <span class="token comment">// 动态加载本地缓存的目录</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>token <span class="token operator">&amp;&amp;</span> userMenus<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 本地有缓存</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>token <span class="token operator">=</span> token
        <span class="token comment">// ... 其它加载</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>userMenus <span class="token operator">=</span> userMenus
        <span class="token keyword">const</span> routes<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">mapMenusToRoutes</span><span class="token punctuation">(</span>userMenus<span class="token punctuation">)</span> <span class="token comment">// 路由同本地数据进行匹配</span>
        routes<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>route<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> router<span class="token punctuation">.</span><span class="token function">addRoute</span><span class="token punctuation">(</span><span class="token string">&#39;main&#39;</span><span class="token punctuation">,</span> route<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// 动态挂载</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> useLoginStore
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，通过这种方法，我们在 <code>Store</code> 中添加了一个刷新提取本地缓存数据的方法 <code>loadLocalCacheAction</code> 。这个方法应该添加到刷新就会访问的 根目录下的 <code>main.ts</code> 文件中，但是直接在 <code>main.ts</code> 中使用有点不大优雅，这里我们再进行一个插件封装，在 Vue3 中对插件的封装可以看《<a href="Vue02">Vue3 中的全局注册</a>》一文，此处，我们直接给出结果。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createApp <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>
<span class="token keyword">import</span> App <span class="token keyword">from</span> <span class="token string">&#39;./App.vue&#39;</span>
<span class="token keyword">import</span> router <span class="token keyword">from</span> <span class="token string">&#39;./router&#39;</span>
<span class="token keyword">import</span> registerStore <span class="token keyword">from</span> <span class="token string">&#39;./store&#39;</span>

<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">createApp</span><span class="token punctuation">(</span>App<span class="token punctuation">)</span>
app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>registerStore<span class="token punctuation">)</span> <span class="token comment">// 注册路由, 代替 pinia</span>

app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>router<span class="token punctuation">)</span>
<span class="token comment">// app.use(pinia) // 被代替的路由</span>
app<span class="token punctuation">.</span><span class="token function">mount</span><span class="token punctuation">(</span><span class="token string">&#39;#app&#39;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上，的注意点是 路由注册 (<strong><code>app.use(router)</code></strong>)需要再 <code>pinia</code> (<strong><code>app.use(registerStore)</code></strong>)之后，否则在刷新时，在没有注册 <code>pinia</code> 时，无法正常注册二级路由。</p><p>再来看看被替换的 <code>pinia</code> :</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createPinia <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;pinia&#39;</span>
<span class="token keyword">import</span> <span class="token keyword">type</span> <span class="token punctuation">{</span> App <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>
<span class="token keyword">import</span> useLoginStore <span class="token keyword">from</span> <span class="token string">&#39;./login/login&#39;</span>

<span class="token keyword">const</span> pinia <span class="token operator">=</span> <span class="token function">createPinia</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token comment">// 刷新时,提取给 pinia 本地缓存</span>
<span class="token keyword">function</span> <span class="token function">registerStore</span><span class="token punctuation">(</span>app<span class="token operator">:</span> App<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>pinia<span class="token punctuation">)</span>

  <span class="token comment">// 加载本地数据</span>
  <span class="token keyword">const</span> loginStore <span class="token operator">=</span> <span class="token function">useLoginStore</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 这里的就是前文中注册的 Store</span>
  loginStore<span class="token punctuation">.</span><span class="token function">loadLocalCacheAction</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 刷新,提前本地数据</span>
<span class="token punctuation">}</span>

<span class="token comment">// export default pinia</span>

<span class="token comment">// 改为导出 registerStore</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> registerStore
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>完成，以上就是本地数据防刷新的流程了，我们再来总结一下：</p><ul><li>对动态加载匹配的注册路由函数进行封装： <code>loadLocalRoutes</code> 导入所有路由 和 <code>mapMenusToRoutes</code> 匹配子路由；</li><li>在 LoginStore 中封装刷新加载本地数据的 <code>loadLocalCacheAction</code> 操作，内容包括 提取本地数据，注册二级路由；</li><li>对 <code>pinia</code> 进行改造，使得每次刷新数据时，防止 <code>pinia</code> 中的数据丢失。同时，在此处动态注册二级路由。</li></ul><p>其实流程不多，但是细节较多。多多体会，多多收获。</p><p>以上，感谢你的时间，也希望你也能有所收获。</p>`,36);function R(_,C){const t=d("ExternalLinkIcon");return m(),b("div",null,[g,s("p",null,[n("有了加载组件的方法，我们还需要将组件注册的途径，利用上述显式的在路由中注册当然可行，只是我们当前的需求为动态注册二级子组件，所以我们还需要用到 "),y,s("a",w,[n("API"),v(t)]),n(" 。"),f,n(" 非常灵活，可以对路由进行添加、删除和嵌套等，我们这里就是用到它的嵌套路由用法：")]),h])}const S=p(k,[["render",R],["__file","Vue04.html.vue"]]);export{S as default};
