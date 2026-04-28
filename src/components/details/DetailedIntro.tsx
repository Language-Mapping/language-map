import React, { FC, useState } from 'react'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { useMatch } from 'react-router-dom'
import { Grow } from '@mui/material'

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
      paddingBottom: '0.75rem', // allow for "Read more" section
      marginBottom: '1.25rem',
      borderBottom: `solid 1px ${theme.palette.divider}`,
    },
  })
)

// The intro section of pre-Details ("Language Profile") and Details views
export const DetailedIntro: FC<DetailedIntroProps> = (props) => {
  const { data, shareNoun, isInstance, langDescripID, children } = props
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const detailsMatch = useMatch(routes.details)
  const dataDetailMatch = useMatch(routes.dataDetail)
  const isDetailRoute = detailsMatch !== null || dataDetailMatch !== null
  const isExplore = useMatch(`${routes.explore}/*`) !== null

  return (
    <Grow in timeout={500} style={{ transformOrigin: 'top center' }}>
      <header className={classes.root}>
        {children}
        {isDetailRoute && (
          <LocationLink
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            data={data}
          />
        )}
        {!isDetailRoute && <StatsAndMeta data={data} />}
        <MoreLikeThis data={data}>
          <CensusPopover data={data} />
        </MoreLikeThis>
        <Media data={data} shareNoun={shareNoun} omitClear={!isInstance} />
        {langDescripID && <ReadMoreLangDescrip langDescripID={langDescripID} />}
        {isExplore && data.langProfileDescripID && (
          <LangProfileDescrip
            langProfileDescripID={data.langProfileDescripID}
          />
        )}
      </header>
    </Grow>
  )
}
