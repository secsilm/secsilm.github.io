---
title: 批量导出 CSDN 博客为 Markdown 文件
date: 2017-12-25 09:27:18
tags: Python
---

CSDN 真是💊，经常性的不能访问，而且如果不用广告插件的话页面简直不能看，前段时间又挂了，发了个帖子吐槽了一下：[CSDN 博客又挂了。。。 - V2EX](https://www.v2ex.com/t/416648#reply35)。本来也考虑过自己做个，看了好久，但是由于自己对网站相关的不太懂，看着教程又复杂，就没弄了。CSDN 这次挂真让我铁了心弄自己的网站，然后用了一个下午搭起来了，随后又陆陆续续改了改主题配置之类的，弄这个还是我最近第一次一两点才睡，后来还感冒了 😞

内容为王，站搭起来了，就需要内容来充实。但是我的文章都在 CSDN 上，手动一篇一篇导过来太慢，而且 hexo 的文章需要在头部添加 [Front-matter](https://hexo.io/zh-cn/docs/front-matter.html)，所以这样一来工作量就更大了，所以考虑用 Python 把文章都爬过来，然后统一添加 Front-matter。

完整程序源码在 [secsilm/csdn2md: Export csdn blogs to markdown files.](https://github.com/secsilm/csdn2md)。

> Note：你的文章必须是使用 markdown 写的，不然无法使用本文方法导出。

## 思路

对于单篇文章，CSDN 有导出为 markdown 的功能，如下图：

![导出单篇文章](https://i.imgur.com/6aLaZPS.gif)

但是这样费时费力，所以我们需要找到当我们点击`编辑`按钮时，网页向服务器发送的请求地址，这样我们就可以直接获取到博客内容，也就可以重新写入到 markdown 文件了。

我们在文章页按`F12`调出开发者工具，切换到`Network`选项卡，然后点击`编辑`，可以看到如下几个请求：

![三个请求](https://i.imgur.com/Sg4Bb5w.png)

`webspeeds`无关，那么剩下两个，从名字可以很快看出来我们需要的是第二个：

```
http://write.blog.csdn.net/mdeditor/getArticle?id=53418159&username=u010099080
```

可以看到需要两个参数：`id`和`username`，`id`就是文章 id，这个很好获取，可以在文章地址中找到。`username`则是你的用户名，也可以在你的博客地址中找到。

下面我们看下请求头：

![请求头](https://i.imgur.com/gAkWlzs.png)

可以看到其实也没啥特别的，其中`Cookie`是一会儿我们需要的，你可以将此复制到一个 txt 文件（假设名字叫`cookies.txt`）中以备后用。由于 cookie 字符串是存在一个文件中的，所以需要一个函数来解析成`dict`：

```python
def read_and_parse_cookies(cookie_file):
    """读取并解析 cookies。

    Args:
        cookie_file: 含有 cookies 字符串的 txt 文件名

    Returns:
        一个字典形式的 cookies
    """
    with open(cookie_file, 'r') as f:
        cookies_str = f.readline()
    cookies_dict = {}
    for item in cookies_str.split(";"):
        k, v = item.split("=", maxsplit=1)
        cookies_dict[k.strip()] = v.strip()
    return cookies_dict
```

那么现在我们就可以使用`requests`来发起请求：

```python
base_url = 'http://write.blog.csdn.net/mdeditor/getArticle'
params = {
    'id': article_id,
    'username': username
}
# 根据文章 id 获取文章数据
r = requests.get(base_url, params=params, cookies=cookies)
```

再从开发者工具看下请求返回值：

![Response](https://i.imgur.com/VPMrb7Q.png)

基本上囊括了一篇文章的所有信息了，而我们只需要里面的`markdowncontent`、`title`和`create`。而且返回的数据是 json 格式，我们可以用`json.loads()`来解析成`dict`格式，方便我们写入文件：

```python
data = json.loads(r.text, strict=False)
```

最后由于我是要导入到 hexo 站点中，所以需要加 Front-matter，所以在获取到文章内容后，需要先把定义好的 Front-matter 加到文章内容里，一起写入文件：

```python
if hexo:
hexo_str = '---\ntitle: {title}\ndate: {date}\ntags:\n---\n\n'.format(
    title=title, date=data['data']['create'])
# Windows 下文件名中的非法字符
forbidden = ['\\', '/', ':', '*', '?', '"', '<', '>', '|']
# 如果文章名含有非法字符，那么使用其 id 作为 md 文件名
if any([c in repr(title) for c in forbidden]):
    with open(os.path.join(md_dir, article_id + '.md'), 'w', encoding='utf8') as f:
        f.write(hexo_str + data['data']['markdowncontent'])
else:
    with open(os.path.join(md_dir, title + '.md'), 'w', encoding='utf8') as f:
        f.write(hexo_str + data['data']['markdowncontent'])
```

至于如何通过文章列表获取文章 id，这个比较简单，我就不赘述了，大家可以直接看源码。

## Usage

程序使用`fire`来从命令行接收参数，如何使用`fire`请参考 [Python 自动生成命令行工具 - fire 简介 · Lee's Space Station](https://secsilm.github.io/2017/04/22/python-fire/#%E6%9B%B4%E6%96%B0)。我们可以使用如下命令来查看帮助：

```bash
python csdn2md.py -- --help
```

输出：

```bash
Type:        function
String form: <function to_md_files at 0x000001CACC8C5E18>
File:        d:\chromedownload\mdfiles\csdn2md.py
Line:        47
Docstring:   导出为 Markdown 文件。

Args:
    total_pages: 博客文章在摘要模式下的总页数
    filename: 含有 cookies 字符串的 txt 文件名
    start: 从 start 页开始导出 (default: {1})
    stop: 到 stop 页停止 (default: {None})
    hexo: 是否添加 hexo 文章头部字符串（default: {True}）
    md_dir: md 文件导出目录，默认为当前目录（default: .）

Usage:       csdn2md.py USERNAME TOTAL_PAGES COOKIE_FILE [START] [STOP] [HEXO] [MD_DIR]
             csdn2md.py --username USERNAME --total-pages TOTAL_PAGES --cookie-file COOKIE_FILE [--start START] [--stop STOP] [--hexo HEXO] [--md-dir MD_DIR]
```

从帮助可以看出，你需要提供用户名`username`、博客总页数`total-pages`和 cookie 文件名`cookie-file`，可选参数为`start`、`stop`（默认为`None`，即一直到博客文章最后一页）、`hexo`和`md-dir`。

例如，你需要导出博客的第一页文章到当前目录下的`mdfiles`目录，你的博客总页数为`3`，那么只需要执行如下命令：

```bash
python csdn2md.py --username u010099080 --total-pages 3 --cookie-file cookies.txt --stop 1 --md-dir mdfiles
```

控制台输出：

```bash
2017-12-25 11:54:08 INFO: Page 1
2017-12-25 11:54:08 INFO: Exporting 【TensorFlow】理解 Estimators 和 Datasets ...
2017-12-25 11:54:08 INFO: Exporting Windows 10 资源管理器黑色风格 ...
2017-12-25 11:54:09 INFO: Exporting 梯度下降优化算法概述 ...
2017-12-25 11:54:09 INFO: Exporting 使用集成学习提升机器学习算法性能 ...
2017-12-25 11:54:09 INFO: Exporting 【TensorFlow | TensorBoard】理解 TensorBoard ...
2017-12-25 11:54:09 INFO: Exporting 【Python】Numpy 中的 shuffle VS permutation ...
2017-12-25 11:54:09 INFO: Exporting 【TensorFlow】DNNRegressor 的简单使用 ...
2017-12-25 11:54:09 INFO: Exporting XGBoost 在 Windows 10 和 Ubuntu 上的安装 ...
2017-12-25 11:54:10 INFO: Exporting 【Python】自动生成命令行工具 - fire 简介 ...
2017-12-25 11:54:10 INFO: Exporting 奇异值分解 SVD 的数学解释 ...
2017-12-25 11:54:10 INFO: Exporting 【Python】统计字符串中英文、空格、数字、标点个数 ...
2017-12-25 11:54:10 INFO: Exporting 【TensorFlow】TensorFlow 的卷积神经网络 CNN - TensorBoard版 ...
2017-12-25 11:54:10 INFO: Exporting 使用 tree 命令格式化输出目录结构 ...
2017-12-25 11:54:11 INFO: Exporting VSCode Markdown PDF 导出成PDF报 phantomjs binary does not exist 错误的解决办法 ...
2017-12-25 11:54:11 INFO: Exporting 【Python】numpy 中的 copy 问题详解 ...
2017-12-25 11:54:11 INFO: Done!
```

`mdfiles`文件夹：

![mdfiles](https://i.imgur.com/UK5pcCz.png)

## END

当然，导出的文件中 Front-matter 中的 `tags` 还是需要自己添加，因为我想自己再重新加标签而不是使用原来的标签，如果你想使用原来的标签，那么只需把请求返回 json 数据中的`categories`提取出来加进去即可。

Merry Christmas! 😄