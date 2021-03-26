import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { SimpleDialog } from 'components/generic/modals'
import { FeedbackForm } from 'components/about'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up('sm')]: {
        minWidth: 600,
      },
    },
  })
)

type FeedbackModalProps = {
  open: boolean
  setOpen: React.Dispatch<boolean>
}

export const FeedbackModal: FC<FeedbackModalProps> = (props) => {
  const classes = useStyles()
  const { open, setOpen } = props

  return (
    <SimpleDialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        classes: {
          root: classes.root,
        },
      }}
    >
      <FeedbackForm />
    </SimpleDialog>
  )
}
