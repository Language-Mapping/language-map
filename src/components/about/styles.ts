import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeBtn: {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    dialogTitle: {
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        fontSize: '0.7em',
        marginRight: '0.15em',
      },
    },
    dialogContent: {
      '& img': {
        height: 'auto',
        margin: '1em auto',
        maxWidth: '90%',
        // Prevent screenshots from getting lost in Paper bg if same color:
        outline: 'solid 1px hsl(0deg 0% 40%)',
        [theme.breakpoints.only('xs')]: {
          margin: '0.5em 0',
          maxWidth: '100%',
        },
      },
      '& figure': {
        margin: '1em', // horiz. margin defaults to huge 40px in Chrome
        textAlign: 'center',
        [theme.breakpoints.only('xs')]: {
          margin: 0,
        },
      },
    },
  })
)
