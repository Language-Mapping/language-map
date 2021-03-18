import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { LegendSwatch } from 'components/legend'
import { Explanation, SubtleText } from 'components/generic'
import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: '0.25rem',
    },
    list: {
      listStyleType: 'none',
      marginBottom: '0.75rem',
      marginTop: 0,
      paddingLeft: 0,
    },
    heading: {
      color: theme.palette.text.secondary,
      fontSize: '0.85rem',
      marginBottom: '0.25rem',
      textTransform: 'uppercase',
    },
    legendSummary: {
      whiteSpace: 'pre-line',
      marginBottom: '1rem',
    },
    sourceCredits: {
      marginTop: '0.75rem',
    },
  })
)

export const Legend: FC<Types.LegendProps> = (props) => {
  const { groupName, items, routeName, legendSummary, sourceCredits } = props
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography component="h4" className={classes.heading}>
        {groupName}
      </Typography>
      {legendSummary && (
        <Explanation className={classes.legendSummary}>
          {legendSummary}
        </Explanation>
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
        <SubtleText className={classes.sourceCredits}>
          <b>Sources:</b> {sourceCredits}
        </SubtleText>
      )}
    </div>
  )
}
