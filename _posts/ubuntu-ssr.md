---
title: 在 Ubuntu 上使用 SSR 梯子
date: 2018-5-18 17:37:06
tags:
  - Ubuntu
header_image: https://i.imgur.com/UyN5NWT.jpg
---
## 引言

过去两年左右我基本上都是使用 SS 梯子，Windows 上的客户端使用的就是 [shadowsocks](https://github.com/shadowsocks/shadowsocks-windows)，Ubuntu 上使用 [shadowsocks-qt5](https://github.com/shadowsocks/shadowsocks-qt5)。然而最近换成了 SSR（也就是俗称的酸酸乳，shadowsocksr），SS 和 SSR 这其中的爱恨纠葛我就不再赘述，有兴趣的可自行百度或者 Google。Windows 上仍然有好用的客户端 [shadowsocksr](https://github.com/shadowsocksrr/shadowsocksr-csharp/releases)，但是 Ubuntu 上一直没有找到合适的好用的客户端。由于最近没有再使用 Ubuntu，这个问题也一直悬而未决，直到这几天重新试图去解决这个旧问题，终于有所突破了，特记录下来以备后查。

本文主要有两种方法：
- 方法 1：该方法是基于命令行的，主要参考 [我在ubuntu18.04使用ssr的过程](https://blog.csdn.net/u010658816/article/details/79344970) 一文，方法大同小异，基本是一样的，主要有以下几个步骤：

	1. 下载并安装 SSR 客户端
	2. 配置服务器信息
	3. 启动 SSR

- 方法 2：使用 [electron-ssr](https://github.com/erguotou520/electron-ssr) 客户端

## 方法 1

### 下载并安装 SSR 客户端

下载和安装客户端（一个 shell 脚本）主要有以下几步：

1. 下载 SSR：`wget http://www.texfox.com/ssr`
2. 将其加到 `$PATH` 环境变量里（不必和我一样的目录，只要保证 SSR 文件能在 `PATH` 里找到即可）：`sudo mv ssr /usr/local/bin`
3. 加入可执行权限：`sudo chmod 766 /usr/local/bin/ssr`
4. 安装：`ssr install`

为了防止各种原因在第一步的时候下载不到文件，我自己备份了一份，你可以点击[这里](https://drive.google.com/open?id=1S2PxUXEIsK7ZLMlAnaEIC9_eq_JVw7vZ)下载。

### 配置服务器信息

安装完成后，按道理直接使用

```
ssr config
```

即可完成配置，但是在我这里却报错了：

![](https://i.imgur.com/qK7IXJQ.jpg)

```
No protocol specified
Unable to init server: 无法连接： 拒绝连接
```

这一步实际上就是配置服务器信息，所以既然这样不行，那我就直接找到修改对应的配置文件。这个配置文件的路径是 `/usr/local/share/shadowsocksr/config.json`，我们可以手动打开并将自己的服务器信息添加进去即可。

![](https://i.imgur.com/pXHD6Fu.jpg)

### 启动 SSR

这一步很简单，直接执行下面的命令就可以了：

```
ssr start
```

停止和查看帮助：

```
ssr stop
ssr help
```

然后你就可以打开浏览器上网了。Firefox 浏览器需要在「首选项 → 常规 → 网络代理设置 → 设置」中选择「手动代理配置」，然后填入你的本地监听地址和端口，以及选择 SOCKS5：

![](https://i.imgur.com/swAwhON.jpg)

至于 Chrome，网上很多人都说需要使用 SwitchyOmega 插件，但是我直接打开浏览器就能上外网，所以并没有使用该插件，如果你上不了网的话可以将在 Firefox 中配置的信息在系统设置中配置一下。

## 方法 2

方法 1 没有使用图形化界面，[erguotou520](https://github.com/erguotou520) 做了一个界面：[electron-ssr](https://github.com/erguotou520/electron-ssr)，方法 2 就是使用这个软件来使用代理，和 Windows 下的客户端很相似，使用过程也基本一样。

首先在[这里](https://github.com/erguotou520/electron-ssr/releases)下载最新的 deb 安装包，例如我下载的是 [electron-ssr_0.2.3_amd64.deb](https://github.com/erguotou520/electron-ssr/releases/download/v0.2.3/electron-ssr_0.2.3_amd64.deb)，然后使用下面的命令安装：

```
sudo dpkg -i electron-ssr_0.2.3_amd64.deb
```

完成后打开该软件，如果你有订阅地址的话就可以很方便的添加服务器信息了，直接复制订阅地址然后更新就行了：

![](https://i.imgur.com/hpzcLbt.jpg)

剩下的就和 Windows 版的一样了，系统代理模式、更新 PAC、添加服务器、扫描二维码和开机自启等都有，如果想要在终端中使用代理，那么在配置中选中 http 代理：

![](https://i.imgur.com/kzGCihK.jpg)

然后在终端中执行下面命令即可，其中的端口就是上图中的端口：

```
export http_proxy="http://127.0.0.1:12333"
```

然后可以使用 `curl www.google.com` 来测试是否成功使用代理。

## References

- [我在ubuntu18.04使用ssr的过程 - CSDN博客](https://blog.csdn.net/u010658816/article/details/79344970)
 
## END
