/* eslint-disable operator-linebreak */
/* eslint-disable react/display-name */
import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Link, Typography } from '@material-ui/core'

import { SimpleDialog } from 'components'
import { correctDropboxURL } from '../../utils'

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
    viewImgLink: {
      cursor: 'pointer',
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
  const isSvg = origUrl.includes('.svg')
  const classes = useStyles({ isSvg })
  const [open, setOpen] = useState<boolean>(false)
  const url = correctDropboxURL(origUrl)

  return (
    <>
      <Link className={classes.viewImgLink} onClick={() => setOpen(true)}>
        View image
      </Link>
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
