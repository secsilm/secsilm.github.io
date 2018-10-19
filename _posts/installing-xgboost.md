---
title: XGBoost 在 Windows 10 和 Ubuntu 上的安装
date: 2017-05-18 10:58
tags:
  - Machine Learning
  - Data Science
---

关于什么是 `XGBoost`，我在这里不再解释，如果有时间的话再写一篇文章来解释，在数据科学里非常有用。大家可以参考 Tianqi Chen 的论文 [XGBoost: A Scalable Tree Boosting System](https://arxiv.org/abs/1603.02754) ，本篇文章只是在 Windows 10 和 Ubuntu 上安装 `XGBoost` 的 Python 包的方法，Ubuntu 版本为 16.04 LTS，Python 版本均为 3.5，Anaconda。

<!-- more -->

---

## Windows 10

### 官网

[官网](https://xgboost.readthedocs.io/en/latest/build.html) 介绍的方法是从 [GitHub](https://github.com/dmlc/xgboost/) 编译安装，但是在我的机器上没有成功，`pip` 同样不成功。有兴趣的话可以参考官网和 2016 年的一篇文章 [
Installing XGBoost For Anaconda on Windows](https://www.ibm.com/developerworks/community/blogs/jfp/entry/Installing_XGBoost_For_Anaconda_on_Windows?lang=zh) 来试试。

### Unofficial Windows Binaries for Python Extension Packages

[这个](http://www.lfd.uci.edu/~gohlke/pythonlibs/) 是加州大学提供的一个非官方包列表，提供了很多 Python 包的 `whl` 文件下载，`XGBoost` 的在 [这里](http://www.lfd.uci.edu/~gohlke/pythonlibs/#xgboost)，我自己下好了一份放在里 [这里](http://download.csdn.net/download/u010099080/9845455)。根据你的环境下载对应的包，比如我的是 Python 3.5，Windows 10 64 位，那就选下面红框这个：

![这里写图片描述](http://img.blog.csdn.net/20170518105305496?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast) 

然后再命令行中使用下面的语句安装：

```bash
pip install xgboost-0.6-cp35-cp35m-win_amd64.whl
```

安装完成后使用 `import xgboost` 导入即可。导入完成后可能会有警告提示：

![这里写图片描述](http://img.blog.csdn.net/20170518105542912?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

不过暂时不影响，这个问题已经在 GitHub 版本修复了，但是这个 `whl` 文件并不是最新的。

---

## Ubuntu

### pip

我在 Ubuntu 上使用 pip 方式安装成功，

```bash
$ pip install xgboost
Collecting xgboost
  Downloading xgboost-0.6a2.tar.gz (1.2MB)
    100% |████████████████████████████████| 1.2MB 1.0MB/s 
Requirement already satisfied: numpy in /home/alan/.local/lib/python3.5/site-packages (from xgboost)
Requirement already satisfied: scipy in /home/alan/anaconda3/lib/python3.5/site-packages (from xgboost)
Requirement already satisfied: scikit-learn in /home/alan/anaconda3/lib/python3.5/site-packages (from xgboost)
Building wheels for collected packages: xgboost
Running setup.py bdist_wheel for xgboost ... done
Stored in directory: /home/alan/.cache/pip/wheels/5e/c1/d6/522af54e5cc001fad4dd855117f8bf61b11d56443e06672e26
Successfully built xgboost
Installing collected packages: xgboost
Successfully installed xgboost-0.6a2
```

安装后的版本为 `0.6a2`。

### 编译安装

同样参照 [官网](http://xgboost.readthedocs.io/en/latest/build.html#building-on-ubuntu-debian) 的安装方法：

```bash
git clone --recursive https://github.com/dmlc/xgboost
cd xgboost
make -j4
```

然后再进入 `python-package` 目录，使用 `sudo python setup.py install` 安装 Python 包。

---

## Issues

### #1 `OSError: version 'GLIBCXX_3.4.20' not found`

Ubuntu 下，在安装完成后用 `import xgboost` 导入的时候你可能遇到这样的问题：

![这里写图片描述](http://img.blog.csdn.net/20170522102222313?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
*右键在新标签页打开查看大图*

这时你可以使用 `conda` 安装 `libgcc`：

```bash
conda install libgcc
```
然后再导入问题就应该解决了。

其他问题可以参考 [Installing XGBoost on Ubuntu](http://www.exegetic.biz/blog/2015/12/installing-xgboost-ubuntu/) 。

---

## END


