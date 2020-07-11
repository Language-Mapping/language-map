import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LegendSwatch } from 'components/map'
import { LegendSwatchType } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    legendRoot: {
      listStyleType: 'none',
      paddingLeft: theme.spacing(2),
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
)

type LegendType = {
  items: LegendSwatchType[]
}

export const Legend: FC<LegendType> = ({ items }) => {
  const classes = useStyles()

  return (
    <ul className={classes.legendRoot}>
      {items.map((item) => (
        <LegendSwatch key={item.text} {...item} />
      ))}
    </ul>
  )
}
