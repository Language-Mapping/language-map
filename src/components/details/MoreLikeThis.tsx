import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { paths as routes } from 'components/config/routes'
import { LangRecordSchema } from '../../context/types'

type Goodies = Pick<LangRecordSchema, 'Language' | 'World Region' | 'Status'>
type Ya = {
  goodies: Goodies
}

type ImportantCols = keyof Goodies

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& > *': {
        flex: 1,
      },
    },
    list: {
      listStyle: 'none',
      display: 'flex',
      fontSize: 10,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      padding: 0,
    },
  })
)

export const MoreLikeThis: FC<Ya> = (props) => {
  const { goodies } = props
  const classes = useStyles()
  const { root, list } = classes
  const items = ['Language', 'World Region', 'Status'] as ImportantCols[]

  return (
    <div className={root}>
      <Typography variant="caption">Similar communities:</Typography>
      <ul className={list}>
        {items.map((item) => (
          <li key={item}>
            <RouterLink to={`${routes.grid}/${item}/${goodies[item]}`}>
              {item}
            </RouterLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
