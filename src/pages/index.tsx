import { getCommonServerData, getHexoPostsPagination } from '@/api/hexo';
import ContentContainer from '@/components/ContentContainer';
import Paginator from '@/components/Paginator';
import PostThump from '@/components/PostThumb';
import { Box, List } from '@chakra-ui/react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

type HomeProps = UnPromisify<typeof getServerSideProps>['props'];

const Home: NextPage<HomeProps> = (props) => {
  const { paginationData, commonData } = props;
  const router = useRouter()
  const handlePageChange = (pageNumber: number) => {
    router.push(`/?page=${pageNumber}`)
  }
  return (
    <ContentContainer
      commonData={commonData}
    >
      <Head>
        <title>首页 | Ryan&apos;s Blog </title>
      </Head>
      <List>
        {
          paginationData.posts.map((postItem) => (
            <PostThump postItem={postItem} key={postItem.id} />
          ))
        }
      </List>
      <Box
        w="full"
        display="flex"
        justifyContent="center"
        pb={['24px', '24px', '24px', '24px', '0px']}
      >
        <Paginator
          currentPage={paginationData.page}
          totalPages={paginationData.totalPage}
          onPageChange={handlePageChange}
        />
      </Box>
    </ContentContainer>
  )
}

export default Home;

export const getServerSideProps = async (ctx: any) => {
  const page = Number(ctx.query.page) || 1;
  const paginationData = await getHexoPostsPagination({
    page,
    pageSize: 5
  });
  const commonData = await getCommonServerData();

  return {
    props: {
      paginationData,
      commonData
    }
  }
}

