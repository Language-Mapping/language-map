import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { EndoImageWrap } from 'components/details'
import { routes } from 'components/config/api'
import { TonsOfData } from './types'

// Shaky but makes long endos like Church Slavonic's fit
type StyleProps = { tooLong: boolean }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      textShadow: '1px 1px 3px hsla(0, 0%, 0%, 0.45)',
      // WISHLIST: cool if you can do it: position: 'sticky', top: '3rem',
      fontSize: (props: StyleProps) => (props.tooLong ? '2rem' : '2.4rem'),
      [theme.breakpoints.up('sm')]: {
        // Safari and/or Firefox seem to need smaller font than Chrome
        fontSize: (props: StyleProps) => (props.tooLong ? '2.3rem' : '3rem'),
      },
    },
    subHeading: {
      fontSize: '1.25rem',
      lineHeight: 1.25,
      display: 'block',
      color: theme.palette.secondary.light,
    },
  })
)

// Mongolian, ASL, etc. have URLs to images
export const LangOrEndoIntro: FC<TonsOfData> = (props) => {
  const CHAR_CUTOFF = 17
  const { data } = props
  const { Endonym, Language, 'Font Image Alt': altImage, name } = data
  const language = name || Language // TODO: deal with this somehow

  const classes = useStyles({
    // SEMI-GROSS: if there are no spaces in the Endonym and it's over the
    // character cutoff defined above, reduce the font size
    tooLong: !Endonym.trim().includes(' ') && Endonym.length >= CHAR_CUTOFF,
  })

  return (
    <>
      {(altImage && <EndoImageWrap url={altImage[0].url} alt={language} />) || (
        <Typography variant="h3" className={classes.heading}>
          {Endonym}
        </Typography>
      )}
      {(altImage || language !== Endonym) && (
        <Typography
          variant="h6"
          component={RouterLink}
          to={`${routes.explore}/Language/${language}`}
          className={classes.subHeading}
        >
          {language}
        </Typography>
      )}
    </>
  )
}
