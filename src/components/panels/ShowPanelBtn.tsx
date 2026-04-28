import React, { FC } from 'react'
import { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'
import { usePanelDispatch } from 'components/panels'
import { Tooltip, Zoom, Fab } from '@mui/material'
import { MdKeyboardArrowRight } from 'react-icons/md'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      zIndex: 1,
      fontSize: '1.5rem',
      [theme.breakpoints.down('md')]: {
        display: 'none', // TODO: think it through
      },
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
          variant="circular"
          classes={{ root: classes.root }}
          onClick={handleClick}
        >
          <MdKeyboardArrowRight />
        </Fab>
      </Tooltip>
    </Zoom>
  )
}
