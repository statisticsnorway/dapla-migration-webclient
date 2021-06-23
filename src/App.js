import { useRef, useState } from 'react'
import { Link, Route, Switch, useLocation } from 'react-router-dom'
import { Divider, Icon, Ref, Segment, Step } from 'semantic-ui-react'

import { AppCopy, AppSelectOperation, AppMenu, AppSettings, AppDoOperation } from './components'
import { APP } from './configurations'

function App () {
  const appRefArea = useRef()

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
                  <Step.Title>{step.title}</Step.Title>
                  <Step.Description>{step.description}</Step.Description>
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
