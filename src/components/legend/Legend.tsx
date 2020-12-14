import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { LegendSwatch } from 'components/legend'
import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      listStyleType: 'none',
      marginBottom: theme.spacing(1),
      marginTop: 0,
      paddingLeft: 0,
    },
  })
)

export const Legend: FC<Types.PreppedLegend> = (props) => {
  const { groupName, items, routeName } = props
  const classes = useStyles()

  return (
    <div>
      <Typography component="h4" variant="overline">
        {groupName}
      </Typography>
      <ul className={classes.list}>
        {items.map((item) => {
          const { name, src_img: img, 'icon-size': size } = item

          return (
            <LegendSwatch
              key={name}
              icon={img ? img[0].url : undefined}
              iconID={item['icon-image'] || '_circle'}
              size={size ? size * 20 : 5}
              legendLabel={name}
              backgroundColor={item['icon-color']}
              to={routeName ? `/Explore/${routeName}/${name}` : undefined}
              component={routeName ? RouterLink : 'li'}
            />
          )
        })}
      </ul>
    </div>
  )
}
