---
title: 在本地使用远程 Jupyter Lab 服务器
date: 2018-07-14 10:35:34
tags:
  - Python
header_image: https://cdn-images-1.medium.com/max/1600/1*_jDTWlZNUySwrRBgVNqoNw.png
---

> 注：本文中所说的内容同样适用于 Jupyter Notebook，如需了解 Jupyter Lab 可以查看[项目地址](https://github.com/jupyterlab/jupyterlab)。**强烈推荐使用 Jupyter Lab。**

## 前言

一般来说，我们都是在本地使用 Jupyter Lab，但有时候我们需要（想）在远程服务器上运行 Jupyter Lab，因为配置相对我们本地的 PC 要好点，这时候就需要在服务器上启动一个 lab，然后在本地浏览器访问。其实这方面在[官方文档](http://jupyter-notebook.readthedocs.io/en/stable/public_server.html)上已经有相关说明，而且网络上也有其他方法（端口转发），如 [Working with Jupyter notebook on a remote server | Oxford Protein Informatics Group](http://www.blopig.com/blog/2018/03/running-jupyter-notebook-on-a-remote-server-via-ssh/)。这两种方法不太相同，官网的实现效果是在本地浏览器输入服务器 IP + 端口，而后者的方法是采用了端口转发的方法，不管服务器的 IP 和端口是多少，最后只需要在本地浏览器输入 `localhost:8888` 就行，和在本地运行 Jupyter Lab 是一样的。

本质上来说，我们需要实现的是这样一个东西：

1. 在远程服务器上启动 Jupyter Lab
2. 在本地浏览器上访问使用远程服务器的 Jupyter Lab，所有的计算都在远程服务器完成

其实我刚开始用的是 [Working with Jupyter notebook on a remote server | Oxford Protein Informatics Group](http://www.blopig.com/blog/2018/03/running-jupyter-notebook-on-a-remote-server-via-ssh/) 的方法，即端口转发，但是我在成功了一次后就在也没成功了，后续连接一直报 `ERROR_CONNECTION_RESET` 错误，搜寻无果，无奈之下就又去官网看了看。

![ERROR_CONNECTION_RESET](https://i.imgur.com/nOvsXbY.png)

官方文档是真的详细……什么加密安全都想好了，但是对我来说，我用不着这些，因为我就是在局域网内用，而且就我一个人用，也不公开，所以说流程就可以简化很多了。

## 步骤

你要做的很简单：

1. 【本地】登入远程服务器：`ssh USER@IP -p PORT`
2. 【远程服务器】在 `~/.jupyter/jupyter_notebook_config.json` 中写入如下内容，尤其是 `"ip": "*"`，这样让服务器监听所有 ip：
    ```json
    {
      "NotebookApp": {
        "ip": "*",
        "open_browser": false
      }
    }
    ```
3. 【远程服务器】启动 Jupyter Lab：`jupyter lab --port LAB_PORT --no-browser`
4. 【本地】打开浏览器（chrome），地址栏输入 `IP:LAB_PORT` 回车，done

在第 2 步时，如果你想为自己的 Jupyter Lab 设置一个密码，那么你可以在终端内输入 `jupyter notebook password`，然后会提示你输入密码，此时输入你想要设置的密码就行，不必像其他教程那样用工具生成加密的密码，因为 Jupyter Notebook 会为你自动生成。你可以在 `~/.jupyter/jupyter_notebook_config.json` 中看到类似如下的内容，其中 `*****` 是一长串的加密过后的密码。

```json
{
  "NotebookApp": {
    "password": "sha1:*****",
    "ip": "*",
    "open_browser": false
  }
}
```

然后当你在本地浏览器输入 `IP:LAB_PORT` 回车时，会要求你输入密码：

![jupyter lab password](https://i.imgur.com/UvPymtH.png)

这种方法适合在本地 PC 和远程服务器在同一个局域网内的情况，对于不在局域网内的情况还不行，应该是需要在远程服务器上配置防火墙开放端口，但是由于我没有 root 权限，设置不了防火墙。

## References

- [Running a notebook server — Jupyter Notebook 5.5.0 documentation](http://jupyter-notebook.readthedocs.io/en/stable/public_server.html)
- [Working with Jupyter notebook on a remote server | Oxford Protein Informatics Group](http://www.blopig.com/blog/2018/03/running-jupyter-notebook-on-a-remote-server-via-ssh/)
- [Setting up a Jupyter Lab remote server | Kernel of Truth](https://agent-jay.github.io/2018/03/jupyterserver/)

## END