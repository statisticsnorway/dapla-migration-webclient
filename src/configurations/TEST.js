import { LANGUAGE } from '@statisticsnorway/dapla-js-utilities'
import { API } from './API'

export const TEST_CONFIGURATIONS = {
  alternativeApi: 'http://localhost:9999',
  apiContext: (fn, fn2, fn3, advancedUser = false) => ({
    api: window.__ENV.REACT_APP_API,
    setApi: fn,
    advancedUser: advancedUser,
    setAdvancedUser: fn2,
    devToken: '',
    setDevToken: fn3
  }),
  testFileObjects: [
    {
      size: 123,
      filename: 'file.txt',
      folder: '/test/a/path',
      created: '2011-10-05T14:48:00.000Z',
      modified: '2012-10-05T14:48:00.000Z'
    },
    {
      size: 456,
      filename: 'file2.txt',
      folder: '/test/b/path',
      created: '2013-10-05T14:48:00.000Z',
      modified: '2014-10-05T14:48:00.000Z'
    }
  ],
  testFile: {
    file: '/test/a/path/file.txt',
    fileSize: 123
  },
  testFileDataEncoded: [
    'c29tZTtjb29sO3RoaW5n',
    'MTsyO3N0cmluZw=='
  ],
  testFileDataDecoded: ['1;2;string'],
  testFileIsCompletedData: {
    state: {
      startTime: '2011-10-05T14:48:00.000Z',
      timestamp: '2011-10-05T15:48:00.000Z',
      status: API.STATUS.COMPLETED
    },
    result: { status: { status: 'test-status' } }
  },
  csvTestFileCompletedData: {
    result: {
      template: {
        files: ['/test/a/path/TestFile.csv'],
        metadata: {
          boundaryType: 'BOUNDED',
          valuation: 'INTERNAL'
        },
        structure: {
          schema: {
            delimiter: ';',
            charset: 'UTF-8',
            columns: [
              {
                name: 'Some',
                type: 'Long'
              },
              {
                name: 'Cool',
                type: 'Long'
              },
              {
                name: 'Thing',
                type: 'String'
              }
            ]
          },
          uri: 'inline:csv'
        }
      }
    }
  },
  testMockResolve: (status, resultStatus, error = false) => {
    if (error) {
      return ({
        data: {
          state: { startTime: '2011-10-05T14:48:00.000Z', status: API.STATUS.ERROR, errorCause: error },
          result: { status: { status: 'test-status' } }
        }
      })
    } else {
      return ({
        data: {
          state: { startTime: '2011-10-05T14:48:00.000Z', status: status },
          result: { status: resultStatus }
        }
      })
    }
  },
  flushPromises: () => new Promise(res => process.nextTick(res)),
  uuidTest: 'uuidTest',
  errorString: 'A problem occurred',
  language: LANGUAGE.LANGUAGES.NORWEGIAN.languageCode,
  otherLanguage: LANGUAGE.LANGUAGES.ENGLISH.languageCode,
  responseObject: { data: { statusCode: 200 } }
}
