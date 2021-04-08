import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { LANGUAGE } from '@statisticsnorway/dapla-js-utilities'

import { AppMenu } from '../components'
import { AppContextProvider } from '../context/AppContext'
import { TEST_CONFIGURATIONS } from '../configurations'
import { UI } from '../enums'

const { language, otherLanguage } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <AppMenu setSettingsOpen={jest.fn()} />
    </AppContextProvider>
  )

  return { getByText }
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
