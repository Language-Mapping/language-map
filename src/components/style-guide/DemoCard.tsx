import React, { FC, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { red } from '@material-ui/core/colors'
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardActionArea,
  CardMedia,
  Collapse,
  IconButton,
  Typography,
} from '@material-ui/core'

import { MdShare, MdMoreVert, MdExpandMore } from 'react-icons/md'
import { GoGraph } from 'react-icons/go'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
      marginLeft: 'auto',
      marginRight: 'auto',
      '& .MuiCardMedia-root': {
        backgroundSize: 'contain',
      },
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    mediaCard: {
      height: 140,
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
  })
)

export const DemoCard: FC = () => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <Card className={classes.root} raised>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            S
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MdMoreVert />
          </IconButton>
        }
        title="Sylheti"
        subheader={<i>Auburndale</i>}
      />
      <CardMedia
        className={classes.media}
        image="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Sylheti_Nagari_in_Sylheti_Nagari_script_-_example.svg/500px-Sylheti_Nagari_in_Sylheti_Nagari_script_-_example.svg.png"
        title="Sylheti Nagari script"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Could maybe use cards as the full or "Info View"? The{' '}
          <b>Description</b> would go at the bottom of the card and be truncated
          to a shortened number of characters with a "Read More..." link that
          does the same as the arrow toggle below. A max height would be needed.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="statistics">
          <GoGraph />
        </IconButton>
        <IconButton aria-label="share">
          <MdShare />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <MdExpandMore />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography component="h3" variant="h4">
            Description:
          </Typography>
          <p>
            Between 1917 and 1965, law prevented South Asians from immigrating
            to the US, but speakers of Bengali found their way to New York
            anyway, often by working on British steamships that stopped at
            various East Coast ports. Living among and assimilating into
            African-American and Puerto Rican communities, a large Bengali
            speaking community grew in East Harlem as chronicled in Vivek Bald's
            "Bengali Harlem". Beginning in the 1980s, Bangladeshis won slots in
            an immigrant lottery and started bringing their families and
            establishing communities throughout the five boroughs, working in
            construction, in delis and restaurant workers, and cab drivers.
            Bangladeshi New Yorkers (many of whom speak the Sylheti,
            Chittagonian, and Rangpuri varieties) now significantly outnumber
            other South Asians in the city.
          </p>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export const DemoMediaCard: FC = () => {
  const classes = useStyles()

  return (
    <Card className={classes.root} raised>
      <CardActionArea>
        <CardMedia
          className={classes.mediaCard}
          image="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Sylheti_Nagari_in_Sylheti_Nagari_script_-_example.svg/500px-Sylheti_Nagari_in_Sylheti_Nagari_script_-_example.svg.png"
          title="Sylheti script"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Sylheti
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Between 1917 and 1965, law prevented South Asians from immigrating
            to the US, but speakers of Bengali found their way to New York
            anyway...
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Read More
        </Button>
      </CardActions>
    </Card>
  )
}
