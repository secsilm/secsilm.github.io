---
title: VSCode Markdown PDF 导出成PDF报 phantomjs binary does not exist 错误的解决办法
date: 2017-03-11 09:53
tags: IDE
toc: true
---

## 问题

VSCode 是微软推出的一款开源的代码编辑器，从 sublime text 转过来后感觉还不错，昨天在用他写 Markdown 文件时想着直接导出 PDF 文件（之前都是用 Markdown Pad 2），找到一个叫 *Markdown PDF* 的插件，安装之后在 Markdown 文件里右键选择 `Convert Markdown to PDF` 后报如下错误：

![这里写图片描述](http://img.blog.csdn.net/20170311094443495?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

就是 `ERROR: phantomjs binary does not exist` ，在后面那个目录找不到这个文件。

<!-- more -->

---

## 解决

错误信息已经说得很明确，既然他找不到那个文件，那我们就把那个文件放到那个目录下就好了。

文件可以去其 [官网](http://download.csdn.net/detail/u010099080/9777537) 下载，或者我已经下载好了，直接从 [这里](http://download.csdn.net/detail/u010099080/9777537) 下载也行。

解压后将其中的 `bin` 目录放到上面所指定的目录下，一般来说是：`C:\Users\your username\.vscode\extensions\yzane.markdown-pdf-0.1.6\node_modules\phantomjs-prebuilt\lib\phantom`，将其中的 `your username` 替换成你的 Windows 用户名即可。

放进去后目录结构是这样的：

![这里写图片描述](http://img.blog.csdn.net/20170311095201580?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

之后重启 VSCode，在你的 Markdown 文件里右键选择 `Convert Markdown to PDF` 或者按 `F1` 或者 `Ctrl Shift P` 输入 `pdf` ，选择 `Convert Markdown to PDF` 回车即可，稍等片刻即可看到如下提示，表示导出成功。当然，也可以导出成 `html`，`png`，`jpg` 等格式。

![这里写图片描述](http://img.blog.csdn.net/20170311095745198?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

---

## END