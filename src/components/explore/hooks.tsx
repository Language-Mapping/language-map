import React, { useContext } from 'react'
import { BiMapPin } from 'react-icons/bi'

import { GlobalContext } from 'components/context'
import * as Types from './types'

/**
 * Create unique instances (based on primary neighborhood or town) for Cards
 * @param value Route parameter. See /components/panels/config.tsx for setup
 * @param language Route parameter, e.g. /Explore/Country/Egypt/language
 */
export const useUniqueInstances = (
  value: string | undefined,
  language: string | undefined
): Types.CardConfig[] => {
  const { state } = useContext(GlobalContext)
  const { langFeatures } = state
  const icon = <BiMapPin />
  const footer = 'Click to show in map and display details'

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // not for lack of trying
  return langFeatures.reduce((all, thisOne) => {
    const { Neighborhood, Town, Language } = thisOne

    // Deep depth
    if (language) {
      if (Language !== language) return all
    } else if (Language !== value) return all

    if (!Neighborhood && all.find((item) => item.title === Town)) return all

    const common = { footer, to: thisOne.id, icon }

    if (!Neighborhood) return [...all, { title: Town, ...common }]

    return [
      ...all,
      ...Neighborhood.split(', ')
        .filter((hood) => !all.find((item) => item.title === hood))
        .map((hood) => ({ title: hood, ...common })),
    ]
  }, [] as Types.CardConfig[]) as Types.CardConfig[]
}
