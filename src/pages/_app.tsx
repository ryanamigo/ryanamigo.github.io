import GlobalLayout from '@/layouts/global';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { AppProps } from 'next/app';
import theme from '@/theme';
import './github-markdown.css';
import './override.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <GlobalLayout>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} /> {/* 添加 ColorModeScript */}
        <Component {...pageProps} />
      </GlobalLayout>
    </ChakraProvider>
  )
}

export default MyApp;