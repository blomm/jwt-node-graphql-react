import React from 'react'
import ReactDOM from 'react-dom'
import { Routes } from './Routes'
import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from 'apollo-boost'
import { getAccessToken } from './accessToken'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
  request: (operation) => {
    operation.setContext({
      //
      headers: {
        authorization: getAccessToken(),
      },
    })
  },
})
console.log(`Access token is: ${getAccessToken()}`)

ReactDOM.render(
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>,
  document.getElementById('root')
)
