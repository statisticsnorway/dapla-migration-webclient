import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'

import AppMagicCopy from '../../components/magic/AppMagicCopy'
import { AppContextProvider } from '../../context/AppContext'
import { API, API_INSTRUCTIONS, TEST_CONFIGURATIONS } from '../../configurations'

jest.mock('../../components/magic/AppMagicCopyStatus', () => () => null)

window.localStorage.__proto__.getItem = jest.fn()
window.localStorage.__proto__.setItem = jest.fn()

const { errorString, uuidTest, testFile } = TEST_CONFIGURATIONS
const executePut = jest.fn()

const setup = (command = '') => {
  const { getByText } = render(
    <AppContextProvider>
      <AppMagicCopy fullPath={testFile.file} fileSize={testFile.fileSize} command={command} />
    </AppContextProvider>
  )

  return { getByText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue([{ error: undefined, loading: false }, executePut])
  })

  test('Fires put request correctly', () => {
    setup()

    expect(executePut).toHaveBeenCalledWith({
      data: API_INSTRUCTIONS.COPY(uuidTest, testFile.file),
      url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${uuidTest}`
    })
  })
})

test('Renders error correctly', () => {
  useAxios.mockReturnValue([{ error: errorString, loading: false }, executePut])

  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})
