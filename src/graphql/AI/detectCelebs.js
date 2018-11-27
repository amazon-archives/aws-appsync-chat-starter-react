import gql from "graphql-tag";

export default gql`
  query detectCelebs($bucket: String, $key: String) {
    detectCelebs(bucket: $bucket, key: $key) {
      response
    }
  }
`;
