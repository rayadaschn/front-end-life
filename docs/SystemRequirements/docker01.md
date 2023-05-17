---
title: Mac配置记录
icon: linux
date: 2023-05-16
category:
  - linux
tag:
  - docker
# star: true
# sticky: true
sticky: false
---

# Docker 入门

## 前置知识

**systemctl** 指令，可以查阅《[Systemd 入门教程：命令篇](https://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html)》。system 是一个 systemd 工具，主要负责控制 systemd 系统和服务管理器。诸如 timedatectl 等以 ctl 结尾的命令，其中 **ctl的意思是control，也就是控制**。

**Docker** 是什么? 为了解决运行环境和配置问题的软件容器，方便做持续集成并有助于整体发布的容器虚拟化技术。

## 安装及常用命令

值得注意的是，Docker 并非是一个通用的容器工具，它依赖于已存在并运行的 Linux 内核环境。因此，Docker 必须部署在 Linux 内核的系统上。

CentOS 安装：

1. 安装： `yum -y install docker-ce docker-ce-cli containerd.io `
2. 启动 Docker： `systemctl start docker` 
3. 测试：`docker version`
4. 卸载： 
   - `systemctl stop docker`
   - `yum remove docker-ce docker-ce-cli containerd.io`
   - `rm -rf /var/lib/docker`
   - `rm -rf /var/lib/containerd`

容器常用指令：

有镜像才能创建容器，下载镜像相当于下拉包：

- 下载 CentOS：`docker pull centos`
- 下载 Ubuntu：`docker pull ubuntu`

1. 新建并启动容器：`docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`

   - OPTIONS 说明 有些是一个 “`-`”有些是俩个“`--`”；

   - `--name` 容器新名字，为容器指定一个名称；

   - `-d`：后台运行容器 ID，即启动后台守护式容器；

   - `-i`：表示将标准输入 (stdin) 绑定到容器的交互式 shell。这个选项可以让你将本地计算机上的文件传递给容器，或者从容器中提取文件到本地计算机。，通常与“`-t`” 同时使用；

   - `-t`：在创建容器时为其分配一个伪终端 (pseudo-tty)，生成可交互的 shell 环境。这个选项可以让你在容器内部执行命令，并且可以像在本地终端一样与容器交互。通常与“`-i`”同时使用；

   - `-P`：大写 P 为随即端口映射；

   - `-p`：小写 p 为指定端口。

   > `-it` 与 `-d` 的区别：
   >
   > `docker run -it ubuntu bash` ： 前台命令行交互；
   >
   > `docker run -d nginx`：容器后台运行。

2. 列出当前所有正在运行的容器：`docker ps [OPTIONS]` 

   - `-a`：列出当前所有正在运行的容器 + 历史上运行过的；
   - `-l`：显示最近创建的容器；
   - `-n`：显示最近 n 个创建的容器；
   - `-q`：静默模式，只显示编号。

3. 退出容器：

   - exit：run 进去容器，exit 退出，容器停止；
   - ctrl + p + q：run 进去容器， ctrl + p + q 退出，容器不停止。

4. 启动已经停止运行的容器：`docker start <容器 ID 或容器名>`

5. 重启容器：`docker restart <容器 ID 或容器名>`

6. 停止容器：`docker stop <容器 ID 或容器名>`

7. 强制停止容器：`docker kill <容器 ID 或容器名>`

8. 删除已停止的容器：`docker rm <容器 ID>`

9. 查看容器日志：`docker logs <容器 ID>`

10. 查看容器内运行的进程：`docker top <容器 ID>`

11. 查看容器内部细节：`docker inspect <容器 ID>`

12. 进入正在运行的容器并以命令行交互：`docker exec -it <容器 ID> bashShell`

13. 从容器内部拷贝文件到主机上：`docker cp <容器 ID> <目的主机路径>`

14. 导入容器：`cat <文件名.文件后缀> | docker import - <镜像用户/镜像名:镜像版本号>`

    ```bash
    $: cat README.md | docker import - huy/ubuntu:2.0
    ```

15. 导出容器：`docker export <容器 ID> > <文件名.文件后缀>`

    ```bash
    $: docker export 123456 > README.md
    ```





















