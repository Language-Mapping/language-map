import React, { FC, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Link } from '@material-ui/core'

import { ToggleableSection, MarkdownWithRouteLinks } from 'components/generic'

type ReadMoreProps = { text: string; fontSize?: string | number }
type ReadMoreStyles = { open?: boolean } & Pick<ReadMoreProps, 'fontSize'>

const useStyles = makeStyles((theme: Theme) => {
  const desktopStyles = {
    '&:hover': {
      textDecoration: 'none',
    },
  }

  return createStyles({
    link: {
      display: 'block',
      height: 0,
      justifyContent: 'center',
      position: 'relative',
      ...(!isMobile && desktopStyles),
      // CRED: (partial): https://codepen.io/mahtab-alam/pen/aPKLBq
      '&:before': {
        content: '""',
        opacity: (props: ReadMoreStyles) => (props.open ? 0 : 1),
        transform: (props: ReadMoreStyles) =>
          props.open ? 'scaleY(0)' : 'scaleY(1)',
        position: 'absolute',
        transition: '300ms all ease',
        top: '-3rem',
        height: '3.5rem',
        left: -8,
        right: -8,
        [theme.breakpoints.up('sm')]: {
          top: '-3rem',
          height: '3rem',
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
      top: '-1rem',
      fontWeight: 'bold',
      fontSize: '0.8rem',
    },
    description: {
      textAlign: 'left',
      fontSize: (props: ReadMoreStyles) => props.fontSize,
      marginBottom: '1rem',
      lineHeight: 1.75,
    },
  })
})

export const ReadMore: FC<ReadMoreProps> = (props) => {
  const { text, fontSize } = props
  const [showDescrip, setShowDescrip] = useState<boolean>(false)
  const classes = useStyles({
    open: showDescrip,
    fontSize: fontSize || '0.7rem',
  })

  const ToggleDescription = (
    <Link
      href="#"
      className={classes.link}
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
      <ToggleableSection show={showDescrip} initialHeight="2.5rem">
        <div className={classes.description}>
          <MarkdownWithRouteLinks text={text} />
        </div>
      </ToggleableSection>
      {ToggleDescription}
    </>
  )
}
