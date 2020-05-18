import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
//import ApolloClient from 'apollo-boost'
import { getAccessToken, setAccessToken } from './accessToken'
import { App } from './App'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
//import { withClientState } from 'apollo-link-state';
import { ApolloLink, Observable } from 'apollo-link'

import { TokenRefreshLink } from 'apollo-link-token-refresh'
import jwt_decode from 'jwt-decode'
//
const cache = new InMemoryCache({})

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle: any
      Promise.resolve(operation)
        .then((operation: any) => {
          operation.setContext({
            // do we need to change to include 'bearer'?
            headers: {
              authorization: getAccessToken(),
            },
          })
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          })
        })
        .catch(observer.error.bind(observer))

      return () => {
        if (handle) handle.unsubscribe()
      }
    })
)

const client = new ApolloClient({
  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: 'accessToken',
      isTokenValidOrUndefined: () => {
        const token = getAccessToken()
        if (!token) return true
        const { exp } = jwt_decode(token)
        try {
          // https://github.com/auth0/jwt-decode/issues/53
          var current_time = new Date().getTime().valueOf() / 1000
          if (current_time > exp) {
            return false
          } else return true
        } catch (error) {
          return false
        }
      },
      fetchAccessToken: () => {
        return fetch('http://localhost:4000/refresh-token', {
          credentials: 'include',
          method: 'POST',
        })
      },
      handleFetch: (accessToken) => {
        setAccessToken(accessToken)
      },
      //handleResponse: (operation, accessTokenField) => (response) => {
      // here you can parse response, handle errors, prepare returned token to
      // further operations
      // returned object should be like this:
      // {
      //    access_token: 'token string here'
      // }
      //},
      handleError: (err) => {
        // full control over handling token fetch Error
        console.warn('Your refresh token is invalid. Try to relogin')
        console.error(err)

        // your custom action here
        //user.logout()
      },
    }),
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        console.error(graphQLErrors)
      }
      if (networkError) {
        console.error(networkError)
      }
    }),
    requestLink,
    new HttpLink({
      uri: 'http://localhost:4000/graphql',
      credentials: 'include',
    }),
  ]),
  cache,
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
