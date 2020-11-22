import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { GeocoderPopout, GeolocToggle } from 'components/map'
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
      <CensusFieldSelect stateKey="pumaField" />
      <GeocoderPopout {...props} />
      <GeolocToggle />
    </div>
  )
}
