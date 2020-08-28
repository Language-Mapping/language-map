import React, { FC, useEffect, useState } from 'react'
import { useLocation, Link as RouterLink } from 'react-router-dom'
import { Link, Grid, Typography, useMediaQuery } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FaGlobeAmericas } from 'react-icons/fa'
import { GoGear } from 'react-icons/go'

import { LayerSymbSelect, LayerLabelSelect, Legend } from 'components/legend'
import { ToggleableSection } from 'components'
import { RouteLocation } from 'components/map/types'
import { LegendSwatch } from './types'
import { WorldRegionMap } from './WorldRegionMap'

const GLOSSARY_PATHNAME: RouteLocation = '/glossary'

type LegendPanelComponent = {
  legendItems: LegendSwatch[]
  groupName: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainLegendHeading: {
      flex: 1,
    },
    legendHeadings: {
      display: 'flex',
    },
    changeLegendLink: {
      alignItems: 'center',
      display: 'inline-flex',
      fontSize: '0.8em',
      marginLeft: theme.spacing(1),
      '& svg': {
        marginRight: 2,
      },
      [theme.breakpoints.up('sm')]: {
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

export const LegendPanel: FC<LegendPanelComponent> = (props) => {
  const { legendItems, groupName } = props
  const loc = useLocation()
  const classes = useStyles()
  const {
    changeLegendLink,
    legendCtrls,
    legendCtrlsDescrip,
    mainLegendHeading,
    legendHeadings,
  } = classes
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xs'))
  const [showLegend, setShowLegend] = useState<boolean>(false)
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false)

  // Bit of a lag on desktop but the alternative of two separate components with
  // CSS-based breakpoints instead of `useMediaQuery` seemed overkill.
  useEffect((): void => setShowLegend(!isMobile), [isMobile])

  return (
    <>
      <div className={legendHeadings}>
        <Typography variant="h5" component="h3" className={mainLegendHeading}>
          Legend
        </Typography>
        <Link
          href="#"
          className={changeLegendLink}
          onClick={(e: React.MouseEvent) => {
            e.preventDefault()

            if (isMobile && showLegend) {
              setShowLegend(false)
            }

            setShowWorldMap(!showWorldMap)
          }}
        >
          <FaGlobeAmericas />
          Show world map
        </Link>
        <Link
          href="#"
          className={changeLegendLink}
          onClick={(e: React.MouseEvent) => {
            e.preventDefault()
            if (showWorldMap) {
              setShowWorldMap(false) // otherwise you can't see options on mobile
              setShowLegend(true)
            } else {
              setShowLegend(!showLegend)
            }
          }}
        >
          <GoGear />
          Options
        </Link>
      </div>
      <ToggleableSection show={showWorldMap}>
        <WorldRegionMap />
      </ToggleableSection>
      <ToggleableSection show={showLegend}>
        <Grid container spacing={2} className={legendCtrls}>
          <Grid item>
            <Typography className={legendCtrlsDescrip}>
              Visualize language communities in different ways by changing their
              symbols and labels below, or{' '}
              <Link to={GLOSSARY_PATHNAME + loc.search} component={RouterLink}>
                click here
              </Link>{' '}
              to learn more.
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <LayerSymbSelect />
          </Grid>
          <Grid item xs={6}>
            <LayerLabelSelect />
          </Grid>
        </Grid>
      </ToggleableSection>
      <Legend legendItems={legendItems} groupName={groupName} />
    </>
  )
}
