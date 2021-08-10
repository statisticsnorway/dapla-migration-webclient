import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import AppMagicInit from '../../components/magic/AppMagicInit'
import { AppContextProvider } from '../../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../../configurations'

jest.mock('../../components/magic/AppMagicScan', () => () => null)

const { errorString, testFile, testFileObjects } = TEST_CONFIGURATIONS
const executeGet = jest.fn()
const path = testFile.file.substr(0, testFile.file.lastIndexOf('/'))

const setup = (fullPath = testFile.file, command = '') => {
  const { getByText, queryByText } = render(
    <AppContextProvider>
      <MemoryRouter initialEntries={['/']}>
        <AppMagicInit command={command} fullPath={fullPath} />
      </MemoryRouter>
    </AppContextProvider>
  )

  return { getByText, queryByText }
}

test('Fires put request correctly and no copy', () => {
  useAxios.mockReturnValue([{ data: { files: testFileObjects }, error: undefined, loading: false }, executeGet])

  setup()

  expect(executeGet).toHaveBeenCalledWith({
    url: `${window.__ENV.REACT_APP_API}/${API.AGENTS.AGENT}${API.FOLDER}${path}`
  })
})

test('Fires put request correctly and copy', () => {
  useAxios.mockReturnValue([{
    data: {
      files: testFileObjects.map(testFile => {
        if (testFile.filename === 'file.txt') {
          testFile.filename = 'file3.txt'
        } else {
          testFile.filename = 'file4.txt'
        }

        return testFile
      })
    }, error: undefined, loading: false
  }, executeGet])

  setup()

  expect(executeGet).toHaveBeenCalledWith({
    url: `${window.__ENV.REACT_APP_API}/${API.AGENTS.AGENT}${API.FOLDER}${path}`
  })
})

test('Fires put request correctly and no files', () => {
  useAxios.mockReturnValue([{ data: { files: [] }, error: undefined, loading: false }, executeGet])

  setup()

  expect(executeGet).toHaveBeenCalledWith({
    url: `${window.__ENV.REACT_APP_API}/${API.AGENTS.AGENT}${API.FOLDER}${path}`
  })
})

test('Renders correctly on loading', () => {
  useAxios.mockReturnValue([{ error: undefined, loading: true }, executeGet])

  const { queryByText } = setup()

  expect(queryByText(errorString)).toBeNull()
})

test('Renders correctly on error', () => {
  useAxios.mockReturnValue([{ error: errorString, loading: false }, executeGet])

  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})
