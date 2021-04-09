import React, { FC } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import { useMapToolsState } from 'components/context'
import { LegendBarProps, LegendMarkersProps } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: '0.75rem',
      textAlign: 'center',
    },
    legendBar: {
      borderRadius: 2,
      height: 4,
      marginBottom: '0.25rem',
    },
    legendMarkers: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.25rem',
      fontSize: '0.75rem',
    },
    legendMarker: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    legendMarkerTick: {
      fontSize: 6,
      color: theme.palette.text.secondary,
    },
    legendTitle: {
      color: theme.palette.text.secondary,
      fontSize: '0.75rem',
      textTransform: 'uppercase',
    },
  })
)

const LegendBar: FC<LegendBarProps> = (props) => {
  const {
    lowColor = 'rgb(237, 248, 233)',
    highColor = 'rgb(0, 109, 44)',
  } = props
  const classes = useStyles()
  const backgroundImage = `linear-gradient(
    to right,
    ${lowColor} 0%,
    ${highColor} 100%
  )`

  return <div className={classes.legendBar} style={{ backgroundImage }} />
}

const LegendMarker: FC<{ value: number | string }> = (props) => {
  const { value } = props
  const classes = useStyles()

  return (
    <div className={classes.legendMarker}>
      <div className={classes.legendMarkerTick}>|</div>
      <span>{value}</span>
    </div>
  )
}

const LegendMarkers: FC<LegendMarkersProps> = (props) => {
  const { low = 0, high = 50 } = props
  const classes = useStyles()

  return (
    <>
      <div className={classes.legendMarkers}>
        <LegendMarker value={low} />
        <LegendMarker value={Math.floor(high / 4).toLocaleString()} />
        <LegendMarker value={Math.floor(high / 2).toLocaleString()} />
        <LegendMarker value={Math.floor((high / 4) * 3).toLocaleString()} />
        <LegendMarker value={high.toLocaleString()} />
      </div>
      <div className={classes.legendTitle}>Number of speakers</div>
    </>
  )
}

export const LegendGradient: FC = (props) => {
  const classes = useStyles()
  const { censusHighLow, censusActiveField } = useMapToolsState()

  if (!censusHighLow || !censusActiveField) return null

  const { low, high } = censusHighLow

  return (
    <div className={classes.root}>
      <LegendBar />
      <LegendMarkers low={low} high={high} />
    </div>
  )
}
