import React, { FC, useContext, useEffect, useState } from 'react'
import { Dialog } from '@material-ui/core'

import { useStyles } from 'components/filters/config.styles'
import { GlobalContext } from 'components'
import { CloseTableProps } from './types'
import { ResultsTable } from './ResultsTable'
import { LangRecordSchema } from '../../context/types'

type ResultsModalProps = CloseTableProps & {
  open: boolean
}

export const ResultsModal: FC<ResultsModalProps> = (props) => {
  const { open, closeTable } = props
  const classes = useStyles()
  const { state } = useContext(GlobalContext)
  const [tableData, setTableData] = useState<LangRecordSchema[]>([])
  const [oneAndDone, setOneAndDone] = useState<boolean>(false)

  // useEffect((): void => setTableData(state.langFeatures), [state.langFeatures])
  useEffect((): void => {
    if (oneAndDone || !state.langFeatures.length) return
    if (!oneAndDone) setOneAndDone(true)

    setTableData([...state.langFeatures])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.langFeatures])

  const handleClose = (): void => closeTable()

  if (!tableData.length) return null

  return (
    <Dialog
      open={open}
      keepMounted
      className={`${classes.resultsModalRoot}`}
      onClose={handleClose}
      aria-labelledby="results-modal-dialog-title"
      aria-describedby="results-modal-dialog-description"
      maxWidth="lg"
      PaperProps={{
        className: classes.resultsModalPaper,
      }}
    >
      <ResultsTable
        closeTable={closeTable}
        data={tableData}
        gangsAllHere={state.langFeatures.length === state.langFeatsLenCache}
      />
    </Dialog>
  )
}
