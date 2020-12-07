import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

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
    root: {
      '& > * + *': {
        marginTop: '1.25em',
      },
    },
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

export const SpatialPanel: FC<Types.SpatialPanelProps> = (props) => {
  const { mapRef } = props
  const panelRootClasses = usePanelRootStyles()
  const classes = useStyles()

  if (!mapRef.current)
    return (
      <div className={`${panelRootClasses.root} ${classes.root}`}>
        <Typography className={classes.panelMainHeading}>
          Map loading...
        </Typography>
      </div>
    )

  return (
    <div className={`${panelRootClasses.root} ${classes.root}`}>
      <CensusFieldSelect />
      <LocationSearchContent
        heading="Location tools"
        explanation="Enter an address, municipality, neighborhood, postal code, landmark, or other point of interest within the New York City metro area."
      >
        <GeocoderPopout {...props} />
        <GeolocToggle />
      </LocationSearchContent>
    </div>
  )
}
