import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { FaSearchLocation } from 'react-icons/fa'

import {
  GeocoderPopout,
  GeolocToggle,
  LocationSearchContent,
} from 'components/map'
import { usePanelRootStyles } from 'components/panels'
import * as Types from './types'
import { CensusFieldSelect } from './CensusFieldSelect'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelMainHeading: {
      alignItems: 'center',
      display: 'flex',
      '& > svg': {
        fill: theme.palette.text.secondary,
        fontSize: '0.75em',
        marginRight: '0.25em',
      },
    },
  })
)

export const SpatialPanel: FC<Types.SpatialPanel> = (props) => {
  const { mapRef } = props
  const panelRootClasses = usePanelRootStyles()
  const classes = useStyles()

  if (!mapRef.current)
    return (
      <div className={panelRootClasses.root}>
        <Typography>Map loading...</Typography>
      </div>
    )

  return (
    <div className={panelRootClasses.root}>
      <Typography
        className={classes.panelMainHeading}
        variant="h4"
        component="h2"
      >
        <FaSearchLocation />
        Spatial dumping ground
      </Typography>
      <LocationSearchContent
        heading="Census data"
        explanation="Tract-level census data when available, otherwise less-granular PUMA-level. Goal is to show where these languages are spoken as a supplement to the Language Communities points. LINK TO HELP/ABOUT SECTION/S."
      >
        <CensusFieldSelect stateKey="pumaField" />
      </LocationSearchContent>
      <GeolocToggle />
      <GeocoderPopout {...props} />
    </div>
  )
}
