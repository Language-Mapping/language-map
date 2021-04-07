import React, { FC } from 'react'
import { CSSTransition } from 'react-transition-group'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

type SlideDownProps = {
  inProp: boolean
}

const useStyles = makeStyles((theme: Theme) => {
  const { palette } = theme

  return createStyles({
    root: {
      boxShadow: theme.shadows[24],
      backgroundColor: palette.background.paper,
      position: 'fixed',
      width: '100%',
      zIndex: 1,
      '& .alert-enter': {
        opacity: 0,
        transform: 'scale(0.9)',
      },
      '& .alert-enter-active': {
        opacity: 1,
        transform: 'translateX(0)',
        transition: 'opacity 300ms, transform 300ms',
      },
      '& .alert-exit': {
        opacity: 1,
      },
      '& .alert-exit-active': {
        opacity: 0,
        transform: 'scale(0.9)',
        transition: 'opacity 300ms, transform 300ms',
      },
    },
  })
})

export const SlideDown: FC<SlideDownProps> = (props) => {
  const { inProp, children } = props
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CSSTransition in={inProp} timeout={300} classNames="alert" unmountOnExit>
        <div>{children}</div>
      </CSSTransition>
    </div>
  )
}
