import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import App from '../App'
import { AppContextProvider } from '../context/AppContext'

jest.mock('../components/AppMenu', () => () => null)
jest.mock('../components/AppSettings', () => () => null)
jest.mock('../components/steps/AppCopy', () => () => null)
jest.mock('../components/steps/AppStatus', () => () => null)
jest.mock('../components/steps/AppMagicMode', () => () => null)
jest.mock('../components/steps/AppDoOperation', () => () => null)
jest.mock('../components/steps/AppSelectOperation', () => () => null)

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
