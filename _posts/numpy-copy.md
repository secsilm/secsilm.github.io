---
title: Numpy 中的 copy 问题详解
date: 2017-03-01 16:54
tags: Python
toc: true
---

这篇文章本是我在 [segmentfault](https://segmentfault.com/q/1010000008271935/a-1020000008284346) 上的一个回答，但是越来越觉得有必要单独拿出来，毕竟这个问题挺常见的。具体可参看 [`numpy` 官方文档](https://docs.scipy.org/doc/numpy-dev/user/quickstart.html#copies-and-views) 。

<!-- more -->

---

# 正文

`numpy`关于`copy`有三种情况，**完全不复制**、**视图（`view`）**或者叫浅复制（`shadow copy`）和**深复制**（`deep copy`）。

而 `b = a[:]` 这种形式就属于第二种，即**视图**，这本质上是一种切片操作（`slicing`），所有的切片操作返回的都是视图。具体来说，`b = a[:]`会创建一个新的对象 `b`（所以 `id(b)` 和`id(a)` 返回的结果是不一样的），但是 `b` 的数据完全来自于`a`，和 `a` 保持完全一致，换句话说，**`b`的数据完全由`a`保管**，他们两个的数据变化是一致的，可以看下面的示例:
```python
a = np.arange(4)  # array([0, 1, 2, 3])
b = a[:]  # array([0, 1, 2, 3])

b.flags.owndata  # 返回 False，b 并不保管数据
a.flags.owndata  # 返回 True，数据由 a 保管

# 改变 a 同时也影响到 b
a[-1] = 10  # array([0, 1, 2, 10])
b  #  array([0, 1, 2, 10])

# 改变 b 同时也影响到 a
b[0] = 10  # array([10, 1, 2, 10])
a  # array([10, 1, 2, 10])
```

`b = a` 和 `b = a[:]` 的差别就在于后者会创建新的对象，前者不会。两种方式都会导致 `a` 和 `b` 的数据相互影响。

要想不让 `a` 的改动影响到 `b`，可以使用深复制：
```python
unique_b = a.copy()
```

---

# END