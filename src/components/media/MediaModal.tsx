import React, { FC } from 'react'
import * as Sentry from '@sentry/react'
import { useQuery, QueryCache, ReactQueryCacheProvider } from 'react-query'
import {
  Container,
  Button,
  Typography,
  CircularProgress,
} from '@material-ui/core'
import { SimpleDialog } from 'components'
import { MediaModalProps } from './types'
import { useStyles } from './styles'
import * as utils from './utils'

type ModalContentProps = { url: string }

// Same for playlists and individual videos
type YouTubeAPIresponse = {
  items: { snippet: { title: string; description: string } }[]
}

type InternetArchiveAPIresponse = {
  result: {
    title: string
    description: string
  }
}

type APIdataResponse = YouTubeAPIresponse | InternetArchiveAPIresponse

type APIresponse = {
  isLoading: boolean
  error: Error
  data: APIdataResponse
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
  const apiURL = utils.createAPIurl(url)
  const classes = useStyles({})
  const mediaType = utils.getMediaTypeViaURL(url)

  const { isLoading, error, data } = useQuery(url, () =>
    fetch(apiURL).then((res) => res.json())
  ) as APIresponse

  if (!apiURL) return <MediaErrorMsg url={url} />

  if (isLoading) {
    return (
      // TODO: convert text and circular progress into reusable component
      <Container maxWidth="md" className={classes.dialogContent}>
        <Typography variant="h4" component="h2" style={{ marginBottom: 16 }}>
          Loading...
        </Typography>
        <CircularProgress color="inherit" size={38} />
      </Container>
    )
  }

  if (error) {
    Sentry.withScope(() => {
      Sentry.captureException(new Error('No luck hitting media API'), {
        tags: {
          'media.type': mediaType,
          'media.url': url,
        },
      })
    })

    return <MediaErrorMsg url={url} />
  }

  let goods: { title: string; description: string } | null = null

  // CRED: (my goodness):
  // https://github.com/microsoft/TypeScript/issues/12815#issuecomment-568965455
  if ('items' in data) {
    goods = data.items?.[0].snippet
  } else if ('result' in data) {
    goods = data.result
  }

  if (!goods) {
    Sentry.withScope((scope) => {
      scope.setLevel(Sentry.Severity.Warning) // or should be error maybe?

      Sentry.captureException(new Error('No video/audio found via API'), {
        tags: {
          'media.type': mediaType,
          'media.url': url,
        },
      })
    })

    return <MediaErrorMsg url={url} />
  }

  // NOTE: HTML support for Archive instances was removed to preserve consistent
  // style and layout.
  const { title, description } = goods
  const src = utils.createIframeURL(url, mediaType)

  return (
    <>
      <Typography variant="h3">{title}</Typography>
      <Typography variant="caption">{description}</Typography>
      <Container maxWidth="md" className={classes.dialogContent}>
        <div className={classes.videoContainer}>
          <iframe
            src={src}
            title={title}
            frameBorder="0"
            allow="encrypted-media"
            allowFullScreen
          />
        </div>
      </Container>
    </>
  )
}

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
