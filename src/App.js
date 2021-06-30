import { useContext, useRef, useState } from 'react'
import { Link, Route, Switch, useLocation } from 'react-router-dom'
import { Divider, Icon, Ref, Segment, Step } from 'semantic-ui-react'

import {
  AppCopy,
  AppDoOperation,
  AppMagicMode,
  AppMenu,
  AppSelectOperation,
  AppSettings,
  AppStatus
} from './components'
import { ApiContext, LanguageContext } from './context/AppContext'
import { APP } from './configurations'

function App () {
  const appRefArea = useRef()

  const { advancedUser } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  let location = useLocation()

  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      <AppMenu setSettingsOpen={setSettingsOpen} context={appRefArea} />
      <Ref innerRef={appRefArea}>
        <Segment basic style={{ paddingBottom: '5rem', marginTop: 0 }}>
          <Step.Group size="large" widths={APP.length}>
            {APP.filter(step => {
              if (advancedUser) {
                return true
              } else {
                return step.id === APP[3].id
              }
            }).map(step =>
              <Step key={step.id} active={location.pathname.startsWith(step.route)} as={Link} to={step.route}>
                <Icon name={step.icon} />
                <Step.Content>
                  <Step.Title>{step.title[language]}</Step.Title>
                  <Step.Description>{step.description[language]}</Step.Description>
                </Step.Content>
              </Step>
            )}
          </Step.Group>
          <Divider hidden />
          <Switch>
            <Route path={APP[3].route}>
              <AppStatus />
            </Route>
            <Route path={`${APP[2].route}/:operation`}>
              <AppDoOperation />
            </Route>
            <Route path={APP[1].route}>
              <AppSelectOperation />
            </Route>
            <Route path={APP[0].route}>
              <AppCopy />
            </Route>
            <Route path="/">
              {!advancedUser &&
              <>
                <Divider hidden />
                <AppMagicMode />
              </>
              }
            </Route>
          </Switch>
        </Segment>
      </Ref>
      <AppSettings open={settingsOpen} setOpen={setSettingsOpen} />
    </>
  )
}

export default App
