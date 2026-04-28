import React, { FC } from 'react'
import { useTheme, Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'
import { MdCheck } from 'react-icons/md'
import { GoCircleSlash } from 'react-icons/go'

import { LegendSwatch } from 'components/legend'
import { InstanceLevelSchema } from 'components/context/types'
import { LangCellContext } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    disabled: {
      color: theme.palette.text.secondary,
    },
  })
)

export const MediaColumnCell: FC<{
  info: LangCellContext
  columnName: keyof InstanceLevelSchema
}> = (props) => {
  const classes = useStyles()
  const { info, columnName } = props
  const data = info.row.original

  return (
    <div className={classes.disabled} style={{ paddingLeft: 16 }}>
      {data[columnName] ? <MdCheck /> : <GoCircleSlash />}
    </div>
  )
}

export const GlobalSpeakers: FC<{ info: LangCellContext }> = (props) => {
  const classes = useStyles()
  const { info } = props
  const data = info.row.original

  if (!data['Global Speaker Total']) return null

  return (
    <div className={classes.disabled} style={{ paddingRight: 16 }}>
      {data['Global Speaker Total'].toLocaleString()}
    </div>
  )
}

export const CommStatus: FC<{ info: LangCellContext }> = (props) => {
  const classes = useStyles()
  const { info } = props
  const data = info.row.original

  return <div className={classes.disabled}>{data.Status}</div>
}

export const CommSize: FC<{ info: LangCellContext }> = (props) => {
  const theme = useTheme()
  const { info } = props
  const data = info.row.original
  const { Size, sizeColor } = data

  return (
    <LegendSwatch
      legendLabel={Size}
      component="div"
      iconID="_circle"
      backgroundColor={sizeColor}
      labelStyleOverride={{
        lineHeight: 'inherit',
        marginLeft: 2,
        color: theme.palette.text.secondary,
        fontSize: 'inherit',
      }}
    />
  )
}

export const WorldRegion: FC<{ info: LangCellContext }> = (props) => {
  const { info } = props
  const data = info.row.original

  return (
    <LegendSwatch
      legendLabel={data['World Region']}
      component="div"
      iconID="_circle"
      backgroundColor={data.worldRegionColor}
      labelStyleOverride={{
        lineHeight: 'inherit',
        marginLeft: 2,
        fontSize: 'inherit',
      }}
    />
  )
}
