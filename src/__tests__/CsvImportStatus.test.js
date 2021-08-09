import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'

import CsvImportStatus from '../components/files/operations/csv-import/CsvImportStatus'
import { AppContextProvider } from '../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../configurations'
import { APP_STEPS } from '../enums'

const {
  errorString,
  language,
  uuidTest,
  testFileObjects,
  testFileIsCompletedData,
  flushPromises,
  testMockResolve
} = TEST_CONFIGURATIONS
const refetch = jest.fn()

const setup = (isCompleted = false, isCompleteData = undefined) => {
  const { getByText } = render(
    <AppContextProvider>
      <CsvImportStatus
        transactionId={uuidTest}
        file={testFileObjects[0]}
        isCompleted={isCompleted}
        convertAfterImport={false}
        isCompleteData={isCompleteData}
      />
    </AppContextProvider>
  )

  return { getByText }
}

describe('Use fake timers', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    useAxios.mockReturnValue([{ data: testFileIsCompletedData, error: undefined, loading: false }, refetch])
  })

  test('Renders correctly on already complete', () => {
    const { getByText } = setup(true, testFileIsCompletedData)

    expect(getByText(APP_STEPS.OPERATION.IMPORT.IMPORT_COMPLETE[language])).toBeInTheDocument()
  })

  test('Renders correctly on status error', async () => {
    refetch.mockResolvedValue(testMockResolve(API.STATUS.ERROR, { status: 'test-status' }, errorString))

    const { getByText } = setup()

    jest.runOnlyPendingTimers()

    await flushPromises()

    expect(getByText(errorString)).toBeInTheDocument()
  })

  test('Renders correctly on status in progress', async () => {
    refetch.mockResolvedValue(testMockResolve(API.STATUS.IN_PROGRESS, { status: 'test-status' }))

    const { getByText } = setup()

    jest.runOnlyPendingTimers()

    await flushPromises()

    expect(getByText(APP_STEPS.OPERATION.IMPORT.IMPORTING[language])).toBeInTheDocument()
  })

  test('Renders correctly on status complete', async () => {
    refetch.mockResolvedValue({ data: testFileIsCompletedData })

    const { getByText } = setup()

    jest.runOnlyPendingTimers()

    await flushPromises()

    expect(getByText(APP_STEPS.OPERATION.IMPORT.IMPORT_COMPLETE[language])).toBeInTheDocument()
  })
})

test('Renders correctly on error', () => {
  useAxios.mockReturnValue([{ data: undefined, error: errorString, loading: false }, refetch])

  const { getByText } = setup(false)

  expect(getByText(errorString)).toBeInTheDocument()
})
