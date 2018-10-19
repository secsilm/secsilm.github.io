---
title: TensorFlow 中的卷积神经网络 CNN - TensorBoard 版
date: 2017-03-17 10:57
tags: 
  - TensorFlow
  - Machine Learning
---

[前面](http://blog.csdn.net/u010099080/article/details/53906810) 写了一篇用 TensorFlow 实现 CNN 的文章，没有实现 TensorBoard，这篇来加上 TensorBoard 的实现，代码可以从 [这里](http://download.csdn.net/detail/u010099080/9781711) 下载。

<!-- more -->

---

# 什么是 TensorBoard

> To make it easier to understand, debug, and optimize TensorFlow programs, we've included a suite of visualization tools called TensorBoard. You can use TensorBoard to visualize your TensorFlow graph, plot quantitative metrics about the execution of your graph, and show additional data like images that pass through it.

上面是引用了官网的介绍，意思就是说 TensorBoard 就是一个方便你理解、调试、优化 TensorFlow 程序的可视化工具，你可以可视化你的 TensorFlow graph、学习参数以及其他数据比如图像。

启动你的 TensorBoard 并在浏览器中打开后应该是类似下面这样的：

![这里写图片描述](http://img.blog.csdn.net/20170317093749890?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

---

# CNN 结构

CNN 的结构和 [上篇](http://blog.csdn.net/u010099080/article/details/53906810) 一样，数据集仍为 CIFAR10 数据集。

下面我用 TensorBoard 绘制的结构图说一下：

![这里写图片描述](http://img.blog.csdn.net/20170317094029137?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

为了简洁我隐掉了一些不必要的节点。从图中可以看出有**两个卷积层**、**两个池化层**、**两个 norm 层**以及**三个全连接层**，图中指向 `train` 节点的线条的粗细表示需要训练的参数的多少，各层之间的线条上的数字表示了传递给下一层的参数的维度，例如 `conv1` 传递给 `pool1` 的参数维度是 `?×32×32×64` （*由于这个图不能放大导致重叠，在浏览器中是可以放大的*），`?` 表示 batch 的大小。具体的各层参数如下：

- `conv1`：kernel 大小是 `[5, 5, 3, 64]`，步长为 1，padding 为 `SAME`。
- `pool1`：kernel 大小是 `[1, 3, 3, 1]`，步长为 2，padding 为 `SAME`。
- `conv1`：kernel 大小是 `[5, 5, 64, 64]`，步长为 1，padding 为 `SAME`。
- `pool1`：kernel 大小是 `[1, 3, 3, 1]`，步长为 2，padding 为 `SAME`。
- `fc1`：神经元个数为 384
- `fc2`：神经元个数为 192

---

# 代码

完整代码可以在 [这里](http://download.csdn.net/detail/u010099080/9781711) 下载，下面我就说下关于 TensorBoard 的部分。

上面那个图中的每个节点都是用 `tf.namescope()` 指定的，例如

```python
with tf.name_scope('conv1'):
        conv1 = tf.nn.conv2d(x4d, weight_variable('conv1', [5, 5, 3, 64], 5e-2, 'w_conv1'), strides=[1, 1, 1, 1], padding='SAME')
        conv1 = tf.nn.bias_add(conv1, bias_variable('conv1', 0.0, tf.float32, [64], 'b_conv1'))
        conv1 = tf.nn.relu(conv1)
```

这就指定了 `conv1` 的节点。相同节点名字会在一起。

你可以使用 `tf.summary.scalar` 记录准确率、损失等数据，使用 `tf.summary.histogram` 记录参数的分布情况。

```python
with tf.name_scope('accuracy'):
        with tf.name_scope('correct_prediction'):
            correct_pred = tf.equal(tf.argmax(fc3, 1), tf.argmax(y, 1))
        with tf.name_scope('accuracy'):
            accuracy = tf.reduce_mean(tf.cast(correct_pred, tf.float32))
    tf.summary.scalar('accuracy', accuracy)
```

然后用 `tf.summary.merge_all` 将这些操作集中起来。

```python
merged_summary_op = tf.summary.merge_all()
```

最后运行的时候使用 `tf.summary.FileWriter` 将这些操作得到的数据写进日志文件，以供 TensorBoard 可视化。

```python
summary_writer = tf.summary.FileWriter('./tensorboard/log/', graph=tf.get_default_graph())
```

还可以可以使用`tf.train.Saver` 保存模型，TensorBoard 可以显示每一步的运行时间以及内存使用情况。（*下面仅是代码片段*）

```python
saver = tf.train.Saver()
# 这里有其他代码
run_options = tf.RunOptions(trace_level=tf.RunOptions.FULL_TRACE)
run_metadata = tf.RunMetadata()
# 这里有其他代码
summary_writer.add_run_metadata(run_metadata, 'step%d' % (i * total_batch + batch))
saver.save(sess, './tensorboard/log/model.ckpt', i * total_batch + batch)
```
总之有好多功能，我在这里就不一一阐述了，可以去官网看文档。

---

# 效果

进入到 `tensorboard` 所在目录后，执行下面的语句即可启动 TensorBoard ：

没有使用 `tf.train.Saver()` 的：
```
tensorboard --logdir=tensorboard/log/without-saver
```

使用 `tf.train.Saver()` 的：
```
tensorboard --logdir=tensorboard/log/with-saver
```

按照提示，在浏览器中打开地址就可以看到可视化结果了。

![这里写图片描述](http://img.blog.csdn.net/20170317104021861?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
*例如我这里是 `http://192.168.16.1:6006/`* 

训练准确率曲线：

![这里写图片描述](http://img.blog.csdn.net/20170317104255958?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

损失曲线：

![这里写图片描述](http://img.blog.csdn.net/20170317104417375?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

Graph：

![这里写图片描述](http://img.blog.csdn.net/20170317104519633?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

Step 100 的各节点计算时间（需要使用 `tf.train.Saver()`）：

![这里写图片描述](http://img.blog.csdn.net/20170317105057094?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

Step 100 的各节点内存消耗（需要使用 `tf.train.Saver()`）：

![这里写图片描述](http://img.blog.csdn.net/20170317105148222?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

`fc1` 层参数的降维可视化，可以旋转缩放，这个在这里不太有用，仅作展示用，三个主成分解释的总方差才 21%。在做 NLP 的时候这个功能就非常有用了，可以方便的展示词的位置。

![这里写图片描述](http://img.blog.csdn.net/20170317105524256?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMDA5OTA4MA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

---

# END
OK，先到这里吧。