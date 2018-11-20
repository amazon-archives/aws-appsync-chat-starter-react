import gql from "graphql-tag";

export default gql`
  query dictate($bucket: String, $key: String, $voice: String, $text: String) {
    dictate(bucket: $bucket, key: $key, voice: $voice, text: $text) {
      response
    }
  }
`;
