const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY

// What to expect in the data: three forms (corresponding feat ID in parens)
// https://www.youtube.com/embed/m1YOS3fYde4 (3)
// https://www.youtube.com/embed/videoseries?list=PLE29ADA7B389607F1 (5)
// https://archive.org/embed/mid-2003-06-13c (646)
export const createAPIurl = (url: string): string => {
  let apiUrl: string

  const googleEmbedBase = 'https://www.youtube.com/embed/'
  const googlePlaylistBase = `${googleEmbedBase}videoseries?list=`
  const internetArchiveBase = 'https://archive.org/embed'
  const GOOGLE_API_BASE = 'https://www.googleapis.com/youtube/v3'
  const googleSuffix = `?part=snippet&key=${YOUTUBE_API_KEY}&id=`

  if (url.includes(googlePlaylistBase)) {
    apiUrl = `${GOOGLE_API_BASE}/playlists${googleSuffix}${url.replace(
      googlePlaylistBase,
      ''
    )}`
  } else if (url.includes(googleEmbedBase)) {
    apiUrl = `${GOOGLE_API_BASE}/videos${googleSuffix}${url.replace(
      googleEmbedBase,
      ''
    )}`
  } else if (url.includes(internetArchiveBase)) {
    apiUrl = `${internetArchiveBase.replace('embed', 'metadata')}/${url.replace(
      internetArchiveBase,
      ''
    )}`
  } else {
    throw new Error(
      '😱 Uh oh! The URL supplied does not appear to be for a YouTube video or playlist, or an Internet Archive embed.'
    )
  }

  return apiUrl
}
