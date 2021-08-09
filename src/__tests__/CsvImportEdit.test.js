import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import CsvImportEdit from '../components/files/operations/csv-import/CsvImportEdit'
import { AppContextProvider } from '../context/AppContext'
import { API, API_INSTRUCTIONS, TEST_CONFIGURATIONS } from '../configurations'
import { APP_STEPS } from '../enums'

jest.mock('../components/files/operations/csv-import/CsvImportStatus', () => () => null)

window.localStorage.__proto__.getItem = jest.fn()
window.localStorage.__proto__.setItem = jest.fn()

const { language, uuidTest, csvTestFileCompletedData } = TEST_CONFIGURATIONS
const executePut = jest.fn()
const importInstructions = API_INSTRUCTIONS.CSV_IMPORT(
  uuidTest,
  csvTestFileCompletedData.result.template.files,
  API.DELIMITER_OPTIONS[0].value,
  API.ENCODE_OPTIONS[0].value,
  csvTestFileCompletedData.result.template.structure.schema.columns,
  API.BOUNDARY_OPTIONS[0].value,
  API.VALUATION_OPTIONS[1].value,
  false,
  false,
  [],
  ''
)

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <CsvImportEdit
        file={csvTestFileCompletedData.result.template.files}
        instructions={JSON.stringify(importInstructions)}
      />
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
      data: importInstructions,
      url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${uuidTest}`
    })
  })
})
