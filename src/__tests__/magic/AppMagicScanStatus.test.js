import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'

import AppMagicScanStatus from '../../components/magic/AppMagicScanStatus'
import { AppContextProvider } from '../../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../../configurations'

jest.mock('../../components/magic/AppMagicCopy', () => () => null)

const {
  errorString,
  uuidTest,
  testFile,
  testFileIsCompletedData,
  flushPromises,
  testMockResolve
} = TEST_CONFIGURATIONS
const refetch = jest.fn()

const setup = (fullPath = testFile.file, command = '') => {
  const { getByText, queryByText } = render(
    <AppContextProvider>
      <AppMagicScanStatus fullPath={fullPath} command={command} transactionId={uuidTest} />
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
