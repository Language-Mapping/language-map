import React, { FC } from 'react'
import { Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

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
  })
)

export const WorldRegionMap: FC = () => {
  const classes = useStyles()

  return (
    <>
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
    </>
  )
}
