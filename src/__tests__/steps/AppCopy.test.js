import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import AppCopy from '../../components/steps/AppCopy'
import { AppContextProvider } from '../../context/AppContext'
import { TEST_CONFIGURATIONS } from '../../configurations'
import { APP_STEPS } from '../../enums'

jest.mock('../../components/files/scan/ScanFiles', () => () => null)
jest.mock('../../components/files/list/ListFiles', () => () => null)

const { language } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <AppCopy />
    </AppContextProvider>
  )

  return { getByText }
}

test('Renders correctly', () => {
  const { getByText } = setup()

  expect(getByText(APP_STEPS.SCAN.HEADER[language])).toBeInTheDocument()
  expect(getByText(APP_STEPS.COPY.HEADER[language])).toBeInTheDocument()

  userEvent.click(getByText(APP_STEPS.SCAN.HEADER[language]))
  userEvent.click(getByText(APP_STEPS.COPY.HEADER[language]))
})
