---
title: 小谈 Numpy 数组占用内存空间问题
date: 2016-11-30 06:30:53
tags:
  - Python
  - Data Science
  - Machine Learning
---

之前跟同学讨论过`numpy`数组的占用空间大小问题，但是今天给忘了，又重新试验了一下，主要是利用`sys`模块的`getsizeof`函数，使用的版本是 Python3.5。记录下来，以备后忘。

<!-- more -->

---

#问题#
1.  一个空的`numpy`数组对象占用多大空间。
2. 一个`int32`、`int64`、`float32`、`float64`数占用多大空间。

---

#代码#
```python
import numpy as np
import sys

# 32位整型
ai32 = np.array([], dtype=np.int32)
bi32 = np.arange(1, dtype=np.int32)
ci32 = np.arange(5, dtype=np.int32)

# 64位整型
ai64 = np.array([], dtype=np.int64)
bi64 = np.arange(1, dtype=np.int64)
ci64 = np.arange(5, dtype=np.int64)

# 32位浮点数
af32 = np.array([], dtype=np.float32)
bf32 = np.arange(1, dtype=np.float32)
cf32 = np.arange(5, dtype=np.float32)

# 64位浮点数
af64 = np.array([], dtype=np.float64)
bf64 = np.arange(1, dtype=np.float64)
cf64 = np.arange(5, dtype=np.float64)

print("size of 0 int32 number: %f" % sys.getsizeof(ai32))
print("size of 1 int32 number: %f" % sys.getsizeof(bi32))
print("size of 5 int32 numbers: %f" % sys.getsizeof(ci32), end='\n\n')

print("size of 0 int64 number: %f" % sys.getsizeof(ai64))
print("size of 1 int64 number: %f" % sys.getsizeof(bi64))
print("size of 5 int64 numbers: %f" % sys.getsizeof(ci64), end='\n\n')

print("size of 0 float32 number: %f" % sys.getsizeof(af32))
print("size of 1 float32 number: %f" % sys.getsizeof(bf32))
print("size of 5 float32 numbers: %f" % sys.getsizeof(cf32), end='\n\n')

print("size of 0 float64 number: %f" % sys.getsizeof(af64))
print("size of 1 float64 number: %f" % sys.getsizeof(bf64))
print("size of 5 float64 numbers: %f" % sys.getsizeof(cf64))
```

---

#结果#

```python
size of 0 int32 number: 96.000000
size of 1 int32 number: 100.000000
size of 5 int32 numbers: 116.000000

size of 0 int64 number: 96.000000
size of 1 int64 number: 104.000000
size of 5 int64 numbers: 136.000000

size of 0 float32 number: 96.000000
size of 1 float32 number: 100.000000
size of 5 float32 numbers: 116.000000

size of 0 float64 number: 96.000000
size of 1 float64 number: 104.000000
size of 5 float64 numbers: 136.000000
```

以上结果说明：

1.  一个空的 `numpy` 数组，无论什么类型，都是占用 **96** 个字节（byte）。
2. 一个 `int32` 和一个 `float32` 都是占用 **4** 个字节，而64位的都占用 **8** 个字节。

其他类型占用空间大小可以采用类似代码进行测试。

此外，注意 `sys.getsizeof()` 函数返回的是 **这个对象所占用的空间大小**，对于数组来说，除了数组中每个值占用空间外，数组对象还会存储数组长度、数组类型等其他信息。而如果只想要获取数组中存储的值的占用空间大小，可以使用 `numpy.ndarray.nbytes` ，使用 `numpy.ndarray.itemsize` 获取数组中每个值的占用空间大小。

```python
ci32.nbytes    # 20
ci32.itemsize    # 4
``` 

---

#END#