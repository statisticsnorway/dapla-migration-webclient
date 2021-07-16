import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import ArchiveImportEdit from '../components/files/operations/archive-import/ArchiveImportEdit'
import { AppContextProvider } from '../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../configurations'
import { APP_STEPS } from '../enums'

jest.mock('../components/files/operations/archive-import/ArchiveImportStatus', () => () => null)

window.localStorage.__proto__.getItem = jest.fn()
window.localStorage.__proto__.setItem = jest.fn()

const { language, uuidTest, testFile } = TEST_CONFIGURATIONS
const instructions = `{ "id": "${uuidTest}", "command": { "args": { "file": "${testFile.file}" } } }`
const executePut = jest.fn()

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <ArchiveImportEdit instructions={instructions} />
    </AppContextProvider>
  )

  return { getByText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue([{ loading: false }, executePut])
  })

  test('Renders correctly', () => {
    const { getByText } = setup()

    expect(getByText(APP_STEPS.OPERATION.IMPORT.INITIATE_IMPORT[language])).toBeInTheDocument()
  })

  test('Fires put request correctly', () => {
    const { getByText } = setup()

    userEvent.click(getByText(APP_STEPS.OPERATION.IMPORT.INITIATE_IMPORT[language]))

    expect(executePut).toHaveBeenCalledWith({
      data: JSON.parse(instructions),
      url: `${window.__ENV.REACT_APP_API}${API.COMMAND}${uuidTest}`
    })
  })
})
