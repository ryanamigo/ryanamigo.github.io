import { Box } from '@chakra-ui/react';
import React from 'react';
import { keyframes } from "@emotion/react";

interface TopLoadingProps {

}

const topLoadingAnimation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`
const TopLoading: React.FC<TopLoadingProps> = (props) => {

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="4px"
      bg="#f0f0f0"
      overflow="hidden"
      zIndex="9999"
      id="top-loading"
    >
      <Box
        w="full"
        h="full"
        bg="brand.500"
        animation={`${topLoadingAnimation} 2s linear infinite`}
      >

      </Box>
    </Box>
  )
}

export function useTopLoading() {
  if (typeof window === 'undefined') {
    return {
      start: () => {},
      end: () => {},
    }
  }
  const topLoading = document.getElementById('top-loading');
  return {
    start: () => {
      topLoading?.style.setProperty('display', 'block');
    },
    end: () => {
      topLoading?.style.setProperty('display', 'none');
    }
  }
}

export default TopLoading;
