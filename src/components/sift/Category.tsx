import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'

import * as Types from './types'
import * as utils from './utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      transition: 'all 300ms ease',
      borderColor: theme.palette.action.hover,
      borderWidth: 1,
      borderStyle: 'solid',
      padding: '0.5em',
      '&:hover': {
        borderColor: theme.palette.primary.light,
        background: `radial-gradient(ellipse at top, ${theme.palette.primary.light}, transparent),
        radial-gradient(ellipse at bottom, ${theme.palette.primary.dark}, transparent)`,
      },
    },
    intro: {
      fontSize: 10,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      lineHeight: 1.25,
      '& > svg': {
        marginRight: 4,
      },
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
  const { title, url, subtitle, uniqueInstances, intro, icon } = props
  const classes = useStyles()

  return (
    <Card
      raised
      classes={{ root: classes.root }}
      elevation={2}
      to={url}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // it's fine TS, chill out
      component={Link}
    >
      <Typography
        className={classes.intro}
        variant="overline"
        color="textSecondary"
        gutterBottom
      >
        {intro}
      </Typography>
      <Typography variant="h6" component="header" className={classes.header}>
        {icon}
        {title}
      </Typography>
      <Typography className={classes.subtitle} color="textSecondary">
        {subtitle}
      </Typography>
      <Typography component="p" variant="caption" className={classes.instances}>
        {utils.prettyTruncate(uniqueInstances as string[])}
      </Typography>
    </Card>
  )
}
