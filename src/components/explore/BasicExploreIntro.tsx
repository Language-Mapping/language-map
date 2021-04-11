import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { FiltersWarning } from 'components/home/FiltersWarning'
import { Explanation } from 'components/generic'
import { BasicExploreIntroProps } from './types'
import { PanelIntroTitle, PanelIntroSubtitle } from './PanelIntroTitleSubtitle'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottom: `solid 1px ${theme.palette.divider}`,
      fontSize: '1.25rem',
      marginBottom: '1.25rem',
      paddingBottom: '0.25rem',
      '& p': {
        marginBottom: '0.25rem',
      },
    },
    // FIXME: long lines like "Central African Republic" (flex/wrap weird)
    // titleText: {
    // flex: 0, // makes super long words not create too much empty space
    // },
    // e.g. glotto/iso/global speakers
    subSubtitle: {
      color: theme.palette.text.secondary,
    },
    // Override Explanation
    introParagraph: {
      color: theme.palette.text.primary,
      fontSize: '0.75rem',
      lineHeight: 1.65,
      [theme.breakpoints.up('xl')]: {
        fontSize: '0.85rem',
      },
      [theme.breakpoints.only('sm')]: {
        fontSize: '0.85rem',
      },
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
          <PanelIntroTitle>
            {icon}
            {title}
          </PanelIntroTitle>
        )}
        {subtitle && <PanelIntroSubtitle>{subtitle}</PanelIntroSubtitle>}
        {subSubtitle && (
          <div className={classes.subSubtitle}>{subSubtitle}</div>
        )}
        {introParagraph && (
          <Explanation className={classes.introParagraph}>
            {introParagraph}
          </Explanation>
        )}
        {extree}
      </Typography>
      <FiltersWarning />
    </>
  )
}
