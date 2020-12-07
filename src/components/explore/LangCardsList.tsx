import React, { FC, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { BiMapPin } from 'react-icons/bi'

import { GlobalContext, useMapToolsState } from 'components/context'
import { MoreLikeThis } from 'components/details'
import { ReadMore } from 'components/generic'
import { CustomCard } from './CustomCard'
import { CardList } from './CardList'
import { ExploreSubView } from './ExploreSubView'
import { CensusPopover } from './CensusPopover'

import * as Types from './types'
import * as utils from './utils'

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
        marginRight: '0.35rem',
        paddingRight: '0.35rem',
      },
    },
  })
)

const StatsAndMeta: FC<Types.StatsAndMetaProps> = (props) => {
  const { glotto, iso, speakers } = props
  const classes = useStyles()

  return (
    <ul className={classes.statsAndMeta}>
      {glotto && <li>{`GLOTTOCODE: ${glotto}`}</li>}
      {iso && <li>{`ISO 639-3: ${iso}`}</li>}
      {speakers && (
        <li>{`Global Speakers: ${parseInt(speakers, 10).toLocaleString()}`}</li>
      )}
    </ul>
  )
}

export const LangCardsList: FC = () => {
  const { value, language } = useParams() as Types.RouteMatch
  const { state } = useContext(GlobalContext)
  const { langFeatures } = state
  const icon = <BiMapPin />
  const { langConfigViaSheets } = useMapToolsState()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // not for lack of trying
  const uniqueInstances = langFeatures.reduce((all, thisOne) => {
    const { Neighborhood, Town, Language, Description } = thisOne

    // Deep depth
    if (language) {
      if (Language !== language) return all
    } else if (Language !== value) return all

    if (!Neighborhood && all.find((item) => item.title === Town)) return all

    const common = {
      footer: `${Description.slice(0, 100).trimEnd()}...`,
      intro: '', // TODO: rm if not using
      to: thisOne.ID,
      icon,
    }

    if (!Neighborhood) return [...all, { title: Town, ...common }]

    return [
      ...all,
      ...Neighborhood.split(', ')
        .filter((hood) => !all.find((item) => item.title === hood))
        .map((hood) => ({ title: hood, ...common })),
    ]
  }, [] as Types.CardConfig[]) as Types.CardConfig[]

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
    Country,
    'Global Speaker Total': speakers,
    'World Region': region,
    'PUMA Field': pumaField,
    'Tract Field': tractField,
    'Census Pretty': censusPretty,
  } = thisLangConfig

  const SubTitle = <StatsAndMeta {...{ iso, glotto, speakers }} />

  const Extree = (
    <>
      <MoreLikeThis region={region} country={Country}>
        <CensusPopover {...{ tractField, pumaField, censusPretty }} />
      </MoreLikeThis>
      {Description && <ReadMore text={Description} />}
    </>
  )

  return (
    <ExploreSubView
      instancesCount={uniqueInstances.length}
      subtitle={Endonym === Language ? '' : Endonym}
      subSubtitle={SubTitle}
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
