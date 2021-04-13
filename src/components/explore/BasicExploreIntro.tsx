import React, { FC } from 'react'
import { Route } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Grow, Typography } from '@material-ui/core'

import { FiltersWarning } from 'components/home/FiltersWarning'
import { Explanation } from 'components/generic'
import { routes } from 'components/config/api'
import { BasicExploreIntroProps } from './types'
import { PanelIntroTitle, PanelIntroSubtitle } from './PanelIntroTitleSubtitle'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottom: `solid 1px ${theme.palette.divider}`,
      fontSize: '1.25rem',
      marginBottom: '1.25rem',
      paddingBottom: '0.5rem',
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
  const { title, icon, subtitle, expand, noAppear } = props
  const { subSubtitle, extree, introParagraph } = props
  const classes = useStyles()

  return (
    <Grow
      in={expand !== false}
      timeout={noAppear ? 0 : 500}
      style={{ transformOrigin: 'top center' }}
      appear={!noAppear}
    >
      <div>
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
        <Route path={routes.explore}>
          <FiltersWarning />
        </Route>
      </div>
    </Grow>
  )
}
