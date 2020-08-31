import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import { FiVideo, FiMap } from 'react-icons/fi'
import { AiOutlineSound } from 'react-icons/ai'

import { SimpleDialog } from 'components'

type MediaKey = 'video' | 'audio' | 'story'

type MediaProps = {
  audio?: string
  story?: string
  video?: string
}

type MediaChildProps = {
  url: string
}

type MediaListItemProps = {
  label: string
  icon: React.ReactNode
  type: MediaKey
  disabled?: boolean
  handleClick: () => void
}

type StyleProps = Pick<MediaListItemProps, 'disabled'>

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mediaRoot: {
      display: 'flex',
      listStyle: 'none',
      padding: 0,
      margin: 0,
      justifyContent: 'center',
      columnGap: '1rem',
    },
    mediaLink: {
      fontSize: '0.8em',
      display: 'flex',
      alignItems: 'center',
      textTransform: 'none',
      '& svg': {
        marginRight: '0.5em',
      },
    },
    endoModalRoot: {
      // Cheap way to override `DialogContent`
      '& .MuiDialogContent-root': {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
      },
    },
    // Smaller than the default so that it is not as large as table modal
    endoModalPaper: {
      margin: `${theme.spacing(4)}px ${theme.spacing(3)}px`,
    },
  })
)

const YouTubeVideo: FC<MediaChildProps> = (props) => {
  const { url } = props

  return <div>{url}</div>
}

const SoundCloudAudio: FC<MediaChildProps> = (props) => {
  const { url } = props

  return <div>{url}</div>
}

const StoryMap: FC<MediaChildProps> = (props) => {
  const { url } = props

  return <div>{url}</div>
}

const MediaListItem: FC<MediaListItemProps> = (props) => {
  const { label, icon, handleClick, disabled } = props
  const classes = useStyles()

  return (
    <li>
      <Button
        size="small"
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
  { label: 'Story Map', icon: <FiMap />, type: 'story' },
] as Omit<MediaListItemProps, 'setDialogContent'>[]

export const Media: FC<MediaProps> = (props) => {
  const { audio, video, story } = props
  const classes = useStyles()
  const [dialogContent, setDialogContent] = useState<MediaKey | null>(null)

  return (
    <>
      <SimpleDialog
        open={dialogContent !== null}
        className={classes.endoModalRoot}
        onClose={() => setDialogContent(null)}
        PaperProps={{
          className: classes.endoModalPaper,
        }}
      >
        {dialogContent === 'video' && video && <YouTubeVideo url={video} />}
        {dialogContent === 'audio' && audio && <SoundCloudAudio url={audio} />}
        {dialogContent === 'story' && story && <StoryMap url={story} />}
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
