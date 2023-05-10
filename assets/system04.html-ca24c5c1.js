import{_ as e,X as i,Z as t,$ as l,V as o,W as c,F as p,Y as r}from"./framework-2eee3422.js";const d={},n=i,s=t,u=p,v=l,m=r,b=o,h=c,k=n("h1",{id:"为-macos-设置终端代理",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#为-macos-设置终端代理","aria-hidden":"true"},"#"),s(" 为 MacOS 设置终端代理")],-1),_=n("h2",{id:"环境",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#环境","aria-hidden":"true"},"#"),s(" 环境")],-1),x={href:"https://github.com/yichengchen/clashX/tags",target:"_blank",rel:"noopener noreferrer"},g=n("strong",null,"7890",-1),f=m(`<h2 id="为终端设置代理" tabindex="-1"><a class="header-anchor" href="#为终端设置代理" aria-hidden="true">#</a> 为终端设置代理</h2><ol><li><p>临时配置</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token builtin class-name">export</span> <span class="token assign-left variable">http_proxy</span><span class="token operator">=</span>http://127.0.0.1:7890
$: <span class="token builtin class-name">export</span> <span class="token assign-left variable">https_proxy</span><span class="token operator">=</span><span class="token variable">$http_proxy</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>此时已设置好代理。</p></li><li><p>快捷指令脚本</p><p>临时设置，代码过长，因此为其设置快捷指令。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 脚本内容</span>
<span class="token comment"># 开启代理</span>
<span class="token keyword">function</span> <span class="token function-name function">proxy_on</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token builtin class-name">export</span> <span class="token assign-left variable">http_proxy</span><span class="token operator">=</span>http://127.0.0.1:7890
    <span class="token builtin class-name">export</span> <span class="token assign-left variable">https_proxy</span><span class="token operator">=</span><span class="token punctuation">\\</span><span class="token variable">$http_proxy</span>
    <span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;终端代理已开启。&quot;</span>
<span class="token punctuation">}</span>

<span class="token comment"># 关闭代理</span>
<span class="token keyword">function</span> <span class="token function-name function">proxy_off</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token builtin class-name">unset</span> http_proxy https_proxy
    <span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;终端代理已关闭。&quot;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>指令脚本，我们一般写在 <code>~/.bash_profile</code> 内，因此，我们可以在终端输入如下指令，自动创建该文件。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&gt;</span> ~/.bash_profile <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
function proxy_on() {
    export http_proxy=http://127.0.0.1:7890
    export https_proxy=\\<span class="token variable">$http_proxy</span>
    echo -e &quot;终端代理已开启。&quot;
}

function proxy_off(){
    unset http_proxy https_proxy
    echo -e &quot;终端代理已关闭。&quot;
}
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建完脚本指令后，我们还需为每次打开 zsh 或者 终端 去 <code>source ~/.bash_profile</code> 该脚本。因此，我们应该在 <code>~/.zshrc</code> 中末尾追加该指令</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># ~/.zshrc 文件</span>
<span class="token comment"># .... 其它配置</span>

<span class="token builtin class-name">source</span> ~/.bash_profile
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h2 id="验证" tabindex="-1"><a class="header-anchor" href="#验证" aria-hidden="true">#</a> 验证</h2><p>到此，我们已经完成了终端代理的设置了，可以进行验证，在 新建 终端内输入：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 开启代理</span>
$: proxy_on

<span class="token comment"># 关闭代理</span>
$: proxy_off
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="其它-为-github-设置代理" tabindex="-1"><a class="header-anchor" href="#其它-为-github-设置代理" aria-hidden="true">#</a> 其它： 为 GIthub 设置代理</h2><p>走 Github 下载时， 自动终端代理</p><p>在 <code>~/.ssh/config</code> 文件中追加设置。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 全局</span>
<span class="token comment"># ProxyCommand nc -X 5 -x 127.0.0.1:7890 %h %p</span>
<span class="token comment"># 只为特定Github设定</span>
Host github.com
    ProxyCommand <span class="token function">nc</span> <span class="token parameter variable">-X</span> <span class="token number">5</span> <span class="token parameter variable">-x</span> <span class="token number">127.0</span>.0.1:7890 %h %p
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9);function y(V,q){const a=u("ExternalLinkIcon");return b(),h("div",null,[k,_,n("p",null,[s("代理软件: "),n("a",x,[s("ClashX"),v(a)]),s(" , 软件的终端混合代理端口号默认为: "),g,s(" HTTP 代理端口号 和 Socks5 代理端口号默认未设置。")]),f])}const $=e(d,[["render",y],["__file","system04.html.vue"]]);export{$ as default};
