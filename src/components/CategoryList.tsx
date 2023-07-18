import { List, ListItem, Text, useColorMode } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import SideComponentContainer from './SideComponentContainer';

interface CategoryListProps {
  categories: HexoCategoryItem[];
}
const CategoryList: React.FC<CategoryListProps> = (props) => {
  const { categories } = props;
  const { colorMode } = useColorMode();
  return (
    <SideComponentContainer
      h="260px"
    >
      <Text fontWeight="bold" mb="16px">分类</Text>
      <List
        px="16px"
      >
        {
          categories.map((category) => (
            <ListItem
              key={category._id}
              display="flex"
              justifyContent="space-between"
              marginBottom="12px"
              transition="all 0.2s"
              _hover={{
                color: `cute_${colorMode}.primary`,
              }}
            >
              <Link href={`/category/${category.name}`}>
                <Text fontSize={14}>{category.name}</Text>
              </Link>
              <Link href={`/category/${category.name}`}>
                <Text
                  w="16px"
                  h="16px"
                  display="flex"
                  justifyContent="center"
                  alignContent="center"
                  p="2px"
                  fontSize={14}
                  lineHeight={1}
                  borderRadius="4px"
                  bgColor={`cute_${colorMode}.secondary`}
                  color={`cute_${colorMode}.quaternary`}
                >
                  {category.postCount}
                </Text>
              </Link>
            </ListItem>
          ))
        }
      </List>
    </SideComponentContainer>
  )
}

export default CategoryList;
