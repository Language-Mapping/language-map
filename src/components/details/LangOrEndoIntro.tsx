import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Link } from '@material-ui/core'

import { EndoImageWrap } from 'components/details'
import { paths as routes } from 'components/config/routes'
import { LangOrEndoIntroProps } from './types'

// Shaky but makes long endos like Church Slavonic's fit
type StyleProps = { tooLong: boolean }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      textShadow: '1px 1px 3px hsla(0, 0%, 0%, 0.45)',
      // TODO: cool if you can make this work: position: 'sticky', top: '3rem',
      fontSize: (props: StyleProps) => (props.tooLong ? '2rem' : '2.4rem'),
      [theme.breakpoints.up('sm')]: {
        // Safari and/or Firefox seem to need smaller font than Chrome
        fontSize: (props: StyleProps) => (props.tooLong ? '2.3rem' : '3rem'),
      },
    },
    // TODO: already got this in Explore bruh...
    subHeading: {
      lineHeight: 1,
    },
    moreLangsLink: {
      fontSize: '0.5rem',
    },
  })
)

// Mongolian, ASL, etc. have URLs to images
// TODO: make this more generic and consistent to be reused with /Explore's
export const LangOrEndoIntro: FC<LangOrEndoIntroProps> = (props) => {
  const CHAR_CUTOFF = 17
  const { data } = props
  const { Endonym, Language, 'Font Image Alt': altImage } = data

  const classes = useStyles({
    // SEMI-GROSS: if there are no spaces in the Endonym and it's over the
    // character cutoff defined above, reduce the font size
    tooLong: !Endonym.trim().includes(' ') && Endonym.length >= CHAR_CUTOFF,
  })

  return (
    <>
      {(altImage && <EndoImageWrap url={altImage[0].url} alt={Language} />) || (
        <Typography variant="h3" className={classes.heading}>
          {Endonym}
        </Typography>
      )}
      {Language !== Endonym && (
        <Typography variant="h6" className={classes.subHeading}>
          ({Language})
        </Typography>
      )}
      <Link
        component={RouterLink}
        to={`${routes.grid}/Language/${Language}`}
        className={classes.moreLangsLink}
      >
        More like this
      </Link>
    </>
  )
}
