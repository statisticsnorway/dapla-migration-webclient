import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import ListFiles from '../../../components/files/list/ListFiles'
import { AppContextProvider } from '../../../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../../../configurations'
import { APP_STEPS, TEST_IDS } from '../../../enums'

jest.mock('../../../components/files/list/SelectFile', () => () => null)

const { errorString, language, testFile, responseObject } = TEST_CONFIGURATIONS
const testScanPath = '/test/a/path'
const executeGet = jest.fn()

const setup = (agent = API.AGENTS.SAS_AGENT, scanPath = '', initWithFile = false) => {
  const { getByText, getByPlaceholderText, getByTestId } = render(
    <AppContextProvider>
      <ListFiles agent={agent} scanPath={scanPath} initWithFile={initWithFile} />
    </AppContextProvider>
  )

  return { getByText, getByPlaceholderText, getByTestId }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue([{ data: responseObject, error: undefined, loading: false }, executeGet])
  })

  test('Renders and triggers scan correctly', () => {
    const { getByPlaceholderText } = setup()

    userEvent.type(getByPlaceholderText(APP_STEPS.SCAN.PLACEHOLDER[language]), '/test/a/path{enter}')

    expect(executeGet).toHaveBeenCalledWith(
      { url: `${window.__ENV.REACT_APP_API}/${API.AGENTS.SAS_AGENT}${API.FOLDER}${testScanPath}` }
    )
  })

  test('Renders and triggers scan correctly when scan path is provided', () => {
    const { getByPlaceholderText, getByTestId } = setup(API.AGENTS.SAS_AGENT, testScanPath)

    userEvent.click(getByTestId(TEST_IDS.PASTE_PATH_TRIGGER))

    expect(getByPlaceholderText(APP_STEPS.SCAN.PLACEHOLDER[language])).toHaveValue(testScanPath)
    expect(executeGet).toHaveBeenCalledWith(
      { url: `${window.__ENV.REACT_APP_API}/${API.AGENTS.SAS_AGENT}${API.FOLDER}${testScanPath}` }
    )
  })

  test('Renders and triggers scan correctly when initWithFile is provided', () => {
    const { getByPlaceholderText } = setup(API.AGENTS.SAS_AGENT, '', testFile.file)

    expect(getByPlaceholderText(APP_STEPS.SCAN.PLACEHOLDER[language])).toHaveValue(testScanPath)
    expect(executeGet).toHaveBeenCalledWith(
      { url: `${window.__ENV.REACT_APP_API}/${API.AGENTS.SAS_AGENT}${API.FOLDER}${testScanPath}` }
    )
  })
})

test('Loads', () => {
  useAxios.mockReturnValue([{ data: undefined, error: undefined, loading: true }, executeGet])

  const { getByPlaceholderText } = setup()

  expect(getByPlaceholderText(APP_STEPS.SCAN.PLACEHOLDER[language])).toBeDisabled()
})

test('Shows error', () => {
  useAxios.mockReturnValue([{ data: undefined, error: errorString, loading: false }, executeGet])

  const { getByText, getByPlaceholderText } = setup()

  userEvent.type(getByPlaceholderText(APP_STEPS.SCAN.PLACEHOLDER[language]), '/test/a/path{enter}')

  expect(getByText(errorString)).toBeInTheDocument()
})
