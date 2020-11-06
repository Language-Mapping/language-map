import React, { FC, useContext } from 'react'
import { useRouteMatch, useParams } from 'react-router-dom'

import { GlobalContext } from 'components'
import { SwatchOnly } from 'components/legend'
import { BiMapPin, BiUserVoice } from 'react-icons/bi'
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

export const Field: FC<Types.Field> = (props) => {
  const { children, instancesCount, subtitle, subSubtitle } = props
  const { field, value, language } = useParams() as Types.RouteMatch
  const { state } = useContext(GlobalContext)
  const isLanguageField = useRouteMatch('/Explore/Language')

  if (!state.langFeatsLenCache)
    return <PanelContent title="Loading communities..." />

  return (
    <PanelContent
      title={language || value || field}
      intro={utils.pluralTextIfNeeded(instancesCount)}
      icon={
        <SwatchOrFlagOrIcon
          field={
            /* eslint-disable operator-linebreak */
            language || field === 'Language' || isLanguageField
              ? 'Language'
              : field
            /* eslint-enable operator-linebreak */
          }
          value={value}
        />
      }
      subtitle={subtitle}
      subSubtitle={subSubtitle}
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
          Example/s: {thisOne.Neighborhood || thisOne.Town}
        </>
      )
    } else {
      footerText = (
        <>
          <BiUserVoice />
          Example: {thisOne.Language}
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

  // TODO: find more efficient way of getting this
  const sampleRecord = langFeatures.find(
    ({ Language }) => Language === (language || value)
  )

  const { 'ISO 639-3': iso, Glottocode, Endonym } = sampleRecord || {}

  return (
    <Field
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
    </Field>
  )
}
