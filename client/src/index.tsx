import React from 'react'
import ReactDOM from 'react-dom'
import { Routes } from './Routes'
import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from 'apollo-boost'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  onError: ({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      console.log(graphQLErrors)
    }
    if (networkError) {
      console.log(networkError)
    }
  },
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>,
  document.getElementById('root')
)
