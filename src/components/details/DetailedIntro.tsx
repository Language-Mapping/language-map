import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'

import { Media } from 'components/media'
import { MoreLikeThis } from 'components/details'
import { CensusPopover } from 'components/explore/CensusPopover'
import { ReadMore } from 'components/generic'
import { StatsAndMeta } from 'components/explore/StatsAndMeta'
import { LangOrEndoIntro } from './LangOrEndoIntro'
import { DetailedIntroProps } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { textAlign: 'center' },
    divider: { margin: '1rem 0 0.5rem' },
  })
)

export const DetailedIntro: FC<DetailedIntroProps> = (props) => {
  const { data, shareNoun, isInstance } = props
  const classes = useStyles()
  const { 'Language Description': langDescrip = '' } = data

  return (
    <header className={classes.root}>
      <LangOrEndoIntro data={data} />
      {!isInstance && <StatsAndMeta data={data} />}
      <MoreLikeThis data={data} isInstance={isInstance}>
        <CensusPopover data={data} />
      </MoreLikeThis>
      <Media data={data} shareNoun={shareNoun} omitClear={!isInstance} />
      {langDescrip && <ReadMore text={langDescrip} />}
      <Divider variant="middle" className={classes.divider} />
    </header>
  )
}
