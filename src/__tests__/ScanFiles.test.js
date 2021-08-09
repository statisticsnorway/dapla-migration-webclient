import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import ScanFiles from '../components/files/scan/ScanFiles'
import { AppContextProvider } from '../context/AppContext'
import { API, API_INSTRUCTIONS, TEST_CONFIGURATIONS } from '../configurations'
import { APP_STEPS } from '../enums'

jest.mock('../components/files/scan/ScanFilesStatus', () => () => null)

const { errorString, language, uuidTest, testFileObjects } = TEST_CONFIGURATIONS
const executePut = jest.fn()
const setPath = jest.fn()

const setup = (path = '') => {
  const { getByText, getByPlaceholderText } = render(
    <AppContextProvider>
      <ScanFiles path={path} setPath={setPath} />
    </AppContextProvider>
  )

  return { getByText, getByPlaceholderText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue([{ error: undefined, loading: false }, executePut])
  })

  test('Renders correctly', () => {
    const { getByPlaceholderText } = setup()

    expect(getByPlaceholderText(APP_STEPS.SCAN.PLACEHOLDER[language])).toBeInTheDocument()
  })

  test('Fires put request correctly', () => {
    const { getByPlaceholderText } = setup(testFileObjects[0].folder)

    userEvent.type(getByPlaceholderText(APP_STEPS.SCAN.PLACEHOLDER[language]), `${testFileObjects[0].folder}{enter}`)

    expect(executePut).toHaveBeenCalledWith({
      data: API_INSTRUCTIONS.SCAN(uuidTest, testFileObjects[0].folder),
      url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${uuidTest}`
    })
  })
})

test('Renders error correctly', () => {
  useAxios.mockReturnValue([{ error: errorString, loading: false }, executePut])

  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})
