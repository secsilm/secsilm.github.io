---
title: 用 Python 发电子邮件
date: 2016-10-16 04:46:19
tags:
  - Python
---

> 本文首发于【赛克分享站】微信公号，未经允许，不得转载。

<!-- more -->

## 使用的库

这个程序涉及两个库：`smtplib` 和 `email`。

这两个库都是 Python 自带的，所以不需要额外的下载安装，此外，这次使用的 Python 版本为 2.7。

## 思路步骤

总体思路很简单，就像我们平常上网是通过HTTP协议一样，我们发送邮件是通过SMTP（*Simple Mail Transfer Protocol*，简单邮件传输协议）来传输的，而现在我们需要做的就是

 1. 设置好SMTP服务器地址
 2. 告诉服务器我们的邮箱地址和密码
 3. 设置要发送的邮件内容，例如发送者地址，接收者地址，邮件主题，邮件正文，附件等
 4. 将设置好的邮件内容传给服务器，并发送
 
第一步和第二步就是需要使用`smtplib` ，这是一个帮助我们设置SMTP服务器的库，那么具体如何设置呢？实际上我们需要的就是一个SMTP服务器的地址，例如QQ邮箱的SMTP服务器的地址就是：`smtp.qq.com`，端口号是`465`或`587`。

![qq邮箱的SMTP地址](http://img.blog.csdn.net/20161016163745601)
*qq邮箱的SMTP地址*

```python
server = smtplib.SMTP("smtp.qq.com", 587)
```
第三步就是使用 email ，这是一个帮助我们设置邮件内容的库，包括主题、正文等，然后用设置好的服务器发送设置好的邮件内容。

用赛克君的QQ邮箱发送：
![这里写图片描述](http://img.blog.csdn.net/20161016164127152)

另一个邮箱接收（outlook邮箱）
![这里写图片描述](http://img.blog.csdn.net/20161016164150668)

outlook邮箱内一个带PDF附件的邮件，可以看到附件被正确的附上了
![这里写图片描述](http://img.blog.csdn.net/20161016164207950)

## 程序源码

**发送无附件的邮件**

```python
# 注意此处使用QQ邮箱作为发送邮箱，如果要用其他邮箱请更改 server 中的服务器地址

import smtplib
from email.MIMEText import MIMEText
from email.MIMEMultipart import MIMEMultipart

fromaddr = "发送者的邮箱地址"
toaddr = "接收者的邮箱地址"
msg = MIMEMultipart()
msg['From'] = fromaddr
msg['To'] = toaddr
# 邮件主题
msg['Subject'] = "Hooah"
# 邮件正文
body = "HAHAHA!"

msg.attach(MIMEText(body, 'plain'))

server = smtplib.SMTP("smtp.qq.com")
server.starttls()
server.login(fromaddr , "发送者的邮箱密码")
text = msg.as_string()
server.sendmail(fromaddr, toaddr, text)
server.quit()
```

**发送有附件的邮件**

```python
# 注意此处使用QQ邮箱作为发送邮箱，如果要用其他邮箱请更改 server 中的服务器地址

import smtplib
from email.MIMEText import MIMEText
from email.MIMEMultipart import MIMEMultipart
from email.MIMEBase import MIMEBase
from email import encoders

fromaddr = "发送者的邮箱地址"
toaddr = "接收者的邮箱地址"
msg = MIMEMultipart()
msg['From'] = fromaddr
msg['To'] = toaddr
# 邮件主题
msg['Subject'] = "Hooah"
# 邮件正文
body = "HAHAHA!"

msg.attach(MIMEText(body, 'plain'))

# 附件
filename = "AttachmentTest/kaiti.pdf"
attachment = open(filename, 'rb')
part = MIMEBase('application', 'octet-stream')
# 这也可以： part = MIMEBase('application', 'pdf')
part.set_payload((attachment).read())
encoders.encode_base64(part)
part.add_header('Content-Disposition', 'attachment', filename=filename)

msg.attach(part)

# 设置SMTP
server = smtplib.SMTP("smtp.qq.com")
server.starttls()
server.login(fromaddr , "发送者的邮箱密码")
text = msg.as_string()
server.sendmail(fromaddr, toaddr, text)
server.quit()
```

发送成功就可以看到如下的提示：
![这里写图片描述](http://img.blog.csdn.net/20161016164358062)

## END