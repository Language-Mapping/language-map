import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { StyleProps } from './types'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      listStyle: 'none',
      margin: '0.75rem 0 0.25rem',
      padding: 0,
      '& li + li': {
        marginLeft: '0.5rem',
      },
    },
    mediaLink: {
      alignItems: 'center',
      display: 'flex',
      fontSize: '0.85rem',
      '& svg': {
        marginRight: '0.25rem',
      },
    },
    modalRoot: {
      textAlign: 'center',
      // Cheap way to override `DialogContent`
      '& .MuiDialogContent-root': {
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.only('xs')]: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
    dialogContent: {
      marginTop: '1rem',
      marginBottom: '1rem',
      [theme.breakpoints.down('sm')]: {
        padding: 0,
      },
    },
    // CRED: this is almost a standard based on search results
    videoContainer: {
      height: 0,
      paddingBottom: '56.25%',
      paddingTop: 25,
      position: 'relative',
      '& iframe, object, embed': {
        height: '100%',
        left: 0,
        position: 'absolute',
        top: 0,
        width: '100%',
      },
    },
    shareBtns: {
      transition: '300ms all',
      margin: '8px 0',
      textAlign: 'center',
      maxHeight: (props: StyleProps) => (props.showShareBtns ? 75 : 0),
      opacity: (props: StyleProps) => (props.showShareBtns ? 1 : 0),
    },
    shareBtnHeading: {
      fontSize: '0.75rem',
      marginBottom: '0.5rem',
    },
  })
)
