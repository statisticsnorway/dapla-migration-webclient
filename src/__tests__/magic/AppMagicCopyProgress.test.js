import { render } from '@testing-library/react'

import AppMagicCopyProgress from '../../components/magic/AppMagicCopyProgress'
import { AppContextProvider } from '../../context/AppContext'
import { TEST_CONFIGURATIONS } from '../../configurations'
import { APP_STEPS } from '../../enums'

const { language, testFile } = TEST_CONFIGURATIONS

const setup = (readBytes = testFile.fileSize) => {
  const { getByText } = render(
    <AppContextProvider>
      <AppMagicCopyProgress
        readBytes={readBytes}
        fileSize={testFile.fileSize}
      />
    </AppContextProvider>
  )

  return { getByText }
}

test('Renders correctly on in progress', () => {
  const { getByText } = setup(62)

  expect(getByText('50%')).toBeInTheDocument()
  expect(getByText(APP_STEPS.COPY.COPYING[language])).toBeInTheDocument()
})

test('Renders correctly on complete', () => {
  const { getByText } = setup()

  expect(getByText(APP_STEPS.COPY.COPY_COMPLETE[language])).toBeInTheDocument()
})
