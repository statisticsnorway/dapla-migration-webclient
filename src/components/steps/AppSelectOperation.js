import { useState } from 'react'
import { Accordion, Header, Icon } from 'semantic-ui-react'

import ListFiles from '../files/list/ListFiles'

function AppSelectOperation () {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <>
      <Accordion fluid styled>
        <Accordion.Title
          index={0}
          as={Header}
          size="medium"
          active={activeIndex === 0}
          onClick={() => setActiveIndex(activeIndex === 0 ? -1 : 0)}
        >
          <Icon name="dropdown" />
          List copied files
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <ListFiles agent='agent' />
        </Accordion.Content>
      </Accordion>
    </>
  )
}

export default AppSelectOperation
