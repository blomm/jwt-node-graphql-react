import React from 'react'
import { useUsersQuery } from '../generated/graphql'

interface Props {}

export const Home: React.FC<Props> = () => {
  const { loading, error, data } = useUsersQuery({
    // set to network-only if we are testing,
    // otherwise the default will use the cache
    //fetchPolicy: 'network-only',
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Unable to view users.</p>

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
