import{_ as i,V as o,W as t,X as n,Y as s,Z as l,$ as a,F as c}from"./framework-2060dede.js";const r={},d=a(`<h1 id="为-mac-配置不同的-git-账号" tabindex="-1"><a class="header-anchor" href="#为-mac-配置不同的-git-账号" aria-hidden="true">#</a> 为 Mac 配置不同的 Git 账号</h1><p>[toc]</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><p>【注】全文的用户环境为 MacOS，一些文件的目录有所不同。</p><ul><li><p>检查配置</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">git</span> config <span class="token parameter variable">--list</span>  <span class="token comment"># 加 --global 为全局配置查看</span>

// 配置全局git用户名
$: <span class="token function">git</span> config <span class="token parameter variable">--global</span> user.name <span class="token string">&quot;zhangsan&quot;</span>
// 配置全局git提交邮箱
$: <span class="token function">git</span> config <span class="token parameter variable">--global</span> user.email <span class="token string">&quot;emailA@gmail.com&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>创建本地秘钥</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: ssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-C</span> <span class="token string">&#39;emailA.gmail.com&#39;</span>
<span class="token comment"># 三次回车, 可以不设置相应存储密码。emailA 的秘钥为全局git通用</span>

<span class="token comment"># 设置第二个邮箱 emailB@gmail.com</span>
$: ssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-f</span> ~/.ssh/id_rsa_emailB@gmail.com <span class="token parameter variable">-C</span> <span class="token string">&quot;emailB@gmail.com&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>远程添加公钥</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 复制邮箱的公钥(默认全局私钥为: id_rsa) 到远程</span>
$: pbcopy <span class="token operator">&lt;</span> ~/.ssh/id_rsa.pub

<span class="token comment"># 额外的第二个邮箱 emailB@gmail.com，复制公钥到远程</span>
$: pbcopy <span class="token operator">&lt;</span> ~/.ssh/id_rsa_emailB@gmail.com.pub
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>配置 <strong>config</strong> 文件</p><p>打开 git 配置文件所在文件夹： <code>open ~/.ssh</code></p><p>创建 <code>config</code> 文件（没有后缀）：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 通用配置,解决git版本过高问题</span>
Host *
UseKeychain <span class="token function">yes</span>
AddKeysToAgent <span class="token function">yes</span>
IdentityFile ~/.ssh/id_rsa
KexAlgorithms +diffie-hellman-group1-sha1

<span class="token comment"># 全局默认邮箱</span>
Host gitlab.xxx.cn
Hostname gitlab.xxx.cn
IdentityFile ~/.ssh/id_rsa
User company

<span class="token comment"># gmail</span>
Host gmail.github.com
Hostname github.com
IdentityFile ~/.ssh/id_rsa_emailB@gmail.com
User gmail
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>测试连接</p><p>格式： <code>ssh -T git@{config里面的user}.{config里面的Hostname}</code></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 全局默认的个人账户，若没有配置 config， 则直接 ssh -T git@gitlab.xxx.cn</span>
$: <span class="token function">ssh</span> <span class="token parameter variable">-T</span> git@company.gitlab.xxx.cn

<span class="token comment"># 额外配置邮箱 &lt;User&gt; 为全局配置中的 User</span>
$: <span class="token function">ssh</span> <span class="token parameter variable">-T</span> git@gmail.github.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>clone 使用</p><p>格式： <code>git clone git@{config里面的user}.{config里面的Hostname}:{具体项目地址}.git</code></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># User 为 &#39;gmail&#39;</span>
$: <span class="token function">git</span> clone git@gmail.github.com:vuejs/vue.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>不同项目不同的邮箱</p><p>由于存在多个账户，为避免提交代码时使用个人邮箱，在每个项目前，最好进行 git 邮箱检查。</p><p>若 <code>git config --list</code> 局部本地配置与预期不符，则进行局部设置。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token builtin class-name">cd</span> 项目名
<span class="token comment"># 设置该项目使用的git账号和邮箱</span>
$: <span class="token function">git</span> config user.name <span class="token string">&#39;AnotherName&#39;</span>
$: <span class="token function">git</span> config user.email <span class="token string">&#39;AnotherEmail&#39;</span>
<span class="token comment"># 查看该项目git账号是否正确</span>
$: <span class="token function">git</span> config <span class="token parameter variable">--list</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="准备" tabindex="-1"><a class="header-anchor" href="#准备" aria-hidden="true">#</a> 准备</h2>`,6),p={href:"https://git-scm.com/download",target:"_blank",rel:"noopener noreferrer"},u=a(`<p>安转完成后，验证是否安转成功：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">git</span> <span class="token parameter variable">--version</span>
// 若出现类似以下提示, 则说明安装成功
// <span class="token function">git</span> version <span class="token number">2.24</span>.3 <span class="token punctuation">(</span>Apple Git-128<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>【<strong>Tips</strong>】<code>$: </code> 表示 <code>Bash</code> 指令符，只需复制后面指令即可。</li></ul><h2 id="添加全局默认-git-账号和邮箱-用于每次提交代码" tabindex="-1"><a class="header-anchor" href="#添加全局默认-git-账号和邮箱-用于每次提交代码" aria-hidden="true">#</a> 添加全局默认 git 账号和邮箱, 用于每次提交代码</h2><p>如果需要添加全局默认 git 账号的话，可以执行此步骤。若怕忘记弄混账号，则可对此步骤忽略（并不影响后续操作）：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>// 配置全局git用户名, eg: <span class="token function">git</span> config <span class="token parameter variable">--global</span> user.name <span class="token string">&quot;zhangsan&quot;</span>
$: <span class="token function">git</span> config <span class="token parameter variable">--global</span> user.name <span class="token string">&quot;yourName&quot;</span>
// 配置全局git提交邮箱, eg: <span class="token function">git</span> config <span class="token parameter variable">--global</span> user.email <span class="token string">&quot;zhangsan@foxmail.com&quot;</span>
$: <span class="token function">git</span> config <span class="token parameter variable">--global</span> user.email <span class="token string">&quot;yourEmail&quot;</span>

// 配置完后,可以查看配置结果, 是否有 user.name 和 user.email 两项配置
$: <span class="token function">git</span> config <span class="token parameter variable">--list</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>若不需要全局默认邮箱，清空默认的用户名和邮箱</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">git</span> config <span class="token parameter variable">--global</span> <span class="token parameter variable">--unset</span> user.name
$: <span class="token function">git</span> config <span class="token parameter variable">--global</span> <span class="token parameter variable">--unset</span> user.email
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="生成秘钥" tabindex="-1"><a class="header-anchor" href="#生成秘钥" aria-hidden="true">#</a> 生成秘钥</h2><p>利用 Git 自带的加密算法，给不同的 Git 账户生成不同的 <strong>ssh-key</strong> 秘钥，如公司一个，个人一个账号（全局也算单独一个）。</p><h3 id="检查秘钥" tabindex="-1"><a class="header-anchor" href="#检查秘钥" aria-hidden="true">#</a> 检查秘钥</h3><p>检测是否生成过秘钥，进入 <code>~/.ssh</code> 文件夹，若该文件中无类似 <code>id_rsa</code> 和 <code>id_ras.pub</code> 等文件，说明没有生成过秘钥。若有，则可以手动删除，或继续执行后续步骤，将其进行覆盖</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>// 方式1: 通过 <span class="token builtin class-name">cd</span> 指令进入文件夹, 并通过 <span class="token function">ls</span> 指令查看文件夹下的所有文件
$: <span class="token builtin class-name">cd</span> ~/.ssh
$: <span class="token function">ls</span>
// 方式2: 通过 <span class="token function">open</span> 指令打开图形化的文件夹界面
$: <span class="token function">open</span> ~/.ssh/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对 <code>.ssh</code> 文件夹下的文件进行简要说明，可以后续看完全文再来回看这部分，能更好理解其作用。</p><p><strong>id_rsa</strong> : 私钥，通过 ras 算法对 git 账号生成。与公钥 <strong>id_ras.pub</strong> 是一对，注意一个 git 账号一般只有一对秘钥，当然你可以额外配置<strong>全局默认 git 秘钥</strong>，但是这样会多出来一个。私钥存放于本机中，用于与公钥验证。</p><p><strong>id_ras.pub</strong> ：公钥，与私钥是一对，文件名结尾会多一个 <code>.pub</code> 表示是公开的意思。公钥需要存放于服务器上，用于信息交互。所以后续需要把它存储的内容复制粘贴到服务器内。</p><p><strong>config</strong>: 相关配置，一般开始是没有 <code>config</code> 文件的，需要自己创建，在通过 <code>ssh</code> 连接主机时，对于不同的主机地址和密码需要不同的配置，后续会对该文件进行详细介绍。</p><p><strong>known_hosts</strong>: 记录文件(不用管它= =)，当你用 <code>ssh</code> 方式去连接主机时，该文件会记录你访问主机的公钥，如果下次你再次访问相同主机时，这个时候 <code>OpenSSH</code> 会再次核对这个公钥，如果公钥不一样，那 <code>OpenSSH</code> 会发出警告，你的公钥被人改了，提醒你可能会收到 <code>DNS Hijack</code> 之类的攻击。</p><p><strong>known_hosts_old</strong>: 字面意思，记录文件 <strong>known_hosts</strong> 的备份，也不用管它。</p><h3 id="秘钥生成" tabindex="-1"><a class="header-anchor" href="#秘钥生成" aria-hidden="true">#</a> 秘钥生成</h3><p>生成秘钥的指令特别简单：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: ssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-C</span> <span class="token string">&#39;zhangsan.foxmail.com&#39;</span>
// 三次回车, 可以不设置相应存储密码
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>// 生成SHA信息
The key&#39;s randomart image is:
+---<span class="token punctuation">[</span>RSA <span class="token number">3072</span><span class="token punctuation">]</span>----+
<span class="token operator">|</span>      <span class="token assign-left variable">o</span><span class="token operator">=</span>.o<span class="token punctuation">..</span>.    <span class="token operator">|</span>
<span class="token operator">|</span>      +o* o+     <span class="token operator">|</span>
<span class="token operator">|</span>     <span class="token punctuation">..</span> +o<span class="token operator">=</span><span class="token punctuation">..</span>.    <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token builtin class-name">.</span>    <span class="token punctuation">..</span>oo.      <span class="token operator">|</span>
<span class="token operator">|</span><span class="token builtin class-name">.</span> <span class="token builtin class-name">.</span>   <span class="token punctuation">..</span>S E      <span class="token operator">|</span>
<span class="token operator">|</span> o <span class="token punctuation">..</span> + o.*       <span class="token operator">|</span>
<span class="token operator">|</span>  <span class="token operator">=</span> +. .<span class="token operator">=</span> * <span class="token builtin class-name">.</span>    <span class="token operator">|</span>
<span class="token operator">|</span> o <span class="token operator">=</span> .oo. * + +   <span class="token operator">|</span>
<span class="token operator">|</span>  + o.o<span class="token punctuation">..</span>.+ o <span class="token builtin class-name">.</span>  <span class="token operator">|</span>
+----<span class="token punctuation">[</span>SHA256<span class="token punctuation">]</span>-----+
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>【<strong>Tips</strong>】如果该命令式默认生成，默认会 <code>~/.ssh/</code> 文件夹下 生成 <strong>id_rsa</strong> 和 <strong>id_ras.pub</strong> 俩个文件，并且此时对应的 git 账号为全局默认账号。就是上文中 <code>git config --global user.xxx </code> 所设置的。如果你要配置不同的账号，那还需如下的额外操作。</p><p><strong>假设你的全局默认 Git 账号和邮箱是你的个人账号，此时需要配置公司的 git 账号</strong> ，希望你能耐心看完。</p><p>假设你在公司的 git 邮箱是 <strong><code>yourName@company.com</code></strong> ，此时你要为这个邮箱生成相应的秘钥，为了<strong>与全局默认 git 秘钥做区分</strong>，我们将<strong>秘钥文件</strong>取名为 <strong><code>id_rsa_yourName@company.com</code></strong> ，但是你要加密的邮箱名还是 <strong><code>yourName@company.com</code></strong> ，对吧？因此，我们应当在终端键入以下指令：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: ssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-f</span> ~/.ssh/id_rsa_yourName@company.com <span class="token parameter variable">-C</span> <span class="token string">&quot;yourName@company.com&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>同样再按三次回车, 会在 <code>~/.ssh/ </code> 文件下生成相应的秘钥对 <strong><code>id_rsa_yourName@company.com</code></strong> 和 <strong><code>id_rsa_yourName@company.com.pub</code></strong> 。我们可以打开 <code>~/.ssh</code> 文件夹进行查看，如上一小节中 <strong>检查秘钥</strong> 一样，键入 <code> open ~/.ssh/</code> 查看是否有相应的文件。</p><p>同理如果你要再生成其它邮箱的 git 账号，只需将 <strong><code>yourName@company.com</code></strong> 改成 你的其它邮箱就行了。</p><h3 id="小结" tabindex="-1"><a class="header-anchor" href="#小结" aria-hidden="true">#</a> 小结</h3><ul><li>通过 <code>ssh-keygen </code> 可以对邮箱利用 ras 加密方式， 在 <code>~/.ssh/</code> 文件夹下生成相应的秘钥对。</li><li>如果要设置不同的 git 账户，在生成邮箱秘钥时，应当取相应别名；</li><li>通过指令 <code>ssh-keygen -t ras -C &#39;yourEmail&#39;</code> 生成的秘钥为全局默认 git 账户邮箱，使用它需要利用 <code>git config --global user.xxx </code> 进行全局 git 设置。</li><li><strong>如果你没有设置全局默认 git 账号和邮箱，那么全部统一按照配置额外的 git 账号设置，即： 不同邮箱重复同给公司邮箱设置 git 账号的方法。</strong> 下同！</li></ul><h2 id="远程-git-仓库-添加公钥" tabindex="-1"><a class="header-anchor" href="#远程-git-仓库-添加公钥" aria-hidden="true">#</a> 远程 <strong>Git 仓库</strong> 添加公钥</h2><p>假设同上节所述，我们现在有的秘钥：</p><ul><li>全局默认 git 账号秘钥 <strong><code>id_rsa</code></strong> ： 个人邮箱秘钥 --&gt; 在 Github 中使用</li><li>公司邮箱设置的 git 账号秘钥 <strong><code>id_rsa_yourName@company.com</code></strong> : 公司邮箱秘钥 --&gt; 在公司的 GitLab 中使用</li></ul><p>因此，我们要将<strong>不同 git 账号</strong>的 <strong>公钥</strong> ，添加到<strong>不同</strong>的 <strong>git 仓库</strong> 中去。一般在个人设置中，会有一个 <strong>SSH</strong> 的选项 --&gt; <strong>Add SSH Key</strong> 。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>// 复制个人邮箱的公钥<span class="token punctuation">(</span>私钥为: id_rsa<span class="token punctuation">)</span>
$: pbcopy <span class="token operator">&lt;</span> ~/.ssh/id_rsa.pub

// 复制公司邮箱的公钥<span class="token punctuation">(</span>私钥为: id_rsa_yourName@company.com<span class="token punctuation">)</span>
$: pbcopy <span class="token operator">&lt;</span> ~/.ssh/id_rsa_yourName@company.com.pub
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="配置-config-文件" tabindex="-1"><a class="header-anchor" href="#配置-config-文件" aria-hidden="true">#</a> 配置 <strong>config</strong> 文件</h2><p>在前文中介绍过，<code>~/.ssh/</code> 下的 <code>config</code> 文件是 Git 的配置文件。接下来，我们开始对它进行简单设置。</p><ol><li><p>首先，通过指令 <code>open ~/.ssh/</code> 打开 <code>ssh</code> 目录，打开 <code>config</code> 文件，若没有则创建该文件。</p></li><li><p>为公司账号做相应的配置（尾部的 gmail 配置作为参考用， 实际只需要设置公司邮箱部分）：</p></li></ol><p><strong>config</strong> 文件内容如下:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 通用配置,解决git版本过高问题</span>
Host *
UseKeychain <span class="token function">yes</span>
AddKeysToAgent <span class="token function">yes</span>
IdentityFile ~/.ssh/id_rsa
KexAlgorithms +diffie-hellman-group1-sha1

<span class="token comment"># 公司邮箱</span>
Host gitlab.xxx.cn
Hostname gitlab.xxx.cn
IdentityFile ~/.ssh/id_rsa_yourName@company.com
User yourName

<span class="token comment">#gmail</span>
Host gmail.github.com
Hostname github.com
IdentityFile ~/.ssh/id_rsa_xxx@gmail.com
User gmail
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们来看看配置的相关设置：</p><table><thead><tr><th>键</th><th>值</th><th>规则</th></tr></thead><tbody><tr><td>Host</td><td>主机</td><td>主机名。如果你不知道，可以填写主机名，<strong>通用配置就填 &quot;*&quot;</strong>。</td></tr><tr><td><strong>Hostname</strong></td><td>主机名</td><td>**【必须准确无误】**这里填写对应 Git 仓库的公有地址。如果你不知道，可以在 Git 仓库下通过 SSH 方式克隆一个项目，一般会出现如: <code>git@github.com:vuejs/vue.git</code> ，在 <strong>git@</strong> <strong>后面的 <code>github.com</code> 即为主机名</strong>。</td></tr><tr><td>IdentityFile</td><td>身份文件</td><td>**【写绝对路径】**相应账号的私钥存放地址，如：<code>~/.ssh/id_rsa</code></td></tr><tr><td><strong>User</strong></td><td>用户</td><td>用户名。但是建议使用同<strong>Host</strong>的前面的名称部分。如：<code>Host gmail.github.com</code> ，则填写 <code>github</code> 。在后面具体 clone 操作中都会用到这个<strong>User</strong> 用户名。本文配置中，是为了后续做区分 因此 填写的是 \`\`yourName&quot;, 在前文总结中写的是 &quot;company&quot;。</td></tr></tbody></table><p>再来看开始的通用配置，可有可无，主要用于解决 <strong><code>Unable to reach a settlement: [diffie-hellman-group1-sha1, diffie-hellman-group-exchange-sha1]...</code></strong> 的问题。许多公司的 Git 仓库还在用老旧的 <code>diffie-hellman-group1-sha1</code> 和 <code>diffie-hellman-group-exchange-sha1</code> 密钥交换算法，但是 <strong>OpenSSH</strong> 在 6.7 版本之后默认不再采用以上算法，因此我们需要在<strong>相应主机</strong>下手动添加 <code>KexAlgorithms +diffie-hellman-group1-sha1</code> 。</p><p>【<strong>Tips</strong>】我这里给出的是默认全局添加，若是公司出现类似报错，需要在公司的账户尾部添加 该设置！</p><h2 id="测试连接" tabindex="-1"><a class="header-anchor" href="#测试连接" aria-hidden="true">#</a> 测试连接</h2><p>测试 Git 账户连接：如果单个账户情况一般就是 <code>ssh -T git@xxx主机名</code> ，如果配置了 config，那么可以这样测试：<code></code><strong>ssh -T git@{config 里面的 user}.{config 里面的 Hostname}</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>// 全局默认的个人账户
$: <span class="token function">ssh</span> <span class="token parameter variable">-T</span> git@gmail.github.com

// 额外设置的公司git账户<span class="token punctuation">(</span>同上文中 config 的设置, User YourName<span class="token punctuation">)</span>
// <span class="token function">ssh</span> <span class="token parameter variable">-T</span> git@<span class="token operator">&lt;</span>User<span class="token operator">&gt;</span>.gitlab.xxx.cn
$: <span class="token function">ssh</span> <span class="token parameter variable">-T</span> git@yourName.gitlab.xxx.cn
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>**「第一次连接」**会出现主机连接验证： <code>Are you sure you want to continue connecting (yes/no/[fingerprint])? </code> <strong>输入</strong> <strong><code>yes</code></strong> <strong>回车</strong>就行了。</li><li>若连接成功则会出现类似信息:</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>Hi xxx！ You&#39;ve successfully authenticated.but GitHub does not provide shell acess
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>若<strong>连接失败</strong>，且同全文设置一样，依旧报错！请检查 <strong>Git 仓库的端口号</strong>是否正确。若是端口号错误，可以在 <code>config</code> 配置文件中，在相应账户下添加相应的 <code>Port 端口号</code> ，端口号设置； 或者自行在 诸如： <strong>GIthub</strong> 和 <strong>Gitee</strong> 等仓库进行检测。</li></ul><h2 id="使用-ssh-方法" tabindex="-1"><a class="header-anchor" href="#使用-ssh-方法" aria-hidden="true">#</a> 使用 SSH 方法</h2><p>做完上述操作后，就可以愉快玩耍啦！我们利用 <code>git clone</code> 进行检验：</p><p>【注】<code>git@github.com:vuejs/vue.git</code> 为 Github 仓库中的示例的 <strong>SSH clone</strong> 地址，<strong>公司邮箱</strong>克隆的地址这里也用这个<strong>作为示例</strong>！！！</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>// 进入要克隆的工作目录
$: <span class="token builtin class-name">cd</span> xxxx

// 利用全库默认的个人账户进行下载
$: <span class="token function">git</span> clone git@github.com:vuejs/vue.git

// 利用公司的账户进行下载
$: <span class="token function">git</span> clone git@yourName.github.com:vuejs/vue.git
// 实际上就是 <span class="token function">git</span> clone git@<span class="token operator">&lt;</span>User<span class="token operator">&gt;</span>.github.com:vuejs/vue.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="为不同项目配置不同的-git" tabindex="-1"><a class="header-anchor" href="#为不同项目配置不同的-git" aria-hidden="true">#</a> 为不同项目配置不同的 Git</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token builtin class-name">cd</span> 项目名
// 设置该项目使用的git账号和邮箱
$: <span class="token function">git</span> config user.name <span class="token string">&#39;AnotherName&#39;</span>
$: <span class="token function">git</span> config user.email <span class="token string">&#39;AnotherEmail&#39;</span>

// 若有 gpg 签名 和 设置自动签名
$: <span class="token function">git</span> config user.signingkey <span class="token string">&#39;PRIMARYKEYID&#39;</span>
$: <span class="token function">git</span> config commit.gpgsign <span class="token boolean">true</span>

// 查看该项目git账号是否正确
$: <span class="token function">git</span> config <span class="token parameter variable">--list</span>

<span class="token comment"># --global 全局配置</span>
<span class="token comment"># --local 仓库级配置</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>感谢你的耐心阅读，希望你看完是带着收获离开的！</p>`,58);function g(m,v){const e=c("ExternalLinkIcon");return o(),t("div",null,[d,n("p",null,[s("首先，先 "),n("a",p,[s("下载 Git"),l(e)]),s(" ，并按照提示，一路选择安转即可。")]),u])}const h=i(r,[["render",g],["__file","system02.html.vue"]]);export{h as default};
