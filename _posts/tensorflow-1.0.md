---
title: TensorFlow 1.0 发布
date: 2017-02-16 10:46:55
tags:
  - TensorFlow
---

前面写了 [TensorFlow 在Windows上的安装教程](https://secsilm.github.io/2016/12/01/installing-tensorflow/)，当时版本还是 0.12 。

NOW

首届 [TensorFlow 开发者大会](https://events.withgoogle.com/tensorflow-dev-summit/watch-the-videos/#content)（TensorFlow Dev Summit）已于美国时间昨日召开，YouTube 还进行了直播。更重要的是，**TensorFlow 1.0** 版本发布。Google Research Blog 也于昨天在 [博客](https://research.googleblog.com/2017/02/announcing-tensorflow-10.html) 中公布了这一消息。

<!-- more -->

![这里写图片描述](http://img.blog.csdn.net/20170216155804609?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

---

## 改动

这一版本的改动还是比较大的，很多旧的 API 都已经不再使用。在 [博客](https://research.googleblog.com/2017/02/announcing-tensorflow-10.html) 中可以看到 1.0 版本更快、更灵活、更稳定（production-ready） 。TensorFlow 1.0 版本保证 Python API 的稳定性，即使以后添加新的特性也不用担心会破坏现有代码。

博客中提到的其他新版本两点（*为避免翻译造成的偏差，我就直接引用原文了*）：

 - Python APIs have been changed to resemble NumPy more closely. For this and other backwards-incompatible changes made to support API stability going forward, please use our handy [migration guide](https://tensorflow.org/install/migration) and [conversion script](https://github.com/tensorflow/tensorflow/tree/r1.0/tensorflow/tools/compatibility).
 - Experimental APIs for [Java](https://github.com/tensorflow/tensorflow/tree/master/tensorflow/java) and [Go](https://github.com/tensorflow/tensorflow/tree/master/tensorflow/go)
 - Higher-level API modules tf.layers, tf.metrics, and tf.losses - brought over from [tf.contrib.learn](https://www.tensorflow.org/get_started/tflearn) after incorporating [skflow](https://github.com/tensorflow/skflow) and [TF Slim](https://github.com/tensorflow/models/blob/master/inception/inception/slim/README.md)
 - Experimental release of [XLA](http://tensorflow.org/performance/xla), a domain-specific compiler for TensorFlow graphs, that targets CPUs and GPUs. XLA is rapidly evolving - expect to see more progress in upcoming releases.
 - Introduction of the TensorFlow Debugger ([tfdbg](https://www.tensorflow.org/programmers_guide/debugger)), a command-line interface and API for debugging live TensorFlow programs.
 - New [Android demos](https://github.com/tensorflow/tensorflow/tree/r1.0/tensorflow/examples/android) for object detection and localization, and camera-based image stylization.
 - [Installation](https://www.tensorflow.org/install) improvements: Python 3 docker images have been added, and TensorFlow’s pip packages are now PyPI compliant. This means TensorFlow can now be installed with a simple invocation of `pip install tensorflow`.

---

## 升级
升级很简单（在这里感谢一下为简化 TensorFlow 安装过程的工程师们），就是一行语句，这也是安装命令：

对于 GPU 版本：

```bash
pip3 install --upgrade tensorflow-gpu
```

对于 CPU 版本：

```bash
pip3 install --upgrade tensorflow
```

![升级过程](http://img.blog.csdn.net/20170216162553891?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
*右键在新标签页打开图片可查看大图*

输入完回车就开始升级过程，会下载并卸载重装一些必要的包，时间长短视网速而定。

---

## 更新你的旧代码
有两种方法更新你的代码，一种就是我上面提到的用脚本自动升级，另一种就是手动更改，具体可以参考 [这里](https://www.tensorflow.org/install/migration) 。

### 使用脚本
由于版本改动较大，TensorFlow 甚至出了一个 `tf_upgrade.py` 脚本来帮助你更新代码，从 [这里](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/tools/compatibility/tf_upgrade.py) 获取这份代码，或者点击 [这里](http://download.csdn.net/detail/u010099080/9756279) 直接下载。

对于更新单个文件，可以使用下面的命令：

```bash
python tf_upgrade.py --infile InputFile --outfile OutputFile
```

其中 `InputFile` 和 `OutputFile` 分别为你的旧代码和新代码，根据你的文件名做相应的替换。例如我的旧代码是 `test.py`，将要生成的新代码是 `test_1.0.py`，则：

```bash
python tf_upgrade.py --infile test.py --outfile test_1.0.py
```

同时，`tf_upgrade.py` 会生成一个名为 `report.txt` 的文件，该文件记录了对旧文件做的所有改动，同时也给出了可能需要你手动更改的建议。

对于文件夹（目录），和单个文件类似，使用

```bash
python tf_upgrade.py --intree InputDir --outtree OutputDir
```

例如，我的 programs 位于 `/home/user/cool` 目录，新的生成的文件我想放到 `/home/user/cool_1.0` 里，则

```bash
python tf_upgrade.py --intree /home/user/cool --outtree /home/user/cool_1.0
```

### 手动更改

除了使用脚本自动更新外，还可以使用手动替换的方式。需要替换的东西有很多，我就不一一列举了，大家可以参考 [官网](https://www.tensorflow.org/install/migration) 。

---

## END
