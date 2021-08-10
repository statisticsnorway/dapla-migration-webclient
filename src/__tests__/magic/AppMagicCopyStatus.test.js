import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import AppMagicCopyStatus from '../../components/magic/AppMagicCopyStatus'
import { AppContextProvider } from '../../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../../configurations'
import { APP_STEPS } from '../../enums'

jest.mock('../../components/magic/AppMagicCopyProgress', () => () => null)

const { errorString, language, uuidTest, testFile, flushPromises, testMockResolve } = TEST_CONFIGURATIONS
const refetch = jest.fn()

const setup = (command = '') => {
  const { getByText, queryByText } = render(
    <AppContextProvider>
      <MemoryRouter initialEntries={['/']}>
        <AppMagicCopyStatus
          command={command}
          fullPath={testFile.file}
          transactionId={uuidTest}
          fileSize={testFile.fileSize}
        />
      </MemoryRouter>
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

    expect(getByText(APP_STEPS.MAGIC.WAIT_FOR_COPY[language])).toBeInTheDocument()
  })

  test('Renders correctly on status complete', async () => {
    refetch.mockResolvedValue(testMockResolve(API.STATUS.COMPLETED, { 'read-bytes': testFile.fileSize }))

    const { queryByText } = setup()

    jest.runOnlyPendingTimers()

    await flushPromises()

    expect(queryByText(APP_STEPS.MAGIC.WAIT_FOR_COPY[language])).toBeNull()
  })
})

test('Renders correctly on error', () => {
  useAxios.mockReturnValue([{ error: errorString, loading: false }, refetch])

  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})
