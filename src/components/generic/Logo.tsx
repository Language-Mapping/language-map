import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ReactComponent as ProjectLogo } from '../../img/logo.svg'

type LogoProps = {
  darkTheme?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '2.75rem',
      [theme.breakpoints.up('sm')]: { height: '3.5rem' },
      [theme.breakpoints.up('md')]: { height: '4rem' },
      [theme.breakpoints.up('lg')]: { height: '4.5rem' },
      [theme.breakpoints.up('xl')]: { height: '5rem' },
      '& .logo-title, .logo-subtitle': {
        fill: ({ darkTheme }: LogoProps) => (darkTheme ? '#eee' : '#111'),
      },
    },
  })
)

export const Logo: FC<LogoProps> = (props) => {
  const { darkTheme } = props
  const classes = useStyles({ darkTheme })

  return <ProjectLogo className={classes.root} />
}
