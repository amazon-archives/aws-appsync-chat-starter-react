import React from 'react'
import { graphql } from 'react-apollo'
import polly from '../../images/polly.png'
import dictate from '../../graphql/queries/dictate'
import Sound from 'react-sound'

class Dictate extends React.Component {
  state = {
    playing: true
  }

  handleFinishedPlaying() {
    this.setState({ playing: false })
  }

  render() {
    //const { data } = this.props;
    //console.log(JSON.stringify(data));
    const {
      data: { loading, error, dictate }
    } = this.props
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
    } else if (error) {
      const err = JSON.stringify(error.message)
      return (
        <div className="alert alert-light text-center">
          <small>
            <i className="text-danger">{err}</i>
          </small>
        </div>
      )
    } else {
      const response = JSON.parse(dictate.response)
      console.log(response)
      return (
        <div>
          {this.state.playing ? (
            <div>
              <hr />
              <div className="mx-auto align-items-center card">
                <Sound
                  url={response}
                  playStatus={Sound.status.PLAYING}
                  loop={false}
                  onFinishedPlaying={() => this.handleFinishedPlaying()}
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
          ) : null}
        </div>
      )
    }
  }
}
export default graphql(dictate, {
  options: props => ({
    skip: props => !props.text,
    variables: {
      bucket: props.bucket,
      key: props.path,
      voice: props.voice,
      text: props.text
    },
    fetchPolicy: 'cache-and-network'
  })
})(Dictate)
