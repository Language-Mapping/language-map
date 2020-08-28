import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelIntroRoot: {
      color: theme.palette.text.secondary,
      fontSize: 12,
      marginTop: 0,
      marginBottom: theme.spacing(1),
      // e.g. route links
      '& > a': {
        fontWeight: 'bold',
      },
    },
  })
)

export const PanelIntro: FC = ({ children }) => {
  const classes = useStyles()

  return (
    <>
      <p className={classes.panelIntroRoot}>{children}</p>
      <Divider />
    </>
  )
}
