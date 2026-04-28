import React, { FC } from 'react'
import { useTheme, Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'
import { MdCheck } from 'react-icons/md'
import { GoCircleSlash } from 'react-icons/go'

import { LegendSwatch } from 'components/legend'
import { InstanceLevelSchema } from 'components/context/types'
import { LangCellParams } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    disabled: {
      color: theme.palette.text.secondary,
    },
  })
)

export const MediaColumnCell: FC<{
  params: LangCellParams
  columnName: keyof InstanceLevelSchema
}> = (props) => {
  const classes = useStyles()
  const { params, columnName } = props
  const data = params.row

  return (
    <div className={classes.disabled} style={{ paddingLeft: 16 }}>
      {data[columnName] ? <MdCheck /> : <GoCircleSlash />}
    </div>
  )
}

export const GlobalSpeakers: FC<{ params: LangCellParams }> = (props) => {
  const classes = useStyles()
  const { params } = props
  const data = params.row

  if (!data['Global Speaker Total']) return null

  return (
    <div className={classes.disabled} style={{ paddingRight: 16 }}>
      {data['Global Speaker Total'].toLocaleString()}
    </div>
  )
}

export const CommStatus: FC<{ params: LangCellParams }> = (props) => {
  const classes = useStyles()
  const { params } = props
  const data = params.row

  return <div className={classes.disabled}>{data.Status}</div>
}

export const CommSize: FC<{ params: LangCellParams }> = (props) => {
  const theme = useTheme()
  const { params } = props
  const data = params.row
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

export const WorldRegion: FC<{ params: LangCellParams }> = (props) => {
  const { params } = props
  const data = params.row

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
