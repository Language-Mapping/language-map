import React, { FC } from 'react'
import { Typography, Box, Grid, Paper } from '@material-ui/core'

export const DemoColors: FC = () => {
  return (
    <>
      <Paper elevation={4}>
        <Typography component="h3" variant="h4">
          Text Colors
        </Typography>
        <Typography component="div" variant="body1">
          <Box color="primary.main">primary.main</Box>
          <Box color="secondary.main">secondary.main</Box>
          <Box color="error.main">error.main</Box>
          <Box color="warning.main">warning.main</Box>
          <Box color="info.main">info.main</Box>
          <Box color="success.main">success.main</Box>
          <Box color="text.primary">text.primary</Box>
          <Box color="text.secondary">text.secondary</Box>
          <Box color="text.disabled">text.disabled</Box>
        </Typography>
      </Paper>
      <Paper elevation={4}>
        <Typography component="h3" variant="h4">
          Background Colors
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Box bgcolor="primary.main" color="primary.contrastText" p={2}>
              primary.main
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box bgcolor="secondary.main" color="secondary.contrastText" p={2}>
              secondary.main
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box bgcolor="error.main" color="error.contrastText" p={2}>
              error.main
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box bgcolor="warning.main" color="warning.contrastText" p={2}>
              warning.main
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box bgcolor="info.main" color="info.contrastText" p={2}>
              info.main
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box bgcolor="success.main" color="success.contrastText" p={2}>
              success.main
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box bgcolor="text.primary" color="background.paper" p={2}>
              text.primary
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box bgcolor="text.secondary" color="background.paper" p={2}>
              text.secondary
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box bgcolor="text.disabled" color="background.paper" p={2}>
              text.disabled
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}
