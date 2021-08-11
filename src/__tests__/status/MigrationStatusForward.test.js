import { render } from '@testing-library/react'

import MigrationStatusForward from '../../components/status/MigrationStatusForward'
import { AppContextProvider } from '../../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../../configurations'

jest.mock('../../components/files/copy/CopyFileStatus', () => () => null)
jest.mock('../../components/files/operations/csv-import/CsvImportStatus', () => () => null)
jest.mock('../../components/files/operations/any-import/AnyImportStatus', () => () => null)
jest.mock('../../components/files/operations/archive-import/ArchiveImportStatus', () => () => null)
jest.mock('../../components/files/operations/archive-import/ArchiveUnpackStatus', () => () => null)

const { uuidTest, testFile } = TEST_CONFIGURATIONS

const setup = (info) => {
  const { getByText } = render(
    <AppContextProvider>
      <MigrationStatusForward statusId={uuidTest} info={info} isCompleted={true} data={undefined} />
    </AppContextProvider>
  )

  return { getByText }
}

test('Renders correctly copy', () => {
  setup({ command: 'copy' })
})

test('Renders correctly any-import', () => {
  setup({ command: API.OPERATIONS[0], file: [testFile.file] })
})

test('Renders correctly csv-import', () => {
  setup({ command: API.OPERATIONS[1], file: [testFile.file] })
})

test('Renders correctly archive-unpack', () => {
  setup({ command: API.ARCHIVE_UNPACK })
})

test('Renders correctly archive-import', () => {
  setup({ command: API.OPERATIONS[3], file: testFile.file })
})

test('Renders correctly undefined', () => {
  setup({ command: undefined })
})
