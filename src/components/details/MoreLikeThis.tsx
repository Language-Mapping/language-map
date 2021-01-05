import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Popover } from '@material-ui/core'
import { BiMapPin } from 'react-icons/bi'
import { IoIosPeople } from 'react-icons/io'

import { paths as routes } from 'components/config/routes'
import { SwatchOnly } from 'components/legend'
import { Chip, NeighborhoodList } from 'components/details'
import { DialogCloseBtn } from 'components/generic/modals'

import { useHistory } from 'react-router-dom'
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
  const { data, children, isInstance } = props
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
  const history = useHistory()

  const {
    'World Region': WorldRegion,
    Country,
    countryImg,
    Macrocommunity: macro,
    worldRegionColor,
    Town,
    Neighborhood,
  } = data

  const primaryLoc = Town || Neighborhood

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
      <NeighborhoodList data={data} isInstance={isInstance} />
      <DialogCloseBtn
        tooltip="Close census menu"
        onClose={() => handleClose()}
      />
    </Popover>
  )
  const addlCount = isInstance && data['Additional Neighborhoods']?.length
  const neighbsChipText = `${primaryLoc}${addlCount ? ` +${addlCount}` : ''}`
  const explorePath = Town ? 'Town' : 'Neighborhood'

  // TODO: use TS on all mid-route paths, e.g. "World Region"
  return (
    <div className={classes.root}>
      {isInstance && (
        <>
          {addlCount ? NeighbsMenu : null}
          {addlCount ? (
            <Chip
              text={neighbsChipText}
              icon={<BiMapPin />}
              title="Show neighborhood or town options"
              handleClick={handleClick}
            />
          ) : (
            <Chip
              text={neighbsChipText}
              icon={<BiMapPin />}
              title={`View more languages spoken in ${primaryLoc}`}
              handleClick={() =>
                history.push(`/Explore/${explorePath}/${primaryLoc}`)
              }
            />
          )}
        </>
      )}
      <Chip
        text={WorldRegion}
        to={`${routes.grid}/World Region/${WorldRegion}`}
        icon={<SwatchOnly backgroundColor={worldRegionColor} />}
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
              src={countryImg[i].url}
            />
          }
        />
      ))}
      {!isInstance && macro && (
        <Chip
          text={macro}
          icon={<IoIosPeople />}
          to={`${routes.grid}/Macrocommunity/${macro}`}
        />
      )}
      {children}
    </div>
  )
}
