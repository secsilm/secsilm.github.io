---
title: 使用 tree 命令格式化输出目录结构
date: 2017-03-15 12:45
tags: 
  - Windows
  - Ubuntu
---

今天在写一个 Markdown 文件的时候需要将一个目录的结构表示出来，于是找了找有没有相关命令，找到一个叫做 `tree` 的命令，Windows 和 Linux 都有这个命令。

<!-- more -->

---

# Windows 10

我是在 Windows 10 上用的，不过根据 [这篇文章](http://www.computerhope.com/treehlp.htm) 应该在 Windows 7 和 8 上也是可以用的。用法如下：

```
tree [Drive:[[Path] [/F] [/A]
```

其中

-  `/F` 表示不仅输出文件夹，也输出文件名。默认是只输出文件夹的名字。
-  `/A` 表示使用另一种方式来绘制目录树。

例如：

仅列出目录
```bash
tree D:\MasterFiles\MachineLearning\TensorFlow\TensorFlow-Examples\MyCode\cifar10-TensorFlow-tensorboard
```
![仅列出目录](http://img.blog.csdn.net/20170315123020407?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

---

另一种方式输出
```bash
tree D:\MasterFiles\MachineLearning\TensorFlow\TensorFlow-Examples\MyCode\cifar10-TensorFlow-tensorboard /A
```
![另一种方式输出](http://img.blog.csdn.net/20170315123119881?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

---

列出目录及文件
```bash
tree D:\MasterFiles\MachineLearning\TensorFlow\TensorFlow-Examples\MyCode\cifar10-TensorFlow-tensorboard /F
```
![列出目录及文件](http://img.blog.csdn.net/20170315123155565?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

---

# Linux

由于我现在用的是 Windows 10，所以就先暂时用 Windows 10 自带的 Ubuntu 子系统测试了，回头再用真正的 Ubuntu 试试。关于如何使用 Windows 10 自带的 Ubuntu 子系统我就不多说了，大家直接百度就好，教程很多。

列出目录及文件
```bash
tree cifar10-TensorFlow-tensorboard
```

![列出目录及文件](http://img.blog.csdn.net/20170315123846386?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

---

只列出目录
```bash
tree cifar10-TensorFlow-tensorboard -d
```

![只列出目录](http://img.blog.csdn.net/20170315123953494?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

更详细的参数设置可以使用 `man tree` 查看，如果输入 `tree` 提示没有安装，那么可以使用 `sudo apt-get install tree` 来安装该命令。

---

# END