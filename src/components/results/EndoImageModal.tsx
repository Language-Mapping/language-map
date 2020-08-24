/* eslint-disable operator-linebreak */
/* eslint-disable react/display-name */
import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Link, Typography } from '@material-ui/core'

import { SimpleDialog } from 'components'

type EndoImageComponent = {
  url: string
  language: string
}

type StyleProps = {
  isSvg: boolean
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
      margin: `${theme.spacing(4)}px ${theme.spacing(3)}px`,
    },
    image: {
      height: 'auto',
      marginTop: '1rem',
      maxWidth: '95%',
    },
  })
)

function correctDropboxURL(url: string): string {
  const BAD_DROPBOX_HOST = 'dl.dropboxusercontent.com'
  const GOOD_DROPBOX_HOST = 'www.dropbox.com'
  const BAD_DROPBOX_SUFFIX = 'dl=0'
  const GOOD_DROPBOX_SUFFIX = 'raw=1'

  return url
    .replace(BAD_DROPBOX_HOST, GOOD_DROPBOX_HOST)
    .replace(BAD_DROPBOX_SUFFIX, GOOD_DROPBOX_SUFFIX)
}

export const EndoImageModal: FC<EndoImageComponent> = (props) => {
  const { url: origUrl, language } = props
  const isSvg = origUrl.includes('.svg')
  const classes = useStyles({ isSvg })
  const [open, setOpen] = useState<boolean>(false)
  const url = correctDropboxURL(origUrl)

  return (
    <>
      <Link onClick={() => setOpen(true)}>View image</Link>
      <SimpleDialog
        open={open}
        className={classes.endoModalRoot}
        onClose={() => setOpen(false)}
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
