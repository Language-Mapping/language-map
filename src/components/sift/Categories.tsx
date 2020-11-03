import React, { FC, useContext, useState, useEffect } from 'react'
import { useRouteMatch, Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Link } from '@material-ui/core'

import { GlobalContext } from 'components'
import { PanelContent } from 'components/panels'
import { Category } from './Category'
import * as Types from './types'
import * as utils from './utils'
import * as config from './config'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridRowGap: '0.5em',
      gridColumnGap: '0.5em',
    },
  })
)

export const CategoriesWrap: FC = (props) => {
  const { children } = props
  const classes = useStyles()

  return <div className={classes.root}>{children}</div>
}

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
        intro: `${uniqueInstances.length} instances (inc. filts)`,
        title: category.name,
        url: `${url}/${category.name}`,
        subtitle: category.definition,
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
      <CategoriesWrap>
        {categories.map((category) => (
          <Category key={category.title} {...category} />
        ))}
      </CategoriesWrap>
    </PanelContent>
  )
}
