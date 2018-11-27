import gql from 'graphql-tag'

export const onCreateMessage = gql`
  subscription OnCreateMessage($messageConversationId: ID!) {
    onCreateMessage(messageConversationId: $messageConversationId) {
      id
      content
      createdAt
      owner
      chatbot
      isSent
      file {
        bucket
        region
        key
      }
      messageConversationId
      conversation {
        id
        name
        createdAt
      }
    }
  }
`
export const onUpdateConvoLink = gql`
  subscription OnUpdateConvoLink($convoLinkUserId: ID, $status: String) {
    onUpdateConvoLink(convoLinkUserId: $convoLinkUserId, status: $status) {
      id
      name
      status
      conversation {
        id
        name
        createdAt
        associated {
          items {
            convoLinkUserId
            user {
              id
              username
            }
          }
        }
      }
    }
  }
`
