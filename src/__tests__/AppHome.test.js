import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import { AppHome } from '../components'
import { ApiContext, LanguageContext } from '../context/AppContext'
import { TEST_CONFIGURATIONS } from '../configurations'

jest.mock('../components/file/ListFiles', () => () => null)
jest.mock('../components/file/ScanForFiles', () => () => null)

const { language } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn())

const refetch = jest.fn()

const setup = () => {
  const { getByText, getByTestId } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <AppHome />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByText, getByTestId }
}

test('Renders correctly', () => {
  useAxios.mockReturnValue([{ loading: false, error: undefined, data: {} }, refetch])

  const { getByText, getByTestId } = setup()

  userEvent.click(getByText("Simple view"))
  userEvent.click(getByTestId('test-refetch'))

  expect(refetch).toHaveBeenCalledTimes(1)
})
