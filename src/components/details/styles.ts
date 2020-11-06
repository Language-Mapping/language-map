import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    intro: { padding: '0.65em 0 0.3em', textAlign: 'center' },
    divider: { marginBottom: '1.5em' },
    neighborhoods: {
      alignItems: 'center',
      color: theme.palette.text.primary,
      display: 'flex',
      fontSize: '0.75em',
      margin: '0.5em 0 1em',
      flexWrap: 'wrap',
      justifyContent: 'center',
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
    descripSection: {
      fontSize: theme.typography.caption.fontSize,
      padding: '0 0.25rem',
    },
    noFeatSel: {
      marginBottom: '1em',
      fontSize: theme.typography.caption.fontSize,
    },
    region: {
      display: 'inline-flex',
      justifyContent: 'center',
      padding: '0.25rem 4.5em',
      paddingBottom: 0,
      marginTop: '0.45em',
      borderTop: `dashed 1px ${theme.palette.divider}`,
    },
    countriesList: {
      padding: 0,
      margin: 0,
      listStyle: 'none',
      fontSize: '0.75em',
      display: 'flex',
      columnGap: '0.5em',
      alignItems: 'center',
      justifyContent: 'center',
      fontStyle: 'italic',
      color: theme.palette.text.secondary,
      '& > * + *': {
        marginLeft: '0.5em',
      },
      '& li': {
        marginTop: 0,
        fontSize: '0.85em',
        color: theme.palette.text.secondary,
      },
    },
  })
)
