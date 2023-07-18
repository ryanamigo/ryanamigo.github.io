import { getCommonServerData, getHexoPostDetail } from '@/api/hexo';
import ContentContainer from '@/components/ContentContainer';
import MarkDown from '@/components/MarkDown';
import SideComponentContainer from '@/components/SideComponentContainer';
import { Box, Img, Text } from '@chakra-ui/react';
import MarkdownNavbar from 'markdown-navbar';
import 'markdown-navbar/dist/navbar.css';
import { NextPage } from 'next'
import Head from 'next/head';


type PostDetailProps = UnPromisify<typeof getServerSideProps>['props'];

const PostDetail: NextPage<PostDetailProps> = (props) => {
  const postDetail = props?.postDetail || { title: '', content: '', cover: '', raw: ''}
  const commonData = props?.commonData;
  const { title, cover, raw  } = postDetail
  if (postDetail && commonData) {
    return (
      <ContentContainer 
        commonData={commonData}
        right={
          <SideComponentContainer>
            <MarkdownNavbar
              source={raw}
              headingTopOffset={64}
              declarative
              ordered={false}
            />
          </SideComponentContainer>
        }
      >
        <Head>
          <title>{title}</title>
        </Head>
        <Box w="full" mb="24px">
          <Img src={cover} />
          <Text as="h1" fontSize="3xl" my="16px" fontWeight="bold">{title}</Text>
          <MarkDown>
            {raw}
          </MarkDown>
        </Box>
      </ContentContainer>
    )
  }
  return <></>
}

export default PostDetail

export async function getServerSideProps(ctx: any) {
  const slug = ctx.params.slug;
  if (!slug) return {
    notFound: true,
    props: {}
  }
  const postDetail = await getHexoPostDetail(slug);
  const commonData = await getCommonServerData();
  if (!postDetail) return {
    notFound: true,
    props: {}
  }
  return {
    props: {
      postDetail,
      commonData
    }
  }
}