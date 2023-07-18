/* eslint-disable react/no-children-prop */
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism'
import { coldarkDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import PreviewableImg from './PreviewableImg';

interface MarkDownProps{
  children: string;
}

const MarkDown: React.FC<MarkDownProps> = (props) => {
  const {children} = props;
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkFrontmatter]}
      className='markdown-body'
      transformLinkUri={(uri) => uri}
      transformImageUri={(uri) => uri}
      linkTarget={'_blank'}
      components={{
        code({node, inline, className, children, ...props}) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              children={String(children).replace(/\n$/, '')}
              style={coldarkDark}
              language={match[1]}
              PreTag="div"
            />
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          )
        },
        img({src, node, className, children, ...props}) {
          return (
            <PreviewableImg src={src} />
          )
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

export default MarkDown

