import React, { FC, useContext } from 'react'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { Badge } from '@mui/material'

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
      overlap="circular"
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      invisible={state.langFeatsLenCache === state.langFeatures.length}
    >
      {children}
    </Badge>
  )
}
