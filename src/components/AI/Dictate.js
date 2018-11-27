import React from 'react'
import { graphql } from 'react-apollo'
import polly from '../../images/polly.png'
import dictate from '../../graphql/AI/dictate'
import Sound from 'react-sound'

function Dictate({ data: { loading, error, dictate }, completed }) {
  if (loading) {
    return (
      <div className="container text-center mx-auto p-0">
        <div className="badge badge-dark">
          <span>
            <small>Retrieving Voice / Accent / Language combo...</small>
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    const err = JSON.stringify(error.message)
    return (
      <div className="alert alert-light text-center">
        <small>
          <i className="text-danger">{err}</i>
        </small>
      </div>
    )
  }

  const response = JSON.parse(dictate.response)
  console.log('Dictate >', response)
  return (
    <div>
      <hr />
      <div className="mx-auto align-items-center card">
        <Sound
          url={response}
          playStatus={Sound.status.PLAYING}
          loop={false}
          onFinishedPlaying={completed}
        />
        <div className="boxContainer">
          <div className="box box1" />
          <div className="box box2" />
          <div className="box box3" />
          <div className="box box4" />
          <div className="box box5" />
        </div>
        <img
          src={polly}
          alt="Amazon Polly"
          className="p-1 float-right align-items-right"
          style={{
            width: '30px',
            height: '30px'
          }}
        />
      </div>
    </div>
  )
}
export default graphql(dictate, {
  options: props => ({
    skip: props => !props.text,
    variables: {
      bucket: props.bucket,
      key: props.path,
      voice: props.voice,
      text: props.text
    }
  })
})(Dictate)
