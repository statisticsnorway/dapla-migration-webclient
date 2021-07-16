import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import CopyFileProgress from '../components/files/copy/CopyFileProgress'
import { AppContextProvider } from '../context/AppContext'
import { API, TEST_CONFIGURATIONS } from '../configurations'
import { APP_STEPS } from '../enums'

const { language, uuidTest, testFile } = TEST_CONFIGURATIONS

const setup = (nextCommand = undefined, readBytes = testFile.fileSize) => {
  const { getByText } = render(
    <AppContextProvider>
      <MemoryRouter initialEntries={['/']}>
        <CopyFileProgress
          file={testFile.file}
          readBytes={readBytes}
          transactionId={uuidTest}
          nextCommand={nextCommand}
          fileSize={testFile.fileSize}
        />
      </MemoryRouter>
    </AppContextProvider>
  )

  return { getByText }
}

test('Renders correctly on in progress', () => {
  const { getByText } = setup(undefined, 62)

  expect(getByText('50%')).toBeInTheDocument()
  expect(getByText(APP_STEPS.COPY.COPYING[language])).toBeInTheDocument()
})

test('Renders correctly on complete', () => {
  const { getByText } = setup()

  expect(getByText(APP_STEPS.COPY.COPY_COMPLETE[language])).toBeInTheDocument()
  expect(getByText(APP_STEPS.COPY.GO_TO_OPERATION[language])).toBeInTheDocument()
})

test('Renders correctly on complete with nextCommand', () => {
  const { getByText } = setup(API.OPERATIONS[0])

  expect(getByText(APP_STEPS.MAGIC.CONTINUE[language])).toBeInTheDocument()
})
