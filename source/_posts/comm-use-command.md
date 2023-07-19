---
title: 常用但容易忘记的命令
date: 2023-07-19 22:43:34
tags:
  - 命令行
category:
  - 笔记
cover: https://ryan-1308859712.cos.ap-beijing.myqcloud.com/blog/cowsay.png
---

记录常用命令，忘了也不用到处找
<!-- more -->

## docker相关

- 把当前用户加入docker组，无需sudo

  ```shell
  sudo usermod -aG docker $(whoami) && sudo chmod a+rw /var/run/docker.sock

  # 测试
  docker info
   
  ```

- 删除tag为none的镜像

  ```shell
  docker images | grep none | awk '{print $3}' | xargs docker rmi
  ```

- 修改当前目录下的所有文件的权限

  ```shell
  chmod -R 755 ./
  ```