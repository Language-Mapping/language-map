import React, { FC, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { Button, Typography } from '@material-ui/core'
import { FiVideo, FiShare } from 'react-icons/fi'
import { AiOutlineSound } from 'react-icons/ai'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { FaMapMarkedAlt } from 'react-icons/fa'

import { ShareButtons } from 'components/generic'
import { MediaListItemProps, MediaProps } from './types'
import { useStyles } from './styles'
import { MediaModal } from './MediaModal'

const MediaListItem: FC<MediaListItemProps> = (props) => {
  const { label, icon, handleClick, disabled, variant = 'text' } = props
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
        color="secondary"
        variant={variant}
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
  const { data, omitClear, shareNoun = 'community' } = props
  const history = useHistory()
  const [mediaUrl, setMediaUrl] = useState<string>()
  const isTable: { params: { id: string } } | null = useRouteMatch('/table/:id')
  const [showShareBtns, setShowShareBtns] = useState<boolean>(false)
  const classes = useStyles({ showShareBtns })
  const { Language, Video, Audio, Description } = data
  const shareSrcAndTitle = `${Language} - Languages of New York City Map`
  // archive.org `embed` format:
  // 'https://archive.org/embed/ela_kabardian_comparative?playlist=1'

  return (
    <>
      {mediaUrl && (
        <MediaModal url={mediaUrl} closeModal={() => setMediaUrl('')} />
      )}
      <ul className={classes.root}>
        <MediaListItem
          disabled={!Video}
          icon={<FiVideo />}
          label="Video"
          type="Video"
          variant="outlined"
          handleClick={() => setMediaUrl(Video)}
        />
        <MediaListItem
          disabled={!Audio}
          icon={<AiOutlineSound />}
          label="Audio"
          type="Audio"
          variant="outlined"
          handleClick={() => setMediaUrl(Audio)}
        />
        {/* TODO: use Switch + Route for this, e.g. /table/:id */}
        {!omitClear &&
          ((!isTable && (
            <MediaListItem
              label="De-select"
              icon={<IoIosCloseCircleOutline />}
              type="clear"
              handleClick={() => history.push('/Explore/Language/none')}
            />
          )) || (
            <MediaListItem
              label="View in map"
              icon={<FaMapMarkedAlt />}
              type="view"
              handleClick={() =>
                history.push(
                  `/Explore/Language/${data.Language}/${isTable?.params?.id}`
                )
              }
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
            Share this <em>{Language}</em> {shareNoun}:
          </Typography>
          <ShareButtons
            spacing={2}
            source={shareSrcAndTitle}
            summary={Description} // CAREFUL, this will be lang Descrip!
            title={shareSrcAndTitle}
            url={window.location.href}
          />
        </div>
      )}
    </>
  )
}
