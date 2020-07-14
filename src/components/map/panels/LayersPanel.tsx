import React, { FC } from 'react'
import { Grid } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LayerSymbSelect, LayerLabelSelect, Legend } from 'components/map'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layersPanelRoot: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      '& .MuiFormControl-root': {
        width: '100%',
      },
    },
  })
)

const legendItems = [
  { backgroundColor: '#223b53', text: 'Asia' },
  { backgroundColor: '#3bb2d0', text: 'Americas' },
  { backgroundColor: '#e55e53', text: 'Africa' },
  { backgroundColor: '#fbb03b', text: 'Europe' },
  { backgroundColor: 'tan', text: 'Uhh Pacific?' },
  { backgroundColor: '#ccc', text: 'Other' },
]

export const LayersPanel: FC = () => {
  const classes = useStyles()

  return (
    <Grid container className={classes.layersPanelRoot} spacing={2}>
      <Grid item xs={6} sm={5}>
        <LayerSymbSelect />
      </Grid>
      <Grid item xs={6} sm={7}>
        <LayerLabelSelect />
      </Grid>
      <Legend items={legendItems} />
    </Grid>
  )
}
