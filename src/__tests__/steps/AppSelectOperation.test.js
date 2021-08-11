import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import AppSelectOperation from '../../components/steps/AppSelectOperation'
import { AppContextProvider } from '../../context/AppContext'
import { TEST_CONFIGURATIONS } from '../../configurations'
import { APP_STEPS } from '../../enums'

jest.mock('../../components/files/list/ListFiles', () => () => null)

const { language, testFile } = TEST_CONFIGURATIONS

const setup = (state = undefined) => {
  const { getByText } = render(
    <AppContextProvider>
      <MemoryRouter initialEntries={[{ pathname: '/', state: state }]}>
        <AppSelectOperation />
      </MemoryRouter>
    </AppContextProvider>
  )

  return { getByText }
}

test('Renders correctly', () => {
  const { getByText } = setup()

  userEvent.click(getByText(APP_STEPS.OPERATION.HEADER[language]))

  expect(getByText(APP_STEPS.OPERATION.HEADER[language])).toBeInTheDocument()

  userEvent.click(getByText(APP_STEPS.OPERATION.HEADER[language]))
})

test('Renders correctly with file', () => {
  setup({ file: testFile })
})
