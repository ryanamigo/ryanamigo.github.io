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

export const parseHexoArr = (arr: any[]) => {
  const res: string[] = [];
  arr.forEach((arrItem) => {
    res.push(arrItem.name)
  })
  return res
}

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
 * 根据hexo文章原始对象获取文章详情json
 * @param postItem 
 * @returns 
 */
export const getPlainHexoPostDetail = (postItem: any) => {
  const { title, date, slug: postSlug, tags, _id, content, cover = '', raw } = postItem
  const dateStr = date.format('YYYY-MM-DD HH:mm:ss')
  const tagsArr = parseHexoArr(tags);
  return {
    title,
    date: dateStr,
    slug: postSlug,
    tags: tagsArr,
    id: _id,
    content,
    cover,
    raw,
  } as HexoPostDetail;
}
