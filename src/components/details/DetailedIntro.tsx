import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'

import { Media } from 'components/media'
import { MoreLikeThis } from 'components/details'
import { CensusPopover } from 'components/explore/CensusPopover'
import { StatsAndMeta } from 'components/explore/StatsAndMeta'
import { LangOrEndoIntro } from './LangOrEndoIntro'
import { DetailedIntroProps } from './types'
import { ReadMoreLangDescrip } from './ReadMoreLangDescrip'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { textAlign: 'center' },
    divider: { margin: '1rem 0' },
  })
)

// The intro section of pre-Details and Details views
export const DetailedIntro: FC<DetailedIntroProps> = (props) => {
  const { data, shareNoun, isInstance, langDescripID } = props
  const classes = useStyles()

  return (
    <header className={classes.root}>
      <LangOrEndoIntro data={data} />
      {!isInstance && <StatsAndMeta data={data} />}
      <MoreLikeThis data={data} isInstance={isInstance}>
        <CensusPopover data={data} />
      </MoreLikeThis>
      <Media data={data} shareNoun={shareNoun} omitClear={!isInstance} />
      {langDescripID && <ReadMoreLangDescrip langDescripID={langDescripID} />}
      <Divider variant="middle" className={classes.divider} />
    </header>
  )
}
