import { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Accordion, Header, Icon } from 'semantic-ui-react'

import ListFiles from '../files/list/ListFiles'
import { LanguageContext } from '../../context/AppContext'
import { API } from '../../configurations'
import { APP_STEPS } from '../../enums'

function AppSelectOperation () {
  const { language } = useContext(LanguageContext)

  let location = useLocation()

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
          {APP_STEPS.OPERATION.HEADER[language]}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <ListFiles
            agent={API.AGENTS.AGENT}
            initWithFile={location.state !== undefined ? location.state.file : false}
          />
        </Accordion.Content>
      </Accordion>
    </>
  )
}

export default AppSelectOperation
