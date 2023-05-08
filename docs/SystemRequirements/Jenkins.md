---
title: Jenkins 持续集成
icon: linux
date: 2023-03-09
category:
  - linux
tag:
  - linux
star: true
# sticky: true
sticky: false
---

# Jenkins 持续集成

## Jenkins 安装

Jenkins 安装有很多方案，具体可以查看 Jenkins [官网](https://www.jenkins.io/zh/doc/tutorials/build-a-node-js-and-react-app-with-npm/) 介绍，其中多用到 Docker，可以看 Docker [官网安装介绍](https://vuepress.mirror.docker-practice.com/install/centos/#)。

这里介绍一种通用型方案：利用 Java 运行 WAR 文件进行安装部署。这种方案的好处在于，无需服务 Root 权限，便可在线安装部署 Jenkins。

> Jenkins 的 Web 应用程序 ARchive（WAR）文件版本可以安装在任何支持 Java 的操作系统或平台上。

具体流程如下：

1. 将[最新的稳定 Jenkins WAR 包](https://updates.jenkins.io/download/war/) 下载到您计算机上的相应目录。

2. 在下载的目录内打开一个终端/命令提示符窗口到。

3. 运行命令 `java -jar jenkins.war`

   - **第一次运行，会返回一个初始密码！！！** 需要妥善保管，待会要用，若是丢失了则需要去一下地址查看：

     ```bash
     # 不同安装路径可能不用
     /var/lib/jenkins/secrets/initialAdminPassword
     ```

   - 值得注意的是，此时确保安装的 Java 版本符合要求。若是下载了较新的 WAR 包，则建议安装 Java11 以上，具体看下文介绍。

   - 并且该指令无作做到持久化，关闭窗口后，便会停止，下文介绍持久化操作。

4. 浏览 `http://localhost:8080` 并等到 _Unlock Jenkins_ 页面出现。

   这里并非一定是 localhost，localhost 是本地服务。应该根据服务器地址自行设置。

### Java 安装

环境为腾讯云的 Linux。

1. 搜索 jdk:

   ```bash
   $: yum search jdk
   ```

   会列出当前能用的 jdk 版本。依据情况进行下载，通用的是 Java-1.8.0（较老）、Java-11-openjdk。

2. 确定好 Java 版本后开始安装：

   ```bash
   # 请务必确认好版本

   # 1.8 版
   $: yum install java-1.8.0-openjdk.x86_64

   # 11 版
   $: yum install java-11-openjdk.x86_64

   # 验证安装
   $: java -version
   ```

   若先安装的 1.8 版，后安装的 11 版。而此时需要用到 11 版，可以切换默认 Java 版本（需要权限）。

   ```bash
   $: sudo update-alternatives --config java
   ```

   该命令会显示当前系统中安装的所有 Java 版本，并让您选择将哪个版本设置为默认版本。输入数字对应的序号并按回车键即可完成设置。

   > 没有权限进行切换 Java 版本，但又要用别的 Java 版本该如何？
   >
   > ```bash
   > $: update-alternatives --config java
   >
   > There are 2 programs which provide 'java'.
   >
   >   Selection    Command
   > -----------------------------------------------
   > *+ 1           java-1.8.0-openjdk.x86_64 (/usr/lib/jvm/java-1.8.0-openjdk/bin/java)
   >    2           java-11-openjdk.x86_64 (/usr/lib/jvm/java-11-openjdk/bin/java)
   > ```
   >
   > 查看当前 Java 版本的同时，括号内会展现不同 Java 安装的路径。利用这个路径便可使用指定的 Java 版本了。
   >
   > 用法（需要用参数 `-jar`）：
   >
   > ```bash
   > $: /usr/lib/jvm/java-11-openjdk/bin/java -jar myapp.jar
   > ```
   >
   > 这将使用 /usr/lib/jvm/java-11-openjdk 目录下的 Java 可执行程序来运行 myapp.jar 文件。

### java 运行持久化

在使用 Jenkins 时，如果希望在关闭浏览器后仍然保持 Jenkins 后台运行，则可以使用以下方法：

1. **使用 nohup 命令（no hang up，不要挂断电话）**：nohup 命令可以使进程忽略 SIGHUP 信号（即挂起信号），从而使其在终端关闭后继续在后台运行。例如，要在后台运行 Jenkins 并忽略 SIGHUP 信号，请使用以下命令：

   ```bash
   $: nohup java -jar jenkins.war > ./jenkins.log &
   ```

   > - 在 nohup 命令后面添加重定向符号（`>`）和输出文件名（记录日志），以将程序的输出重定向到指定的文件中；
   >
   > - 在 Linux 和 Unix 系统中，`&` 符号表示将命令放入后台运行。当使用 `&` 符号时，程序会在后台运行，并且终端会立即返回到命令提示符。
   >
   > - 上述命令的意思是将启动名为 `jenkins.war` 的 Java 程序，并将其输出写入到 `jenkins.log` 文件中。但是，由于在命令末尾添加了 `&` 符号，该程序会在后台运行，并且控制台会立即返回到命令提示符。
   >
   >   如果不使用 `&` 符号，则程序将在前台运行，并且控制台将一直占用，直到程序退出或通过键盘输入 `Ctrl+C` 中断进程。

   键入上述指令后，会启动 Jenkins 并将其作为后台任务运行。此时，当您关闭终端或断开 SSH 连接时，Jenkins 仍将继续在后台运行。

2. **使用 screen 命令**：screen 命令可以创建一个虚拟窗口，并在其中运行命令或程序。您可以使用 screen 命令来在 Jenkins 调试控制台中运行 Jenkins，并在关闭 SSH 连接后继续在后台运行。例如，要在 Jenkins 调试控制台中运行 Jenkins 并在后台运行，请使用以下命令：

   ```bash
   $: screen -S jenkins
   $: java -jar jenkins.war
   ```

   这会创建一个名为 "jenkins" 的新 screen 会话，并在其中启动 Jenkins。此时，当您关闭 SSH 连接时，Jenkins 仍将继续在后台运行。

### 结束持久化

以上俩种方案都可以做到对运行 Jenkins 的持久化。那若何结束进程呢？可以使用以下命令：

```bash
# 查看运行 Jenkins 的进程
$: ps aux | grep java | grep jenkins.war

# 利用 kill 杀死进程(假设 PID 为 12345)
$: kill 12345
```

指令解析:

```bash
$: ps aux | grep <your_process_name>
```

其中，`<your_process_name>` 是您需要查找的进程名。该命令将列出所有匹配的进程，并显示其 PID（进程 ID）和其他详细信息。

要关闭正在运行的 nohup 程序，可以使用以下方法之一：

1. 使用 kill 命令：kill 命令可以发送信号给指定的进程，并请求其关闭或终止。例如，要关闭 PID 为 12345 的进程，请使用以下命令：

   ```bash
   $: kill 12345
   ```

   如果您希望强制终止进程而不等待其自行关闭，请使用 `-9` 选项：

   ```bash
   $: kill -9 12345
   ```

2. 使用 pkill 命令：pkill 命令可以根据进程名或其他属性来查找并关闭匹配的进程。例如，要关闭名为 "myprocess" 的进程，请使用以下命令：

   ```bash
   $: pkill myprocess
   ```

   如果您希望强制终止匹配的进程而不等待其自行关闭，请使用 `-9` 选项：

   ```bash
   $: pkill -9 myprocess
   ```

需要注意的是，在使用以上命令时，请确保您已经正确标识了要关闭的进程，并且已经备份了任何重要的数据或配置文件。

## 参考文章

- [使用 Jenkins 持续集成](https://www.liaoxuefeng.com/article/1083282007018592)
- [使用 Jenkins 一键打包部署 SpringBoot 应用，就是这么 6！](https://www.macrozheng.com/mall/reference/jenkins.html)
