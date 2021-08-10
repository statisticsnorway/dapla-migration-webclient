import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import HeadOfFile from '../../../../components/files/operations/head/HeadOfFile'
import { AppContextProvider } from '../../../../context/AppContext'
import { API, API_INSTRUCTIONS, TEST_CONFIGURATIONS } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

jest.mock('../../../../components/files/operations/head/HeadOfFileStatus', () => () => null)

const { errorString, language, uuidTest, testFileObjects } = TEST_CONFIGURATIONS
const executePut = jest.fn()

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <HeadOfFile file={testFileObjects[0]} operation={API.OPERATIONS[0]} />
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

    expect(getByText(APP_STEPS.HEAD.HEADER[language])).toBeInTheDocument()
  })

  test('Fires put request correctly', () => {
    const { getByText } = setup()

    userEvent.click(getByText(APP_STEPS.HEAD.HEADER[language]))

    expect(executePut).toHaveBeenCalledWith({
      data: API_INSTRUCTIONS.HEAD(uuidTest, `${testFileObjects[0].folder}/${testFileObjects[0].filename}`, '2'),
      url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${uuidTest}`
    })

    userEvent.click(getByText(APP_STEPS.HEAD.HEADER[language]))
  })

  test('Handles form changes correctly', () => {
    const { getByText } = setup()

    userEvent.click(getByText('100'))
    userEvent.click(getByText(APP_STEPS.HEAD.HEADER[language]))

    expect(executePut).toHaveBeenCalledWith({
      data: API_INSTRUCTIONS.HEAD(uuidTest, `${testFileObjects[0].folder}/${testFileObjects[0].filename}`, '100'),
      url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${uuidTest}`
    })
  })
})

test('Renders error correctly', () => {
  useAxios.mockReturnValue([{ error: errorString, loading: false }, executePut])

  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})
