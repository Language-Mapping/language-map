import React, { FC, useContext, useEffect, useState } from 'react'
import { Dialog, Slide } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'

import { GlobalContext } from 'components'
import { useStyles } from './styles'
import { CloseTableProps } from './types'
import { ResultsTable } from './ResultsTable'
import { LangRecordSchema } from '../../context/types'

type ResultsModalProps = CloseTableProps & { open: boolean }

const Transition = React.forwardRef(function Transition(
  // Don't care, came straight from the MUI example
  // eslint-disable-next-line react/require-default-props, @typescript-eslint/no-explicit-any
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const ResultsModal: FC<ResultsModalProps> = (props) => {
  const { open, closeTable } = props
  const classes = useStyles()
  const { state } = useContext(GlobalContext)
  const [tableData, setTableData] = useState<LangRecordSchema[]>([])
  const [oneAndDone, setOneAndDone] = useState<boolean>(false)

  useEffect((): void => {
    if (oneAndDone || !state.langFeatures.length) return
    if (!oneAndDone) setOneAndDone(true)

    setTableData([...state.langFeatures])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.langFeatures])

  const handleClose = (): void => closeTable()

  return (
    <Dialog
      open={open}
      keepMounted
      TransitionComponent={Transition}
      disableBackdropClick
      disableEscapeKeyDown
      className={`${classes.resultsModalRoot}`}
      onClose={handleClose}
      aria-labelledby="results-modal-dialog-title"
      aria-describedby="results-modal-dialog-description"
      maxWidth="lg"
      PaperProps={{ className: classes.resultsModalPaper }}
    >
      <ResultsTable closeTable={closeTable} data={tableData} />
    </Dialog>
  )
}
