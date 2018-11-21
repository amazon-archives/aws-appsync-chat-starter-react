import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import comprehend from '../../images/comprehend.png'
import detectSentiment from '../../graphql/queries/detectSentiment'

const score = val => Number.parseFloat(val * 100).toFixed(2) + '%'
const getEmoji = Sentiment => {
  let emoji = <i className="fas fa-meh" />
  if (Sentiment === 'POSITIVE') {
    emoji = <i className="fas fa-smile" />
  } else if (Sentiment === 'NEGATIVE') {
    emoji = <i className="fas fa-frown" />
  } else if (Sentiment === 'NEUTRAL') {
    emoji = <i className="fas fa-meh" />
  } else if (Sentiment === 'MIXED') {
    emoji = <i className="fas fa-grimace" />
  }
  return emoji
}
function DetectSentiment({ data: { loading, error, detectSentiment } }) {
  if (loading) {
    return (
      <div className="container text-center mx-auto p-0">
        <div className="badge badge-dark">
          <span>
            <small>Performing Analysis...</small>
          </span>
        </div>
      </div>
    )
  } else if (error) {
    const err = JSON.stringify(error.message)
    return (
      <div className="alert alert-light text-center">
        <small>
          <i className="text-danger">{err}</i>
        </small>
      </div>
    )
  }

  const response = JSON.parse(detectSentiment.response)
  const { Sentiment, SentimentScore: scores } = response

  return (
    <div>
      <div className="p-1 card">
        <div className="card-body">
          <table className="table table-striped">
            <tbody>
              <tr>
                <td className="text-center bg-primary p-0">
                  <h1>
                    <span>{getEmoji(Sentiment)}</span>
                  </h1>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="text-center text-dark">
            <span className="alert bg-primary card-title">
              <strong>
                <span className="text-light">
                  <img
                    src={comprehend}
                    alt="Amazon Comprehend"
                    className="p-1"
                    style={{
                      width: '30px'
                    }}
                  />
                  Scores
                </span>
              </strong>
            </span>
          </div>
          <table className="table table-striped text-dark">
            <tbody>
              {['Positive', 'Negative', 'Neutral', 'Mixed'].map(s => (
                <tr key={s}>
                  <th scope="row">
                    <small>{s}</small>
                  </th>
                  <td className="text-center">
                    <span className="badge badge-primary">
                      <small>{score(scores[s])}</small>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

DetectSentiment.propTypes = {
  data: PropTypes.object.isRequired
}
export default graphql(detectSentiment, {
  skip: props => !props.text,
  options: props => ({
    variables: {
      language: props.language,
      text: props.text
    }
  })
})(DetectSentiment)
