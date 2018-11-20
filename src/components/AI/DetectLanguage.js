import React from "react";
import { graphql } from "react-apollo";
import detectLanguage from "../../graphql/queries/detectLanguage";

class DetectLanguage extends React.Component {
  sendLanguage = language => {
    this.props.getDetectedLanguage(language);
  };
  componentDidMount() {
    const {
      data: { loading, error, detectLanguage }
    } = this.props;
    if (loading) {
      console.log("Detecting Language... " + loading);
    } else if (error) {
      console.log(error);
    } else {
      const response = JSON.parse(detectLanguage.response);
      const language = response[0].LanguageCode;
      this.sendLanguage(language);
    }
  }
  render() {
    //const { data } = this.props;
    //console.log(JSON.stringify(data));
    return null;
  }
}
export default graphql(detectLanguage, {
  skip: props => !props.text,
  options: props => ({
    variables: {
      text: props.text
    },
    fetchPolicy: "cache-and-network"
  })
})(DetectLanguage);
