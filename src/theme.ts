import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      100: '#F7F6FF',
      200: '#EDE5FF',
      300: '#E0D1FF',
      400: '#C9BFFF',
      500: '#B2A4FF',
      600: '#A18FFF',
      700: '#8F7AFF',
      800: '#7E66FF',
      900: '#6C4FFF',
    },
    'cute_light': {
      primary: '#B2A4FF',
      secondary: '#FFB4B4',
      tertiary: '#FFDEB4',
      quaternary: '#FDF7C3'
    },
    'cute_dark': {
      primary: '#6C4FFF',
      secondary: '#FF6C6C',
      tertiary: '#171923',
      quaternary: '#171923'
    }

  },
  fonts: {
    'sans-serif': `
      -apple-system, BlinkMacSystemFont, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "PingFang SC",
      HarmonyOS_Regular, "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue",
      Helvetica, "Source Han Sans SC", "Noto Sans CJK SC", "WenQuanYi Micro Hei",
      Arial, sans-serif
    `,
   'serif': `STZhongsong, STSong, "Noto Serif CJK", "Noto Serif SC", PMingLiu,
    SimSun, "WenQuanYi Bitmap Song", "Times New Roman", Times, serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
   'mono': `ui-monospace, SFMono-Regular, "SF Mono", "Cascadia Code",
    "Segoe UI Mono", "Source Code Pro", Menlo, Consolas, "Liberation Mono",
    monospace`,
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  body: 'sans-serif',
})

export default theme