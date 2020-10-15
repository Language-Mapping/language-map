const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY

export const createAPIurl = (url: string): string => {
  let apiUrl: string

  // What to expect in the data: three forms:
  // https://www.youtube.com/embed/VIDEO_ID
  // https://www.youtube.com/embed/videoseries?list=PLAYLIST_ID
  // https://archive.org/embed/ITEM_ID

  const googleEmbedBase = 'https://www.youtube.com/embed/'
  const googlePlaylistBase = `${googleEmbedBase}videoseries?list=`
  const internetArchiveBase = 'https://archive.org/embed'
  const GOOGLE_API_BASE = 'https://www.googleapis.com/youtube/v3'
  const googleSuffix = `&part=snippet&key=${YOUTUBE_API_KEY}`

  if (url.includes(googlePlaylistBase)) {
    apiUrl = `${GOOGLE_API_BASE}/playlists/${url.replace(
      googlePlaylistBase,
      ''
    )}`
  } else if (url.includes(googleEmbedBase)) {
    apiUrl = `${GOOGLE_API_BASE}/videos?id=${url.replace(
      googleEmbedBase,
      ''
    )}&${googleSuffix}`
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
