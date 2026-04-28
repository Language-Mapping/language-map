import React, { FC, PropsWithChildren } from 'react'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { Typography } from '@mui/material'

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

export const ShareButtonsWrap: FC<PropsWithChildren<ShareButtonsWrapProps>> = (
  props
) => {
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
