import React, { FC, useCallback } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { InteractiveMap, ViewportProps } from 'react-map-gl'
import Geocoder from 'react-map-gl-geocoder'
import {
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  CloseReason,
} from '@material-ui/lab'
import { MdMoreVert, MdClose } from 'react-icons/md'
import { BiMapPin } from 'react-icons/bi'
import { FiHome, FiZoomIn, FiZoomOut, FiInfo } from 'react-icons/fi'

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { MapControlAction } from './types'
import { MAPBOX_TOKEN } from './config'

type MapCtrlBtnsProps = {
  // Render prop so we don't have pass a million props to this component
  onMapCtrlClick: (actionID: MapControlAction) => void
  isDesktop: boolean
  setViewport: React.Dispatch<ViewportProps>
  mapRef: React.RefObject<InteractiveMap>
}

type CtrlBtnConfig = {
  id: MapControlAction
  icon: React.ReactNode
  name: string
  customFn?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapCtrlsRoot: {
      position: 'absolute',
      top: theme.spacing(1),
      right: 4, // same as left-side page title
      zIndex: 1100, // above app bar
      [theme.breakpoints.up('sm')]: {
        top: theme.spacing(3),
        right: theme.spacing(3),
      },
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
  {
    id: 'loc-search',
    icon: <BiMapPin />,
    name: 'Search by location',
    customFn: true,
  },
  { id: 'info', icon: <FiInfo />, name: 'About & Info' },
] as CtrlBtnConfig[]

export const MapCtrlBtns: FC<MapCtrlBtnsProps> = (props) => {
  const { isDesktop, onMapCtrlClick, mapRef, setViewport } = props
  const classes = useStyles()
  const [speedDialOpen, setSpeedDialOpen] = React.useState(true)
  const [locSearchOpen, setLocSearchOpen] = React.useState<boolean>(false)
  const size = isDesktop ? 'medium' : 'small'
  const geocoderContainerRef = React.useRef<HTMLDivElement>(null)

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

  const handleRootClick = () => {
    setSpeedDialOpen(!speedDialOpen)
  }

  const handleGeocoderViewportChange = useCallback((newViewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 }

    return handleViewportChange({
      ...newViewport,
      ...geocoderDefaultOverrides,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <>
      <div
        ref={geocoderContainerRef}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1,
          display: locSearchOpen ? 'block' : 'none',
        }}
      >
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          containerRef={geocoderContainerRef}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          position="top-left"
        />
      </div>
      <SpeedDial
        ariaLabel="Map control buttons"
        className={classes.mapCtrlsRoot}
        icon={<SpeedDialIcon openIcon={<MdClose />} icon={<MdMoreVert />} />}
        onClose={handleClose}
        open={speedDialOpen}
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

              // GROSS
              if (!action.customFn) {
                onMapCtrlClick(action.id)
              } else {
                setLocSearchOpen(!locSearchOpen)
              }
            }}
            FabProps={{ size }} // TODO: uhhhh breakpoints? Why is this needed?
          />
        ))}
      </SpeedDial>
    </>
  )
}
