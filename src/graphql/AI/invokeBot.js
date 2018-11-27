import gql from "graphql-tag";

export default gql`
  query invokeBot($bot: String, $text: String) {
    invokeBot(bot: $bot, text: $text) {
      response
    }
  }
`;
