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
  { icon: <FiZoomIn />, name: 'Zoom in' },
  { icon: <FiZoomOut />, name: 'Zoom out' },
  { icon: <FiHome />, name: 'Zoom home' },
]

export const MapCtrlBtns: FC = () => {
  const classes = useStyles()
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
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
          }}
          FabProps={{ size }}
        />
      ))}
    </SpeedDial>
  )
}
