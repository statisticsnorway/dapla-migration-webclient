import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import AppDoOperation from '../../components/steps/AppDoOperation'
import { AppContextProvider } from '../../context/AppContext'
import { API, APP, TEST_CONFIGURATIONS } from '../../configurations'

jest.mock('../../components/files/operations/head/HeadOfFile', () => () => null)
jest.mock('../../components/steps/AppForwardOperation', () => () => null)

const { testFileObjects } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <MemoryRouter
        initialEntries={[{ pathname: `${APP[2].route}/${API.OPERATIONS[0]}`, state: { file: testFileObjects[0] } }]}
      >
        <AppDoOperation />
      </MemoryRouter>
    </AppContextProvider>
  )

  return { getByText }
}

test('Renders correctly', () => {
  const { getByText } = setup()

  expect(getByText(testFileObjects[0].folder)).toBeInTheDocument()
  expect(getByText(`${testFileObjects[0].filename} (undefined)`)).toBeInTheDocument()
})
