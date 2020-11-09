import { useState, useEffect } from 'react'
import { Theme } from '@material-ui/core/styles'

import { LangRecordSchema } from './context/types'

// TODO: into config since it's used in multiple places...
const DEFAULT_DELIM = ', ' // e.g. for multi-value Neighborhood and Country

export const findFeatureByID = (
  langLayerRecords: LangRecordSchema[],
  id: number,
  idField?: keyof LangRecordSchema
): LangRecordSchema | undefined =>
  langLayerRecords.find((record) => record[idField || 'ID'] === id)

export const getIDfromURLparams = (url: string): number => {
  const urlParams = new URLSearchParams(url)
  const idAsString = urlParams.get('id') as string

  return parseInt(idAsString, 10)
}

export const isURL = (text: string): boolean => text.slice(0, 4) === 'http'

// CRED: github.com/mbrn/material-table/issues/709#issuecomment-566097441
// TODO: put into hooks file and/or folder along with any others
export function useWindowResize(): { width: number; height: number } {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)

  const listener = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }

  useEffect(() => {
    window.addEventListener('resize', listener)

    return () => {
      window.removeEventListener('resize', listener)
    }
  }, [])

  return {
    width,
    height,
  }
}

// TODO: look into cookie warnings regarding Dropbox:
// https://web.dev/samesite-cookies-explained/?utm_source=devtools
// "dl" stuff takes you to the downloadable version, raw and www to raw. Could
// just change this in the data but Ross is away and Jason already gave faulty
// instructions...
export function correctDropboxURL(url: string): string {
  const badDropboxHost = 'dl.dropboxusercontent.com'
  const goodDropboxHost = 'www.dropbox.com'
  const badDropboxSuffix = 'dl=0'
  const goodDropboxSuffix = 'raw=1'

  return url
    .replace(badDropboxHost, goodDropboxHost)
    .replace(badDropboxSuffix, goodDropboxSuffix)
}

// e.g. convert "Woodside, Queens" into "Woodside (+1 more)"
export function prettyTruncateList(
  text: string,
  delimiter: string = DEFAULT_DELIM
): string {
  const asArray = text.split(delimiter)
  const firstItem = asArray[0]

  // Single-items do not make sense to have (+0)...
  if (asArray.length === 1) {
    return firstItem
  }

  return `${firstItem} (+${asArray.length - 1} more)`
}

// CRED: for `theme.transitions.create` example:
// https://medium.com/@octaviocoria/custom-css-transitions-with-react-material-ui-5d41cb2e7c5#fecb
export const smoothToggleTransition = (
  theme: Theme,
  open?: boolean
): string => {
  const { transitions } = theme
  /* eslint-disable operator-linebreak */
  const duration = open
    ? transitions.duration.leavingScreen
    : transitions.duration.enteringScreen
  /* eslint-enable operator-linebreak */
  const easing = open ? transitions.easing.easeIn : transitions.easing.easeOut

  return transitions.create('all', { duration, easing })
}

export const createMarkup = (content: string): { __html: string } => ({
  __html: content,
})

// CRED: https://lowrey.me/test-if-a-string-is-alphanumeric-in-javascript/
export const isAlpha = (ch: string): boolean => ch.match(/^[a-z]+$/i) !== null

export const getAllLangFeatIDs = (data: LangRecordSchema[]): number[] =>
  data.map((record) => record.ID)

// CRED:
// www.geeksforgeeks.org/how-to-detect-touch-screen-device-using-javascript/
export const isTouchEnabled = (): boolean =>
  (window && 'ontouchstart' in window) ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0

// CRED: https://stackoverflow.com/a/5574446/1048518
export const toProperCase = (srcText: string): string =>
  srcText.replace(
    /\w\S*/g,
    (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
