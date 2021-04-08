import { useRef, useState } from 'react'
import { Ref, Segment } from 'semantic-ui-react'

import { AppHome, AppMenu, AppSettings } from './components'

function App () {
  const appRefArea = useRef()

  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      <AppMenu setSettingsOpen={setSettingsOpen} context={appRefArea} />
      <Ref innerRef={appRefArea}>
        <Segment basic>
          <AppHome />
        </Segment>
      </Ref>
      <AppSettings open={settingsOpen} setOpen={setSettingsOpen} />
    </>
  )
}

export default App
