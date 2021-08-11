import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'

import CheckStatus from '../../components/status/CheckStatus'
import { AppContextProvider } from '../../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../../configurations'
import { APP_STEPS, TEST_IDS } from '../../enums'
import userEvent from '@testing-library/user-event'

const {
  language,
  errorString,
  uuidTest,
  testFileStatusCopy,
  testFileObjects,
  testFileStatusAnyImport,
  testFileStatusCsvImport,
  flushPromises
} = TEST_CONFIGURATIONS
const executeGet = jest.fn()

const setup = () => {
  const { getByText, getByPlaceholderText, getByTestId } = render(
    <AppContextProvider>
      <CheckStatus />
    </AppContextProvider>
  )

  return { getByText, getByPlaceholderText, getByTestId }
}

describe('Setup mock localStorage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null)
      },
      writable: true
    })
  })

  test('Handles check status copy correctly', async () => {
    useAxios.mockReturnValue([{ data: testFileStatusCopy, error: undefined, loading: false }, executeGet])
    executeGet.mockResolvedValue({ data: { files: testFileObjects } })

    const { getByPlaceholderText, getByTestId } = setup()

    userEvent.type(getByPlaceholderText(APP_STEPS.STATUS.PLACEHOLDER[language]), `${uuidTest}{enter}`)

    expect(executeGet).toHaveBeenCalledWith({
      url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${uuidTest}`
    })

    await flushPromises()

    userEvent.click(getByTestId(TEST_IDS.ADD_TO_MY_STATUSES))
  })

  test('Handles check status any-import correctly', async () => {
    useAxios.mockReturnValue([{ data: testFileStatusAnyImport, error: undefined, loading: false }, executeGet])
    executeGet.mockResolvedValue({ data: { files: testFileObjects } })

    const { getByPlaceholderText, getByTestId } = setup()

    userEvent.type(getByPlaceholderText(APP_STEPS.STATUS.PLACEHOLDER[language]), `${uuidTest}{enter}`)

    expect(executeGet).toHaveBeenCalledWith({
      url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${uuidTest}`
    })

    await flushPromises()

    userEvent.click(getByTestId(TEST_IDS.ADD_TO_MY_STATUSES))
  })

  test('Handles check status csv-import correctly', async () => {
    useAxios.mockReturnValue([{ data: testFileStatusCsvImport, error: undefined, loading: false }, executeGet])
    executeGet.mockResolvedValue({ data: { files: testFileObjects } })

    const { getByPlaceholderText, getByTestId } = setup()

    userEvent.type(getByPlaceholderText(APP_STEPS.STATUS.PLACEHOLDER[language]), `${uuidTest}{enter}`)

    expect(executeGet).toHaveBeenCalledWith({
      url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${uuidTest}`
    })

    await flushPromises()

    userEvent.click(getByTestId(TEST_IDS.ADD_TO_MY_STATUSES))
  })
})

test('Renders correctly', () => {
  useAxios.mockReturnValue([{ data: undefined, error: undefined, loading: false }, executeGet])

  const { getByPlaceholderText } = setup()

  expect(getByPlaceholderText(APP_STEPS.STATUS.PLACEHOLDER[language])).toBeInTheDocument()
})

test('Renders error correctly', () => {
  useAxios.mockReturnValue([{ data: undefined, error: errorString, loading: false }, executeGet])

  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})
