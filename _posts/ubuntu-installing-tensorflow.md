---
title: Ubuntu 14.04 64 位安装 Google 的 TensorFlow
date: 2016-08-27 10:23:48
tags:
  - TensorFlow
  - Ubuntu
---

今天来说一下机器学习库 TensorFlow 的在 Ubuntu14.04 64位下的安装。

<!-- more -->

---

## 更新

这里我会列出对本文的更新。

- 2017 年 10 月 13 日：
	- 优化排版，与其他博文保持统一。
   - 去掉公众号相关内容。

---

## 什么是 TensorFlow

关于什么是 TensorFlow ，这里引用一下 [官网](https://www.tensorflow.org) 的介绍：
>TensorFlow™ is an open source software library for numerical computation using data flow graphs. 

简单来说，就是机器学习（Machine Learning）的一个开源软件库，你可以方便的实现 CNN 等机器学习算法，并且使用 GPU 并行加速你的算法。

TensorFlow 起初是 Google Brain 小组为 Google 的研究和产品开发的一套工具，例如我们熟知的语音识别，Gmail，Google Photos 和 Google 搜索，随后于2015年11月9日在 Apache 2.0 开源许可证下 对外开源发布，现在稳定版本是0.9.0版本。
<table class="table table-bordered table-striped table-condensed"><tr><td colspan="2" align="center"> TensorFlow </td></tr><tr><td align="center">开发者</td><td align="center">Google Brain Team</td></tr><tr><td align="center">稳定版本</td><td align="center">0.9.0</td></tr><tr><td align="center">编写语言</td><td align="center">Python， C++</td></tr><tr><td align="center">平台</td><td align="center">Linux， Mac OS X</td></tr><tr><td align="center">类型</td><td align="center">机器学习库</td></tr><tr><td align="center">许可证</td><td align="center">Apache 2.0</td></tr><tr><td align="center">官网</td><td align="center">www.tensorflow.org</td></tr>

如上表所示，TensorFlow 对 Windows 平台没有原生支持（naive support），所以不建议在 Windows 下安装，但是也有方法。具体可参见 [这里](http://blog.csdn.net/neilron/article/details/51387161)。官方文档见 [这里](https://www.tensorflow.org/versions/r0.10/get_started/index.html)，极客学院 Wiki 团队发起活动将其翻译成了中文，见 [这里](http://wiki.jikexueyuan.com/project/tensorflow-zh/#32383424973c9218c51bbb2c1d7f8705)，在这里赛克君向翻译者的艰辛劳动致以敬意。但是从我几天的学习来看，建议英文较好的童鞋看英文原版，中文翻译的和原文有些地方有差异，或者中英搭配看，先看中文，遇到不清楚有疑问的地方回过头去看英文对应地方。

---

## 安装步骤鸟瞰

这里仅介绍在 Ubuntu14.04 64 位下的使用 Anaconda 的安装方式，其他安装方式请参见官方文档。

Anaconda 是一个 Python 的发布版本，其中内置了非常多的用于数值和科学计算的库，省得你去一个一个的自己安装，如果需要再安装库的话，可以用 conda 或者 pip 命令来安装，只不过有时候 conda 命令安装比较慢，因为他的服务器在国外，这时候你可以用 pip 命令试试。

>a. 下载并安装 Anaconda
b.  创建一个 conda 环境
c.  激活这个 conda 环境并在里面安装 TensorFlow
d.  测试安装是否成功
e.  安装成功之后每次当你需要使用 TensorFlow 的时候，你需要重新激活这个 conda 环境

---

## a. 下载并安装 Anaconda

在 [这个](https://www.continuum.io/downloads#linux) 页面选择适合你的版本（Python 版本和你的系统版本，这里赛克君选择 Python2.7 和 Linux 64 位）并下载，遵照安装指导在你的电脑上安装 Anaconda 。

![这里写图片描述](http://img.blog.csdn.net/20160827130414099)
*Anaconda for Linux*

下载完成后安装的时候需要在终端进入你下载文件所在的文件夹才能执行上图中的命令，否则需要加上安装文件的绝对路径。

```
bash Anaconda2-4.1.1-Linux-x86_64.sh
```

---

## b. 创建一个 conda 环境

创建一个名为 `tensorflow` 的 conda 环境。

如果你的 Python 版本为 **2.7**，使用

```
conda create -n tensorflow python=2.7
```

如果你的 Python 版本是 **3.4**，使用

```
conda create -n tensorflow python=3.4
```

如果你的 Python 版本是 **3.5**，使用

```
conda create -n tensorflow python=3.5
```

此时你已经创建好了一个名为 `tensorflow` 的 conda 环境。

---

## c. 激活这个conda环境并在里面安装TensorFlow

激活 `tensorflow` 环境，使用

```
source activate tensorflow
```

这时你的终端提示符会改变，在前面多了个 `tensorflow`，如下图：

![这里写图片描述](http://img.blog.csdn.net/20160827130608413)

然后就可以在里面安装 TensorFlow了，有两种方式 —— *conda* 和 *pip* 。

**使用 conda**

使用 conda 安装目前 *仅支持 CPU 版本*，也就是说不支持 GPU。使用下面命令安装：

```
conda install -c conda-forge tensorflow
```

**使用 pip**

使用 pip 安装你可以选择仅 CPU 或者支持 GPU。首先选择你要的版本，选择一个就行。

```
# Ubuntu/Linux 64-bit, CPU only, Python 2.7
(tensorflow)$ export TF_BINARY_URL=https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-0.10.0rc0-cp27-none-linux_x86_64.whl

# Ubuntu/Linux 64-bit, GPU enabled, Python 2.7
# Requires CUDA toolkit 7.5 and CuDNN v4. For other versions, see "Install from sources" below.
(tensorflow)$ export TF_BINARY_URL=https://storage.googleapis.com/tensorflow/linux/gpu/tensorflow-0.10.0rc0-cp27-none-linux_x86_64.whl

# Mac OS X, CPU only, Python 2.7:
(tensorflow)$ export TF_BINARY_URL=https://storage.googleapis.com/tensorflow/mac/cpu/tensorflow-0.10.0rc0-py2-none-any.whl

# Mac OS X, GPU enabled, Python 2.7:
(tensorflow)$ export TF_BINARY_URL=https://storage.googleapis.com/tensorflow/mac/gpu/tensorflow-0.10.0rc0-py2-none-any.whl

# Ubuntu/Linux 64-bit, CPU only, Python 3.4
(tensorflow)$ export TF_BINARY_URL=https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-0.10.0rc0-cp34-cp34m-linux_x86_64.whl

# Ubuntu/Linux 64-bit, GPU enabled, Python 3.4
# Requires CUDA toolkit 7.5 and CuDNN v4. For other versions, see "Install from sources" below.
(tensorflow)$ export TF_BINARY_URL=https://storage.googleapis.com/tensorflow/linux/gpu/tensorflow-0.10.0rc0-cp34-cp34m-linux_x86_64.whl

# Ubuntu/Linux 64-bit, CPU only, Python 3.5
(tensorflow)$ export TF_BINARY_URL=https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-0.10.0rc0-cp35-cp35m-linux_x86_64.whl

# Ubuntu/Linux 64-bit, GPU enabled, Python 3.5
# Requires CUDA toolkit 7.5 and CuDNN v4. For other versions, see "Install from sources" below.
(tensorflow)$ export TF_BINARY_URL=https://storage.googleapis.com/tensorflow/linux/gpu/tensorflow-0.10.0rc0-cp35-cp35m-linux_x86_64.whl

# Mac OS X, CPU only, Python 3.4 or 3.5:
(tensorflow)$ export TF_BINARY_URL=https://storage.googleapis.com/tensorflow/mac/cpu/tensorflow-0.10.0rc0-py3-none-any.whl

# Mac OS X, GPU enabled, Python 3.4 or 3.5:
(tensorflow)$ export TF_BINARY_URL=https://storage.googleapis.com/tensorflow/mac/gpu/tensorflow-0.10.0rc0-py3-none-any.whl
```

然后安装，如果你用的是 Python 2，使用

```
pip install --ignore-installed --upgrade $TF_BINARY_URL
```

如果你用的是 Python 3，使用

```
pip3 install --ignore-installed --upgrade $TF_BINARY_URL
```

此时你已经在 `tensorflow` 环境中安装了 tensorflow 。

---

## d. 测试安装是否成功

首先激活 `tensorflow` 环境，然后进入 python，最后导入 tensorflow 库。如果导入成功则表明安装成功。

![这里写图片描述](http://img.blog.csdn.net/20160827100821186)
*这里使用了官方文档中的示例*

---

## e. 需要使用 TensorFlow 的时候必须重新激活

当使用完毕后，关闭 `tensorflow` 环境。

```
source deactivate
```

然后你的终端提示符就会变会原的样子。

当你需要再次使用的时候就必须再次激活 `tensorflow` 环境。
```
source activate tensorflow
```

![这里写图片描述](http://img.blog.csdn.net/20160827100935063)
*关闭 `tensorflow` 环境，并重新激活*

---

## f. Finally

至此，你已经拥有了一个可以玩耍机器学习的 `tensorflow` 环境，好好玩耍吧：）

你可以参照官方文档快速的运行一个手写数字识别的示例。友情提示：仅 CPU 版本你需要有足够的耐心。。。。。。

---

## END