import React, { FC, useState } from 'react'
import { Link, Grid } from '@material-ui/core'
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
      marginBottom: 4,
    },
  })
)

export const LegendPanel: FC<LegendPanelComponent> = (props) => {
  const { legendItems, groupName } = props
  const classes = useStyles()
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false)

  return (
    <>
      <Grid container spacing={2} className={classes.legendCtrls}>
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
        Show world map
      </Link>
      <ToggleableSection show={showWorldMap}>
        <WorldRegionMap />
      </ToggleableSection>
    </>
  )
}
