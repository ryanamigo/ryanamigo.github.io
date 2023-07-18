---
title: 使用hexo做为数据源，配合Next做渲染
date: 2023-06-27 16:31:11
tags:
  - hexo
categories:
  - ['前端']
cover: https://ryan-1308859712.cos.ap-beijing.myqcloud.com/blog/hexo-next.jpg
---

hexo使用`warehouse数据库`，也就是一个json文件，运行在node环境。而`next.js`也运行在node服务端，因此可以让`next.js`在服务端执行hexo的api，获取数据，再生成html返回给前端网页。

<!-- more -->

## 创建项目

```ts
  npx create-next-app@latest
  hexo init hexo-temp
```
分别创建hexo和next两个项目，创建的两个项目文件结构如下

![](https://ryan-1308859712.cos.ap-beijing.myqcloud.com/blog/hexo-next-project.jpg)
## 整合项目

把`hexo`项目的文件夹和`package.json`中的依赖转移到`next`项目中，整合后如下
![](https://ryan-1308859712.cos.ap-beijing.myqcloud.com/blog/hexo-next-project2.jpg)

再修改一些配置

`public`目录已经被`next`使用，所以需要更改一下hexo得输出文件夹,因此把`_config.yml`中的`public_dir: public`更改为`public_dir: hexo-dist`


修改`package.json`中的启动脚本

```json
"scripts": {
    "clean": "hexo clean",
    "server": "hexo server",
    "new": "hexo new",
    "dev": "hexo generate && next dev",
    "build": "hexo generate && next build",
    "start": "next start"
}
```



## 生成hexo实例

```ts
import Hexo from 'hexo';
import { join } from 'path';
import fs from 'fs';
import type Database from 'warehouse'

type MyHexo = Hexo & {
  database: Database;
  _dbLoaded: boolean;
}

let __SECRET_HEXO_INSTANCE__: MyHexo | null = null;

export const initHexo = async () => {
  // 只保留一个 Hexo 实例
  if (__SECRET_HEXO_INSTANCE__) {
    return __SECRET_HEXO_INSTANCE__;
  }
  const hexo = new Hexo(process.cwd(), {
    silent: true,
  }) as MyHexo;

  const dbPath = join(hexo.base_dir, 'db.json');

  if (process.env.NODE_ENV !== 'production') {
    // 当 不属于生产构建、且本地存在 db.json 时，删除 db.json、确保开发时可以预览实时最新的数据
    if (fs.existsSync(dbPath)) {
      await fs.promises.unlink(dbPath);
    }
  }

  await hexo.init();
  await hexo.load();

  if (hexo.env.init && hexo._dbLoaded) {
    if (!fs.existsSync(dbPath)) {
      // 只有在本地不存在 db.json、且在生产构建时，将数据库写入文件系统
      if (process.env.NODE_ENV === 'production') {
        await hexo.database.save();
      }
    }
  }

  __SECRET_HEXO_INSTANCE__ = hexo;
  return hexo;
};

```


这些代码需要在服务端执行，因此需要放在`next`提供的`getServerSideProps中执行`

```ts
export const getServerSideProps = async () => {
  const hexo = await initHexo();
  console.log(hexo);
  return {
    props: {
      a: '1'
    }
  }
}
```

之后可以在控制台看到

![](https://ryan-1308859712.cos.ap-beijing.myqcloud.com/blog/hexo-next-project3.jpg)


## 查找文章

[warehouse数据库文档](https://hexojs.github.io/warehouse/index.html)，
`hexo`内置`warehouse`对象，`hexo.database`，在这里放两个例子,后面就请读者自行研究了

1. 分页获取文章

```ts

/**
 * 根据hexo文章原始对象获取文章简要信息json
 * @param postItem 
 * @returns 
 */
export const getPlainHexoPost = (postItem: any) => {
  // content是html字符串，raw是markdown字符串
  const { title, date, slug, tags, categories, cover = '', updated, _id, excerpt } = postItem
  const dateStr = date.format('YYYY-MM-DD')
  const updateStr = updated.format('YYYY-MM-DD');
  const tagsArr = parseHexoArr(tags);
  const category = parseHexoArr(categories)?.[0] || '';
  return {
    title,
    date: dateStr,
    update: updateStr,
    slug,
    tags: tagsArr,
    id: _id,
    excerpt,
    cover,
    category
  } as HexoPost
}


/**
 * 获取分页的文章列表
 * @param page 
 * @param pageSize 
 */
export const getHexoPostsPagination = async ({ page, pageSize}: {page: number, pageSize: number}) => {
  const hexo = await initHexo();
  const posts = hexo.database.model('Post').find({}, {
    limit: pageSize,
    skip: (page - 1) * pageSize,
  }).sort({
    date: -1
  });
  const totalElement = hexo.database.model('Post').count(); // 文章总数
  const totalPage = Math.ceil(totalElement / pageSize); // 总页数
  const plainPosts = posts.map((postItem: any) => {
    return getPlainHexoPost(postItem);
  })
  return {
    totalElement,
    totalPage,
    page,
    pageSize,
    posts: plainPosts
  } as {
    page: number,
    pageSize: number,
    totalElement: number;
    totalPage: number;
    posts: HexoPost[];
  };
}

```


2. 获取某个标签下得文章

```ts
/**
 * 根据标签名获取对应的文章列表
 * @param tagName 
 * @returns 
 */
export const getHexoPostByTagName = async (tagName: string) => {
  const hexo = await initHexo();
  const tagList = hexo.database.model('Tag').find({
    name: tagName
  }).toArray();
  const postsFromTag = tagList?.[0]?.posts;
  if (!postsFromTag) {
    return null;
  }
  const posts = postsFromTag.map((postItem: any) => getPlainHexoPost(postItem));
  return posts as HexoPost[];
}
```

*本人在使用13.4.4版本时，使用App rouer，执行hexo api时会报错，因此换回了page router，如果今后的版本能够使用App router，建议使用*

有了hexo的数据，后面就是自己写样式了，交给屏幕前厉害的前端了。