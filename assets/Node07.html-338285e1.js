import{_ as i,X as o,Z as t,$ as c,V as p,W as r,F as m,Y as d}from"./framework-2eee3422.js";const v={},n=o,s=t,u=m,l=c,e=d,b=p,k=r,h=n("h1",{id:"nvm-使用技巧",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#nvm-使用技巧","aria-hidden":"true"},"#"),s(" nvm 使用技巧")],-1),_=n("blockquote",null,[n("p",null,"之前记录过一次，再更新一版")],-1),g=n("p",null,"nvm（Node Version Manager）是一款针对 Node.js 的版本管理工具。它允许用户同时安装和管理多个 Node.js 版本，并提供了一些命令行工具来快速切换不同的版本，以适应不同的使用场景。",-1),f={href:"https://github.com/nvm-sh/nvm#intro",target:"_blank",rel:"noopener noreferrer"},N=e('<p>nvm 的主要优点包括：</p><ul><li>管理 Node.js 版本：nvm 允许用户同时安装、激活、卸载不同的 Node.js 版本，避免了多个项目之间出现版本冲突或兼容性问题的情况。</li><li>快速切换版本：通过 nvm 提供的命令行工具，用户可以快速地在不同的 Node.js 版本之间进行切换，大大节省了手动更改系统环境变量或重新安装 Node.js 的时间。</li><li>管理全局模块：当切换不同的 Node.js 版本时，nvm 还可以自动为每个版本挑选相应的全局模块，在保持用户数据的独立性的同时，也确保了运行时环境的正确性。</li></ul><p>使用 nvm 进行 Node.js 版本管理时，通常需要先安装 nvm 工具本身，然后在命令行中执行相应的指令进行版本管理，例如：</p><ul><li>安装最新版本的 Node.js： nvm install node</li><li>安装指定版本的 Node.js：nvm install 14.17.0</li><li>查看已安装的 Node.js 版本：nvm ls</li><li>切换到指定版本的 Node.js：nvm use 14.17.0</li></ul><p>需要注意的是，nvm 只用于管理 Node.js 版本，不会影响和管理系统的其他环境变量或软件包。</p><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><p>官方文档提供了较多安装方法，这里记录一种较为便捷的：利用 Brew 对 nvm 进行管理，nvm 则单独拎出来对 node 进行管理。</p>',7),$=n("p",null,"Brew 的安装配置流程：",-1),w={href:"https://zhuanlan.zhihu.com/p/111014448",target:"_blank",rel:"noopener noreferrer"},j=e(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 若无法正常下载, 还需为 git 添加可信任的三个文件目录</span>
$: <span class="token function">git</span> config <span class="token parameter variable">--global</span> <span class="token parameter variable">--add</span> safe.directory /opt/homebrew/Library/Taps/homebrew/homebrew-cask
$: <span class="token function">git</span> config <span class="token parameter variable">--global</span> <span class="token parameter variable">--add</span> safe.directory /opt/homebrew/Library/Taps/homebrew/homebrew-service
$: <span class="token function">git</span> config <span class="token parameter variable">--global</span> <span class="token parameter variable">--add</span> safe.directory /opt/homebrew/Library/Taps/homebrew/homebrew-core
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),x=e(`<li><p>利用 Homebrew 安装 nvm</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 1. 安装 nvm, 会弹出英文提示, 依据英文提示进行下一步</span>
$: brew <span class="token function">install</span> nvm

<span class="token comment"># 2. 创建 .nvm 目录</span>
$: <span class="token function">mkdir</span> ~/.nvm

<span class="token comment"># 3. 依据提示继续编辑 ~/.zshrc 配置文件</span>
$: <span class="token function">vim</span> ~/.zshrc
<span class="token comment"># 在配置文件下添加如下内容</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">NVM_DIR</span><span class="token operator">=</span><span class="token string">&quot;<span class="token environment constant">$HOME</span>/.nvm&quot;</span>
 <span class="token punctuation">[</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;/opt/homebrew/opt/nvm/nvm.sh&quot;</span> <span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">.</span> <span class="token string">&quot;/opt/homebrew/opt/nvm/nvm.sh&quot;</span> <span class="token comment"># This loads nvm</span>

 <span class="token punctuation">[</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm&quot;</span> <span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">.</span> <span class="token string">&quot;/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm&quot;</span> <span class="token comment"># This loads nvm bash_completion</span>
<span class="token comment"># 按Esc退出到一般模式后, 输入 :wq 指令,保存退出</span>

<span class="token comment"># 4. 使用 source 命令使配置生效</span>
$: <span class="token builtin class-name">source</span> ~/.zshrc

<span class="token comment"># 5. 查看配置是否生效</span>
$: <span class="token builtin class-name">echo</span> <span class="token variable">$NVM_DIR</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>nvm 的使用技巧</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 1. 查看帮助</span>
$: nvm <span class="token parameter variable">-help</span>
<span class="token comment"># 删除卸载nvm只需要移除$NVM_DIR文件夹即可</span>

<span class="token comment"># 2. 安装不同版本的node</span>
$： nvm <span class="token function">install</span> <span class="token number">12</span>
$： nvm <span class="token function">install</span> <span class="token number">16</span>

<span class="token comment"># 3. 切换不同的 node 版本</span>
$: nvm use <span class="token operator">&lt;</span>version<span class="token operator">&gt;</span>
   <span class="token comment"># 如 切换 16</span>
$: nvm use <span class="token number">16</span>

<span class="token comment"># 3. 设置node 默认版本</span>
$: nvm use <span class="token number">16</span>
$: nvm <span class="token builtin class-name">alias</span> default <span class="token number">16</span>

<span class="token comment"># 4. 升级当前环境下的 node 版本, 小版本更新</span>
$: nvm install-latest-npm

<span class="token comment"># 5. 垮版本更新全局依赖包, 如从 16 到 18</span>
   <span class="token comment"># 切换到 目标 18 的环境</span>
$: nvm use <span class="token number">18</span>
   <span class="token comment"># 更新 16 的全局依赖，这里的 16 为 包的版本 version</span>
$: nvm reinstall-packages <span class="token number">16</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后，当不记得指令时，请善用 <code>nvm --help</code> 查看帮助！这个比搜指令快的多。</p></li>`,2);function V(q,B){const a=u("ExternalLinkIcon");return b(),k("div",null,[h,_,g,n("p",null,[s("官方文档: "),n("a",f,[s("Nvm 官方文档"),l(a)])]),N,n("ol",null,[n("li",null,[$,n("p",null,[n("a",w,[s("Homebrew"),l(a)])]),j]),x])])}const T=i(v,[["render",V],["__file","Node07.html.vue"]]);export{T as default};
