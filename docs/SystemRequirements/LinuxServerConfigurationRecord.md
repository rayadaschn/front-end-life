---
title: Linux服务器配置记录
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

# Linux 服务器配置记录

## 目录

[toc]

## 操作指令记录

> linux 操作指令语法 **[`命令 可选参数 操作的对象`]**

1. 基本操作指令(增删改查)

   - 增

   ```shell
   mkdir 文件夹1 文件夹2
   touch fileName.txt
   ```

   - 删除 remove

   ```shell
   rm [可选参数] [文件名]
   ```

   可选参数如:

   1. **-f** : 强制删除, 无提示。 `rm -f /removeDir`

   2. **-r** : 递归删除文件夹，有提示，需输入 y 同意 。 `rm -r /removeDir`

      ```shell
      rm  -rf  /tmp/*  # 删除tmp下所有内容
      rm  -rf  /tmp/   # 不加*是会直接删除这个文件夹
      ```

   - 改

   ```shell
   cd /     # 切换到根目录
   cd ./tmp # 切换到当前的子目录
   cd ..    # 切换到上一级目录
   cd ~     # 切换到自身用户的 home 目录
   cd -     # 切换到上一次工作目录

   exit     # 退出Linux
   clear    # 清空屏幕
   history  # 查看历史指令
   ```

   - 移动复制文件操作
     1. 复制 `cp [options] source dest`

   ```shell
   # -f 为覆盖已存在的文件而不提示; -r 为递归复制目标文件夹
   $: cp test.txt test.txt.bak  # 拷贝单个文件

   $: cp –r test/ newtest
   # 将当前目录 test/ 下的所有文件复制到新目录 newtest 下
   ```

   2. 移动和重命名 mv

   ```shell
   $: mv ./test.txt  ../   # 把当前目录下的test.txt移动到上一级目录去

   $: mv name.txt  newName.txt    # 将“name.txt”重命名为 newName.txt”
   ```

   - 重定向符号 > 和 >>

   ```shell
   >  # 重定向输出覆盖符，覆盖写
   >> # 重定向追加输出符，追加写入

   $: echo "覆盖写入txt文件的内容" > test.txt
   $: echo "追加写入txt文件的内容" > test.txt
   # echo 是通用 shell 指令,用于字符串的输出, 写在其它指令为显示命令执行结果
   ```

   - 查

     1. 首先看用户信息的一些操作:

     ```shell
     [root@localhost ~]# [指令]
     $: whoami    # 查看用户名,当前为 root
     $: hostname  # 查看主机名,当前为 localhost
     $: pwd       # 查看当前所在文件目录(绝对路径),当前为 ~
     # 指令前的 "#" 为用户权限提示符: "#" 为root用户; "$" 为普通用户
     ```

     2. 查看文件夹内容 ls (list)

     ```shell
     $: ls -l     # 查看文件详细信息, 可用 ll 代替
     $: ll

     # -a 可查看隐藏文件, 即以 "."开头的文件
     ```

     3. 查看文件内容

     ```shell
     cat [文件名]
     $: cat -n [文件名]    # 显示行号

     $: head -5 file.txt  # 显示文件的头5行
     $: tail -5 file.txt  # 显示文件的后5行
     ```

     4. 查找 find

     ```shell
     find [查找位置] -name [查找文件名称]
     $: find / -name "*.txt"  # 在根目录开始查找 ".txt"结尾的文件, "*"为通配符
     ```

2. 添加用户权限(读写权限)

```shell
sudo chmod -R 777 /usr/share/nginx/html
```

说明: `chomd` 是改变权限的命令，`-R` 是递归遍历子目录的意思，`777` : 第一个 **7** 表示文件所属者的权限，第二个 **7** 表示所属者所在组的权限，第三个 **7** 表示其它用户的权限。（7=4+1+1，4： 执行时设置用户 ID、2：执行时设置用户组 ID、1：设置粘着位），最后为添加权限目录。

## Linux 目录划分

> Linux 目录分割符是正斜杠 /
>
> Windows 目录分割符是反斜杠 \

