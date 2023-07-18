import { Box, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, MenuOptionGroupProps, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { Icon, SearchIcon } from '@chakra-ui/icons'
import { BsFillMoonStarsFill, BsFillSunFill, BsFillDisplayFill } from 'react-icons/bs'


import useRyanColor, { RyanColorMode } from '@/hooks/useRyanColor';

interface HeaderProps {

}

const colorModeIcon: Record<RyanColorMode, React.ReactNode> = {
  dark: <Icon as={BsFillMoonStarsFill} />,
  light: <Icon as={BsFillSunFill} />,
  system: <Icon as={BsFillDisplayFill} />,
}

const TextWithIcon: React.FC<{ icon: React.ReactNode; children?: React.ReactNode }> = (props) => {
  const { icon, children } = props;
  return (
    <Box display="flex" alignItems="center">
      {icon}
      <Text ml="4px">{children}</Text>
    </Box>
  )
}

const Header: React.FC<HeaderProps> = (props) => {
  const {swticherValue, colorMode, toggleColorMode} = useRyanColor();
  const handleChange: MenuOptionGroupProps['onChange'] = (v) => {
    toggleColorMode(v as RyanColorMode)
  }
  return (
    <Box
      as="header"
      minH="64px"
      bg={`cute_${colorMode}.tertiary`}
      display="flex"
      alignItems="stretch"
      py="8px"
      px="8px"
      boxSizing='border-box'
    >
      <Box
        position="relative"
        display="flex"
        alignItems="stretch"
        flexDirection="row"
        flexWrap={['wrap', 'wrap', 'wrap', 'wrap', 'nowrap']}
        w={['100%', '100%', '100%', 'container.lg', 'container.xl']}
        maxWidth="100%"
        boxSizing='border-box'
        mx="auto"
        columnGap="48px"
        fontSize="xl"
      >
        <Box
          display="flex"
          alignItems="center"
          width={['100%', '100%', 'auto', 'auto', 'auto']}
          justifyContent="center"
        >
          <Link href="/">
            <Text textAlign="center" fontWeight={'bold'}>Ryan&apos;s Blog</Text>
          </Link>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flex="1"
        >
          <Box
            display="flex"
            gap="24px"
            fontWeight="bold"
            fontFamily="var(--chakra-fonts-serif)"
          >
            <Link href="/">首页</Link>
            {/* <Link href="/tag">标签</Link> */}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            columnGap="16px"
          >
              <Text
                  display="flex" alignItems="center"
                  lineHeight="1"
                >
                  <Link href="/search"><SearchIcon /></Link>
              </Text>

            <Menu>
              <MenuButton>
                <Text
                  display="flex" alignItems="center"
                >
                  {colorModeIcon[swticherValue]}
                </Text>
              </MenuButton>
              <MenuList>
                <MenuOptionGroup type="radio" value={swticherValue} onChange={handleChange}>
                  <MenuItemOption value="system">
                    <TextWithIcon icon={<Icon as={BsFillDisplayFill} />}>跟随系统</TextWithIcon>
                  </MenuItemOption>
                  <MenuItemOption value="light">
                    <TextWithIcon icon={<Icon as={BsFillSunFill} />}>总是浅色</TextWithIcon>
                  </MenuItemOption>
                  <MenuItemOption value="dark">
                    <TextWithIcon icon={<Icon as={BsFillMoonStarsFill} />}>总是深色</TextWithIcon>
                  </MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Box>

    </Box>
  )
}

export default Header;
