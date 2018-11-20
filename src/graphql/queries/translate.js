import gql from "graphql-tag";

export default gql`
  query translate($language: String, $text: String) {
    translate(language: $language, text: $text) {
      response
    }
  }
`;
