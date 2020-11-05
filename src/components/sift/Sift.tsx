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

export const PreDeets: FC<{ noNest?: boolean }> = (props) => {
  const { noNest } = props
  const { field, value, language } = useParams() as Types.RouteMatch
  const { state } = useContext(GlobalContext)
  const { langFeatures } = state

  // TODO: make work with /Explore/Language/Name
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // not for lack of trying
  const uniqueInstances = langFeatures.reduce((all, thisOne) => {
    const currValue = thisOne[noNest ? 'Language' : field]?.toString()

    if (!noNest && !currValue) return all
    if (!noNest && currValue && currValue !== value) return all
    if (noNest && currValue !== value) return all
    const { Neighborhoods, Town, Language } = thisOne

    if (language && language !== Language) return all
    if (!Neighborhoods && all.find((item) => item.title === Town)) return all

    const footer = `${thisOne.Description.slice(0, 100).trimEnd()}...`

    if (!Neighborhoods) {
      return [
        ...all,
        {
          title: Town,
          intro: 'ANYTHING HERE?',
          footer,
          to: thisOne.ID,
          icon: <BiMapPin />,
        },
      ]
    }

    const hoods = Neighborhoods.split(', ')
      .filter((hood) => {
        return !all.find((item) => item.title === hood)
      })
      .map((hood) => ({
        title: hood,
        intro: 'ANYTHING HERE?',
        footer,
        to: thisOne.ID,
        icon: <BiMapPin />,
      }))

    return [...all, ...hoods]
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
