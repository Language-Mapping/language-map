import React, { FC } from 'react'
import { Container, Button, Typography } from '@material-ui/core'
import { SimpleDialog } from 'components'
import { MediaModalProps } from './types'
import { useStyles } from './styles'
import { IframeContainer } from './IframeContainer'

// ID 646 has the only audio file to date
export const MediaModal: FC<MediaModalProps> = (props) => {
  const { url, closeModal } = props
  const classes = useStyles({})
  const title = 'Media title goes here'

  return (
    <SimpleDialog
      fullScreen
      maxWidth="xl"
      open
      className={classes.modalRoot}
      onClose={() => closeModal()}
    >
      <Typography variant="h3">{title}</Typography>
      <Container maxWidth="md" className={classes.dialogContent}>
        <IframeContainer title={title} url={url} />
      </Container>
      <div>
        <Button variant="contained" onClick={() => closeModal()}>
          Back to map
        </Button>
      </div>
    </SimpleDialog>
  )
}
