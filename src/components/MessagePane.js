import React from 'react'
import PropTypes from 'prop-types'
import Message from './Message'
import { Scrollbars } from 'react-custom-scrollbars'
import { onCreateMessage } from '../graphql/subscriptions'
import { Subject, of, from } from 'rxjs'
import { pairwise, filter, exhaustMap } from 'rxjs/operators'
import WordCloud from 'react-d3-cloud'
import sizeMe from 'react-sizeme'
import gql from 'graphql-tag'

const SCROLL_THRESHOLD = 0.25

const fontSizeMapper = word => Math.log2(word.value) * 5
const rotate = word => word.value % 360
const worldCloud = [
  { text: 'GraphQL', value: 15000 },
  { text: 'AI', value: 2000 },
  { text: 'Sentiment Analysis', value: 800 },
  { text: 'ChatBots', value: 10000 },
  { text: 'Translation', value: 300 },
  { text: 'Media', value: 150 },
  { text: 'Image Rekognition', value: 350 },
  { text: 'Chuck Norris', value: 350 },
  { text: 'Movies', value: 250 },
  { text: 'English', value: 100 },
  { text: 'Speech Recognition', value: 250 },
  { text: 'Celebrity ReKognition', value: 200 },
  { text: 'French', value: 100 },
  { text: 'Mandarin', value: 100 },
  { text: 'Spanish', value: 100 },
  { text: 'Cloud', value: 500 },
  { text: 'Real-Time', value: 700 },
  { text: 'Offline', value: 700 },
  { text: 'Lex', value: 800 },
  { text: 'Polly', value: 800 },
  { text: 'Comprehend', value: 800 },
  { text: 'Translate', value: 800 },
  { text: 'AppSync', value: 800 },
  { text: 'DynamoDB', value: 800 },
  { text: 'Elasticsearch', value: 800 },
  { text: 'Welcome', value: 3500 },
  { text: 'Cognito', value: 800 },
  { text: 'Search', value: 500 },
  { text: 'Serverless', value: 20000 },
  { text: 'AWS', value: 50000 },
  { text: '欢迎光临', value: 1500 },
  { text: 'Bienvenue', value: 2500 },
  { text: 'Bem-vindo', value: 1500 },
  { text: 'Bienvenido', value: 1500 },
  { text: 'NoSQL', value: 2500 },
  { text: 'Screen', value: 5500 },
  { text: 'Mobility', value: 7500 },
  { text: 'Progressive', value: 9500 },
  { text: 'PWAs', value: 9500 },
  { text: 'Data', value: 90500 },
  { text: 'Amplify', value: 10500 }
]

class MessagePane extends React.Component {
  state = {
    width: 691,
    height: 650
  }
  scrollbarsRef = React.createRef()
  subject = new Subject()
  obs = this.subject.asObservable()

  componentDidMount() {
    console.log('MessagePane - componentDidMount')
    if (this.props.conversation) {
      console.log('MessagePane - componentDidMount - subscribe')
      this.unsubscribe = this.createSubForConvoMsgs()
    }
    this.obs
      .pipe(
        pairwise(),
        filter(this.isScrollingUpPastThreshold),
        exhaustMap(this.loadMoreMessages)
      )
      .subscribe(_ => {})
    this.getDimensions(this.props.size)
  }

  componentDidUpdate(prevProps, prevState) {
    const currConvo = this.props.conversation || {}
    const prevConvo = prevProps.conversation || {}
    if (currConvo && prevConvo.id !== currConvo.id) {
      if (this.unsubscribe) {
        console.log('MessagePane - componentDidUpdate - unsubscribe')
        this.unsubscribe()
      }
      console.log('MessagePane - componentDidUpdate - subscribe')
      this.unsubscribe = this.createSubForConvoMsgs()
    }
    const prevMsgs = prevProps.messages || []
    const messages = this.props.messages || []
    if (prevMsgs.length !== messages.length) {
      const p0 = prevMsgs[0]
      const m0 = messages[0]
      if ((p0 && m0 && p0.id !== m0.id) || (!p0 && m0)) {
        this.scrollbarsRef.current.scrollToBottom()
      }
    }
  }

