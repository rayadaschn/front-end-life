---
title: Git 操作手册
index: 4
icon: linux
date: 2023-02-1
category:
  - linux
tag:
  - linux
star: true
# sticky: true
sticky: false
---

# Git 操作手册指南

## 分支管理规范

- **master** 主分支，受保护，不存放源代码，不直接提交代码，所有的 上线文件 需要推送到此分支。

- **develop** 受保护，主分支，不能直接提交代码，在这个分支只能增加从 **feat** 合并 过来的 **commit**。

- **feature** 开发新功能，以 **develop** 为基础，创建该分支， 命名规范：`feature/xxx` 。开发完成后，提交合并请求到 release 分支进行提测。

- **release** 提测分支:

  当有一组 **feature** 开发完成，首先会合并到 **develop** 分支，进入提测时，会创建 **release** 分支。 如果测试过程中若存在 **bug** 需要修复，则直接由开发者在 **release** 分支修复并提交。 当测试完成之后，合并 **release** 分支到 **master** 和 **develop** 分支，此时 **master** 为最新代码，用作上线。

- **hotfix** 修复分支，从 **develop** 切出，命名规则同**feature**， 以 `hotfix/` 命名。

## [常用的 GIT 操作指令](https://www.runoob.com/git/git-basic-operations.html)

### 日常指令

#### 1 正常开发流程

后续还会具体介绍，开发流程规范。此处介绍正常开发使用的指令：

```shell
// 1 列出分支(无参数时, 会列出本地分支)
$: git branch
// 查看本地及远程分支情况
$: git branch -a
// 查看本地分支的追踪情况
$: git remote show origin

// 2 创建分支指令
$: git branch branchname

// 3 切换分支指令(加指令 -b 为创建新分支,并切换过去)
$: git checkout branchname
$: git checkout -b newBranchname

// 4 删除分支
// 4.1 删除本地分支
$: git branch -d branchname
// 4.1.2 强制删除用大写
$: git branch -D branchname

// 4.2 删除远程分支
$: git push origin -d remoteBranchName
$: git push origin :remoteBranchName
// 4.3 远程已删除分支,本地同步
$: git remote prune origin


// 5 合并分支到【当前主分支中去】, 因此需要先切换到"待合并分支"
$: git checkout master
$: git merge --no-ff newBranch

// 6 个人开发,在个人分支上用分基 rebase 合并 master主分支 到个人分支上
$: git checkout myBranchName
    // 开发 xxxx, 开发完成后。先 rebase master 主分支
$: git rebase master
		// 变基后, 再执行步骤5。将个人分支合并到 master 分支上
$: git checkout master
$: git merge --no-ff myBranchName

// 合并完后, 删除本地及远程分支
$: git branch -d newBranch
$: git push origin -d newBranch
```

`git merge` 和 `git merge --no--ff` 的区别：

- `fast-forward`，默认使用，**保留分支的提交记录，但不会生成合并的提交记录。** 新特性分支删除后，会丢失分支信息。
- `–no-ff`，关闭`fast-forward`模式，在提交时，**保留分支的`commit`历史，并生成一次合并的提交记录。**
- `--squash`，将多次分支`commit`历史压缩为一次，合并的时候相当于提交一次额外的 `commit` 进行总结。

