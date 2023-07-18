import { Box, BoxProps, useColorMode } from '@chakra-ui/react';
import React from 'react';

interface SideComponentContainerProps extends BoxProps {
}
const SideComponentContainer: React.FC<SideComponentContainerProps> = (props) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      bg={`cute_${colorMode}.quaternary`}
      borderRadius="8px"
      padding="16px"
      {...props}
    />
  )
}

export default SideComponentContainer;
