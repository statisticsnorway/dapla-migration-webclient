import { useContext, useState } from 'react'
import { Dropdown, Header, Image, Menu, Sticky } from 'semantic-ui-react'
import {
  dapla_long_rgb,
  dapla_short_rgb,
  LANGUAGE,
  SSB_COLORS,
  ssb_logo_no_text_rgb,
  ssb_logo_rgb
} from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../context/AppContext'
import { UI } from '../enums'

function AppMenu ({ setSettingsOpen, context }) {
  const { language, setLanguage } = useContext(LanguageContext)

  const [menuIsStuck, setMenuIsStuck] = useState(false)

  return (
    <Sticky onUnstick={() => setMenuIsStuck(false)} onStick={() => setMenuIsStuck(true)} context={context}>
      <Menu
        secondary
        size={menuIsStuck ? 'large' : 'huge'}
        style={{
          padding: menuIsStuck ? 0 : '1rem',
          backgroundColor: SSB_COLORS.BACKGROUND,
          border: '1px solid rgba(34,36,38,.15)',
          boxShadow: '0 1px 2px 0 rgba(34,36,38,.15)'
        }}
      >
        <Menu.Item>
          <Image size={menuIsStuck ? 'mini' : 'medium'} src={menuIsStuck ? ssb_logo_no_text_rgb : ssb_logo_rgb} />
        </Menu.Item>
        <Menu.Item>
          <Image size={menuIsStuck ? 'mini' : 'tiny'} src={menuIsStuck ? dapla_short_rgb : dapla_long_rgb} />
        </Menu.Item>
        <Menu.Item>
          <Header size={menuIsStuck ? 'medium' : 'huge'} content={UI.HEADER[language]} />
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item
            style={{ color: SSB_COLORS.GREEN }}
            onClick={() => setSettingsOpen(true)}
            icon={{ name: 'setting', size: menuIsStuck ? 'large' : 'big' }}
          />
          <Dropdown item text={`${LANGUAGE.LANGUAGE[language]} (${LANGUAGE.LANGUAGE_CHOICE[language]})`}>
            <Dropdown.Menu>
              {Object.keys(LANGUAGE.LANGUAGES).map(languageName =>
                <Dropdown.Item
                  key={languageName}
                  content={LANGUAGE[languageName][language]}
                  onClick={() => setLanguage(LANGUAGE.LANGUAGES[languageName].languageCode)}
                />
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    </Sticky>
  )
}

export default AppMenu
