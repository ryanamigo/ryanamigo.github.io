type PromiseType<T> = (args: any[]) => Promise<T>;
type UnPromisify<T> = T extends PromiseType<infer U> ? U : never;

type HexoPost = {
  title: string;
  date: string;
  update: string;
  slug: string;
  tags: string[];
  id: string;
  cover?: string;
  excerpt?: string;
  category: string
}

type HexoPostDetail = HexoPost & {
  content: string;
  raw: string;
}

type HexoCategoryItem = {
  name: string;
  _id: string;
  postCount: number;
}

type HexoCategoryTreeItem = HexoCategoryItem & {
  children?: HexoCategoryTreeItem[]
}

type HexoCategoryTree = HexoCategoryTreeItem[];