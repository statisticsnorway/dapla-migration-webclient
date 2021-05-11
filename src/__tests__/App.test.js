import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import App from '../App'
import { AppContextProvider } from '../context/AppContext'

jest.mock('../components/AppHome', () => () => null)
jest.mock('../components/AppMenu', () => () => null)
jest.mock('../components/AppSettings', () => () => null)
jest.mock('../components/files/inspect/FileInspect', () => () => null)

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
