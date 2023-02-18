import{_ as t,V as l,W as o,X as n,Y as s,Z as a,a0 as i,F as r}from"./framework-acd93724.js";const c={},d=i('<h1 id="gitlab-操作手册指南" tabindex="-1"><a class="header-anchor" href="#gitlab-操作手册指南" aria-hidden="true">#</a> GitLab 操作手册指南</h1><p>[toc]</p><h2 id="分支管理规范" tabindex="-1"><a class="header-anchor" href="#分支管理规范" aria-hidden="true">#</a> 分支管理规范</h2><ul><li><p><strong>master</strong> 主分支，受保护，不存放源代码，不直接提交代码，所有的 上线文件 需要推送到此分支。</p></li><li><p><strong>develop</strong> 受保护，主分支，不能直接提交代码，在这个分支只能增加从 <strong>feat</strong> 合并 过来的 <strong>commit</strong>。</p></li><li><p><strong>feature</strong> 开发新功能，以 <strong>develop</strong> 为基础，创建该分支， 命名规范：<code>feature/xxx</code> 。开发完成后，提交合并请求到 release 分支进行提测。</p></li><li><p><strong>release</strong> 提测分支:</p><p>当有一组 <strong>feature</strong> 开发完成，首先会合并到 <strong>develop</strong> 分支，进入提测时，会创建 <strong>release</strong> 分支。 如果测试过程中若存在 <strong>bug</strong> 需要修复，则直接由开发者在 <strong>release</strong> 分支修复并提交。 当测试完成之后，合并 <strong>release</strong> 分支到 <strong>master</strong> 和 <strong>develop</strong> 分支，此时 <strong>master</strong> 为最新代码，用作上线。</p></li><li><p><strong>hotfix</strong> 修复分支，从 <strong>develop</strong> 切出，命名规则同<strong>feature</strong>， 以 <code>hotfix/</code> 命名。</p></li></ul>',4),p={id:"常用的-git-操作指令",tabindex:"-1"},u=n("a",{class:"header-anchor",href:"#常用的-git-操作指令","aria-hidden":"true"},"#",-1),m={href:"https://www.runoob.com/git/git-basic-operations.html",target:"_blank",rel:"noopener noreferrer"},v=i(`<h3 id="日常指令" tabindex="-1"><a class="header-anchor" href="#日常指令" aria-hidden="true">#</a> 日常指令</h3><h4 id="_1-正常开发流程" tabindex="-1"><a class="header-anchor" href="#_1-正常开发流程" aria-hidden="true">#</a> 1 正常开发流程</h4><p>后续还会具体介绍，开发流程规范。此处介绍正常开发使用的指令：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>// <span class="token number">1</span> 列出分支<span class="token punctuation">(</span>无参数时, 会列出本地分支<span class="token punctuation">)</span>
$: <span class="token function">git</span> branch

// <span class="token number">2</span> 创建分支指令
$: <span class="token function">git</span> branch branchname

// <span class="token number">3</span> 切换分支指令<span class="token punctuation">(</span>加指令 <span class="token parameter variable">-b</span> 为创建新分支,并切换过去<span class="token punctuation">)</span>
$: <span class="token function">git</span> checkout branchname
$: <span class="token function">git</span> checkout <span class="token parameter variable">-d</span> newBranchname

// <span class="token number">4</span> 删除分支
// <span class="token number">4.1</span> 删除本地分支
$: <span class="token function">git</span> branch <span class="token parameter variable">-D</span> branchname
// <span class="token number">4.2</span> 删除远程分支
$: <span class="token function">git</span> push origin <span class="token parameter variable">--delete</span> remoteBranchName

// <span class="token number">5</span> 合并分支到【当前主分支中去】, 因此需要先切换到<span class="token string">&quot;待合并分支&quot;</span>
$: <span class="token function">git</span> checkout master
$: <span class="token function">git</span> merge newBranch

// <span class="token number">6</span> 个人开发,在个人分支上用分基 rebase 合并 master主分支 到个人分支上
$: <span class="token function">git</span> checkout myBranchName
    // 开发 xxxx, 开发完成后。先 rebase master 主分支
$: <span class="token function">git</span> rebase master
		// 变基后, 再执行步骤5。将个人分支合并到 master 分支上
$: <span class="token function">git</span> checkout master
$: <span class="token function">git</span> merge myBranchName
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-本地与远程端的交互" tabindex="-1"><a class="header-anchor" href="#_2-本地与远程端的交互" aria-hidden="true">#</a> 2. 本地与远程端的交互</h4><p>正常流程是，查看状态、拉取、修改代码后，推送</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>// 远端数据库操作
// <span class="token number">0</span>. 查看上次提交后是否有对文件进行再次修改, 若加 <span class="token parameter variable">-s</span> 则为获取简短输出结果
$: <span class="token function">git</span> status

// <span class="token number">1</span>. 拉取 <span class="token function">git</span> pull 等于 <span class="token function">git</span> fetch + <span class="token function">git</span> merge
$: <span class="token function">git</span> pull

// 本地开发 xxxx, 开发完成后 推送

// <span class="token number">2</span>. 推送
// <span class="token number">2.1</span> 添加文件到暂存区: 单一文件用 <span class="token function">git</span> commit xxx
$: <span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>
// <span class="token number">2.2</span>.1 将暂存区内容添加到仓库中去
$: <span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token punctuation">[</span>message<span class="token punctuation">]</span>
// <span class="token number">2.2</span>.2 或者可以不需要执行 <span class="token function">git</span> <span class="token function">add</span> 命令直接提交代码。 不推荐
$: <span class="token function">git</span> commit <span class="token parameter variable">-a</span>
// <span class="token number">2.3</span> 正常推送
$: <span class="token function">git</span> push
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>中途会有问题，如多人协作时，可能在你拉取后，别人已经推送了代码。此时，我们要用到一些高级操作，如 <code>rebase</code> 变基。有几种方案:</p><p>假设此时，他人已经 push 相关代码到远程端了。</p><ol><li>【方案 1】正常流程,在 <code>push</code> 时,先用 <code>git pull --rebase</code> 拉取变基代码。而后，再解决冲突，推送。</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>
$: <span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token punctuation">[</span>message<span class="token punctuation">]</span>
// 变基拉取 <span class="token function">git</span> pull <span class="token parameter variable">--rebase</span> 等于 <span class="token function">git</span> fetch + <span class="token function">git</span> rebase
$: <span class="token function">git</span> pull <span class="token parameter variable">--rebase</span>
	// 【有冲突】这时Git会停止rebase并让用户去解决冲突，解决完冲突后，用git add命令去更新这些内容，然后不用执行git-commit,直接执行 <span class="token function">git</span> rebase --continue, 这样git会继续apply余下的补丁。
	$: <span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>
	$: <span class="token function">git</span> rebase <span class="token parameter variable">--continue</span>
	// 在任何时候，都可以用git rebase --abort参数来终止rebase的行动，并且mywork分支会回到rebase开始前的状态
	$: <span class="token function">git</span> rebase <span class="token parameter variable">--abort</span>
$: <span class="token function">git</span> push
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>【方案 2】先 <code>git stash</code> 临时贮藏代码，正常拉取。而后 <code>git stash pop</code> 推出，解决冲突，推送。</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">git</span> stash
// 不同分支, 则用 <span class="token function">git</span> rebase <span class="token operator">&lt;</span>otherBranch<span class="token operator">&gt;</span>
$: <span class="token function">git</span> pull
// 推出贮藏
$: <span class="token function">git</span> stash pop
	// 若有冲突 解决冲突<span class="token punctuation">;</span> 注意, 若冲突,并不会将贮藏记录消除,还需使用 <span class="token function">git</span> stash drop 删除记录
	$: <span class="token function">git</span> stash drop
	// 若冲突过多, 可撤销贮藏改变
	$: <span class="token function">git</span> reset <span class="token parameter variable">--hard</span>
$: <span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>
$: <span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token punctuation">[</span>message<span class="token punctuation">]</span>
$: <span class="token function">git</span> push
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ 若你和同事的分支不同，此时并不是用 <code>git pull</code> 同步代码， 而是用</p><p>个人使用，已经写完代码了，用方案 1 推送；还未写完，则用方案 2 临时贮藏。</p><h3 id="版本回退" tabindex="-1"><a class="header-anchor" href="#版本回退" aria-hidden="true">#</a> 版本回退</h3><blockquote><p>版本回退需注意 <code>git revert</code> 和 <code>git reset</code> 的区别</p></blockquote><ul><li><code>git revert</code><strong>git revert</strong> 撤销某次操作，此次<strong>操作之前和之后的 commit 和 history 都会保留</strong>，并且把这次撤销作为一次最新的提交。git revert 是提交一个新的版本，将需要 revert 的版本的内容再反向修改回去，版本会递增，不影响之前提交的内容。</li></ul><ol><li>当代码已经 commit 但没有 push 时，可使用如下命令操作： <code>git revert HEAD //撤销倒数第一次提交</code><code>git revert HEAD^ //撤销倒数第二次提交</code><code>git-revert HEAD~2 //撤销倒数第三次提交</code><code>git revert commit //（比如：fa042ce57ebbe5bb9c8db709f719cec2c58ee7ff）撤销指定的版本，撤销也会作为一次提交进</code></li><li>当代码已经 commit 并 push 时，可使用如下命令： <code>git revert HEAD~1 //代码回退到前一个版本</code></li></ol><p>当回退有冲突时，需手动合并冲突并进行修改，再 commit 和 push。<strong>这相当于增加了一次新的提交并且版本库中有记录。</strong></p><ul><li><p><strong><code>git reset</code> 推荐!!!!</strong><strong>git reset</strong> 是撤销某次提交，但是<strong>此次之后的修改都会被退回到暂存区</strong>。除了默认的 mixed 模式，还有 soft 和 hard 模式。</p><blockquote><p><strong>--soft :</strong> 不删除工作空间改动代码，<strong>撤销 commit</strong>，<strong>不撤销 <code>git add . </code></strong> --hard : 删除工作空间改动代码，<strong>撤销 commit</strong>，<strong>撤销<code>git add .</code></strong></p><pre><code>* 注意完成这个操作后，就恢复到了上一次的commit状态。
</code></pre><p>--mixed : 【默认参数】不删除工作空间改动代码，<strong>撤销 commit</strong>，并且 **撤销 <code>git add .</code> **</p></blockquote></li></ul><ol><li>如果我们的有两次 commit 但是没有 push 代码</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">git</span> reset HEAD~1      //撤销前一次 commit，所有代码回到 Working Copy
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol><li>假如我们有几次代码修改，并且都<strong>已经 push 到了版本库</strong>中。</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">git</span> reset <span class="token parameter variable">--hard</span> HEAD~2   //本地的Wroking Copy回退到2个版本之前。
$: <span class="token function">git</span> push origin <span class="token operator">&lt;</span>banchName<span class="token operator">&gt;</span> <span class="token parameter variable">--force</span>  // <span class="token parameter variable">--force</span> 为强制覆盖远程分支
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ol><li>只回退某个指定文件到指定版本</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">git</span> reset a4e215234aa4927c85693dca7b68e9976948a35e  xxx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>4.回退到指定版本</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">git</span> reset <span class="token parameter variable">--hard</span> commitId（通过git log可查看提交的commitId）
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="贮藏与清理" tabindex="-1"><a class="header-anchor" href="#贮藏与清理" aria-hidden="true">#</a> 贮藏与清理</h3><blockquote><p>贮藏（stash）会处理工作目录的脏的状态——即跟踪文件的修改与暂存的改动——然后将未完成的修改保存到一个栈上， 而你可以在任何时候重新应用这些改动（甚至在不同的分支上）。</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token number">1</span>. 贮藏
$: <span class="token function">git</span> stash
或者可以添加备注: 方便查找
$: <span class="token function">git</span> stash save <span class="token string">&quot;save message&quot;</span>

<span class="token number">2</span>. 查看
$: <span class="token function">git</span> stash list

<span class="token number">3</span>. 显示做了哪些改动, 或者加后缀参数,显示其它贮藏。number 为数值
$: <span class="token function">git</span> stash show
$: <span class="token function">git</span> stash show stash@<span class="token punctuation">{</span>number<span class="token punctuation">}</span>

<span class="token number">4</span>. 应用贮藏, 默认第一个,加后缀为应用其它贮藏。number 为数值
$: <span class="token function">git</span> stash apply
$: <span class="token function">git</span> stash apply stash@<span class="token punctuation">{</span>number<span class="token punctuation">}</span>
	<span class="token number">4.1</span> 应用贮藏,同时清除该stash
	$: <span class="token function">git</span> stash pop

<span class="token number">5</span>. 清理贮藏,默认第一个。加后缀为清理其它贮藏。number 为数值
$: <span class="token function">git</span> stash drop
$: <span class="token function">git</span> stash drop stash@<span class="token punctuation">{</span>number<span class="token punctuation">}</span>
	<span class="token number">5.1</span> 清理所有贮藏
	$: <span class="token function">git</span> stash <span class="token function">clear</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改-commit" tabindex="-1"><a class="header-anchor" href="#修改-commit" aria-hidden="true">#</a> 修改 Commit</h3><ol><li>列出 commit 列表: <code> $: git rebase -i</code> 或者</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token number">1</span>. 列出 commit 列表:
$: <span class="token function">git</span> rebase <span class="token parameter variable">-i</span>
	<span class="token number">1.1</span> 修改 commit 信息
	<span class="token number">1.2</span> 修改完后,重复执行如下命令直到完成
  $: <span class="token function">git</span> commit <span class="token parameter variable">--amend</span> <span class="token parameter variable">--message</span><span class="token operator">=</span><span class="token string">&quot;modify message by daodaotest&quot;</span> <span class="token parameter variable">--author</span><span class="token operator">=</span><span class="token string">&quot;name &lt;email@gmail.com&gt;&quot;</span>
  $: <span class="token function">git</span> rebase <span class="token parameter variable">--continue</span>
  <span class="token number">1.3</span> 中间也可跳过或退出 rebase 模式
  $: <span class="token function">git</span> rebase <span class="token parameter variable">--skip</span>
  $: <span class="token function">git</span> rebase <span class="token parameter variable">--abort</span>
// 列出最近的前两条
$: <span class="token function">git</span> rebase <span class="token parameter variable">-i</span> HEAD~2

<span class="token number">2</span>. 修改 commit 信息 具体操作
// 修改显示的内容，将 pick 修改为 reword 或者 简写 r <span class="token punctuation">[</span>保留提交的分支记录，但是编辑提交的信息<span class="token punctuation">]</span>
// 然后:wq保存退出后，会按顺序自动进入需要编辑的提交信息框

<span class="token number">3</span>. 查看分支信息: 最近5条
$: <span class="token function">git</span> log <span class="token parameter variable">--oneline</span> <span class="token parameter variable">-5</span>

<span class="token number">4</span>. 若是修改已经 push 的 commmit message, 则在推送push的时候需要加 --force，强制覆盖远程分支上的提交信息。
$: <span class="token function">git</span> push <span class="token parameter variable">--force</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="开发流程" tabindex="-1"><a class="header-anchor" href="#开发流程" aria-hidden="true">#</a> 开发流程</h2><ol><li>从 <strong>develop</strong> 分支检出分支 <code>feat/xxx</code> : <code>git checkout feat/xxx</code></li><li>从 <strong>develop</strong> 分支检出预发环境测试分支 <code>release/xxxx</code> : <code>git checkout release/xxxx</code></li><li>开发完成后将各个开发分支合并至 <strong>release</strong> 分支: 切换分支 <code>git checkout release/xxx</code> 、 合并分支 <code>git merge feat/xxx</code></li><li>测试通过后，发起 <code>merge request</code>，待 <code>code review</code> 通过后，负责人 <strong>merge</strong> 代码，即: <code>git checkout develop</code> 、 合并分支 <code>git merge release/xxx</code></li></ol><h3 id="上线流程" tabindex="-1"><a class="header-anchor" href="#上线流程" aria-hidden="true">#</a> 上线流程</h3><ul><li>当所有的研发分支都已经 <strong>merge</strong> 到 <strong>release</strong> 后，使用 <strong>release</strong> 分支的代码进行测试，若测试通过， 则将 <strong>release</strong> 分支代码合并到 <strong>develop</strong> 分支上去；</li><li>并在 <strong>develop</strong> 分支上构建打包，推送合并到 <strong>master</strong> 分支上，而后上线；</li><li>当发布完成后，为了更方便地参考提交，可以在 <strong>develop</strong> 和 <strong>master</strong> 分支上加上标签(打上的标签是固定的，不能像分支那样可以移动位置) : <ol><li>轻标签: <code>git tag &lt;tagName&gt;</code></li><li>注解标签: <code>git -am &quot;注解文字说明&quot; &lt;tagName&gt;</code></li><li>删除标签: <code>git tag -d &lt;tagName&gt;</code></li></ol></li></ul><h3 id="bugfix-流程" tabindex="-1"><a class="header-anchor" href="#bugfix-流程" aria-hidden="true">#</a> <strong>Bugfix</strong> 流程</h3><ul><li>当上线产生 <strong>Bug</strong> 时，应当从 <strong>develop</strong> 分支中 <code>git checkout hotfix/xxx</code> 检出 <code>hotfix/xxx</code> 分支， 并完成修复，通过测试后，再 <code>git merage hotfix/xxx</code> 合并到 <strong>develop</strong> 分支上，即 <code>develop -&gt; hotfix/xxx -&gt; develop</code> ;</li><li>而当开发新功能在 <strong>feat</strong> 分支中产生的 <strong>Bug</strong> ，应当直接在 <code>feat/xxx</code> 分支上修复，无需开辟新的分支。</li></ul><h3 id="持续集成-gitlab-ci-cd" tabindex="-1"><a class="header-anchor" href="#持续集成-gitlab-ci-cd" aria-hidden="true">#</a> 持续集成: GitLab CI/CD</h3>`,42),g=n("strong",null,"GitLab CI/CD",-1),b={href:"https://about.gitlab.com/resources/scaled-ci-cd/?utm_medium=cpc&utm_source=google&utm_campaign=singleappci_amer_pr_rsa_nb_exact_&utm_content=scaled-ci-cd_digital_x-pr_english_&&utm_term=ci",target:"_blank",rel:"noopener noreferrer"},h=i(`<p><strong>GitLab CI/CD</strong> 是一个内置在 GitLab 中的工具，用于通过持续方法进行软件开发 :</p><ul><li><strong>Continuous Integration (CI) 持续集成</strong>: 在开发分支上，当最终要合并到 <strong>master</strong> 主支之前，会通过编译和自动化测试对代码进行验证，确保代码的质量。可以理解为自动化测试，因此需要事先对功能创建自动化测试用例。</li><li><strong>Continuous Delivery (CD) 持续交付：</strong> 交付即将代码发布出去的过程。而持续交付就是可以依据业务需求定时定点的将应用部署上线。</li><li><strong>Continuous Deployment (CD) 持续部署</strong>：意为持续集成和持续部署的合并。当开发人员在 <strong>master</strong> 分支上合并一个提交时，该分支将被构建、测试，通过自动化测试后，则直接部署上线到生成环境中去。</li></ul><h2 id="git-提交规范" tabindex="-1"><a class="header-anchor" href="#git-提交规范" aria-hidden="true">#</a> Git 提交规范</h2><p>参考<strong>angular</strong>团队的<strong>git</strong>提交规范。</p><p>Commit message 都包括三个部分：<strong>Header</strong> (必须)，Body 和 Footer。</p><h3 id="header" tabindex="-1"><a class="header-anchor" href="#header" aria-hidden="true">#</a> Header</h3><p>** 提交格式**： <code>type(scope): subject</code> ， 例如： <code>fix(Button): 修复按钮问题</code></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>- <span class="token builtin class-name">type</span>
  - 用于说明 <span class="token variable"><span class="token variable">\`</span>commit<span class="token variable">\`</span></span> 的类别，只允许使用下面10个标识。
    - feat：新功能（feature）【会出现在 CHANGELOG 中】
    - fix：修补bug          【会出现在 CHANGELOG 中】
    - docs：文档（documentation）
    - style：格式（不影响代码运行的变动）
    - refactor：重构（即不是新增功能，也不是修改bug的代码变动）
    - perf：性能优化
    - test：增加测试
    - chore：构建过程或辅助工具的变动
    - revert：回退
    - build：打包
- scope<span class="token punctuation">(</span>可选<span class="token punctuation">)</span>
  - 用于说明 <span class="token variable"><span class="token variable">\`</span>commit<span class="token variable">\`</span></span> 影响的范围，比如Button组件、store、首页、路由等等，视项目不同而不同。
- subject<span class="token punctuation">(</span>可选<span class="token punctuation">))</span>
  - 是 <span class="token variable"><span class="token variable">\`</span>commit<span class="token variable">\`</span></span> 目的的简短描述，不超过50个字符。
    - 以动词开头，使用第一人称现在时，比如change，而不是changed或changes
    - 第一个字母小写
    - 结尾不加句号（.）
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="body" tabindex="-1"><a class="header-anchor" href="#body" aria-hidden="true">#</a> Body</h3><p><strong>Body</strong> 为此次提交的详细描述，可多行显示。</p><ul><li>使用第一人称现在时，比如使用<code>change</code>而不是<code>changed</code>或<code>changes</code>。</li><li>应该说明代码变动的动机，以及与以前行为的对比。</li></ul><h3 id="footer" tabindex="-1"><a class="header-anchor" href="#footer" aria-hidden="true">#</a> Footer</h3><p><strong>Footer</strong> 仅在 <strong>不兼容变动</strong> 和 <strong>关闭 issue</strong> 时 使用：</p><ul><li><p>不兼容变动</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>BREAKING CHANGE: isolate scope bindings definition has changed.
	xxxxx
	Before： xxxx
	After： xxxx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>关闭 Issue</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>Closes <span class="token comment">#996, #007</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li></ul><h3 id="特殊情况-revert" tabindex="-1"><a class="header-anchor" href="#特殊情况-revert" aria-hidden="true">#</a> 特殊情况 Revert</h3><p>在版本回退中的格式为：</p><p><strong>Header</strong>： <code>revert: feat(pencil): add &#39;graphiteWidth&#39; option</code></p><p><strong>Body</strong>： <code>This reverts commit (SHA 标识符).</code></p>`,18),k={id:"利用-git-gz-规范代码提交",tabindex:"-1"},f=n("a",{class:"header-anchor",href:"#利用-git-gz-规范代码提交","aria-hidden":"true"},"#",-1),x={href:"https://cz-git.qbb.sh/zh/guide",target:"_blank",rel:"noopener noreferrer"},_=i(`<ul><li>全局安装 <code>commitizen</code>,如此一来可以快速使用 <code>cz</code> 或 <code>git cz</code> 命令进行启动。</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> commitizen
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li><p>下载依赖 <strong>cz-git</strong></p><p>用 <code>git cz</code> 代替 <code>git commit</code> ，生成 Commit message。</p></li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> cz-git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>全局配置适配器类型</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token builtin class-name">echo</span> <span class="token string">&#39;{ &quot;path&quot;: &quot;cz-git&quot; }&#39;</span> <span class="token operator">&gt;</span> ~/.czrc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,6),$={href:"https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli",target:"_blank",rel:"noopener noreferrer"},C=i(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$: <span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> conventional-changelog-cli
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 自动生成 CHANGELOG.md 文件</span>
$: conventional-changelog <span class="token parameter variable">-i</span> CHANGELOG.md <span class="token parameter variable">-s</span>

<span class="token comment"># 覆盖重写</span>
$: conventional-changelog <span class="token parameter variable">-i</span> CHANGELOG.md <span class="token parameter variable">-s</span> <span class="token parameter variable">-r</span> <span class="token number">0</span>

<span class="token comment"># 依据 angular 规范</span>
$: conventional-changelog <span class="token parameter variable">-p</span> angular <span class="token parameter variable">-i</span> CHANGELOG.md <span class="token parameter variable">-s</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考文档" tabindex="-1"><a class="header-anchor" href="#参考文档" aria-hidden="true">#</a> 参考文档</h2>`,3),G={href:"https://jdf2e.github.io/jdc_fe_guide/docs/git/branch",target:"_blank",rel:"noopener noreferrer"},q={href:"https://www.runoob.com/git/git-basic-operations.html",target:"_blank",rel:"noopener noreferrer"},y={href:"https://godbasin.github.io/2019/11/10/change-log/",target:"_blank",rel:"noopener noreferrer"};function N(B,E){const e=r("ExternalLinkIcon");return l(),o("div",null,[d,n("h2",p,[u,s(),n("a",m,[s("常用的 GIT 操作指令"),a(e)])]),v,n("p",null,[s("若有代码迭代问题，可以考虑是否 加入 "),g,s(" 做持续集成， 本文对此概念做简单介绍， 详细可以参考 [官方文档]("),n("a",b,[s("https://about.gitlab.com/resources/scaled-ci-cd/?utm_medium=cpc&utm_source=google&utm_campaign=singleappci_amer_pr_rsa_nb_exact_&utm_content=scaled-ci-cd_digital_x-pr_english_&&utm_term=ci"),a(e)]),s(" cd&_bt=626050032714&_bk=ci cd&_bm=b&_bn=g) 。")]),h,n("h2",k,[f,s(" 利用 "),n("a",x,[s("git-gz"),a(e)]),s(" 规范代码提交")]),_,n("ul",null,[n("li",null,[s("自动生成 "),n("strong",null,[n("a",$,[s("CHANGELOG–conventional-changelog-cli"),a(e)])])])]),C,n("ul",null,[n("li",null,[n("a",G,[s(" JDC 前端代码规范 (jdf2e.github.io)"),a(e)])]),n("li",null,[n("a",q,[s("Git 基本操作 "),a(e)])]),n("li",null,[n("a",y,[s("前端 CHANGELOG 生成指南"),a(e)])])])])}const A=t(c,[["render",N],["__file","gitlab操作记录.html.vue"]]);export{A as default};
