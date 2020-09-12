import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { EndoImageWrap } from 'components/details'
import { LangRecordSchema } from '../context/types'

export type LangOrEndoProps = {
  attribs: Pick<LangRecordSchema, 'Language' | 'Endonym' | 'Font Image Alt'>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // 2.4rem makes `Anashinaabemowin` fit
    detailsPanelHeading: {
      // TODO: cool if you can make this work: position: 'sticky', top: '3rem',
      fontSize: '2.4rem',
      [theme.breakpoints.up('sm')]: {
        fontSize: '3rem',
      },
    },
  })
)

// Mongolian, ASL, etc. have URLs to images
export const LangOrEndoIntro: FC<LangOrEndoProps> = (props) => {
  const classes = useStyles()
  const { attribs: selFeatAttribs } = props
  const {
    Endonym,
    Language: language,
    'Font Image Alt': altImage,
  } = selFeatAttribs

  return (
    <>
      {(altImage && <EndoImageWrap url={altImage} alt={language} />) || (
        <Typography variant="h3" className={classes.detailsPanelHeading}>
          {Endonym}
        </Typography>
      )}
      {Endonym !== language && (
        <Typography variant="caption" component="p">
          {language}
        </Typography>
      )}
    </>
  )
}
