import React, { FC, useState } from 'react'
import { Link } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { ToggleableSection, Explanation } from 'components/generic'

const WORLD_MAP_IMG_SRC =
  'https://i1.wp.com/languagemapping.org/wp-content/uploads/2020/08/worldLangsMap.jpg?w=884&ssl=1'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: 0,
      '& p': {
        marginTop: 0,
      },
    },
    worldMap: {
      maxWidth: '100%',
      marginTop: theme.spacing(1),
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

  const WorldMapTip = (
    <p>
      Click any world region above to see languages from that region which are
      spoken locally. {WorldMapToggle}
    </p>
  )

  return (
    <Explanation className={classes.root}>
      {WorldMapTip}
      <ToggleableSection show={showWorldMap}>
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
        <img
          src={WORLD_MAP_IMG_SRC}
          alt="Global regions based on UN geoscheme"
          className={classes.worldMap}
        />
      </ToggleableSection>
    </Explanation>
  )
}
