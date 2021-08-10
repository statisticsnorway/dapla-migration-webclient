import { render } from '@testing-library/react'

import AppForwardOperation from '../../components/steps/AppForwardOperation'
import { AppContextProvider } from '../../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../../configurations'

jest.mock('../../components/files/operations/any-import/AnyImport', () => () => null)
jest.mock('../../components/files/operations/archive-import/ArchiveImport', () => () => null)
jest.mock('../../components/files/operations/archive-import/ArchiveUnpack', () => () => null)
jest.mock('../../components/files/operations/head/HeadOfFile', () => () => null)

const { testFile } = TEST_CONFIGURATIONS

const setup = (operation, trigger = false) => {
  const { getByText } = render(
    <AppContextProvider>
      <AppForwardOperation operation={operation} file={testFile} trigger={trigger} />
    </AppContextProvider>
  )

  return { getByText }
}

test('Renders correctly any-import', () => {
  setup({ operation: API.OPERATIONS[0] })
})

test('Renders correctly csv-import', () => {
  setup({ operation: API.OPERATIONS[1] })
})

test('Renders correctly archive-unpack', () => {
  setup({ operation: API.ARCHIVE_UNPACK })
})

test('Renders correctly archive-import', () => {
  setup({ operation: API.OPERATIONS[3] })
})

test('Renders correctly undefined', () => {
  setup({ operation: undefined })
})
