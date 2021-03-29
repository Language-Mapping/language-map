import React, { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link as RouterLink } from 'react-router-dom'

import { LinkRenderer } from './types'

/* eslint-disable react/display-name */
const renderers = {
  // ReactMarkdown ALWAYS ALWAYS ALWAYS WRAPS IN A PARAGRAPH 🤬
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  paragraph: ({ children }) => <span>{children}</span>, // TODO: UGHHHHHHHHHH
  link: ({ href, node }: LinkRenderer) => (
    // Airtable converts relative links to absolute by adding the protocol 😠
    <RouterLink to={href.replace('http://', '')}>
      {node.children[0].value}
    </RouterLink>
  ),
}
/* eslint-enable react/display-name */

export const MarkdownWithRouteLinks: FC<{ text: string }> = (props) => {
  const { text } = props

  return <ReactMarkdown renderers={renderers}>{text}</ReactMarkdown>
}
