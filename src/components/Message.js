import React from "react";
import PropTypes from "prop-types";
import Popover, { ArrowContainer } from "react-tiny-popover";
import moment from "moment";
import Labels from "./AI/DetectLabels";
import Celebs from "./AI/DetectCelebs";
import Dictate from "./AI/Dictate";
import AIMenu from "./AI/MenuDropDown";
import TranslateCard from "./AI/TranslateCard";
import Bot from "./AI/Bot";
import DetectSentiment from "./AI/DetectSentiment";
import DetectEntities from "./AI/DetectEntities";
import InvokeBot from "./AI/InvokeBot";
import lex from "../images/lex.png";
import chuck from "../images/chuck.jpg";
import uuid from "uuid/v4";
import { Auth, Storage, Cache } from "aws-amplify";
import awsmobile from "../aws-exports";

const VISIBILITY = "protected";

Storage.configure({ level: "protected" });

function formatDate(date) {
  return moment(date).calendar(null, {
    sameDay: "LT",
    lastDay: "MMM D LT",
    lastWeek: "MMM D LT",
    sameElse: "l"
  });
}

const BOTS = {
  CHUCKBOT: "ChuckBot",
  MOVIEBOT: "MovieBot"
};

const voiceMap = {
  en: "Matthew",
  zh: "Zhiyu",
  pt: "Ricardo",
  fr: "Mathieu",
  es: "Miguel"
};

