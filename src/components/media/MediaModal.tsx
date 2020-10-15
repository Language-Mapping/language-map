import React, { FC } from 'react'
import { useQuery, QueryCache, ReactQueryCacheProvider } from 'react-query'
import { Container, Button, Typography } from '@material-ui/core'
import { SimpleDialog } from 'components'
import { MediaModalProps } from './types'
import { useStyles } from './styles'
import { createAPIurl } from './utils'

type ModalContentProps = { url: string }
type YouTubeAPIvideoResponse = {
  items: { snippet: { title: string; description: string } }[]
}

const queryCache = new QueryCache()

const MediaModalContent: FC<ModalContentProps> = (props) => {
  const { url } = props
  const apiUrl = createAPIurl(url)
  const classes = useStyles({})
  const { isLoading, error, data } = useQuery('repoData', () =>
    fetch(apiUrl).then((res) => res.json())
  ) as {
    isLoading: boolean
    error: Error
    data: YouTubeAPIvideoResponse
  }

  // TODO: spinner or something
  if (isLoading) return <div>loading...</div>

  if (error) {
    throw new Error(
      `😱 Uh oh! Something went wrong fetching media with a URL of ${url} and an error message of: ${error.message}`
    )
  }

  // TODO: support HTML descriptions
  const { title, description } = data.items[0].snippet

  return (
    <>
      <Typography variant="h3">{title}</Typography>
      <Typography variant="caption">{description}</Typography>
      <Container maxWidth="md" className={classes.dialogContent}>
        <div className={classes.videoContainer}>
          <iframe
            title={title}
            src={url} // TODO: append `playlist=1` to Archive URLs
            frameBorder="0"
            allow="encrypted-media"
            allowFullScreen
          />
        </div>
      </Container>
    </>
  )
}

// ID 646 has the only audio file to date
export const MediaModal: FC<MediaModalProps> = (props) => {
  const { url, closeModal } = props
  const classes = useStyles({})

  return (
    <SimpleDialog
      fullScreen
      maxWidth="xl"
      open
      className={classes.modalRoot}
      onClose={() => closeModal()}
    >
      <ReactQueryCacheProvider queryCache={queryCache}>
        <MediaModalContent url={url} />
        <div>
          <Button variant="contained" onClick={() => closeModal()}>
            Back to map
          </Button>
        </div>
      </ReactQueryCacheProvider>
    </SimpleDialog>
  )
}
