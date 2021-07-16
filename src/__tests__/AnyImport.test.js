import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import AnyImport from '../components/files/operations/any-import/AnyImport'
import { AppContextProvider } from '../context/AppContext'
import { API, API_INSTRUCTIONS, TEST_CONFIGURATIONS } from '../configurations'
import { APP_STEPS } from '../enums'

jest.mock('../components/files/operations/any-import/AnyImportStatus', () => () => null)

window.localStorage.__proto__.getItem = jest.fn()
window.localStorage.__proto__.setItem = jest.fn()

const { errorString, language, uuidTest, testFileObjects } = TEST_CONFIGURATIONS
const executePut = jest.fn()

const setup = (trigger = false) => {
  const { getByText } = render(
    <AppContextProvider>
      <AnyImport file={testFileObjects[0]} trigger={trigger} />
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

    expect(getByText(APP_STEPS.OPERATION.IMPORT.INITIATE_IMPORT[language])).toBeInTheDocument()
  })

  test('Fires put request correctly', () => {
    const { getByText } = setup()

    userEvent.click(getByText(APP_STEPS.OPERATION.IMPORT.INITIATE_IMPORT[language]))

    expect(executePut).toHaveBeenCalledWith({
      data: API_INSTRUCTIONS.ANY_IMPORT(uuidTest, [`${testFileObjects[0].folder}/${testFileObjects[0].filename}`]),
      url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${uuidTest}`
    })
  })

  test('Fires put request correctly when trigger is provided', () => {
    setup(true)

    expect(executePut).toHaveBeenCalledWith({
      data: API_INSTRUCTIONS.ANY_IMPORT(uuidTest, [`${testFileObjects[0].folder}/${testFileObjects[0].filename}`]),
      url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${uuidTest}`
    })
  })
})

test('Renders error correctly', () => {
  useAxios.mockReturnValue([{ error: errorString, loading: false }, executePut])

  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})
