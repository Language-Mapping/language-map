import React, { FC } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import {
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  CloseReason,
} from '@material-ui/lab'
import { MdMoreVert, MdClose } from 'react-icons/md'
import { FiHome, FiZoomIn, FiZoomOut } from 'react-icons/fi'

import { MapControlAction } from './types'
import { MID_BREAKPOINT } from './config'

type MapCtrlBtnsComponent = {
  // Render prop so we don't have pass a million props to this component
  onMapCtrlClick: (actionID: MapControlAction) => void
}

type CtrlBtnConfig = {
  id: MapControlAction
  icon: React.ReactNode
  name: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapCtrlsRoot: {
      position: 'absolute',
      top: 60,
      right: theme.spacing(1),
      '& svg': {
        height: '1.5em',
        width: '1.5em',
      },
    },
    speedDialAction: {
      margin: 4,
      '&:hover': {
        [theme.breakpoints.down('sm')]: {
          backgroundColor: theme.palette.background.default,
        },
      },
    },
  })
)

const ctrlBtnsConfig = [
  { id: 'in', icon: <FiZoomIn />, name: 'Zoom in' },
  { id: 'out', icon: <FiZoomOut />, name: 'Zoom out' },
  { id: 'home', icon: <FiHome />, name: 'Zoom home' },
] as CtrlBtnConfig[]

export const MapCtrlBtns: FC<MapCtrlBtnsComponent> = ({ onMapCtrlClick }) => {
  const classes = useStyles()
  // TODO: pass this down from higher up
  const isDesktop = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up(MID_BREAKPOINT)
  )
  const [open, setOpen] = React.useState(true)
  const size = isDesktop ? 'medium' : 'small'

  const handleClose = (
    e: React.SyntheticEvent<Record<string, unknown>, Event>,
    reason: CloseReason
  ) => {
    if (reason === 'mouseLeave' || reason === 'blur') {
      // Prevent closing the menu
      e.preventDefault()

      return
    }

    setOpen(false)
  }

  const handleRootClick = () => {
    setOpen(!open)
  }

  return (
    <SpeedDial
      ariaLabel="Map control buttons"
      className={classes.mapCtrlsRoot}
      icon={<SpeedDialIcon openIcon={<MdClose />} icon={<MdMoreVert />} />}
      onClose={handleClose}
      open={open}
      direction="down"
      FabProps={{ size }}
      onClick={handleRootClick}
    >
      {ctrlBtnsConfig.map((action) => (
        <SpeedDialAction
          className={classes.speedDialAction}
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={(e) => {
            e.stopPropagation() // prevent closing the menu
            onMapCtrlClick(action.id)
          }}
          FabProps={{ size }}
        />
      ))}
    </SpeedDial>
  )
}
