import { useContext, useState } from 'react'
import { Accordion, Header, Icon } from 'semantic-ui-react'

import CheckStatus from '../status/CheckStatus'
import MyStatuses from '../status/MyStatuses'
import { LanguageContext } from '../../context/AppContext'
import { APP_STEPS } from '../../enums'

function AppStatus () {
  const { language } = useContext(LanguageContext)

  const [activeIndex, setActiveIndex] = useState(1)

  return (
    <Accordion fluid styled>
      <Accordion.Title
        index={0}
        as={Header}
        size="medium"
        active={activeIndex === 0}
        onClick={() => setActiveIndex(activeIndex === 0 ? -1 : 0)}
      >
        <Icon name="dropdown" />
        {APP_STEPS.STATUS.CHECK_STATUS[language]}
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 0}>
        <CheckStatus />
      </Accordion.Content>
      <Accordion.Title
        index={1}
        as={Header}
        size="medium"
        active={activeIndex === 1}
        onClick={() => setActiveIndex(activeIndex === 1 ? -1 : 1)}
      >
        <Icon name="dropdown" />
        {APP_STEPS.STATUS.MY_STATUSES[language]}
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 1}>
        <MyStatuses />
      </Accordion.Content>
    </Accordion>
  )
}

export default AppStatus
