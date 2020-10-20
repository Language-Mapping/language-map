import React, { FC } from 'react'
import * as Sentry from '@sentry/react'
import { useQuery, QueryCache, ReactQueryCacheProvider } from 'react-query'
import { Container, Button, Typography } from '@material-ui/core'
import { SimpleDialog } from 'components'
import { MediaModalProps } from './types'
import { useStyles } from './styles'
import { createAPIurl, getMediaTypeViaURL } from './utils'

type ModalContentProps = { url: string }

// Same for playlists and individual videos
type YouTubeAPIresponse = {
  items: { snippet: { title: string; description: string } }[]
}

const queryCache = new QueryCache()

const MediaErrorMsg: FC<{ url: string }> = (props) => {
  const { url } = props

  return (
    <>
      <Typography style={{ marginBottom: 16 }}>
        Something went wrong looking for this:
      </Typography>
      <Typography style={{ marginBottom: 16 }}>{url}</Typography>
    </>
  )
}

const MediaModalContent: FC<ModalContentProps> = (props) => {
  const { url } = props
  const apiURL = createAPIurl(url)
  const classes = useStyles({})

  const { isLoading, error, data } = useQuery(url, () =>
    fetch(apiURL).then((res) => res.json())
  ) as {
    isLoading: boolean
    error: Error
    data: YouTubeAPIresponse
  }

  if (!apiURL) return <MediaErrorMsg url={url} />

  // TODO: spinner or something
  if (isLoading) return <div>loading...</div>

  if (error) {
    Sentry.withScope((scope) => {
      const mediaType = getMediaTypeViaURL(url)

      Sentry.captureException(new Error('No luck hitting media API'), {
        tags: {
          'media.type': mediaType,
          'media.url': url,
        },
      })
    })

    return <MediaErrorMsg url={url} />
  }

  // TODO: support HTML descriptions from archive.org
  // CRED: (for short circuit) https://stackoverflow.com/a/58866546/1048518
  const { title, description } = data.items[0]?.snippet || {}

  if (!data.items.length) {
    Sentry.withScope((scope) => {
      const mediaType = getMediaTypeViaURL(url)

      scope.setLevel(Sentry.Severity.Warning) // or should be error maybe?

      Sentry.captureException(new Error('No video/audio found via API'), {
        tags: {
          'media.type': mediaType,
          'media.url': url,
        },
      })
    })
  }

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
