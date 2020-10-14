import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Container, Button, Typography } from '@material-ui/core'
import { FiVideo, FiShare } from 'react-icons/fi'
import { AiOutlineSound } from 'react-icons/ai'

import { SimpleDialog, ShareButtons } from 'components'

type MediaKey = 'video' | 'audio' | 'share'

type MediaProps = {
  language: string
  share?: string
  audio?: string
  video?: string
  description?: string
}

type MediaChildProps = {
  url: string
  title?: string
}

type MediaListItemProps = {
  label: string
  icon: React.ReactNode
  type: MediaKey
  disabled?: boolean
  handleClick: () => void
}

type StyleProps = {
  showShareBtns?: boolean
}

type MediaModalProps = {
  url: string
  closeModal: () => void
}

const config = [
  { label: 'Video', icon: <FiVideo />, type: 'video' },
  { label: 'Audio', icon: <AiOutlineSound />, type: 'audio' },
] as Omit<MediaListItemProps, 'setDialogContent'>[]

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

const IframeContainer: FC<MediaChildProps> = (props) => {
  const classes = useStyles({})
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

const MediaListItem: FC<MediaListItemProps> = (props) => {
  const { label, icon, handleClick, disabled } = props
  const classes = useStyles({})
  let title = ''

  if (label === 'Audio') {
    title = 'Listen to audio for this community'
  } else if (label === 'Video') {
    title = 'Watch video for this community'
  }

  return (
    <li>
      <Button
        size="small"
        color="primary"
        className={classes.mediaLink}
        disabled={disabled}
        title={disabled ? '' : title}
        onClick={(e: React.MouseEvent) => handleClick()}
      >
        {icon}
        {label}
      </Button>
    </li>
  )
}

// ID 646 has the only audio file to date
const MediaModal: FC<MediaModalProps> = (props) => {
  const { url, closeModal } = props
  const classes = useStyles({})
  const title = 'Media title goes here'

  return (
    <SimpleDialog
      fullScreen
      maxWidth="xl"
      open
      className={classes.modalRoot}
      onClose={() => closeModal()}
    >
      <Typography variant="h3">{title}</Typography>
      <Container maxWidth="md" className={classes.dialogContent}>
        <IframeContainer title={title} url={url} />
      </Container>
      <div>
        <Button variant="contained" onClick={() => closeModal()}>
          Back to map
        </Button>
      </div>
    </SimpleDialog>
  )
}

export const Media: FC<MediaProps> = (props) => {
  const { language, description, audio, video } = props
  const [mediaUrl, setMediaUrl] = useState<string>()
  const [showShareBtns, setShowShareBtns] = useState<boolean>(false)
  const classes = useStyles({ showShareBtns })
  const shareSrcAndTitle = `${language} - Languages of New York City Map`
  // archive.org `embed` format:
  // 'https://archive.org/embed/ela_kabardian_comparative?playlist=1'

  return (
    <>
      {mediaUrl && (
        <MediaModal url={mediaUrl} closeModal={() => setMediaUrl('')} />
      )}
      <ul className={classes.mediaRoot}>
        {config.map((item) => (
          <MediaListItem
            key={item.label}
            disabled={props[item.type] === ''}
            {...item}
            handleClick={() => {
              setMediaUrl(item.type === 'audio' ? audio : video)
            }}
          />
        ))}
        <MediaListItem
          {...{ label: 'Share', icon: <FiShare />, type: 'share' }}
          handleClick={() => setShowShareBtns(!showShareBtns)}
        />
      </ul>
      {showShareBtns && (
        <div className={classes.shareBtns}>
          <Typography className={classes.shareBtnHeading}>
            Share this {language} community:
          </Typography>
          <ShareButtons
            spacing={2}
            source={shareSrcAndTitle}
            summary={description}
            title={shareSrcAndTitle}
            url={window.location.href}
          />
        </div>
      )}
    </>
  )
}
