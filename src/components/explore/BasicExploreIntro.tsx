import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { FiltersWarning } from 'components/home/FiltersWarning'
import { Explanation } from 'components/generic'
import { BasicExploreIntroProps } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: '1rem',
      borderBottom: `solid 1px ${theme.palette.divider}`,
      paddingBottom: '0.75rem',
    },
    titleAndIcon: {
      alignItems: 'center',
      display: 'flex',
      fontSize: '2rem',
      justifyContent: 'center',
      lineHeight: 1.25,
      marginBottom: '0.5rem',
      textAlign: 'center',
      textShadow: '1px 1px 3px hsla(0, 0%, 0%, 0.45)',
      '& svg': {
        color: theme.palette.text.secondary,
      },
      '& > :first-child': {
        marginRight: '0.5rem',
      },
    },
    // FIXME: long lines like "Central African Republic" (flex/wrap weird)
    // titleText: {
    // flex: 0, // makes super long words not create too much empty space
    // },
    // e.g. Endonym
    subtitle: {
      color: theme.palette.text.secondary,
      fontSize: '1.25rem',
      lineHeight: 1,
      marginTop: 0,
      marginBottom: '0.75rem',
      textAlign: 'center',
    },
    // e.g. glotto/iso/global speakers
    subSubtitle: {
      color: theme.palette.text.secondary,
    },
  })
)

export const BasicExploreIntro: FC<BasicExploreIntroProps> = (props) => {
  const { title, icon, subtitle } = props
  const { subSubtitle, extree, introParagraph } = props
  const classes = useStyles()

  return (
    <>
      <Typography className={classes.root} component="header">
        {title && (
          <Typography
            component="h2"
            variant="h4"
            className={classes.titleAndIcon}
          >
            {icon}
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography className={classes.subtitle}>{subtitle}</Typography>
        )}
        {subSubtitle && (
          <div className={classes.subSubtitle}>{subSubtitle}</div>
        )}
        {introParagraph && <Explanation>{introParagraph}</Explanation>}
        {extree}
      </Typography>
      <FiltersWarning />
    </>
  )
}
