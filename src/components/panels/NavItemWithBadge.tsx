import React, { FC, useContext } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Badge } from '@material-ui/core'

import { GlobalContext } from 'components/context'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    badgeRoot: {
      backgroundColor: theme.palette.warning.light,
      marginLeft: -4,
    },
  })
)

export const NavItemWithBadge: FC = (props) => {
  const { state } = useContext(GlobalContext)
  const { children } = props
  const classes = useStyles()

  return (
    <Badge
      variant="dot"
      classes={{ dot: classes.badgeRoot }}
      badgeContent=""
      color="secondary"
      overlap="circle"
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      invisible={state.langFeatsLenCache === state.langFeatures.length}
    >
      {children}
    </Badge>
  )
}
