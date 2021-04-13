import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Grow, Card, Typography } from '@material-ui/core'

import * as Types from './types'
import * as utils from './utils'

type GlottoIsoFooterProps = { glotto?: string; iso?: string }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderColor: theme.palette.action.hover,
      borderStyle: 'solid',
      borderWidth: 1,
      padding: '0.75rem 0.65rem',
      transition: 'all 300ms ease',
      '&:hover': {
        borderColor: theme.palette.secondary.dark,
        background: `radial-gradient(ellipse at top, ${theme.palette.secondary.light}, transparent),
        radial-gradient(ellipse at bottom, ${theme.palette.secondary.dark}, transparent)`,
      },
      '&:hover .accent-bar': {
        backgroundColor: theme.palette.secondary.light,
        transform: 'scaleX(1), translateX(-100%)',
      },
    },
    intro: {
      color: theme.palette.text.secondary,
      display: 'block',
      fontSize: '0.75rem',
      marginBottom: '0.5rem',
      textTransform: 'uppercase',
      [theme.breakpoints.only('xs')]: {
        marginBottom: '0.25rem',
      },
    },
    header: {
      fontSize: '1.15rem',
      lineHeight: 1.25,
      marginBottom: '0.5rem',
      // Icons, flags, swatches, etc.
      '& > :first-child': {
        marginRight: '0.25em',
        display: 'inline-block',
      },
      '& svg': {
        fill: theme.palette.text.secondary,
        verticalAlign: -3, // react-icons don't line up
      },
      '& > .country-flag': {
        height: '0.85rem',
      },
    },
    // Might be a list of examples or just a regular footer
    // CRED: 🏅 https://css-tricks.com/almanac/properties/l/line-clamp/
    footer: {
      alignItems: 'center',
      color: theme.palette.text.secondary,
      fontSize: '0.65rem',
      display: '-webkit-box',
      lineHeight: 1.5,
      overflow: 'hidden',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 3,
      [theme.breakpoints.only('xs')]: {
        fontSize: '0.5rem',
      },
    },
    accentBar: {
      backgroundColor: theme.palette.action.hover,
      borderRadius: 4,
      height: 2,
      marginBottom: '0.5rem',
      marginLeft: 'auto',
      marginRight: 'auto',
      transform: 'scaleX(0.5), translateX(100%)',
      transition: '300ms all ease-out',
      width: '80%',
    },
    subtitle: {
      fontSize: 12,
    },
  })
)

export const GlottoIsoFooter: FC<GlottoIsoFooterProps> = (props) => {
  const { glotto, iso } = props

  return (
    <>
      GLOTTOCODE: {glotto || 'N/A'}
      <br />
      ISO 639-3: {iso || 'N/A'}
    </>
  )
}

export const CustomCard: FC<Types.CustomCardProps> = (props) => {
  const { title, url, uniqueInstances, intro, icon, footer } = props
  const { timeout = 350, noAnimate } = props
  const classes = useStyles()

  const Content = (
    <Card
      raised
      classes={{ root: classes.root }}
      elevation={2}
      to={url}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // it's fine TS, chill out
      component={Link}
    >
      {intro && <Typography className={classes.intro}>{intro}</Typography>}
      <Typography variant="h6" component="header" className={classes.header}>
        {icon}
        {title}
      </Typography>
      <div className={`${'accent-bar '}${classes.accentBar}`} />
      <Typography
        component="footer"
        variant="caption"
        className={classes.footer}
      >
        {footer ||
          (uniqueInstances !== undefined &&
            utils.prettyTruncate(uniqueInstances as string[]))}
      </Typography>
    </Card>
  )

  if (noAnimate) return Content

  return (
    <Grow in timeout={timeout}>
      {Content}
    </Grow>
  )
}
