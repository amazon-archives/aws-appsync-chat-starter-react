import React from 'react'
import PropTypes from 'prop-types'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { graphql } from 'react-apollo'
import detectLanguage from '../../graphql/queries/detectLanguage'
const langMap = [
  { code: 'en', lang: 'English' },
  { code: 'zh', lang: 'Chinese' },
  { code: 'fr', lang: 'French' },
  { code: 'pt', lang: 'Portuguese' },
  { code: 'es', lang: 'Spanish' }
]
const BOTS = {
  CHUCKBOT: 'ChuckBot',
  MOVIEBOT: 'MovieBot'
}

class AIMenu extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      data: { detectLanguage: { response: oldResponse = null } = {} } = {}
    } = prevProps
    const { data: { detectLanguage: { response } = {} } = {} } = this.props

    if (!oldResponse && response) {
      const code = JSON.parse(response)[0].LanguageCode
      console.log(`Detected Language from Direct Query: ${code}`)
      this.props.setLanguageCode(code)
    }
  }

  render() {
    const { msg } = this.props
    const { data: { detectLanguage: { response } = {} } = {} } = this.props
    const code = response ? JSON.parse(response)[0].LanguageCode : null
    const hasText =
      this.props.msg.content && this.props.msg.content.trim().length
    return (
      <Dropdown
        isOpen={this.props.dropdownOpen}
        toggle={() => this.props.toggleDropDown()}
      >
        <DropdownToggle
          className="border-0 btn-sm py-0"
          style={{ backgroundColor: 'transparent' }}
        >
          <i className="fas fa-caret-down" />
        </DropdownToggle>
        <DropdownMenu className="align-items-left">
          <DropdownItem header>Listen</DropdownItem>
          <DropdownItem onClick={this.props.dictate} className="small">
            <i className="fas fa-microphone-alt border border-dark rounded-circle p-1" />
            <span className="ml-1">Text to Speech</span>
          </DropdownItem>
          <DropdownItem header>Bots</DropdownItem>
          <DropdownItem
            value="ChuckBot"
            onClick={e => this.props.doBot({ bot: BOTS.CHUCKBOT })}
            className="small"
          >
            <i className="fas fa-robot border border-dark rounded-circle p-1" />
            <span className="ml-1">ChuckBot</span>
          </DropdownItem>
          <DropdownItem
            value="MovieBot"
            onClick={e => this.props.doBot({ bot: BOTS.MOVIEBOT })}
            className="small"
          >
            <i className="fas fa-robot border border-dark rounded-circle p-1" />
            <span className="ml-1">MovieBot</span>
          </DropdownItem>
          {hasText ? (
            <React.Fragment>
              <DropdownItem header>Analyze</DropdownItem>
              <DropdownItem onClick={this.props.comprehend} className="small">
                <i className="fas fa-grin border border-dark rounded-circle p-1" />
                <span className="ml-1">Sentiment</span>
              </DropdownItem>
            </React.Fragment>
          ) : null}
          {hasText ? (
            <React.Fragment>
              <DropdownItem header>Translate</DropdownItem>
              {langMap.map(l => (
                <DropdownItem
                  key={l.code}
                  value={l.code}
                  disabled={!code || code === l.code}
                  onClick={e =>
                    this.props.setTranslation({ selectedLanguage: l.code })
                  }
                  className="small"
                >
                  <i className="fas fa-globe border border-dark rounded-circle p-1" />
                  <span className="ml-1">{l.lang}</span>
                </DropdownItem>
              ))}
            </React.Fragment>
          ) : null}
        </DropdownMenu>
      </Dropdown>
    )
  }
}

AIMenu.propTypes = {
  msg: PropTypes.object.isRequired,
  dropdownOpen: PropTypes.bool.isRequired,
  toggleDropDown: PropTypes.func.isRequired,
  setLanguageCode: PropTypes.func.isRequired,
  setTranslation: PropTypes.func.isRequired,
  comprehend: PropTypes.func.isRequired,
  doBot: PropTypes.func.isRequired,
  dictate: PropTypes.func.isRequired,
  data: PropTypes.object
}

const AIMenuWithData = graphql(detectLanguage, {
  skip: props => !props.msg || !props.dropdownOpen,
  options: props => ({
    variables: {
      text: props.msg.content
    }
  })
})(AIMenu)

export default AIMenuWithData
