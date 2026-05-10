import React, { FC } from 'react'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { BiMapPin } from 'react-icons/bi'

const useLocalIndicatorStyles = makeStyles((theme: Theme) =>
  createStyles({
    localIndicator: {
      display: 'flex',
      alignItems: 'center',
      '& svg': { color: theme.palette.secondary.light, marginRight: 4 },
    },
  })
)

export const LocalColumnTitle: FC<{ text: string }> = (props) => {
  const { text } = props
  const classes = useLocalIndicatorStyles()

  return (
    <div className={classes.localIndicator}>
      <BiMapPin /> {text}
    </div>
  )
}
