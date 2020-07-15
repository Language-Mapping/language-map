import React, { FC, useContext } from 'react'
import { Grid } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { GlobalContext } from 'components'
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

export const LayersPanel: FC = () => {
  const classes = useStyles()
  const { state } = useContext(GlobalContext)

  return (
    <Grid container className={classes.layersPanelRoot} spacing={2}>
      <Grid item xs={6} sm={5}>
        <LayerSymbSelect />
      </Grid>
      <Grid item xs={6} sm={7}>
        <LayerLabelSelect />
      </Grid>
      <Legend items={state.langLegend} />
    </Grid>
  )
}
