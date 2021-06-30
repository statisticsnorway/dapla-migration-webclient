import useAxios from 'axios-hooks'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import { AppSettings } from '../components'
import { ApiContext, LanguageContext } from '../context/AppContext'
import { TEST_CONFIGURATIONS } from '../configurations'
import { SETTINGS, TEST_IDS } from '../enums'

window.localStorage.__proto__.getItem = jest.fn()
window.localStorage.__proto__.setItem = jest.fn()

const { alternativeApi, errorString, language } = TEST_CONFIGURATIONS
const setDevToken = jest.fn()
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn(), jest.fn(), setDevToken)
const execute = jest.fn()

const setup = () => {
  const { getByPlaceholderText, getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <AppSettings open={true} setOpen={jest.fn()} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByPlaceholderText, getByTestId, getByText }
}

describe('Common mock', () => {
  beforeEach(() => {
    useAxios.mockReturnValue([{ error: undefined, loading: false }, execute])
  })

  test('Renders correctly', () => {
    const { getByPlaceholderText } = setup()

    expect(getByPlaceholderText(SETTINGS.API[language])).toHaveValue(apiContext.api)
  })

  test('Clicking button and pressing enter in input fires api call', async () => {
    const { getByPlaceholderText, getByText } = setup()

    await userEvent.type(getByPlaceholderText(SETTINGS.API[language]), '{enter}')

    userEvent.click(getByText(SETTINGS.APPLY[language]))

    expect(apiContext.setApi).toHaveBeenCalled()
  })

  test('Editing values works correctly', async () => {
    const { getByPlaceholderText, getByText } = setup()

    await userEvent.type(getByPlaceholderText(SETTINGS.API[language]), alternativeApi)

    expect(getByText(SETTINGS.EDITED_VALUES[language])).toBeInTheDocument()

    userEvent.click(getByText(SETTINGS.APPLY[language]))

    expect(apiContext.setApi).toHaveBeenCalled()
  })

  test('Resetting to default values works correctly', async () => {
    const { getByPlaceholderText, getByTestId } = setup()

    await userEvent.type(getByPlaceholderText(SETTINGS.API[language]), alternativeApi)

    userEvent.click(getByTestId(TEST_IDS.DEFAULT_SETTINGS_VALUES_BUTTON))

    expect(getByPlaceholderText(SETTINGS.API[language])).toHaveValue(apiContext.api)
  })

  test('Paste devToken', async () => {
    const { getByPlaceholderText } = setup()

    await userEvent.type(getByPlaceholderText('Just paste token and close settings'), 'devToken')

    expect(setDevToken).toHaveBeenCalled()
  })
})

test('Shows error when there is a problem with the API', () => {
  useAxios.mockReturnValue([{ error: errorString, loading: false }, execute])

  const { getByText } = setup()

  expect(getByText(errorString)).toBeInTheDocument()
})
