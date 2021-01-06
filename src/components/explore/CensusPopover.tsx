import React, { FC, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Typography, Popover, Button } from '@material-ui/core'
import { FaClipboardList } from 'react-icons/fa'
import { MdLayersClear, MdLayers } from 'react-icons/md'

import { useMapToolsDispatch, useMapToolsState } from 'components/context'
import { CensusIntro } from 'components/local'
import { Chip } from 'components/details'
import { DialogCloseBtn } from 'components/generic/modals'

import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 350,
      padding: '1rem',
    },
    popoverHeading: {
      fontSize: '1.3rem',
    },
    buttonGroup: {
      justifyContent: 'space-evenly',
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      gridColumnGap: '0.5rem',
    },
    metaPara: {
      fontSize: '0.75rem',
      margin: '0 0 0.75rem',
      paddingTop: '1rem',
      borderTop: `dashed 1px ${theme.palette.divider}`,
    },
    viewAllLink: {
      display: 'block',
      fontSize: '0.75rem',
      marginTop: '0.5rem',
    },
  })
)

export const CensusPopover: FC<Types.CensusPopoverProps> = (props) => {
  const { data } = props
  const mapToolsDispatch = useMapToolsDispatch()
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
  const classes = useStyles()
  const { censusActiveField } = useMapToolsState()
  const { Language, censusPretty, censusScope, censusField } = data

  if (!censusField) return null

  const handleClose = () => setAnchorEl(null)
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) =>
    setAnchorEl(event.currentTarget)

  const handleCensusClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // They should both exist, but the check above doesn't cover it
    if (censusField && censusScope) {
      mapToolsDispatch({
        type: 'SET_CENSUS_FIELD',
        payload: { id: censusField, scope: censusScope },
      })
    }

    handleClose()
  }

  const open = Boolean(anchorEl)
  const censusLabel = censusScope === 'puma' ? 'PUMA' : 'tract'
  const activeField = censusActiveField?.id
  const vintage = '2014-2018' // TODO: don't hardcode year!

  const Heading = (
    <Typography variant="h6" className={classes.popoverHeading}>
      Census Language Data (NYC only)
    </Typography>
  )

  const MetaPara = (
    <Typography className={classes.metaPara}>
      Speakers of <em>{Language}</em> are likely to be included within the
      census category of <b>{censusPretty}</b> at the ACS {vintage}{' '}
      <em>{censusLabel}</em> level.
    </Typography>
  )

  const PopoverMenu = (
    <Popover
      id={open ? 'census-popover' : undefined}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      PaperProps={{ className: classes.root, elevation: 12 }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      transformOrigin={{ vertical: 'center', horizontal: 'left' }}
    >
      {Heading}
      <CensusIntro subtle />
      {MetaPara}
      <div className={classes.buttonGroup}>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleCensusClick}
          title="Set census layer language"
          disabled={activeField !== undefined && activeField === censusField}
          startIcon={<MdLayers />}
        >
          Show in map
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          title="Clear census layer language"
          disabled={activeField === undefined}
          onClick={() => mapToolsDispatch({ type: 'CLEAR_CENSUS_FIELD' })}
          startIcon={<MdLayersClear />}
        >
          Clear census
        </Button>
      </div>
      <Typography
        component={RouterLink}
        to="/local"
        align="center"
        className={classes.viewAllLink}
      >
        View all census language categories
      </Typography>
      <DialogCloseBtn
        tooltip="Close census menu"
        onClose={() => handleClose()}
      />
    </Popover>
  )

  return (
    <>
      <Chip
        icon={<FaClipboardList />}
        title="Show census options"
        text="Census"
        handleClick={handleClick}
      />
      {PopoverMenu}
    </>
  )
}
