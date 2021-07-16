import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import ArchiveUnpackStatus from '../components/files/operations/archive-import/ArchiveUnpackStatus'
import { AppContextProvider } from '../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../configurations'
import { APP_STEPS } from '../enums'

const {
  errorString,
  language,
  uuidTest,
  testFile,
  testFileIsCompletedData,
  flushPromises,
  testMockResolve
} = TEST_CONFIGURATIONS
const refetch = jest.fn()

const setup = (isCompleted = false) => {
  const { getByText } = render(
    <AppContextProvider>
      <MemoryRouter initialEntries={['/']}>
        <ArchiveUnpackStatus
          file={testFile.file}
          transactionId={uuidTest}
          isCompleted={isCompleted}
        />
      </MemoryRouter>
    </AppContextProvider>
  )

  return { getByText }
}

describe('Use fake timers', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    useAxios.mockReturnValue([{ error: undefined, loading: false }, refetch])
  })

  test('Renders correctly on already complete', () => {
    const { getByText } = setup(true)

    expect(getByText(APP_STEPS.MAGIC.CONTINUE[language])).toBeInTheDocument()
    expect(getByText(APP_STEPS.OPERATION.ARCHIVE.UNPACK_COMPLETE[language])).toBeInTheDocument()
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

    expect(getByText(APP_STEPS.OPERATION.ARCHIVE.UNPACKING[language])).toBeInTheDocument()
  })

  test('Renders correctly on status complete', async () => {
    refetch.mockResolvedValue({ data: testFileIsCompletedData })

    const { getByText } = setup()

    jest.runOnlyPendingTimers()

    await flushPromises()

    expect(getByText(APP_STEPS.MAGIC.CONTINUE[language])).toBeInTheDocument()
    expect(getByText(APP_STEPS.OPERATION.ARCHIVE.UNPACK_COMPLETE[language])).toBeInTheDocument()
  })
})

test('Renders correctly on error', () => {
  useAxios.mockReturnValue([{ error: errorString, loading: false }, refetch])

  const { getByText } = setup(false)

  expect(getByText(errorString)).toBeInTheDocument()
})
