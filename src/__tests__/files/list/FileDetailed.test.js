import { render } from '@testing-library/react'

import FileDetailed from '../../../components/files/list/FileDetailed'
import { AppContextProvider } from '../../../context/AppContext'
import { TEST_CONFIGURATIONS } from '../../../configurations'
import { APP_STEPS } from '../../../enums'

jest.mock('../../../components/files/copy/CopyFile', () => () => null)

const { language, testFileObjects } = TEST_CONFIGURATIONS

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <FileDetailed file={testFileObjects[0]} />
    </AppContextProvider>
  )

  return { getByText }
}

test('Renders correctly', () => {
  const { getByText } = setup()

  expect(getByText(testFileObjects[0].folder)).toBeInTheDocument()
  expect(getByText(testFileObjects[0].filename)).toBeInTheDocument()
  expect(getByText(`${APP_STEPS.LIST.FILE.CREATED[language]}: 10/5/2011`)).toBeInTheDocument()
  expect(getByText(`${APP_STEPS.LIST.FILE.MODIFIED[language]}: 10/5/2012`)).toBeInTheDocument()
  expect(getByText(`${APP_STEPS.LIST.FILE.SIZE[language]}: ${testFileObjects[0].size} B`)).toBeInTheDocument()
})
