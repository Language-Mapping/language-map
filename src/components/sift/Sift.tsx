import React, { FC, useContext } from 'react'
import { useRouteMatch, useParams } from 'react-router-dom'

import { GlobalContext } from 'components'
import { SwatchOnly } from 'components/legend'
import { BiMapPin } from 'react-icons/bi'
import { CustomCard } from './CustomCard'
import { CardList } from './CardList'
import { PanelContent } from '../panels/PanelContent'
import * as Types from './types'
import * as config from './config'
import * as utils from './utils'
import { getSwatchColorByConfig } from '../legend/utils'
import { FlagWithTitle } from './FlagWithTitle'

// TODO: rename components and this file. Mv components into new files..
const SwatchOrFlagOrIcon: FC<Types.SwatchOrFlagOrIcon> = (props) => {
  const { field, value } = props

  if (field === 'World Region' && value) {
    return <SwatchOnly backgroundColor={getSwatchColorByConfig(value)} />
  }

  if (field === 'Countries' && value) {
    return <FlagWithTitle omitText countryName={value as string} />
  }

  return <>{config.categories.find(({ name }) => name === field)?.icon}</>
}

export const Field: FC<{ instancesCount: number }> = (props) => {
  const { children, instancesCount } = props
  const { field, value, language } = useParams() as Types.RouteMatch
  const { state } = useContext(GlobalContext)

  // TODO: panel
  if (!state.langFeatsLenCache) return <p>Loading communities...</p>

  return (
    <PanelContent
      title={language || value || field}
      icon={
        <SwatchOrFlagOrIcon
          field={language ? 'Language' : field}
          value={value}
        />
      }
      intro={instancesCount ? `${instancesCount} items` : ''}
    >
      {(instancesCount && children) || 'No communities available.'}
    </PanelContent>
  )
}

export const SomeMidLevel: FC = () => {
  const { field, value } = useParams() as Types.RouteMatch
  const { url } = useRouteMatch()
  const { state } = useContext(GlobalContext)
  const { langFeatures } = state

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // not for lack of trying
  const uniqueInstances = langFeatures.reduce((all, thisOne) => {
    const currVal = thisOne[field]?.toString()

    // Filter out non-matches
    if (value && currVal && currVal !== value) return all

    const thingToUse = value ? thisOne.Language : currVal // value: 24/7 truthy?
    const shouldParse = thingToUse?.includes(', ')
    const finalThing = shouldParse ? thingToUse?.split(', ')[0] : thingToUse

    if (all.find((item) => item.title === finalThing)) return all

    // TODO: make this work for Neighbs/Countries. Currently only the primary
    // ends up in the list, so secondary-only countries will never show up.
    const cardConfig = {
      title: finalThing,
      intro: value || field === 'Language' ? thisOne.Endonym : 'COUNT',
      footer: value ? 'examples...' : 'show examples...',
      to: finalThing,
      icon: (
        <SwatchOrFlagOrIcon
          field={value ? 'Language' : field}
          value={finalThing}
        />
      ),
    }

    return [...all, cardConfig]
  }, [] as Types.CardConfig[]) as Types.CardConfig[]

  return (
    <Field instancesCount={uniqueInstances.length}>
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
    </Field>
  )
}

export const PreDeets: FC = () => {
  const { field, value, language } = useParams() as Types.RouteMatch
  const { state } = useContext(GlobalContext)
  const { langFeatures } = state

  // TODO: make work with /Explore/Language/Name
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // not for lack of trying
  const uniqueInstances = langFeatures.reduce((all, thisOne) => {
    const addlParam = thisOne[field]?.toString()

    // Filter out non-matches
    if (addlParam && addlParam !== value) return all
    if (language !== thisOne.Language) return all

    const primaryHood = thisOne.Neighborhoods?.split(', ')[0] || thisOne.Town

    if (all.find((item) => item.title === primaryHood)) return all

    const cardConfig = {
      title: primaryHood,
      intro: 'ANYTHING HERE?',
      footer: `${thisOne.Description.slice(0, 100).trimEnd()}...`,
      to: thisOne.ID,
      icon: <BiMapPin />,
    }

    return [...all, cardConfig]
  }, [] as Types.CardConfig[]) as Types.CardConfig[]

  return (
    <Field instancesCount={uniqueInstances.length}>
      <CardList>
        {uniqueInstances.sort(utils.sortByTitle).map((instance) => (
          <CustomCard
            key={instance.title}
            {...instance}
            uniqueInstances={[]}
            url={`/details/${instance.to}`}
          />
        ))}
      </CardList>
    </Field>
  )
}
