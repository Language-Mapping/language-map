import React, { FC } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

type ToggleableProps = {
  show: boolean
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '0.25em',
    },
    innerContent: {
      flex: (props: ToggleableProps) => (props.show ? 1 : 0),
      maxHeight: (props: ToggleableProps) => (props.show ? 500 : 0),
      opacity: (props: ToggleableProps) => (props.show ? 1 : 0),
      height: 'auto',
      overflow: 'hidden',
      transition: '300ms all',
    },
  })
)

export const ToggleableSection: FC<ToggleableProps> = (props) => {
  const { children, show } = props
  const classes = useStyles({ show })

  return (
    <div className={classes.root}>
      <div className={classes.innerContent}>{children}</div>
    </div>
  )
}
