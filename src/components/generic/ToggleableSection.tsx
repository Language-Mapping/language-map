import React, { FC } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

type ToggleableProps = {
  show: boolean
  initialHeight?: number | string
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    innerContent: {
      flex: (props: ToggleableProps) => (props.show ? 1 : 0),
      maxHeight: (props: ToggleableProps) =>
        props.show ? 500 : props.initialHeight,
      opacity: ({ initialHeight, show }: ToggleableProps) =>
        initialHeight || show ? 1 : 0,
      height: 'auto',
      overflow: 'hidden',
      transition: '300ms all',
    },
  })
)

// TODO: consider ellipsizing with `line-clamp`:
// https://css-tricks.com/multiline-truncated-text-with-show-more-button/
// https://css-tricks.com/almanac/properties/l/line-clamp/
export const ToggleableSection: FC<ToggleableProps> = (props) => {
  const { children, show, initialHeight = 0 } = props
  const classes = useStyles({ show, initialHeight })

  return (
    <div className={classes.root}>
      <div className={classes.innerContent}>{children}</div>
    </div>
  )
}
