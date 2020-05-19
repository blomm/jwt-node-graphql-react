import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import { useMeQuery, useLogoutMutation } from '../generated/graphql'
import { setAccessToken } from '../accessToken'

const Header: React.FC = () => {
  const { data, loading, error } = useMeQuery({ errorPolicy: 'all' })
  const [logout, { client }] = useLogoutMutation()

  if (loading) return <div>Loading...</div>
  if (error)
    return (
      <header>
        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </div>
      </header>
    )

  return (
    <header>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </div>
      <div className="user-info">
        <div>
          {!loading && data && data.me ? (
            <>
              <div>Logged in as: {data?.me?.email}</div>
              <button
                onClick={async () => {
                  try {
                    // this shoddy try catch is a temporary fix
                    // https://github.com/apollographql/apollo-client/issues/6070
                    await logout()
                    // clears the access token on the client
                    setAccessToken('')
                    // reset values that might have been put into the store
                    await client?.resetStore()
                  } catch (error) {
                    console.log(error)
                  }
                }}
              >
                logout
              </button>
            </>
          ) : null}
          {/* {!loading && !error && data && data.me ? (
            <div className="logged-in">
              <div>Logged in as: {data?.me?.email}</div>
              <button
                onClick={async () => {
                  try {
                    await logout()
                    // clears the access token on the client
                    setAccessToken('')
                    // reset values that might have been put into the store
                    await client?.resetStore()
                  } catch (error) {
                    console.log(error)
                  }
                  // removes the cookie on the server side because we can't on the client
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div>not logged in</div>
          )} */}
        </div>
      </div>
    </header>
  )
}

export default Header
