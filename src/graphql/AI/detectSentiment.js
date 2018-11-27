import gql from "graphql-tag";

export default gql`
  query detectSentiment($language: String, $text: String) {
    detectSentiment(language: $language, text: $text) {
      response
    }
  }
`;
