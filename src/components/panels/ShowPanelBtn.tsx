import React, { FC } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { usePanelDispatch } from 'components/panels'
import { Tooltip, Zoom, Fab } from '@material-ui/core'
import { MdKeyboardArrowRight } from 'react-icons/md'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      zIndex: 1,
      [theme.breakpoints.down('sm')]: {
        display: 'none', // TODO: think it through
      },
    },
    label: {
      fontSize: '1.5rem',
    },
  })
)

export const ShowPanelBtn: FC<{ panelOpen: boolean }> = (props) => {
  const { panelOpen } = props
  const classes = useStyles()
  const panelDispatch = usePanelDispatch()

  const handleClick = React.useCallback(
    () => panelDispatch({ type: 'TOGGLE_MAIN_PANEL', payload: true }),
    [panelDispatch]
  )

  return (
    <Zoom in={!panelOpen}>
      <Tooltip title="Open panel">
        <Fab
          size="small"
          aria-label="panel open"
          color="secondary"
          variant="round"
          classes={{ root: classes.root, label: classes.label }}
          onClick={handleClick}
        >
          <MdKeyboardArrowRight />
        </Fab>
      </Tooltip>
    </Zoom>
  )
}
