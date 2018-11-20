// eslint-disable
// this is an auto generated file. This will be overwritten

export const detectCelebs = `query DetectCelebs($bucket: String, $key: String) {
  detectCelebs(bucket: $bucket, key: $key) {
    bucket
    key
    bot
    text
    language
    voice
    response
  }
}
`
export const detectLabels = `query DetectLabels($bucket: String, $key: String) {
  detectLabels(bucket: $bucket, key: $key) {
    bucket
    key
    bot
    text
    language
    voice
    response
  }
}
`
export const detectLanguage = `query DetectLanguage($text: String) {
  detectLanguage(text: $text) {
    bucket
    key
    bot
    text
    language
    voice
    response
  }
}
`
export const detectEntities = `query DetectEntities($language: String, $text: String) {
  detectEntities(language: $language, text: $text) {
    bucket
    key
    bot
    text
    language
    voice
    response
  }
}
`
export const detectSentiment = `query DetectSentiment($language: String, $text: String) {
  detectSentiment(language: $language, text: $text) {
    bucket
    key
    bot
    text
    language
    voice
    response
  }
}
`
export const invokeBot = `query InvokeBot($bot: String, $text: String) {
  invokeBot(bot: $bot, text: $text) {
    bucket
    key
    bot
    text
    language
    voice
    response
  }
}
`
export const dictate = `query Dictate($bucket: String, $key: String, $voice: String, $text: String) {
  dictate(bucket: $bucket, key: $key, voice: $voice, text: $text) {
    bucket
    key
    bot
    text
    language
    voice
    response
  }
}
`
export const translate = `query Translate($language: String, $text: String) {
  translate(language: $language, text: $text) {
    bucket
    key
    bot
    text
    language
    voice
    response
  }
}
`
export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
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

export const getConvo = `query GetConvo($id: ID!, $nextToken: String) {
  getConvo(id: $id) {
    id
    messages(sortDirection: DESC, limit: 20, nextToken: $nextToken) {
      nextToken
      items {
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
  }
}
`

export const searchMessages = `query SearchMessages(
  $filter: SearchableMessageFilterInput
  $sort: SearchableMessageSortInput
  $limit: Int
  $nextToken: Int
) {
  searchMessages(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
  }
}
`
export const searchUsers = `query SearchUsers(
  $filter: SearchableUserFilterInput
  $sort: SearchableUserSortInput
  $limit: Int
  $nextToken: Int
) {
  searchUsers(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      username
      registered
      userConversations {
        items {
          id
          name
          status
          convoLinkUserId
        }
        nextToken
      }
    }
    nextToken
  }
}
`
export const searchConvoLinks = `query SearchConvoLinks(
  $filter: SearchableConvoLinkFilterInput
  $sort: SearchableConvoLinkSortInput
  $limit: Int
  $nextToken: Int
) {
  searchConvoLinks(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      status
      convoLinkUserId
      user {
        id
        username
        registered
      }
      conversation {
        id
        name
        createdAt
      }
    }
    nextToken
  }
}
`
