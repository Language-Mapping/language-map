import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
    },
    divider: { marginBottom: '1.5em' },
    neighborhoods: {
      alignItems: 'center',
      color: theme.palette.text.primary,
      display: 'flex',
      flexWrap: 'wrap',
      fontSize: '0.75em',
      justifyContent: 'center',
      margin: '0.25em 0 0.75em',
      '& svg': {
        marginRight: '0.35em',
      },
      // This won't affect Town, which is currently not a link
      '& a:first-of-type': {
        fontWeight: 'bold',
        color: theme.palette.text.primary,
      },
      '& a:not(:first-of-type)': {
        color: theme.palette.text.secondary,
      },
    },
    separator: {
      color: theme.palette.text.secondary,
      margin: '0 0.25em',
    },
    noFeatSel: {
      marginBottom: '1em',
      fontSize: theme.typography.caption.fontSize,
    },
    panelHeading: {
      fontSize: '1.5rem',
    },
  })
)
