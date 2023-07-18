import { Box, BoxProps, Fade, Image } from '@chakra-ui/react';
import React from 'react';

interface PreviewableImgProps {
  src?: string;
  alt?: string;
}
const PreviewableImg: React.FC<PreviewableImgProps> = (props) => {
  const { src, alt } = props;
  const [isPreview, setIsPreview] = React.useState(false);

  const wrapProps = React.useMemo(() => {
    if (isPreview) {
      return {
        position: `fixed`,
        width: ['100vw', '100vw', '100vw', '80vw', '80vw'],
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        cursor: 'zoom-out',
        animation: 'fadein 0.5s',
      } as BoxProps
    }
    return {
      position: `relative`,
      width: 'fit-content',
      cursor: 'zoom-in',
    } as BoxProps
  }, [isPreview])

  const handleClickImage = () => {
    setIsPreview(!isPreview)
  }
  return (
    <Box
      as={`span`}
      textAlign={`center`}
      display={`inline-block`}
      {...wrapProps}
    >
      <Image mx={`auto`} objectFit={`cover`} objectPosition={`center`} src={src} alt={alt} onClick={handleClickImage} />
    </Box>
  )
}

export default PreviewableImg;
