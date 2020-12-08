import React, { FC, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Typography, Button } from '@material-ui/core'
import { FaRandom } from 'react-icons/fa'

import { GlobalContext } from 'components/context'
import { paths as routes } from 'components/config/routes'
import { useStyles } from './styles'

const RandomLinkBtn: FC = () => {
  const { state } = useContext(GlobalContext)
  const { langFeatures } = state

  if (!langFeatures.length) return null

  const randoIndex = Math.floor(Math.random() * (langFeatures.length - 1))
  const id = langFeatures[randoIndex].ID

  return (
    <Button
      variant="contained"
      color="primary"
      component={RouterLink}
      size="small"
      startIcon={<FaRandom />}
      to={`${routes.details}/${id}`}
    >
      Try one at random
    </Button>
  )
}

export const NoFeatSel: FC<{ reason?: string }> = (props) => {
  const { reason = 'No community selected.' } = props
  const classes = useStyles()

  return (
    <div style={{ textAlign: 'center', maxWidth: '85%', margin: '16px auto' }}>
      <Typography className={classes.noFeatSel}>
        {reason} Click a community in the map or in the data table.
      </Typography>
      <RandomLinkBtn />
    </div>
  )
}
