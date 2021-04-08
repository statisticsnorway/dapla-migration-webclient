import React, { useState } from 'react'
import { LANGUAGE } from '@statisticsnorway/dapla-js-utilities'

export const ApiContext = React.createContext({
  api: window.__ENV.REACT_APP_API
})

export const LanguageContext = React.createContext(LANGUAGE.LANGUAGES.NORWEGIAN.languageCode)

export const AppContextProvider = (props) => {
  const [api, setApi] = useState(window.__ENV.REACT_APP_API)
  const [language, setLanguage] = useState(LANGUAGE.LANGUAGES.NORWEGIAN.languageCode)

  return (
    <ApiContext.Provider value={{ api, setApi }}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        {props.children}
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )
}
