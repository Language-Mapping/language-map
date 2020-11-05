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
        borderColor: theme.palette.primary.dark,
        background: `radial-gradient(ellipse at top, ${theme.palette.primary.light}, transparent),
        radial-gradient(ellipse at bottom, ${theme.palette.primary.dark}, transparent)`,
      },
      '&:hover .accent-bar': {
        backgroundColor: theme.palette.primary.light,
        transform: 'scaleX(1), translateX(-100%)',
      },
    },
    intro: {
      fontSize: '0.75em',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      lineHeight: 1.25,
      // Icons, flags, swatches, etc.
      '& > :first-child': {
        flexShrink: 0,
        marginRight: '0.25em',
      },
      '& > svg': {
        fill: theme.palette.text.secondary,
      },
      '& > .country-flag': {
        height: '0.8em',
      },
    },
    instances: {
      fontSize: 10,
    },
    accentBar: {
      height: 2,
      borderRadius: 4,
      backgroundColor: theme.palette.action.hover,
      width: '60%',
      margin: '0.5em 0',
      transform: 'scaleX(0.5), translateX(100%)',
      transition: '300ms all ease-out',
    },
    subtitle: {
      fontSize: 12,
    },
  })
)

export const CustomCard: FC<Types.CategoryProps> = (props) => {
  const { title, url, uniqueInstances, intro, icon, footer } = props
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
      <div className={`${'accent-bar '}${classes.accentBar}`} />
      <Typography component="p" variant="caption" className={classes.instances}>
        {/* TODO: find the uniques here, not from a prop */}
        {footer || utils.prettyTruncate(uniqueInstances as string[])}
      </Typography>
    </Card>
  )
}
