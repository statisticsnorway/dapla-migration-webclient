import { useContext, useRef, useState } from 'react'
import { Link, Route, Switch, useLocation } from 'react-router-dom'
import { Divider, Icon, Ref, Segment, Step } from 'semantic-ui-react'

import { AppCopy, AppDoOperation, AppMenu, AppSelectOperation, AppSettings } from './components'
import { LanguageContext } from './context/AppContext'
import { APP } from './configurations'

function App () {
  const appRefArea = useRef()

  const { language } = useContext(LanguageContext)

  let location = useLocation()

  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      <AppMenu setSettingsOpen={setSettingsOpen} context={appRefArea} />
      <Ref innerRef={appRefArea}>
        <Segment basic style={{ paddingBottom: '5rem', marginTop: 0 }}>
          <Step.Group size="large" widths={APP.length}>
            {APP.map(step =>
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
            <Route path={`${APP[2].route}/:operation`}>
              <AppDoOperation />
            </Route>
            <Route path={APP[1].route}>
              <AppSelectOperation />
            </Route>
            <Route path={APP[0].route}>
              <AppCopy />
            </Route>
          </Switch>
        </Segment>
      </Ref>
      <AppSettings open={settingsOpen} setOpen={setSettingsOpen} />
    </>
  )
}

export default App
