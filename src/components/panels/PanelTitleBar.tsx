import React, { FC } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import { Breadcrumbs } from 'components/sift'
import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      backgroundColor: theme.palette.primary.dark,
      boxShadow: '0 2px 7px hsla(0, 0%, 0%, 0.25)',
      display: 'flex',
      flexShrink: 0,
      justifyContent: 'space-between',
      padding: '0.15em 0.2em',
      position: 'sticky',
      top: 0,
      zIndex: 1,
    },
  })
)

export const PanelTitleBar: FC<Types.PanelTitleBarProps> = (props) => {
  const { renderCloseBtn } = props
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Breadcrumbs />
      {/* TODO: add maximize btn on mobile */}
      {renderCloseBtn()}
    </div>
  )
}
