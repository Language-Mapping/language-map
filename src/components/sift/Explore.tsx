import React, { FC, useContext, useState, useEffect } from 'react'
import { useRouteMatch, Link as RouterLink } from 'react-router-dom'
import { Link } from '@material-ui/core'

import { GlobalContext } from 'components'
import { PanelContent } from 'components/panels'
import { CustomCard } from './CustomCard'
import { CardList } from './CardList'
import * as Types from './types'
import * as utils from './utils'
import * as config from './config'

// The top-level "/Explore" route as a landing page index to explorable fields
export const Explore: FC<{ icon: React.ReactNode }> = (props) => {
  const { icon } = props
  const { url } = useRouteMatch()
  const { state } = useContext(GlobalContext)
  const { langFeatsLenCache, langFeatures } = state
  const [categories, setCategories] = useState<Types.CategoryProps[]>([])

  // Prep categories
  useEffect((): void => {
    if (!langFeatsLenCache) return

    const preppedCats = config.categories.map((category) => {
      const uniqueInstances = utils.getUniqueInstances(
        category.name,
        langFeatures,
        category.parse
      )

      return {
        intro: `${uniqueInstances.length} item${
          uniqueInstances.length > 1 ? 's' : ''
        }`,
        title: category.name,
        url: `${url}/${category.name}`,
        icon: category.icon,
        uniqueInstances,
      }
    })

    setCategories(preppedCats)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langFeatsLenCache])

  const intro = (
    <>
      For an explanation of the options below, visit{' '}
      <Link component={RouterLink} to="/help">
        Help
      </Link>{' '}
      for definitions and additional info.
    </>
  )

  return (
    <PanelContent title="Explore" icon={icon} intro={intro}>
      <CardList>
        {categories.map((category) => (
          <CustomCard key={category.title} {...category} />
        ))}
      </CardList>
    </PanelContent>
  )
}
