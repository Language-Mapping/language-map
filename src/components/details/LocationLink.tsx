import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Link, Popover } from '@material-ui/core'
import { BiMapPin } from 'react-icons/bi'

import { NeighborhoodList } from 'components/details'
import { DialogCloseBtn } from 'components/generic/modals'

import { LocationLinkProps } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: '0.85rem',
      '& + *': {
        marginBottom: '0.75rem',
      },
      '& > svg': {
        marginRight: 4,
      },
    },
    popover: {
      maxWidth: 375,
      minWidth: 350, // needs at least 350ish, otherwise single card fills row
      padding: '1rem',
    },
  })
)

export const LocationLink: FC<LocationLinkProps> = (props) => {
  const { anchorEl, setAnchorEl, data } = props
  const classes = useStyles()
  const { Town, Neighborhood } = data

  const primaryLoc = Town || Neighborhood
  const addlCount = data['Additional Neighborhoods']?.length
  const linkText = `${primaryLoc}${addlCount ? ` +${addlCount}` : ''}`
  const explorePath = Town ? 'Town' : 'Neighborhood'

  const open = Boolean(anchorEl)
  const id = open ? 'neighbs-menu-popover' : undefined
  const handleClose = () => setAnchorEl(null)

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  if (!addlCount) {
    return (
      <RouterLink
        className={classes.link}
        title={`View more languages spoken in ${primaryLoc}`}
        to={`/Explore/${explorePath}/${primaryLoc}`}
      >
        <BiMapPin />
        {linkText}
      </RouterLink>
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
      <Link
        href="#"
        role="button"
        className={classes.link}
        title="Show neighborhood or town options"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore // TODO: mas tarde...
        onClick={handleClick}
      >
        <BiMapPin />
        {linkText}
      </Link>
    </>
  )
}
