import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import CsvDetermineImportStructure from '../../../../components/files/operations/csv-import/CsvDetermineImportStructure'
import { AppContextProvider } from '../../../../context/AppContext'
import { API, API_INSTRUCTIONS, TEST_CONFIGURATIONS } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

jest.mock('../../../../components/files/operations/csv-import/CsvDetermineImportStructureStatus', () => () => null)

const { errorString, language, uuidTest, testFileObjects, testFileDataDecoded } = TEST_CONFIGURATIONS
const executePut = jest.fn()
const setInitiated = jest.fn()
const charset = 'UTF-8'
const delimiter = ';'

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <CsvDetermineImportStructure
        charset={charset}
        delimiter={delimiter}
        fileData={testFileDataDecoded}
        setInitiated={setInitiated}
        file={testFileObjects[0]}
      />
    </AppContextProvider>
  )

  return { getByText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue([{ error: undefined, loading: false }, executePut])
  })

  test('Renders correctly', () => {
    const { getByText } = setup()

    expect(getByText(APP_STEPS.OPERATION.CSV.DETERMINE_STRUCTURE[language])).toBeInTheDocument()
  })

  test('Fires put request correctly', () => {
    const { getByText } = setup()

    userEvent.click(getByText(APP_STEPS.OPERATION.CSV.DETERMINE_STRUCTURE[language]))

    expect(executePut).toHaveBeenCalledWith({
      data: API_INSTRUCTIONS.CSV_INSPECT(uuidTest, [`${testFileObjects[0].folder}/${testFileObjects[0].filename}`], delimiter, charset),
      url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${uuidTest}`
    })
  })
})

test('Renders error correctly', () => {
  useAxios.mockReturnValue([{ error: errorString, loading: false }, executePut])

  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})