  componentWillUnmount() {
    console.log('MessagePane - componentWillUnmount')
    if (this.unsubscribe) {
      console.log('MessagePane - componentDidUpdate - unsubscribe')
      this.unsubscribe()
    }
  }

  getDimensions(size) {
    console.log(size)
    if (size.width > 750) {
      this.setState({ height: size.height })
    } else {
      this.setState({ width: size.width, height: size.height })
    }
  }

  isScrollingUpPastThreshold = ([prev, curr]) => {
    // console.log('isScrolling', prev, curr)
    const result = (prev.top > curr.top) & (curr.top < SCROLL_THRESHOLD)
    if (result) {
      console.log('Should fetch more messages')
    }
    return result
  }

  loadMoreMessages = () => {
    const { fetchMore, nextToken } = this.props
    if (!nextToken) {
      return of(true)
    }
    const result = fetchMore({
      variables: { nextToken: nextToken },
      updateQuery: (prev, { fetchMoreResult: data }) => {
        const update = {
          getConvo: {
            ...prev.getConvo,
            messages: {
              ...prev.getConvo.messages,
              nextToken: data.getConvo.messages.nextToken,
              items: [
                ...prev.getConvo.messages.items,
                ...data.getConvo.messages.items
              ]
            }
          }
        }
        return update
      }
    })
    return from(result)
  }

  createSubForConvoMsgs = () => {
    const {
      subscribeToMore,
      conversation: { id: convoId },
      userId
    } = this.props
    return subscribeToMore({
      document: gql`
        ${onCreateMessage}
      `,
      variables: { messageConversationId: convoId },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: { onCreateMessage: newMsg }
          }
        }
      ) => {
        console.log('updateQuery on message subscription', prev, newMsg)
        if (newMsg.chatbot) {
          prev.getConvo.messages.items.forEach(function iterator(item, i) {
            if (newMsg.content === item.content) {
              console.log(
                'repeated chatbot messages on position ' +
                  i +
                  ': ' +
                  item.content
              )
            }
          })
        }
        if (newMsg.owner === userId && !newMsg.chatbot) {
          console.log('skipping own message')
          return
        }

        const current = {
          getConvo: {
            ...prev.getConvo,
            messages: {
              ...prev.getConvo.messages,
              items: [newMsg, ...prev.getConvo.messages.items]
            }
          }
        }
        return current
      }
    })
  }

  render() {
    const { messages, conversation, userMap, userId } = this.props
    return (
      <div className="pane bg-ligthergray">
        {conversation ? (
          <Scrollbars
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            onScrollFrame={values => this.subject.next(values)}
            ref={this.scrollbarsRef}
          >
            <div className="messageList d-flex flex-column">
              {[...messages].reverse().map((msg, idx, arr) => (
                <Message
                  msg={msg}
                  username={userMap[msg.owner]}
                  ownsPrev={idx > 0 && arr[idx - 1].owner === msg.owner}
                  isUser={msg.owner === userId}
                  key={msg.id}
                />
              ))}
            </div>
          </Scrollbars>
        ) : (
          <div className="mx-auto text-center">
            <WordCloud
              width={this.state.width}
              height={this.state.height}
              data={worldCloud}
              fontSizeMapper={fontSizeMapper}
              rotate={rotate}
              font="Amazon Ember"
            />
          </div>
        )}
      </div>
    )
  }
}
MessagePane.propTypes = {
  conversation: PropTypes.object,
  userId: PropTypes.string,
  messages: PropTypes.array.isRequired,
  userMap: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func,
  fetchMore: PropTypes.func,
  nextToken: PropTypes.string
}
export default sizeMe({ monitorHeight: true })(MessagePane)
