import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Link } from '@material-ui/core'
import { GoInfo } from 'react-icons/go'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { Breadcrumbs } from 'components/explore'
import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      backgroundColor: theme.palette.primary.dark,
      boxShadow: '0 2px 7px hsla(0, 0%, 0%, 0.25)',
      display: 'flex',
      fontSize: '0.8rem',
      flexShrink: 0,
      justifyContent: 'space-between',
      padding: '0.5em',
      position: 'sticky',
      top: 0,
      zIndex: 1,
      '& a': {
        whiteSpace: 'nowrap',
        color: 'hsla(0, 100%, 100%, 0.85)',
      },
      '& svg': {
        fontSize: '1.25rem',
      },
    },
    btnsContainer: {
      alignItems: 'center',
      backgroundColor: 'transparent',
      boxShadow: '-15px 0px 7px 0px hsla(168, 41%, 29%, 0.5)',
      display: 'flex',
      color: theme.palette.text.primary,
      position: 'relative',
      '& > a': {
        display: 'flex',
      },
      '& > * + *': {
        marginLeft: '0.45em',
      },
    },
  })
)

export const PanelTitleBar: FC<Types.PanelTitleBarProps> = (props) => {
  const { children, openOffCanvasNav } = props
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Breadcrumbs />
      <div className={classes.btnsContainer}>
        <Link href="#" onClick={openOffCanvasNav} title="About & Info">
          <GoInfo />
        </Link>
        <Link component={RouterLink} to="/help">
          <AiOutlineQuestionCircle />
        </Link>
        {/* TODO: add maximize btn on mobile */}
        {children}
      </div>
    </div>
  )
}
