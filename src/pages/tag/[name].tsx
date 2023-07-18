import { getCommonServerData, getHexoPostByTagName } from '@/api/hexo';
import ContentContainer from '@/components/ContentContainer';
import PostThump from '@/components/PostThumb';
import { Box, List, Text } from '@chakra-ui/react';
import { NextPage } from 'next'
import Head from 'next/head';


type PostsByTagNameProps = UnPromisify<typeof getServerSideProps>['props'];

const PostsByTagName: NextPage<PostsByTagNameProps> = (props) => {
  const posts = props?.posts
  const commonData = props?.commonData;
  const tagName = props?.tagName;
  if (posts && commonData) {
    return (
      <ContentContainer commonData={commonData}>
        <Head>
          <title>{tagName}</title>
        </Head>
        <Box w="full">
          <Text fontSize="4xl" mb="24px"># {tagName}</Text>
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

export default PostsByTagName

export async function getServerSideProps(ctx: any) {
  const name = ctx.params.name;
  if (!name) return {
    notFound: true,
    props: {}
  }
  const posts = await getHexoPostByTagName(name);
  const commonData = await getCommonServerData();
  return {
    props: {
      posts,
      commonData,
      tagName: name
    }
  }
}