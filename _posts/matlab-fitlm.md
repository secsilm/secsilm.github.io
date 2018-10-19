---
title: 使用 MATLAB 的 fitlm 函数进行线性回归
date: 2015-12-21 04:56:15
tags:
  - MATLAB
  - Machine Learning
---

今天在做《数理统计》关于线性回归的作业，本来用`R`已经做出来了，但是由于最近使用`matlab`很多，所以也想看看用`matlab`怎么做。

<!-- more -->

`matlab`中有很多函数可以做各种各样的回归，也有`cftool`工具箱可以可视化的做回归，很方便。这里选用`fitlm`做回归，由于多元回归和一元回归基本思想是差不多的，操作也只是参数个数的问题，所以这里用一元线性回归做例子，记录下来以备后用。

数据选用R中的自带数据：`cars`数据集，是一个关于汽车速度和距离的数据，`50*2`的矩阵。

  ![cars数据部分](http://img.blog.csdn.net/20151221164156398)

采用一元线性回归模型进行回归，公式这里就不说了，`dist`为因变量，`speed`为自变量。
代码来了：

```
clear
data = xlsread('D:\Program Files\RStudio\cars.xlsx');
x = data(:, 1);
y = data(:, 2);
tb = table(x, y, 'VariableNames', {'speed', 'dist'});
model = fitlm(tb, 'dist~speed');
plot(model);
```

`model`里含有模型的各种参数，估计值，`R2`值，`p`值等等等等。

```
model = 


Linear regression model:
    dist ~ 1 + speed

Estimated Coefficients:
                   Estimate      SE        tStat       pValue  
                   ________    _______    _______    __________

    (Intercept)    -17.579      6.7584    -2.6011      0.012319
    speed           3.9324     0.41551      9.464    1.4898e-12


Number of observations: 50, Error degrees of freedom: 48
Root Mean Squared Error: 15.4
R-squared: 0.651,  Adjusted R-Squared 0.644
F-statistic vs. constant model: 89.6, p-value = 1.49e-12
```

可以看出输入形式和输出形式与`R`的输出及其相似。

最后`plot`画出回归图。

![这里写图片描述](http://img.blog.csdn.net/20151221165451789)

好了，该吃饭去了。