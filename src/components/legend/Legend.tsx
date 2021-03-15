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
      marginBottom: '0.75rem',
      marginTop: 0,
      paddingLeft: 0,
    },
    subtle: {
      fontSize: '0.65rem',
      whiteSpace: 'pre-line',
      color: theme.palette.text.secondary,
    },
    intro: {
      margin: '0 0 0.75rem',
    },
    sourceCredits: {
      margin: '0.5rem 0 0.75rem',
    },
  })
)

export const Legend: FC<Types.LegendProps> = (props) => {
  const { groupName, items, routeName, legendSummary, sourceCredits } = props
  const classes = useStyles()

  return (
    <div>
      <Typography component="h4" variant="overline">
        {groupName}
      </Typography>
      {legendSummary && (
        <Typography
          component="p"
          className={`${classes.subtle} ${classes.intro}`}
        >
          {legendSummary}
        </Typography>
      )}
      <ul className={classes.list}>
        {items.map((item) => {
          const { name, src_image: img, 'icon-size': size } = item

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
      {sourceCredits && (
        <Typography
          component="p"
          className={`${classes.subtle} ${classes.sourceCredits}`}
        >
          <b>Sources:</b> {sourceCredits}
        </Typography>
      )}
    </div>
  )
}
