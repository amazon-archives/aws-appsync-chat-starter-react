import React, { Component } from 'react'

import './App.css'
import Amplify, { Auth } from 'aws-amplify'
import awsmobile from './aws-exports'
import { withAuthenticator } from 'aws-amplify-react'
import AWSAppSyncClient from 'aws-appsync'
import { Rehydrated } from 'aws-appsync-react'

import { ApolloProvider } from 'react-apollo'
import { ChatAppWithData } from './components/chatapp'

Amplify.configure(awsmobile)

const client = new AWSAppSyncClient({
  url: awsmobile.aws_appsync_graphqlEndpoint,
  region: awsmobile.aws_appsync_region,
  auth: {
    type: awsmobile.aws_appsync_authenticationType,
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken()
  },
  complexObjectsCredentials: () => Auth.currentCredentials()
})

class App extends Component {
  state = { session: null }

  async componentDidMount() {
    const session = await Auth.currentSession()
    this.setState({ session })
  }

  userInfo = () => {
    const session = this.state.session
    if (!session) {
      return {}
    }
    const payload = session.idToken.payload
    return { name: payload['cognito:username'], id: payload['sub'] }
  }

  render() {
    return <ChatAppWithData {...this.userInfo()} />
  }
}

const WithProvider = () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <App />
    </Rehydrated>
  </ApolloProvider>
)

export default withAuthenticator(WithProvider)
