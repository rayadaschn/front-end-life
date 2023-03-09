import{_ as t,V as l,W as o,X as n,Y as s,Z as e,a0 as i,F as c}from"./framework-acd93724.js";const r={},p=i(`<h1 id="github添加gpg-签名" tabindex="-1"><a class="header-anchor" href="#github添加gpg-签名" aria-hidden="true">#</a> GIthub添加GPG 签名</h1><p>出于参与开源项目或是保护自身开源项目的安全考虑，在 GIthub 分支保护中，有一项 GPG 签名的设置。</p><p>当然，这不是它诞生的主要目的。我们可以看看提交的 Commit 记录，发现就算是不一个账号，如果在本地的 <code>git config</code> 中设置相同的 user 信息，最终提交的用户就是一样的。这个在网上有一个很形象的比喻：你的同事获取到了你的 <code>git config</code> ，便可以假装你删库跑路了。哈哈哈哈</p><p>而签名就是可以证明，你是不是真正的代码提交者，所以可以用于可靠的代码审计和追踪了。（删库跑路也不行了）</p><h2 id="安装-gpg-生成秘钥" tabindex="-1"><a class="header-anchor" href="#安装-gpg-生成秘钥" aria-hidden="true">#</a> 安装 GPG 生成秘钥</h2><p>在 MacOS 下，我们利用 brew 包进行下载：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: brew <span class="token function">install</span> gpg  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>生产密钥对:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: gpg --full-gen-key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>按照提示进行，需要说明的是，<code>name</code> 和 <code>email</code> 还是应当同 <code>git config</code> 中保持一致。</p><p>生成流程如下:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: gpg --generate-key
gpg <span class="token punctuation">(</span>GnuPG<span class="token punctuation">)</span> <span class="token number">2.4</span>.0<span class="token punctuation">;</span> Copyright <span class="token punctuation">(</span>C<span class="token punctuation">)</span> <span class="token number">2021</span> Free Software Foundation, Inc.
This is <span class="token function">free</span> software: you are <span class="token function">free</span> to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Note: Use <span class="token string">&quot;gpg --full-generate-key&quot;</span> <span class="token keyword">for</span> a full featured key generation dialog.

GnuPG needs to construct a user ID to identify your key.

Real name: userName
Email address: xxxxxxx@github.com
You selected this <span class="token environment constant">USER</span>-ID:
    <span class="token string">&quot;userName &lt;xxxxxxx@github.com&gt;&quot;</span>

Change <span class="token punctuation">(</span>N<span class="token punctuation">)</span>ame, <span class="token punctuation">(</span>E<span class="token punctuation">)</span>mail, or <span class="token punctuation">(</span>O<span class="token punctuation">)</span>kay/<span class="token punctuation">(</span>Q<span class="token punctuation">)</span>uit? o
We need to generate a lot of random bytes. It is a good idea to perform
some other action <span class="token punctuation">(</span>type on the keyboard, move the mouse, utilize the
disks<span class="token punctuation">)</span> during the prime generation<span class="token punctuation">;</span> this gives the random number
generator a better chance to gain enough entropy.
We need to generate a lot of random bytes. It is a good idea to perform
some other action <span class="token punctuation">(</span>type on the keyboard, move the mouse, utilize the
disks<span class="token punctuation">)</span> during the prime generation<span class="token punctuation">;</span> this gives the random number
generator a better chance to gain enough entropy.
gpg: revocation certificate stored as <span class="token string">&#39;/Users/huy/.gnupg/openpgp-revocs.d/---------.rev&#39;</span>
public and secret key created and signed.

pub   ed25519 <span class="token number">2023</span>-03-09 <span class="token punctuation">[</span>SC<span class="token punctuation">]</span> <span class="token punctuation">[</span>expires: <span class="token number">2025</span>-03-08<span class="token punctuation">]</span>
      C1F89F0xxxxxxxxxxxxxD
uid                      userName <span class="token operator">&lt;</span>xxxxxxx@github.com<span class="token operator">&gt;</span>
sub   cv25519 <span class="token number">2023</span>-03-09 <span class="token punctuation">[</span>E<span class="token punctuation">]</span> <span class="token punctuation">[</span>expires: <span class="token number">2025</span>-03-08<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要注意的是，这里的公钥名称为： <code>C1F89F0xxxxxxxxxxxxxD</code> 。</p><p>设置 git 电子邮箱（此处，可全局也可局部设置，依据项目来）：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">git</span> config <span class="token parameter variable">--global</span> user.email <span class="token string">&quot;xxxxxxx@github.com&quot;</span>

<span class="token comment"># --global 全局配置</span>
<span class="token comment"># --local 仓库级配置</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Step 1</strong>：导出用于签名的 PGP 公钥</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: gpg <span class="token parameter variable">-a</span> <span class="token parameter variable">--export</span> <span class="token punctuation">[</span>PRIMARYKEYID<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,17),d=n("strong",null,"Step 2",-1),u={href:"https://docs.github.com/cn/authentication/managing-commit-signature-verification/adding-a-new-gpg-key-to-your-github-account",target:"_blank",rel:"noopener noreferrer"},v=i(`<p><strong>Step 3</strong>：修改本地 git 配置</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">git</span> config <span class="token parameter variable">--global</span> user.signingkey <span class="token punctuation">[</span>PRIMARYKEYID<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>Step 4</strong>：（可选）macOS 如果使用时需要输入密码，请安装 <code>pinentry-mac</code>。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: brew <span class="token function">install</span> pinentry-mac


$: <span class="token builtin class-name">echo</span> <span class="token string">&quot;pinentry-program <span class="token variable"><span class="token variable">$(</span><span class="token function">which</span> pinentry-mac<span class="token variable">)</span></span>&quot;</span> <span class="token operator">&gt;&gt;</span> ~/.gnupg/gpg-agent.conf


$: <span class="token function">killall</span> gpg-agent
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Step 5</strong>：对提交进行签名</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">git</span> commit <span class="token parameter variable">-S</span> <span class="token parameter variable">-m</span> <span class="token string">&quot;your commit message&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol><li>当本地分支中的提交更改时，请将 S 标志添加到 git commit 命令；</li><li>输入密码；</li><li>在本地完成创建提交后，将其推送到 GitHub 上的远程仓库 <code>git push</code>；</li><li>在 GitHub 对应的代码仓库，检查 commit 信息：Verified（已验证）。</li></ol><p><strong>Step 6</strong>：对标签进行签名</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 本地签名打tag</span>
$: <span class="token function">git</span> tag <span class="token parameter variable">-s</span> v1.0.0 <span class="token parameter variable">-m</span> <span class="token string">&quot;my version 1.0.0&quot;</span>

<span class="token comment"># 验证tag签名</span>
$: <span class="token function">git</span> tag <span class="token parameter variable">-v</span> v1.0.0

<span class="token comment"># 推送远程仓库</span>
$: <span class="token function">git</span> push <span class="token parameter variable">--tag</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="其它常用指令" tabindex="-1"><a class="header-anchor" href="#其它常用指令" aria-hidden="true">#</a> 其它常用指令</h2><ul><li>设置自动签名:</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">git</span> config <span class="token parameter variable">--global</span> commit.gpgsign <span class="token boolean">true</span>

<span class="token comment"># --global 全局配置</span>
<span class="token comment"># --local 仓库级配置</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>查看 Commit 签名信息:</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">git</span> log --show-signature
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>引入 GitHub 公钥</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 引入 github 公钥</span>
$: <span class="token function">curl</span> https://github.com/web-flow.gpg <span class="token operator">|</span> gpg <span class="token parameter variable">--import</span>
<span class="token comment"># 签署 github 公钥</span>
$: gpg --lsign-key GitHub
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考文档" tabindex="-1"><a class="header-anchor" href="#参考文档" aria-hidden="true">#</a> 参考文档</h2>`,17),m={href:"https://www.yangqi.show/posts/gpg-github",target:"_blank",rel:"noopener noreferrer"};function g(b,h){const a=c("ExternalLinkIcon");return l(),o("div",null,[p,n("p",null,[d,s("：在 GitHub 中添加 GPG 公钥。具体步骤参照 "),n("a",u,[s("这里"),e(a)])]),v,n("p",null,[n("a",m,[s("使用 GPG 为 GIthub 签名"),e(a)])])])}const x=t(r,[["render",g],["__file","GIthub添加GPG 签名.html.vue"]]);export{x as default};
