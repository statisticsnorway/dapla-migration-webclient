import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import CsvHeadOfFileContent from '../../../../components/files/operations/csv-import/CsvHeadOfFileContent'
import { AppContextProvider } from '../../../../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

jest.mock('../../../../components/files/operations/csv-import/CsvDetermineImportStructure', () => () => null)

const { language, testFileObjects } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <CsvHeadOfFileContent
        file={testFileObjects[0]}
        data={undefined} // jsdom does not support TextEncoder
      />
    </AppContextProvider>
  )

  return { getByText }
}

test('Renders correctly', () => {
  const { getByText } = setup()

  expect(getByText(APP_STEPS.HEAD.CHARSET[language])).toBeInTheDocument()
  expect(getByText(APP_STEPS.HEAD.DELIMITER[language])).toBeInTheDocument()
})

test('Handles form changes correctly', () => {
  const { getByText } = setup()

  userEvent.click(getByText(API.ENCODE_OPTIONS[1].text))
  userEvent.click(getByText(API.DELIMITER_OPTIONS[0].text))
})
