import React, { FC } from 'react'

import { EndoImageWrap } from 'components/details'
import { PanelIntroTitle, PanelIntroSubtitle } from 'components/explore'
import { LangOrEndoIntroProps } from './types'

// Mongolian, ASL, etc. have URLs to images
export const LangOrEndoIntro: FC<LangOrEndoIntroProps> = (props) => {
  const { data } = props
  const { Endonym, Language, 'Font Image Alt': altImage, name } = data
  const language = name || Language // TODO: deal with this somehow
  // const CHAR_CUTOFF = 17 // TODO: ellipsis for the monsters...
  // const tooLong = !Endonym.trim().includes(' ')
  // && Endonym.length >= CHAR_CUTOFF

  return (
    <>
      {(altImage && <EndoImageWrap url={altImage[0].url} alt={language} />) || (
        <PanelIntroTitle>{Endonym}</PanelIntroTitle>
      )}
      {(altImage || language !== Endonym) && (
        <PanelIntroSubtitle>{language}</PanelIntroSubtitle>
      )}
    </>
  )
}
