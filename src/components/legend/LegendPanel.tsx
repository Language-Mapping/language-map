import React, { FC, useState } from 'react'
import { Link, Grid, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FaGlobeAmericas } from 'react-icons/fa'
import { GoGear } from 'react-icons/go'

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
    mainLegendHeading: {
      marginRight: '0.4rem',
    },
    legendHeadings: {
      marginTop: '1rem',
      display: 'flex',
    },
    changeLegendLink: {
      alignItems: 'center',
      display: 'inline-flex',
      fontSize: '0.8rem',
      '& svg': {
        marginRight: 4,
      },
    },
    hideOnDesktop: {
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    desktopOnly: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    legendCtrls: {
      marginBottom: 4,
    },
    legendCtrlsDescrip: {
      color: theme.palette.text.secondary,
      fontSize: '0.7rem',
    },
  })
)

export const LegendCtrls: FC = (props) => {
  const classes = useStyles()
  const { legendCtrls, legendCtrlsDescrip } = classes

  return (
    <Grid container spacing={2} className={legendCtrls}>
      <Grid item>
        <Typography className={legendCtrlsDescrip}>
          Visualize language communities in different ways by changing their
          symbols and labels below.
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <LayerSymbSelect />
      </Grid>
      <Grid item xs={6}>
        <LayerLabelSelect />
      </Grid>
    </Grid>
  )
}

export const LegendPanel: FC<LegendPanelComponent> = (props) => {
  const { legendItems, groupName } = props
  const classes = useStyles()
  const {
    changeLegendLink,
    mainLegendHeading,
    legendHeadings,
    hideOnDesktop,
    desktopOnly,
  } = classes
  const [showLegend, setShowLegend] = useState<boolean>(false)
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false)

  return (
    <>
      <div className={legendHeadings}>
        <Typography variant="h5" component="h3" className={mainLegendHeading}>
          Legend
        </Typography>
        <Link
          href="#"
          className={`${changeLegendLink} ${hideOnDesktop}`}
          onClick={(e: React.MouseEvent) => {
            e.preventDefault()
            setShowLegend(!showLegend)
          }}
        >
          <GoGear />
          Options
        </Link>
      </div>
      <ToggleableSection show={showLegend}>
        <LegendCtrls />
      </ToggleableSection>
      <div className={desktopOnly}>
        <LegendCtrls />
      </div>
      <Legend legendItems={legendItems} groupName={groupName} />
      <Link
        href="#"
        className={changeLegendLink}
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
