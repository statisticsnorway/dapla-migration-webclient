import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import MyStatuses from '../../components/status/MyStatuses'
import { AppContextProvider } from '../../context/AppContext'
import { TEST_CONFIGURATIONS } from '../../configurations'
import { APP_STEPS, TEST_IDS } from '../../enums'

jest.mock('../../components/status/MigrationStatus', () => () => null)

const { language, uuidTest } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByText, getByTestId } = render(
    <AppContextProvider>
      <MyStatuses open={true} />
    </AppContextProvider>
  )

  return { getByText, getByTestId }
}

describe('Setup mock localStorage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => `${uuidTest}`),
        setItem: jest.fn(() => null),
        removeItem: jest.fn(() => null)
      },
      writable: true
    })
  })

  test('Renders correctly', () => {
    const { getByText, getByTestId } = setup()

    userEvent.click(getByTestId(TEST_IDS.REMOVE_MY_STATUSES))
    userEvent.click(getByText(APP_STEPS.STATUS.CLEAR_STORAGE.CANCEL[language]))
    userEvent.click(getByTestId(TEST_IDS.REMOVE_MY_STATUSES))
    userEvent.click(getByText(APP_STEPS.STATUS.CLEAR_STORAGE.CONFIRM[language]))
  })
})
