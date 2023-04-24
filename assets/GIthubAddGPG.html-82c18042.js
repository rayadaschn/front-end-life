import{_ as l,V as t,W as c,X as n,Y as e,Z as a,$ as i,F as d}from"./framework-2060dede.js";const r={},p=i(`<h1 id="github-添加-gpg-签名" tabindex="-1"><a class="header-anchor" href="#github-添加-gpg-签名" aria-hidden="true">#</a> GIthub 添加 GPG 签名</h1><p>出于参与开源项目或是保护自身开源项目的安全考虑，在 GIthub 分支保护中，有一项 GPG 签名的设置。</p><p>当然，这不是它诞生的主要目的。我们可以看看提交的 Commit 记录，发现就算是不一个账号，如果在本地的 <code>git config</code> 中设置相同的 user 信息，最终提交的用户就是一样的。这个在网上有一个很形象的比喻：你的同事获取到了你的 <code>git config</code> ，便可以假装你删库跑路了。哈哈哈哈</p><p>而签名就是可以证明，你是不是真正的代码提交者，所以可以用于可靠的代码审计和追踪了。（删库跑路也不行了）</p><h2 id="安装-gpg-生成秘钥" tabindex="-1"><a class="header-anchor" href="#安装-gpg-生成秘钥" aria-hidden="true">#</a> 安装 GPG 生成秘钥</h2><p>在 MacOS 下，我们利用 brew 包进行下载：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: brew <span class="token function">install</span> gpg
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>安装完毕，进行验证：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: gpg <span class="token parameter variable">--help</span>
gpg <span class="token punctuation">(</span>GnuPG<span class="token punctuation">)</span> <span class="token number">2.2</span>.27
libgcrypt <span class="token number">1.8</span>.8
Copyright <span class="token punctuation">(</span>C<span class="token punctuation">)</span> <span class="token number">2021</span> Free Software Foundation, Inc.
License GNU GPL-3.0-or-later <span class="token operator">&lt;</span>https://gnu.org/licenses/gpl.html<span class="token operator">&gt;</span>
This is <span class="token function">free</span> software: you are <span class="token function">free</span> to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Home: /home/xxxx/.gnupg
支持的算法：
公钥： RSA, ELG, DSA, ECDH, ECDSA, EDDSA
密文： IDEA, 3DES, CAST5, BLOWFISH, AES, AES192, AES256, TWOFISH,
    CAMELLIA128, CAMELLIA192, CAMELLIA256
散列： SHA1, RIPEMD160, SHA256, SHA384, SHA512, SHA224
压缩：  不压缩, ZIP, ZLIB, BZIP2

语法：gpg <span class="token punctuation">[</span>options<span class="token punctuation">]</span> <span class="token punctuation">[</span>files<span class="token punctuation">]</span>
签名、检查、加密或解密
默认的操作依输入数据而定

命令：

 -s, <span class="token parameter variable">--sign</span>                  生成一份签名
     --clear-sign            生成一份明文签名
 -b, --detach-sign           生成一份分离的签名
 -e, <span class="token parameter variable">--encrypt</span>               加密数据
 -c, <span class="token parameter variable">--symmetric</span>             仅使用对称密文加密
 -d, <span class="token parameter variable">--decrypt</span>               解密数据（默认）
     <span class="token parameter variable">--verify</span>                验证签名
 -k, --list-keys             列出密钥
     --list-signatures       列出密钥和签名
     --check-signatures      列出并检查密钥签名
     <span class="token parameter variable">--fingerprint</span>           列出密钥和指纹
 -K, --list-secret-keys      列出私钥
     --generate-key          生成一个新的密钥对
     --quick-generate-key    快速生成一个新的密钥对
     --quick-add-uid         快速添加一个新的用户标识
     --quick-revoke-uid      快速吊销一个用户标识
     --quick-set-expire      快速设置一个过期日期
     --full-generate-key     完整功能的密钥对生成
     --generate-revocation   生成一份吊销证书
     --delete-keys           从公钥钥匙环里删除密钥
     --delete-secret-keys    从私钥钥匙环里删除密钥
     --quick-sign-key        快速签名一个密钥
     --quick-lsign-key       快速本地签名一个密钥
     --quick-revoke-sig      quickly revoke a key signature
     --sign-key              签名一个密钥
     --lsign-key             本地签名一个密钥
     --edit-key              签名或编辑一个密钥
     --change-passphrase     更改密码
     <span class="token parameter variable">--export</span>                导出密钥
     --send-keys             个密钥导出到一个公钥服务器上
     --receive-keys          从公钥服务器上导入密钥
     --search-keys           在公钥服务器上搜索密钥
     --refresh-keys          从公钥服务器更新所有密钥
     <span class="token parameter variable">--import</span>                导入/合并密钥
     --card-status           打印卡片状态
     --edit-card             更改卡片上的数据
     --change-pin            更改卡片的 PIN
     --update-trustdb        更新信任数据库
     --print-md              打印消息摘要
     <span class="token parameter variable">--server</span>                以服务器模式运行
     --tofu-policy VALUE     设置一个密钥的 TOFU 政策

选项：

 -a, <span class="token parameter variable">--armor</span>                 创建 ASCII 字符封装的输出
 -r, <span class="token parameter variable">--recipient</span> <span class="token environment constant">USER</span>-ID     为 <span class="token environment constant">USER</span>-ID 加密
 -u, --local-user <span class="token environment constant">USER</span>-ID    使用 <span class="token environment constant">USER</span>-ID 来签名或者解密
 <span class="token parameter variable">-z</span> N                        设置压缩等级为 N （0 为禁用）
     <span class="token parameter variable">--textmode</span>              使用规范的文本模式
 -o, <span class="token parameter variable">--output</span> FILE           写输出到 FILE
 -v, <span class="token parameter variable">--verbose</span>               详细模式
 -n, --dry-run               不做任何更改
 -i, <span class="token parameter variable">--interactive</span>           覆盖前提示
     <span class="token parameter variable">--openpgp</span>               使用严格的 OpenPGP 行为

（请参考手册页以获得所有命令和选项的完整列表）

例子：

 <span class="token parameter variable">-se</span> <span class="token parameter variable">-r</span> Bob <span class="token punctuation">[</span>file<span class="token punctuation">]</span>          为用户 Bob 签名和加密
 --clear-sign <span class="token punctuation">[</span>file<span class="token punctuation">]</span>        创建一个明文签名
 --detach-sign <span class="token punctuation">[</span>file<span class="token punctuation">]</span>       创建一个分离签名
 --list-keys <span class="token punctuation">[</span>names<span class="token punctuation">]</span>        列出密钥
 <span class="token parameter variable">--fingerprint</span> <span class="token punctuation">[</span>names<span class="token punctuation">]</span>      显示指纹
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>生产密钥对:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">## 生成新的密钥对</span>
<span class="token comment">## 以专家模式生成可以添加 --expert 选项</span>
$: gpg --gen-key
$: gpg --generate-key

<span class="token comment">## 以全功能形式生成新的密钥对（期间会有一些密钥的配置）</span>
$: gpg --full-generate-key
$: gpg --full-gen-key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>生成的密钥对一般放在<code>~/.gnupg</code>目录下。</p><p>本文用 <code>gpg --full-gen-key</code> 按照提示进行，需要说明的是，<code>name</code> 和 <code>email</code> 还是应当同 <code>git config</code> 中保持一致。</p><p>生成流程如下:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: gpg --generate-key
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
gpg: revocation certificate stored as <span class="token string">&#39;/Users/xxx...xxx/openpgp-revocs.d/---------.rev&#39;</span>
public and secret key created and signed.

pub   edxxx <span class="token number">2023</span>-xx-xx <span class="token punctuation">[</span>SC<span class="token punctuation">]</span> <span class="token punctuation">[</span>expires: <span class="token number">2025</span>-xx-xx<span class="token punctuation">]</span>
      C1Fxxxxxxx79D
uid                      userName <span class="token operator">&lt;</span>xxxxxxx@github.com<span class="token operator">&gt;</span>
sub   cvxxx <span class="token number">2023</span>-xx-xx <span class="token punctuation">[</span>E<span class="token punctuation">]</span> <span class="token punctuation">[</span>expires: <span class="token number">2025</span>-xx-xx<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要注意的是，这里的主公钥名称为**[PRIMARYKEYID]**： <code>C1Fxxxxxxx79D</code> 。</p><p>再对上述结果进行说明:</p><ul><li><p><code>pub</code> : 显示的是公钥特性。加密算法为 <code>ed25519</code>，然后是时间，主密钥：<code>C1Fxxxxxxx79D</code> 。</p><p>如果你选择了其它加密算法，则依据具体情况而定，如 <code>RSA</code> ： <code>pub 4096R/EDDD6D76 2022-03-15</code>。这串的释义是 RSA 加密的公钥特征（4096 位，Hash 字符串和生成时间）</p></li><li><p><code>uid</code>: 为用户 ID；</p></li><li><p><code>sub</code>： 显示私钥特征。</p></li></ul><blockquote><p>生成密钥之后 建议生成一张&quot;撤销证书&quot;，用于密钥作废时，可以请求外部的公钥服务器撤销公钥。</p><p>命令为:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: gpg --gen-revoke <span class="token punctuation">[</span>用户ID<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>此处的 用户 ID 可以是用户邮箱</p></blockquote><p>设置 git 电子邮箱（此处，可全局也可局部设置，依据项目来）：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">git</span> config <span class="token parameter variable">--global</span> user.email <span class="token string">&quot;xxxxxxx@github.com&quot;</span>

<span class="token comment"># --global 全局配置</span>
<span class="token comment"># --local 仓库级配置</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Step 1</strong>：列出签名的公钥</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: gpg --list-keys
$: gpg --list-key <span class="token punctuation">[</span>用户ID<span class="token punctuation">]</span>


/xxxx<span class="token punctuation">..</span>.xxxx/pubring.kbx
-----------------------------
pub   edxxx <span class="token number">2023</span>-xx-xx <span class="token punctuation">[</span>SC<span class="token punctuation">]</span> <span class="token punctuation">[</span>expires: <span class="token number">2025</span>-xx-xx<span class="token punctuation">]</span>
      C1Fxxxxxxx79D
uid           <span class="token punctuation">[</span>ultimate<span class="token punctuation">]</span> yourName <span class="token operator">&lt;</span>xxxxxxx@github.com<span class="token operator">&gt;</span>
sub   cvxxx <span class="token number">2023</span>-xx-xx <span class="token punctuation">[</span>E<span class="token punctuation">]</span> <span class="token punctuation">[</span>expires: <span class="token number">2025</span>-xx-xx<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>列出私钥：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: gpg --list-secret-keys
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,25),o=n("strong",null,"Step 2",-1),u={href:"https://docs.github.com/cn/authentication/managing-commit-signature-verification/adding-a-new-gpg-key-to-your-github-account",target:"_blank",rel:"noopener noreferrer"},v=i(`<p><strong>Step 3</strong>：修改本地 git 配置</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">git</span> config <span class="token parameter variable">--global</span> user.signingkey <span class="token punctuation">[</span>PRIMARYKEYID<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>其中 <strong>PRIMARYKEYID</strong> 为主公钥 <code>C1Fxxxxxxx79D</code></li></ul><p><strong>Step 4</strong>：（可选）macOS 如果使用时需要输入密码，请安装 <code>pinentry-mac</code>。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: brew <span class="token function">install</span> pinentry-mac

$: <span class="token builtin class-name">echo</span> <span class="token string">&quot;pinentry-program <span class="token variable"><span class="token variable">$(</span><span class="token function">which</span> pinentry-mac<span class="token variable">)</span></span>&quot;</span> <span class="token operator">&gt;&gt;</span> ~/.gnupg/gpg-agent.conf

$: <span class="token function">killall</span> gpg-agent
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Step 5</strong>：对提交进行签名</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">git</span> commit <span class="token parameter variable">-S</span> <span class="token parameter variable">-m</span> <span class="token string">&quot;your commit message&quot;</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>列出秘钥:</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: gpg --list-keys
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>删除私钥:</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: gpg --delete-secret-keys your@email.addr
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code>your@email.addr</code> 为你加密的邮箱，在 <code>uid</code>中显示</p><ul><li>删除公钥：</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: gpg --delete-keys your@email.addr
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>删除私钥和公钥:</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: gpg --delete-secret-and-public-key your@email.addr
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li><p>添加子公钥:</p><p>GPG 提供了交互式添加子密钥的方法，<code>gpg --expert --edit-key [用户ID]</code> 进入交互式密钥编辑，使用 <code>addkey</code> 添加子密钥。</p></li></ul><h2 id="参考文档" tabindex="-1"><a class="header-anchor" href="#参考文档" aria-hidden="true">#</a> 参考文档</h2>`,28),m={href:"https://zhuanlan.zhihu.com/p/137801979",target:"_blank",rel:"noopener noreferrer"},b={href:"https://www.yangqi.show/posts/gpg-github",target:"_blank",rel:"noopener noreferrer"},g={href:"https://www.bitlogs.tech/2019/01/gpg%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/",target:"_blank",rel:"noopener noreferrer"};function k(h,x){const s=d("ExternalLinkIcon");return t(),c("div",null,[p,n("p",null,[o,e("：在 GitHub 中添加 GPG 公钥。具体步骤参照 "),n("a",u,[e("这里"),a(s)])]),v,n("ul",null,[n("li",null,[n("a",m,[e("简明 GPG 概念"),a(s)])]),n("li",null,[n("a",b,[e("使用 GPG 为 GIthub 签名"),a(s)])]),n("li",null,[n("a",g,[e("GPG 教程"),a(s)])])])])}const f=l(r,[["render",k],["__file","GIthubAddGPG.html.vue"]]);export{f as default};
