import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import AppStatus from '../../components/steps/AppStatus'
import { AppContextProvider } from '../../context/AppContext'
import { TEST_CONFIGURATIONS } from '../../configurations'
import { APP_STEPS } from '../../enums'

jest.mock('../../components/status/CheckStatus', () => () => null)
jest.mock('../../components/status/MyStatuses', () => () => null)

const { language } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <AppStatus />
    </AppContextProvider>
  )

  return { getByText }
}

test('Renders correctly', () => {
  const { getByText } = setup()

  userEvent.click(getByText(APP_STEPS.STATUS.CHECK_STATUS[language]))
  userEvent.click(getByText(APP_STEPS.STATUS.MY_STATUSES[language]))

  expect(getByText(APP_STEPS.STATUS.CHECK_STATUS[language])).toBeInTheDocument()
  expect(getByText(APP_STEPS.STATUS.MY_STATUSES[language])).toBeInTheDocument()

  userEvent.click(getByText(APP_STEPS.STATUS.MY_STATUSES[language]))
  userEvent.click(getByText(APP_STEPS.STATUS.CHECK_STATUS[language]))
})