| 目录                                   | 作用                                                                                                     |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `/`                                    | Linux 系统的根目录，一般只存放目录                                                                       |
| `/bin` 和 `/usr/bin`                   | 命令（二进制）文件目录，包含可供 root 用户和普通用户所使用的 Linux 命令和二进制文件，包含 shell 解析器等 |
| `/boot`                                | 系统引导和内核目录，存放引导装载文件                                                                     |
| `/dev`                                 | 设备目录，存放各个硬件设备的信息，例如光驱、硬盘等                                                       |
| `/etc`                                 | 系统级别的配置文件存放的目录，一般由配置管理员来使用                                                     |
| `/home`                                | 所有普通用户的家目录                                                                                     |
| `/lib`、`/usr/lib` `/usr/local/lib`    | 系统使用的函数库的目录                                                                                   |
| `/lost+fount`                          | 在 ext2 和 ext3 文件系统中，系统崩溃时记录信息的目录                                                     |
| `/opt`                                 | 给主机额外安装软件所摆放的目录                                                                           |
| `/proc`                                | 重要的需要放置在内存中的数据                                                                             |
| `/root`                                | root 用户的的根目录                                                                                      |
| `/sbin`、`/usr/sbin` `/usr/local/sbin` | 放置的是系统管理员（root）才能使用的命令，普通用户只能进行查看，而 `/bin` 目录中的命令普通用户也可以使用 |
| `/tmp`                                 | 存放应用程序产生的临时数据不能在此目录下存放重要数据                                                     |
| `/var`                                 | 系统一般运行时需要改变的数据                                                                             |
| `/usr`                                 | 是 Unix Software Resource 的缩写，应用程序相关目录命令、函数库、共享包、内核源码                         |

## 搭建 `Nginx` 服务器

1. 安装 `Nginx` (不同服务器的相关指令)

   ```shell
   $ sudo yum install epel-release && yum install nginx [On CentOS]
   $ sudo dnf install nginx [On Ubuntu]
   ```

   安装成功后，检测指令： **`nginx -v`** 显示 nginx 版本。

2. `Nginx` 相关指令

   ```shell
   # 查找 nginx 服务器地址
   $: ps aux|grep nginx

   # 检查配置文件是否正确
   $: nginx -t
   ```

   **路径作用:**

- `/etc/nginx`：nginx 配置文件的根目录，nginx 的所有配置文件都在这个目录下面；
- `/etc/nginx/nginx.conf`：nginx 主配置文件，**所有 nginx 的基础和全局配置**都应该在这个文件中配置；
- `/etc/nginx/conf.d`：nginx 默认站点配置文件所在目录；
- `/var/log/nginx`：nginx 日志文件目录，访问日志 `access.log` 和 错误日志 `error.log` 都在这个目录中；

3. 设置 `nginx` 为系统服务, 并启动服务

   ```shell
   # 设置为系统服务
   sudo systemctl enable nginx
   # 启动nginx服务使用start，此外还有stop、restart、reload、命令
   sudo service nginx start
   ```

   设置/启动完毕后，检测 `nginx` 服务的运行状态:

   ```shell
   sudo service nginx status
   ```

4. 开启防火墙配置

   为了让服务器的 **80 端口 **能够被外网访问, 我们还需要进行进一步设置:

   - `http` 协议

     ```shell
     #开启80端口
     sudo firewall-cmd --zone=public --add-port=80/tcp --permanent

     sudo firewall-cmd --zone=public --add-service=http --permanent
     #重新加载防火墙配置
     sudo firewall-cmd --reload
     ```

   - `https` 协议(端口不同)

     ```shell
     #开启443端口
     sudo firewall-cmd --zone=public --add-port=443/tcp --permanent

     sudo firewall-cmd --zone=public --add-service=https --permanent
     #重新加载防火墙配置
     sudo firewall-cmd --reload
     ```

     - **centos**出现`“FirewallD is not running”` :

       问题原因: 服务器未开启防火墙;

       解决办法:

       i. 检查防火墙状态:

       ```shell
       $: systemctl status firewalld
       # 若 Active: inactive (dead), 则未防火墙未开启
       # 若 Active: active (running) ..., 则表示防火墙已开启
       ```

       ii. 开启防火墙:

       ```shell
       # 若无权限,则前附加 sudo; 开启后无提示,需重新检测防火墙状态
       $: systemctl start firewalld
       ```

       iii. 防火墙关闭指令(不用设置,仅做记录):

       ```shell
       $: systemctl stop firewalld
       ```

## 参考文件

1. [详解如何部署前端代码到云服务器上](https://juejin.cn/post/7081343211603492871)
