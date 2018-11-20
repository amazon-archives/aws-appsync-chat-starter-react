// eslint-disable
// this is an auto generated file. This will be overwritten

export const onCreateMessage = `subscription OnCreateMessage($messageConversationId: ID!) {
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
export const onUpdateConvoLink = `subscription OnUpdateConvoLink($convoLinkUserId: ID, $status: String) {
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
