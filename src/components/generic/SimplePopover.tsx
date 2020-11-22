import React, { FC } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import { GoInfo } from 'react-icons/go'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      maxWidth: 300,
    },
    typography: {
      fontSize: '0.75em',
      padding: theme.spacing(2),
    },
  })
)

// TODO: either rename to "InfoPopover" or support alternate icon and call it
// "ButtonPopover"
export const SimplePopover: FC<{ text: string }> = (props) => {
  const { text } = props
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

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
        <GoInfo />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        PaperProps={{
          className: classes.popover,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography className={classes.typography}>{text}</Typography>
      </Popover>
    </div>
  )
}
