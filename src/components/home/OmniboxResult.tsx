import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Box } from '@material-ui/core'
import { FaStreetView } from 'react-icons/fa'

import { PreppedAutocompleteGroup } from './types'

type SmallDetailProps = {
  label: string
  value: React.ReactNode | string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resultRoot: {
      fontSize: '0.8rem',
    },
    resultHeading: {
      alignItems: 'center',
      color: theme.palette.secondary.main,
      display: 'flex',
      fontSize: '1em',
      lineHeight: 1,
      marginTop: 4,
      '& svg': {
        color: theme.palette.secondary.main,
        flexShrink: 0, // otherwise squished next to super-long headings
        marginRight: 3,
      },
    },
    // The footer
    details: {
      display: 'flex',
      '& > :first-child': {
        marginRight: 4,
      },
    },
    detailLabel: {
      fontFamily: theme.typography.h1.fontFamily,
      color: theme.palette.text.primary,
      marginRight: 4,
    },
    detailValue: {
      color: theme.palette.text.secondary,
      fontSize: '0.9em',
      marginRight: 4,
    },
  })
)

const SmallDetail: FC<SmallDetailProps> = (props) => {
  const { label, value } = props
  const classes = useStyles()
  const { detailLabel, detailValue } = classes

  return (
    <div>
      <span className={detailLabel}>{label}:</span>
      <span className={detailValue}>{value}</span>
    </div>
  )
}

export const OmniboxResult: FC<{ data: PreppedAutocompleteGroup }> = (
  props
) => {
  const { data } = props
  const classes = useStyles()
  const { resultRoot, resultHeading, details } = classes
  const { Glottocode, 'ISO 639-3': iso } = data

  return (
    <Box className={resultRoot}>
      <Typography component="h4" className={resultHeading}>
        <FaStreetView />
        {data.location}
      </Typography>
      <Box component="footer" className={details}>
        {Glottocode ? (
          <SmallDetail label="Glottocode" value={Glottocode} />
        ) : null}
        {iso ? <SmallDetail label="ISO 639-3" value={iso} /> : null}
      </Box>
    </Box>
  )
}
