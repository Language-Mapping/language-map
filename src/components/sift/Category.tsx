import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import * as Types from './types'
import * as utils from './utils'

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
      fontSize: 10,
    },
    instances: {
      fontSize: 10,
    },
    subtitle: {
      marginBottom: '0.5em',
      fontSize: 12,
    },
  })
)

export const Category: FC<Types.CategoryProps> = (props) => {
  const { title, url, subtitle, uniqueInstances, intro } = props
  const classes = useStyles()
  // TODO: sort examples/uniques ascending

  return (
    <Card
      raised
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // not sure what's up, this is valid
      component={Link}
      // to={`${url}/${name}`}
      to={url}
      classes={{ root: classes.categoryRoot }}
    >
      <CardContent>
        <Typography
          className={classes.intro}
          variant="overline"
          color="textSecondary"
          gutterBottom
        >
          {intro}
        </Typography>
        <Typography variant="h5" component="h4">
          {title}
        </Typography>
        <Typography className={classes.subtitle} color="textSecondary">
          {subtitle}
        </Typography>
        <Typography
          component="p"
          variant="caption"
          className={classes.instances}
        >
          {utils.prettyTruncate(uniqueInstances as string[])}
        </Typography>
      </CardContent>
    </Card>
  )
}
