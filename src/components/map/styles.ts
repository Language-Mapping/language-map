import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { UseStyleProps } from './types'

export const MOBILE_PANEL_HEADER_HEIGHT = '3rem'
export const DESKTOP_PANEL_HEADER_HEIGHT = '3.5rem'

export const panelWidths = {
  mid: 375,
  midLarge: 475,
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // formerly `mapWrapRoot`...
    appWrapRoot: {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      overflow: 'hidden',
      position: 'absolute',
      // MB wordmark (logo) and attribution text
      '& .mapboxgl-ctrl-bottom-right': {
        alignItems: 'baseline',
        display: 'flex',
        transition: '300ms transform',
        // FINE-TUNE AWARD 2020 (fits baaaarely on iPhone X, super fragile!)
        [theme.breakpoints.down('sm')]: {
          left: 8,
          transform: (props: UseStyleProps) => {
            if (!props.panelOpen) {
              return `translateY(calc(-${MOBILE_PANEL_HEADER_HEIGHT} + 2px))`
            }

            // This right here needs some kind of `useResize`
            return `translateY(calc(-${props.screenHeight / 2}px + 2px))`
          },
        },
      },
      // MB folks would probably like their logo to have more room, but it's
      // definitely legible in this setup.
      '& .mapboxgl-ctrl': {
        margin: 0,
      },
      // Attribution text
      '& .mapboxgl-ctrl-attrib': {
        marginLeft: 4,
        order: 1,
        position: 'relative',
        top: -2,
      },
      '& .mapboxgl-popup-tip': {
        borderTopColor: theme.palette.background.paper,
      },
      '& .mapboxgl-popup-content': {
        backgroundColor: theme.palette.background.paper,
      },
      '& .geocode-marker': {
        color: theme.palette.primary.main,
        fontSize: 24,
      },
    },
    // The actual map container
    mapItselfWrap: {
      bottom: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
    },
  })
)
