import React, { FC, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Typography, Popover, Button } from '@material-ui/core'
import { FaClipboardList } from 'react-icons/fa'
import { MdLayersClear, MdLayers } from 'react-icons/md'

import { useMapToolsDispatch, useMapToolsState } from 'components/context'
import { CensusQueryID, CensusIntro } from 'components/spatial'
import { ChipWithClick } from 'components/details'
import { DialogCloseBtn } from 'components/generic/modals'

import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
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
  const { pumaField, tractField, censusPretty, language } = props
  const mapToolsDispatch = useMapToolsDispatch()
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
  const classes = useStyles()
  const censusFieldThisLang = pumaField || tractField
  const { censusActiveFields } = useMapToolsState()

  if (!censusFieldThisLang) return null

  const handleClose = () => setAnchorEl(null)

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

    handleClose()
  }

  const open = Boolean(anchorEl)
  const id = open ? 'census-popover' : undefined

  // TODO: util for all this basic presentation stuff
  let censusType: CensusQueryID | '' = ''
  let censusLabel

  if (pumaField) {
    censusType = 'puma'
    censusLabel = 'PUMA'
  } else if (tractField) {
    censusType = 'tracts'
    censusLabel = 'tract'
  }

  const activeField = censusType ? censusActiveFields[censusType] : ''
  const vintage = '2014-2018' // TODO: don't hardcode year!

  const Heading = (
    <Typography variant="h6" className={classes.popoverHeading}>
      Census Language Data (NYC only)
    </Typography>
  )

  const MetaPara = (
    <Typography className={classes.metaPara}>
      Speakers of <em>{language}</em> are likely to be included within the
      census category of <b>{censusPretty}</b> at the ACS {vintage}{' '}
      <em>{censusLabel}</em> level.
    </Typography>
  )

  const PopoverMenu = (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      PaperProps={{ className: classes.popover, elevation: 12 }}
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
          disabled={censusFieldThisLang === activeField}
          startIcon={<MdLayers />}
        >
          Show in map
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          title="Clear census layer language"
          disabled={activeField === ''}
          onClick={() => mapToolsDispatch({ type: 'CLEAR_CENSUS_FIELD' })}
          startIcon={<MdLayersClear />}
        >
          Clear census
        </Button>
      </div>
      <Typography
        component={RouterLink}
        to="/spatial"
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
      <ChipWithClick
        icon={<FaClipboardList />}
        title="Show census options"
        text="Census"
        handleClick={handleClick}
      />
      {PopoverMenu}
    </>
  )
}
