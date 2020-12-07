import React, { FC, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Typography, Popover, Button } from '@material-ui/core'
import { FaClipboardList, FaCheck, FaListUl } from 'react-icons/fa'
import { MdClear } from 'react-icons/md'

import { useMapToolsDispatch, useMapToolsState } from 'components/context'
import { CensusQueryID, CensusIntro } from 'components/spatial'
import { ChipWithClick } from 'components/details'

import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      maxWidth: 325,
      padding: '1em',
    },
    popoverHeading: {
      fontSize: '1.25rem',
    },
    buttonGroup: {
      justifyContent: 'space-evenly',
      display: 'flex',
      width: '100%',
    },
  })
)

export const CensusPopover: FC<Types.CensusPopoverProps> = (props) => {
  const { pumaField, tractField, censusPretty } = props
  const mapToolsDispatch = useMapToolsDispatch()
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
  const classes = useStyles()
  const censusFieldThisLang = pumaField || tractField
  const { censusActiveFields } = useMapToolsState()

  if (!censusFieldThisLang) return null

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCensusClick = (e: React.MouseEvent) => {
    e.preventDefault()

    mapToolsDispatch({
      type: 'SET_CENSUS_FIELD',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      censusType,
      payload: censusFieldThisLang,
    })
  }

  const handleClose = () => setAnchorEl(null)
  const open = Boolean(anchorEl)
  const id = open ? 'census-popover' : undefined
  let censusType: CensusQueryID | '' = ''
  let censusLabel

  if (pumaField) {
    censusType = 'puma'
    censusLabel = 'PUMA'
  } else if (tractField) {
    censusType = 'tracts'
    censusLabel = 'Tract'
  }

  const activeField = censusType ? censusActiveFields[censusType] : ''

  const Heading = (
    <Typography variant="h6" className={classes.popoverHeading}>
      Census Language Data (NYC only)
    </Typography>
  )

  const Granularity = (
    <Typography variant="caption" paragraph>
      {/* TODO: don't hardcode! */}
      Related ACS 2014-2018 Data ({censusLabel}-level): <b>{censusPretty}</b>
    </Typography>
  )

  const PopoverMenu = (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      PaperProps={{ className: classes.popover, elevation: 12 }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      {Heading}
      <CensusIntro concise />
      {Granularity}
      <div className={classes.buttonGroup}>
        <Button
          color="primary"
          size="small"
          onClick={handleCensusClick}
          title="Set census layer language"
          disabled={censusFieldThisLang === activeField}
          startIcon={<FaCheck />}
        >
          Set
        </Button>
        <Button
          color="primary"
          size="small"
          title="Clear census layer language"
          disabled={activeField === ''}
          onClick={() => mapToolsDispatch({ type: 'CLEAR_CENSUS_FIELD' })}
          startIcon={<MdClear />}
        >
          Clear
        </Button>
        <Button
          color="primary"
          size="small"
          title="View all census languages and other map options"
          component={RouterLink}
          to="/spatial"
          startIcon={<FaListUl />}
        >
          All languages
        </Button>
      </div>
    </Popover>
  )

  return (
    <div style={{ marginTop: '1em' }}>
      <ChipWithClick
        icon={<FaClipboardList />}
        title="Show census options"
        text="Census"
        handleClick={handleClick}
      />
      {PopoverMenu}
    </div>
  )
}