export default class Message extends React.Component {
  state = {
    fileUrl: undefined,
    bucket: awsmobile.aws_user_files_s3_bucket,
    key: null,
    popover: false,
    toDictate: null,
    translated: null,
    selectedLanguage: null,
    originalLanguage: null,
    chuckbot: null,
    bot: null,
    voice: null,
    dictate: false,
    detectLanguage: false,
    dropdownOpen: false,
    sentiment: false
  };
  componentDidMount() {
    const { msg: currMsg } = this.props;
    const now = new Date().getTime();
    this.checkFileUrl();
    // console.log('mounted since, ', now - Date.parse(currMsg.createdAt))
    if (now - Date.parse(currMsg.createdAt) < 200) {
      if (currMsg.content.includes("@chuckbot")) {
        this.setState({ bot: BOTS.CHUCKBOT, chuckbot: true });
      }
      if (currMsg.content.includes("@moviebot")) {
        this.setState({ bot: BOTS.MOVIEBOT });
      }
    } else {
      this.setState({ bot: null });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { msg: prevMsg } = prevProps;
    const { msg: currMsg } = this.props;
    if (
      prevMsg.file &&
      prevMsg.file.key === null &&
      currMsg.file &&
      currMsg.file.key
    ) {
      this.checkFileUrl();
    }
  }

  checkFileUrl() {
    const { file } = this.props.msg;
    if (file && file.key) {
      const fileUrl = Cache.getItem(file.key);
      if (fileUrl) {
        console.log(`Retrieved cache url for ${file.key}: ${fileUrl}`);
        this.setState({ key: file.key });
        return this.setState({ fileUrl });
      }

      const [, identityIdWithSlash, keyWithoutPrefix] =
        /([^/]+\/){2}(.*)$/.exec(file.key) || file.key;
      const identityId = identityIdWithSlash.replace(/\//g, "");
      console.log(
        `Retrieved new key for ${file.key}: ${identityId} - ${keyWithoutPrefix}`
      );
      Storage.get(keyWithoutPrefix, { identityId }).then(fileUrl => {
        console.log(`New url for ${file.key}: ${fileUrl}`);
        const expires = moment()
          .add(14, "m")
          .toDate()
          .getTime();
        Cache.setItem(file.key, fileUrl, { expires });
        this.setState({ fileUrl });
      });
    }
  }

  getImageLabels(message) {
    this.setState({ popover: !this.state.popover, key: message.file.key });
  }

  dictate = async () => {
    const message = this.props.msg.content;
    const { identityId } = await Auth.currentCredentials();
    const key = `${VISIBILITY}/${identityId}/${uuid()}`;
    const voice = voiceMap[this.state.originalLanguage] || "Russel";
    this.setState({
      key: key,
      voice: voice,
      toDictate: message,
      dictate: true
    });
  };

  dictateTranslated = async () => {
    const message = this.state.translated;
    console.log("Translated Text to Dictate:" + message);
    const { identityId } = await Auth.currentCredentials();
    const key = `${VISIBILITY}/${identityId}/${uuid()}`;
    const voice = voiceMap[this.state.selectedLanguage] || "Russel";
    this.setState({
      key: key,
      voice: voice,
      toDictate: message,
      dictate: true
    });
  };

  comprehend = () => {
    this.setState({ sentiment: true });
  };

  getDetectedLanguage = language => {
    console.log("Detected Language from DetectLanguage Component: " + language);
  };

  getTranslated = translated => {
    console.log("Translated Text from Translate Component: " + translated);
  };

  setLanguageCode = code => {
    this.setState({ originalLanguage: code });
  };

  toggleDropDown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  closeTranslateCard = () => {
    this.setState({ selectedLanguage: null, dictate: false });
  };

  applyState = state => {
    this.setState(state);
  };

  render() {
    const { msg, username, ownsPrev, isUser } = this.props;
    const { fileUrl, bucket, key, voice, toDictate, bot, popover } = this.state;

    const outerClassName =
      "d-inline-flex" + (isUser && !msg.chatbot ? "" : " flex-row-reverse");
    const innerClassName =
      "chatMsg shadow-sm pt-1 pb-1 px-2 rounded m-2 " +
      (msg.chatbot
        ? "bg-info text-white"
        : isUser
        ? "bg-ember text-white"
        : "bg-ampligygray text-white");
    const checkStatusClassName =
      "ml-1 " + (msg.isSent ? "text-blue" : "text-muted");

    return (
      <div className={outerClassName}>
        <div className={innerClassName}>
          <div className="row">
            {!ownsPrev ? (
              <div className="col font-weight-bold">{username}</div>
            ) : null}
            <div className="small col d-block text-right">
              <AIMenu
                msg={msg}
                dropdownOpen={this.state.dropdownOpen}
                toggleDropDown={this.toggleDropDown}
                setLanguageCode={this.setLanguageCode}
                setTranslation={this.applyState}
                comprehend={this.comprehend}
                doBot={this.applyState}
                dictate={this.dictate}
              />
            </div>
          </div>
          {msg.file &&
            (fileUrl ? (
              <div>
                <div className="highlight">
                  <img
                    alt="awesome"
                    src={fileUrl}
                    className="rounded msg-image"
                    onClick={() => this.getImageLabels(msg)}
                    id="ImgPopover"
                  />
                </div>
                <div>
                  <Popover
                    isOpen={popover}
                    position={["top", "bottom", "right", "left"]}
                    disableReposition
                    content={({ position, targetRect, popoverRect }) => (
                      <ArrowContainer
                        position={position}
                        targetRect={targetRect}
                        popoverRect={popoverRect}
                        arrowColor={"white"}
                        arrowSize={10}
                        arrowStyle={{ opacity: 1 }}
                      >
                        <div>
                          <div className="p-3 bg-light text-dark">
                            <span className="text-left">Image Rekognition</span>
                            <button
                              type="button"
                              className="close text-right"
                              aria-label="Close"
                              onClick={() => this.setState({ popover: false })}
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div
                            className="scrollable"
                            style={{
                              backgroundColor: "white",
                              opacity: 1,
                              width: "300px"
                            }}
                            onClick={() => this.setState({ popover: !popover })}
                          >
                            <div className="mx-auto center">
                              <Celebs bucket={bucket} path={key} />
                              <Labels bucket={bucket} path={key} />
                            </div>
                          </div>
                        </div>
                      </ArrowContainer>
                    )}
                  >
                    <div />
                  </Popover>
                </div>
              </div>
            ) : (
              <div className="file-placeholder bg-dark border-dark rounded" />
            ))}
          <div>
            {msg.chatbot ? (
              <div>
                <div className="d-flex">
                  <div className="col-1 bg-light d-flex align-items-center p-0">
                    <span className="mx-auto text-dark">
                      <i className="fas fa-robot" />
                    </span>
                  </div>
                  <div className="col-11">
                    <strong>
                      <img
                        src={lex}
                        alt="Amazon Lex"
                        className="p-1"
                        style={{
                          width: "30px"
                        }}
                      />
                      {msg.content.match(/\[(\w+)\]/)[1]}
                    </strong>
                    <div>
                      {msg.content.startsWith(`[${BOTS.MOVIEBOT}]`) ? (
                        <InvokeBot bot={BOTS.MOVIEBOT} text={msg.content} />
                      ) : (
                        msg.content.match(/\[\w+\]\s*(.*)/)[1]
                      )}
                      {msg.content.startsWith(`[${BOTS.CHUCKBOT}]`) ? (
                        <div className="col-2 p-0 mx-auto text-center">
                          <img
                            src={chuck}
                            className="rounded-circle"
                            alt="Chuck Norris Facts"
                            style={{
                              width: "65px"
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              msg.content
            )}
          </div>
          {this.state.selectedLanguage ? (
            <TranslateCard
              closeTranslateCard={this.closeTranslateCard}
              dictateTranslated={this.dictateTranslated}
              selectedLanguage={this.state.selectedLanguage}
              applyState={this.applyState}
              text={msg.content}
            />
          ) : null}
          {this.state.dictate && (
            <Dictate
              bucket={bucket}
              path={key}
              voice={voice}
              text={toDictate}
            />
          )}
          <div>
            {this.state.sentiment && (
              <div>
                <div className="text-dark">
                  <hr />
                </div>
                <span>
                  <small>Sentiment Analysis:</small>
                </span>{" "}
                <small>
                  <button
                    type="button"
                    className="close text-right"
                    aria-label="Close"
                    onClick={() => this.setState({ sentiment: false })}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </small>
                <br />
                <DetectSentiment
                  language={this.state.originalLanguage}
                  text={msg.content}
                />
                <DetectEntities
                  language={this.state.originalLanguage}
                  text={msg.content}
                />
              </div>
            )}
            {bot && (
              <div>
                <small>
                  <button
                    type="button"
                    className="close text-right"
                    aria-label="Close"
                    onClick={() => this.setState({ bot: false })}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </small>
                <Bot botName={bot} msg={msg} update={this.applyState} />
              </div>
            )}
          </div>
          <div className="small d-block text-right">
            {formatDate(msg.createdAt)}
            <span className={checkStatusClassName}>
              <i className="fas fa-check" />
            </span>
          </div>
        </div>
      </div>
    );
  }
}

Message.propTypes = {
  msg: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  ownsPrev: PropTypes.bool.isRequired,
  isUser: PropTypes.bool.isRequired
};
