---
title: MATLAB绘制平行六面体
date: 2016-01-18 03:09:45
tags:
  - MATLAB
---

```
如果给出一个平行六面体（甚至其他多面体）的各个顶点坐标，如何画出这个平行六面体。
```

<!-- more -->

在网上找了找方法，可以参考这篇博客 [matlab中patch函数详解](http://blog.sina.com.cn/s/blog_65c1064a01011ggo.html)。然后我具体查看了 [Multifaceted Patches](http://cn.mathworks.com/help/matlab/visualize/multifaceted-patches.html) 帮助，记录下来以备后查。

绘制主要就是利用 patch 函数，patch 的一般调用格式为`patch(X,Y,C)`（二维）和`patch(X,Y,Z,C)`（三维）。这里主要看三维情况下。X，Y，Z分别是各个点的 X 坐标，Y 坐标和 Z 坐标，C 是颜色参数。假设我们有一个立方体如下图所示，
![这里写图片描述](http://img.blog.csdn.net/20160118140924969)

那么对应于这个立方体的XYZ参数就是下图所示，

![这里写图片描述](http://img.blog.csdn.net/20160118141048137)

可以看出，XYZ都是一个4*6的矩阵，3个矩阵第 n 列合起来表示一个平面的4个顶点的坐标，6个平面所以有6列，每个平面4个顶点所以有4行。但是这样表示就会出现一个问题——一些点重复出现，这是由于相邻两个平面之间有2个顶点是共用的。可以看到上图中实际上给出了24个顶点的坐标，但是真正“独立”的只有8个，也就是立方体实际的顶点数，很明显这样做不是一个明智的做法。于是，另一种方法出来了。

这种表示方法可以只提供8个顶点的坐标（*Vertices* 属性）而不是24个，给这些顶点编号1~8，然后指定每个平面上的4个顶点（*Faces* 属性，要按连接顺序），再指定颜色就可以了。顶点编号可以自己任意（最好有顺序，方便记忆理解），如下图，

![这里写图片描述](http://img.blog.csdn.net/20160118143659749)

然后平面和顶点的对应关系如下图所示，

![这里写图片描述](http://img.blog.csdn.net/20160118144338023)

Vertices每一行是一个顶点的坐标，共8行8个顶点；Faces每一行是一个平面的4个顶点，共6行6个平面。

下面举个例子。

假设我要通过其他方法已经得到平行六面体的8个顶点的分别是 (0,0,0)，(1,0,0)，(1,1,0)，(0,1,0)，(0,0.5,0)，(1,0.5,1)，(1,1.5,1)，(0,1.5,1)，代码如下，

```matlab
clear
vertices_matrix = [ 0 0 0;1 0 0;1 1 0;0 1 0;0 0.5 1;1 0.5 1;1 1.5 1;0 1.5 1];
faces_matrix = [1 2 6 5;  2 3 7 6;3 4 8 7;4 1 5 8;1 2 3 4;5 6 7 8];
h = patch('Vertices',vertices_matrix,'Faces',faces_matrix,...
    'FaceVertexCData',hsv(8), ...
    'FaceColor','interp');
view(3)
xlabel('x', 'FontName', 'courier new', 'FontWeight', 'bold');
ylabel('y', 'FontName', 'courier new', 'FontWeight', 'bold');
zlabel('z', 'FontName', 'courier new', 'FontWeight', 'bold');
grid on;
box on; 
```

结果如下图所示，

![这里写图片描述](http://img.blog.csdn.net/20160118145214768)

在MATLAB中运行出来后可以通过旋转来从不同角度观察。

另外，假如flat_matrix我写成这样，

```matlab
faces_matrix = [1 2 5 6;  2 3 7 6;3 4 8 7;4 1 5 8;1 2 3 4;5 6 7 8];
```

也就是说我把第一个面的顶点顺序稍微变一下，5和6交换，那么结果如下图，

![这里写图片描述](http://img.blog.csdn.net/20160118151917337)

明显第一个面不对，有部分“镂空”了，这是因为改变点的连接顺序，所以一定要注意顶点顺序。

每个面的颜色可以不一样，例如第一个面黄色，第二个面蓝色……，可以通过 hsv 函数或者指定 *FaceVertexCData* 属性值并设置 *FaceColor* 属性值为flat实现，具体可以参考本文开始给出的 Multifaceted Patches 链接和 [Specifying Patch Coloring](http://cn.mathworks.com/help/matlab/visualize/specifying-patch-coloring.html) 。

OK，昨晚睡不着跟室友聊到2点，现在好困，不过还是不想睡。扯远了~这篇就这样了~ 

Good Luck，Alan！