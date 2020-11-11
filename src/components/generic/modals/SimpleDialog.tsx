import React, { FC } from 'react'
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles'
import {
  Dialog,
  DialogContent,
  DialogProps,
  useMediaQuery,
} from '@material-ui/core'

import { DialogCloseBtn } from './DialogCloseBtn'
import { SlideUp } from './SlideUp'

type StyleProps = {
  lessHorizPad?: boolean // e.g. for /table/:id "details" view
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContent: {
      padding: (props: StyleProps) =>
        `${theme.spacing(4)}px${props.lessHorizPad ? ' 0.5em' : ''}`,
    },
  })
)

// TODO: don't make close go back in history, or some other smooth way:
// https://stackoverflow.com/questions/47409586
export const SimpleDialog: FC<DialogProps & StyleProps> = (props) => {
  const { onClose, children, lessHorizPad } = props
  const classes = useStyles({ lessHorizPad })
  const theme = useTheme()
  const lilGuy = useMediaQuery(theme.breakpoints.only('xs'))

  return (
    <Dialog
      aria-labelledby="simple-modal-dialog-title"
      aria-describedby="simple-modal-dialog-description"
      maxWidth="md"
      fullScreen={lilGuy}
      TransitionComponent={SlideUp}
      {...props}
    >
      <DialogCloseBtn onClose={onClose} />
      <DialogContent className={classes.dialogContent}>
        {children}
      </DialogContent>
    </Dialog>
  )
}
