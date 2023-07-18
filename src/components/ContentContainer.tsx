import { getCommonServerData } from '@/api/hexo';
import { Box } from '@chakra-ui/react';
import React from 'react';
import TagList from './TagList';
import CategoryList from './CategoryList';

interface ContentContainerProps {
  children: React.ReactNode;
  commonData: UnPromisify<typeof getCommonServerData>;
  right?: React.ReactNode;
}
const ContentContainer: React.FC<ContentContainerProps> = (props) => {
  const { children, commonData, right } = props;
  return (
    <Box
      position="relative"
      display="flex"
      alignItems="stretch"
      h="fit-content"
      flexDirection="row"
      flexWrap={ ['wrap', 'wrap', 'wrap', 'wrap', 'nowrap'] }
      w={ ['100%', '100%', '100%', 'container.lg', 'container.xl'] }
      maxWidth="100%"
      boxSizing='border-box'
      mx="auto"
      columnGap={ 4 }
      py="24px"
      px="8px"
    >
      {/* middle start */ }
      <Box
        order={ 2 }
        flex={ 1 }
        width={0}
        minWidth={0}
      >
        { children }
      </Box>
      {/* middle end */ }

      {/* left start */ }
      <Box
        order={ [3, 3, 1, 1, 1] }
        flexBasis={ ['100%', '100%', '280', '280', '280'] }
        flexGrow={ 0 }
        flexShrink={ 0 }
        display="flex"
        pos="relative"
      >
        <Box
          pos="sticky"
          top={0}
          w="100%"
          h={['auto', 'auto', 'auto', '100vh', '100vh']}
          display="flex"
          flexDirection="column"
          rowGap="16px"
        >
          <TagList tags={commonData.tags} />
          <CategoryList categories={commonData.categories} />
        </Box>
      </Box>
      {/* left end */ }

      {/* right start */ }
      <Box
        order={ 3 }
        flex="280px 0 0"
        display={ ['none', 'none', 'none', 'none', 'flex'] }
      >
        <Box
          pos="sticky"
          top={0}
          w="100%"
          h={['auto', 'auto', 'auto', '100vh', '100vh']}
          display="flex"
          flexDirection="column"
          rowGap="16px"
        >
          {right}
        </Box>
      </Box>
      {/* right end */ }
    </Box>
  )
}

export default ContentContainer;
