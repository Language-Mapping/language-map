import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

type StyleProps = {
  showShareBtns?: boolean
}

type ShareButtonsWrapProps = StyleProps & {
  shareText: React.ReactNode
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxHeight: (props: StyleProps) => (props.showShareBtns ? 75 : 0),
      opacity: (props: StyleProps) => (props.showShareBtns ? 1 : 0),
      textAlign: 'center',
      transition: '300ms all',
    },
    shareBtnHeading: {
      fontSize: '0.75rem',
      marginBottom: '0.5rem',
    },
  })
)

export const ShareButtonsWrap: FC<ShareButtonsWrapProps> = (props) => {
  const { children, showShareBtns, shareText } = props
  const classes = useStyles({ showShareBtns })

  if (!showShareBtns) return <div className={classes.root} />

  return (
    <div className={classes.root}>
      <Typography className={classes.shareBtnHeading}>
        Share this {shareText}:
      </Typography>
      {children}
    </div>
  )
}
