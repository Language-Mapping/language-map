import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'

// Always have a hard time finding the Typography variant docs for some reason:
// https://material-ui.com/components/typography/#component

// ...and the default theme:
// https://material-ui.com/customization/default-theme/#explore

const HEADING_FONT =
  "Buginese, Chiki, Coptic, Limbu, MeeteiMayek, Myanmar, NKo, Sinhala, Sylhoti, SyriacEstrangela, Thaana, Tifinagh, Vai, 'Gentium Basic', Times, serif"
const headings = {
  h1: { fontFamily: HEADING_FONT },
  h2: { fontFamily: HEADING_FONT },
  h3: { fontFamily: HEADING_FONT },
  h4: { fontFamily: HEADING_FONT },
  h5: { fontFamily: HEADING_FONT },
  h6: { fontFamily: HEADING_FONT },
}

// BREAKPOINTS: material-ui.com/customization/breakpoints/#default-breakpoints
// xs, extra-small: 0px
// sm, small: 600px
// md, medium: 960px
// lg, large: 1280px
// xl, extra-large: 1920px

// YO: if you want to try the switch again, this seemed to be on the right
// track, "just" need to wire it up w/state and responsive fonts and all the
// other shtuff: `export function customTheme(type: PaletteType)`

// Easy access to theme properties when used in `createMuiTheme` overrides
// CRED: https://stackoverflow.com/a/57127040/1048518
const customTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#66ab9d',
      main: '#409685',
      dark: '#2c695d',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ab6673',
      main: '#964051',
      dark: '#692c38',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: [
      'Buginese',
      'Chiki',
      'Coptic',
      'Limbu',
      'MeeteiMayek',
      'Myanmar',
      'NKo',
      'Sinhala',
      'Sylhoti',
      'SyriacEstrangela',
      'Thaana',
      'Tifinagh',
      'Vai',
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

// Global overrides of MUI components that need to be re-styled often
customTheme.overrides = {
  MuiInput: {
    root: {
      fontSize: customTheme.typography.body2.fontSize, // default inputs: huge
    },
  },
  MuiDialog: {
    // Outside boundary of all dialogs
    paper: {
      margin: 12,
    },
  },
}

export const theme = responsiveFontSizes(customTheme)
