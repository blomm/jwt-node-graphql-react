import React, { useEffect, useState } from 'react'
import { Routes } from './Routes'
import { setAccessToken } from './accessToken'

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // get a new access token using the refresh token
    fetch('http://localhost:4000/refresh-token', {
      credentials: 'include',
      method: 'POST',
    }).then(async (x) => {
      const { accessToken } = await x.json()
      console.log(`AccessTOKEN = ${accessToken}`)
      setAccessToken(accessToken)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div>loading...</div>
  }

  return <Routes />
}
