---
title: TensorFlow 中的多层感知器（MLP）
date: 2016-11-19 08:56:14
tags:
  - TensorFlow
  - Machine Learning
  - Python
---

前面有几篇博文讲了使用 `TensorFlow` 实现[线性回归](http://blog.csdn.net/u010099080/article/details/52894773)和[逻辑斯蒂回归](http://blog.csdn.net/u010099080/article/details/53054519)，这次来说下多层感知器（Multi-Layer Perceptron）的 `TensorFlow` 实现。

**本篇博文的代码及结果图片等可以在[这里](http://download.csdn.net/download/u010099080/9687585)下载，里面包含TensorFlow的实现和sklearn的实现，以及各自的结果图片。**

<!-- more -->

---

# 原理 #

> 多层感知器（Multilayer Perceptron,缩写MLP）是一种前向结构的人工神经网络，映射一组输入向量到一组输出向量。MLP是感知器的推广，克服了感知器不能对线性不可分数据进行识别的弱点。

关于 MLP 的原理我就不再赘述，我用下面的一个图来简单说明下：

![](http://i.imgur.com/IYMbvtU.png)

如上图，实际上这就是一个前馈神经网络，我画的就是本篇博文所使用的结构（*粗心少画了一层隐藏层，实际上使用的是3层隐藏层……*）：

1. 输入层：有 3072 个输入神经元，$m=3072$
2. 隐藏层：有两层（三层）隐藏层，每个隐藏层有 1024 个神经元，$ p=q=1024$；
3. 输出层：有10个神经元，$n=10$

输入层和输出层的神经元个数，是根据数据集来定的，而隐藏层的层数和每层隐藏层的神经元个数，这些都属于超参数（hyperparameter），是事先通过某种方法确定的。

---

# 数据集 #
这次采用的数据集是著名的 `CIFAR-10` 图像数据集，包含 **60000** 张 **32×32** 的彩色RGB图像，共有 **10** 类，每类有 **6000** 张图像。完整数据集可以从[这里](https://www.cs.toronto.edu/~kriz/cifar.html)下载，注意选择 Python 版本，大概是 163 MB。

下载好后解压会看到有5个训练文件和1个测试文件，还有一个说明文件（`batches.meta`），这个文件说明了每个数字类别（0-9）具体代表哪些类别。这几个文件都是用 `cPickle` 打包好的，所以载入数据也要用 `cPickle` 来载入。注意Python2和Python3的载入方式稍微有些不同，具体见代码。

目前在此数据集上做的实验在没有数据增加的情况下最低的错误率是 **18%**，数据增加的情况下最低的错误率是 **11%**，都是采用的卷积神经网络（CNN）的结构。


数据集中的图像和分类大致是这样的：

![](http://i.imgur.com/Rzsw6mo.png)

---

# 代码 #
以下代码的运行环境是 *Python2 + Ubuntu14.04 + Jupyter Notebook*。

```python
from __future__ import print_function
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
import cPickle as pickle
# seaborn非必需
import seaborn
# 如果不是在Jupyter Notebook上运行的话请注释掉下面这句
%matplotlib inline


def unpickle(filename):
	''' 解压数据 '''
    with open(filename) as f:
        # for python3 
        # d = pickle.load(f, encoding='latin1')
        d = pickle.load(f)
        return d


def onehot(labels):
	''' one-hot 编码 '''
    n_sample = len(labels)
    n_class = max(labels) + 1
    onehot_labels = np.zeros((n_sample, n_class))
    onehot_labels[np.arange(n_sample), labels] = 1
    
    return onehot_labels

# 读取数据
data1 = unpickle('cifar-10-batches-py/data_batch_1')
data2 = unpickle('cifar-10-batches-py/data_batch_2')
data3 = unpickle('cifar-10-batches-py/data_batch_3')
data4 = unpickle('cifar-10-batches-py/data_batch_4')
data5 = unpickle('cifar-10-batches-py/data_batch_5')

X_train = np.concatenate((data1['data'], data2['data'], data3['data'], data4['data'], data5['data']), axis=0)
label = np.concatenate((data1['labels'], data2['labels'], data3['labels'], data4['labels'], data5['labels']), axis=0)
y_train = onehot(label)

test = unpickle('cifar-10-batches-py/test_batch')
X_test = test['data']
y_test = onehot(test['labels'])

# 设置模型参数
learning_rate = 0.001
training_epochs = 500
batch_size = 500
display_step = 1
n_sample = X_train.shape[0]

n_input = X_train.shape[1]
n_hidden_1 = 1024
n_hidden_2 = 1024
n_hidden_3 = 1024
n_class = y_train.shape[1]

x = tf.placeholder('float', [None, n_input])
y = tf.placeholder('float', [None, n_class])


def multiplayer_perceptron(x, weight, bias):
    
    layer1 = tf.add(tf.matmul(x, weight['h1']), bias['h1'])
    layer1 = tf.nn.relu(layer1)
    layer2 = tf.add(tf.matmul(layer1, weight['h2']), bias['h2'])
    layer2 = tf.nn.relu(layer2)
    layer3 = tf.add(tf.matmul(layer2, weight['h3']), bias['h3'])
    layer3 = tf.nn.relu(layer3)
    out_layer = tf.add(tf.matmul(layer3, weight['out']), bias['out'])
    
    return out_layer


weight = {
    'h1': tf.Variable(tf.random_normal([n_input, n_hidden_1])),
    'h2': tf.Variable(tf.random_normal([n_hidden_1, n_hidden_2])), 
    'h3': tf.Variable(tf.random_normal([n_hidden_2, n_hidden_3])), 
    'out': tf.Variable(tf.random_normal([n_hidden_3, n_class]))
}
bias = {
    'h1': tf.Variable(tf.random_normal([n_hidden_1])),
    'h2': tf.Variable(tf.random_normal([n_hidden_2])), 
    'h3': tf.Variable(tf.random_normal([n_hidden_3])), 
    'out': tf.Variable(tf.random_normal([n_class]))
}

# 建立模型
pred = multiplayer_perceptron(x, weight, bias)

# 定义损失函数
cost = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(pred, y))

# 优化
optimizer = tf.train.AdamOptimizer(learning_rate).minimize(cost)

# 初始化所有变量
init = tf.initialize_all_variables()

correct_prediction = tf.equal(tf.argmax(pred, 1), tf.argmax(y, 1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, 'float'))

# 训练模型
with tf.Session() as sess:
    sess.run(init)
    
    for epoch in range(training_epochs):
        avg_cost = 0
        total_batch = int(n_sample / batch_size)
        
        for i in range(total_batch):
            _, c = sess.run([optimizer, cost], feed_dict={x: X_train[i*batch_size : (i+1)*batch_size, :], 
                                                          y: y_train[i*batch_size : (i+1)*batch_size, :]})
            avg_cost += c / total_batch
        
        plt.plot(epoch+1, avg_cost, 'co')
        
        if epoch % display_step == 0:
            print('Epoch:', '%04d' % (epoch+1), 'cost=', '{:.9f}'.format(avg_cost))
            
    print('Opitimization Finished!')
    
    # Test
    acc = accuracy.eval({x: X_test, y: y_test})
    print('Accuracy:', acc)
    
    plt.xlabel('Epoch')
    plt.ylabel('Cost')
    plt.title('lr=%f, te=%d, bs=%d, acc=%f' % (learning_rate, training_epochs, batch_size, acc))
    plt.tight_layout()
    plt.savefig('cifar-10-batches-py/MLP-TF14-test.png', dpi=200)
    
    plt.show()
```

---

# 结果 #
由于进行了500次迭代，结果太多，这里我就不一一列出了，完整的可以在[这里](http://download.csdn.net/download/u010099080/9687585)连带代码一起下载，里面也包含了我测试不同超参数组合的结果图。

下面给出本次实验的结果图：

![](http://i.imgur.com/mLZ5ALb.png)

其中的缩写仍然遵照我以前博文的习惯，

- `lr`：learning rate，学习率
- `tr`：training epochs，训练迭代次数
- `bs`：batch size，batch大小
- `acc`：测试准确率

可以看到最终的准确率是 46.98%，如前所述，目前此数据集上最好的结果是 82%，用的是对图像识别有巨大优势的卷积神经网络。当然，使用更深层的MLP也会提高准确率。

---

# 一些问题 #

1. 学习率不能过大，这里使用的 0.001 已经是极限，其他参数不变的情况下，再大例如 0.01，准确率会大幅下跌，跌至 10% 左右，此时无论再怎么增加迭代次数准确率（包括训练准确率）也不会提高，一直在 10% 左右，但是损失却降得很厉害，此处还未彻底搞清楚。
2. 我使用sklearn也测试了一下（代码下载链接和上面一样），最终准确率 46.25%。
3. 本片博文只是为了说明如何使用 TensorFlow 实现MLP，本次做的实验并不一定是最优的实验结果。
4. [这篇博文](http://blog.csdn.net/u010099080/article/details/53906810) 同样使用CIFAR10数据集但是使用CNN模型，可以和本文做个对比。

---

# END #