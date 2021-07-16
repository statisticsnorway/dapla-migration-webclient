import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import CopyFile from '../components/files/copy/CopyFile'
import { AppContextProvider } from '../context/AppContext'
import { API, API_INSTRUCTIONS, TEST_CONFIGURATIONS } from '../configurations'
import { APP_STEPS } from '../enums'

jest.mock('../components/files/copy/CopyFileStatus', () => () => null)

window.localStorage.__proto__.getItem = jest.fn()
window.localStorage.__proto__.setItem = jest.fn()

const { errorString, language, uuidTest, testFile } = TEST_CONFIGURATIONS
const executePut = jest.fn()

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <CopyFile file={testFile.file} fileSize={testFile.fileSize} />
    </AppContextProvider>
  )

  return { getByText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue([{ error: undefined, loading: false }, executePut])
  })

  test('Renders correctly', () => {
    const { getByText } = setup()

    expect(getByText(APP_STEPS.COPY.INITIATE_COPY[language])).toBeInTheDocument()
  })

  test('Fires put request correctly', () => {
    const { getByText } = setup()

    userEvent.click(getByText(APP_STEPS.COPY.INITIATE_COPY[language]))

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
