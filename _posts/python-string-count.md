---
title: 使用 Python 统计字符串中英文、空格、数字、标点个数
date: 2017-03-25 22:01
tags: Python
toc: true
---

*题外话：今天打酱油的做了网易数据挖掘工程师的在线笔试题，被打击了。*

本文代码可在 [这里](http://download.csdn.net/detail/u010099080/9793725) 下载。

<!-- more -->

---

# 问题

在网上无意间看到这么一个题目：统计一个字符串中的中英文、空格、数字、标点符号个数。
正好再熟悉一下 Python 中字符串相关方法，所以来做一下。

---

# 代码

```python
# coding: utf-8

import string
from collections import namedtuple


def str_count(s):
    '''找出字符串中的中英文、空格、数字、标点符号个数'''
    
    count_en = count_dg = count_sp = count_zh = count_pu = 0
    s_len = len(s)
    for c in s:
        if c in string.ascii_letters:
            count_en += 1
        elif c.isdigit():
            count_dg += 1
        elif c.isspace():
            count_sp += 1
        elif c.isalpha():
            count_zh += 1
        else:
            count_pu += 1
    total_chars = count_zh + count_en + count_sp + count_dg + count_pu
    if total_chars == s_len:
        return namedtuple('Count', ['total', 'zh', 'en', 'space', 'digit', 'punc'])(s_len, count_zh, count_en, count_sp, count_dg, count_pu)
    else:
        print('Something is wrong!')
        return None
    return None


s = '上面是引用了官网的介绍，意思就是说 TensorBoard 就是一个方便你理解、调试、优化 TensorFlow 程序的可视化工具，你可以可视化你的 TensorFlow graph、学习参数以及其他数据比如图像。'
count = str_count(s)
print(s, end='\n\n')
print('该字符串共有 {} 个字符，其中有 {} 个汉字，{} 个英文，{} 个空格，{} 个数字，{} 个标点符号。'.format(count.total, count.zh, count.en, count.space, count.digit, count.punc))
```

将上面的程序保存到 `str_count.py`，然后执行测试下：

```shell
$ python str_count.py

上面是引用了官网的介绍，意思就是说 TensorBoard 就是一个方便你理解、调试、优化 TensorFlow 程序的可视化工具，你可以可视化你的 TensorFlow graph、学习参数以及其他数据比如图像。

该字符串共有 107 个字符，其中有 59 个汉字，36 个英文，6 个空格，0 个数字，6 个标点符号。
```

那个用于测试的字符串 `s` 源自 [我的一篇关于 TensorBoard 的博文](http://blog.csdn.net/u010099080/article/details/62882006)，首先输出原始字符串，然后输出中英文、空格、数字、标点符号各自的个数。

以后有好的想法再来优化这个程序，大家有什么好的想法也欢迎可以在评论区留言。

---

# END
