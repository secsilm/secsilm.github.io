---
title: 使用 zipfile 解压含有中文文件名的 zip 文件
date: 2018-4-5 18:51:23
tags: 
  - Python
---

## 问题

在使用 Python 内置标准库 [zipfile](https://docs.python.org/3/library/zipfile.html) 解压文件时，如果压缩文件中有的文件含有中文，那么解压后就会发现文件名中的中文部分是乱码。例如我分别新建三个 txt 文件：`文件1.txt`，`文件2.txt` 和 `文件3.txt`，然后将这三个文件压缩到一个名为 `文件.zip` 的压缩文件中。然后我们使用下面的代码来解压：

```python
import zipfile
with zipfile.ZipFile('文件.zip', 'r') as f:
    f.extractall()
```

解压的结果如图所示，中文已成乱码：
![解压结果](https://i.imgur.com/0Q6cdCe.png)

## 原因

原因很简单，`zipfile` 会将所有文件名用 `CP437` 来编码，官方说明如下：

> There is no official file name encoding for ZIP files. If you have unicode file names, you must convert them to byte strings in your desired encoding before passing them to write(). WinZip interprets all file names as encoded in CP437, also known as DOS Latin.

## 解决

知道文件名用的编码后，就可以使用对应的编码来解码了。也就是先用 `CP437` 编码 encode 成 bytes，再以 `gbk` 格式解码成中文 string。

有两种解决方案，两种方案都是使用 `extract` 方法而不是 `extractall`方法，都是对压缩文件内的文件名进行遍历，逐个解压。

> Note：Python 版本为 `3.6.4 |Anaconda custom (64-bit)| (default, Jan 16 2018, 10:22:32) [MSC v.1900 64 bit (AMD64)]`。

### 方案 1

第一种方案的思路是：

1. 将文件名正确解码，并用解码后的文件名创建一个新文件。
2. 打开原文件，即文件名乱码的文件。
3. 将原文件中的内容写入到新文件中。

对应的代码如下：

```python
import shutil
import zipfile

with zipfile.ZipFile('文件.zip', 'r') as zf:
    for fn in zf.namelist():
        right_fn = fn.encode('cp437').decode('gbk')  # 将文件名正确编码
        with open(right_fn, 'wb') as output_file:  # 创建并打开新文件
            with zf.open(fn, 'r') as origin_file:  # 打开原文件
                shutil.copyfileobj(origin_file, output_file)  # 将原文件内容复制到新文件
```

### 方案 2

第二种方案思路就比较简单了：

1. 正常解压文件。
2. 使用正确的文件名重命名解压的文件。

对应的代码如下，这里使用了 [pathlib](https://docs.python.org/3/library/pathlib.html) 库，强烈推荐该库！

```python
from pathlib import Path
import zipfile

with zipfile.ZipFile('文件.zip', 'r') as f:
    for fn in f.namelist():
        extracted_path = Path(f.extract(fn))
        extracted_path.rename(fn.encode('cp437').decode('gbk'))
```

## END