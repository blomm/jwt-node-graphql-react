import React, { useState } from 'react'
import { useLoginMutation } from '../generated/graphql'
import { useHistory } from 'react-router-dom'
import { setAccessToken } from '../accessToken'

interface Props {}

export const Login: React.FC<Props> = () => {
  const history = useHistory()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login] = useLoginMutation()

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const resp = await login({
          variables: {
            email,
            password,
          },
        })
        if (resp && resp.data) {
          setAccessToken(resp.data.login?.accessToken || '')
        }
        history.push('/')
      }}
    >
      <div>
        <input
          value={email}
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit">Login</button>
    </form>
  )
}
