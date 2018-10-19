---
title: 在 TensorBoard 中用 PCA 可视化 MNIST 手写数字识别数据集
date: 2016-12-10 07:23:02
tags:
  - TensorFlow
  - Machine Learning
  - Python
---

> Principal component analysis (PCA) is a statistical procedure that uses an orthogonal transformation to convert a set of observations of possibly correlated variables into a set of values of linearly uncorrelated variables called principal components. 

主成分分析（PCA）是一种常用的数据降维方法，可以将高维数据在二维或者三维可视化呈现。具体原理我在这里就不再详述，网上有很多教程都不错，可以参考 [这里](https://my.oschina.net/gujianhan/blog/225241) 或者 [PCA 的维基百科页面](https://en.wikipedia.org/wiki/Principal_component_analysis)。

<!-- more -->

---

#原理#
我在这里简单的叙述下。假设我们的数据集是 $m×n$ 的，即 $m$ 个样本，每个样本 $n$ 个属性（特征），那么我们想要将这些数据呈现在图上，以便让我们对数据有个直观的了解或者其他用途。换句话说，需要 $n<=3$ ，一般来说为 2（平面） 或者 3（立体），需要一种变换来让新产生的属性可以代替原来的属性，可以通过下式来变换，$$Y=XW$$ 其中 $Y$ 是变换后的新属性，$X$ 是原始属性，$W$ 是变换矩阵，而这个变换矩阵的列是 $X^TX$ 的特征向量。$Y$ 中的新变量依据该变量对原始变量的解释能力（解释的总方差）从高到低排序，那么第一个就称为第一主成分，第二个就称为第二主成分，以此类推。假如我们需要降到 3 维以便于我们可视化，那就取前三个主成分作为原始属性的代表。即假如原来每个样本有 64 个属性，那么现在每个样本就有 3 个属性，就可以绘图了。

---

#数据集#
本文使用的数据集不是完整的 MNIST 数据集，而是 `scikit-learn` 自带的手写数字识别数据集。

![这里写图片描述](http://img.blog.csdn.net/20161210185431105?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

该数据集的信息如下：

 - 类别数：10
 - 每类样本数：约为180
 - 总样本数：1797
 - 特征维数：64（8*8）

---

#代码#
```python
from sklearn import datasets
from sklearn import decomposition
import matplotlib.pyplot as plt
import numpy as np
import seaborn
from mpl_toolkits.mplot3d import Axes3D
%matplotlib notebook

mnist = datasets.load_digits()
X = mnist.data
y = mnist.target
pca = decomposition.PCA(n_components=3)
new_X = pca.fit_transform(X)

fig = plt.figure()
ax = fig.gca(projection='3d')
ax.scatter(new_X[:, 0], new_X[:, 1], new_X[:, 2], c=y, cmap=plt.cm.spectral)
plt.show()
```

---

#结果#

![这里写图片描述](http://img.blog.csdn.net/20161210191249002?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![这里写图片描述](http://img.blog.csdn.net/20161210191301331?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

结果如上图，实际上这个图是可以来回拖动和缩放的，所以建议在本地实际运行程序。图中每个颜色代表一个数字（0-9），可以大致看出每类数字分布在相近的区域。

此外，可以使用 `pca.explained_variance_ratio_` 查看各个主成分解释的总方差：`[ 0.14890594,  0.13618771,  0.11794594]` ，这三个主成分解释了大约 40% 的原始信息，这个比例还是很低的，不过我们这里的目的是可视化而不是抽取信息。使用 `pca.get_covariance()` 得到上文提到的变换矩阵。

---

#TensorBoard#
12月7号 Google 在其开发者博客中宣布了一个开源的高维数据可视化工具：[Open sourcing the Embedding Projector: a tool for visualizing high dimensional data](https://research.googleblog.com/2016/12/open-sourcing-embedding-projector-tool.html)，其中一个是在和 TensorFlow 一起使用的 TensorBoard ，另一个是独立版本，用户可以直接在网页上访问，地址在 [这里](http://projector.tensorflow.org/)（可能需要梯子）。如下图：

![这里写图片描述](http://img.blog.csdn.net/20161211104557988?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

目前有 4 个数据集可以选择：**Word2Vec All**（71291×200），**MNIST**（10000×784），**Word2Vec 10K**（10000×200），**Iris**（150×4），可以选择是否用颜色标注、降维方法（T-SNE，PCA，自定义）、夜间模式、3D标签模式等。以MNIST为例，可以看到这三个主成分对原始信息的解释比例只有 **25.9%**。

---

#END#