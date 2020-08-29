import React, { FC } from 'react'
import { Link as RouteLink } from 'react-router-dom'
import { Typography } from '@material-ui/core'

import { PAGE_HEADER_ID } from './config'
import { useStyles } from './styles'

export const TopBar: FC = () => {
  const classes = useStyles()
  const {
    spacerDesktop,
    spacerLeft,
    spacerRight,
    subtitle,
    title,
    titleMain,
    topBarRoot,
  } = classes

  // Need the `id` in order to find unique element for `map.setPadding`
  return (
    <header className={topBarRoot} id={PAGE_HEADER_ID}>
      <div className={`${spacerDesktop} ${spacerLeft}`} />
      <Typography variant="h2" component="h1" className={title}>
        <RouteLink to="/">
          <span className={titleMain}>Languages</span>
          <span className={subtitle}>of New York City</span>
        </RouteLink>
      </Typography>
      <div className={`${spacerDesktop} ${spacerRight}`} />
    </header>
  )
}
