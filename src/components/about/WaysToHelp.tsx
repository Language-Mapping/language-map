import React, { FC } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import { BasicExploreIntro } from 'components/explore'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0 1.25rem',
      '& p': {
        textAlign: 'center',
        fontSize: '1.15rem',
        marginBottom: '0.75rem',
      },
      '& ul': {
        paddingLeft: '0.5rem',
        fontSize: '0.85rem',
        margin: '0.5rem 0',
      },
      '& header': {
        marginBottom: '0.25rem',
      },
    },
  })
)

export const WaysToHelp: FC = (props) => {
  const classes = useStyles()

  const Text = (
    <>
      <p style={{ marginTop: 0, whiteSpace: 'pre-line' }}>
        SUPPORT URBAN LANGUAGE MAPPING
      </p>
      <ul>
        <li>
          <a
            rel="noopener noreferrer"
            href="https://elalliance.org/programs/maps/"
            target="_blank"
          >
            Donate
          </a>{' '}
          so we can keep developing (and get the print version of this map as a
          gift!)
        </li>
        <li>
          <a
            rel="noopener noreferrer"
            href="mailto:info@elalliance.org?subject=Language%20Map%20in%20My%20City"
            target="_blank"
          >
            Write to us
          </a>{' '}
          about starting a language map in your city
        </li>
      </ul>
    </>
  )

  return (
    <div className={classes.root}>
      <BasicExploreIntro introParagraph={Text} />
    </div>
  )
}
