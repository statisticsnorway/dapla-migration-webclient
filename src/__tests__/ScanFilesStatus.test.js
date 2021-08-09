import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'

import ScanFilesStatus from '../components/files/scan/ScanFilesStatus'
import { AppContextProvider } from '../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../configurations'
import { APP_STEPS } from '../enums'

const {
  errorString,
  language,
  uuidTest,
  testFileIsCompletedData,
  flushPromises,
  testMockResolve
} = TEST_CONFIGURATIONS
const refetch = jest.fn()

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <ScanFilesStatus transactionId={uuidTest} />
    </AppContextProvider>
  )

  return { getByText }
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

    const { getByText } = setup()

    jest.runOnlyPendingTimers()

    await flushPromises()

    expect(getByText(APP_STEPS.SCAN.SCANNING[language])).toBeInTheDocument()
  })

  test('Renders correctly on status complete', async () => {
    refetch.mockResolvedValue({ data: testFileIsCompletedData })

    const { getByText } = setup()

    jest.runOnlyPendingTimers()

    await flushPromises()

    expect(getByText(APP_STEPS.SCAN.COMPLETE[language])).toBeInTheDocument()
  })
})

test('Renders correctly on error', () => {
  useAxios.mockReturnValue([{ error: errorString, loading: false }, refetch])

  const { getByText } = setup(false)

  expect(getByText(errorString)).toBeInTheDocument()
})
