import React, { FC, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { FaRandom } from 'react-icons/fa'

import { GlobalContext } from 'components/context'

export const RandomLinkBtn: FC = () => {
  const { state } = useContext(GlobalContext)
  const { langFeatures, langFeatsLenCache } = state

  let randoFeatID
  let btnText
  let randoLang

  if (langFeatures.length) {
    const randoFeatIndex = Math.floor(Math.random() * (langFeatures.length - 1))

    randoFeatID = langFeatures[randoFeatIndex].id
    randoLang = langFeatures[randoFeatIndex].Language
  }

  if (!langFeatsLenCache) btnText = 'Loading languages...'
  else if (!langFeatures.length) btnText = 'No communities available'
  else btnText = 'Show me a community'

  return (
    <Button
      variant="contained"
      color="secondary"
      component={RouterLink}
      size="small"
      disabled={!langFeatsLenCache || !langFeatures.length}
      startIcon={<FaRandom />}
      to={randoLang ? `/Explore/Language/${randoLang}/${randoFeatID}` : '/'}
    >
      {btnText}
    </Button>
  )
}
