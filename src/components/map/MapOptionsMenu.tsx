import React, { FC } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Popover, Typography } from '@material-ui/core'

import { DialogCloseBtn } from 'components/generic/modals'
import { useMapToolsState, useMapToolsDispatch } from 'components/context'
import { ToggleWithHelper, useUItext } from 'components/generic'
import { BaseLayerToggles } from './BaseLayerToggles'

type MapOptionsMenuProps = {
  anchorEl: HTMLDivElement | null
  setAnchorEl: React.Dispatch<HTMLDivElement | null>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      maxWidth: 350,
      padding: '0.75rem',
    },
    popoverHeading: {
      fontSize: '1.5rem',
      marginBottom: '0.75rem',
    },
  })
)

type UseHelperTextReturn = {
  neighbsHelp: string
  countiesHelp: string
  geolocHelp: string
}

const useHelperText = (): UseHelperTextReturn => {
  const { text: neighbsHelp } = useUItext('map-menu-neighbs')
  const { text: countiesHelp } = useUItext('map-menu-counties')
  const { text: geolocHelp } = useUItext('map-menu-geoloc')

  return { neighbsHelp, countiesHelp, geolocHelp }
}

export const MapOptionsMenu: FC<MapOptionsMenuProps> = (props) => {
  const { anchorEl, setAnchorEl } = props
  const classes = useStyles()
  const { showCounties, showNeighbs, geolocActive } = useMapToolsState()
  const mapToolsDispatch = useMapToolsDispatch()
  const { neighbsHelp, countiesHelp, geolocHelp } = useHelperText()

  const open = Boolean(anchorEl)
  const id = open ? 'map-menu-popover' : undefined
  const handleClose = () => setAnchorEl(null)

  const toggleNeighbs = () => {
    mapToolsDispatch({ type: 'TOGGLE_NEIGHBORHOODS_LAYER' })
  }

  const toggleCounties = () => {
    mapToolsDispatch({ type: 'TOGGLE_COUNTIES_LAYER' })
  }

  const toggleGeoLoc = () => {
    mapToolsDispatch({ type: 'SET_GEOLOC_ACTIVE' })
  }

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      PaperProps={{ className: classes.paper, elevation: 24 }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      transformOrigin={{ vertical: 'center', horizontal: 'left' }}
    >
      <Typography
        component="h6"
        variant="h6"
        className={classes.popoverHeading}
      >
        Map options
      </Typography>
      <ToggleWithHelper
        checked={showNeighbs}
        label="Show neighborhoods"
        handleChange={toggleNeighbs}
        name="toggle-neighborhoods"
        helperText={neighbsHelp}
      />
      <ToggleWithHelper
        checked={showCounties}
        label="Show counties"
        handleChange={toggleCounties}
        name="toggle-counties"
        helperText={countiesHelp}
      />
      <ToggleWithHelper
        checked={geolocActive}
        label="Show and zoom to my location"
        handleChange={toggleGeoLoc}
        name="toggle-geolocation"
        helperText={geolocHelp}
      />
      <BaseLayerToggles />
      <DialogCloseBtn tooltip="Close map menu" onClose={() => handleClose()} />
    </Popover>
  )
}
