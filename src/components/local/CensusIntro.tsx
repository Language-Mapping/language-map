import React, { FC } from 'react'
import { Route, Switch } from 'react-router-dom'

import { routes } from 'components/config/api'
import { UItextFromAirtable } from 'components/generic'

export const CensusIntro: FC = () => {
  return (
    <Switch>
      <Route path={routes.local}>
        {/* Below text may not be applicable to census popover... */}
        <UItextFromAirtable id="census-panel-intro-top" rootElemType="p" />
      </Route>
      <Route>
        <UItextFromAirtable id="census-panel-intro-bottom" rootElemType="p" />
      </Route>
    </Switch>
  )
}
