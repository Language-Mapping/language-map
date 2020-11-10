import React, { FC, useContext } from 'react'
import { useParams } from 'react-router-dom'

import { GlobalContext } from 'components/context'
import { BiMapPin } from 'react-icons/bi'
import { CustomCard } from './CustomCard'
import { CardList } from './CardList'
import * as Types from './types'
import * as utils from './utils'
import { ExploreSubView } from './ExploreSubView'

export const LangCardsList: FC = () => {
  const { value, language } = useParams() as Types.RouteMatch
  const { state } = useContext(GlobalContext)
  const { langFeatures } = state
  const icon = <BiMapPin />

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

  // TODO: find more efficient way of getting this
  const sampleRecord = langFeatures.find(
    ({ Language }) => Language === (language || value)
  )

  const { 'ISO 639-3': iso, Glottocode, Endonym } = sampleRecord || {}

  return (
    <ExploreSubView
      instancesCount={uniqueInstances.length}
      subtitle={Endonym}
      subSubtitle={
        <>
          {Glottocode && `GLOTTOCODE: ${Glottocode}`}
          {iso && `${Glottocode && ' | '}ISO 639-3: ${iso}`}
        </>
      }
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
