import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { IconButton, Tooltip } from '@material-ui/core'
import { CgClose } from 'react-icons/cg'

import { usePanelDispatch } from 'components/panels'

// CRED: for hard stop gradient shorthand https://bit.ly/2OEogv5
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    stickyBtn: {
      height: 0,
      marginRight: 12,
      position: 'sticky',
      textAlign: 'right',
      top: 0,
      zIndex: 1,
    },
    btnContainer: {
      alignItems: 'center',
      display: 'inline-flex',
      height: '1.25rem',
      justifyContent: 'center',
      marginTop: 8,
      width: '1.25rem',
    },
  })
)

export const PanelCloseBtn: FC = () => {
  const panelDispatch = usePanelDispatch()

  return (
    <Tooltip title="Close panel">
      <IconButton
        size="small"
        aria-label="panel close"
        color="inherit"
        onClick={() => panelDispatch({ type: 'TOGGLE_MAIN_PANEL' })}
      >
        <CgClose />
      </IconButton>
    </Tooltip>
  )
}

export const PanelCloseBtnSticky: FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.stickyBtn}>
      <div className={classes.btnContainer}>
        <PanelCloseBtn />
      </div>
    </div>
  )
}
