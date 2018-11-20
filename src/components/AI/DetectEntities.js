import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import comprehend from '../../images/comprehend.png'
import detectEntities from '../../graphql/queries/detectEntities'

const score = val => Number.parseFloat(val * 100).toFixed(2) + '%'

function DetectEntities({ data: { loading, error, detectEntities } }) {
  if (loading) {
    return (
      <div className="container text-center mx-auto p-0">
        <div className="badge badge-dark">
          <span>
            <small>Detecting Entities...</small>
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

  const response = JSON.parse(detectEntities.response)

  if (!response.length) {
    return null
  }

  return (
    <div className="p-1 card">
      <div className="card-body">
        <div className="text-center">
          <span className="card-title alert bg-primary  text-dark">
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
                Entities
              </span>
            </strong>
          </span>
        </div>
        <table className="table table-striped text-dark">
          <thead>
            <tr>
              <th className="text-center" scope="col">
                <small>Text</small>
              </th>
              <th className="text-center" scope="col">
                <small>Type</small>
              </th>
              <th className="text-center" scope="col">
                <small>Score</small>
              </th>
            </tr>
          </thead>
          <tbody>
            {response.map((item, i) => (
              <tr key={i}>
                <td className="text-center">
                  <span key={item.Text} className="badge badge-primary">
                    <small>{item.Text}</small>
                  </span>
                </td>
                <td className="text-center">
                  <span key={item.Type} className="badge badge-primary">
                    <small>{item.Type}</small>
                  </span>
                </td>
                <td className="text-center">
                  <span key={item.Score} className="badge badge-primary">
                    <small>{score(item.Score)}</small>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
DetectEntities.propTypes = {
  data: PropTypes.object.isRequired
}
export default graphql(detectEntities, {
  skip: props => !props.text,
  options: props => ({
    variables: {
      language: props.language,
      text: props.text
    }
  })
})(DetectEntities)
