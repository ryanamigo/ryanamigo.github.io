---
title: react组件的S.O.L.I.D原则
date: 2023-07-16 10:38:32
tags:
  - react
recommend: true
category:
  - 前端
cover: https://ryan-1308859712.cos.ap-beijing.myqcloud.com/blog/solid.png
---
没有组件封装的react，一定是屎山代码。
react组件五个原则
- Single Responsibility 单一职责
- Open-Closed 开闭原则
- Liskov Subsitution 里氏替换
- Interface Segregation 接口分离
- Dependency Inversion 依赖倒转

<!-- more -->

## 单一职责
一个组件/方法，只做一件事情。
### 反面案例
很多人写react时候，时这样写的，所有的逻辑功能都放在一个文件中，导致其他人看这段代码时很头疼，要上下来回翻找。
功能很简单，就是按照评价等级筛选商品。

```tsx
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Product } from "./product";
import { Rating } from "react-simple-star-rating";

export function Bad() {
  const [products, setProducts] = useState([]);
  const [filterRate, setFilterRate] = useState(1);

  const fetchProducts = async () => {
    const response = await axios.get(
      "https://fakestoreapi.com/products"
    );

    if (response && response.data) setProducts(response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRating = (rate: number) => {
    setFilterRate(rate);
  };

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product: any) => product.rating.rate > filterRate
      ),
    [products, filterRate]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col justify-center items-center">
        <span className="font-semibold">Minimum Rating </span>
        <Rating
          initialValue={filterRate}
          SVGclassName="inline-block"
          onClick={handleRating}
        />
      </div>
      <div className="h-full flex flex-wrap justify-center">
        {filteredProducts.map((product: any) => (
          <div className="w-56 flex flex-col items-center m-2 max-w-sm bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
              <img
                className="p-8 rounded-t-lg h-48"
                src={product.image}
                alt="product image"
              />
            </a>
            <div className="flex flex-col px-5 pb-5">
              <a href="#">
                <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                  {product.title}
                </h5>
              </a>
              <div className="flex items-center mt-2.5 mb-5 flex-1">
                {Array(parseInt(product.rating.rate))
                  .fill("")
                  .map((_, idx) => (
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-yellow-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>First star</title>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}

                <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
                  {parseInt(product.rating.rate)}
                </span>
              </div>
              <div className="flex flex-col items-between justify-around">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${product.price}
                </span>
                <a
                  href="#"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  // onClick={onAddToCart}
                >
                  Add to cart
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

```

上面的例子中，有如下功能

1. 获取商品列表
2. 展示商品列表
3. 星级评价
4. 按星级评价筛选

那就把这四个功能一一拆分

当我们的代码出现了很多`useState`、`useEffect`、`useMemo`等hook，我们需要考虑把它封装成一个自定义的hook
比如一个product的`state`，一个获取商品的`effect`，一个获取商品的请求，可以把这三个封装在一个`useProduct`中，这样就拆分出了第一个功能--获取商品列表

```ts
import axios from "axios";
import { useEffect, useState } from "react";

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    const response = await axios.get(
      "https://fakestoreapi.com/products"
    );

    if (response && response.data) setProducts(response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products };
};


```


### 组件拆分

jsx中有两部分，一个是商品的展示，另一个是星级筛选器的展示。

商品展示部分可以拆分为`Product.tsx`，这样就拆分出了第二个功能--展示商品列表
```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import styled from "styled-components";

interface IProduct {
  id: string;
  title: string;
  price: number;
  rating: { rate: number };
  image: string;
}

interface IProductProps {
  product: IProduct;
}

export function Product(props: IProductProps) {
  const { product } = props;
  const { id, title, price, rating, image } = product;

  return (
    <div className="w-56 flex flex-col items-center m-2 max-w-sm bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <img
          className="p-8 rounded-t-lg h-48"
          src={image}
          alt="product image"
        />
      </a>
      <div className="flex flex-col px-5 pb-5">
        <a href="#">
          <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
        </a>
        <div className="flex items-center mt-2.5 mb-5 flex-1">
          {Array(Math.trunc(rating.rate))
            .fill("")
            .map((_, idx) => (
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-yellow-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>First star</title>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}

          <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
            {Math.trunc(rating.rate)}
          </span>
        </div>
        <div className="flex flex-col items-between justify-around">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${price}
          </span>
          <a
            href="#"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            // onClick={onAddToCart}
          >
            Add to cart
          </a>
        </div>
      </div>
    </div>
  );
}
```


星级筛选器的UI部分可以拆分为`Filter.tsx`。
```tsx
import { useState } from "react";
import { Rating } from "react-simple-star-rating";

interface IFilterProps {
  filterRate: number;
  handleRating: (rate: number) => void;
}

export function Filter(props: IFilterProps) {
  const { filterRate, handleRating } = props;

  return (
    <div className="flex flex-col justify-center items-center mb-4">
      <span className="font-semibold">Minimum Rating </span>
      <Rating
        initialValue={filterRate}
        SVGclassName="inline-block"
        onClick={handleRating}
      />
    </div>
  );
}
```

