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
  Slide,
  useMediaQuery,
} from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'

import { DialogCloseBtn } from 'components'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContent: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
  })
)

const Transition = React.forwardRef(function Transition(
  // Don't care, came straight from the MUI example
  // eslint-disable-next-line react/require-default-props, @typescript-eslint/no-explicit-any
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

// TODO: don't make close go back in history, or some other smooth way:
// https://stackoverflow.com/questions/47409586
export const SimpleDialog: FC<DialogProps> = (props) => {
  const classes = useStyles()
  const { onClose, children } = props
  const theme = useTheme()
  const lilGuy = useMediaQuery(theme.breakpoints.only('xs'))

  return (
    <Dialog
      aria-labelledby="simple-modal-dialog-title"
      aria-describedby="simple-modal-dialog-description"
      maxWidth="md"
      fullScreen={lilGuy}
      TransitionComponent={Transition}
      {...props}
    >
      <DialogCloseBtn onClose={onClose} />
      <DialogContent className={`${classes.dialogContent}`}>
        {children}
      </DialogContent>
    </Dialog>
  )
}
