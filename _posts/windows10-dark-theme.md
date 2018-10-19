---
title: Windows 10 资源管理器黑色风格
date: 2017-10-26 22:47
tags: Windows
---

今天来水一篇，说说我前几天某天上午初步实现了我一直想弄的东西：Windows 10 资源管理器黑色风格，用了几天，整体上感觉还不错，当然也有点小瑕疵，我会在后面说。

> 所有图可右键在新标签页打开查看大图。

---

## 更新

这里我会列出对本文的更新。

- 2017 年 11 月 2 日：增加问题 #5。

---

## 先睹为快

实现后的界面是这样的：

![主界面](https://i.imgur.com/PmKOXrF.png)
*主界面*


![](https://i.imgur.com/9X8085S.png)
<font color="gray">*文件列表*</font>

![](https://i.imgur.com/tPhk6R6.png)
<font color="gray">*选中状态*</font>

![](https://i.imgur.com/PGOZFUM.png)
<font color="gray">*任务管理器*</font>

![](https://i.imgur.com/caTobn6.png)
<font color="gray">*复制*</font>

![](https://i.imgur.com/AmonnUg.png)
<font color="gray">*记事本*</font>

![](https://i.imgur.com/Zr0EKDg.png)
<font color="gray">*Word*</font>

**WARNING! 操作风险很大，存在不稳定因素，请三思后行，出了什么幺蛾子不要赖我没有事先提醒哦！**

好了，看到这里你还想弄的话，那就接着往下看吧。

---

## 安装开始前

在安装开始前，有几件需要你确定的事情：

- 你的 Windows 版本。目前支持的 Windows 版本为 1607 (Build 14393) - Anniversary 周年更新和 1703 (Build 15063) - Creators 创意者更新。你可以在 `设置` --> `系统` --> `关于` 中查看你的系统版本。
![](https://i.imgur.com/sFihaa1.png)
<font color="gray">*我的版本号*</font>

- 设置系统还原点
- 如果你安装过其他补丁（UxStyle，UltraUXThemePatcher），那么请卸载掉

---

## 三个工具

首先我们需要下载将会用到的工具：

- [OldNewExplorer.rar](http://www.msfn.org/board/topic/170375-oldnewexplorer-118/)
- [penumbra_10___windows_10_visual_style_by_scope10-d9em2vq.zip](https://scope10.deviantart.com/art/Penumbra-10-Windows-10-visual-style-568740374)
- [UltraUXThemePatcher_3.3.1.exe](https://www.syssel.net/hoefs/software_uxtheme.php?lang=en)

![](https://i.imgur.com/3NkWQ8q.png)
<font color="gray">*三个工具*</font>

下载完成解压后目录结构是这样的：

```
|   UltraUXThemePatcher_3.3.1.exe
|
+---OldNewExplorer
|       OldNewExplorer32.dll
|       OldNewExplorer64.dll
|       OldNewExplorerCfg.exe
|       readme.txt
|
\---penumbra_10___windows_10_visual_style_by_scope10-d9em2vq
    |   Preview Image.png
    |
    +---Automated Theme Reset Script
    |       Instructions.txt
    |       Reapply visual style (Penumbra 10).xml
    |       Reapply visual style script.ba_
    |       ThemeSwitcher.ex_
    |
    +---Font
    |       LICENSE.txt
    |       OpenSans-Bold.ttf
    |       OpenSans-BoldItalic.ttf
    |       OpenSans-ExtraBold.ttf
    |       OpenSans-ExtraBoldItalic.ttf
    |       OpenSans-Italic.ttf
    |       OpenSans-Light.ttf
    |       OpenSans-LightItalic.ttf
    |       OpenSans-Regular.ttf
    |       OpenSans-Semibold.ttf
    |       OpenSans-SemiboldItalic.ttf
    |
    \---Visual style
        |   Installation instructions + info.txt
        |
        +---Build 14393 - Version 1607 (Anniversary Update)
        |   |   Penumbra 10.theme
        |   |   Penumbra 10s.theme
        |   |   Penumbra 10w.theme
        |   |   Penumbra 10ws.theme
        |   |
        |   \---Penumbra 10
        |       |   Penumbra 10.msstyles
        |       |   Penumbra 10s.msstyles
        |       |   Penumbra 10w.msstyles
        |       |   Penumbra 10ws.msstyles
        |       |
        |       +---Shell
        |       |   \---NormalColor
        |       |       |   1.txt
        |       |       |   shellstyle.dll
        |       |       |   shellstyle_original.dll
        |       |       |
        |       |       \---en-US
        |       |               shellstyle.dll.mui
        |       |
        |       \---Wallpaper
        |               1.png
        |
        \---Build 15063 - Version 1703 (Creators Update)
            |   Penumbra 10.theme
            |   Penumbra 10s.theme
            |   Penumbra 10w.theme
            |   Penumbra 10ws.theme
            |
            \---Penumbra 10
                |   Penumbra 10.msstyles
                |   Penumbra 10s.msstyles
                |   Penumbra 10w.msstyles
                |   Penumbra 10ws.msstyles
                |
                +---Shell
                |   \---NormalColor
                |       |   shellstyle.dll
                |       |
                |       \---en-US
                |               shellstyle.dll.mui
                |
                \---Wallpaper
                        1.png
```

---

## 开始安装

最好把这三个工具解压后放到同一个文件夹下，放在 C 盘，然后我们就开始正式的安装吧 :-)

### #1 UltraUXThemePatcher

首先是运行 `UltraUXThemePatcher_3.3.1.exe`，按照提示一步一步的安装就行，在进行到某一步的时候会显示你的系统信息，看一看是否正确，正确的话就下一步往下走，完成后需要重启电脑。

### #2[可选] OldNewExplorer

> 你可以自己尝试到底勾选哪些，以找到你最喜欢的风格

这一步其实是禁掉功能区。运行 `OldNewExplorer` 中的 `OldNewExplorerCfg.exe`，按照下面的图示选择：然后点击 `Install` 。

![](https://i.imgur.com/oWRdFJF.png)
<font color="gray">*OldNewExplorer*</font>

**但是你如果取消这些更改的话**，那就直接点击 `Uninstall`，然后**不勾选**所有项，点击 `Install` 。

### #3 复制文件

- 如果你的 Windows 版本是 **1607**，那么复制 `penumbra_10___windows_10_visual_style_by_scope10-d9em2vq\Visual style\Build 14393 - Version 1607 (Anniversary Update)` 到 `C:\Windows\Resources\Themes`
- 如果你的 Windows 版本是 **1703**，那么复制 `penumbra_10___windows_10_visual_style_by_scope10-d9em2vq\Visual style\Build 15063 - Version 1703 (Creators Update)` 到 `C:\Windows\Resources\Themes`

### #4 设置主题

好了，你现在可以设置新的主题了，就像你往常改主题一样，在 `个性化` 或者 `设置` 中改都行。

![](https://i.imgur.com/t4aOUHw.png)
<font color="gray">*选择主题*</font>

### #5 别急，还有一点

其实到上面已经完了，但是当你锁屏或者重启电脑后，你发现主题又变回来了，这就需要我们设置一个计划任务自动执行。

- 找到 `penumbra_10___windows_10_visual_style_by_scope10-d9em2vq\Automated Theme Reset Script` ，将 `Reapply visual style script.ba_` 和 `ThemeSwitcher.ex_` 分别改为 `Reapply visual style script.bat` 和 `ThemeSwitcher.exe` 。
- 将这两个文件复制到 `C:\Windows\Resources\Themes` 。
- `win+R` 运行 `Taskschd.msc` 调出任务计划程序，点击 `操作` --> `导入任务` ，选择 `penumbra_10___windows_10_visual_style_by_scope10-d9em2vq\Automated Theme Reset Script\Reapply visual style (Penumbra 10).xml` ，然后确定。

好了，这就全部完成了。

---

## 问题

其实还是有点不完美的，但是在我的可接受范围之内。暂且就这么多，想到了或者以后遇到了我再加。

### #1  `开始` 图标

`开始` 图标变成了类似 Cortana 的圆形，你可以在上面的 `主界面` 图的左下角看到「一双眼睛」，其实第一个是开始菜单，第二个是 Cortana 。

### #2 Chrome 地址栏

Chrome 的地址栏变成了黑色背景。

![](https://i.imgur.com/4klhOks.png)

### #3 右键字体

右键菜单中文变成了宋体字体，我找了找方法貌似可以改，不过我没试，有谁试了成功了的话可以在评论区说下或者私信我，谢谢 :-)

### #4 Word 背景

Word 中背景会显示为黑色，其他办公软件如 Excel、PPT都会有不同程度影响。

### #5 PotPlayer 右键菜单

PotPlayer 右键菜单变为全灰，看不清字了。

![potplayer](https://i.imgur.com/wjPoCg9.png)

---

## References

- [Penumbra 10 - Windows 10 visual style](https://scope10.deviantart.com/art/Penumbra-10-Windows-10-visual-style-568740374)
- [How to Install a Dark Theme for File Explorer!](https://www.youtube.com/watch?v=7GgIjEDYe6g)

---

## END
