import React, { FC, useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Popover, Typography } from '@material-ui/core'
import { SpeedDial, SpeedDialAction } from '@material-ui/lab'
import { MdYoutubeSearchedFor } from 'react-icons/md'
import { FiLayers } from 'react-icons/fi'
import { FaSearchPlus, FaSearchMinus } from 'react-icons/fa'

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { GeolocToggle } from 'components/map'
import { LayerToggle } from 'components/explore'
import { DialogCloseBtn } from 'components/generic/modals'
import { MapCtrlBtnsProps, CtrlBtnConfig } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      top: -8,
      right: 6,
      zIndex: 1100, // above app bar
      [theme.breakpoints.up('sm')]: {
        top: theme.spacing(1),
        right: theme.spacing(1),
      },
      '& svg': {
        fontSize: '1.4em',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '1.35em',
      },
    },
    speedDialAction: {
      margin: '0 0.2rem 0.2rem',
      [theme.breakpoints.up('sm')]: {
        margin: '0.2em',
      },
      '&:hover': {
        [theme.breakpoints.down('sm')]: {
          backgroundColor: theme.palette.background.default,
        },
      },
    },
    popover: {
      maxWidth: 325,
      padding: '0.75rem',
    },
    popoverHeading: {
      fontSize: '1.25rem',
      marginBottom: '0.5rem',
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
    id: 'reset-pitch',
    icon: <b>3D</b>,
    name: 'Toggle 2D/3D',
  },
] as CtrlBtnConfig[]

export const MapCtrlBtns: FC<MapCtrlBtnsProps> = (props) => {
  const { onMapCtrlClick, isMapTilted } = props
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
  const handleClose = () => setAnchorEl(null)

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'map-menu-popover' : undefined

  const MapMenu = (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      PaperProps={{ className: classes.popover, elevation: 12 }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      transformOrigin={{ vertical: 'center', horizontal: 'left' }}
    >
      <Typography
        component="h6"
        variant="h6"
        className={classes.popoverHeading}
      >
        Map tools
      </Typography>
      <div>
        <LayerToggle layerID="neighborhoods" excludeWrap terse />
      </div>
      <div>
        <LayerToggle layerID="counties" excludeWrap terse />
      </div>
      <GeolocToggle />
      <DialogCloseBtn tooltip="Close map menu" onClose={() => handleClose()} />
    </Popover>
  )

  return (
    <>
      <SpeedDial
        ariaLabel="Map control buttons"
        className={classes.root}
        hidden
        open
        direction="down"
      >
        {ctrlBtnsConfig.map((action) => {
          let { icon } = action
          if (action.id === 'reset-pitch') icon = isMapTilted ? <b>2D</b> : icon

          return (
            <SpeedDialAction
              className={classes.speedDialAction}
              key={action.name}
              icon={icon}
              tooltipTitle={action.name}
              FabProps={{ size: 'small' }}
              onClick={() => {
                onMapCtrlClick(action.id)
              }}
            />
          )
        })}
        <SpeedDialAction
          className={classes.speedDialAction}
          icon={<FiLayers />}
          tooltipTitle="Show map menu"
          FabProps={{ size: 'small' }}
          onClick={handleClick}
        />
      </SpeedDial>
      {MapMenu}
    </>
  )
}
