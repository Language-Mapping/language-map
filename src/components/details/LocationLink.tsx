import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Popover } from '@material-ui/core'
import { BiMapPin } from 'react-icons/bi'

import { Chip, NeighborhoodList } from 'components/details'
import { DialogCloseBtn } from 'components/generic/modals'

import { LocationLinkProps } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      maxWidth: 350,
      minWidth: 325,
      padding: '1rem',
    },
  })
)

export const LocationLink: FC<LocationLinkProps> = (props) => {
  const { anchorEl, setAnchorEl, data } = props
  const history = useHistory()
  const classes = useStyles()
  const { Town, Neighborhood } = data

  const primaryLoc = Town || Neighborhood
  const addlCount = data['Additional Neighborhoods']?.length
  const neighbsChipText = `${primaryLoc}${addlCount ? ` +${addlCount}` : ''}`
  const explorePath = Town ? 'Town' : 'Neighborhood'

  const open = Boolean(anchorEl)
  const id = open ? 'neighbs-menu-popover' : undefined
  const handleClose = () => setAnchorEl(null)

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  if (!addlCount) {
    return (
      <Chip
        text={neighbsChipText}
        icon={<BiMapPin />}
        title={`View more languages spoken in ${primaryLoc}`}
        handleClick={() =>
          history.push(`/Explore/${explorePath}/${primaryLoc}`)
        }
      />
    )
  }

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        PaperProps={{ className: classes.popover, elevation: 12 }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
      >
        <NeighborhoodList data={data} isInstance />
        <DialogCloseBtn
          tooltip="Close census menu"
          onClose={() => handleClose()}
        />
      </Popover>
      <Chip
        text={neighbsChipText}
        icon={<BiMapPin />}
        title="Show neighborhood or town options"
        handleClick={handleClick}
      />
    </>
  )
}
