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
      textAlign: 'center',
      borderBottom: `solid 1px ${theme.palette.divider}`,
      paddingBottom: '0.75rem',
    },
    titleAndIcon: {
      display: 'flex',
      fontSize: '2rem',
      lineHeight: 1.25,
      alignItems: 'center',
      textShadow: '1px 1px 3px hsla(0, 0%, 0%, 0.45)',
      justifyContent: 'center',
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
      fontSize: '1.25rem',
      marginTop: 0,
      lineHeight: 1,
      color: theme.palette.text.secondary,
    },
    // e.g. glotto/iso/global speakers
    subSubtitle: {
      fontSize: '0.65rem',
      margin: '0.5rem 0 0.25rem',
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
        <Typography
          component="h2"
          variant="h4"
          className={classes.titleAndIcon}
        >
          {icon}
          {title}
        </Typography>
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
