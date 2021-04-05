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
import { Explanation, SubtleText, UItextFromAirtable } from 'components/generic'

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
      marginTop: '0.75rem',
    },
    metaPara: {
      marginTop: '0.75rem',
      paddingTop: '1rem',
      borderTop: `dashed 1px ${theme.palette.divider}`,
      color: theme.palette.text.primary,
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
  const { censusPretty, censusScope, censusField, name } = data

  if (!censusField) return null

  const handleClose = () => setAnchorEl(null)
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) =>
    setAnchorEl(event.currentTarget)

  const handleCensusClick = () => {
    handleClose()

    // They should both exist, but the check above doesn't cover it
    if (censusField && censusScope) {
      mapToolsDispatch({
        type: 'SET_CENSUS_FIELD',
        payload: { id: censusField, scope: censusScope },
      })
    }
  }

  const open = Boolean(anchorEl)
  const censusLabel = censusScope === 'puma' ? 'PUMA' : 'tract'
  const activeField = censusActiveField?.id

  const Heading = (
    <Typography variant="h6" className={classes.popoverHeading}>
      Census Language Data (NYC only)
    </Typography>
  )

  const MetaPara = (
    <Explanation className={classes.metaPara}>
      Speakers of <em>{name}</em> are likely to be included within the census
      category of <b>{censusPretty}</b> at the ACS{' '}
      <UItextFromAirtable id="census-vintage" /> <em>{censusLabel}</em> level.
    </Explanation>
  )

  const PopoverMenu = (
    <Popover
      id={open ? 'census-popover' : undefined}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      PaperProps={{ className: classes.root, elevation: 24 }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      transformOrigin={{ vertical: 'center', horizontal: 'left' }}
    >
      {Heading}
      <SubtleText>
        <CensusIntro />
      </SubtleText>
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
        to="/Census"
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
