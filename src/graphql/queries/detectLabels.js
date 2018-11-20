import gql from "graphql-tag";

export default gql`
  query detectLabels($bucket: String, $key: String) {
    detectLabels(bucket: $bucket, key: $key) {
      response
    }
  }
`;
