'use client'

/**
 * Markdown Renderer Component
 * Single Responsibility: Markdown 렌더링만 담당
 * Type: Client Component (ReactMarkdown은 client에서만 동작)
 */

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Helper function to generate heading IDs
  const generateHeadingId = (children: any, index: number) => {
    const text = String(children).toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-')
    return `heading-${index}-${text}`
  }

  // Count headings for ID generation
  let h1Count = 0, h2Count = 0, h3Count = 0

  return (
    <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-white prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-h6:text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => {
            const id = generateHeadingId(children, h1Count++)
            return <h1 id={id} className="text-3xl font-bold mb-4 mt-8 text-gray-900 scroll-mt-24">{children}</h1>
          },
          h2: ({ children }) => {
            const id = generateHeadingId(children, h2Count++)
            return <h2 id={id} className="text-2xl font-bold mb-3 mt-6 text-gray-800 scroll-mt-24">{children}</h2>
          },
          h3: ({ children }) => {
            const id = generateHeadingId(children, h3Count++)
            return <h3 id={id} className="text-xl font-bold mb-2 mt-4 text-gray-800 scroll-mt-24">{children}</h3>
          },
          h4: ({ children }) => <h4 className="text-lg font-bold mb-2 text-gray-700">{children}</h4>,
          h5: ({ children }) => <h5 className="text-base font-bold mb-1 text-gray-700">{children}</h5>,
          h6: ({ children }) => <h6 className="text-sm font-bold mb-1 text-gray-600">{children}</h6>,
          p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
          del: ({ children }) => <del className="line-through text-gray-500">{children}</del>,
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
                className="my-4"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-purple-50 text-purple-600 px-1 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            )
          },
          ul: ({ children, ...props }) => {
            const hasCheckbox = String(children).includes('type="checkbox"');
            return (
              <ul className={hasCheckbox ? "mb-4 space-y-2" : "list-disc list-inside mb-4 space-y-2 ml-4"} {...props}>
                {children}
              </ul>
            );
          },
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2 ml-4">{children}</ol>,
          li: ({ children, ...props }) => {
            const content = String(children);
            if (content.includes('type="checkbox"')) {
              return <li className="flex items-center space-x-2 text-gray-700" {...props}>{children}</li>;
            }
            return <li className="text-gray-700" {...props}>{children}</li>;
          },
          input: ({ type, checked, ...props }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-2 accent-purple-600"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
          blockquote: ({ children }) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-600 my-4">{children}</blockquote>,
          strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
          em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
          hr: () => <hr className="border-gray-300 my-6" />,
          table: ({ children }) => <table className="w-full border-collapse border border-gray-300 my-4">{children}</table>,
          thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border border-gray-300">{children}</tr>,
          th: ({ children }) => <th className="border border-gray-300 px-4 py-2 text-left font-semibold">{children}</th>,
          td: ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="max-w-full h-auto rounded-lg shadow-sm my-4"
              loading="lazy"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
