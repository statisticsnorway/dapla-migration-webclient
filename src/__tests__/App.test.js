import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import App from '../App'
import { ApiContext, LanguageContext } from '../context/AppContext'
import { APP, TEST_CONFIGURATIONS } from '../configurations'

jest.mock('../components/AppMenu', () => () => null)
jest.mock('../components/AppSettings', () => () => null)
jest.mock('../components/steps/AppCopy', () => () => null)
jest.mock('../components/steps/AppStatus', () => () => null)
jest.mock('../components/steps/AppMagicMode', () => () => null)
jest.mock('../components/steps/AppDoOperation', () => () => null)
jest.mock('../components/steps/AppSelectOperation', () => () => null)

window.localStorage.__proto__.getItem = jest.fn()
window.localStorage.__proto__.setItem = jest.fn()

const { language } = TEST_CONFIGURATIONS
const apiContext = advancedUser => TEST_CONFIGURATIONS.apiContext(jest.fn(), jest.fn(), jest.fn(), advancedUser)

const setup = (advancedUser = false) => {
  const { getByText } = render(
    <ApiContext.Provider value={apiContext(advancedUser)}>
      <LanguageContext.Provider value={{ language: language }}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByText }
}

test('Does not crash', () => {
  const { getByText } = setup()

  expect(getByText(APP[3].title[language])).toBeInTheDocument()
})

test('Shows all steps when advanced user', () => {
  const { getByText } = setup(true)

  APP.forEach(step => expect(getByText(step.title[language])).toBeInTheDocument())
})
