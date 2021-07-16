import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import SelectFile from '../components/files/list/SelectFile'
import { AppContextProvider } from '../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../configurations'
import { APP_STEPS } from '../enums'

jest.mock('../components/files/list/FilesList', () => () => null)
jest.mock('../components/files/list/FileDetailed', () => () => null)
jest.mock('../components/files/list/FilesListSimple', () => () => null)
jest.mock('../components/files/list/SelectFileOperation', () => () => null)

const { testFile, testFileObjects, language } = TEST_CONFIGURATIONS

const setup = (agent = API.AGENTS.SAS_AGENT, initWithFile = false) => {
  const { getByText, getByPlaceholderText } = render(
    <AppContextProvider>
      <SelectFile agent={agent} files={testFileObjects} initWithFile={initWithFile} />
    </AppContextProvider>
  )

  return { getByText, getByPlaceholderText }
}

test('Renders correctly when filtering by path and file', () => {
  const { getByText, getByPlaceholderText } = setup()

  userEvent.click(getByText(APP_STEPS.LIST.SIMPLE_LIST[language]))
  userEvent.type(getByPlaceholderText(APP_STEPS.LIST.FILTER_LIST[language]), testFileObjects[0].folder)
  userEvent.type(getByPlaceholderText(APP_STEPS.LIST.FILTER_LIST[language]), '{selectall}{backspace}')
  userEvent.type(getByPlaceholderText(APP_STEPS.LIST.FILTER_LIST[language]), testFileObjects[0].filename)

  expect(getByText(APP_STEPS.LIST.HEADER[language])).toBeInTheDocument()
  expect(getByText(APP_STEPS.LIST.SIMPLE_LIST[language])).toBeInTheDocument()
})

test('Renders correctly when initWithFile is provided on agent', () => {
  const { getByText } = setup(API.AGENTS.AGENT, testFile.file)

  expect(getByText(APP_STEPS.LIST.SELECTED_FILE[language])).toBeInTheDocument()
})

test('Renders correctly when initWithFile is provided on sas-agent', () => {
  const { getByText } = setup(API.AGENTS.SAS_AGENT, testFile.file)

  expect(getByText(APP_STEPS.LIST.SELECTED_FILE[language])).toBeInTheDocument()
})
