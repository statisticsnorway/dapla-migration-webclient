import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LANGUAGE } from '@statisticsnorway/dapla-js-utilities'

import { AppMenu } from '../components'
import { AppContextProvider } from '../context/AppContext'
import { TEST_CONFIGURATIONS } from '../configurations'
import { TEST_IDS, UI } from '../enums'

window.localStorage.__proto__.getItem = jest.fn()
window.localStorage.__proto__.setItem = jest.fn()

const { language, otherLanguage } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByText, getByTestId } = render(
    <AppContextProvider>
      <MemoryRouter initialEntries={['/']}>
        <AppMenu setSettingsOpen={jest.fn()} />
      </MemoryRouter>
    </AppContextProvider>
  )

  return { getByText, getByTestId }
}

test('Renders correctly', () => {
  const { getByText } = setup()

  expect(getByText(UI.HEADER[language])).toBeInTheDocument()
})

test('Change language works correctly', () => {
  const { getByText } = setup()

  userEvent.click(getByText(LANGUAGE.ENGLISH[language]))

  expect(getByText(UI.HEADER[otherLanguage])).toBeInTheDocument()
})

test('Toggle advanced user mode', () => {
  const { getByTestId } = setup()

  userEvent.click(getByTestId(TEST_IDS.ADVANCED_USER_TOGGLE))

  expect(getByTestId(TEST_IDS.SETTINGS_BUTTON)).toBeInTheDocument()

  userEvent.click(getByTestId(TEST_IDS.ADVANCED_USER_TOGGLE))
})
