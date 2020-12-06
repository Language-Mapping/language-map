import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Link } from '@material-ui/core'

import { createMarkup } from 'utils'
import { ToggleableSection } from 'components/generic'

type ReadMoreProps = { text: string }
type ReadMoreStyles = { open?: boolean }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    readMoreLink: {
      display: 'block',
      position: 'relative',
      // CRED: (partial): https://codepen.io/mahtab-alam/pen/aPKLBq
      '&:before': {
        content: '""',
        opacity: (props: { open: boolean }) => (props.open ? 0 : 1),
        transform: (props: { open: boolean }) =>
          props.open ? 'scaleY(0)' : 'scaleY(1)',
        position: 'absolute',
        transition: '300ms all ease',
        top: '-5.5em',
        height: '5.5em',
        left: -8,
        right: -8,
        [theme.breakpoints.up('sm')]: {
          top: '-4em',
          height: '4em',
        },
        backgroundImage: `linear-gradient(
          to bottom,
          hsl(0deg 0% 26% / 0%) 0%,
          hsl(0deg 0% 26% / 90%) 100%
        )`,
      },
    },
    innerText: {
      position: 'relative',
      top: (props: { open: boolean }) => (props.open ? 0 : '-0.75em'),
      fontWeight: 'bold',
    },
    description: {
      marginTop: '0.5em',
      textAlign: 'left',
    },
  })
)

export const ReadMore: FC<ReadMoreProps> = (props) => {
  const [showDescrip, setShowDescrip] = useState<boolean>(false)
  const classes = useStyles({ open: showDescrip })
  const { text } = props

  const ToggleDescription = (
    <Link
      href="#"
      className={classes.readMoreLink}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault()
        setShowDescrip(!showDescrip)
      }}
    >
      <span className={classes.innerText}>{`Read ${
        showDescrip ? 'less' : 'more'
      }`}</span>
    </Link>
  )

  return (
    <>
      <ToggleableSection show={showDescrip} initialHeight="4rem">
        <div
          className={classes.description}
          dangerouslySetInnerHTML={createMarkup(text)}
        />
      </ToggleableSection>
      {ToggleDescription}
    </>
  )
}
