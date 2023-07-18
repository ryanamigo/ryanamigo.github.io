import { getCommonServerData, getHexoPostByCategoryName } from '@/api/hexo';
import ContentContainer from '@/components/ContentContainer';
import PostThump from '@/components/PostThumb';
import { Box, List, Text } from '@chakra-ui/react';
import { NextPage } from 'next'
import Head from 'next/head';


type PostsByCategoryNameProps = UnPromisify<typeof getServerSideProps>['props'];

const PostsByCategoryName: NextPage<PostsByCategoryNameProps> = (props) => {
  const posts = props?.posts
  const commonData = props?.commonData;
  const categoryName = props?.categoryName;
  if (posts && commonData) {
    return (
      <ContentContainer commonData={commonData}>
        <Head>
          <title>{categoryName}</title>
        </Head>
        <Box w="full">
          <Text fontSize="4xl" mb="24px">- {categoryName}</Text>
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

export default PostsByCategoryName

export async function getServerSideProps(ctx: any) {
  const name = ctx.params.name;
  if (!name) return {
    notFound: true,
    props: {}
  }
  const posts = await getHexoPostByCategoryName(name);
  const commonData = await getCommonServerData();
  return {
    props: {
      posts,
      commonData,
      categoryName: name
    }
  }
}