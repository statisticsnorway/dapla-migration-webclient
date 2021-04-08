import { render } from '@testing-library/react'

import App from '../App'
import { AppContextProvider } from '../context/AppContext'

jest.mock('../components/AppHome', () => () => null)
jest.mock('../components/AppMenu', () => () => null)
jest.mock('../components/AppSettings', () => () => null)

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <App />
    </AppContextProvider>
  )

  return { getByText }
}

test('Does not crash', () => {
  setup()
})
