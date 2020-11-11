import React, { FC } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { SpeedDial, SpeedDialAction } from '@material-ui/lab'
import { MdYoutubeSearchedFor } from 'react-icons/md'
import { TiCompass } from 'react-icons/ti'
import { FaSearchPlus, FaSearchMinus, FaSearchLocation } from 'react-icons/fa'

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { MapCtrlBtnsProps, CtrlBtnConfig } from './types'
import { GeocoderPopout } from './GeocoderPopout'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapCtrlsRoot: {
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
    id: 'reset-pitch',
    icon: <TiCompass />,
    name: 'Reset pitch',
    disabledOnProp: 'isPitchZero',
  },
] as CtrlBtnConfig[]

export const MapCtrlBtns: FC<MapCtrlBtnsProps> = (props) => {
  const { onMapCtrlClick } = props
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  return (
    <>
      <GeocoderPopout {...{ ...props, anchorEl, setAnchorEl }} />
      <SpeedDial
        ariaLabel="Map control buttons"
        className={classes.mapCtrlsRoot}
        hidden
        open
        direction="down"
      >
        {ctrlBtnsConfig.map((action) => (
          <SpeedDialAction
            className={classes.speedDialAction}
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            FabProps={{
              size: 'small',
              disabled:
                action.disabledOnProp !== undefined &&
                props[action.disabledOnProp] === true,
            }}
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
    </>
  )
}
