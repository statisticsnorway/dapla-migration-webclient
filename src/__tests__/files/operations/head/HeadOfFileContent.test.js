import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import HeadOfFileContent from '../../../../components/files/operations/head/HeadOfFileContent'
import { AppContextProvider } from '../../../../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../../../../configurations'
import { APP_STEPS } from '../../../../enums'

const { language } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <HeadOfFileContent
        data={undefined} // jsdom does not support TextEncoder
      />
    </AppContextProvider>
  )

  return { getByText }
}

test('Renders correctly', () => {
  const { getByText } = setup()

  expect(getByText(APP_STEPS.HEAD.CHARSET[language])).toBeInTheDocument()
})

test('Handles form changes correctly', () => {
  const { getByText } = setup()

  userEvent.click(getByText(API.ENCODE_OPTIONS[1].text))
})
