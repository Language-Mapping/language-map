import React, { FC, useContext } from 'react'
import { useRouteMatch, useParams } from 'react-router-dom'

import { GlobalContext } from 'components/context'
import { BiMapPin, BiUserVoice } from 'react-icons/bi'
import { SwatchOrFlagOrIcon } from 'components/generic/icons-and-swatches'
import { CustomCard } from './CustomCard'
import { CardList } from './CardList'
import * as Types from './types'
import * as utils from './utils'
import { ExploreSubView } from './ExploreSubView'

export const MidLevelExplore: FC = () => {
  const { field, value } = useParams() as Types.RouteMatch
  const { url } = useRouteMatch()
  const { state } = useContext(GlobalContext)
  const { langFeatures } = state

  if (!langFeatures.length) return <ExploreSubView instancesCount={0} />

  let filtered
  const fieldInQuestion = value ? 'Language' : field

  // Filter out undefined values and those not matching `value` as needed
  if (value) {
    filtered = langFeatures.filter((feat) => {
      const thisValue = feat[field]

      if (!thisValue) return false
      if (!thisValue.toString().split(', ').includes(value)) return false

      return true
    })
  } else if (['Neighborhood', 'Macrocommunity'].includes(field)) {
    // Make sure no undefined
    filtered = langFeatures.filter((feat) => feat[field] !== '')
  } else {
    filtered = langFeatures
  }

  let footerText: string | React.ReactNode

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // not for lack of trying
  const uniqueInstances = filtered.reduce((all, thisOne) => {
    const thisRecValue = thisOne[fieldInQuestion]?.toString()
    const asArray = thisRecValue?.split(', ')
    const superFilt =
      asArray?.filter((mannn) => {
        return !all.find((wow) => wow.title === mannn)
      }) || []

    // TODO: componentize/refactor all this, obviously
    if (value) {
      const { 'ISO 639-3': iso, Glottocode } = thisOne
      footerText = (
        <>
          GLOTTOCODE: {Glottocode || 'N/A'}
          <br />
          ISO 639-3: {iso || 'N/A'}
        </>
      )
    } else if (field === 'Language') {
      footerText = (
        <>
          <BiMapPin />
          {thisOne.Neighborhood || thisOne.Town}...
        </>
      )
    } else {
      footerText = (
        <>
          <BiUserVoice />
          {thisOne.Language}...
        </>
      )
    }

    return [
      ...all,
      ...superFilt.map((thing) => ({
        title: value ? thisOne.Language : thing,
        intro: value || field === 'Language' ? thisOne.Endonym : '',
        footer: footerText,
        to: value ? thisOne.Language : thing,
        icon: utils.deservesCardIcon(field, value) && (
          <SwatchOrFlagOrIcon
            field={value ? 'Language' : field}
            value={thing}
          />
        ),
      })),
    ]
  }, [] as Types.CardConfig[]) as Types.CardConfig[]

  return (
    <ExploreSubView instancesCount={uniqueInstances.length}>
      <CardList>
        {uniqueInstances.sort(utils.sortByTitle).map((instance) => (
          <CustomCard
            key={instance.title}
            {...instance}
            uniqueInstances={[]}
            url={`${url}/${instance.to}`}
          />
        ))}
      </CardList>
    </ExploreSubView>
  )
}
