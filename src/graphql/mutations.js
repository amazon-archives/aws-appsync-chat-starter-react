// eslint-disable
// this is an auto generated file. This will be overwritten

export const createConvo = `mutation CreateConvo($input: CreateConversationInput!) {
  createConvo(input: $input) {
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
`
export const createMessage = `mutation CreateMessage($input: CreateMessageInput!) {
  createMessage(input: $input) {
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
export const registerUser = `mutation RegisterUser($input: CreateUserInput!) {
  registerUser(input: $input) {
    id
    username
    registered
    userConversations {
      items {
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
  }
}
`
export const createConvoLink = `mutation createConvoLink($userId: ID!, $convoId: ID!, $name: String!) {
  createConvoLink(
    input: {
      convoLinkUserId: $userId
      convoLinkConversationId: $convoId
      name: $name
      status: "CREATING"
    }
  ) {
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
export const updateConvoLink = `mutation updateConvoLink($id: ID!) {
  updateConvoLink(input: { id: $id, status: "READY" }) {
    id
    name
    convoLinkUserId
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
