import React, { FC, useContext, useState, useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

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

export const CategoriesEasy: FC = (props) => {
  const { children } = props
  const classes = useStyles()

  return <div className={classes.root}>{children}</div>
}

export const Categories: FC = () => {
  const { url } = useRouteMatch()
  const { state } = useContext(GlobalContext)
  const { langFeatsLenCache, langFeatures } = state
  const [categories, setCategories] = useState<Types.CategoryProps[]>([])
  const classes = useStyles()

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

  return (
    <PanelContent
      title="Explore"
      intro="This is a list of all the categories (aka columns, fields) we'd want to let the user explore through a drill-down hierachy."
    >
      <div className={classes.root}>
        {categories.map((category) => (
          <Category key={category.title} {...category} />
        ))}
      </div>
    </PanelContent>
  )
}
