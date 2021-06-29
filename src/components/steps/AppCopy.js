import { useContext, useState } from 'react'
import { Accordion, Header, Icon } from 'semantic-ui-react'

import ScanFiles from '../files/scan/ScanFiles'
import ListFiles from '../files/list/ListFiles'
import { LanguageContext } from '../../context/AppContext'
import { API } from '../../configurations'
import { APP_STEPS } from '../../enums'

function AppCopy () {
  const { language } = useContext(LanguageContext)

  const [path, setPath] = useState('')
  const [activeIndex, setActiveIndex] = useState([0])

  const handleActiveIndex = index => {
    if (activeIndex.includes(index)) {
      setActiveIndex(activeIndex.filter(element => element !== index))
    } else {
      setActiveIndex(activeIndex.concat([index]))
    }
  }

  return (
    <Accordion fluid styled>
      <Accordion.Title
        index={0}
        as={Header}
        size="medium"
        active={activeIndex.includes(0)}
        onClick={() => handleActiveIndex(0)}
      >
        <Icon name="dropdown" />
        {APP_STEPS.SCAN.HEADER[language]}
      </Accordion.Title>
      <Accordion.Content active={activeIndex.includes(0)}>
        <ScanFiles path={path} setPath={setPath} />
      </Accordion.Content>
      <Accordion.Title
        index={1}
        as={Header}
        size="medium"
        active={activeIndex.includes(1)}
        onClick={() => handleActiveIndex(1)}
      >
        <Icon name="dropdown" />
        {APP_STEPS.COPY.HEADER[language]}
      </Accordion.Title>
      <Accordion.Content active={activeIndex.includes(1)}>
        <ListFiles agent={API.AGENTS.SAS_AGENT} scanPath={path} />
      </Accordion.Content>
    </Accordion>
  )
}

export default AppCopy
