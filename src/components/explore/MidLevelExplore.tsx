import React, { FC, useContext } from 'react'
import { useRouteMatch, useParams } from 'react-router-dom'

import { GlobalContext, LangRecordSchema } from 'components/context'
import { BiMapPin } from 'react-icons/bi'
import { SwatchOrFlagOrIcon } from 'components/generic/icons-and-swatches'
import { CustomCard, GlottoIsoFooter } from './CustomCard'
import { CardList } from './CardList'
import * as Types from './types'
import * as utils from './utils'
import { ExploreSubView } from './ExploreSubView'

export const MidLevelExplore: FC = () => {
  const { field, value, language } = useParams() as Types.RouteMatch
  const { url } = useRouteMatch()
  const { state } = useContext(GlobalContext)
  const { langFeatures } = state

  if (!langFeatures.length) return <ExploreSubView instancesCount={0} />

  let footer: string | React.ReactNode = null
  const fieldInQuestion = value ? 'Language' : field
  const filtered: LangRecordSchema[] = utils.filterLangsByRoute({
    langFeatures,
    field,
    value,
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // not for lack of trying
  const uniqueInstances = filtered.reduce((all, thisOne) => {
    const thisRecValue = thisOne[fieldInQuestion]?.toString()
    const asArray = thisRecValue?.split(', ')
    const superFilt =
      asArray?.filter((mannn) => !all.find((wow) => wow.title === mannn)) || []

    if (language || field === 'Language') {
      const { 'ISO 639-3': iso, Glottocode } = thisOne
      footer = <GlottoIsoFooter iso={iso} glotto={Glottocode} />
    }

    const more = superFilt.map((thing) => ({
      title: value ? thisOne.Language : thing,
      intro: value || field === 'Language' ? thisOne.Endonym : '',
      footer,
      icon: utils.deservesCardIcon(field, value) && (
        <SwatchOrFlagOrIcon field={value ? 'Language' : field} value={thing} />
      ),
    }))

    return [...all, ...more]
  }, [] as Types.CardConfig[]) as Types.CardConfig[]

  const reduceFn = value ? utils.allPlacenames : utils.uniqueLanguages
  const footerIcon = field !== 'Language' && value !== undefined && <BiMapPin />

  return (
    <ExploreSubView instancesCount={uniqueInstances.length}>
      <CardList>
        {uniqueInstances.sort(utils.sortByTitle).map((instance) => {
          const friends = filtered
            .filter((row) =>
              // Error makes no sense, didn't even work if filters length was
              // confirmed first.
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              row[fieldInQuestion].split(', ').includes(instance.title)
            )
            .reduce(reduceFn, [] as string[])

          const uniques =
            (!value && friends) ||
            (friends.reduce(
              (all, thisOne) =>
                all.includes(thisOne) ? all : [...all, thisOne],
              [] as string[]
            ) as string[])

          return (
            <CustomCard
              key={instance.title}
              {...instance}
              footerIcon={!instance.footer && footerIcon}
              uniqueInstances={uniques}
              url={`${url}/${instance.title}`}
            />
          )
        })}
      </CardList>
    </ExploreSubView>
  )
}
