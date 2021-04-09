import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Route, Switch } from 'react-router-dom'

import { Media } from 'components/media'
import { MoreLikeThis } from 'components/details'
import { CensusPopover } from 'components/explore/CensusPopover'
import { StatsAndMeta } from 'components/explore/StatsAndMeta'
import { LangProfileDescrip } from 'components/explore'
import { routes } from 'components/config/api'
import { LocationLink } from './LocationLink'
import { DetailedIntroProps } from './types'
import { ReadMoreLangDescrip } from './ReadMoreLangDescrip'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingBottom: '0.5rem', // allow for "Read more" section
      marginBottom: '1.25rem',
      borderBottom: `solid 1px ${theme.palette.divider}`,
    },
  })
)

// The intro section of pre-Details ("Language Profile") and Details views
export const DetailedIntro: FC<DetailedIntroProps> = (props) => {
  const { data, shareNoun, isInstance, langDescripID, children } = props
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  return (
    <header className={classes.root}>
      {children}
      <Route path={[routes.details, routes.dataDetail]} exact>
        <LocationLink
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          data={data}
        />
      </Route>
      <Switch>
        <Route path={[routes.details, routes.dataDetail]} exact />
        <Route>
          <StatsAndMeta data={data} />
        </Route>
      </Switch>
      <MoreLikeThis data={data}>
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
