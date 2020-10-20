import * as Sentry from '@sentry/react'

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY
const youTubeEmbedBase = 'https://www.youtube.com/embed/'
const youTubePlaylistEmbed = `${youTubeEmbedBase}videoseries?list=`
const internetArchiveEmbed = 'https://archive.org/embed'

type MediaType =
  | 'YouTube playlist'
  | 'YouTube video'
  | 'Internet Archive'
  | 'Unknown media type'

export const getMediaTypeViaURL = (url: string): MediaType => {
  if (url.startsWith(youTubePlaylistEmbed)) return 'YouTube playlist'
  if (url.startsWith(youTubeEmbedBase)) return 'YouTube video'
  if (url.startsWith(internetArchiveEmbed)) return 'Internet Archive'

  return 'Unknown media type'
}

// NOTE: `playlist` breaks individual YouTube videos because it's an actual
// parameter that means something different in YouTube (a list of video IDs),
// but `cc_load_policy` has no impact on Internet Archive instances. Note also
// that the cc setting has no impact on YouTube when generated captions are the
// only form available.
export const createIframeURL = (url: string, mediaType: MediaType): string => {
  if (mediaType === 'YouTube playlist') return `${url}&cc_load_policy=1`
  if (mediaType === 'YouTube video') return `${url}?cc_load_policy=1`
  if (mediaType === 'Internet Archive') return `${url}?playlist=1`

  return url
}

// What to expect in the data: three forms (corresponding feat ID in parens)
// https://www.youtube.com/embed/m1YOS3fYde4 (3)
// https://www.youtube.com/embed/videoseries?list=PLE29ADA7B389607F1 (5)
// https://archive.org/embed/mid-2003-06-13c (646)
export const createAPIurl = (url: string): string => {
  const GOOGLE_API_BASE = 'https://www.googleapis.com/youtube/v3'
  const googleSuffix = `?part=snippet&key=${YOUTUBE_API_KEY}&id=`

  if (url.includes(youTubePlaylistEmbed)) {
    return `${GOOGLE_API_BASE}/playlists${googleSuffix}${url.replace(
      youTubePlaylistEmbed,
      ''
    )}`
  }

  if (url.includes(youTubeEmbedBase)) {
    return `${GOOGLE_API_BASE}/videos${googleSuffix}${url.replace(
      youTubeEmbedBase,
      ''
    )}`
  }

  if (url.includes(internetArchiveEmbed)) {
    return `${internetArchiveEmbed.replace('embed', 'metadata')}/${url.replace(
      internetArchiveEmbed,
      ''
    )}/metadata`
  }

  Sentry.withScope((scope) => {
    Sentry.captureException(new Error('Invalid media URL format'), {
      tags: {
        'media.url': url,
      },
    })
  })

  return ''
}
