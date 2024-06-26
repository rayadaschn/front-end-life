import{_ as e,X as n,Y as s,$ as a}from"./framework-5dd7fabc.js";const c={},t=a,i=n,l=s,o=t(`<p>首先回顾 tree 结构:</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">class</span> <span class="token class-name">TreeNode<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">&gt;</span></span> <span class="token punctuation">{</span>
  value<span class="token operator">:</span> <span class="token constant">T</span>
  LeafNode<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span>TreeNode<span class="token operator">&gt;</span>

  <span class="token function">constructor</span><span class="token punctuation">(</span>value<span class="token operator">:</span> <span class="token constant">T</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>功能需求：不同部门/用户共同管理同一套文件系统。上级部门可以管理下级部门的文件，但下级部门并无权限查看上级部门的内容。</p><p>俩棵树型结构便可很好的实现这个功能。</p><p>TreeA 管理部门用户：层级递进为：</p><div class="language-tree line-numbers-mode" data-ext="tree"><pre class="language-tree"><code>000A
  |_ 000B1
  |  |_ 000C1
  |  |_ 000C2
  |  |_ 000C3
  |_ 000B2
  |_ 000B3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>A 表示公司，B 表示不同部门，C 表示用户。</p></blockquote><p>TreeB 管理文件系统，及可想象成一个 NAS 盘下的文件目录。</p><div class="language-tree line-numbers-mode" data-ext="tree"><pre class="language-tree"><code>根目录 ~
  |_ 文件夹 a
  |  |_ 文件 1
  |  |_ 文件 2
  |  |_ 文件 3
  |_ 文件夹 b
  |_ 文件夹 c
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时便可以实现想要的功能:</p><p>如 <code>000C1</code> 用户的权限是<code>文件 1</code> 对应关系是：<code>000A|000B1|000C1 --&gt; ~/文件夹 a/文件 1</code></p><p>部门<code>000B1</code>的管理权限是<code>文件夹 a</code>对应关系是：<code>000A|000B1 --&gt; ~/文件夹 a</code></p><p>由这样的俩棵树的对应关系就有了权限管理的办法，当需要更改部门<code>000B1</code>的权限时只需要修改 TreeA 部门用户所对应的文件系统的位置（增删改查）。</p>`,13),d=[o];function p(r,u){return i(),l("div",null,d)}const m=e(c,[["render",p],["__file","Node08.html.vue"]]);export{m as default};
