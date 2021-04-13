import { useRef, useState } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import { Icon, Ref, Segment, Step } from 'semantic-ui-react'

import ViewFiles from './components/file/ViewFiles'
import ImportFile from './components/file/ImportFile'
import { AppHome, AppMenu, AppSettings } from './components'
import { APP_STEPS } from './configurations'

function App () {
  const appRefArea = useRef()

  let location = useLocation()

  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      <AppMenu setSettingsOpen={setSettingsOpen} context={appRefArea} />
      <Ref innerRef={appRefArea}>
        <Segment basic style={{ paddingBottom: '5rem' }}>
          <Step.Group attached="top">
            {APP_STEPS.map(step =>
              <Step key={step.id} active={location.pathname === step.route}>
                <Icon name={step.icon} />
                <Step.Content>
                  <Step.Title>{step.title}</Step.Title>
                  <Step.Description>{step.description}</Step.Description>
                </Step.Content>
              </Step>
            )}
          </Step.Group>
          <Segment basic attached style={{ paddingTop: '2rem' }}>
            <Switch>
              <Route path={APP_STEPS[2].route}>
                <ImportFile />
              </Route>
              <Route path={APP_STEPS[1].route}>
                <ViewFiles />
              </Route>
              <Route path={APP_STEPS[0].route}>
                <AppHome />
              </Route>
            </Switch>
          </Segment>
        </Segment>
      </Ref>
      <AppSettings open={settingsOpen} setOpen={setSettingsOpen} />
    </>
  )
}

export default App
