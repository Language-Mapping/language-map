import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

type ContainerLayoutComponent = {
  children: React.ReactChild
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerRoot: {
      marginTop: theme.spacing(8),
    },
  })
)

export const ContainerLayout: FC<ContainerLayoutComponent> = ({ children }) => {
  const classes = useStyles()

  return (
    <Container maxWidth="md" className={classes.containerRoot}>
      {children}
    </Container>
  )
}
