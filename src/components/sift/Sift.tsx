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

// TODO: forgot about `Status`. Include it.
// TODO: rename components and this file. Mv components into new files..
const SwatchOrFlagOrIcon: FC<Types.SwatchOrFlagOrIcon> = (props) => {
  const { field, value } = props

  if (field === 'World Region' && value) {
    return <SwatchOnly backgroundColor={getSwatchColorByConfig(value)} />
  }

  if (field === 'Country' && value) {
    return <FlagWithTitle omitText countryName={value as string} />
  }

  return <>{config.categories.find(({ name }) => name === field)?.icon}</>
}

export const Field: FC<{ instancesCount: number }> = (props) => {
  const { children, instancesCount } = props
  const { field, value, language } = useParams() as Types.RouteMatch
  const { state } = useContext(GlobalContext)

  if (!state.langFeatsLenCache)
    return <PanelContent title="Loading communities..." />

  return (
    <PanelContent
      title={language || value || field}
      icon={
        <SwatchOrFlagOrIcon
          field={language ? 'Language' : field}
          value={value}
        />
      }
      intro={
        /* eslint-disable operator-linebreak */
        // TODO: reusable util
        instancesCount
          ? `${instancesCount} item${instancesCount > 1 ? 's' : ''}`
          : ''
        /* eslint-enable operator-linebreak */
      }
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

  if (!langFeatures.length) return <Field instancesCount={0} />

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
  } else if (['Neighborhood', 'Macro-Community'].includes(field)) {
    // Make sure no undefined
    filtered = langFeatures.filter((feat) => feat[field] !== undefined)
  } else {
    filtered = langFeatures
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // not for lack of trying
  const uniqueInstances = filtered.reduce((all, thisOne) => {
    const asArray = thisOne[fieldInQuestion]?.toString().split(', ')
    const superFilt = asArray?.filter((mannn) => {
      return !all.find((wow) => wow.title === mannn)
    })

    if (!superFilt) return all

    return [
      ...all,
      ...superFilt.map((thing) => ({
        title: value ? thisOne.Language : thing,
        intro: value || field === 'Language' ? thisOne.Endonym : 'COUNT',
        footer: 'examples...',
        to: value ? thisOne.Language : thing,
        icon: (
          <SwatchOrFlagOrIcon
            field={value ? 'Language' : field}
            value={thing}
          />
        ),
      })),
    ]
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
