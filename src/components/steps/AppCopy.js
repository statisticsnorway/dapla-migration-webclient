import { useState } from 'react'
import { Accordion, Header, Icon } from 'semantic-ui-react'

import ScanFiles from '../files/scan/ScanFiles'
import ListFiles from '../files/list/ListFiles'

function AppCopy () {
  const [activeIndex, setActiveIndex] = useState(1)

  return (
    <Accordion fluid styled>
      <Accordion.Title
        index={0}
        as={Header}
        size="medium"
        active={activeIndex === 0}
        onClick={() => setActiveIndex(0)}
      >
        <Icon name="dropdown" />
        Scan for files on 'linuxstamme'
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 0}>
        <ScanFiles />
      </Accordion.Content>
      <Accordion.Title
        index={0}
        as={Header}
        size="medium"
        active={activeIndex === 1}
        onClick={() => setActiveIndex(1)}
      >
        <Icon name="dropdown" />
        List scanned files and copy
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 1}>
        <ListFiles agent='sas' />
      </Accordion.Content>
    </Accordion>
  )
}

export default AppCopy
