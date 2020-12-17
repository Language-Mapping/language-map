import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { useMapToolsState } from 'components/context'
import { Media } from 'components/media'
import { MoreLikeThis } from 'components/details'
import { ReadMore } from 'components/generic'
import { useLangFeatByKeyVal } from 'components/map/hooks'
import { CustomCard } from './CustomCard'
import { CardList } from './CardList'
import { ExploreSubView } from './ExploreSubView'
import { CensusPopover } from './CensusPopover'

import * as Types from './types'
import * as utils from './utils'
import { useUniqueInstances } from './hooks'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    statsAndMeta: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'inline-flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      '& > :not(:last-child)': {
        borderRight: `solid 1px ${theme.palette.text.secondary}`,
        marginRight: '0.4rem',
        paddingRight: '0.4rem',
      },
    },
  })
)

const StatsAndMeta: FC<Types.StatsAndMetaProps> = (props) => {
  const { glotto, iso, speakers } = props
  const classes = useStyles()

  return (
    <ul className={classes.statsAndMeta}>
      {speakers && (
        <li>
          <b>Global speakers:</b> {parseInt(speakers, 10).toLocaleString()}
        </li>
      )}
      {glotto && (
        <li>
          <b>Glottocode:</b> {glotto}
        </li>
      )}
      {iso && (
        <li>
          <b>ISO 639-3:</b> {iso}
        </li>
      )}
    </ul>
  )
}

export const LangCardsList: FC = () => {
  const { value, language } = useParams() as Types.RouteMatch
  const { langConfigViaSheets } = useMapToolsState()
  const { feature } = useLangFeatByKeyVal(
    language || value || undefined,
    false,
    'Language'
  )
  const uniqueInstances = useUniqueInstances(value, language)
  const thisLangConfig = langConfigViaSheets.find(
    ({ Language }) => Language === (language || value)
  )
  if (!thisLangConfig) {
    return (
      <ExploreSubView
        instancesCount={uniqueInstances.length}
        subtitle={`Not found: ${language || value}`}
      />
    )
  }

  const {
    'ISO 639-3': iso,
    Glottocode: glotto,
    Endonym,
    Description,
    Language,
    'Global Speaker Total': speakers,
  } = thisLangConfig

  const description = Description || feature?.Description || ''

  // FIXME: just schema/type
  const Extree = (
    <>
      {/* @ts-ignore */}
      <MoreLikeThis data={thisLangConfig} />
      {/* @ts-ignore */}
      <CensusPopover data={thisLangConfig} />
      {/* @ts-ignore */}
      <Media data={thisLangConfig} shareNoun="profile" omitClear />
      {description && <ReadMore text={description} />}
    </>
  )

  return (
    <ExploreSubView
      instancesCount={uniqueInstances.length}
      subtitle={Endonym === Language ? '' : Endonym}
      subSubtitle={<StatsAndMeta {...{ iso, glotto, speakers }} />}
      extree={Extree}
    >
      <CardList>
        {uniqueInstances.sort(utils.sortByTitle).map((instance) => (
          <CustomCard
            key={instance.title}
            {...instance}
            url={`/details/${instance.to}`}
          />
        ))}
      </CardList>
    </ExploreSubView>
  )
}
