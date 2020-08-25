import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Box } from '@material-ui/core'

import { LangRecordSchema } from '../../context/types'

type OmniboxComponent = {
  data: LangRecordSchema[]
  noFiltersSet: boolean
  clearFilters: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resultRoot: {
      fontSize: '1rem',
    },
    resultHeading: {
      fontSize: '1rem',
      color: theme.palette.primary.main,
      fontWeight: 'bold',
      lineHeight: 1,
    },
  })
)

export const OmniboxResult: FC<{ data: LangRecordSchema }> = (props) => {
  const { data } = props
  const classes = useStyles()
  const { resultRoot, resultHeading } = classes
  const { Neighborhoods, Town, Glottocode, 'ISO 639-3': iso } = data

  return (
    <Box className={resultRoot}>
      <Typography className={resultHeading}>{Neighborhoods || Town}</Typography>
      {Glottocode ? <small>Glottocode: {Glottocode}</small> : null}
      {Glottocode && iso ? ' | ' : null}
      {iso ? <small>ISO 639-3: {iso}</small> : null}
    </Box>
  )
}
