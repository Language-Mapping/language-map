import React, { FC } from 'react'
import { Dialog } from '@material-ui/core'

import { useStyles } from 'components/filters/config.styles'
import { CloseTableProps } from './types'
import { ResultsTable } from './ResultsTable'

type ResultsModalProps = CloseTableProps & {
  open: boolean
}

export const ResultsModal: FC<ResultsModalProps> = (props) => {
  const { open, closeTable } = props
  const classes = useStyles()

  const handleClose = (): void => closeTable()

  return (
    <Dialog
      open={open}
      className={`${classes.resultsModalRoot}`}
      onClose={handleClose}
      aria-labelledby="results-modal-dialog-title"
      aria-describedby="results-modal-dialog-description"
      maxWidth="lg"
      PaperProps={{
        className: classes.resultsModalPaper,
      }}
    >
      {/* TODO: restore? */}
      {/* <Typography className={classes.featureCount}>
        Showing {langFeatures.length} of {langFeatures.length} language
        communities.
      </Typography> */}
      <ResultsTable closeTable={closeTable} />
    </Dialog>
  )
}
