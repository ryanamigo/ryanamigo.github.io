import { getCommonServerData } from '@/api/hexo';
import ContentContainer from '@/components/ContentContainer';
import { Box, Input, InputProps } from '@chakra-ui/react';
import { NextPage } from 'next'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';


type PostsByTagNameProps = UnPromisify<typeof getServerSideProps>['props'];

const PostsByTagName: NextPage<PostsByTagNameProps> = (props) => {
  const commonData = props?.commonData;
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();
  // 页面加载时，自动聚焦搜索框
  useEffect(() => {
    inputRef?.current?.focus();
  }, [])

  const handleKeyUp: InputProps['onKeyUp'] = (e) => {
    // 按下回车键
    if (e.key === 'Enter') {
      if (inputValue) {
        router.push(`/search/${inputValue}`)
      }
    }
  }

  const handleInputChange: InputProps['onChange'] = (e) => {
    setInputValue(e.target.value);
  }
  if (commonData) {
    return (
      <ContentContainer
        commonData={commonData}
      >
        <Head>
          <title>搜索</title>
        </Head>
        <Box w="full">
          <Input
            mb="24px"
            ref={inputRef}
            onKeyUp={handleKeyUp}
            value={inputValue}
            onChange={handleInputChange}
            placeholder='搜索'
          />
        </Box>
      </ContentContainer>
    )
  }
}

export default PostsByTagName

export async function getServerSideProps(ctx: any) {
  const commonData = await getCommonServerData();
  return {
    props: {
      commonData,
    }
  }
}