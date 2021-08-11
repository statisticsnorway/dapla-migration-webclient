import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import MigrationStatus from '../../components/status/MigrationStatus'
import { AppContextProvider } from '../../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../../configurations'
import { APP_STEPS, TEST_IDS } from '../../enums'

jest.mock('../../components/status/MigrationStatusForward', () => () => null)

const { language, errorString, uuidTest, testFileStatus, testFile, testMockResolve } = TEST_CONFIGURATIONS
const setCheck = jest.fn()

const setup = () => {
  const { getByText, getByTestId } = render(
    <AppContextProvider>
      <MigrationStatus statusId={uuidTest} check={false} setCheck={setCheck} />
    </AppContextProvider>
  )

  return { getByText, getByTestId }
}

describe('Setup mock localStorage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => JSON.stringify(testFileStatus(testFile.file, API.OPERATIONS[0]))),
        setItem: jest.fn(() => null),
        removeItem: jest.fn(() => null)
      },
      writable: true
    })
  })

  test('Renders correctly on status completed', () => {
    useAxios.mockReturnValue([
      { data: testMockResolve(API.STATUS.COMPLETED, API.STATUS.COMPLETED).data, error: undefined, loading: false }
    ])

    const { getByText } = setup()

    expect(getByText(`${testFile.file} - ${API.OPERATIONS[0]}`)).toBeInTheDocument()

    userEvent.click(getByText(`${testFile.file} - ${API.OPERATIONS[0]}`))
  })

  test('Renders correctly on status error', () => {
    useAxios.mockReturnValue([
      { data: testMockResolve(API.STATUS.ERROR, API.STATUS.ERROR, true).data, error: undefined, loading: false }
    ])

    const { getByText } = setup()

    expect(getByText(`${testFile.file} - ${API.OPERATIONS[0]}`)).toBeInTheDocument()
  })

  test('Renders correctly on status in progress', () => {
    useAxios.mockReturnValue([
      { data: testMockResolve(API.STATUS.IN_PROGRESS, API.STATUS.IN_PROGRESS).data, error: undefined, loading: false }
    ])

    const { getByText } = setup()

    expect(getByText(`${testFile.file} - ${API.OPERATIONS[0]}`)).toBeInTheDocument()
  })

  test('Renders correctly on remove from statuses', () => {
    useAxios.mockReturnValue([
      { data: testMockResolve(API.STATUS.COMPLETED, API.STATUS.COMPLETED).data, error: undefined, loading: false }
    ])

    const { getByText, getByTestId } = setup()

    userEvent.click(getByTestId(TEST_IDS.REMOVE_FROM_MY_STATUSES))
    userEvent.click(getByText(APP_STEPS.STATUS.CLEAR_STORAGE.CANCEL[language]))
    userEvent.click(getByTestId(TEST_IDS.REMOVE_FROM_MY_STATUSES))
    userEvent.click(getByText(APP_STEPS.STATUS.CLEAR_STORAGE.CONFIRM[language]))
  })

  test('Renders correctly on error', () => {
    useAxios.mockReturnValue([{ data: undefined, error: errorString, loading: false }])

    const { getByText } = setup()

    expect(getByText(errorString)).toBeInTheDocument()
  })
})
