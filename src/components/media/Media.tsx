import React, { FC, useState } from 'react'
import { Button, Typography } from '@material-ui/core'
import { FiVideo, FiShare } from 'react-icons/fi'
import { AiOutlineSound } from 'react-icons/ai'

import { ShareButtons } from 'components'
import { MediaListItemProps, MediaProps } from './types'
import { useStyles } from './styles'
import { MediaModal } from './MediaModal'

const config = [
  { label: 'Video', icon: <FiVideo />, type: 'video' },
  { label: 'Audio', icon: <AiOutlineSound />, type: 'audio' },
] as Omit<MediaListItemProps, 'setDialogContent'>[]

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
