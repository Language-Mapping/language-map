import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Popover } from '@material-ui/core'
import { BiMapPin } from 'react-icons/bi'
import { IoIosPeople } from 'react-icons/io'

import { paths as routes } from 'components/config/routes'
import { SwatchOnly } from 'components/legend'
import { Chip, NeighborhoodList } from 'components/details'
import { DialogCloseBtn } from 'components/generic/modals'

import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      fontSize: '0.75rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      margin: '0.5rem 0 0',
      '& > * + *': {
        marginLeft: '0.35rem',
      },
    },
    popover: {
      maxWidth: 350,
      minWidth: 325,
      padding: '1rem',
    },
    popoverHeading: {
      fontSize: '1.3rem',
      display: 'flex',
      alignItems: 'center',
    },
  })
)

export const MoreLikeThis: FC<Types.MoreLikeThisProps> = (props) => {
  const { data, children } = props
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  const {
    'Primary Neighborhood': primaryNeighb,
    'Additional Neighborhoods': addlNeighbs,
    'World Region': WorldRegion,
    Country,
    countryFlags,
    Macrocommunity: macro,
    Town,
    worldRegionColor,
  } = data

  const handleClose = () => setAnchorEl(null)

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'neighbs-menu-popover' : undefined

  const NeighbsMenu = (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      PaperProps={{ className: classes.popover, elevation: 12 }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      transformOrigin={{ vertical: 'center', horizontal: 'left' }}
    >
      <NeighborhoodList data={data} />
      <DialogCloseBtn
        tooltip="Close census menu"
        onClose={() => handleClose()}
      />
    </Popover>
  )
  const addlCount = addlNeighbs?.length
  const neighbsChipText = `${primaryNeighb || Town}${
    addlCount ? ` +${addlCount}` : ''
  }`

  // Careful, not using TS on the mid-route paths, e.g. "World Region"
  return (
    <div className={classes.root}>
      {children}
      {NeighbsMenu}
      <Chip
        text={neighbsChipText}
        icon={<BiMapPin />}
        title="Show neighborhood or town options"
        handleClick={handleClick}
      />
      {Country.map((countryName, i) => (
        <Chip
          key={countryName}
          text={countryName}
          to={`${routes.grid}/Country/${countryName}`}
          icon={
            <img
              className="country-flag"
              alt={`${countryName} flag`}
              src={countryFlags[i].url}
            />
          }
        />
      ))}
      <Chip
        text={WorldRegion}
        to={`${routes.grid}/World Region/${WorldRegion}`}
        icon={<SwatchOnly backgroundColor={worldRegionColor} />}
      />
      {macro && (
        <Chip
          text={macro}
          icon={<IoIosPeople />}
          to={`${routes.grid}/Macrocommunity/${macro}`}
        />
      )}
    </div>
  )
}
