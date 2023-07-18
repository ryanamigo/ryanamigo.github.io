import { Box, Text, useColorMode } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

const startYear = 2023;
const year = new Date().getFullYear();

const yearText = year === startYear ? year : `${startYear} - ${year}`;
const Footer: React.FC = () => {
  const { colorMode } = useColorMode();

  return (
    <Box
      as='footer'
      minH="128px"
      bg={`cute_${colorMode}.tertiary`}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap={['wrap', 'wrap', 'wrap', 'wrap', 'nowrap']}
        w={['100%', '100%', '100%', 'container.lg', 'container.xl']}
        rowGap="8px"
      >
        <Text w="full" align="center">
          &copy; {yearText} Ryan
        </Text>
        <Box w="full" textAlign="center">
          <Box as='span' mx="8px">Powered by</Box>
          <Box color={`cute_${colorMode}.primary`}>
            <Link href="https://hexo.io/" rel="noreferrer">hexo</Link>
            <Box as='span' mx="8px">&#x2022;</Box>
            <Link href="https://nextjs.org/" rel="noreferrer">
              Next.js
            </Link>
          </Box>
        </Box>
        <Box w="full" textAlign="center">
          <Box as='span' mx="8px">Styled</Box>
          <Box color={`cute_${colorMode}.primary`}>
            <Link href="https://chakra-ui.com/" target="_blank" rel="noreferrer">chakra-ui</Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Footer;
