import React, { FC } from 'react'
import {
  makeStyles,
  createStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles'
import { Fab, Slide, useMediaQuery } from '@material-ui/core'
import {
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  CloseReason,
} from '@material-ui/lab'
import { MdMoreVert, MdClose, MdYoutubeSearchedFor } from 'react-icons/md'
import { TiCompass } from 'react-icons/ti'
import { GoInfo } from 'react-icons/go'
import { FaSearchPlus, FaSearchMinus, FaSearchLocation } from 'react-icons/fa'

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { MapCtrlBtnsProps, CtrlBtnConfig } from './types'
import { GeocoderPopout } from './GeocoderPopout'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapCtrlsRoot: {
      position: 'fixed',
      top: theme.spacing(1),
      right: 8, // same as left-side page title?
      zIndex: 1100, // above app bar
      [theme.breakpoints.up('sm')]: {
        top: theme.spacing(2),
        right: theme.spacing(2),
      },
      '& svg': {
        fontSize: '1.4em',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '1.35em',
      },
    },
    speedDialAction: {
      margin: '0.2em',
      '&:hover': {
        [theme.breakpoints.down('sm')]: {
          backgroundColor: theme.palette.background.default,
        },
      },
    },
    resetPitchBtn: {
      position: 'absolute',
      bottom: 24,
      left: -4,
      fontSize: '0.85em',
      textTransform: 'none',
      [theme.breakpoints.up('sm')]: {
        right: 0,
        bottom: 16,
        left: 'auto',
      },
      '& svg': {
        fontSize: '1.5em',
        marginRight: '0.1em',
      },
    },
  })
)

const ctrlBtnsConfig = [
  {
    id: 'in',
    icon: <FaSearchPlus />,
    name: 'Zoom in',
  },
  {
    id: 'out',
    icon: <FaSearchMinus />,
    name: 'Zoom out',
  },
  {
    id: 'home',
    icon: <MdYoutubeSearchedFor style={{ fontSize: '1.75em' }} />,
    name: 'Reset zoom',
  },
  {
    id: 'loc-search',
    icon: <FaSearchLocation />,
    name: 'Search by location',
    customFn: true,
  },
  {
    id: 'info',
    icon: <GoInfo style={{ fontSize: '1.55em' }} />,
    name: 'About & Info',
  },
] as CtrlBtnConfig[]

export const MapCtrlBtns: FC<MapCtrlBtnsProps> = (props) => {
  const { onMapCtrlClick, mapRef, viewport, setViewport } = props
  const classes = useStyles()
  const [speedDialOpen, setSpeedDialOpen] = React.useState(true)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const theme = useTheme()
  const lilGuy = useMediaQuery(theme.breakpoints.only('xs'))

  const handleSpeedDialRootClick = () => setSpeedDialOpen(!speedDialOpen)

  const handleClose = (
    e: React.SyntheticEvent<Record<string, unknown>, Event>,
    reason: CloseReason
  ) => {
    if (reason === 'mouseLeave' || reason === 'blur') {
      // Prevent closing the menu
      e.preventDefault()

      return
    }

    setSpeedDialOpen(false)
  }

  return (
    <>
      <GeocoderPopout
        {...{
          anchorEl,
          setAnchorEl,
          mapRef,
        }}
      />
      <SpeedDial
        ariaLabel="Map control buttons"
        className={classes.mapCtrlsRoot}
        icon={<SpeedDialIcon openIcon={<MdClose />} icon={<MdMoreVert />} />}
        onClose={handleClose}
        open={speedDialOpen}
        direction="down"
        FabProps={{ size: 'small' }}
        onClick={handleSpeedDialRootClick}
      >
        {ctrlBtnsConfig.map((action) => (
          <SpeedDialAction
            className={classes.speedDialAction}
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            FabProps={{ size: 'small' }}
            onClick={(e) => {
              e.stopPropagation() // prevent closing the menu

              // GROSS
              if (!action.customFn) {
                onMapCtrlClick(action.id)
              } else {
                setAnchorEl(e.currentTarget)
              }
            }}
          />
        ))}
      </SpeedDial>
      <Slide in={viewport.pitch !== 0} direction={lilGuy ? 'right' : 'left'}>
        <Fab
          className={`${classes.resetPitchBtn} MuiSpeedDialAction-fab`}
          variant="extended"
          size="small"
          onClick={() => setViewport({ ...viewport, pitch: 0 })}
        >
          <TiCompass />
          Reset
        </Fab>
      </Slide>
    </>
  )
}
