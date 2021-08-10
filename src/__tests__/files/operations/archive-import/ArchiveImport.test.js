import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import ArchiveImport from '../../../../components/files/operations/archive-import/ArchiveImport'
import { AppContextProvider } from '../../../../context/AppContext'
import { API, API_INSTRUCTIONS, TEST_CONFIGURATIONS } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

jest.mock('../../../../components/files/operations/archive-import/ArchiveImportEdit', () => () => null)
jest.mock('../../../../components/files/operations/archive-import/ArchiveImportStatus', () => () => null)

window.localStorage.__proto__.getItem = jest.fn()
window.localStorage.__proto__.setItem = jest.fn()

const { language, uuidTest, testFileObjects } = TEST_CONFIGURATIONS
const executePut = jest.fn()

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <ArchiveImport file={testFileObjects[0]} />
    </AppContextProvider>
  )

  return { getByText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue([{ loading: false }, executePut])
  })

  test('Renders correctly', () => {
    const { getByText } = setup()

    expect(getByText(APP_STEPS.OPERATION.IMPORT.INITIATE_IMPORT[language])).toBeInTheDocument()
  })

  test('Fires put request correctly', () => {
    const { getByText } = setup()

    userEvent.click(getByText(APP_STEPS.OPERATION.IMPORT.INITIATE_IMPORT[language]))

    expect(executePut).toHaveBeenCalledWith({
      data: API_INSTRUCTIONS.ARCHIVE_IMPORT(
        uuidTest,
        `${testFileObjects[0].folder}/${testFileObjects[0].filename}`,
        API.BOUNDARY_OPTIONS[0].value,
        API.VALUATION_OPTIONS[3].value,
        API.ENCODE_OPTIONS[0].value,
        API.CONTENT_TYPE_OPTIONS[1].value,
        false
      ),
      url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${uuidTest}`
    })
  })

  test('Handles form changes correctly', () => {
    const { getByText } = setup()

    userEvent.click(getByText(API.VALUATION_OPTIONS[1].text))
    userEvent.click(getByText(API.ENCODE_OPTIONS[1].text))
    userEvent.click(getByText(API.CONTENT_TYPE_OPTIONS[0].text))
    userEvent.click(getByText(APP_STEPS.OPERATION.ARCHIVE.ADD_V1_MANIFEST[language]))
    userEvent.click(getByText(APP_STEPS.OPERATION.IMPORT.INITIATE_IMPORT[language]))

    expect(executePut).toHaveBeenCalledWith({
      data: API_INSTRUCTIONS.ARCHIVE_IMPORT(
        uuidTest,
        `${testFileObjects[0].folder}/${testFileObjects[0].filename}`,
        API.BOUNDARY_OPTIONS[0].value,
        API.VALUATION_OPTIONS[1].value,
        API.ENCODE_OPTIONS[1].value,
        API.CONTENT_TYPE_OPTIONS[0].value,
        true
      ),
      url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${uuidTest}`
    })
  })

  test('Handle check JSON before import correctly', () => {
    const { getByText } = setup()

    userEvent.click(getByText(APP_STEPS.OPERATION.CSV.EDIT_JSON[language]))
    userEvent.click(getByText(APP_STEPS.OPERATION.IMPORT.EDIT_JSON[language]))

    expect(executePut).toHaveBeenCalledTimes(0)
  })
})
