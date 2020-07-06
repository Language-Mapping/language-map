import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { withStyles } from '@material-ui/core'
import brown from '@material-ui/core/colors/brown'
import blueGrey from '@material-ui/core/colors/blueGrey'

const HEADING_FONT = 'Gentium Basic, Times, serif'
const headings = {
  h1: {
    fontFamily: HEADING_FONT,
  },
  h2: {
    fontFamily: HEADING_FONT,
  },
  h3: {
    fontFamily: HEADING_FONT,
  },
  h4: {
    fontFamily: HEADING_FONT,
  },
  h5: {
    fontFamily: HEADING_FONT,
  },
  h6: {
    fontFamily: HEADING_FONT,
  },
}

// Easy access to theme properties when used in `createMuiTheme` overrides
// CRED: https://stackoverflow.com/a/57127040/1048518
const customTheme = createMuiTheme({
  palette: {
    primary: blueGrey,
    secondary: brown,
  },
  typography: {
    fontFamily: [
      'Noto Sans',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    fontSize: 16,
    ...headings,
  },
})

// Global overrides of MUI components that need to be re-styled often. More
// examples available at:
// https://github.com/Covid-Self-report-Tool/cov-self-report-frontend/blob/4523287b5c2a4f0dea1fe918b985aa6b6ca1efc6/src/theme.ts
// customTheme.overrides = {
//   MuiInput: {
//     root: { fontFamily: "'Roboto', sans-serif" },
//   },
// }

export const GlobalCss = withStyles({
  // @global is handled by jss-plugin-global.
  '@global': {
    body: {
      margin: 0,
    },
    p: {
      fontSize: customTheme.typography.fontSize,
    },
    '.simpler-font': {
      fontFamily: "'Roboto', sans-serif",
    },
    // '.obvious-link': {
    //   color: customTheme.palette.info.main,
    //   textDecoration: 'none',
    // },
    'a:visited, .obvious-link': {
      color: customTheme.palette.info.main,
      textDecoration: 'none',
    },
  },
})(() => null)

export const theme = responsiveFontSizes(customTheme)
