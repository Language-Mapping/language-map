// CRED: for the majority of this file:
// https://github.com/Covid-Self-report-Tool/cov-self-report-frontend/blob/master/src/components/ShareButtons.tsx
import React, { FC } from 'react'
import { Grid } from '@material-ui/core'
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

const url = 'https://map.languagemapping.org/'
const title = 'New York City Linguistic Diversity Map'
const summary =
  'An interactive map of language diversity in York City, one of the world’s most linguistically diverse metropolitan areas.'
const sourceAkaAppName = 'NYC Language Diversity Map'

const ShareButtonConfig = [
  <FacebookShareButton key="facebook" url={url} quote={summary}>
    <FacebookIcon size={32} round />
  </FacebookShareButton>,
  <TwitterShareButton key="twitter" url={url} title={`${title} ${summary}`}>
    <TwitterIcon size={32} round />
  </TwitterShareButton>,
  <WhatsappShareButton key="whatsapp" url={url} title={title}>
    <WhatsappIcon size={32} round />
  </WhatsappShareButton>,
  <LinkedinShareButton
    key="linkedin"
    url={url}
    title={title}
    summary={summary}
    source={sourceAkaAppName}
  >
    <LinkedinIcon size={32} round />
  </LinkedinShareButton>,
  <RedditShareButton key="reddit" url={url} title={title}>
    <RedditIcon size={32} round />
  </RedditShareButton>,
  <EmailShareButton key="email" url={url} subject={title} body={summary}>
    <EmailIcon size={32} round />
  </EmailShareButton>,
]

export const ShareButtons: FC = () => {
  return (
    <Grid
      container
      spacing={1}
      justify="center"
      wrap="nowrap"
      alignItems="center"
    >
      {ShareButtonConfig.map((item, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Grid key={i} item>
          {item}
        </Grid>
      ))}
    </Grid>
  )
}
