import gql from "graphql-tag";

export default gql`
  query detectLanguage($text: String) {
    detectLanguage(text: $text) {
      response
    }
  }
`;
