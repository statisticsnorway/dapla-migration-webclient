import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'

import AppMagicScan from '../../components/magic/AppMagicScan'
import { AppContextProvider } from '../../context/AppContext'
import { API, API_INSTRUCTIONS, TEST_CONFIGURATIONS } from '../../configurations'

jest.mock('../../components/magic/AppMagicScanStatus', () => () => null)

const { errorString, uuidTest, testFile } = TEST_CONFIGURATIONS
const executePut = jest.fn()
const path = testFile.file.substr(0, testFile.file.lastIndexOf('/'))

const setup = (fullPath = testFile.file, command = '') => {
  const { getByText, getByPlaceholderText } = render(
    <AppContextProvider>
      <AppMagicScan fullPath={fullPath} command={command} />
    </AppContextProvider>
  )

  return { getByText, getByPlaceholderText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue([{ error: undefined, loading: false }, executePut])
  })

  test('Fires put request correctly', () => {
    setup()

    expect(executePut).toHaveBeenCalledWith({
      data: API_INSTRUCTIONS.SCAN(uuidTest, path),
      url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${uuidTest}`
    })
  })
})

test('Renders error correctly', () => {
  useAxios.mockReturnValue([{ error: errorString, loading: false }, executePut])

  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})
