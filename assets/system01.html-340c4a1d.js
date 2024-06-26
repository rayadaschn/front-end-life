import{_ as i,Z as t,a0 as o,F as p,a1 as c,X as r,Y as m,$ as d}from"./framework-5dd7fabc.js";const u={},n=t,s=o,v=p,l=c,a=d,b=r,k=m,h=a('<h1 id="mac-配置记录" tabindex="-1"><a class="header-anchor" href="#mac-配置记录" aria-hidden="true">#</a> Mac 配置记录</h1><p>该博文记录新 Mac 收到后的相关配置说明，仅做记录。</p><p>[toc]</p><h2 id="mac-基本设置" tabindex="-1"><a class="header-anchor" href="#mac-基本设置" aria-hidden="true">#</a> Mac 基本设置</h2><p>初始用户名较为重要，慎重选择。</p><p>快捷键记录:</p><ul><li>系统级别 <ul><li><strong>command + w 关闭窗口</strong></li><li>command + m 最小化窗口</li><li><strong>command + q 退出当前程序</strong></li><li>command + c 复制</li><li>command + v 粘贴</li><li><strong>command + , 当前程序设置面板</strong></li><li>command + + 放大内容</li><li>command + - 缩小内容</li><li>command + s 保存</li><li>control + f 光标前进一格</li><li>control + b 光标后退一格</li><li>control + p 光标向上一行</li><li>control + n 光标向下一行</li><li>control + d 向前删除</li><li>control + h 向后删除</li><li>control + e 到行尾</li><li>control + a 到行首</li></ul></li><li>终端 <ul><li>control + w 按单词删除已输入内容</li></ul></li><li>浏览器 <ul><li><strong>command + r 刷新</strong></li><li><strong>command + l 进入地址栏</strong></li></ul></li></ul><h3 id="通用设置" tabindex="-1"><a class="header-anchor" href="#通用设置" aria-hidden="true">#</a> 通用设置</h3><ol><li><p>桌面、屏保和触发角</p></li><li><p>安全与隐私</p><p>在“允许从以下位置下载的应用中”点选“<strong>*任何来源*</strong>”，这样才能下载 Apple store 以外的免费应用。</p></li></ol><h2 id="软件安装" tabindex="-1"><a class="header-anchor" href="#软件安装" aria-hidden="true">#</a> 软件安装</h2>',10),_=n("p",null,"工具类",-1),g=a("<li><strong>柠檬清理</strong> 官网下载</li><li>the unarchiver 优秀的解压软件,应用商店下载</li><li>Google Chrome</li><li>Microsoft Edge</li><li>搜狗输入法</li><li>iRightMouse: 右键管理器</li><li>NTFS for Mac 移动硬盘读写</li><li>Typora: MarkDown 编辑器</li><li>PDF Expert : pdf 编辑器</li><li>Moment 日历记录</li>",10),f={href:"https://github.com/yichengchen/clashX/tags",target:"_blank",rel:"noopener noreferrer"},q={href:"https://maccy.app/",target:"_blank",rel:"noopener noreferrer"},$=n("li",null,[n("strong",null,"Hidden Bar"),s(" 隐藏菜单栏过多, 应用商店下载。")],-1),x=n("li",null,"Drink 提示喝水, 应用商店下载",-1),w=n("li",null,"欧路词典",-1),y=n("li",null,"有道云笔记",-1),M=n("li",null,"Photoshop",-1),N=n("li",null,"Finally Cut Pro",-1),T=n("li",null,"Compressor 视频导出",-1),V=n("li",null,"XMind: 脑图",-1),H=a("<li><p>工作类</p><ol><li>vscode</li><li>钉钉</li><li>wps</li><li>腾讯会议</li><li>微信开发者工具</li><li>小程序开发者工具</li><li>HBuilderX</li></ol></li><li><p>下载类</p><ol><li>阿里云盘</li><li>百度云盘</li><li>迅雷</li></ol></li><li><p>娱乐类</p><ol><li><p>微信</p></li><li><p>QQ</p></li><li><p>网易云音乐</p></li><li><p>IINA 视频播放器</p></li></ol></li>",3),E=n("h2",{id:"开发者",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#开发者","aria-hidden":"true"},"#"),s(" 开发者")],-1),D={href:"https://zhuanlan.zhihu.com/p/111014448",target:"_blank",rel:"noopener noreferrer"},I=a(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 若无法正常下载, 还需为 git 添加可信任的三个文件目录</span>
$: <span class="token function">git</span> config <span class="token parameter variable">--global</span> <span class="token parameter variable">--add</span> safe.directory /opt/homebrew/Library/Taps/homebrew/homebrew-cask
$: <span class="token function">git</span> config <span class="token parameter variable">--global</span> <span class="token parameter variable">--add</span> safe.directory /opt/homebrew/Library/Taps/homebrew/homebrew-service
$: <span class="token function">git</span> config <span class="token parameter variable">--global</span> <span class="token parameter variable">--add</span> safe.directory /opt/homebrew/Library/Taps/homebrew/homebrew-core
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),A={href:"https://sliu.vip/notes/iterm2/",target:"_blank",rel:"noopener noreferrer"},B=a(`<li><p>Git</p></li><li><p>nvm + node + pnpm</p><p>利用 Homebrew 安装</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 1. 安装 nvm, 会弹出英文提示, 依据英文提示进行下一步</span>
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

<span class="token comment"># 6. 查看帮助</span>
$: nvm <span class="token parameter variable">-help</span>
<span class="token comment"># 删除卸载nvm只需要移除$NVM_DIR文件夹即可</span>

<span class="token comment"># 7. 安装不同版本的node</span>
$： nvm <span class="token function">install</span> <span class="token number">12</span>
$： nvm <span class="token function">install</span> <span class="token number">16</span>

<span class="token comment"># 8. 设置node 默认版本</span>
$: nvm use <span class="token number">16</span>
$: nvm <span class="token builtin class-name">alias</span> default <span class="token number">16</span>

<span class="token comment"># 9. 升级当前的 node 版本</span>
$: nvm install-latest-npm

<span class="token comment"># 10. 垮版本更新全局依赖包, 如 16 到 18</span>
$: nvm use <span class="token number">18</span>
   <span class="token comment"># 这里的 16 为 包的版本 version</span>
$: nvm reinstall-packages <span class="token number">16</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 利用curl 直接全局安装 pnpm</span>
$: <span class="token function">curl</span> <span class="token parameter variable">-f</span> https://get.pnpm.io/v6.js <span class="token operator">|</span> <span class="token function">node</span> - <span class="token function">add</span> <span class="token parameter variable">--global</span> <span class="token function">pnpm</span>

<span class="token comment"># 验证</span>
$: <span class="token function">pnpm</span> <span class="token parameter variable">-v</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>Alfred: 搜索</p></li><li><p>Xcode</p></li><li><p>配置 ~/.bash_profile 文件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># HomeBrew</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span><span class="token string">&quot;/usr/local/bin:<span class="token environment constant">$PATH</span>&quot;</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span><span class="token string">&quot;/usr/local/sbin:<span class="token environment constant">$PATH</span>&quot;</span>
<span class="token comment"># HomeBrew END</span>

<span class="token comment"># NVM</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span><span class="token string">&quot;<span class="token environment constant">$HOME</span>/.yarn/bin:<span class="token environment constant">$HOME</span>/.config/yarn/global/node_modules/.bin:<span class="token environment constant">$PATH</span>&quot;</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">NVM_DIR</span><span class="token operator">=</span><span class="token string">&quot;<span class="token environment constant">$HOME</span>/.nvm&quot;</span>
<span class="token punctuation">[</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;<span class="token variable">$NVM_DIR</span>/nvm.sh&quot;</span> <span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>. <span class="token string">&quot;<span class="token variable">$NVM_DIR</span>/nvm.sh&quot;</span>  <span class="token comment"># This loads nvm</span>
<span class="token punctuation">[</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;<span class="token variable">$NVM_DIR</span>/bash_completion&quot;</span> <span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>. <span class="token string">&quot;<span class="token variable">$NVM_DIR</span>/bash_completion&quot;</span>  <span class="token comment"># This loads nvm bash_completion</span>

<span class="token comment"># NVM END</span>

<span class="token comment"># 代理</span>
<span class="token keyword">function</span> <span class="token function-name function">proxy_on</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token builtin class-name">export</span> <span class="token assign-left variable">http_proxy</span><span class="token operator">=</span>http://127.0.0.1:7890
    <span class="token builtin class-name">export</span> <span class="token assign-left variable">https_proxy</span><span class="token operator">=</span>http://127.0.0.1:7890
    <span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;已开启代理&quot;</span>
<span class="token punctuation">}</span>
<span class="token keyword">function</span> <span class="token function-name function">proxy_off</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token builtin class-name">unset</span> http_proxy
    <span class="token builtin class-name">unset</span> https_proxy
    <span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;已关闭代理&quot;</span>
<span class="token punctuation">}</span>
<span class="token comment"># 代理结束</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,5);function P(R,z){const e=v("ExternalLinkIcon");return b(),k("div",null,[h,n("ul",null,[n("li",null,[_,n("ol",null,[g,n("li",null,[n("a",f,[s("clashX"),l(e)]),s(" 科学上网利器")]),n("li",null,[n("strong",null,[n("a",q,[s("Maccy"),l(e)])]),s(" 优秀的剪切板工具")]),$,x,w,y,M,N,T,V])]),H]),E,n("ol",null,[n("li",null,[n("p",null,[n("a",D,[s("Homebrew"),l(e)])]),I]),n("li",null,[n("p",null,[n("a",A,[s("iTerm2 + oh-my-zsh + agnoster 配置"),l(e)])])]),B])])}const C=i(u,[["render",P],["__file","system01.html.vue"]]);export{C as default};
