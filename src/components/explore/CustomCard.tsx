import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'

import * as Types from './types'
import * as utils from './utils'

type GlottoIsoFooterProps = { glotto?: string; iso?: string }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderColor: theme.palette.action.hover,
      borderStyle: 'solid',
      borderWidth: 1,
      padding: '0.5em',
      transition: 'all 300ms ease',
      '& > *': {
        lineHeight: 1.25,
        marginBottom: '0.25em',
      },
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
      marginBottom: '0.5em',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '1.1em',
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
    // Might be a list of examples or just a regular footer
    footer: {
      alignItems: 'center',
      color: theme.palette.text.secondary,
      display: 'inline-flex',
      fontSize: '0.5em',
      '& svg': {
        marginRight: '0.25em',
        fontSize: '1.25em',
        flexShrink: 0,
      },
    },
    accentBar: {
      backgroundColor: theme.palette.action.hover,
      borderRadius: 4,
      height: 2,
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
  const { title, url, uniqueInstances, intro, icon, footer, footerIcon } = props
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
      <Typography
        component="footer"
        variant="caption"
        className={classes.footer}
      >
        {footerIcon}
        {footer ||
          (uniqueInstances !== undefined &&
            utils.prettyTruncate(uniqueInstances as string[]))}
      </Typography>
    </Card>
  )
}
