import React, { FC, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { FaRandom } from 'react-icons/fa'

import { routes } from 'components/config/api'
import { GlobalContext } from 'components/context'

export const RandomLinkBtn: FC = () => {
  const { state } = useContext(GlobalContext)
  const { langFeatures } = state

  let randoIndex

  if (langFeatures.length) {
    const randoFeatIndex = Math.floor(Math.random() * (langFeatures.length - 1))
    randoIndex = langFeatures[randoFeatIndex].id
  } else {
    randoIndex = Math.floor(Math.random() * 1000) // shaky, no guarantee 😱
  }

  return (
    <Button
      variant="contained"
      color="primary"
      component={RouterLink}
      size="small"
      startIcon={<FaRandom />}
      to={`${routes.details}/${randoIndex}`}
    >
      Try one at random
    </Button>
  )
}
