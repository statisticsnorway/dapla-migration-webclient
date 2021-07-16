import '@testing-library/jest-dom/extend-expect'

jest.mock('axios-hooks')
jest.mock('uuid', () => ({ v4: () => 'uuidTest' }))

window.__ENV = {
  REACT_APP_API: process.env.REACT_APP_API
}

// https://github.com/testing-library/react-testing-library#suppressing-unnecessary-warnings-on-react-dom-168
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
