import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Route } from 'react-router-dom'

import { Media } from 'components/media'
import { MoreLikeThis } from 'components/details'
import { CensusPopover } from 'components/explore/CensusPopover'
import { StatsAndMeta } from 'components/explore/StatsAndMeta'
import { LangProfileDescrip } from 'components/explore'
import { routes } from 'components/config/api'
import { LangOrEndoIntro } from './LangOrEndoIntro'
import { DetailedIntroProps } from './types'
import { ReadMoreLangDescrip } from './ReadMoreLangDescrip'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingBottom: '0.75rem',
      marginBottom: '1rem',
      borderBottom: `solid 1px ${theme.palette.divider}`,
    },
  })
)

// The intro section of pre-Details ("Language Profile") and Details views
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
      <Route path={routes.explore}>
        {data.langProfileDescripID && (
          <LangProfileDescrip
            langProfileDescripID={data.langProfileDescripID}
          />
        )}
      </Route>
    </header>
  )
}
