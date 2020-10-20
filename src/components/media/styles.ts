import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { StyleProps } from './types'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mediaRoot: {
      columnGap: '1rem',
      display: 'flex',
      justifyContent: 'center',
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    mediaLink: {
      alignItems: 'center',
      display: 'flex',
      fontSize: '0.8em',
      '& svg': {
        marginRight: '0.5em',
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
      marginTop: '1em',
      marginBottom: '1em',
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
      fontSize: '0.8em',
      marginBottom: '0.5em',
    },
  })
)
