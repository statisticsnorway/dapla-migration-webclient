import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import CsvImport from '../../../../components/files/operations/csv-import/CsvImport'
import { AppContextProvider } from '../../../../context/AppContext'
import { API, API_INSTRUCTIONS, TEST_CONFIGURATIONS } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

jest.mock('../../../../components/files/operations/csv-import/CsvImportEdit', () => () => null)
jest.mock('../../../../components/files/operations/csv-import/CsvImportStatus', () => () => null)

window.localStorage.__proto__.getItem = jest.fn()
window.localStorage.__proto__.setItem = jest.fn()

const { language, uuidTest, csvTestFileCompletedData, testFileDataDecoded } = TEST_CONFIGURATIONS
const executePut = jest.fn()

const setup = () => {
  const { getAllByText, getByDisplayValue, getByText, getByPlaceholderText } = render(
    <AppContextProvider>
      <CsvImport
        file={csvTestFileCompletedData.result.template.files[0]}
        data={csvTestFileCompletedData.result.template}
        fileData={testFileDataDecoded}
      />
    </AppContextProvider>
  )

  return { getAllByText, getByDisplayValue, getByText, getByPlaceholderText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue([{ loading: false }, executePut])
  })

  test('Renders correctly', () => {
    const { getByText } = setup()

    expect(getByText(APP_STEPS.OPERATION.CSV.EDIT_JSON[language])).toBeInTheDocument()
  })

  test('Fires put request correctly', () => {
    const { getByText } = setup()

    userEvent.click(getByText(APP_STEPS.OPERATION.IMPORT.INITIATE_IMPORT[language]))

    expect(executePut).toHaveBeenCalledWith({
      data: API_INSTRUCTIONS.CSV_IMPORT(
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
      ),
      url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${uuidTest}`
    })
  })

  test('Handles form changes correctly', () => {
    const { getAllByText, getByDisplayValue, getByText, getByPlaceholderText } = setup()

    userEvent.click(getByText(API.VALUATION_OPTIONS[3].text))
    userEvent.type(getByPlaceholderText(APP_STEPS.OPERATION.CSV.QUOTE[language]), '\\u0000')
    userEvent.click(getByText(APP_STEPS.OPERATION.CSV.CONVERT_AFTER_IMPORT[language]))
    userEvent.click(getByText(APP_STEPS.OPERATION.CSV.CONVERTER_SKIP_ON_FAILURE[language]))
    userEvent.click(getAllByText(APP_STEPS.OPERATION.CSV.PSEDUO[language])[0])
    userEvent.click(getAllByText(APP_STEPS.OPERATION.CSV.PSEDUO[language])[1])
    userEvent.click(getAllByText(APP_STEPS.OPERATION.CSV.PSEDUO[language])[1])
    userEvent.type(getByDisplayValue('Thing'), 'DifferentThing')
    userEvent.click(getAllByText(API.AVRO_TYPE_OPTIONS[1].text)[2])
    userEvent.click(getByText(APP_STEPS.OPERATION.IMPORT.INITIATE_IMPORT[language]))

    expect(executePut).toHaveBeenCalledWith({
      data: API_INSTRUCTIONS.CSV_IMPORT(
        uuidTest,
        csvTestFileCompletedData.result.template.files,
        API.DELIMITER_OPTIONS[0].value,
        API.ENCODE_OPTIONS[0].value,
        csvTestFileCompletedData.result.template.structure.schema.columns.map(column => {
          if (column.name === 'Thing') {
            column.name = 'ThingDifferentThing'
            column.type = 'Integer'
          }

          return column
        }),
        API.BOUNDARY_OPTIONS[0].value,
        API.VALUATION_OPTIONS[3].value,
        true,
        true,
        [{ name: 'Some-rule', pattern: '**/Some', func: 'fpe-digits(migrationsecret1)' }],
        '\\u0000'
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
