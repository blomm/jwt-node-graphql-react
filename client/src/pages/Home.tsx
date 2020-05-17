import React from 'react'
import { useUsersQuery } from '../generated/graphql'

interface Props {}

export const Home: React.FC<Props> = () => {
  const { loading, error, data } = useUsersQuery({
    fetchPolicy: 'network-only',
  })

  if (loading) return <p>Loading...</p>

  return (
    <>
      Users:
      <ul>
        {data?.users?.map((user) => {
          return (
            <li key={user?.id || undefined}>
              {user?.email}, {user?.id}
            </li>
          )
        })}
      </ul>
    </>
  )
}
