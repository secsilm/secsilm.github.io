---
title: Numpy 中的 shuffle VS permutation
date: 2017-06-17 23:28
tags: Python
toc: true
---

有时候我们会有随机打乱一个数组的需求，例如训练时随机打乱样本，我们可以使用 `numpy.random.shuffle()` 或者 `numpy.random.permutation()` 来完成。这两者非常相似，实现的功能是一样的，那么他们到底有什么区别？

<!-- more -->

本文代码及图片可以在 [我的GitHub](https://github.com/secsilm/shuffle-vs-permutation-numpy) 找到。

---

## 参数区别

以下 `numpy.random.shuffle()` 简称 `shuffle`，`numpy.random.permutation()` 简称 `permutation`。

- `shuffle` 的参数只能是 `array_like`，而 `permutation` 除了 `array_like` 还可以是 `int` 类型，如果是 `int` 类型，那就随机打乱 `numpy.arange(int)`。
- **`shuffle` 返回 `None`**，这点尤其要注意，也就是说没有返回值，而 `permutation` 则返回打乱后的 array。

---

## 实现区别

`permutation` 其实在内部实现也是调用的 `shuffle`，这点从 [Numpy 的源码](https://github.com/numpy/numpy/blob/master/numpy/random/mtrand/mtrand.pyx#L4847) 可以看出来：

```python
def permutation(self, object x):
    '''这里都是帮助文档，我就省略了'''
    if isinstance(x, (int, long, np.integer)):
        arr = np.arange(x)
    else:
        arr = np.array(x)
    self.shuffle(arr)
    return arr
```

---

## 速度区别

为了测试两者的速度区别，我分别使用了 `shuffle` 和 `permutation` 对不同长度的 array 进行随机打乱并计时。

关键代码如下:

```python
n = 10 ** np.arange(1, 10)
shuffle_elapsed = []
permutation_elapsed = []
for i in n:
    print(i)
    start = time.time()
    a = np.arange(i)
    np.random.shuffle(a)
    end = time.time()
    shuffle_elapsed.append((i, end - start))

    start = time.time()
    b = np.random.permutation(i)
    end = time.time()
    permutation_elapsed.append((i, end - start))
```

结果：

![这里写图片描述](http://img.blog.csdn.net/20170618130741322?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
*右键在新标签页打开查看大图*

可以看出在达到 $10^9$ 级别以前，两者速度几乎没有差别，但是在 达到 $10^9$ 以后两者速度差距明显拉大，`shuffle` 的用时明显短于 `permutation`。

所以在 array 很大的时候还是使用 `shuffle` 速度更快些，但要注意其不返回打乱后的 array，是 inplace 修改。

---

## END