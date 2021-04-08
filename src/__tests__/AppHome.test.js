import { render } from '@testing-library/react'

import { AppHome } from '../components'
import { ApiContext, LanguageContext } from '../context/AppContext'
import { TEST_CONFIGURATIONS } from '../configurations'

jest.mock('../components/file/ListFiles', () => () => null)

const { language } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())

const setup = () => {
  const { getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <AppHome />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByText }
}

test('Renders correctly', () => {
  setup()
})
