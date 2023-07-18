import { Box, ListItem, Text, useColorMode } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import VisibleControll from './VisibleControll';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface PostThumpProps {
  postItem: HexoPost
}
const PostThump: React.FC<PostThumpProps> = (props) => {
  const { postItem } = props;
  const { colorMode } = useColorMode();
  const router = useRouter();

  const handleClickCover = () => {
    if (postItem.cover) {
      router.push(`/post/${postItem.slug}`)
    }
  }
  return (
    <ListItem
      key={ postItem.id }
      bgColor={`cute_${colorMode}.quaternary`}
      mb="24px"
      borderRadius="8px"
      pb="8px"
    >
      <VisibleControll visible={ !!postItem.cover }>
        <Box
          w="100%"
          paddingTop={ ['30%', '30%', '35%'] }
          position="relative"
          cursor="pointer"
          className='post-cover'
        >
          <Box
            display="block"
            w="100%"
            h="100%"
            onClick={handleClickCover}
          >
            <Image style={ { objectFit: 'cover', objectPosition: 'center' } } fill src={ postItem.cover || '' } alt={ postItem.title } />
          </Box>
        </Box>
      </VisibleControll>
      <Box
        px={ 4 }
        py={ 2 }
        display="flex"
        flexDirection="column"
        rowGap="4px"
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          transition={ 'all .2s ease-in-out' }
          cursor="pointer"
          _hover={ {
            color: `cute_${colorMode}.primary`
          } }
        >
          <Link href={`/post/${postItem.slug}`}>
            { postItem.title }
          </Link>
        </Text>
        <VisibleControll visible={ !!postItem.excerpt }>
          <Box fontSize="md" opacity={ 0.9 } dangerouslySetInnerHTML={ { __html: postItem.excerpt || '' } } />
        </VisibleControll>

        <Box
          display="flex"
          justifyContent="space-between"
        >
          <Text>
            { postItem.date }
            <Box as='span' mx="8px">&#x2022;</Box>
            <Link
              href={`/category/${postItem.category}`}
            >
              { postItem.category }
            </Link>
          </Text>

          <Link color={`cute_${colorMode}.primary`} href={`/post/${postItem.slug}`}>
            阅读
          </Link>
        </Box>
      </Box>
    </ListItem>
  )
}

export default PostThump;
