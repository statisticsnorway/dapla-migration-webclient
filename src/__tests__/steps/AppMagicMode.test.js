import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import AppMagicMode from '../../components/steps/AppMagicMode'
import { AppContextProvider } from '../../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../../configurations'
import { APP_STEPS } from '../../enums'

jest.mock('../../components/magic/AppMagicInit', () => () => null)

const { language } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByText, getByPlaceholderText, queryByText } = render(
    <AppContextProvider>
      <AppMagicMode />
    </AppContextProvider>
  )

  return { getByText, getByPlaceholderText, queryByText }
}

test('Renders correctly', () => {
  const { getByText, getByPlaceholderText } = setup()

  expect(getByText(APP_STEPS.MAGIC.HEADER[language])).toBeInTheDocument()
  expect(getByPlaceholderText(APP_STEPS.MAGIC.PLACEHOLDER[language])).toBeInTheDocument()
})

test('Shows button for any-import', () => {
  const { getByText, getByPlaceholderText, queryByText } = setup()

  userEvent.type(getByPlaceholderText(APP_STEPS.MAGIC.PLACEHOLDER[language]), '/test/a/path/file.txt')

  expect(getByText(API.OPERATIONS[0])).toBeInTheDocument()
  expect(queryByText(API.OPERATIONS[1])).toBeNull()
  expect(queryByText(API.OPERATIONS[2])).toBeNull()
  expect(queryByText(API.ARCHIVE_UNPACK)).toBeNull()
  expect(queryByText(API.OPERATIONS[3])).toBeNull()

  userEvent.click(getByText(API.OPERATIONS[0]))
})

test('Shows disabled button for json-import', () => {
  const { getByText, getByPlaceholderText } = setup()

  userEvent.type(getByPlaceholderText(APP_STEPS.MAGIC.PLACEHOLDER[language]), '/test/a/path/file.json')

  expect(getByText(API.OPERATIONS[2])).toBeInTheDocument()
  expect(getByText(API.OPERATIONS[2])).toBeDisabled()
})
