import React, { FC, useState } from 'react'
import { Link, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { ToggleableSection } from 'components/generic'

const WORLD_MAP_IMG_SRC =
  'https://i1.wp.com/languagemapping.org/wp-content/uploads/2020/08/worldLangsMap.jpg?w=884&ssl=1'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    worldMap: {
      maxWidth: '100%',
      marginTop: theme.spacing(1),
    },
    worldMapDescrip: {
      color: theme.palette.text.secondary,
      fontSize: '0.7rem',
      marginBottom: theme.spacing(1),
    },
    legendTip: {
      color: theme.palette.text.secondary,
      fontSize: '0.65rem',
      marginTop: '1.25rem',
      marginBottom: '0.5rem',
    },
  })
)

export const WorldRegionMap: FC = () => {
  const classes = useStyles()
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false)

  const WorldMapToggle = (
    <Link
      href="#"
      onClick={(e: React.MouseEvent) => {
        e.preventDefault()
        setShowWorldMap(!showWorldMap)
      }}
    >
      {showWorldMap ? 'Hide' : 'Show'} world map
    </Link>
  )

  const LegendTip = (
    <Typography className={classes.legendTip}>
      Click any world region below to see languages from that region which are
      spoken locally. {WorldMapToggle}
    </Typography>
  )

  return (
    <>
      {LegendTip}
      <ToggleableSection show={showWorldMap}>
        <Typography className={classes.worldMapDescrip}>
          This map was based on the{' '}
          <a
            href="https://en.wikipedia.org/wiki/United_Nations_geoscheme"
            target="_blank"
            rel="noopener noreferrer"
            title="UN geoscheme wikipedia page"
          >
            United Nations geoscheme
          </a>
          . You can also view the{' '}
          <a
            href={WORLD_MAP_IMG_SRC}
            target="_blank"
            rel="noopener noreferrer"
            title="World regions map image"
          >
            full-size version
          </a>{' '}
          in a new tab.
        </Typography>
        <img
          src={WORLD_MAP_IMG_SRC}
          alt="Global regions based on UN geoscheme"
          className={classes.worldMap}
        />
      </ToggleableSection>
    </>
  )
}
