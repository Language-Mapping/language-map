// CRED: for the majority of this file:
// https://github.com/Covid-Self-report-Tool/cov-self-report-frontend/blob/master/src/components/ShareButtons.tsx
import React, { FC } from 'react'
import { Grid, GridSpacing } from '@material-ui/core'
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'

type ShareBtnProps = {
  source?: string
  spacing?: GridSpacing
  summary?: string
  title?: string
  url?: string
}

const DEFAULT_URL = 'https://map.languagemapping.org/'
const DEFAULT_TITLE = 'New York City Linguistic Diversity Map'
const DEFAULT_SUMMARY =
  'An interactive map of language diversity in York City, one of the world’s most linguistically diverse metropolitan areas.'
const DEFAULT_SOURCE = 'NYC Language Diversity Map'

const sharedProps = { size: 32, round: true }

export const ShareButtons: FC<ShareBtnProps> = (props) => {
  const {
    source = DEFAULT_SOURCE,
    summary = DEFAULT_SUMMARY,
    title = DEFAULT_TITLE,
    url = DEFAULT_URL,
    spacing = 1,
  } = props

  return (
    <Grid
      container
      justify="center"
      spacing={spacing}
      wrap="nowrap"
      alignItems="center"
    >
      <Grid item>
        <FacebookShareButton url={url} quote={summary}>
          <FacebookIcon {...sharedProps} />
        </FacebookShareButton>
      </Grid>
      <Grid item>
        <TwitterShareButton url={url} title={`${title} ${summary}`}>
          <TwitterIcon {...sharedProps} />
        </TwitterShareButton>
      </Grid>
      <Grid item>
        <WhatsappShareButton url={url} title={title}>
          <WhatsappIcon {...sharedProps} />
        </WhatsappShareButton>
      </Grid>
      <Grid item>
        <LinkedinShareButton
          url={url}
          title={title}
          summary={summary}
          source={source}
        >
          <LinkedinIcon {...sharedProps} />
        </LinkedinShareButton>
      </Grid>
      <Grid item>
        <RedditShareButton url={url} title={title}>
          <RedditIcon {...sharedProps} />
        </RedditShareButton>
      </Grid>
      <Grid item>
        <EmailShareButton url={url} subject={title} body={summary}>
          <EmailIcon {...sharedProps} />
        </EmailShareButton>
      </Grid>
    </Grid>
  )
}
