import { Box, Tag, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import SideComponentContainer from './SideComponentContainer';

interface TagListProps {
  tags: string[];
}
const TagList: React.FC<TagListProps> = (props) => {
  const { tags } = props;
  
  return (
    <SideComponentContainer
      h="260px"
    >
      <Text fontWeight="bold" mb="16px">标签</Text>
      <Box
        display="flex"
        gap={3}
        flexWrap="wrap"
        alignItems="flex-start"
      >
        {
          tags.map((tag) => (
            <Link key={tag} href={`/tag/${tag}`}>
              <Tag cursor="pointer" colorScheme='pink' size="md">{tag}</Tag>
            </Link>
          ))
        }
      </Box>
    </SideComponentContainer>
  )
}

export default TagList;
