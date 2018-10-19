---
title: MATLAB 批量文件重命名（详细解释）
date: 2015-11-19 12:03:06
tags:
  - MATLAB
---

这段时间在用 matlab 做手写数字识别，处理样本的时候需要对样本文件进行重命名，可是有好多，总不能一个一个重命名吧，于是上网百度了好多，不过大多都一样，但是没有解释，只有干巴巴的程序，弄了好一会才弄清楚（我太菜了……），于是写下了以备后用。

<!-- more -->

---

## 更新

这里我会列出对本文的更新。

- 2017 年 3 月 21 日：优化排版，去除多余和易误导人的语句。
- 2017 年 3 月 25 日：优化代码，增加重命名成功失败提示，增加程序的一点说明。

---

## 问题

假设我有 `0.bmp`, `1.bmp`, `2.bmp`, ……，`99.bmp` 等 100 个 `bmp` 图像文件，出于某种需要我要在名字前加上一个 `RH_` 字符串。

---

## 代码

```matlab
files = dir('*.bmp');
len=length(files);
for i=1:len
    oldname=files(i).name;
    newname=strcat('RH_', oldname);
    command = ['rename' 32 oldname 32 newname];
    status = dos(command);
    if status == 0
        disp([oldname, ' 已被重命名为 ', newname])
    else
        disp([oldname, ' 重命名失败!'])
    end
end
```

解释一下程序：

1. 用 `dir` 函数获得工作目录下所有 `bmp` 文件信息，返回的 `file` 是一个 *结构体*，里面包含了文件名、修改时间等信息，我们用的就是第一个域名字 `name`
2. 获得 `bmp` 文件的个数 `len` 
3. 每一次循环用 `strcat` 函数将 `RH_` 与原文件名 `oldname` 连接起来，然后使用 `dos` 调用操作系统命令替换掉原文件名

关于这个 `dos` 函数的用法，这里引用下 `dos` 函数的帮助

> `status = dos(command)` executes the specified MS-DOS® command for Windows® platforms, and waits for the command to finish execution before returning the exit status to the status variable.

这个函数实际上就是调用执行操作系统命令，比如这里的 `rename` 命令，`32` 是 ASCII 码，表示空格。

```
rename oldname newname
```

---

## 一点说明

我上面的程序是将程序和我要重命名的图片放在了 MATLAB 的 **当前路径** 下，所有可以不用写绝对路径，但是如果你想要指定图片文件的绝对路径，那么就要 **保证你的路径中不包含空格**，不然会报错：`The syntax of the command is incorrect.` 同样引用下 [这篇文章](http://www.computerhope.com/renamehl.htm) 的说法：

> Rename the file "computer hope.txt" to "example file.txt". Whenever dealing with a file or directory with a space, it must be surrounded with quotes. Otherwise, you'll get the The syntax of the command is incorrect error.

---

## END

好了，又是十二点了，就到这吧，欢迎交流！