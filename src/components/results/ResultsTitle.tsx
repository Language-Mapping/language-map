/* eslint-disable operator-linebreak */
/* eslint-disable react/display-name */
import React, { FC } from 'react'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { Typography } from '@mui/material'
import { BsTable } from 'react-icons/bs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableTitleRoot: {
      gridArea: 'title',
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.down('md')]: {
        '& .MuiFormControl-root': { paddingLeft: 8 },
      },
    },
    titleIcon: {
      fontSize: '0.6em',
      color: theme.palette.text.secondary,
      marginRight: theme.spacing(1),
      flexShrink: 0,
    },
  })
)

export const ResultsTitle: FC = () => {
  const classes = useStyles()

  return (
    <Typography variant="h4" className={classes.tableTitleRoot}>
      <BsTable className={classes.titleIcon} />
      Data
    </Typography>
  )
}
