import React, { useState } from 'react'
import { useRegisterMutation } from '../generated/graphql'
import { useHistory } from 'react-router-dom'

interface Props {}

export const Register: React.FC<Props> = () => {
  const history = useHistory()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [register] = useRegisterMutation()

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const resp = await register({
          variables: {
            email,
            password,
          },
        })
        history.push('/')
        console.log(resp)
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

      <button type="submit">Register</button>
    </form>
  )
}
