---
title: 使用 CloudFlare 为 hexo 博客实现 HTTPS
date: 2018-03-09 21:34:53
tags: 
  - hexo
header_image: https://i.imgur.com/LIqGxtf.png
---
过了个年，好久没更博客了，忙着各种事。

博客地址之前一直都是默认的 secsilm.github.io，一直想换个自己的域名，正巧看到 [NameBeta](https://namebeta.com/) 上好几个域名都好便宜，就准备买个搞搞，最后挑中了 `alanlee.fun` 这个域名。

把自己的博客域名换成自己买的域名并实现 HTTPS（GitHub Pages 不支持自定义域名 HTTPS），大概需要这么几个步骤（以在 [namecheap](https://www.namecheap.com/) 上购买域名为例）：

1. 在 namecheap 购买自己心仪的域名
2. 更新 GitHub 仓库
3. CloudFlare 端 DNS 配置
4. namecheap 端更改 nameservers
5. CloudFlare 端设置使用 HTTPS

第一步购买域名我就不赘述了，只是需要注意的是付款不支持支付宝，支持 PayPal。

以下假设已经购买到 `alanlee.fun` 这个域名。

## 更新 GitHub 仓库

在你的 hexo 博客**本地**根目录中的 `source` 目录下增加一个 [`CNAME` 文件](https://en.wikipedia.org/wiki/CNAME_record)（无后缀名），里面写上购买的域名，本文中即 `alanlee.fun`：

![cname](https://i.imgur.com/q5k9tYD.png)

然后把更新部署到 GitHub 上：

```
hexo d -g
```

此时你应该可以在 GitHub 上看到 `CNAME` 文件了，并且在你的仓库设置中也可以看到你的自定义域名也已经加上了，此时访问 `alanlee.fun` 应该可以进入博客了，但是此时网址栏是没有「小绿锁」的（HTTPS），要想让这个「小绿锁」出现，我们需要使用 [CloudFlare](https://www.cloudflare.com/) 的服务。

![cname-github](https://i.imgur.com/ilN6DSD.png)

![settings](https://i.imgur.com/ZKHOZxa.png)

## CloudFlare 端 DNS 配置

首先你需要注册一个 CloudFlare 账号并把自己的域名添加上去，这个过程很简单，我就不赘述了。注册完登陆之后，点击下图中的 `DNS` 选项卡，另一个 `Page Rules`  是我们一会儿要用到的。

![](https://i.imgur.com/xPpJM44.png)

然后如下图一样添加两条记录，`Value` 处都写自己原来的博客地址，即是 `your-github-username.github.com` 这样的形式，例如我的 `secsilm.github.com`：

![](https://i.imgur.com/a2lz085.png)

按理说我们下一步要在 `Page Rules` 那设置让我们的域名使用 HTTPS 链接，但是你如果现在就这么做的话你就会发现你设置不了。这是因为你必须在域名提供商那把 nameservers 设为 CloudFlare 的 DNS 才能使用他的 HTTPS 服务，所以我们现在得去 namecheap 那设置一下 nameservers，否则在 CloudFlare 上 `Overview` 处你的域名会显示未激活状态，而不是下面的 active 状态：

![](https://i.imgur.com/4kCLOCM.png)

## namecheap 端更改 nameservers

登录进 namecheap，点击右上角 `Account` → `Domain List`，在 `NAMESERVERS` 处选择 `Custom DNS`，然后填上 CloudFlare 的nameservers（可以在 CloudFlare 上 `Overview` 选项卡页面找到）：

![](https://i.imgur.com/2yZ7ZKs.png)

至此，namecheap 端的更改就结束了。

## CloudFlare 端设置使用 HTTPS

现在就只需要在 `Page Rules` 选项卡页面创建几个 page rules 就行了，免费用户最多创建 3 个：

第一个 👇：
![rule1](https://i.imgur.com/zNcNL0y.png)

第二个 👇，可选，让所有非 WWW 的链接安全地转到带 WWW 的链接：
![rule2](https://i.imgur.com/QlYf80u.png)

第三个 👇，可选，这会在 CloudFlare 的 CDN 中缓存你的静态页面：
![rule3](https://i.imgur.com/Roo2Uk0.png)

至此，[`alanlee.fun`](https://alanlee.fun/) 已经可以安全的访问了，「小绿锁」已经出现了：

![alanlee.fun](https://i.imgur.com/rfMJBdS.jpg)

## 缺点

其实这种方法并不是百分百的 HTTPS 链接，你的博客和 CloudFlare 之间还是 HTTP 链接，浏览器和 CloudFlare 之间则是 HTTPS 链接，引用 CloudFlare 官方说明：

>Firstly a word on security. If you are deploying a JavaScript app which communicates with remote APIs, be sure not to use this for sensitive data submissions. As [GitHub themselves put it](https://help.github.com/articles/what-are-github-pages/): “GitHub Pages sites shouldn't be used for sensitive transactions like sending passwords or credit card numbers.” Also bear in mind your website source files are publicly accessible in a Git repository, so be extra careful about what you put there.  

>There are some things we can’t do; GitHub Pages doesn’t let us set custom headers, which unfortunately means we can’t do HTTP/2 Server Push right now.

## References

- [Secure and fast GitHub Pages with CloudFlare](https://blog.cloudflare.com/secure-and-fast-github-pages-with-cloudflare/)
- [Hexo-6-使用Cloudflare免费HTTPS | Madao No More](https://madao.science/useful_tools/Hexo-6-%E4%BD%BF%E7%94%A8Cloudflare%E5%85%8D%E8%B4%B9HTTPS.html)
- [使用Cloudflare为自定义域名的GithubPages实现HTTPS化 | Steffan's Blog](https://steffan.cn/2017/03/22/use-cloudflare-to-implement-HTTPS-for-GithubPages-with-custom-domain-names/)

## END