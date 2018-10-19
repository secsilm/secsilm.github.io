---
title: sklearn 中 Logistics Regression 的 coef_ 和 intercept_ 的具体意义
date: 2016-10-26 01:39:10
tags:
  - sklearn
  - Machine Learning
  - Python
---

使用`sklearn`库可以很方便的实现各种基本的机器学习算法，例如今天说的逻辑斯谛回归（Logistic Regression），我在实现完之后，可能陷入代码太久，忘记基本的算法原理了，突然想不到 `coef_` 和 `intercept_` 具体是代表什么意思了，就是具体到公式中的哪个字母，虽然总体知道代表的是模型参数。

好尴尬，折腾了一会，终于弄明白了，记录下来，以说明自己too young。

<!-- more -->

## 正文

我们使用 sklearn 官方的一个例子来作为说明，源码可以从[这里](http://scikit-learn.org/stable/auto_examples/linear_model/plot_logistic_multinomial.html)下载，下面我截取其中一小段并做了一些修改：

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_blobs
from sklearn.linear_model import LogisticRegression
	
# 构造一些数据点
centers = [[-5, 0], [0, 1.5], [5, -1]]
X, y = make_blobs(n_samples=1000, centers=centers, random_state=40)
transformation = [[0.4, 0.2], [-0.4, 1.2]]
X = np.dot(X, transformation)
	
clf = LogisticRegression(solver='sag', max_iter=100, random_state=42, multi_class=multi_class).fit(X, y)

print clf.coef_ 
print clf.intercept_
```

输出如图：
![](http://i.imgur.com/ysybj7D.png)

可以看到 `clf.coef_` 是一个 3×2`(n_class, n_features)` 的矩阵，`clf.intercept_` 是一个 1×3 的矩阵（向量），那么这些到底是什么意思呢？

我们来回顾一下 Logistic 回归的模型：

$$h\_\theta(x) = \frac{1}{1+e^{(-\theta^Tx)}}$$

其中 $\theta$ 是模型参数，其实 $\theta^Tx$ 就是一个线性表达式，将这个表达式的结果再一次利用 Logistic 函数映射到 0~1 之间。

知道了这个，也就可以搞清楚那个 `clf.coef_` 和 `clf.intercept_` 了： `clf.coef_` 和 `clf.intercept_` 就是 $\theta$ ，下面我们来验证一下：

```python
i = 100
print 1 / (1 + np.exp(-(np.dot(X[i].reshape(1, -1), cc.T) + clf.intercept_)))
# 正确的类别
print y[i]
print clf.predict_proba(X[i].reshape(1, -1))
print clf.predict_log_proba(X[i].reshape(1, -1))
```

输出结果:
![](http://i.imgur.com/fFNlh9P.png)

可以看到结果是吻合的，说明我们的猜想是正确的。

## END