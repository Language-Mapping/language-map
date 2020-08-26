import React, { FC } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

type ToggleableProps = {
  show: boolean
}

const useStyles = makeStyles(() =>
  createStyles({
    toggleableRoot: {
      display: 'flex',
      flexDirection: 'column',
    },
    innerContent: {
      flex: (props: ToggleableProps) => (props.show ? 1 : 0),
      maxHeight: (props: ToggleableProps) => (props.show ? 300 : 0),
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
    <div className={classes.toggleableRoot}>
      <div className={classes.innerContent}>{children}</div>
    </div>
  )
}
