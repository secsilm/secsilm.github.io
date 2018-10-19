---
title: Ubuntu14.04 gnome3 下 gedit 首选项消失时如何修改 gedit 主题
date: 2016-03-24 12:04:50
tags:
  - Ubuntu
  - IDE
---

## 一些前期题外话

前天装双系统的时候忘记选择引导设备什么的导致硬盘被格式化(T_T)，接着不甘心装完win10后再装ubuntu，这次吸取了教训，不过在引导的时候出现了问题，使用easyBCD设置启动项重启进入ubuntu后出现*Grub error: unknown filesystem* ，网上逛了好一会才发现**可能**是我双硬盘的原因导致ubuntu找不到自己的引导文件，反而是找到了 windows 的 NTFS 文件系统，ubuntu 当然不认识这货了，所以需要自己手动告诉他引导文件在哪。

<!-- more -->

过程如下：

 1.  使用 `ls` 命令查看当前所有分区；
 2.  如果你还记得你当初安装的时候 /boot 挂载点的号（就是类似于sda3的东西）的话，你就找那个号，例如我的是 sda2，那我就找 msdos2；
 3.  使用`set` 命令设置 prefix 和 root 的值；
 4.  输入`insmod normal` 回车，再输入`normal` 回车就可以了。

由于我调试过程没有截图，所以这里没有给图，但是大概就是这样，这里我给出我参考的那篇文章，这个有图：[grub error: unknown filesystem的解决办法](http://www.linuxidc.com/Linux/2012-06/61983.htm) 。

## 正文开始

安装完成后我又安装了 gnome3，发现 gedit 的首选项不见了！于是又上 google 逛了一下怎么改主题，找到一个解决办法，链接：[Where are gedit's preferences?](http://askubuntu.com/questions/375049/where-are-gedits-preferences) 。
实际上就是使用命令行来手动更改，gedit 是基于 GtkSourceView 的，他的配色方案是用 xml 文件写的，所以只需下载新的 xml 文件并复制到相应的文件夹即可。配色方案存放在一个名为 *GtkSourceView 3* 的文件夹下的 *styles* 文件夹下，使用ubuntu的搜索可以很快的找到。

![styles文件夹](http://img.blog.csdn.net/20160324112913005)

可以看到已经有了一些默认的配色方案，我们可以从[这里](https://github.com/mig/gedit-themes) 找到一些配色方案（xml 文件）。

 1.  从上述地址或者其他网站下载配色方案，复制到 *styles* 文件夹内；
 2.  使用`gsettings` 命令设置喜欢的配色方案，使用方式如下：
 `gsettings set org.gnome.gedit.preferences.editor scheme darkmacs` 
 其中 darkmacs 是xml 文件名，可以换成你喜欢的。可以使用`gsettings help` 查看帮助。
 使用这个命令也可以设置 gedit 显示行号：
 `gsettings set org.gnome.gedit.preferences.editor display-line-numbers true`

设置完成后打开 gedit 就可以看到已经设置成了你喜欢的主题，而且已经显示行号。 

![效果图](http://img.blog.csdn.net/20160324120157563)

OK，又12点了，吃不了饭了……See you～