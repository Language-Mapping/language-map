import React, { FC } from 'react'
import { Grid } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LayerSymbSelect, LayerLabelSelect, Legend } from 'components/legend'
import { LegendSwatch } from './types'

type LegendPanelComponent = {
  legendItems: LegendSwatch[]
  groupName: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layersPanelRoot: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
  })
)

export const LegendPanel: FC<LegendPanelComponent> = (props) => {
  const { legendItems, groupName } = props
  const classes = useStyles()

  // FORMER SUMMARY: Visualize language communities in different ways by
  // changing their symbols and labels below.
  // TODO: ^^^^^ restore as a heading?
  return (
    <>
      <Grid container className={classes.layersPanelRoot} spacing={2}>
        <Grid item>
          <LayerSymbSelect />
        </Grid>
        <Grid item>
          <LayerLabelSelect />
        </Grid>
      </Grid>
      <Legend legendItems={legendItems} groupName={groupName} />
    </>
  )
}
