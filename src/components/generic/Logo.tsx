import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ReactComponent as ProjectLogo } from '../../img/logo.svg'

type LogoProps = {
  darkTheme?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '2.75em',
      [theme.breakpoints.up('sm')]: { height: '3.5em' },
      [theme.breakpoints.up('md')]: { height: '4em' },
      [theme.breakpoints.up('lg')]: { height: '4.5em' },
      [theme.breakpoints.up('xl')]: { height: '5em' },
      '& path': {
        // In order to transition fill, must start w/initial value
        // CRED: https://stackoverflow.com/a/20012937/1048518
        fill: '#111',
      },
      '& .logo-title > path, .logo-subtitle > path': {
        transition: 'fill 3000ms ease',
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
