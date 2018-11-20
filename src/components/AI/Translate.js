import React from 'react'
import { graphql } from 'react-apollo'
import PropTypes from 'prop-types'
import translate from '../../graphql/queries/translate'

class Translate extends React.Component {
  componentDidMount() {
    const { data: { translate: { response } = {} } = {} } = this.props
    if (response) {
      const translated = JSON.parse(response).TranslatedText
      this.props.applyState({ translated })
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      data: { translate: { response: oldResponse = null } = {} } = {}
    } = prevProps
    const { data: { translate: { response } = {} } = {} } = this.props

    if (!oldResponse && response) {
      const translated = JSON.parse(response).TranslatedText
      this.props.applyState({ translated })
    }
  }

  render() {
    const {
      data: { loading, error, translate }
    } = this.props
    if (loading) {
      console.log('Translating...')
      return (
        <div className="badge badge-dark text-center">
          <span>
            <small>Translating...</small>
          </span>
        </div>
      )
    } else if (error) {
      const err = JSON.stringify(error.message)
      return (
        <div>
          <span>
            English is the only supported target language for the detected
            source language.
          </span>
          <br />
          <i className="text-danger">{err}</i>
        </div>
      )
    }
    const response = JSON.parse(translate.response)
    const translated = response.TranslatedText
    return <i>{translated}</i>
  }
}
Translate.propTypes = {
  data: PropTypes.object,
  applyState: PropTypes.func.isRequired
}
export default graphql(translate, {
  skip: props => !props.language || !props.text || !props.text.trim().length,
  options: props => ({
    variables: {
      language: props.language,
      text: props.text.trim()
    }
  })
})(Translate)
