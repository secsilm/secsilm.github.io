---
title: 用 MATLAB 将多个文件夹内的某些文件汇总到另一个文件夹
date: 2015-09-22 07:44:46
tags:
  - MATLAB
---

为了学习Python下载了一个视频教程，可是发现是很多（13个）压缩包组成的，而不是将视频放在一个文件夹内，虽然能够快速单独解压出来，但是仍然是13个文件夹，就是下图的样子，想要看视频还得去点每一个文件夹，甚是不便，于是想着用matlab来解决这个问题，把每个文件夹内的视频文件移动到一个新的文件夹内。

<!-- more -->

![图1](http://img.blog.csdn.net/20150922185504684)

matlab代码：

```matlab
status=[];  % 操作状态矩阵
for i=1:13
    dir_name=['Python.Django视频教程-' num2str(i)];  % 获取各个子文件夹的名称
    list=dir(dir_name);  % list是一个结构体数组（struct array）
    file=list(4).name;  % 所需文件在list的第4个元素，获取其文件名
    source=[pwd '\' dir_name '\' list(4).name];  % 由于源文件不在工作目录下，故需生成绝对路径
    [SUCCESS,MESSAGE,MESSAGEID]=movefile(source,'E:\个人资料\软件学习\Python\Django视频教程\');
    status=[status,SUCCESS];
end
status
```

最后可以通过查看输出的操作状态矩阵status来判断是否操作成功，成功为1，失败为0。另外其中的pwd是一个函数，用于显示当前工作目录。

**详细说下猪(zhu)脚(jue)——movefile函数**，顾名思义就是“移动文件”，可以理解为我们日常的ctrl+x剪切，相应的还有copyfile、deletefile等等函数。我把movefile函数的帮助信息简单的翻译一下：
[SUCCESS,MESSAGE,MESSAGEID] = movefile(SOURCE,DESTINATION,MODE)，**第一个输出项是SUCCESS**，表示是否成功（1和0）；**第二个输出项是MESSAGE**，表示出错信息，如果出错就会显示否则为空；**第三个输出项为MESSGAEID**，是出错信息的标识。**第一个输入项是SOURCE**，是你要移动的文件名或者目录，如果文件不在工作目录下就需要写上绝对路径；**第二个输入项是DESTINATION**，是你要移动到哪，是一个目录或者文件，如果你要移动的是目录而DESTINATION不存在，movefile就会创建DESTINATION（作为目录创建）并且把你要移动的目录下的内容放到DESTINATION下，实际上（effectively）就是重命名SOURCE；如果你要移动的是单个文件而DESTINATION不是一个目录或者说不存在，那么movefile函数实际上就是重命名DESTINATION。**第三个输入项是MODE**，这一项可以不写，但是如果你写为'f'，那么movefile函数将会强制（force）将SOURCE移动到DESTINATION，即使DESTINATION是只写属性（read-only），并且如果SOURCE和DESTINATION都是单个文件（比如都是TXT文件或者word文档），那么将会用SOURCE里的内容强制覆盖DESTINATION的内容（是不是有点像Linux的root）。

另外有几点需要注意：movefile函数不能将文件自己移动到自己（废话~），也不能将多个文件移动到一个文件。
好了，关于movefile函数就先暂时写到这（hao）吧（lei）。

折腾了几个小时才成型（是不是智商有点不够啦），主要是对matlab中的文件操作基本上还是第一次接触尝试，之前都是各种数学矩阵运算和GUI什么的，还在摸索中，尝试过程中错（bi）了（si）好（qiang）多（po）次（zheng）。。。。不过呢，觉得这个意义还是挺大的，如果不是13个文件夹而是50个甚至更多（对于我这种懒人来说13个够多了~~~^_^~~~），那意义就更明显了，能够大大提高我们的工作效率。

今天就先到这吧，吃饭去……

欢迎matlab的同志们前来交流哈~欢迎转载，转载请注明出处！                         