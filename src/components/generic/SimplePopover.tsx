import React, { FC, useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import IconButton from '@material-ui/core/IconButton'
import { GoInfo } from 'react-icons/go'

import { Explanation } from './Explanation'
import { useUItext } from './hooks'
import { SimplePopoverProps, PopoverWithUItextProps } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      maxWidth: 325,
      padding: '0.75rem 1rem',
    },
    explanationOverride: {
      marginBottom: 0,
    },
  })
)

export const SimplePopover: FC<SimplePopoverProps> = (props) => {
  const { content, icon = <GoInfo /> } = props
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div>
      <IconButton
        aria-describedby={id}
        color="inherit"
        onClick={handleClick}
        size="small"
      >
        {icon}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        elevation={18}
        PaperProps={{ className: classes.popover }}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Explanation className={classes.explanationOverride}>
          {content}
        </Explanation>
      </Popover>
    </div>
  )
}

// Had to break this out because otherwise the anchor did not work properly when
// the content was still loading.
export const PopoverWithUItext: FC<PopoverWithUItextProps> = (props) => {
  const { id } = props
  const { text, error } = useUItext(id)

  if (error) return null

  return <SimplePopover content={text} />
}
