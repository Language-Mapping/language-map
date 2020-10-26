import React, { FC, useContext, useState, useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { MdViewList, MdViewModule } from 'react-icons/md'

import { GlobalContext } from 'components'
import { Category } from './Category'
import * as Types from './types'
import { LangRecordSchema } from '../../context/types'

type ViewType = 'grid' | 'list'
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
      gridTemplateColumns: (props: { viewType: ViewType }) => {
        if (props.viewType === 'grid') {
          return '1fr 1fr'
        }

        return '1fr'
      },
      gridGap: '0.65em',
    },
  })
)

// TODO: into utils
const getUniqueInstances = (
  category: keyof LangRecordSchema,
  features: LangRecordSchema[],
  parse?: boolean
): unknown[] => {
  const uniqueInstances = features.reduce((all, thisOne) => {
    const value = thisOne[category]

    // Don't need `undefined` in our array
    if (!value || all.includes(value)) return all

    return [...all, value as string | number]
  }, [] as unknown[])

  return uniqueInstances
}

export const Categories: FC = () => {
  const { url } = useRouteMatch()
  const { state } = useContext(GlobalContext)
  const { langFeatsLenCache, langFeatures } = state
  const [categories, setCategories] = useState<Types.CategoryConfig[]>()
  const [listView, setListView] = useState<ViewType>('grid')
  const classes = useStyles({ viewType: listView })
  const { categoriesList } = classes

  // Prep categories
  useEffect((): void => {
    if (!langFeatsLenCache) return

    const preppedCats = categoriesConfig.map((category) => ({
      ...category,
      uniqueInstances: getUniqueInstances(
        category.name,
        langFeatures,
        category.parse
      ),
    }))

    setCategories(preppedCats)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langFeatsLenCache])

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextView: 'grid' | 'list'
  ) => {
    setListView(nextView)
  }

  return (
    <div className={classes.categoriesRoot}>
      <Typography variant="h4" component="h3">
        Available categories
      </Typography>
      <Typography variant="caption" component="p">
        This is a list of all the categories (aka columns, fields) we'd want to
        let the user explore through a drill-down hierachy.
      </Typography>
      <ToggleButtonGroup
        value={listView}
        size="small"
        exclusive
        onChange={handleChange}
      >
        <ToggleButton value="grid" aria-label="grid">
          <MdViewModule />
        </ToggleButton>
        <ToggleButton value="list" aria-label="list">
          <MdViewList />
        </ToggleButton>
      </ToggleButtonGroup>
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
