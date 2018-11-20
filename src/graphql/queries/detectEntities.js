import gql from "graphql-tag";

export default gql`
  query detectEntities($language: String, $text: String) {
    detectEntities(language: $language, text: $text) {
      response
    }
  }
`;
