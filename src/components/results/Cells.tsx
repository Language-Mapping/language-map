import React, { FC } from 'react'
import {
  makeStyles,
  createStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles'
import { MdCheck } from 'react-icons/md'
import { GoCircleSlash } from 'react-icons/go'

import { LegendSwatch } from 'components/legend'
import { InstanceLevelSchema } from 'components/context/types'
import { CellProps, MediaColumnCellProps } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    disabled: {
      color: theme.palette.text.secondary,
    },
  })
)

export const MediaColumnCell: FC<MediaColumnCellProps> = (props) => {
  const classes = useStyles()
  const { data, columnName } = props

  return (
    <div className={classes.disabled} style={{ paddingLeft: 16 }}>
      {data[columnName] ? <MdCheck /> : <GoCircleSlash />}
    </div>
  )
}

export const GlobalSpeakers: FC<CellProps> = (props) => {
  const classes = useStyles()
  const { data } = props

  if (!data['Global Speaker Total']) return null

  return (
    // Right-aligned number w/left-aligned column heading was requested
    <div className={classes.disabled} style={{ paddingRight: 16 }}>
      {data['Global Speaker Total'].toLocaleString()}
    </div>
  )
}

export const CommStatus: FC<CellProps> = (props) => {
  const classes = useStyles()
  const { data } = props

  return <div className={classes.disabled}>{data.Status}</div>
}

export const CommSize: FC<{
  data: InstanceLevelSchema
}> = (props) => {
  const theme = useTheme()
  const { data } = props
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

export const WorldRegion: FC<CellProps> = (props) => {
  const { data } = props

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
