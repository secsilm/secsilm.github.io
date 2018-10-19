---
title:  Python 自动生成命令行工具 - fire 简介
date: 2017-04-22 10:16
tags: Python
---

Python 中用于生成命令行接口（Command Line Interfaces, CLIs）的工具已经有一些了，例如已经成为 Python 标准库的 [argparse](https://docs.python.org/3/library/argparse.html) 和第三方的 [click](http://click.pocoo.org/5/) ，这些都是很不错的工具。但是这些工具为 Python 程序生成 CLIs 的时候稍显麻烦，需要增加的地方比较多，过程稍显繁琐。今天介绍的这个工具，几乎可以不改变原始代码就可以生成 CLIs，是 Google 于 今年（2017 年）3 月 2 日宣布在 [GitHub](https://github.com/google/python-fire) 上开源的。

<!-- more -->

![fire 开源](http://img.blog.csdn.net/20170421194937214?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

文中的三个程序文件可以在 [这里](http://download.csdn.net/download/u010099080/9821999) 打包下载。

---

## 更新

这里我会列出对本文的更新。

- 2017 年 10 月 18 日：优化排版，与其他博文保持风格统一。

---

## 简介

大致的简介我在上面简单说了下，下面我引用下官方简介：

> Python Fire is a library for creating command line interfaces (CLIs) from absolutely any Python object.
> 
> - Python Fire is a simple way to create a CLI in Python.
> - Python Fire is a helpful tool for developing and debugging Python code.
> - Python Fire helps with exploring existing code or turning other people's code into a CLI.
> - Python Fire makes transitioning between Bash and Python easier.
> - Python Fire makes using a Python REPL easier by setting up the REPL with the modules and variables you'll need already imported and created.

可以看出来，Fire 不仅仅是一个生成 CLIs 的工具，而且还可以调试 Python 程序，交互式的使用 Fire 。

---

## 安装

在命令行中运行 `pip install fire` 即可安装。

---

## 用法

使用 `fire` 生成 CLIs 的基本用法就是使用 `fire.Fire()`，可以传入任意参数，用官方的说法就是 *any Python object* 。下面我举三个例子简单的说明一下用法，更多的用法大家可以参考 [The Python Fire Guide](https://github.com/google/python-fire/blob/master/doc/guide.md) 和 [Using a Fire CLI](https://github.com/google/python-fire/blob/master/doc/using-cli.md) 。

下面的例子均是以计算时间差（两个日期之间相差的天数）的程序为例。

### 单个函数

文件 `test-fire.py`

```python
import fire
import datetime

def cal_days(date_str1, date_str2):
    '''计算两个日期之间的天数'''

    date_str1 = str(date_str1)
    date_str2 = str(date_str2)
    d1 = datetime.datetime.strptime(date_str1, '%Y%m%d')
    d2 = datetime.datetime.strptime(date_str2, '%Y%m%d')
    delta = d1 - d2
    return delta.days


if __name__ == '__main__':
    fire.Fire(cal_days)
```

这个程序中只有一个函数 `cal_days`，最后使用 `fire.Fire(cal_days)` 来生成 CLIs。

我们可以先用下面的语句查看帮助信息：

```bash
$ python test-fire.py
Fire trace:
1. Initial component
2. ('The function received no value for the required argument:', 'date_str1')

Type:        function
String form: <function cal_days at 0x000002F0099B7F28>
File:        d:\masterfiles\notebook\test-fire.py
Line:        4
Docstring:   计算两个日期之间的天数

Usage:       test-fire.py DATE_STR1 DATE_STR2
             test-fire.py --date-str1 DATE_STR1 --date-str2 DATE_STR2
```

我们可以看到传给 `fire.Fire()` 的参数类型（`function`）、文件路径、文档字符串、参数用法等信息。

现在我们试着计算一下 2017 年 4 月 21 号和 2017 年 4 月 1 号差了多少天：

```bash
$ python test-fire.py 20170421 20170401
20
```

当然，你也可以使用 `python test-fire.py --date-str1 20170421 --date-str2 20170401`。

此外，对于这种单个函数的情况，程序的最后一行 `fire.Fire(cal_days)` 可以改为 `fire.Fire()`，结果完全一样，`fire.Fire()` 会默认使用 `cal_days()` 函数。

---

### 多个函数

文件 `test-fire-2func.py`

```python
import fire
import datetime

def cal_days(date_str1, date_str2):
    '''计算两个日期之间的天数'''

    date_str1 = str(date_str1)
    date_str2 = str(date_str2)
    d1 = datetime.datetime.strptime(date_str1, '%Y%m%d')
    d2 = datetime.datetime.strptime(date_str2, '%Y%m%d')
    delta = d1 - d2
    return delta.days


def days2today(date_str):
    '''计算某天距离今天的天数'''

    date_str = str(date_str)
    d = datetime.datetime.strptime(date_str, '%Y%m%d')
    delta = datetime.datetime.now() - d
    return delta.days


if __name__ == '__main__':
    fire.Fire()
```

这个程序比 `test-fire.py` 多了一个函数，但是结尾处仍然使用 `fire.Fire()` 来生成 CLIs。我们先不输任何参数：

```bash
$ python test-fire-2func.py 20170401
Fire trace:
1. Initial component
2. ('Cannot find target in dict', '20170401', {'__name__': '__main__', 'datetime': <module 'datetime' from 'C:\\Users\\secsi\\Anaconda3\\lib\\datetime.py'>, 'cal_days': <function cal_days at 0x0000027A855E7F28>, 'days2today': <function days2today at 0x0000027A86EC6B70>, '__loader__': <_frozen_importlib_external.SourceFileLoader object at 0x0000027A85655A90>, '__file__': 'test-fire-2func.py', '__cached__': None, 'fire': <module 'fire' from 'C:\\Users\\secsi\\Anaconda3\\lib\\site-packages\\fire\\__init__.py'>, '__package__': None, '__builtins__': <module 'builtins' (built-in)>, '__doc__': None, '__spec__': None})

Type:        dict
String form: {'__name__': '__main__', 'datetime': <module 'datetime' from 'C:\\Users\\secsi\\Anaconda3\\lib\\d <...> kage__': None, '__builtins__': <module 'builtins' (built-in)>, '__doc__': None, '__spec__': None}
Length:      12

Usage:       test-fire-2func.py
             test-fire-2func.py datetime
             test-fire-2func.py cal-days
             test-fire-2func.py days2today
             test-fire-2func.py fire
```

程序中有个两个函数，而我们运行 `python test-fire-2func.py 20170401` 的时候却没有指定使用哪个函数，所以会报错。

正确的写法应该是这样的：

```bash
$ python test-fire-2func.py days2today 20170401
21
$ python test-fire-2func.py cal_days 20170422 20170401
21
```

也就是说在后面跟上要使用的函数名。

---

### 对象（类）

`Fire` 既然能够 *fire* 任何 Python 对象，那么给 `fire.Fire()` 传一个类也是完全可以的。下面是一个例子：

文件 `test-fire-class.py`

```python
import fire
import datetime


class DateStr(object):

    def cal_days(self, date_str1, date_str2):
        '''计算两个日期之间的天数'''
        date_str1 = str(date_str1)
        date_str2 = str(date_str2)
        d1 = datetime.datetime.strptime(date_str1, '%Y%m%d')
        d2 = datetime.datetime.strptime(date_str2, '%Y%m%d')
        delta = d1 - d2
        return delta.days

    def days2today(self, date_str):
        '''计算某天距离今天的天数'''
        date_str = str(date_str)
        d = datetime.datetime.strptime(date_str, '%Y%m%d')
        delta = datetime.datetime.now() - d
        return delta.days


if __name__ == '__main__':
    fire.Fire(DateStr)
```

这里我定义了一个 `DateStr` 类，有两个类方法 `cal_days` 和 `days2today` ，那么我只需 `fire.Fire(DateStr)` 就可以调用这两个类方法。

```bash
$ 	python test-fire-class.py days2today 20170401
21
$ python test-fire-class.py cal-days 20170422 20170401
21
```

---

## 还有几点

- `fire` 默认使用 `-` 作为参数分隔符，所以如果你要在命令行传入类似 `2017-04-22` 的参数时，那么程序接收到的参数就肯定不是 `2017-04-22` 了，你需要使用 `--separator` 来改变分隔符，参考 [Changing the Separator](https://github.com/google/python-fire/blob/master/doc/using-cli.md#separator-flag)
- `fire` 会自动区分你在命令行传入的参数的类型，例如 `20170422` 会自动识别成 `int`，`hello` 会自动识别成 `str`，`'(1,2)'` 会自动识别成 `tuple`，`'{"name": "Alan Lee"}'` 会自动识别成 `dict`。但是你如果想要传入一个字符串类型的 `20170422` 怎么办？那就需要这样写：`'"20170422"'` 或者 `"'20170422'"` 或者 `\"20170422\"`，总之呢，就是加一个转义，因为命令行默认会吃掉你的引号。参考 [Argument Parsing](https://github.com/google/python-fire/blob/master/doc/guide.md#user-content-argument-parsing)

---

## END