![git merge几种模式](https://image-static.segmentfault.com/120/030/1200301748-54c88abc9ed57_fix732)

#### 2. 本地与远程端的交互

正常流程是，查看状态、拉取、修改代码后，推送

```bash
// 远端数据库操作
// 0. 查看上次提交后是否有对文件进行再次修改, 若加 -s 则为获取简短输出结果
$: git status

// 1. 拉取 git pull 等于 git fetch + git merge
$: git pull

// 本地开发 xxxx, 开发完成后 推送

// 2. 推送
// 2.1 添加文件到暂存区: 单一文件用 git commit xxx
$: git add .
// 2.2.1 将暂存区内容添加到仓库中去
$: git commit -m [message]
// 2.2.2 或者可以不需要执行 git add 命令直接提交代码。 不推荐
$: git commit -a
// 2.3 正常推送
$: git push
// 2.3.1 推送本地所有的分支到远程
$: git push --all
```

中途会有问题，如多人协作时，可能在你拉取后，别人已经推送了代码。此时，我们要用到一些高级操作，如 `rebase` 变基。有几种方案:

假设此时，他人已经 push 相关代码到远程端了。

1. 【方案 1】正常流程,在 `push` 时,先用 `git pull --rebase` 拉取变基代码。而后，再解决冲突，推送。

```bash
$: git add .
$: git commit -m [message]
// 变基拉取 git pull --rebase 等于 git fetch + git rebase
$: git pull --rebase
	// 【有冲突】这时Git会停止rebase并让用户去解决冲突，解决完冲突后，用git add命令去更新这些内容，然后不用执行git-commit,直接执行 git rebase --continue, 这样git会继续apply余下的补丁。
	$: git add .
	$: git rebase --continue
	// 在任何时候，都可以用git rebase --abort参数来终止rebase的行动，并且mywork分支会回到rebase开始前的状态
	$: git rebase --abort
$: git push
```

2. 【方案 2】先 `git stash` 临时贮藏代码，正常拉取。而后 `git stash pop` 推出，解决冲突，推送。

```bash
$: git stash
// 不同分支, 则用 git rebase <otherBranch>
$: git pull
// 推出贮藏
$: git stash pop
	// 若有冲突 解决冲突; 注意, 若冲突,并不会将贮藏记录消除,还需使用 git stash drop 删除记录
	$: git stash drop
	// 若冲突过多, 可撤销贮藏改变
	$: git reset --hard
$: git add .
$: git commit -m [message]
$: git push
```

 若你和同事的分支不同，此时并不是用 `git pull` 同步代码， 而是用

个人使用，已经写完代码了，用方案 1 推送；还未写完，则用方案 2 临时贮藏。

### 版本回退

> 版本回退需注意 `git revert` 和 `git reset` 的区别

- `git revert`
  **git revert** 撤销某次操作，此次**操作之前和之后的 commit 和 history 都会保留**，并且把这次撤销作为一次最新的提交。git revert 是提交一个新的版本，将需要 revert 的版本的内容再反向修改回去，版本会递增，不影响之前提交的内容。

1. 当代码已经 commit 但没有 push 时，可使用如下命令操作：
   `git revert HEAD //撤销倒数第一次提交`
   `git revert HEAD^ //撤销倒数第二次提交`
   `git-revert HEAD~2 //撤销倒数第三次提交`
   `git revert commit //（比如：fa042ce57ebbxxxxxxxxxxx2c58ee7ff）撤销指定的版本，撤销也会作为一次提交进`
2. 当代码已经 commit 并 push 时，可使用如下命令：
   `git revert HEAD~1 //代码回退到前一个版本`

当回退有冲突时，需手动合并冲突并进行修改，再 commit 和 push。**这相当于增加了一次新的提交并且版本库中有记录。**

- **`git reset` 推荐！！！**

  **git reset** 是撤销某次提交，但是**此次之后的修改都会被退回到暂存区**。除了默认的 mixed 模式，还有 soft 和 hard 模式。

  > **--soft :** **不删除**工作空间改动代码，**撤销 commit**，**不撤销 `git add . `**
  >
  > **--hard :** **删除**工作空间改动代码，**撤销 commit**，**撤销`git add .`**
  >
  > - 注意完成这个操作后，就恢复到了上一次的 commit 状态。
  >
  > **--mixed :** 【默认参数】**不删除**工作空间改动代码，**撤销 commit**，**撤销`git add .`**
  >
  > 简单的讲，正常提交是： `git add .` --> `git commit`
  >
  > 对应的回退版本是: `git reset --soft` --> `git reset --mixed`
  >
  > - 撤销 `commit` ： `git reset --soft HEAD^`
  > - 撤销 `commit` 且 撤销贮藏 `add .` ： `git reset HEAD^`
  > - 撤销全部提交且删除改动代码（慎重）： `git reset --hard HEAD^`

1. 如果我们的有两次 commit 但是没有 push 代码

```bash
$: git reset HEAD~1      //撤销前一次 commit，所有代码回到 Working Copy
```

4. 假如我们有几次代码修改，并且都**已经 push 到了版本库**中。

```bash
$: git reset --hard HEAD~2   //本地的Wroking Copy回退到2个版本之前。
$: git push origin <banchName> --force  // --force 为强制覆盖远程分支
// 但更建议使用 `--force-with-lease`,确保不会覆盖他人的代码
```

> 注意！当我们使用强制指令时，若在远程的该分支中有他人的贡献，`--force` 是会覆盖掉他人的代码的，所以为了保险起见，应当用 `--force-with-lease` 。

5. 只回退某个指定文件到指定版本

```bash
$: git reset a4e21523xxxxxxxxx68e9976948a35e [options]
```

6. 回退到指定版本

```bash
$: git reset --hard commitId（通过git log可查看提交的commitId）
```

汇总:

```shell
# 恢复暂存区的指定文件到工作区
$ git checkout [file]

# 恢复某个commit的指定文件到暂存区和工作区
$ git checkout [commit] [file]

# 恢复暂存区的所有文件到工作区
$ git checkout .

# 重置暂存区的指定文件，与上一次commit保持一致，但工作区不变
$ git reset [file]

# 重置暂存区与工作区，与上一次commit保持一致
$ git reset --hard

# 重置当前分支的指针为指定commit，同时重置暂存区，但工作区不变
$ git reset [commit]

# 重置当前分支的HEAD为指定commit，同时重置暂存区和工作区，与指定commit一致
$ git reset --hard [commit]

# 重置当前HEAD为指定commit，但保持暂存区和工作区不变
$ git reset --keep [commit]

# 新建一个commit，用来撤销指定commit。实际上是多了一次提交
# 后者的所有变化都将被前者抵消，并且应用到当前分支
$ git revert [commit]

# 暂时将未提交的变化移除，稍后再移入
$ git stash
$ git stash pop
```

### 贮藏与清理

> 贮藏（stash）会处理工作目录的脏的状态——即跟踪文件的修改与暂存的改动——然后将未完成的修改保存到一个栈上， 而你可以在任何时候重新应用这些改动（甚至在不同的分支上）。

```bash
1. 贮藏
$: git stash
或者可以添加备注: 方便查找
$: git stash save "save message"

2. 查看
$: git stash list

3. 显示做了哪些改动, 或者加后缀参数,显示其它贮藏。number 为数值
$: git stash show
$: git stash show stash@{number}

4. 应用贮藏, 默认第一个,加后缀为应用其它贮藏。number 为数值
$: git stash apply
$: git stash apply stash@{number}
	4.1 应用贮藏,同时清除该stash
	$: git stash pop

5. 清理贮藏,默认第一个。加后缀为清理其它贮藏。number 为数值
$: git stash drop
$: git stash drop stash@{number}
	5.1 清理所有贮藏
	$: git stash clear
```

### 打标签 Tag

```shell
# 列出所有tag
$: git tag

# 新建一个tag在当前commit
$: git tag [tag]

# 新建一个tag在指定commit
$: git tag [tag] [commit]

# 删除本地tag
$: git tag -d [tag]

# 删除远程tag
$: git push origin :refs/tags/[tagName]

# 查看tag信息
$: git show [tag]

# 提交指定tag
$: git push [remote] [tag]
$: git push origin [tagname]
// 推送本地所有分支
$: git push origin --tags

# 提交所有tag
$: git push [remote] --tags

# 新建一个分支，指向某个tag
$: git checkout -b [branch] [tag]

# 检出标签
$: git checkout [tagname]
```

### 修改 Commit

```bash
// 1. 列出 commit 列表:
$: git rebase -i
	1.1 修改 commit 信息
	1.2 修改完后,重复执行如下命令直到完成
  $: git commit --amend --message="modify message by daodaotest" --author="name <email@gmail.com>"
  $: git rebase --continue
  1.3 中间也可跳过或退出 rebase 模式
  $: git rebase --skip
  $: git rebase --abort
// 列出最近的前两条
$: git rebase -i HEAD~2

2. 修改 commit 信息 具体操作
// 修改显示的内容，将 pick 修改为 reword 或者 简写 r [保留提交的分支记录，但是编辑提交的信息]
// 然后:wq保存退出后，会按顺序自动进入需要编辑的提交信息框

3. 查看分支信息: 最近5条
$: git log --oneline -5

4. 若是修改已经 push 的 commmit message, 则在推送push的时候需要加 --force，强制覆盖远程分支上的提交信息。
$: git push --force
```

### git config 定制

`git` 也支持自定义指令:

比方说，你想添加一个别名，用于添加一个空的提交。
在这种情况下，你可以在配置文件(在 `~/.gitconfig` )中添加以下内容：

```shell
[alias]
    empty = "git commit --allow-empty"
```

或者在终端:

```shell
$: git config --global alias.empty "git commit --allow-empty"
```

使用自定义指令:

```shell
$: git empty "Empty commit"
```

也可以在 Git 之外添加其他 shell 命令作为别名。例如，删除一个已经合并到远程的本地分支的别名：

```txt
[alias]
    delete-local-merged = "!git fetch && git branch --merged | egrep -v 'master' | xargs git branch -d"
```

**感叹号 ！ 告诉 Git 把它作为一个 shell 命令运行，而不是 `git` 命令。**

对于别名，我们做一个 git fetch。然后我们得到合并后的分支，把它作为 egrep 命令的输入，过滤掉 `master` 分支，然后删除这些分支。

## 开发流程

1. 从 **develop** 分支检出分支 `feat/xxx` : `git checkout feat/xxx`
2. 从 **develop** 分支检出预发环境测试分支 `release/xxxx` : `git checkout release/xxxx`
3. 开发完成后将各个开发分支合并至 **release** 分支: 切换分支 `git checkout release/xxx` 、 合并分支 `git merge feat/xxx`
4. 测试通过后，发起 `merge request`，待 `code review` 通过后，负责人 **merge** 代码，即: `git checkout develop` 、 合并分支 `git merge release/xxx`

### 上线流程

- 当所有的研发分支都已经 **merge** 到 **release** 后，使用 **release** 分支的代码进行测试，若测试通过， 则将 **release** 分支代码合并到 **develop** 分支上去；
- 并在 **develop** 分支上构建打包，推送合并到 **master** 分支上，而后上线；
- 当发布完成后，为了更方便地参考提交，可以在 **develop** 和 **master** 分支上加上标签(打上的标签是固定的，不能像分支那样可以移动位置) :
  1. 轻标签: `git tag <tagName>`
  2. 注解标签: `git -am "注解文字说明" <tagName>`
  3. 删除标签: `git tag -d <tagName>`

### **Bugfix** 流程

- 当上线产生 **Bug** 时，应当从 **develop** 分支中 `git checkout hotfix/xxx` 检出 `hotfix/xxx` 分支， 并完成修复，通过测试后，再 `git merage hotfix/xxx` 合并到 **develop** 分支上，即 `develop -> hotfix/xxx -> develop` ;
- 而当开发新功能在 **feat** 分支中产生的 **Bug** ，应当直接在 `feat/xxx` 分支上修复，无需开辟新的分支。

### 持续集成: GitLab CI/CD

若有代码迭代问题，可以考虑是否 加入 **GitLab CI/CD** 做持续集成， 本文对此概念做简单介绍。

**GitLab CI/CD** 是一个内置在 GitLab 中的工具，用于通过持续方法进行软件开发 :

- **Continuous Integration (CI) 持续集成**: 在开发分支上，当最终要合并到 **master** 主支之前，会通过编译和自动化测试对代码进行验证，确保代码的质量。可以理解为自动化测试，因此需要事先对功能创建自动化测试用例。
- **Continuous Delivery (CD) 持续交付：** 交付即将代码发布出去的过程。而持续交付就是可以依据业务需求定时定点的将应用部署上线。
- **Continuous Deployment (CD) 持续部署**：意为持续集成和持续部署的合并。当开发人员在 **master** 分支上合并一个提交时，该分支将被构建、测试，通过自动化测试后，则直接部署上线到生成环境中去。

## Git 提交规范

参考 **angular** 团队的 **git** 提交规范。

Commit message 都包括三个部分：**Header** (必须)，Body 和 Footer。

### Header

**提交格式** ： `type(scope): subject` ， 例如： `fix(Button): 修复按钮问题`

```shell
- type
  - 用于说明 `commit` 的类别，只允许使用下面10个标识。
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
- scope(可选)
  - 用于说明 `commit` 影响的范围，比如Button组件、store、首页、路由等等，视项目不同而不同。
- subject(可选))
  - 是 `commit` 目的的简短描述，不超过50个字符。
    - 以动词开头，使用第一人称现在时，比如change，而不是changed或changes
    - 第一个字母小写
    - 结尾不加句号（.）
```

### Body

**Body** 为此次提交的详细描述，可多行显示。

- 使用第一人称现在时，比如使用`change`而不是`changed`或`changes`。
- 应该说明代码变动的动机，以及与以前行为的对比。

### Footer

**Footer** 仅在 **不兼容变动** 和 **关闭 issue** 时 使用：

- 不兼容变动

  ```shell
  BREAKING CHANGE: isolate scope bindings definition has changed.
  	xxxxx
  	Before： xxxx
  	After： xxxx
  ```

- 关闭 Issue

  ```shell
  Closes #996, #007
  ```

### 特殊情况 Revert

在版本回退中的格式为：

**Header**： `revert: feat(pencil): add 'graphiteWidth' option`

**Body**： `This reverts commit (SHA 标识符).`

## 利用 [git-gz](https://cz-git.qbb.sh/zh/guide) 规范代码提交

- 全局安装 `commitizen`,如此一来可以快速使用 `cz` 或 `git cz` 命令进行启动。

```shell
$: npm install -g commitizen
```

- 下载依赖 **cz-git**

  用 `git cz` 代替 `git commit` ，生成 Commit message。

```shell
$: npm install -g cz-git
```

- 全局配置适配器类型

```shell
$: echo '{ "path": "cz-git" }' > ~/.czrc
```

- 自动生成 **[CHANGELOG–conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)**

```shell
$: npm install -g conventional-changelog-cli
```

```shell
# 自动生成 CHANGELOG.md 文件
$: conventional-changelog -i CHANGELOG.md -s

# 覆盖重写
$: conventional-changelog -i CHANGELOG.md -s -r 0

# 依据 angular 规范
$: conventional-changelog -p angular -i CHANGELOG.md -s
```

## 参考文档

- [ JDC 前端代码规范 (jdf2e.github.io)](https://jdf2e.github.io/jdc_fe_guide/docs/git/branch)
- [Git 基本操作 ](https://www.runoob.com/git/git-basic-operations.html)
- [前端 CHANGELOG 生成指南](https://godbasin.github.io/2019/11/10/change-log/)
- [Git 分支管理](https://www.ruanyifeng.com/blog/2012/07/git.html)
- [Git --no--ff](https://segmentfault.com/q/1010000002477106)