按星级过滤，有一个filterRate的`state`，一个设置filterRate值的方法`handleRating`，这些可以封装为1个自定义的`useFilterRate`中。上面的组件加上这个hook就拆分出了第三个功能--星级评价。

```ts
import { useState } from "react";

export function useRateFilter() {
  const [filterRate, setFilterRate] = useState(1);

  const handleRating = (rate: number) => {
    setFilterRate(rate);
  };

  return { filterRate, handleRating };
}
```


按星级筛选商品仅需要一个方法
```ts
function filterProducts(products: any[], rate: number) {
  return products.filter(
    (product: any) => product.rating.rate > rate
  );
}
```

将所有代码组合起来
```tsx
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Product } from "./product";
import { Rating } from "react-simple-star-rating";
import { Filter } from "./filter";
import { useProducts } from "./hooks/useProducts";
import { useRateFilter } from "./hooks/useRateFilter";


function filterProducts(products: any[], rate: number) {
  return products.filter(
    (product: any) => product.rating.rate > rate
  );
}

export function Good() {
  const { products } = useProducts();
  const { filterRate, handleRating } = useRateFilter();
  const filteredProducts = useMemo(
    () => filterProducts(products, filterRate),
    [products, filterRate]
  );
  return (
    <div className="flex flex-col h-full">
      <Filter
        filterRate={filterRate as number}
        handleRating={handleRating}
      />
      <div className="h-full flex flex-wrap justify-center">
        {filterProducts(products, filterRate).map((product: any) => (
          <Product product={product} />
        ))}
      </div>
    </div>
  );
}
```

## 开闭原则

这四个字组合起来，让人看上去一脸懵，基本意思是*类/组件允许被扩展，不能被修改*，即开放扩展，关闭修改。

```tsx
import {
  HiOutlineArrowNarrowRight,
  HiOutlineArrowNarrowLeft,
} from "react-icons/hi";

interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  role?: "back" | "forward"
}

export function Button(props: IButtonProps) {
  const { text, role, icon } = props;

  return (
    <button
      className="flex items-center font-bold outline-none pt-4 pb-4 pl-8 pr-8 rounded-xl bg-gray-200 text-black"
      {...props}
    >
      {text}
      <div className="m-2">
        {role === "forward" && <HiOutlineArrowNarrowRight />}
        {role === "back" && <HiOutlineArrowNarrowLeft />}
      </div>
    </button>
  );
}
```
这个按钮只实现乐前进样式和返回样式，如果要再加一个搜索样式，那就需要在`Button`组件的源码中修改，这不符合开闭原则。

修改后
```tsx
import {
  HiOutlineArrowNarrowRight,
  HiOutlineArrowNarrowLeft,
} from "react-icons/hi";

interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  icon?: React.ReactNode;
}

export function Button(props: IButtonProps) {
  const { text, role, icon } = props;

  return (
    <button
      className="flex items-center font-bold outline-none pt-4 pb-4 pl-8 pr-8 rounded-xl bg-gray-200 text-black"
      {...props}
    >
      {text}
      <div className="m-2">
        {icon}
      </div>
    </button>
  );
}
```
这个按钮支持任何的icon，而不仅仅是`back`和`forward`

## 里氏替换
意思就是，你的组件如果扩展了原生组件，那就要继承原生组件的api，比如你封装了一个input输入框，原生input有好多属性，那就应该继承，而且不要改名。

```tsx
import cx from "clsx";
// 继承了原生input的所有属性
interface ISearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isLarge?: boolean;
}

export function SearchInput(props: ISearchInputProps) {
  const { value, onChange, isLarge, ...restProps } = props;

  return (
    <div className="flex w-10/12">
      <div className="relative w-full">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className={cx(
            "block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none",
            isLarge && "text-3xl"
          )}
          placeholder="Search for the right one..."
          required
          value={value}
          onChange={onChange}
          {...restProps}
        />
      </div>
    </div>
  );
}
```

## 接口分离

意思是你的组件中不要定义无意义、无用处的属性，包括嵌套的属性


### 反面案例

```tsx
import { IProduct } from "./product";

interface IThumbnailProps {
  product: IProduct;
}

export function Thumbnail(props: IThumbnailProps) {
  const { product } = props;

  return (
    <img
      className="p-8 rounded-t-lg h-48"
      src={product.imageUrl}
      alt="product image"
    />
  );
}
```

product中有很多属性，但是只用到了`imageUrl`一个，别人用的时候会很奇怪，我要展示一个缩略图，为什么要传一个商品进去。

修改后
```tsx
import { IProduct } from "./product";

interface IThumbnailProps {
  imageUrl: string;
}

export function Thumbnail(props: IThumbnailProps) {
  const { imageUrl } = props;

  return (
    <img
      className="p-8 rounded-t-lg h-48"
      src={imageUrl}
      alt="product image"
    />
  );
}
```

## 依赖倒转
意思就是，你的组件中如果有某些需要主动触发的操作，应该暴露处一个接口。
react基本都是这样得，这个大部分人都会做，比如`Button`的`onClick`，`Form`的`onSubmit`等


文章代码来自[github](https://github.com/ipenywis/react-solid/tree/main/src/principles)