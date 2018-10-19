---
title: TensorFlow 中的线性回归
date: 2016-10-22 08:53:57
tags:
  - TensorFlow
  - Machine Learning
  - Python
---

前面 [有篇博文](http://blog.csdn.net/u010099080/article/details/52333935) 讲了讲Ubuntu环境下安装TensorFlow，今天来说一说在TensorFlow中如何进行线性回归。

<!-- more -->

---

# 训练数据
本次使用的训练数据是美国房价数据，做了一些预处理，完整数据可从[这里](https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data)下载，原始数据共有1460行８１列，其中我选用了LotArea(房屋面积)和SalePrice(售价)两个变量来分别作为自变量和因变量，处理后样本个数为1140个，也就是说全部训练数据是一个1140*2的矩阵，部分数据如下所示：
![训练部分数据](http://img.blog.csdn.net/20161022194326754)
*训练部分数据*

---

# 模型
本次使用的是线性回归模型 $$y=Wx+b$$ 其中$W$为权重，$b$为偏置。
具体地，$x$ 即为LotArea，$y$ 即为SalePrice。

---

# 开始训练
使用TensorFlow训练模型大致是这样的步骤：

	1. 设置各种超参数，例如学习率，迭代次数等；
	2. 定义变量和模型；
	3. 初始化变量;
	4. 正式开始训练.

废话不多说上完整代码，代码里有注释：

```python
from __future__ import print_function, division
import tensorflow as tf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn
# 我是在Jupyter Notebook里运行的，所以需要这行
%matplotlib inline

# 读入数据
train = pd.read_csv("Dataset/train.csv")
# 选取房屋面积小于１２０００的数据
train = train[train['LotArea'] < 12000]
train_X = train['LotArea'].values.reshape(-1, 1)
train_Y = train['SalePrice'].values.reshape(-1, 1)

n_samples = train_X.shape[0]
# 学习率
learning_rate = 2
# 迭代次数
training_epochs = 1000
# 每多少次输出一次迭代结果
display_step = 50

# 这个X和Y和上面的train_X,train_Y是不一样的，这里只是个占位符，
# 训练开始的时候需要“喂”(feed)数据给它
X = tf.placeholder(tf.float32)
Y = tf.placeholder(tf.float32)
# 定义模型参数
W = tf.Variable(np.random.randn(), name="weight", dtype=tf.float32)
b = tf.Variable(np.random.randn(), name="bias", dtype=tf.float32)

# 定义模型
pred = tf.add(tf.mul(W, X), b)
# 定义损失函数
cost = tf.reduce_sum(tf.pow(pred-Y, 2)) / (2 * n_samples)
# 使用Adam算法，至于为什么不使用一般的梯度下降算法，一会说
optimizer = tf.train.AdamOptimizer(learning_rate).minimize(cost)

# 初始化所有变量
init = tf.initialize_all_variables()

# 训练开始
with tf.Session() as sess:
    sess.run(init)
    
    for epoch in range(training_epochs):
        for (x, y) in zip(train_X, train_Y):
            sess.run(optimizer, feed_dict={X: x, Y: y})

        if (epoch + 1) % display_step == 0:
            c = sess.run(cost, feed_dict={X: train_X, Y: train_Y})
            print("Epoch:", '%04d' % (epoch + 1), "cost=", "{:.3f}".format(c), "W=", sess.run(W), "b=", sess.run(b))
    
    print("Optimization Finished!")
    training_cost = sess.run(cost, feed_dict={X: train_X, Y: train_Y})
    print("Training cost=", training_cost, "W=", sess.run(W), "b=", sess.run(b), '\n')
    
    # 画图
    plt.plot(train_X, train_Y, 'ro', label="Original data")
    plt.plot(train_X, sess.run(W) * train_X + sess.run(b), label="Fitted line")
    plt.legend()
    plt.show()
```

结果如下，

```
Epoch: 0050 cost= 2283274240.000 W= 20.3469 b= 12945.2
Epoch: 0100 cost= 2196306176.000 W= 19.0349 b= 24402.2
Epoch: 0150 cost= 2128102656.000 W= 17.8766 b= 34479.1
Epoch: 0200 cost= 2074902912.000 W= 16.8604 b= 43292.1
Epoch: 0250 cost= 2033546240.000 W= 15.9735 b= 50965.1
Epoch: 0300 cost= 2001452160.000 W= 15.2026 b= 57622.0
Epoch: 0350 cost= 1976554496.000 W= 14.5348 b= 63380.2
Epoch: 0400 cost= 1957219584.000 W= 13.9577 b= 68350.4
Epoch: 0450 cost= 1942167424.000 W= 13.4598 b= 72634.2
Epoch: 0500 cost= 1930414208.000 W= 13.0309 b= 76322.2
Epoch: 0550 cost= 1921200000.000 W= 12.6619 b= 79494.2
Epoch: 0600 cost= 1913948928.000 W= 12.3445 b= 82220.2
Epoch: 0650 cost= 1908209664.000 W= 12.0717 b= 84562.8
Epoch: 0700 cost= 1903651840.000 W= 11.8377 b= 86572.4
Epoch: 0750 cost= 1900003456.000 W= 11.6364 b= 88299.7
Epoch: 0800 cost= 1897074944.000 W= 11.4638 b= 89781.0
Epoch: 0850 cost= 1894714880.000 W= 11.3161 b= 91048.3
Epoch: 0900 cost= 1892792320.000 W= 11.189 b= 92139.5
Epoch: 0950 cost= 1891217024.000 W= 11.0795 b= 93078.3
Epoch: 1000 cost= 1889932800.000 W= 10.9862 b= 93879.3
Optimization Finished!
Training cost= 1.88993e+09 W= 10.9862 b= 93879.3 
```
![这里写图片描述](http://img.blog.csdn.net/20161022201205063)

---

# 几个问题

 1. 在迭代次数相同的情况下，调节学习率能非常有效的改变损失的下降速度，刚开始学习率是0.001，结果非常的不好，损失比现在的大**0.3e09**左右，一步一步加大学习率效果显著，即使现在的２也不算大（对于这个问题），但是对于其他问题，要具体情况具体分析，这个学习率或许太过激进;
 2. 至于优化算法为什么不选用更为常见的`tf.train.GradientDescentOptimize`,刚开始我也是用的这个算法，结果发现 `cost`, `W`, `b` 都是`nan`，Not a Number，后来当我每一次迭代都输出结果的时候，发现原来这几个值异常迅速的增大，导致超出了表示范围，如下,学习率为 0.001

	```
	Epoch: 0001 W= 1541.27 b= -0.811313
	Epoch: 0001 W= -121530.0 b= -13.6312
	Epoch: 0001 W= 1.33729e+07 b= 1185.87
	Epoch: 0001 W= -1.05648e+09 b= -110841.0
	Epoch: 0001 W= 9.3181e+10 b= 9.23441e+06
	Epoch: 0001 W= -8.717e+12 b= -8.39367e+08
	Epoch: 0001 W= 2.77678e+14 b= 4.59572e+10
	Epoch: 0001 W= -1.31328e+16 b= -1.76138e+12
	Epoch: 0001 W= 1.43194e+18 b= 1.27263e+14
	Epoch: 0001 W= -1.7716e+20 b= -1.48503e+16
	Epoch: 0001 W= 1.74557e+22 b= 1.64051e+18
	Epoch: 0001 W= -1.80845e+24 b= -1.65567e+20
	Epoch: 0001 W= 5.76078e+25 b= 9.54297e+21
	Epoch: 0001 W= -6.32776e+27 b= -5.585e+23
	Epoch: 0001 W= 6.40024e+29 b= 5.93388e+25
	Epoch: 0001 W= -3.14474e+31 b= -4.18503e+27
	Epoch: 0001 W= 1.4992e+33 b= 2.01299e+29
	Epoch: 0001 W= -1.23312e+35 b= -1.26103e+31
	Epoch: 0001 W= inf b= inf
	Epoch: 0001 W= nan b= nan
	Epoch: 0001 W= nan b= nan
	```
其实就是正负跳的太厉害，而且貌似收敛不了。即使我减小学习率也是杯水车薪，后来试用了这个Adam（Adaptive Moment Estimation）算法，结果没有那个问题了，其实还有其他的算法，我还没有来得及一个一个试，如果想了解各种梯度下降算法，可以参考这篇文章：[An overview of gradient descent optimization algorithms](http://sebastianruder.com/optimizing-gradient-descent/index.html)
 3. 其实在这种简单的模型上，我个人觉得使用 sklearn 效率更高点（当然 TensorFlow 的定制性比较强，更为底层），我用 sklearn 实现了一次，效果很好，基本就是傻瓜式操作，效果如图，
![这里写图片描述](http://img.blog.csdn.net/20161022203636514)
可以看到两种方法得出的结果还是差不多的（当然TF更为繁琐些）。另外在耗时上，sklearn 也要明显快于 TF, sklearn 几乎是秒出，TF 每次迭代大概需要 11 秒。

---

# END
暂且就是这些，今天折腾了大半天，不容易啊，还是自己太嫩啦：）