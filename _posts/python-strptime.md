---
title: Python 中 strptime 的简单使用
date: 2016-06-27 05:14:05
tags:
  - Python
  - Data Science
---

`strptime`是python `datetime`库中的函数，用于将一个日期字符串转成datetime日期格式便于后期处理，**使用格式**为`datetime.strptime(date_string, format)`，其中`date_string` 就是要转成日期的字符串，`format` 根据`date_string` 不同而不同，`format` 有以下格式：

<!-- more -->

![这里写图片描述](http://img.blog.csdn.net/20160627170308271)

下面举个简单的例子，计算两个日期的差

![这里写图片描述](http://img.blog.csdn.net/20160627170930542)

此外，获取当前日期：`dt.date.today()`

![这里写图片描述](http://img.blog.csdn.net/20160627171251588)

OK, it's really short~~~