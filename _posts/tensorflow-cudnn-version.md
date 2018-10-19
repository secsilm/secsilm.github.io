---
title: Check failed stream->parent()->GetConvolveAlgorithms(&algorithms)解决办法
date: 2017-02-26 11:45:44
tags:
  - TensorFlow
  - Python
---

由于我很早就在 GitHub 下载了 TensorFlow 的源码库没有更新，在运行 [TensorFlow 官方的 CNN 例子](https://www.tensorflow.org/tutorials/deep_cnn)的时候，总是报 `ImportError` 错误，找不到 `cifar10` 模块，后来发现是 TensorFlow 的源码库更新了，这些模型实现都被移到了一个新的源码库：[models](https://github.com/tensorflow/models) 。

但是呢，在我 `clone` 了 `models` 到本地后，按照 TensorFlow 官方的例子运行 `python cifar10_train.py` 的时候，问题又出现了……

<!-- more -->

---


# 运行环境

**运行环境是首要前提 。**

- OS：Windows 10 家庭中文版
- CUDA：`Cuda compilation tools, release 8.0, V8.0.44`
- cuDNN：5.0
- TensorFlow: 1.0.0

`python -c "import tensorflow; print(tensorflow.__version__)"` 的输出：

```bash
I c:\tf_jenkins\home\workspace\release-win\device\gpu\os\windows\tensorflow\stream_executor\dso_loader.cc:135] successfully opened CUDA library cublas64_80.dll locally
I c:\tf_jenkins\home\workspace\release-win\device\gpu\os\windows\tensorflow\stream_executor\dso_loader.cc:135] successfully opened CUDA library cudnn64_5.dll locally
I c:\tf_jenkins\home\workspace\release-win\device\gpu\os\windows\tensorflow\stream_executor\dso_loader.cc:135] successfully opened CUDA library cufft64_80.dll locally
I c:\tf_jenkins\home\workspace\release-win\device\gpu\os\windows\tensorflow\stream_executor\dso_loader.cc:135] successfully opened CUDA library nvcuda.dll locally
I c:\tf_jenkins\home\workspace\release-win\device\gpu\os\windows\tensorflow\stream_executor\dso_loader.cc:135] successfully opened CUDA library curand64_80.dll locally
1.0.0
```

---

# 问题

运行 `python cifar10_train.py` 的报错信息如下：

```bash
E c:\tf_jenkins\home\workspace\release-win\device\gpu\os\windows\tensorflow\stream_executor\cuda\cuda_dnn.cc:390] Loaded runtime CuDNN library: 5005 (compatibility version 5000) but source was compiled with 5105 (compatibility version 5100).  If using a binary install, upgrade your CuDNN library to match.  If building from sources, make sure the library loaded at runtime matches a compatible version specified during compile configuration.
F c:\tf_jenkins\home\workspace\release-win\device\gpu\os\windows\tensorflow\core\kernels\conv_ops.cc:605] Check failed: stream->parent()->GetConvolveAlgorithms(&algorithms)
```

---

# 解决

从报错信息很明显可以看出，是 cuDNN 的版本问题，那么我只需要**升级 cuDNN 版本**就可以了。我现在的版本是 5.0，升级到 5.1 即可。可从 [官网](https://developer.nvidia.com/rdp/cudnn-download) 下载或者从 [这里](http://download.csdn.net/detail/u010099080/9764330) 直接下载我下载好的。

下载好后就是替换原有的 5.0 版本了。如果原先你安装 cuDNN 的时候是用将 `C:\cuda\bin` 加进 `Path` 环境变量的方法安装的，那么你直接用 5.1 版本文件替换原有文件应该就可以。

但是我第一次安装的时候稍微麻烦一些，是用 [此文](http://blog.csdn.net/u010099080/article/details/53418159) 中的方法安装的，即将对应文件复制到对应位置，所以你在升级 cuDNN 版本的时候也要将对应文件复制到对应位置就可以了。当然，你也可以直接使用第一种方法。

然后，再次运行 `python cifar10_train.py` 就可以顺畅的玩耍了。

---

# END