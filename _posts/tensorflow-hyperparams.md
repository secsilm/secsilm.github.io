---
title: 学习率、迭代次数和初始化方式对模型准确率的影响
date: 2016-10-29 04:46:50
tags:
  - Machine Learning
  - TensorFlow
  - Python
---

想必学过机器学习的人都知道，学习率、训练迭代次数和模型参数的初始化方式都对模型最后的准确率有一定的影响，那么影响到底有多大呢？

我初步做了个实验，在 `TensorFlow` 框架下使用 Logistics Regression 对经典的 `MNIST` 数据集进行分类。

<!-- more -->

> 本文所说的 **准确率** 均指 **测试准确率**。

## 代码

```python
from tensorflow.examples.tutorials.mnist import input_data

mnist = input_data.read_data_sets("/home/alan/data/", one_hot=True)

from __future__ import print_function
import tensorflow as tf
import matplotlib.pyplot as plt
# 如果运行提示没有seaborn库，可以注释掉这行代码
# 也可以使用 pip install seaborn或者 conda install seaborn安装
import seaborn
# 我是在Jupyter Notebook下运行的
# 如果你是在命令行运行那么就注释掉下面这一行
%matplotlib inline

# 设置模型
# 学习率
learning_rate = 0.01
# 训练迭代次数
training_epochs = 50
# batch大小
batch_size = 100
# 每多少次迭代显示一次损失
display_step = 1

x = tf.placeholder(tf.float32, [None, 784])
y = tf.placeholder(tf.float32, [None, 10])

# 模型参数
# W = tf.Variable(tf.zeros([784, 10]))
# b = tf.Variable(tf.zeros([10]))
W = tf.Variable(tf.truncated_normal([784, 10]))
b = tf.Variable(tf.truncated_normal([10]))

# 建立模型
pred = tf.nn.softmax(tf.matmul(x, W) + b)

# 定义损失函数：交叉熵
cost = tf.reduce_mean(-tf.reduce_sum(y*tf.log(pred), reduction_indices=1))

# 梯度下降
optimizer = tf.train.GradientDescentOptimizer(learning_rate).minimize(cost)

# 初始化所有变量
init = tf.initialize_all_variables()

# 训练模型
with tf.Session() as sess:
    sess.run(init)
    
    ax1 = plt.subplot(211)
    ax1.set_ylabel("Accuracy")
    ax2 = plt.subplot(212, sharex=ax1)
    ax2.set_ylabel("Cost")
    ax2.set_xlabel("Epoch")
    plt.setp(ax1.get_xticklabels(), visible=False)
    
    for epoch in range(training_epochs):
        avg_cost = 0
        total_batch = int(mnist.train.num_examples / batch_size)
        
        for i in range(total_batch):
            batch_xs, batch_ys = mnist.train.next_batch(batch_size)
            _, c = sess.run([optimizer, cost], feed_dict={x: batch_xs, y: batch_ys})
            
            avg_cost += c / total_batch
            
        if (epoch + 1) % display_step == 0:
             # 计算测试准确率
            correct_prediction = tf.equal(tf.argmax(pred, 1), tf.argmax(y, 1))
            accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
            
            ax1.plot(epoch+1, accuracy.eval({x: mnist.test.images, y: mnist.test.labels}), 'mo')
            ax2.plot(epoch+1, avg_cost, 'co') 
            
            print("Epoch:", '%04d' % (epoch+1), "cost=", '{:.9f}'.format(avg_cost), end=' ')
            print("Accuracy:", accuracy.eval({x: mnist.test.images, y: mnist.test.labels}))
            
    print("Optimization Finished!")
    
    print("Accuracy:", accuracy.eval({x: mnist.test.images, y: mnist.test.labels}))
    plt.suptitle("learning rate=%f, training epochs=%i, with tf.truncated_normal()" % (learning_rate, training_epochs), size=14)
    plt.savefig('AC8.png', dpi=300)
    plt.show()
```

通过修改 `learning_rate` 和 `training_epochs`来修改学习率和迭代次数，修改

```python
# 所有变量初始化为0
# W = tf.Variable(tf.zeros([784, 10]))
# b = tf.Variable(tf.zeros([10]))

# 所有变量初始化为符合标准截断正态分布的随机数
W = tf.Variable(tf.truncated_normal([784, 10]))
b = tf.Variable(tf.truncated_normal([10]))
```

来修改变量的初始化方式。程序最终会输出损失和准确率随着迭代次数的变化趋势图。

## 结果
> 以下结果的背景是：TensorFlow，Logistics Regression，MNIST数据集，很可能换一个数据集下面的结论中的某一条就不成立啦，所以要具体情况具体分析，找到最优的超参数组合。

多次的更改会输出多个不同的图，我们先来看下最终的准确率比较，然后再看下每种情况的详细的损失和准确率变化。

### 符号说明

 - `lr`：Learning Rate，学习率 
 - `te`：Training Epochs，训练迭代次数
 - `z`：`tf.zeros()`，变量初始化为0
 - `t`：`tf.truncated_normal()`，变量初始化为标准截断正态分布的随机数

### 最终准确率比较

![](http://i.imgur.com/nTchbUv.png)

可以看到

- 学习率为0.1，迭代次数为50次，并且采用随机初始化方式时准确率远远低于其他方式，甚至不足90%。而学习率为0.1，迭代次数为50次，并且采用随机初始化的方式时准确率最高。
- 对于采用随机初始化的方式，在其他参数相同的情况下增大迭代次数会明显的提高准确率。而对于初始化为0的情况则无明显变化。
- 其他参数相同的情况下，过度增大学习率**的确是**会导致准确率下降的，查看详细变化过程时可以看到准确率变化波动比较大。
- 在学习率适中，迭代次数较大时变量初始化方式对最终准确率的影响不大。

### 每种情况损失和准确率的详细变化趋势

> 与上图的顺序保持一致，从上至下。
> 每张图的标题在图的下面，斜体字。

![](http://i.imgur.com/aO85yQS.png)
*学习率为1，迭代次数为50，随机初始化*

---

![](http://i.imgur.com/woxsj8h.png)
*学习率为1，迭代次数为50，初始化为0*

---

![](http://i.imgur.com/Df5bWDw.png)
*学习率为0.1，迭代次数为50，随机初始化*

---

![](http://i.imgur.com/5HEoBR2.png)
*学习率为0.1，迭代次数为50，初始化为0*

---

![](http://i.imgur.com/ROX2pla.png)
*学习率为0.1，迭代次数为25，随机初始化*

---

![](http://i.imgur.com/YbIsLq0.png)
*学习率为0.1，迭代次数为25，初始化为0*

---

![](http://i.imgur.com/CDmZXao.png)
*学习率为0.01，迭代次数为50，随机初始化*

---

![](http://i.imgur.com/R31MqQK.png)
*学习率为0.01，迭代次数为50，初始化为0*

---

大部分情况下准确率和损失的变化时单调的，但是当学习率过大（`=1`）时准确率开始不稳定。

## END

暂且就是这么多，我说的难免有不合适的地方，有错误的地方欢迎指出。