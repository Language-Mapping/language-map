import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { EndoImageWrap } from 'components/details'
import { LangRecordSchema } from '../context/types'

export type LangOrEndoProps = {
  attribs: Pick<LangRecordSchema, 'Language' | 'Endonym' | 'Font Image Alt'>
}

// Shaky but makes long endos like Church Slavonic's fit
type StyleProps = { tooLong: boolean }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    detailsPanelHeading: {
      // TODO: cool if you can make this work: position: 'sticky', top: '3rem',
      fontSize: (props: StyleProps) => (props.tooLong ? '2rem' : '2.4rem'),
      [theme.breakpoints.up('sm')]: {
        // Safari and/or Firefox seem to need smaller font than Chrome
        fontSize: (props: StyleProps) => (props.tooLong ? '2.3rem' : '3rem'),
      },
    },
  })
)

// Mongolian, ASL, etc. have URLs to images
export const LangOrEndoIntro: FC<LangOrEndoProps> = (props) => {
  const CHAR_CUTOFF = 17
  const { attribs: selFeatAttribs } = props
  const {
    Endonym,
    Language: language,
    'Font Image Alt': altImage,
  } = selFeatAttribs

  const classes = useStyles({
    // SEMI-GROSS: if there are no spaces in the Endonym and it's over the
    // character cutoff defined above, reduce the font size
    tooLong: !Endonym.trim().includes(' ') && Endonym.length >= CHAR_CUTOFF,
  })

  return (
    <>
      {(altImage && <EndoImageWrap url={altImage} alt={language} />) || (
        <Typography variant="h3" className={classes.detailsPanelHeading}>
          {Endonym}
        </Typography>
      )}
      {/* TODO: rm if confirmed only using Endo */}
      {/* {Endonym !== language && (
        <Typography variant="caption" component="p">
          {language}
        </Typography>
      )} */}
    </>
  )
}
