import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { MID_BREAKPOINT } from './config'

type UseStyleProps = {
  panelOpen: boolean
  screenHeight: number
}

const panelWidths = {
  mid: 375,
  midLarge: 475,
}

export const MOBILE_PANEL_HEADER_HEIGHT = '3rem'
export const DESKTOP_PANEL_HEADER_HEIGHT = '3.5rem'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapWrapRoot: {
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
        [theme.breakpoints.down('xs')]: {
          left: 8,
          transform: (props: UseStyleProps) => {
            if (!props.panelOpen) {
              return `translateY(calc(-${MOBILE_PANEL_HEADER_HEIGHT} + 2px))`
            }

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
    },
    // The actual map container
    mapItselfWrap: {
      bottom: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
    },
    mapPanelsWrap: {
      bottom: 0,
      left: theme.spacing(1),
      position: 'absolute',
      right: theme.spacing(1),
      transition: '300ms transform',
      '& .MuiPaper-root': {
        height: '100%',
        overflowY: 'auto',
      },
      [theme.breakpoints.up('xs')]: {
        transform: (props: UseStyleProps) => {
          if (!props.panelOpen) {
            return `translateY(calc(100% - ${DESKTOP_PANEL_HEADER_HEIGHT}))`
          }

          return 'translateY(0)'
        },
      },
      [theme.breakpoints.down('xs')]: {
        top: (props: UseStyleProps) => `${props.screenHeight / 2}px`,
        transform: (props: UseStyleProps) => {
          if (!props.panelOpen) {
            return `translateY(calc(100% - ${MOBILE_PANEL_HEADER_HEIGHT}))`
          }

          return 'translateY(0)'
        },
      },
      // TODO: you know what
      [theme.breakpoints.up(MID_BREAKPOINT)]: {
        bottom: theme.spacing(3), // above mapbox stuffs
        left: theme.spacing(3),
        top: theme.spacing(3),
        width: panelWidths.mid,
      },
      [theme.breakpoints.up('md')]: {
        width: panelWidths.midLarge,
      },
    },
    closePanel: {
      color: theme.palette.common.white,
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      zIndex: 2,
    },
  })
)
