import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import App from '../App'
import { AppContextProvider } from '../context/AppContext'

jest.mock('../components/AppHome', () => () => null)
jest.mock('../components/AppMenu', () => () => null)
jest.mock('../components/AppSettings', () => () => null)
jest.mock('../components/file/ViewFiles', () => () => null)
jest.mock('../components/file/ImportFile', () => () => null)

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    </AppContextProvider>
  )

  return { getByText }
}

test('Does not crash', () => {
  setup()
})

