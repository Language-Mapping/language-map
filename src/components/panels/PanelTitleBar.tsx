import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Link } from '@material-ui/core'
import { GoInfo } from 'react-icons/go'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { Breadcrumbs } from 'components/explore'
import { PanelTitleBarProps } from './types'
import { MOBILE_PANEL_HEADER_HT } from './config'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      backgroundColor: theme.palette.primary.dark,
      borderTopLeftRadius: 4, // same as bottom left/right in nav bar
      borderTopRightRadius: 4, // same as bottom left/right in nav bar
      boxShadow: '0 2px 7px hsla(0, 0%, 0%, 0.25)',
      display: 'flex',
      fontSize: '0.8rem',
      height: MOBILE_PANEL_HEADER_HT,
      justifyContent: 'space-between',
      padding: '0.5em',
      position: 'absolute',
      top: 0,
      width: '100%',
      '& a': {
        color: theme.palette.text.primary,
        textDecoration: 'underline',
        textDecorationColor: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
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

export const PanelTitleBar: FC<PanelTitleBarProps> = (props) => {
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
        {/* WISHLIST: add maximize btn on mobile */}
        {children}
      </div>
    </div>
  )
}
