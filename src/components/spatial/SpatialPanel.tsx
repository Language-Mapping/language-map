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
        <Typography className={classes.panelMainHeading}>
          Map loading...
        </Typography>
      </div>
    )

  return (
    <div className={panelRootClasses.root}>
      <LocationSearchContent
        heading="Census data (NYC only)"
        explanation={`The Census Bureau’s American Community Survey (ACS), while recording far fewer languages than ELA, provides a useful indication of where the largest several dozen languages are distributed.

        Find below 5-year ACS estimates on “language spoken at home for the Population 5 Years and Over”. For best results, use together with ELA data [DATA]. ELA is not responsible for Census data or categories. More info here [ABOUT].`}
      >
        <CensusFieldSelect stateKey="pumaField" />
      </LocationSearchContent>
      <GeocoderPopout {...props} />
      <GeolocToggle />
    </div>
  )
}
