import React, { FC, useState } from 'react'
import { Typography, Link, Grid } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FaGlobeAmericas } from 'react-icons/fa'

import { LayerSymbSelect, LayerLabelSelect, Legend } from 'components/legend'
import { ToggleableSection } from 'components'
import { LegendSwatch } from './types'
import { WorldRegionMap } from './WorldRegionMap'

type LegendPanelComponent = {
  legendItems: LegendSwatch[]
  groupName: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    changeLegendLink: {
      alignItems: 'center',
      display: 'inline-flex',
      fontSize: '0.8rem',
      '& svg': {
        marginRight: 4,
      },
    },
    legendCtrls: {
      margin: '0.5rem 0',
    },
    inner: {
      marginTop: '1.25em',
    },
  })
)

export const LegendPanel: FC<LegendPanelComponent> = (props) => {
  const { legendItems, groupName } = props
  const classes = useStyles()
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false)

  return (
    <div className={classes.inner}>
      <Typography variant="h6" component="h3">
        Legend
      </Typography>
      <small style={{ fontSize: 10, lineHeight: 0.85 }}>
        Legend item link to their corresponding routes, so I'm thinking a small
        blurb here indicating that since they don't appear very link-y. TODO:
        "Size"
      </small>
      <Grid container className={classes.legendCtrls} spacing={2}>
        <Grid item xs={6}>
          <LayerSymbSelect />
        </Grid>
        <Grid item xs={6}>
          <LayerLabelSelect />
        </Grid>
      </Grid>
      <Legend legendItems={legendItems} groupName={groupName} />
      <Link
        href="#"
        className={classes.changeLegendLink}
        onClick={(e: React.MouseEvent) => {
          e.preventDefault()
          setShowWorldMap(!showWorldMap)
        }}
      >
        <FaGlobeAmericas />
        {showWorldMap ? 'Hide' : 'Show'} world map
      </Link>
      <ToggleableSection show={showWorldMap}>
        <WorldRegionMap />
      </ToggleableSection>
    </div>
  )
}
