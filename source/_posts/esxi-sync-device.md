---
title: esxi开启sata和usb直通
date: 2023-09-03 20:30:20
tags: esxi
categories: 家用服务器
cover: http://oss.ryanamigo.com/blog/esxi-1.png
---


![image.png](http://oss.ryanamigo.com/blog/esxi-1.png)
上图已经开启了sata和use的直通，默认情况下，无法开启sata和usb直通，需要修改配置文件，修改方式如下


## 开启esxi的ssh
![image.png](http://oss.ryanamigo.com/blog/esxi-2.png)
开启后，我们就可以通过终端访问esxi系统了

```shell
ssh root@192.168.124.3
# 替换为自己的ip
```
![image.png](http://oss.ryanamigo.com/blog/esxi-3.png)

esxi内置vi编辑器，可以修改配置文件，我们需要修改的文件是`/etc/vmware/passthru.map`
```shell
cd /etc/vmware
vi passthru.map

```

翻到最底部，可以看到如下内容

![image.png](http://oss.ryanamigo.com/blog/esxi-4.png)

然后看网页端控制台
![image.png](http://oss.ryanamigo.com/blog/esxi-5.png)

## 开启usb直通

点击`usb controller`，我们重点关注`设备ID`和`供应商ID`，在`passthru.map`文件中填写这两个值，不用填写`0x`,填写方式如下

```
供应商ID  设备ID  d3d0  default
```

## 开启sata直通
同理，点击`SATA controller`，填写方式如下
```
供应商ID  设备ID  d3d0  false
```
**注意，sata这里，后面填写的是false**

填写完后保存，重启esxi系统，就可以开启直通了。