import React from 'react'
import PropTypes from 'prop-types'
import translate from '../../images/translate.png'
import Translate from './Translate'

class TranslateCard extends React.Component {
  render() {
    return (
      <div>
        <div className="text-dark">
          <hr />
        </div>
        <span>
          <small className="float-left">Translation:</small>
        </span>
        <small>
          <button
            type="button"
            className="close text-right"
            aria-label="Close"
            onClick={this.props.closeTranslateCard}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </small>
        <br />
        <div className="p-1 card text-dark">
          <div className="row">
            <div className="col">
              <img
                src={translate}
                alt="Amazon Translate"
                className="float-left p-1"
                style={{ width: '30px', height: '30px' }}
              />
            </div>
            <div className="col">
              <small className="text-right float-right">
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm border-0"
                  onClick={this.props.dictateTranslated}
                >
                  <i className="fas fa-microphone-alt" />
                </button>
              </small>
            </div>
          </div>
          <hr />
          <small>
            <Translate
              language={this.props.selectedLanguage}
              text={this.props.text}
              applyState={this.props.applyState}
            />
          </small>
        </div>
      </div>
    )
  }
}

TranslateCard.propTypes = {
  closeTranslateCard: PropTypes.func.isRequired,
  dictateTranslated: PropTypes.func.isRequired,
  selectedLanguage: PropTypes.string.isRequired,
  applyState: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}

export default TranslateCard
