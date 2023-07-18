import { getCommonServerData, getHexoPostByKeyWord } from '@/api/hexo';
import ContentContainer from '@/components/ContentContainer';
import PostThump from '@/components/PostThumb';
import { Box, List, Text } from '@chakra-ui/react';
import { NextPage } from 'next'
import Head from 'next/head';


type PostsByKeyWordProps = UnPromisify<typeof getServerSideProps>['props'];

const PostsByKeyWord: NextPage<PostsByKeyWordProps> = (props) => {
  const posts = props?.posts
  const commonData = props?.commonData;
  const keyWord = props?.keyword;
  if (posts && commonData) {
    return (
      <ContentContainer commonData={commonData}>
        <Head>
          <title>{keyWord}</title>
        </Head>
        <Box w="full">
          <Text fontSize="4xl" mb="24px">搜索：{keyWord}</Text>
          <List>
            {
              posts.map((postItem) => (
                <PostThump postItem={postItem} key={postItem.id} />
              ))
            }
          </List>
        </Box>
      </ContentContainer>
    )
  }
}

export default PostsByKeyWord

export async function getServerSideProps(ctx: any) {
  const keyword = ctx.params.keyword;
  const posts = await getHexoPostByKeyWord(keyword);
  const commonData = await getCommonServerData();
  return {
    props: {
      posts,
      commonData,
      keyword
    }
  }
}