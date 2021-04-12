import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Link, Button, Popover, Typography } from '@material-ui/core'

import { DialogCloseBtn } from 'components/generic/modals'
import { useMapToolsState, useMapToolsDispatch } from 'components/context'
import { ToggleWithHelper, useUItext } from 'components/generic'
import { routes } from 'components/config/api'
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
    censusLinks: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.85rem',
    },
    censusLinkLabel: {
      marginRight: 4,
    },
    censusLink: {
      fontSize: 'inherit',
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
  const {
    showCounties,
    showNeighbs,
    geolocActive,
    censusActiveField,
  } = useMapToolsState()
  const mapToolsDispatch = useMapToolsDispatch()
  const { neighbsHelp, countiesHelp, geolocHelp } = useHelperText()
  const activeField = censusActiveField?.id

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
        Map Options
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
      <div className={classes.censusLinks}>
        <span className={classes.censusLinkLabel}>Census data:</span>
        <Button
          component={RouterLink}
          size="small"
          className={classes.censusLink}
          color="secondary"
          to={routes.local}
        >
          View options
        </Button>
        <Link
          component={Button}
          size="small"
          className={classes.censusLink}
          color="secondary"
          title="Clear census layer language"
          disabled={activeField === undefined}
          onClick={() => mapToolsDispatch({ type: 'CLEAR_CENSUS_FIELD' })}
        >
          Clear selection
        </Link>
      </div>
      <BaseLayerToggles />
      <DialogCloseBtn tooltip="Close map menu" onClose={() => handleClose()} />
    </Popover>
  )
}
