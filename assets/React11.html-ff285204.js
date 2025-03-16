import{_ as n,X as s,Y as a,$ as e}from"./framework-5dd7fabc.js";const t={},i=e,p=s,l=a,c=i(`<p>title: React 之 Fiber 算法 icon: react date: 2024-03-16 category:</p><ul><li>框架 tag:</li><li>React sticky: false</li></ul><p>Fiber 是 React 16 引入的，是 React 内部为了解决 异步可中断渲染 而设计的 核心架构和算法。</p><p>简单理解：Fiber 是 React 重新设计的虚拟 DOM 树结构，将一次复杂的更新任务拆成小块，每一块都是一个 Fiber 节点，允许中断和恢复，提高流畅性和优先级控制。</p><p>出现原因:</p><p>React 以前的 Reconciliation 是 递归调用，从父到子同步遍历、比对和更新。缺点：</p><ol><li>一次更新任务全部做完，中途不能打断</li><li>如果组件树很深、节点很多，更新时间太长 ➔ 页面卡顿</li><li>无法优先渲染高优先级任务</li></ol><h2 id="fiber-的实现机制" tabindex="-1"><a class="header-anchor" href="#fiber-的实现机制" aria-hidden="true">#</a> Fiber 的实现机制</h2><h3 id="_1-fiber-节点结构" tabindex="-1"><a class="header-anchor" href="#_1-fiber-节点结构" aria-hidden="true">#</a> 1. Fiber 节点结构</h3><p>每个 <strong>Fiber 节点</strong> 都是 JS 对象，描述一个虚拟 DOM 节点。</p><p>关键属性：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token punctuation">{</span>
  type<span class="token punctuation">,</span>            <span class="token comment">// 组件类型 (函数组件/类组件/div)</span>
  key<span class="token punctuation">,</span>             <span class="token comment">// diff 过程中用于识别</span>
  child<span class="token punctuation">,</span>           <span class="token comment">// 第一个子 Fiber</span>
  sibling<span class="token punctuation">,</span>         <span class="token comment">// 下一个兄弟 Fiber</span>
  <span class="token keyword">return</span><span class="token punctuation">,</span>          <span class="token comment">// 父 Fiber</span>
  stateNode<span class="token punctuation">,</span>       <span class="token comment">// 对应的真实 DOM 或组件实例</span>
  pendingProps<span class="token punctuation">,</span>    <span class="token comment">// 新传入的 props</span>
  memoizedState<span class="token punctuation">,</span>   <span class="token comment">// state</span>
  alternate<span class="token punctuation">,</span>       <span class="token comment">// 上一次的 Fiber (用于 diff)</span>
  flags<span class="token punctuation">,</span>           <span class="token comment">// 标记需要做什么操作 (新增、删除等)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>特点：</strong></p><ul><li>采用 <strong>单链表结构</strong>，可以灵活暂停、恢复。</li><li>每个 Fiber 对应一个虚拟 DOM 节点。</li></ul><h3 id="_2-工作流程核心-—-两个阶段" tabindex="-1"><a class="header-anchor" href="#_2-工作流程核心-—-两个阶段" aria-hidden="true">#</a> 2. 工作流程核心 — <strong>两个阶段</strong></h3><h4 id="_1-render-phase-协调阶段-可中断" tabindex="-1"><a class="header-anchor" href="#_1-render-phase-协调阶段-可中断" aria-hidden="true">#</a> 1) <strong>Render Phase（协调阶段，可中断）</strong></h4><p><strong>目标</strong>：构建和比较 Fiber 树，找出需要更新的地方。</p><p>过程：</p><ul><li>从根节点开始，深度优先遍历，创建新的 Fiber 节点。</li><li>每处理完一个 Fiber，浏览器有空闲时间就执行下一个。</li><li>使用 <code>requestIdleCallback</code> 或 <code>scheduler</code> 做时间切片。</li></ul><p><strong>特点</strong>：</p><ul><li><strong>可以中断</strong></li><li>产生“EffectList” ➔ 记录副作用（如需要插入、删除哪些 DOM）</li></ul><h4 id="_2-commit-phase-提交阶段-不可中断" tabindex="-1"><a class="header-anchor" href="#_2-commit-phase-提交阶段-不可中断" aria-hidden="true">#</a> 2) <strong>Commit Phase（提交阶段，不可中断）</strong></h4><p><strong>目标</strong>：根据 EffectList 操作真实 DOM。</p><p>过程：</p><ul><li>执行 DOM 插入、删除、更新</li><li>执行生命周期 hooks（比如 <code>componentDidMount</code>）</li></ul><p><strong>特点</strong>：</p><ul><li><strong>同步执行，快速完成，避免页面闪烁</strong></li></ul><h3 id="_3-时间切片机制" tabindex="-1"><a class="header-anchor" href="#_3-时间切片机制" aria-hidden="true">#</a> 3. 时间切片机制</h3><p>利用浏览器 <strong>requestIdleCallback / MessageChannel / Scheduler</strong> 判断是否需要让出主线程。</p><p>React 会给每个更新分配一个 <strong>优先级（Lane）</strong>，例如：</p><ul><li>用户输入 ➔ 高优先级</li><li>动画 ➔ 高优先级</li><li>数据请求渲染 ➔ 低优先级</li></ul><p>这样可以<strong>先处理高优先级任务</strong>，空闲再渲染低优先级任务。</p><h2 id="流程总结图" tabindex="-1"><a class="header-anchor" href="#流程总结图" aria-hidden="true">#</a> 流程总结图</h2><div class="language-plaintext line-numbers-mode" data-ext="plaintext"><pre class="language-plaintext"><code>    更新开始
       ↓
   Render Phase (可中断)
       ↓
   构建 Fiber 树 + EffectList
       ↓
   Commit Phase (同步)
       ↓
   更新真实 DOM
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="具体示例理解" tabindex="-1"><a class="header-anchor" href="#具体示例理解" aria-hidden="true">#</a> 具体示例理解</h2><p>假设你有一个页面：</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>count<span class="token punctuation">,</span> setCount<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>

  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">{</span>count<span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setCount</span><span class="token punctuation">(</span>count <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">Add</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">BigList</span></span> <span class="token punctuation">/&gt;</span></span><span class="token plain-text"> // 渲染一个大列表
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>BigList</code> 里面有几千个 <code>&lt;li&gt;</code>。</p><ol><li><p>点击按钮后，触发 <code>setCount</code>，更新开始。</p></li><li><p>React 会：</p><ul><li>从根节点开始，创建新的 Fiber 树。</li><li>先走到 <code>&lt;h1&gt;</code> 和 <code>&lt;button&gt;</code>，快速更新。</li><li><strong>遇到 BigList，Fiber 会一行一行拆分小任务</strong>，如果当前帧时间不够，停下来，下一帧再继续。</li></ul></li><li><p>浏览器空闲 ➔ Fiber 继续处理 BigList。</p></li></ol>`,39),o=[c];function r(u,d){return p(),l("div",null,o)}const v=n(t,[["render",r],["__file","React11.html.vue"]]);export{v as default};
