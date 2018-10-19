---
title: Google sitemap 不允许的网址的解决办法
date: 2017-12-30 11:20:47
tags:
  - hexo
---
<link
    href="https://cdn.pydata.org/bokeh/release/bokeh-0.12.14.min.css"
    rel="stylesheet" type="text/css">
<link
    href="https://cdn.pydata.org/bokeh/release/bokeh-widgets-0.12.14.min.css"
    rel="stylesheet" type="text/css">
<link
    href="https://cdn.pydata.org/bokeh/release/bokeh-tables-0.12.14.min.css"
    rel="stylesheet" type="text/css">

<script type="text/javascript" src="https://cdn.pydata.org/bokeh/release/bokeh-0.12.14.min.js"></script>
<script type="text/javascript" src="https://cdn.pydata.org/bokeh/release/bokeh-widgets-0.12.14.min.js"></script>

## 问题

这段时间搭建好自己的[博客](https://secsilm.github.io/)后，想要让别人可以在 Google 中找到我的文章，于是就得添加 sitemap，怎么生成 sitemap 的相关文章有很多，我在这里就不赘述了。我在`npm install hexo-generator-sitemap --save`装了插件后，确实生成了`sitemap.xml`文件，但是提交到 [Google Search Console](https://www.google.com/webmasters/tools/) 的时候就出错了：不允许的网址（忘了截图）。

> Note：本文方法只是许多解决方法中的一个，造成这个问题的原因也不止一个（见[完整错误列表](https://support.google.com/webmasters/answer/183669?hl=zh-Hans&visit_id=1-636501984739210099-2033365588&rd=1#errors)），因此本文方法可能并不能解决你的问题，仅供参考。

## 解决

网上搜了好多文章，千篇一律，一个偶然的机会我仔细看了下我生成的`sitemap.xml`文件，结果发现：

![错误的 sitemap](https://i.imgur.com/nOZWc4R.png)

可以看到地址都是错的，都是`yoursite.com`开头，这很明显不是我的网址啊 😲，肯定是我犯了个 stupid 错误，哪里的默认配置没有改。

后来在检查我的`_config.yml`文件的时候发现：

![config.yml](https://i.imgur.com/QJUu4zq.png)

`url`竟然写的是默认值，没有改！

那么把`url`改成你的地址就可以了，例如我的

```yaml
url: https://secsilm.github.io/
```

然后`hexo g -d`更新网站，再在 Google Search Console 重新提交一次 sitemap 就可以了。

![success](https://i.imgur.com/O4OhpQw.png)

Problem solved！

## END