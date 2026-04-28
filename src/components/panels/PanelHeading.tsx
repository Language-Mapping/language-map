import React, { FC } from 'react'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { Typography } from '@mui/material'

type PanelHeadingProps = {
  text: string
  className?: string
  component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  icon?: React.ReactNode
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      display: 'flex',
      fontSize: '1.5rem',
      '& > svg': {
        fill: theme.palette.text.secondary,
        fontSize: '0.75rem',
        marginRight: '0.25rem',
      },
    },
  })
)

// NOTE: this is old and only used by NoFeatSel at time of writing
export const PanelHeading: FC<PanelHeadingProps> = (props) => {
  const { icon, text, className, component = 'h2' } = props
  const classes = useStyles()

  return (
    <Typography
      className={`${classes.root} ${className}`}
      variant="h4"
      component={component}
    >
      {icon}
      {text}
    </Typography>
  )
}
