import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

type ContainerLayoutType = {
  children: React.ReactChild
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(8),
    },
  })
)

export const ContainerLayout: FC<ContainerLayoutType> = ({ children }) => {
  const classes = useStyles()

  return (
    <Container maxWidth="md" className={classes.root}>
      {children}
    </Container>
  )
}
