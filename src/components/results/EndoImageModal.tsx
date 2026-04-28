import React, { FC, useState } from 'react'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { Button, Typography } from '@mui/material'

import { SimpleDialog } from 'components/generic/modals'
import { correctDropboxURL } from '../../utils'

type EndoImageComponent = {
  url: string
  language: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    endoModalRoot: {
      // Cheap way to override `DialogContent`
      '& .MuiDialogContent-root': {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
      },
    },
    // Smaller than the default so that it is not as large as table modal
    endoModalPaper: {
      margin: `${theme.spacing(4)} ${theme.spacing(3)}`,
    },
    image: {
      height: 'auto',
      marginTop: '1rem',
      maxWidth: '95%',
    },
  })
)

export const EndoImageModal: FC<EndoImageComponent> = (props) => {
  const { url: origUrl, language } = props
  const classes = useStyles()
  const [open, setOpen] = useState<boolean>(false)
  const url = correctDropboxURL(origUrl)

  return (
    <>
      <Button onClick={() => setOpen(true)}>View image</Button>
      <SimpleDialog
        open={open}
        className={classes.endoModalRoot}
        onClose={() => setOpen(false)}
        fullScreen={false}
        PaperProps={{
          className: classes.endoModalPaper,
        }}
      >
        <Typography variant="h3">{language}</Typography>
        <img src={url} alt={language} className={classes.image} />
      </SimpleDialog>
    </>
  )
}
