import React, { FC, useEffect, useState } from 'react'
import * as Sentry from '@sentry/react'
import { Route } from 'react-router-dom'
import { queryCache } from 'react-query'
import { GoInfo } from 'react-icons/go'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { TopBar, OffCanvasNav } from 'components/nav'
import { MapWrap, Map } from 'components/map'
import { Panel, PanelIntro } from 'components/panels'
import { AboutPageView, WelcomeDialog } from 'components/about'
import { ResultsModal } from 'components/results'
import { fetchAbout, fetchHelp, fetchWelcome } from 'components/about/utils'
import { paths as routes } from 'components/config/routes'
import { ABOUT_QUERY, HELP_QUERY, WELCOME_QUERY } from 'components/about/config'

export const App: FC = () => {
  const [tableOpen, setTableOpen] = useState<boolean>(false)
  const [offCanvasNavOpen, setOffCanvasNavOpen] = useState<boolean>(false)
  const [mapLoaded, setMapLoaded] = useState<boolean>(false)

  const openTable = (): void => setTableOpen(true)
  const closeTable = (): void => setTableOpen(false)

  useEffect(() => {
    queryCache.prefetchQuery(WELCOME_QUERY, fetchWelcome)
    queryCache.prefetchQuery(ABOUT_QUERY, fetchAbout)
    queryCache.prefetchQuery(HELP_QUERY, fetchHelp)
  }, [])

  return (
    <Sentry.ErrorBoundary
      fallback={({ error, componentStack, resetError }) => (
        <>
          <div>You have encountered an error</div>
          <div>{error.toString()}</div>
          <div>{componentStack}</div>
          <button
            type="button"
            onClick={() => {
              resetError()
            }}
          >
            Click here to reset
          </button>
        </>
      )}
    >
      <OffCanvasNav isOpen={offCanvasNavOpen} setIsOpen={setOffCanvasNavOpen} />
      <TopBar />
      {!window.localStorage.hideWelcome && (
        <WelcomeDialog queryName={WELCOME_QUERY} />
      )}
      <Route path={routes.about}>
        <AboutPageView
          title="About"
          icon={<GoInfo />}
          queryName={ABOUT_QUERY}
        />
      </Route>
      <ResultsModal
        open={tableOpen}
        closeTable={closeTable}
        mapLoaded={mapLoaded}
      />
      <Route path={routes.help}>
        <AboutPageView
          title="Help"
          icon={<AiOutlineQuestionCircle />}
          queryName={HELP_QUERY}
        />
      </Route>
      <MapWrap
        mapLoaded={mapLoaded}
        map={
          <Map
            mapLoaded={mapLoaded}
            setMapLoaded={setMapLoaded}
            openOffCanvasNav={() => setOffCanvasNavOpen(true)}
          />
        }
      >
        <Panel>
          <PanelIntro openTable={openTable} />
        </Panel>
      </MapWrap>
    </Sentry.ErrorBoundary>
  )
}
