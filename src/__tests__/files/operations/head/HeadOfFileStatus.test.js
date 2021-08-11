import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'

import HeadOfFileStatus from '../../../../components/files/operations/head/HeadOfFileStatus'
import { AppContextProvider } from '../../../../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../../../../configurations'

jest.mock('../../../../components/files/operations/head/HeadOfFileContent', () => () => null)
jest.mock('../../../../components/files/operations/csv-import/CsvHeadOfFileContent', () => () => null)

const {
  errorString,
  uuidTest,
  testFileObjects,
  testFileIsCompletedData,
  flushPromises,
  testMockResolve
} = TEST_CONFIGURATIONS
const refetch = jest.fn()

const setup = () => {
  const { getByText, queryByText } = render(
    <AppContextProvider>
      <HeadOfFileStatus file={testFileObjects[0]} transactionId={uuidTest} operation={API.OPERATIONS[0]} />
    </AppContextProvider>
  )

  return { getByText, queryByText }
}

describe('Use fake timers', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    useAxios.mockReturnValue([{ error: undefined, loading: false }, refetch])
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

    const { queryByText } = setup()

    jest.runOnlyPendingTimers()

    await flushPromises()

    expect(queryByText(errorString)).toBeNull()
  })

  test('Renders correctly on status complete', async () => {
    refetch.mockResolvedValue({ data: testFileIsCompletedData })

    const { queryByText } = setup()

    jest.runOnlyPendingTimers()

    await flushPromises()

    expect(queryByText(errorString)).toBeNull()
  })
})

test('Renders correctly on error', () => {
  useAxios.mockReturnValue([{ error: errorString, loading: false }, refetch])

  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})
