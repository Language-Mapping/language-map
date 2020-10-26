import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    categoryRoot: {
      transition: 'all 300ms ease',
      transform: 'scale(1)',
      backgroundColor: theme.palette.background.default,
      '&:hover': {
        transform: 'scale(1.02)',
        backgroundColor: theme.palette.primary.main,
      },
    },
    intro: {
      // fontSize: 8,
    },
    instances: {
      fontSize: 10,
    },
    summary: {
      marginBottom: '0.5em',
      fontSize: 12,
    },
  })
)

export const Category: FC<Types.CategoryProps> = (props) => {
  const { name, url, summary, uniqueInstances } = props
  const classes = useStyles()
  // TODO: shuffle the order of uniques each time

  return (
    <Card
      raised
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // not sure what's up, this is valid
      component={Link}
      to={`${url}/${name}`}
      classes={{ root: classes.categoryRoot }}
    >
      <CardContent>
        <Typography
          className={classes.intro}
          variant="overline"
          color="textSecondary"
          gutterBottom
        >
          {uniqueInstances.length} unique values
        </Typography>
        <Typography variant="h5" component="h4">
          {name}
        </Typography>
        <Typography className={classes.summary} color="textSecondary">
          {summary}
        </Typography>
        <Typography
          component="p"
          variant="caption"
          className={classes.instances}
        >
          {uniqueInstances[0]}, {uniqueInstances[1]}, {uniqueInstances[2]},{' '}
          {uniqueInstances[3]}, {uniqueInstances[4]}...
        </Typography>
      </CardContent>
    </Card>
  )
}
