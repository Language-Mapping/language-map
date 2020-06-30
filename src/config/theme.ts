import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { withStyles } from '@material-ui/core'
import green from '@material-ui/core/colors/green'
import brown from '@material-ui/core/colors/brown'
import blueGrey from '@material-ui/core/colors/blueGrey'

// Easy access to theme properties when used in `createMuiTheme` overrides
// CRED: https://stackoverflow.com/a/57127040/1048518
const customTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blueGrey,
    secondary: brown,
  },
  typography: {
    fontFamily: [
      'Noto Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    fontSize: 16,
  },
})

// Global overrides of MUI components that need to be re-styled often. More
// examples available at:
// https://github.com/Covid-Self-report-Tool/cov-self-report-frontend/blob/4523287b5c2a4f0dea1fe918b985aa6b6ca1efc6/src/theme.ts
customTheme.overrides = {
  MuiInput: {
    root: { fontFamily: "'Roboto', sans-serif" },
  },
}

export const GlobalCss = withStyles({
  // @global is handled by jss-plugin-global.
  '@global': {
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
