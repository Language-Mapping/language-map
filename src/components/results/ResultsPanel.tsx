import React, { FC, useContext, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@material-ui/core'
import { MdClose } from 'react-icons/md'
import { AiOutlineFullscreen } from 'react-icons/ai'

import { GlobalContext, LoadingIndicator } from 'components'
import { ResultsTable } from './ResultsTable'

type ResultsModalType = {
  children: React.ReactNode
  setResultsModalOpen: React.Dispatch<boolean>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resultsPanelRoot: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      textAlign: 'center',
    },
    closeBtn: {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
  })
)

const ResultsModal: FC<ResultsModalType> = ({
  children,
  setResultsModalOpen,
}) => {
  const classes = useStyles()

  const handleClose = () => {
    setResultsModalOpen(false)
  }

  return (
    <Dialog
      open
      onClose={handleClose}
      aria-labelledby="results-modal-dialog-title"
      aria-describedby="results-modal-dialog-description"
      maxWidth="md"
    >
      <DialogTitle id="results-modal-dialog-title" disableTypography>
        <Typography variant="h2">Data</Typography>
      </DialogTitle>
      <IconButton onClick={handleClose} className={classes.closeBtn}>
        <MdClose />
      </IconButton>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Exit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const ResultsPanel: FC = () => {
  const classes = useStyles()
  const { state } = useContext(GlobalContext)
  const { langFeaturesCached, langFeatures } = state
  const [resultsModalOpen, setResultsModalOpen] = useState<boolean>(false)

  // Shaky check to see if features have loaded and are stored globally
  if (!state.langFeaturesCached.length) {
    return <LoadingIndicator />
  }

  // TODO: highlight selected feature in table
  // const parsed = queryString.parse(window.location.search)
  // const matchingRecord = state.langFeatures.find(
  //   (feature) => feature.ID === parsed.id
  // )

  // TODO: https://reactjs.org/docs/react-api.html#cloneelement
  // React.cloneElement(element, [props], [...children])

  return (
    <div className={classes.resultsPanelRoot}>
      <Typography variant="subtitle2">
        Showing {langFeatures.length} of {langFeaturesCached.length} language
        communities.
      </Typography>
      <p>
        <Button
          onClick={() => setResultsModalOpen(true)}
          color="primary"
          size="small"
          variant="outlined"
          startIcon={<AiOutlineFullscreen />}
        >
          View fullscreen
        </Button>
      </p>
      {resultsModalOpen && (
        <ResultsModal setResultsModalOpen={setResultsModalOpen}>
          <ResultsTable setResultsModalOpen={setResultsModalOpen} />
        </ResultsModal>
      )}
      <ResultsTable setResultsModalOpen={setResultsModalOpen} />
    </div>
  )
}
