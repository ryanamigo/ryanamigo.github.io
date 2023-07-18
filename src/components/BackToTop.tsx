import { TriangleUpIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import React from 'react';

interface BackToTopProps {

}
const BackToTop: React.FC<BackToTopProps> = (props) => {
  const [visible, setVisible] = React.useState<'hidden' | 'visible'>('hidden');
  const toTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  const setScrollListener = () => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible('visible')
      } else {
        setVisible('hidden')
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }
  React.useEffect(() => {
    setScrollListener();
  }, [])
  return (
    <Button
      position="fixed"
      bottom="24px"
      right="24px"
      cursor="pointer"
      onClick={toTop}
      padding="16px"
      shadow="lg"
      borderRadius="8px"
      colorScheme='brand'
      visibility={visible}
    >
      <TriangleUpIcon />
    </Button>
  )
}

export default BackToTop;
