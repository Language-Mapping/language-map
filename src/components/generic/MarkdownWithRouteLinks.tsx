import React, { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link as RouterLink } from 'react-router-dom'

import { LinkRenderer, MarkdownRootElemType } from './types'

const keepLines = { whiteSpace: 'pre-line' } as { whiteSpace: 'pre-line' } // 🙄

/* eslint-disable react/display-name */
const renderers = (rootElemType: MarkdownRootElemType = 'span') => ({
  // ReactMarkdown ALWAYS ALWAYS ALWAYS WRAPS IN A PARAGRAPH 🤬
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  paragraph: ({ children }) => {
    if (rootElemType === 'p')
      return <p style={{ marginTop: 0, ...keepLines }}>{children}</p>
    if (rootElemType === 'div') return <div style={keepLines}>{children}</div>

    return <span style={keepLines}>{children}</span>
  }, // TODO: UGHHHHHHHHHH
  link: ({ href, node }: LinkRenderer) => (
    // Airtable converts relative links to absolute by adding the protocol 😠
    <RouterLink to={href.replace('http://', '')}>
      {node.children[0].value}
    </RouterLink>
  ),
  document: ({ children }: { children: React.ReactNode }) => (
    <div style={keepLines}>{children}</div>
  ),
})
/* eslint-enable react/display-name */

export const MarkdownWithRouteLinks: FC<{
  text: string
  rootElemType?: MarkdownRootElemType
}> = (props) => {
  const { text, rootElemType } = props
  const renderElems = renderers(rootElemType)

  return <ReactMarkdown renderers={renderElems}>{text}</ReactMarkdown>
}
