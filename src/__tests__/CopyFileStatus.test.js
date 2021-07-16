import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'

import CopyFileStatus from '../components/files/copy/CopyFileStatus'
import { AppContextProvider } from '../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../configurations'
import { APP_STEPS } from '../enums'

jest.mock('../components/files/copy/CopyFileProgress', () => () => null)

const { errorString, language, uuidTest, testFile, flushPromises, testMockResolve } = TEST_CONFIGURATIONS
const refetch = jest.fn()

const setup = (isCompleted = false) => {
  const { getByText, queryByText } = render(
    <AppContextProvider>
      <CopyFileStatus
        file={testFile.file}
        transactionId={uuidTest}
        isCompleted={isCompleted}
        fileSize={testFile.fileSize}
      />
    </AppContextProvider>
  )

  return { getByText, queryByText }
}

describe('Use fake timers', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    useAxios.mockReturnValue([{ error: undefined, loading: false }, refetch])
  })

  test('Renders correctly on already complete', () => {
    const { queryByText } = setup(true)

    expect(queryByText(APP_STEPS.COPY.COPY_INITIATED[language])).toBeNull()
  })

  test('Renders correctly on status error', async () => {
    refetch.mockResolvedValue(testMockResolve(API.STATUS.ERROR, { 'read-bytes': 0 }, errorString))

    const { getByText } = setup()

    jest.runOnlyPendingTimers()

    await flushPromises()

    expect(getByText(errorString)).toBeInTheDocument()
  })

  test('Renders correctly on status in progress', async () => {
    refetch.mockResolvedValue(testMockResolve(API.STATUS.IN_PROGRESS, { 'read-bytes': 62 }))

    const { getByText } = setup()

    jest.runOnlyPendingTimers()

    await flushPromises()

    expect(getByText(APP_STEPS.COPY.COPY_INITIATED[language])).toBeInTheDocument()
  })

  test('Renders correctly on status complete', async () => {
    refetch.mockResolvedValue(testMockResolve(API.STATUS.COMPLETED, { 'read-bytes': testFile.fileSize }))

    const { queryByText } = setup()

    jest.runOnlyPendingTimers()

    await flushPromises()

    expect(queryByText(APP_STEPS.COPY.COPY_INITIATED[language])).toBeNull()
  })
})

test('Renders correctly on error', () => {
  useAxios.mockReturnValue([{ error: errorString, loading: false }, refetch])

  const { getByText } = setup(false)

  expect(getByText(errorString)).toBeInTheDocument()
})
