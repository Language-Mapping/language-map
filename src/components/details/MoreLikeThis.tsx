import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Chip, Avatar } from '@material-ui/core'

import { paths as routes } from 'components/config/routes'
import { LangRecordSchema } from '../../context/types'

type ImportantCols = Pick<
  LangRecordSchema,
  'Language' | 'World Region' | 'Status'
>
type ColumnKeys = keyof ImportantCols
type MoreLikeThis = {
  goodies: ImportantCols
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      listStyle: 'none',
      fontSize: 10,
      padding: 0,
      '& > * + *': {
        margin: '0 4px',
      },
    },
  })
)

export const MoreLikeThis: FC<MoreLikeThis> = (props) => {
  const { goodies } = props
  const classes = useStyles()
  const items = ['Language', 'World Region', 'Status'] as ColumnKeys[]

  return (
    <div className={classes.root}>
      {items.map((item) => (
        <Chip
          key={item}
          component={RouterLink}
          size="small"
          color="secondary"
          avatar={<Avatar>{goodies[item][0]}</Avatar>}
          label={goodies[item]}
          to={`${routes.grid}/${item}/${goodies[item]}`}
        />
      ))}
    </div>
  )
}
