import React, { FC, useContext, useState, useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { GlobalContext } from 'components'
import { Category } from './Category'
import * as Types from './types'
import * as utils from './utils'

const categoriesConfig = [
  { name: 'Language', summary: 'The basis of all life' },
  { name: 'Endonym', summary: 'Like Language but not' },
  { name: 'World Region', summary: 'Colors! Colors.' },
  { name: 'Countries', summary: 'Where it is spoken', parse: true },
  { name: 'Language Family', summary: 'Not much variety' },
  { name: 'Neighborhoods', summary: 'Only NYC', parse: true },
  { name: 'Status', summary: 'Maybe this too' },
] as Omit<Types.CategoryConfig, 'uniqueInstances'>[]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    categoriesRoot: {
      '& > *': {
        marginBottom: '0.65rem',
      },
    },
    categoriesList: {
      display: 'grid',
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr 1fr',
      gridGap: '0.65em',
    },
  })
)

export const Categories: FC = () => {
  const { url } = useRouteMatch()
  const { state } = useContext(GlobalContext)
  const { langFeatsLenCache, langFeatures } = state
  const [categories, setCategories] = useState<Types.CategoryConfig[]>()
  const classes = useStyles()
  const { categoriesList } = classes

  // Prep categories
  useEffect((): void => {
    if (!langFeatsLenCache) return

    const preppedCats = categoriesConfig.map((category) => ({
      ...category,
      uniqueInstances: utils.getUniqueInstances(
        category.name,
        langFeatures,
        category.parse
      ),
    }))

    setCategories(preppedCats)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langFeatsLenCache])

  return (
    <div className={classes.categoriesRoot}>
      {/* TODO: reuse and make dynamic */}
      <Typography variant="h4" component="h3">
        Explore
      </Typography>
      <Typography variant="caption" component="p">
        This is a list of all the categories (aka columns, fields) we'd want to
        let the user explore through a drill-down hierachy.
      </Typography>
      <div className={categoriesList}>
        {categoriesConfig &&
          categories &&
          categories.map((category) => (
            <Category key={category.name} url={url} {...category} />
          ))}
      </div>
    </div>
  )
}
