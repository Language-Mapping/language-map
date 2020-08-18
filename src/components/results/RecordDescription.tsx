import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Typography,
  Dialog,
  DialogContent,
  IconButton,
} from '@material-ui/core'
import { MdClose } from 'react-icons/md'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContent: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      color: theme.palette.grey[800],
    },
    yarr: {
      fontFamily: theme.typography.h1.fontFamily,
      marginTop: theme.spacing(2),
    },
    firstLetter: {
      color: theme.palette.common.black,
      fontSize: theme.typography.h1.fontSize,
      fontFamily: theme.typography.h1.fontFamily,
      fontWeight: theme.typography.h1.fontWeight,
      lineHeight: 0,
    },
    closeBtn: {
      position: 'absolute',
      zIndex: 1,
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
  })
)

type RecordDescripComponent = {
  text: string
  onClose: React.Dispatch<string>
}

export const RecordDescription: FC<RecordDescripComponent> = (props) => {
  const { text, onClose } = props
  const classes = useStyles()
  const [open, setOpen] = useState<boolean>(true)

  const handleClose = () => {
    setOpen(false)
    onClose('')
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="descrip-modal-dialog-title"
      aria-describedby="descrip-modal-dialog-description"
      maxWidth="md"
    >
      <IconButton onClick={handleClose} className={classes.closeBtn}>
        <MdClose />
      </IconButton>
      <DialogContent className={`${classes.dialogContent}`}>
        <Typography className={classes.yarr}>
          {text && (
            <>
              <span className={classes.firstLetter}>{text[0]}</span>
              {text.slice(1)}
            </>
          )}
          {!text && 'No description available'}
        </Typography>
      </DialogContent>
    </Dialog>
  )
}
