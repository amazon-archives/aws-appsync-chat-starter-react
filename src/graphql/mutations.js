import gql from 'graphql-tag'

export const createConvo = gql`
  mutation CreateConvo($input: CreateConversationInput!) {
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
export const createMessage = gql`
  mutation CreateMessage($input: CreateMessageInput!) {
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
export const registerUser = gql`
  mutation RegisterUser($input: CreateUserInput!) {
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
export const createConvoLink = gql`
  mutation createConvoLink($userId: ID!, $convoId: ID!, $name: String!) {
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
export const updateConvoLink = gql`
  mutation updateConvoLink($id: ID!) {
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
