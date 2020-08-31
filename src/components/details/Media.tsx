import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Container, Button, Typography } from '@material-ui/core'
import { FiVideo } from 'react-icons/fi'
import { AiOutlineSound } from 'react-icons/ai'

import { SimpleDialog } from 'components'

type MediaKey = 'video' | 'audio'

type MediaProps = {
  language: string
  audio?: string
  video?: string
}

type MediaChildProps = {
  title?: string
  url: string
}

type MediaListItemProps = {
  label: string
  icon: React.ReactNode
  type: MediaKey
  disabled?: boolean
  handleClick: () => void
}

const useStyles = makeStyles((theme: Theme) =>
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
      textTransform: 'none',
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
    },
    // CRED: this is almost a standard based on search results
    videoContainer: {
      height: 0,
      paddingBottom: '56.25%', // 16:9
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
  })
)

const YouTubeVideo: FC<MediaChildProps> = (props) => {
  const classes = useStyles()
  const { url, title } = props

  // Proper syntax:
  // https://www.youtube.com/embed/A6XUVjK9W4o
  // https://www.youtube.com/embed/videoseries?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG
  const urlPrepped = url.replace(
    'https://www.youtube.com/playlist',
    'https://www.youtube.com/embed/videoseries'
  )

  return (
    <div className={classes.videoContainer}>
      <iframe
        title={title}
        src={urlPrepped}
        frameBorder="0"
        allow="encrypted-media"
        allowFullScreen
      />
    </div>
  )
}

const Audio: FC<MediaChildProps> = (props) => {
  const { url } = props

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <audio controls src={url}>
      Your browser does not support the audio element.
    </audio>
  )
}

const MediaListItem: FC<MediaListItemProps> = (props) => {
  const { label, icon, handleClick, disabled } = props
  const classes = useStyles()

  return (
    <li>
      <Button
        size="small"
        color="primary"
        className={classes.mediaLink}
        disabled={disabled}
        onClick={(e: React.MouseEvent) => handleClick()}
      >
        {icon}
        {label}
      </Button>
    </li>
  )
}

const config = [
  { label: 'Video', icon: <FiVideo />, type: 'video' },
  { label: 'Audio', icon: <AiOutlineSound />, type: 'audio' },
] as Omit<MediaListItemProps, 'setDialogContent'>[]

export const Media: FC<MediaProps> = (props) => {
  const { audio, video, language } = props
  const classes = useStyles()
  const [dialogContent, setDialogContent] = useState<MediaKey | null>(null)

  return (
    <>
      <SimpleDialog
        fullScreen
        maxWidth="xl"
        open={dialogContent !== null}
        className={classes.modalRoot}
        onClose={() => setDialogContent(null)}
      >
        <Typography variant="h3">{language}</Typography>
        <Container
          maxWidth="lg"
          disableGutters
          className={classes.dialogContent}
        >
          {dialogContent === 'video' && video && (
            <YouTubeVideo title={language} url={video} />
          )}
          {dialogContent === 'audio' && audio && <Audio url={audio} />}
        </Container>
        <div>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setDialogContent(null)}
          >
            Back to map
          </Button>
        </div>
      </SimpleDialog>
      <ul className={classes.mediaRoot}>
        {config.map((item) => (
          <MediaListItem
            key={item.label}
            disabled={props[item.type] === ''}
            {...item}
            handleClick={() => setDialogContent(item.type)}
          />
        ))}
      </ul>
    </>
  )
}
