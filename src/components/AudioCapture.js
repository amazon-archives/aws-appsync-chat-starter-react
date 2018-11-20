import React, { Component } from "react";
import SpeechRecognition from "react-speech-recognition";
import ClickNHold from "react-click-n-hold";

const options = {
  autoStart: false
};

class AudioCapture extends Component {
  state = {
    recording: false
  };

  clickNHold() {
    console.log("Recording...");
    this.setState({ recording: true });
  }

  onRelease = finalTranscript => {
    this.sendAudio(finalTranscript);
  };

  sendAudio = audio => {
    this.props.getAudioCapture(audio);
  };

  render() {
    const {
      startListening,
      stopListening,
      resetTranscript,
      finalTranscript,
      browserSupportsSpeechRecognition
    } = this.props;
    if (!browserSupportsSpeechRecognition) {
      return (
        <button
          type="button"
          className="btn btn-primary btn-block disabled"
          style={{ width: "42px" }}
        >
          <i className="fas fa-microphone-alt-slash" />
        </button>
      );
    }
    console.log(finalTranscript);

    return (
      <div>
        <ClickNHold
          time={1}
          onStart={startListening}
          onClickNHold={() => this.clickNHold(finalTranscript)}
          onEnd={e => {
            this.onRelease(finalTranscript);
            this.setState({ recording: false }, () => {
              resetTranscript();
              stopListening();
            });
          }}
        >
          {this.state.recording ? (
            <button
              type="button"
              className="btn btn-danger btn-block"
              style={{ width: "42px" }}
            >
              <i className="fas fa-dot-circle" />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-block"
              style={{ width: "42px" }}
            >
              <i className="fas fa-microphone-alt" />
            </button>
          )}
        </ClickNHold>
      </div>
    );
  }
}

export default SpeechRecognition(options)(AudioCapture);
