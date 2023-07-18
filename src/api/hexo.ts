import { getPlainHexoPost, getPlainHexoPostDetail, initHexo, parseHexoArr } from "@/utils";


export const getAllHexoTags = async () => {
  const hexo = await initHexo();
  const hexoTags = hexo.locals.get('tags') as any
  const tags = parseHexoArr(hexoTags)
  return tags
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

/**
 * 获取文章详情
 * @param slug 
 */
export const getHexoPostDetail = async (slug: string) => {
  const hexo = await initHexo();
  const post = hexo.database.model('Post').findOne({
    slug
  })
  if (!post) {
    return null;
  }
  const { title, date, slug: postSlug, tags, _id, content, cover = '', raw } = post
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

/**
 * 获取分类下的文章数量
 * @param category 
 * @returns 
 */
export const getHexoPostCountByCategory = async () => {
  const hexo = await initHexo();
  const allCategories = hexo.database.model('Category').find({})
  const res: HexoCategoryItem[] = [];
  allCategories.forEach((categoryItem: any) => {
    const { name, _id, posts} = categoryItem
    const postCount = posts.length
    res.push({
      name,
      _id,
      postCount
    })
  })
  return res;
}

/**
 * 获取公共的数据
 */
export const getCommonServerData = async () => {
  const tags = await getAllHexoTags();
  const categories = await getHexoPostCountByCategory()
  return {
    tags,
    categories
  }
}

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

/**
 * 根据分类名获取对应的文章列表
 * @param categoryName 
 * @returns 
 */
export const getHexoPostByCategoryName = async (categoryName: string) => {
  const hexo = await initHexo();
  const categoryList = hexo.database.model('Category').find({
    name: categoryName
  }).toArray();
  const postsFromCategory = categoryList?.[0]?.posts;
  if (!postsFromCategory) {
    return null;
  }
  const posts = postsFromCategory.map((postItem: any) => getPlainHexoPost(postItem));
  return posts as HexoPost[];
}

/**
 * 根据关键字搜索文章
 * @param keyWord 
 * @returns 
 */
export const getHexoPostByKeyWord = async (keyWord: string) => {
  const hexo = await initHexo();
  const posts = hexo.database.model('Post').find({});
  const plainPosts = posts.map((postItem: any) => {
    return getPlainHexoPostDetail(postItem);
  }).filter((postItem: any) => {
    const { title, content } = postItem
    if (title.includes(keyWord) || content.includes(keyWord)) {
      return true;
    }
  })
  return plainPosts as HexoPost[];
}